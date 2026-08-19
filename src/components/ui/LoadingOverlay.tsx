"use client";

import { useEffect, useState } from "react";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Covers the scene while the 3D canvas boots (AGENTS.md §25).
 * Never blocks forever: if WebGL is missing it says so immediately, and if the
 * render loop never signals ready it switches to a helpful fallback panel.
 */
export default function LoadingOverlay({ ready }: { ready: boolean }) {
  const [webglOk] = useState<boolean>(() => (typeof window === "undefined" ? true : hasWebGL()));
  const [stuck, setStuck] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!webglOk) return;
    if (!ready) {
      // If the scene hasn't signaled ready after a while, stop blocking with a
      // friendly hint instead of an eternal spinner.
      const t = setTimeout(() => setStuck(true), 9000);
      return () => clearTimeout(t);
    }
    setShowReady(true);
    const t1 = setTimeout(() => setFading(true), 1000);
    const t2 = setTimeout(() => setGone(true), 1750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready, webglOk]);

  if (gone) return null;

  const fail = !webglOk || stuck;

  return (
    <div
      className={"loading-box " + (fading ? "hidden" : "")}
      aria-live="polite"
      role={fail ? "alert" : "status"}
    >
      <div className="loading-content">
        {fail ? (
          <>
            <div className="loading-title">Ruang 3D tidak bisa dibuka</div>
            <div className="loading-sub">
              {webglOk
                ? "Scene membutuhkan waktu terlalu lama. Coba muat ulang setelah perangkat tidak sibuk."
                : "Browser ini tidak mengaktifkan WebGL (butuh untuk rendering 3D)."}
            </div>
            <div className="loading-hint">
              Aktifkan hardware acceleration / WebGL di pengaturan browser, atau coba
              Chrome, Edge, atau Firefox terbaru. Kalau akses dari VM atau remote desktop,
              gunakan perangkat dengan GPU aktif.
            </div>
            <button
              className="loading-action"
              onClick={() => window.location.reload()}
            >
              Muat Ulang
            </button>
          </>
        ) : showReady ? (
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
