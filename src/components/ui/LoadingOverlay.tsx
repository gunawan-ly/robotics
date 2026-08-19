"use client";

import { useEffect, useState } from "react";

export default function LoadingOverlay({ ready }: { ready: boolean }) {
  const [showReady, setShowReady] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setShowReady(true);
    const t1 = setTimeout(() => setFading(true), 1000);
    const t2 = setTimeout(() => setGone(true), 1750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  if (gone) return null;

  return (
    <div className={`loading-box ${fading ? "hidden" : ""}`} aria-live="polite">
      <div className="loading-content">
        {showReady ? (
          <>
            <div className="loading-title">AI Room Ready</div>
            <div className="loading-sub">Miniature AI Provider Room</div>
          </>
        ) : (
          <>
            <div className="loading-title">Loading AI Room...</div>
            <div className="loading-bar">
              <i />
            </div>
            <div className="loading-sub">waking the little robots</div>
          </>
        )}
      </div>
    </div>
  );
}
