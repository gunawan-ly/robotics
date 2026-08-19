import {
  getObserverStatus,
  subscribeObserverEvents,
  subscribeObserverStatus,
} from "@/lib/router/observer";

/**
 * Realtime bridge: normalized ProviderEvents from the 9Router observer are
 * forwarded to the browser as SSE (PRD §14 "WebSocket / SSE / suitable
 * realtime mechanism"). The browser never touches 9Router directly.
 * Events: "provider" (ProviderEvent) and "status" (ObserverStatus).
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* client gone */
        }
      };

      const offEvents = subscribeObserverEvents((e) => send("provider", e));
      const offStatus = subscribeObserverStatus((s) => send("status", s));
      send("status", getObserverStatus());

      const ping = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          /* client gone */
        }
      }, 15_000);
      ping.unref?.();

      cleanup = () => {
        clearInterval(ping);
        offEvents();
        offStatus();
      };
    },
    cancel() {
      cleanup?.();
      cleanup = null;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
