"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { PROVIDERS, type ProviderConfig } from "@/config/providers";
import { getProjected } from "@/lib/nameplanes";
import { useRouterEvents } from "@/hooks/useRouterEvents";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import StatusOverlay from "@/components/ui/StatusOverlay";
import ActivityChips from "@/components/ui/ActivityChips";
import DevSimulator from "@/components/ui/DevSimulator";

// Three.js scene must render client-side only.
const AIRoom = dynamic(() => import("@/components/room/AIRoom"), {
  ssr: false,
  loading: () => null,
});

function usePortraitHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const apply = () => {
      if (mq.matches && window.innerWidth < 820) {
        setShow(true);
        const t = setTimeout(() => setShow(false), 6000);
        return () => clearTimeout(t);
      }
    };
    mq.addEventListener("change", apply);
    const cleanup = apply();
    return () => {
      mq.removeEventListener("change", apply);
      cleanup?.();
    };
  }, []);
  return show;
}

/**
 * 2D nameplates: anchored to each workstation's projected screen position,
 * clamped inside the viewport, so names are always readable on any screen.
 */
function NameplateLayer({ providers }: { providers: readonly ProviderConfig[] }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), Math.max(lo, hi));
    let raf = 0;
    const tick = () => {
      for (const p of providers) {
        const el = refs.current[p.id];
        if (!el) continue;
        const pos = getProjected(p.id);
        if (pos) {
          const w = el.offsetWidth || 80;
          const h = el.offsetHeight || 22;
          const cx = clamp(pos.x, w / 2 + 4, window.innerWidth - w / 2 - 4);
          const cy = clamp(pos.y, h / 2 + 4, window.innerHeight - h / 2 - 4);
          el.style.transform = `translate(${Math.round(cx - w / 2)}px, ${Math.round(cy - h / 2)}px)`;
          el.style.opacity = "1";
        } else {
          el.style.opacity = "0";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [providers]);

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none" }}>
      {providers.map((p) => (
        <div
          key={p.id}
          ref={(el) => {
            refs.current[p.id] = el;
          }}
          className="world-label layer-label"
          style={{ opacity: 0 }}
        >
          <div className="plate-name" style={{ color: p.glow }}>
            {p.name}
          </div>
          {p.role && <div className="plate-role">{p.role}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const { active, status } = useRouterEvents();
  const showHint = usePortraitHint();

  return (
    <main className="room-root">
      <AIRoom onReady={onReady} active={active} />
      <div className="vignette" aria-hidden="true" />
      <LoadingOverlay ready={ready} />
      <StatusOverlay status={status} />
      <ActivityChips active={active} providers={PROVIDERS} />
      <DevSimulator providers={PROVIDERS} />
      <NameplateLayer providers={PROVIDERS} />
      <div className={"rotate-hint " + (showHint ? "" : "off")} role="note">
        Putar ponsel ke mode lanskap untuk tampilan ruangan yang lebih luas
      </div>
    </main>
  );
}
