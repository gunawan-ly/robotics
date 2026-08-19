/**
 * Server-side 9Router configuration (PRD §15, AGENTS.md §13).
 * Secrets live only in environment variables and never reach the browser.
 */
export interface RouterConfig {
  url: string;
  key: string;
}

export function getRouterConfig(): RouterConfig | null {
  const url = process.env.ROUTER_API_URL?.trim();
  const key = process.env.ROUTER_API_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

export function isRouterConfigured(): boolean {
  return getRouterConfig() !== null;
}
