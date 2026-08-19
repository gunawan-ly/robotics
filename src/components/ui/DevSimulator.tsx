"use client";

import { useState } from "react";

import type { ProviderConfig } from "@/config/providers";
import { emitStart, emitStop } from "@/events/eventBus";

/**
 * Development-only trigger (PRD §23, AGENTS.md §14).
 * Never rendered in production; only feeds the same in-app event bus that
 * the real 9Router integration will use. Easy to delete entirely.
 */
export default function DevSimulator({ providers }: { providers: ProviderConfig[] }) {
  const [pressed, setPressed] = useState<Record<string, "start" | "stop" | undefined>>({});

  if (process.env.NODE_ENV === "production") return null;

  const start = (p: ProviderConfig) => {
    emitStart(p.modelIds[0], p.id);
    setPressed((s) => ({ ...s, [p.id]: "start" }));
  };

  const stop = (p: ProviderConfig) => {
    emitStop(p.modelIds[0], p.id);
    setPressed((s) => ({ ...s, [p.id]: "stop" }));
  };

  return (
    <div className="overlay" style={{ bottom: 16, left: 16 }}>
      <div className="panel" style={{ padding: "10px 13px", maxWidth: 220 }}>
        <div className="title-tag" style={{ marginBottom: 8, color: "#fbbf24", fontSize: 10 }}>
          Dev Simulator
        </div>
        <div className="sim-grid">
          {providers.map((p) => (
            <div key={p.id} className="sim-row">
              <span className="name">
                <i style={{ background: p.accent }} />
                {p.name}
              </span>
              <span style={{ display: "flex", gap: 5 }}>
                <button className={`sim-btn ${pressed[p.id] === "start" ? "on" : ""}`} onClick={() => start(p)}>
                  start
                </button>
                <button className="sim-btn" onClick={() => stop(p)}>
                  stop
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
