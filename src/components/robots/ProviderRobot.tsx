"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PROVIDERS, type ProviderConfig } from "@/config/providers";
import { subscribeRouterEvents } from "@/events/eventBus";
import { resolveProvider } from "@/events/providerResolver";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FloatingThought from "./FloatingThought";
import RobotModel, { createRobotRig, type RobotRig } from "./RobotModel";
import type { RobotPhase } from "./RobotAnimation";

/**
 * One robot per provider (PRD §4/§6). Subscribes to normalized events and
 * runs the IDLE -> NOTICE -> SITTING -> WORKING -> SUCCESS -> STANDING cycle.
 * Concurrent requests are counted; the robot works until the count hits 0.
 */
export default function ProviderRobot({ config }: { config: ProviderConfig }) {
  const [phase, setPhase] = useState<RobotPhase>("idle");
  const reduced = usePrefersReducedMotion();

  const rigRef = useRef<RobotRig | null>(null);
  if (rigRef.current === null) {
    rigRef.current = createRobotRig();
  }
  const rig = rigRef.current;

  const counts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chair offset in the robot's local frame (robot root is at the idle spot).
  const chairLocal = useMemo<[number, number]>(() => {
    const dx = config.chairPosition[0] - config.position[0];
    const dz = config.chairPosition[1] - config.position[1];
    const { cos, sin } = Math;
    const c = cos(config.rotation);
    const s = sin(config.rotation);
    return [dx * c - dz * s, dx * s + dz * c];
  }, [config]);

  const schedule = (next: RobotPhase, after: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase(next), after);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeRouterEvents((event) => {
      const provider = resolveProvider(event.model, PROVIDERS);
      if (!provider || provider.id !== config.id) return;

      if (event.type === "provider_request_started") {
        counts.current += 1;
        if (counts.current === 1) {
          setPhase("notice");
          schedule("sitting", 1000);
          schedule("working", 2150);
        }
        // already working: keep going, the count covers concurrency
      } else {
        counts.current = Math.max(0, counts.current - 1);
        if (counts.current === 0) {
          if (timer.current) clearTimeout(timer.current);
          setPhase("success");
          schedule("standing", 900);
          schedule("idle", 2100);
        }
      }
    });
    return unsubscribe;
  }, [config.id]);

  return (
    <group position={[config.position[0], 0, config.position[1]]} rotation-y={config.rotation}>
      <RobotModel rig={rig} config={config} phase={phase} reduced={reduced} chairLocal={chairLocal} />
      <FloatingThought phrases={config.phrases} visible={phase === "working"} />
    </group>
  );
}
