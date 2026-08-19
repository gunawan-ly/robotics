/**
 * Simplified application events (PRD §16).
 * The frontend only understands START / STOP for a provider.
 * 9Router internals never leak past the backend integration layer.
 */
export type RouterEventType = "provider_request_started" | "provider_request_completed";

export interface ProviderEvent {
  type: RouterEventType;
  /** Provider id (e.g. "deepseek") when resolvable, otherwise null. */
  provider: string | null;
  /** Model id as reported by the router, e.g. "oc/deepseek-v4-flash-free". */
  model: string;
  timestamp: number;
}

export type RouterEventListener = (event: ProviderEvent) => void;
