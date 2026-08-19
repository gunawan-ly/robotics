/**
 * Tiny in-app event bus. Both the development simulator and the future
 * 9Router observation layer (backend -> SSE/WebSocket -> hook) emit into it.
 * Robots only need to subscribe; they never know the event source.
 */
import type { ProviderEvent, RouterEventListener } from "./eventTypes";

const listeners = new Set<RouterEventListener>();

export function subscribeRouterEvents(listener: RouterEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitRouterEvent(event: ProviderEvent): void {
  const snapshot = [...listeners];
  for (const listener of snapshot) {
    try {
      listener(event);
    } catch (err) {
      console.error("[router-events] listener failed", err);
    }
  }
}

/** Convenience emitters used by the dev simulator. */
export function emitStart(model: string, provider: string | null = null): void {
  emitRouterEvent({ type: "provider_request_started", provider, model, timestamp: Date.now() });
}

export function emitStop(model: string, provider: string | null = null): void {
  emitRouterEvent({ type: "provider_request_completed", provider, model, timestamp: Date.now() });
}
