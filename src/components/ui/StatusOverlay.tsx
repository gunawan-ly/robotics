"use client";

import type { RouterStatus } from "@/hooks/useRouterEvents";

export default function StatusOverlay({ status }: { status: RouterStatus }) {
  const dot = status.connected ? "live" : status.mode === "dev" ? "dev" : "off";
  const text = status.connected
    ? "9Router Connected"
    : status.mode === "dev"
      ? "9Router Offline · Simulator"
      : "9Router Offline";

  return (
    <>
      <div className="overlay" style={{ top: 16, left: 16 }}>
        <div className="panel pill-text" style={{ padding: "8px 13px", display: "flex", alignItems: "center" }}>
          <span className={`status-dot ${dot}`} aria-hidden="true" />
          <span>{text}</span>
        </div>
      </div>

      <div
        className="overlay"
        style={{ top: 18, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
      >
        <div className="title-tag" style={{ color: "#e2e8f0", fontSize: 13 }}>
          Miniature AI Room
        </div>
        <div className="title-tag" style={{ marginTop: 4, opacity: 0.55 }}>
          watch the AI work
        </div>
      </div>
    </>
  );
}
