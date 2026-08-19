"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { PROVIDERS } from "@/config/providers";
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
      <div className={"rotate-hint " + (showHint ? "" : "off")} role="note">
        Putar ponsel ke mode lanskap untuk tampilan ruangan yang lebih luas
      </div>
    </main>
  );
}
