/**
 * 9Router observation adapter — Phase 4 scaffold (PRD §14, AGENTS.md §12).
 *
 * DO NOT assume a specific monitoring/log endpoint exists. Before activating
 * this layer the developer must inspect the user's actual 9Router version and
 * its available APIs, then pick the most reliable mechanism:
 *
 *   1. detecting request start,
 *   2. identifying the selected model/provider,
 *   3. detecting request completion.
 *
 * Planned wiring: backend observes 9Router -> normalized ProviderEvent ->
 * realtime channel (SSE/WebSocket) -> src/hooks/useRouterEvents.ts -> robots.
 * The dev simulator must never become the production event source.
 */

import type { ProviderEvent } from "@/events/eventTypes";
import type { RouterConfig } from "./config";

export interface ObservationHandlers {
  onEvent(event: ProviderEvent): void;
}

/**
 * Starts observing real router activity. Not implemented yet on purpose:
 * it requires the user's actual 9Router API details.
 */
export function startObservation(_config: RouterConfig, _handlers: ObservationHandlers): () => void {
  console.warn(
    "[9router] startObservation is not implemented yet — inspect the real 9Router API first. " +
      "The app currently runs with the development simulator only."
  );
  return () => {};
}
