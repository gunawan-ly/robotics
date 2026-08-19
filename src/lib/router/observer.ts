/**
 * 9Router realtime observer (Phase 4) — PRD §14/§16, AGENTS.md §12.
 *
 * Source of truth (verified against decolua/9router v0.5.x source):
 *   9Router exposes an unauthenticated SSE endpoint
 *       GET <base>/api/usage/stream
 *   that pushes a stats snapshot on connect and then emits updates whenever
 *   request activity changes:
 *     - request START  -> stats.pending.byModel["<model> (<provider>)"] increases
 *                         (trackPendingRequest(model, provider, id, true))
 *     - request END    -> the count decreases and the finished entry appears
 *                         in stats.recentRequests (from usageHistory)
 *   The dashboard API lives at the server root (not under /v1), so a
 *   ROUTER_API_URL like "https://host/v1" is normalized to "https://host".
 *
 * This module diffs pending counts per requested model and re-emits them as
 * normalized ProviderEvents (START/STOP) — the same events the dev simulator
 * emits — so the frontend never learns 9Router internals.
 */
import type { ProviderEvent } from "@/events/eventTypes";
import { getRouterBase } from "./config";

export interface ObserverStatus {
  mode: "live" | "dev";
  connected: boolean;
  lastError: string | null;
}

type EventListener = (event: ProviderEvent) => void;
type StatusListener = (status: ObserverStatus) => void;

interface ObserverState {
  started: boolean;
  connecting: boolean;
  controller: AbortController | null;
  status: ObserverStatus;
  counts: Map<string, number>;
  lastDataAt: number;
  attempts: number;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  livenessTimer: ReturnType<typeof setInterval> | null;
  eventListeners: Set<EventListener>;
  statusListeners: Set<StatusListener>;
}

// globalThis so dev-mode module reloads never duplicate the connection
const G = globalThis as unknown as { __routerObserver?: ObserverState };

function getState(): ObserverState {
  if (!G.__routerObserver) {
    G.__routerObserver = {
      started: false,
      connecting: false,
      controller: null,
      status: { mode: "dev", connected: false, lastError: null },
      counts: new Map(),
      lastDataAt: 0,
      attempts: 0,
      reconnectTimer: null,
      livenessTimer: null,
      eventListeners: new Set(),
      statusListeners: new Set(),
    };
  }
  return G.__routerObserver;
}

function setStatus(partial: Partial<ObserverStatus>) {
  const s = getState();
  s.status = { ...s.status, ...partial };
  for (const l of [...s.statusListeners]) {
    try {
      l(s.status);
    } catch {
      /* ignore */
    }
  }
}

function emitStart(model: string, provider: string | null, times: number) {
  for (let i = 0; i < times; i++) {
    emit({ type: "provider_request_started", provider, model, timestamp: Date.now() });
  }
}

function emitStop(model: string, times: number) {
  for (let i = 0; i < times; i++) {
    emit({ type: "provider_request_completed", provider: null, model, timestamp: Date.now() });
  }
}

function emit(event: ProviderEvent) {
  const s = getState();
  for (const l of [...s.eventListeners]) {
    try {
      l(event);
    } catch {
      /* ignore */
    }
  }
}

/** "oc/deepseek-v4-flash-free (deepseek)" -> { model, provider } */
function parseModelKey(key: string): { model: string; provider: string | null } {
  const m = key.match(/^(.*) \((.*)\)$/);
  if (m) return { model: m[1].trim(), provider: m[2].trim() || null };
  return { model: key.trim(), provider: null };
}

function handleStats(payload: unknown) {
  const s = getState();
  s.lastDataAt = Date.now();
  const stats = (payload ?? {}) as {
    pending?: { byModel?: Record<string, number> };
    activeRequests?: { model?: string; provider?: string; count?: number }[];
  };

  // Aggregate pending counts by requested model.
  const next = new Map<string, number>();
  for (const [key, count] of Object.entries(stats.pending?.byModel ?? {})) {
    if (typeof count !== "number" || count <= 0) continue;
    const { model } = parseModelKey(key);
    if (!model) continue;
    next.set(model, (next.get(model) ?? 0) + count);
  }
  // activeRequests is the same data in array form; merge for robustness.
  for (const a of stats.activeRequests ?? []) {
    if (a.model && (a.count ?? 0) > 0) {
      next.set(a.model, Math.max(next.get(a.model) ?? 0, a.count ?? 0));
    }
  }

  // Diff against the previous snapshot -> START/STOP events.
  for (const [model, count] of next) {
    const prev = s.counts.get(model) ?? 0;
    if (count > prev) {
      emitStart(model, null, count - prev);
    } else if (count < prev) {
      emitStop(model, prev - count);
    }
  }
  for (const [model, prev] of s.counts) {
    if (!next.has(model) && prev > 0) emitStop(model, prev);
  }
  s.counts = next;
}

function scheduleReconnect() {
  const s = getState();
  if (s.reconnectTimer) clearTimeout(s.reconnectTimer);
  const delay = Math.min(30_000, 2_000 * Math.pow(2, Math.min(s.attempts, 4)));
  s.reconnectTimer = setTimeout(() => {
    void connect();
  }, delay);
}

async function connect() {
  const s = getState();
  const base = getRouterBase();
  if (!base) return;

  if (s.connecting) return;
  s.connecting = true;
  if (s.controller) s.controller.abort();

  const url = `${base}/api/usage/stream`;
  const controller = new AbortController();
  s.controller = controller;

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "text/event-stream", "Cache-Control": "no-cache" },
    });
    if (!res.ok || !res.body) {
      throw new Error(`SSE HTTP ${res.status}`);
    }
    s.attempts = 0;
    setStatus({ connected: true, lastError: null });
    s.lastDataAt = Date.now();

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) >= 0) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === ":ping") continue;
          try {
            handleStats(JSON.parse(payload));
          } catch {
            /* skip malformed frame */
          }
        }
      }
    }
    throw new Error("stream closed");
  } catch (err) {
    if (controller.signal.aborted) {
      // intentional abort (reconnect cycle) — skip
    } else {
      s.attempts += 1;
      setStatus({ connected: false, lastError: err instanceof Error ? err.message : String(err) });
    }
  } finally {
    s.connecting = false;
    if (s.controller === controller) {
      scheduleReconnect();
    }
  }
}

/** Idempotent singleton start; safe to call from every API route. */
export function ensureObserverStarted(): ObserverStatus {
  const s = getState();
  if (!s.started) {
    s.started = true;
    setStatus({ mode: getRouterBase() ? "live" : "dev", connected: false, lastError: null });
    // Liveness guard: if no SSE frame arrives for 60s, force a reconnect.
    s.livenessTimer = setInterval(() => {
      if (s.status.connected && Date.now() - s.lastDataAt > 60_000) {
        s.controller?.abort();
      }
    }, 15_000);
    s.livenessTimer.unref?.();
    if (getRouterBase()) {
      void connect();
    }
  }
  return s.status;
}

export function getObserverStatus(): ObserverStatus {
  return ensureObserverStarted();
}

export function subscribeObserverEvents(listener: EventListener): () => void {
  const s = getState();
  ensureObserverStarted();
  s.eventListeners.add(listener);
  return () => s.eventListeners.delete(listener);
}

export function subscribeObserverStatus(listener: StatusListener): () => void {
  const s = getState();
  ensureObserverStarted();
  s.statusListeners.add(listener);
  listener(s.status);
  return () => s.statusListeners.delete(listener);
}
