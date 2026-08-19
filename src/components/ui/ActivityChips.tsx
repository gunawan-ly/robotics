"use client";

import type { CSSProperties } from "react";
import type { ProviderConfig } from "@/config/providers";

export default function ActivityChips({
  active,
  providers,
}: {
  active: Record<string, number>;
  providers: ProviderConfig[];
}) {
  const working = providers.filter((p) => active[p.id]);
  if (working.length === 0) return null;

  return (
    <div
      className="overlay"
      style={{ bottom: 16, right: 16, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}
    >
      {working.map((p) => (
        <div key={p.id} className="chip" style={{ "--chip": p.accent } as CSSProperties}>
          <i aria-hidden="true" />
          <span>{p.name}</span>
          <small>{p.role ?? "worker"} · working</small>
        </div>
      ))}
    </div>
  );
}
