"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { setProjected } from "@/lib/nameplanes";

/**
 * Renders nothing; each frame it projects the anchor point to screen
 * coordinates and publishes them to the nameplate store so the 2D
 * NameplateLayer can place its clamped label.
 */
export default function NameplateAnchor({
  id,
  worldPos,
}: {
  id: string;
  worldPos: [number, number, number];
}) {
  const v = useRef<THREE.Vector3 | null>(null);
  if (!v.current) v.current = new THREE.Vector3(...worldPos);

  useFrame((state) => {
    const vec = v.current!;
    vec.set(...worldPos).project(state.camera);
    setProjected(id, {
      x: ((vec.x + 1) / 2) * state.size.width,
      y: ((-vec.y + 1) / 2) * state.size.height,
    });
  });

  return null;
}
