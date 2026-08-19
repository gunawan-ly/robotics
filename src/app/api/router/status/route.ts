import { NextResponse } from "next/server";

import { getObserverStatus } from "@/lib/router/observer";

/**
 * Reports 9Router availability (no secrets exposed).
 * mode "live" = ROUTER_API_URL is configured; connected = the observer's SSE
 * connection to the router's /api/usage/stream is currently up.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function waitForConnection(timeoutMs: number): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const s = getObserverStatus();
    if (s.connected) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

export async function GET() {
  const initial = getObserverStatus();
  // On first request the observer may still be establishing its SSE
  // connection — give it a short grace window so the UI shows the truth.
  if (initial.mode === "live" && !initial.connected) {
    await waitForConnection(2000);
  }
  const status = getObserverStatus();
  return NextResponse.json(
    {
      mode: status.mode,
      connected: status.connected,
      checked: true,
      lastError: status.lastError,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
