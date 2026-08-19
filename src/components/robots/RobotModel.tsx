"use client";

import { RoundedBox } from "@react-three/drei";
import { createRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";

import type { ProviderConfig } from "@/config/providers";
import { useRobotAnimation, type RobotPhase } from "./RobotAnimation";

export interface RobotRig {
  root: RefObject<THREE.Group | null>;
  body: RefObject<THREE.Group | null>;
  head: RefObject<THREE.Group | null>;
  armL: RefObject<THREE.Group | null>;
  armR: RefObject<THREE.Group | null>;
  handL: RefObject<THREE.Group | null>;
  handR: RefObject<THREE.Group | null>;
  visor: RefObject<THREE.MeshStandardMaterial | null>;
  antenna: RefObject<THREE.MeshStandardMaterial | null>;
}

export function createRobotRig(): RobotRig {
  return {
    root: createRef<THREE.Group>(),
    body: createRef<THREE.Group>(),
    head: createRef<THREE.Group>(),
    armL: createRef<THREE.Group>(),
    armR: createRef<THREE.Group>(),
    handL: createRef<THREE.Group>(),
    handR: createRef<THREE.Group>(),
    visor: createRef<THREE.MeshStandardMaterial>(),
    antenna: createRef<THREE.MeshStandardMaterial>(),
  };
}

interface RobotModelProps {
  rig: RobotRig;
  config: ProviderConfig;
  phase: RobotPhase;
  reduced: boolean;
  /** Chair position in the robot's local frame (movement target when sitting). */
  chairLocal: [number, number];
  /** Optional overlay content (e.g. FloatingThought) rendered inside the root
   *  group so it moves together with the robot when it sits down. */
  children?: ReactNode;
}

/**
 * One base robot model, differentiated per provider by color only (PRD §11).
 * Origin of the root group is the idle spot on the floor; the robot faces +Z.
 */
export default function RobotModel({ rig, config, phase, reduced, chairLocal, children }: RobotModelProps) {
  useRobotAnimation(rig, phase, reduced, chairLocal);

  const c = config;
  return (
    <group ref={rig.root}>
      {/* legs + feet */}
      <mesh castShadow position={[-0.115, 0.21, 0]}>
        <boxGeometry args={[0.11, 0.42, 0.13]} />
        <meshStandardMaterial color="#97a3b8" roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0.115, 0.21, 0]}>
        <boxGeometry args={[0.11, 0.42, 0.13]} />
        <meshStandardMaterial color="#97a3b8" roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh castShadow position={[-0.115, 0.035, 0]}>
        <boxGeometry args={[0.15, 0.07, 0.2]} />
        <meshStandardMaterial color="#818ca3" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.115, 0.035, 0]}>
        <boxGeometry args={[0.15, 0.07, 0.2]} />
        <meshStandardMaterial color="#818ca3" roughness={0.5} />
      </mesh>

      {/* body */}
      <group ref={rig.body} position={[0, 0.42, 0]}>
        <RoundedBox args={[0.36, 0.42, 0.24]} radius={0.08} smoothness={3} castShadow position={[0, 0.21, 0]}>
          <meshStandardMaterial color={c.accent} roughness={0.5} metalness={0.15} />
        </RoundedBox>

        {/* chest emitter */}
        <mesh position={[0, 0.3, 0.128]}>
          <boxGeometry args={[0.24, 0.09, 0.02]} />
          <meshStandardMaterial color={c.accentDark} emissive={c.glow} emissiveIntensity={0.55} toneMapped={false} />
        </mesh>

        {/* arms */}
        <group ref={rig.armL} position={[-0.21, 0.3, 0]}>
          <mesh castShadow position={[0, -0.1, 0]}>
            <boxGeometry args={[0.1, 0.24, 0.12]} />
            <meshStandardMaterial color="#cdd7e6" roughness={0.5} />
          </mesh>
          <group ref={rig.handL} position={[0, -0.26, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.06, 12, 10]} />
              <meshStandardMaterial color="#e6ecf5" roughness={0.4} />
            </mesh>
          </group>
        </group>
        <group ref={rig.armR} position={[0.21, 0.3, 0]}>
          <mesh castShadow position={[0, -0.1, 0]}>
            <boxGeometry args={[0.1, 0.24, 0.12]} />
            <meshStandardMaterial color="#cdd7e6" roughness={0.5} />
          </mesh>
          <group ref={rig.handR} position={[0, -0.26, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.06, 12, 10]} />
              <meshStandardMaterial color="#e6ecf5" roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* head */}
        <group ref={rig.head} position={[0, 0.44, 0]}>
          <RoundedBox args={[0.26, 0.24, 0.24]} radius={0.07} smoothness={3} castShadow position={[0, 0.12, 0]}>
            <meshStandardMaterial color={c.accent} roughness={0.45} metalness={0.12} />
          </RoundedBox>
          <mesh position={[-0.15, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.06]} />
            <meshStandardMaterial color={c.accentDark} roughness={0.6} />
          </mesh>
          <mesh position={[0.15, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.06]} />
            <meshStandardMaterial color={c.accentDark} roughness={0.6} />
          </mesh>
          {/* visor */}
          <mesh position={[0, 0.14, 0.121]}>
            <boxGeometry args={[0.19, 0.055, 0.02]} />
            <meshStandardMaterial
              ref={rig.visor}
              color={c.glow}
              emissive={c.glow}
              emissiveIntensity={0.7}
              toneMapped={false}
            />
          </mesh>
          {/* antenna */}
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
            <meshStandardMaterial color="#8494ab" />
          </mesh>
          <mesh position={[0, 0.44, 0]}>
            <sphereGeometry args={[0.032, 10, 8]} />
            <meshStandardMaterial
              ref={rig.antenna}
              color={c.glow}
              emissive={c.glow}
              emissiveIntensity={0.9}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* overlay content follows the robot (root moves when sitting) */}
      {children}
    </group>
  );
}
