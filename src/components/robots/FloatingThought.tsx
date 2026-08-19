"use client";

import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";

import { SCENE_SCALE } from "@/config/providers";

interface FloatingThoughtProps {
  phrases: string[];
  visible: boolean;
}

/**
 * Small floating text above the robot while working (PRD §7 FLOATING TEXT).
 * Rendered as screen-space overlay (no transform) so it is always legible
 * regardless of the robot's facing direction. Cycles phrases with a soft
 * fade - change - fade-in. Pure decoration — never model reasoning.
 */
export default function FloatingThought({ phrases, visible }: FloatingThoughtProps) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible || phrases.length === 0) return;
    let timeout: number | undefined;
    const interval = window.setInterval(() => {
      setFading(true);
      timeout = window.setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setFading(false);
      }, 260);
    }, 2400);
    return () => {
      window.clearInterval(interval);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [visible, phrases.length]);

  if (phrases.length === 0) return null;

  const hidden = !visible || fading;

  return (
    <Html
      position={[0, 1.62 * SCENE_SCALE, 0]}
      center
      zIndexRange={[60, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div className={`thought ${hidden ? "fade" : ""}`} aria-hidden={hidden}>
        {phrases[index]}
      </div>
    </Html>
  );
}
