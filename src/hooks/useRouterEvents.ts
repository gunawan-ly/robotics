"use client";

import { useEffect, useRef, useState } from "react";

import { PROVIDERS } from "@/config/providers";
import { subscribeRouterEvents } from "@/events/eventBus";
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
 */
export function useRouterEvents() {
  const [active, setActive] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<RouterStatus>({ mode: "dev", connected: false, checked: false });
  const counts = useRef<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = subscribeRouterEvents((event) => {
      const provider = resolveProvider(event.model, PROVIDERS);
      if (!provider) return;
      const c = { ...counts.current };
      if (event.type === "provider_request_started") {
        c[provider.id] = (c[provider.id] ?? 0) + 1;
      } else {
        c[provider.id] = Math.max(0, (c[provider.id] ?? 0) - 1);
      }
      if (c[provider.id] === 0) delete c[provider.id];
      counts.current = c;
      setActive(c);
    });

    fetch("/api/router/status")
      .then((res) => res.json())
      .then((s: Partial<RouterStatus>) => {
        setStatus({
          mode: s.mode === "live" ? "live" : "dev",
          connected: Boolean(s.connected) && s.mode === "live",
          checked: true,
        });
      })
      .catch(() => setStatus({ mode: "dev", connected: false, checked: true }));

    return unsubscribe;
  }, []);

  return { active, status };
}
