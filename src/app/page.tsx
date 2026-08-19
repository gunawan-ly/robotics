"use client";

import { useCallback, useState } from "react";
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

export default function Home() {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const { active, status } = useRouterEvents();

  return (
    <main className="room-root">
      <AIRoom onReady={onReady} active={active} />
      <div className="vignette" aria-hidden="true" />
      <LoadingOverlay ready={ready} />
      <StatusOverlay status={status} />
      <ActivityChips active={active} providers={PROVIDERS} />
      <DevSimulator providers={PROVIDERS} />
    </main>
  );
}
