"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { PROVIDERS } from "@/config/providers";
import RoomEnvironment from "./RoomEnvironment";
import RouterCore from "./RouterCore";
import Workstation from "./Workstation";
import ProviderRobot from "@/components/robots/ProviderRobot";

/**
 * Fixed isometric-style camera (PRD §9, AGENTS.md §5).
 * No orbit/free controls; the whole room must be visible at once.
 * On narrow (mobile) viewports the camera pulls back slightly.
 */
function FixedCamera({ onReady }: { onReady?: () => void }) {
  const { camera, size } = useThree();
  const signaled = useRef(false);

  useFrame(() => {
    if (!signaled.current) {
      signaled.current = true;
      onReady?.();
    }
  });

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const base = new THREE.Vector3(11.6, 12.6, 14.4);
    const pull = aspect < 1 ? 1 + (1 - aspect) * 0.45 : 1;
    camera.position.copy(base).multiplyScalar(pull);
    camera.lookAt(0, 1.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

interface AIRoomProps {
  onReady?: () => void;
  /** { [providerId]: activeRequestCount } — drives workstation monitors. */
  active: Record<string, number>;
}

export default function AIRoom({ onReady, active }: AIRoomProps) {
  const busy = Object.keys(active).length > 0;

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 34, near: 0.1, far: 90, position: [11.6, 12.6, 14.4] }}
    >
      <color attach="background" args={["#0d1017"]} />
      <fog attach="fog" args={["#0d1017", 36, 80]} />
      <FixedCamera onReady={onReady} />

      {/* lighting: limited dynamic lights (PRD §12) */}
      <ambientLight intensity={0.55} color="#c9d6ff" />
      <hemisphereLight intensity={0.4} color="#9db4ff" groundColor="#1a2030" />
      <directionalLight
        position={[9, 14, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-7, 4.5, -8]} intensity={60} color="#ffd9a8" distance={24} decay={2} />
      <pointLight position={[6, 5, 9]} intensity={30} color="#8fd8ff" distance={20} decay={2} />

      <RoomEnvironment />
      <RouterCore busy={busy} />

      {PROVIDERS.map((provider) => (
        <group key={provider.id}>
          <Workstation config={provider} active={Boolean(active[provider.id])} />
          <ProviderRobot config={provider} />
        </group>
      ))}
    </Canvas>
  );
}
