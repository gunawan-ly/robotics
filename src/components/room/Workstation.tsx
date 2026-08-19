"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import type { ProviderConfig } from "@/config/providers";
import NameplateAnchor from "./NameplateAnchor";

/**
 * One workstation: desk, chair, monitor + nameplate (PRD §4).
 * Local frame: +Z points toward the room center (router core),
 * -Z is the chair / robot side. The screen faces -Z (the worker).
 */
export default function Workstation({ config, active }: { config: ProviderConfig; active: boolean }) {
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  const pulse = useRef(0);

  useFrame((_, dt) => {
    pulse.current += dt;
    if (screenMat.current) {
      const target = active ? 1.6 + 0.35 * Math.sin(pulse.current * 4.2) : 0.06;
      screenMat.current.emissiveIntensity = THREE.MathUtils.damp(
        screenMat.current.emissiveIntensity,
        target,
        6,
        dt
      );
    }
  });

  useEffect(() => {
    if (screenMat.current) {
      screenMat.current.color.set(active ? "#bfeaff" : "#28344d");
    }
  }, [active]);

  return (
    <group position={[config.deskPosition[0], 0, config.deskPosition[1]]} rotation-y={config.rotation}>
      {/* desk */}
      <mesh castShadow receiveShadow position={[0, 0.88, 0]}>
        <boxGeometry args={[1.45, 0.07, 0.72]} />
        <meshStandardMaterial color="#2e3b52" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[-0.66, 0.42, 0]}>
        <boxGeometry args={[0.05, 0.84, 0.68]} />
        <meshStandardMaterial color="#232c42" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.66, 0.42, 0]}>
        <boxGeometry args={[0.05, 0.84, 0.68]} />
        <meshStandardMaterial color="#232c42" roughness={0.7} />
      </mesh>

      {/* keyboard */}
      <mesh position={[0, 0.94, -0.18]}>
        <boxGeometry args={[0.4, 0.025, 0.13]} />
        <meshStandardMaterial color="#16202f" />
      </mesh>

      {/* monitor */}
      <mesh position={[0, 0.96, 0.02]}>
        <cylinderGeometry args={[0.045, 0.06, 0.16, 10]} />
        <meshStandardMaterial color="#1a2233" />
      </mesh>
      <group position={[0, 1.13, 0.02]} rotation-x={-0.1}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.38, 0.05]} />
          <meshStandardMaterial color="#1a2233" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.028]}>
          <planeGeometry args={[0.54, 0.32]} />
          <meshStandardMaterial
            ref={screenMat}
            color="#28344d"
            emissive="#7dd3fc"
            emissiveIntensity={0.06}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* chair */}
      <group position={[0, 0, -0.62]}>
        <mesh castShadow position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.46, 10]} />
          <meshStandardMaterial color="#3b4a6b" />
        </mesh>
        <mesh receiveShadow position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.24, 0.26, 0.04, 16]} />
          <meshStandardMaterial color="#27324a" />
        </mesh>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.46, 0.06, 0.42]} />
          <meshStandardMaterial color="#31405c" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 0.78, -0.19]} rotation-x={0.12}>
          <boxGeometry args={[0.46, 0.48, 0.055]} />
          <meshStandardMaterial color="#31405c" roughness={0.6} />
        </mesh>
      </group>

      {/* tiny desk lamp */}
      <group position={[0.55, 0.92, 0.18]}>
        <mesh rotation-z={-0.7}>
          <cylinderGeometry args={[0.014, 0.014, 0.2, 8]} />
          <meshStandardMaterial color="#3b4a6b" />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      </group>

      {/* nameplate anchor — 2D clamped label is drawn by NameplateLayer */}
      <NameplateAnchor id={config.id} worldPos={[config.deskPosition[0], 1.5, config.deskPosition[1]]} />
    </group>
  );
}
