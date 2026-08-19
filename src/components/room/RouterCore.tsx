"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/** The visual center of the room: the 9Router core (PRD §2). */
export default function RouterCore({ busy }: { busy: boolean }) {
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const domeMat = useRef<THREE.MeshStandardMaterial>(null);
  const pulse = useRef(0);

  useFrame((_, dt) => {
    pulse.current += dt * (busy ? 5 : 2.2);
    const s = Math.sin(pulse.current);
    if (ringMat.current) {
      ringMat.current.emissiveIntensity = 1.25 + (busy ? 0.85 : 0.3) * s;
    }
    if (domeMat.current) {
      domeMat.current.emissiveIntensity = 0.75 + 0.3 * s;
    }
  });

  const satellites = [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2 + Math.PI / 4);

  return (
    <group>
      {/* pedestal */}
      <mesh receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.3, 1.42, 0.16, 40]} />
        <meshStandardMaterial color="#1e2538" roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.74, 0.84, 0.55, 32]} />
        <meshStandardMaterial color="#273049" roughness={0.45} metalness={0.4} />
      </mesh>

      {/* glowing ring + dome */}
      <mesh position={[0, 0.665, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.64, 0.032, 12, 48]} />
        <meshStandardMaterial
          ref={ringMat}
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.25}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.79, 0]} castShadow>
        <sphereGeometry args={[0.3, 24, 18]} />
        <meshStandardMaterial
          ref={domeMat}
          color="#67e8f9"
          emissive="#67e8f9"
          emissiveIntensity={0.75}
          toneMapped={false}
        />
      </mesh>

      {/* satellite indicators */}
      {satellites.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 1.06, 0.17, Math.sin(a) * 1.06]}>
          <boxGeometry args={[0.09, 0.05, 0.05]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}

      <Html position={[0, 1.3, 0]} center transform distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div className="title-tag" style={{ color: "#67e8f9" }}>
          9ROUTER · CORE
        </div>
      </Html>
    </group>
  );
}
