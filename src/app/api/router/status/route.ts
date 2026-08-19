import { NextResponse } from "next/server";

import { isRouterConfigured } from "@/lib/router/config";

/**
 * Reports router availability to the frontend (no secrets are exposed).
 * "connected: true" here means the integration is configured; a real
 * reachability check arrives with Phase 4 once the 9Router API is known.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isRouterConfigured();
  return NextResponse.json(
    {
      mode: configured ? "live" : "dev",
      connected: configured,
      checked: true,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
