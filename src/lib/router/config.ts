/**
 * Server-side 9Router configuration (PRD §15, AGENTS.md §13).
 * Secrets live only in environment variables and never reach the browser.
 *
 * ROUTER_API_URL may be given with or without the "/v1" suffix (the user's
 * OpenAI-compatible base). The dashboard/observation API lives at the server
 * root, so "/v1" is normalized away here.
 */
export interface RouterConfig {
  url: string;
  key: string;
}

export function getRouterConfig(): RouterConfig | null {
  const url = process.env.ROUTER_API_URL?.trim();
  if (!url) return null;
  // Key is optional: 9Router also runs in local mode without API keys.
  // Observation only needs the URL; the key is kept for future /v1 calls.
  return { url, key: process.env.ROUTER_API_KEY?.trim() ?? "" };
}

export function isRouterConfigured(): boolean {
  return getRouterConfig() !== null;
}

/** Server root URL (no "/v1" suffix, no trailing slash). */
export function getRouterBase(): string | null {
  const config = getRouterConfig();
  if (!config) return null;
  let base = config.url.trim();
  if (base.endsWith("/v1")) base = base.slice(0, -3);
  base = base.replace(/\/+$/, "");
  return base || null;
}
