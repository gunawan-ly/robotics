"use client";

import { useEffect, useRef, useState } from "react";

import { PROVIDERS } from "@/config/providers";
import { emitRouterEvent, subscribeRouterEvents } from "@/events/eventBus";
import { resolveProvider } from "@/events/providerResolver";

export interface RouterStatus {
  mode: "live" | "dev";
  connected: boolean;
  checked: boolean;
}

/**
 * Subscribes to normalized router events and exposes:
 *   active: { [providerId]: activeRequestCount }
 *   status: connection status reported by the backend.
 *
 * In "live" mode the backend's 9Router observer feeds the same in-app event
 * bus through the /api/events SSE stream. In "dev" mode only the development
 * simulator produces events.
 */
export function useRouterEvents() {
  const [active, setActive] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<RouterStatus>({ mode: "dev", connected: false, checked: false });
  const counts = useRef<Record<string, number>>({});
  const eventSource = useRef<EventSource | null>(null);

  useEffect(() => {
    const applyEvent = (event: { type: string; provider: string | null; model: string }) => {
      const provider = resolveProvider(event.model, PROVIDERS);
      if (!provider) return;
      const c = { ...counts.current };
      if (event.type === "provider_request_started") {
        c[provider.id] = (c[provider.id] ?? 0) + 1;
      } else if (event.type === "provider_request_completed") {
        c[provider.id] = Math.max(0, (c[provider.id] ?? 0) - 1);
      } else {
        return;
      }
      if (c[provider.id] === 0) delete c[provider.id];
      counts.current = c;
      setActive(c);
    };

    // In-app bus: dev simulator (and any future local sources).
    const unsubscribeBus = subscribeRouterEvents(applyEvent);

    fetch("/api/router/status")
      .then((res) => res.json())
      .then((s: { mode?: string; connected?: boolean }) => {
        const mode = s.mode === "live" ? "live" : "dev";
        setStatus({ mode, connected: Boolean(s.connected) && mode === "live", checked: true });

        if (mode === "live") {
          const es = new EventSource("/api/events");
          eventSource.current = es;
          es.addEventListener("provider", (ev) => {
            try {
              // Feed the in-app bus: robots and this hook both subscribe there.
              emitRouterEvent(JSON.parse((ev as MessageEvent).data));
            } catch {
              /* skip malformed */
            }
          });
          es.addEventListener("status", (ev) => {
            try {
              const st = JSON.parse((ev as MessageEvent).data);
              setStatus({ mode: "live", connected: Boolean(st.connected), checked: true });
            } catch {
              /* skip malformed */
            }
          });
          es.onerror = () => {
            setStatus((prev) => ({ ...prev, connected: false }));
          };
        }
      })
      .catch(() => setStatus({ mode: "dev", connected: false, checked: true }));

    return () => {
      unsubscribeBus();
      eventSource.current?.close();
      eventSource.current = null;
    };
  }, []);

  return { active, status };
}
