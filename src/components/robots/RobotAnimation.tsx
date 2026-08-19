"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { RobotRig } from "./RobotModel";

/**
 * Robot state machine phases (PRD §7, AGENTS.md §7):
 * IDLE -> NOTICE -> SITTING -> WORKING -> SUCCESS -> STANDING -> IDLE
 */
export type RobotPhase = "idle" | "notice" | "sitting" | "working" | "success" | "standing";

const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.damp(current, target, lambda, dt);

/**
 * Drives every robot pose toward phase-specific targets with smooth damping.
 * All motion is subtle: head turns, breathing, blinking, small hand bob
 * (PRD §8: small movement > excessive movement).
 */
export function useRobotAnimation(
  rig: RobotRig,
  phase: RobotPhase,
  reduced: boolean,
  chairLocal: [number, number]
) {
  const motion = useRef({
    moveX: 0,
    moveZ: 0,
    rootY: 0,
    bodyLeanX: 0,
    headYaw: 0,
    headPitch: 0,
    armLX: 0,
    armRX: 0,
    handLY: 0,
    handRY: 0,
    visor: 0.7,
    glanceT: 0,
    blinkT: 0,
    entryTime: -10,
  });
  const prevPhase = useRef<RobotPhase>(phase);

  useFrame((state, dt) => {
    const m = motion.current;
    const time = state.clock.elapsedTime;
    const S = reduced ? 0 : 1; // motion scale: 0 disables decorative motion

    if (phase !== prevPhase.current) {
      m.entryTime = time;
      prevPhase.current = phase;
    }

    // --- horizontal position: idle spot <-> chair spot ---
    // Deliberately gentle damping so sit/stand reads as a calm glide.
    const sitting = phase === "sitting" || phase === "working" || phase === "success";
    m.moveX = damp(m.moveX, sitting ? chairLocal[0] : 0, 3.2, dt);
    m.moveZ = damp(m.moveZ, sitting ? chairLocal[1] : 0, 3.2, dt);
    m.rootY = damp(m.rootY, sitting ? 0.09 : 0, 4, dt);
    m.bodyLeanX = damp(m.bodyLeanX, sitting ? 0.13 : 0.02, 4.5, dt);

    // --- head targets ---
    let headYawT = 0;
    let headPitchT = 0;
    if (phase === "idle") {
      m.glanceT += dt;
      const cycle = m.glanceT % 7;
      const glance = cycle < 1.6 ? Math.sin((cycle / 1.6) * Math.PI) : 0;
      headYawT = (0.42 * Math.sin(time * 0.31) + 0.14 * Math.sin(time * 0.77)) * (1 - glance) + 0.06 * glance;
      headPitchT = 0.07 * Math.sin(time * 0.23) + 0.05 * glance;
    } else if (phase === "notice") {
      headYawT = -0.4 * Math.sin(time * 3.4) * 0.5;
      headPitchT = 0.05;
    } else if (phase === "working") {
      headYawT = 0.03 * Math.sin(time * 0.9);
      headPitchT = -0.1 + 0.035 * Math.sin(time * 1.7);
    } else if (phase === "success") {
      headPitchT = 0.14;
    } else {
      headPitchT = -0.04;
    }
    m.headYaw = damp(m.headYaw, headYawT * S, 4.4, dt);
    m.headPitch = damp(m.headPitch, headPitchT * S, 4.4, dt);

    // --- arms / hands ---
    const working = phase === "working";
    if (working) {
      // Calm keyboard bobbing — slower rate, smaller amplitude, soft damping.
      const typingA = Math.sin(time * 4.6);
      const typingB = Math.sin(time * 4.6 + 1.9);
      m.armLX = damp(m.armLX, -0.38, 4, dt);
      m.armRX = damp(m.armRX, -0.36, 4, dt);
      m.handLY = damp(m.handLY, 0.04 + 0.03 * typingA, 7, dt);
      m.handRY = damp(m.handRY, 0.04 + 0.03 * typingB, 7, dt);
    } else {
      m.armLX = damp(m.armLX, -0.12 + 0.03 * Math.sin(time * 0.8), 4, dt);
      m.armRX = damp(m.armRX, -0.12 - 0.03 * Math.sin(time * 0.8), 4, dt);
      m.handLY = damp(m.handLY, 0, 6, dt);
      m.handRY = damp(m.handRY, 0, 6, dt);
    }

    // --- visor: state brightness + occasional blink ---
    m.blinkT += dt;
    const blinking = m.blinkT % 3.7 < 0.13;
    const baseVisor = phase === "working" ? 1.25 : phase === "success" ? 1.55 : 0.75;
    const flash = phase === "success" ? Math.max(0, 1.1 - (time - m.entryTime) * 1.6) : 0;
    const targetVisor = baseVisor + flash - (blinking ? 0.55 : 0);
    m.visor = damp(m.visor, targetVisor, 8, dt);
    if (rig.visor.current) {
      rig.visor.current.emissiveIntensity = m.visor * (0.85 + 0.15 * S);
    }
    if (rig.antenna.current) {
      rig.antenna.current.emissiveIntensity = 0.55 + 0.25 * Math.sin(time * 1.4) * S;
    }

    // --- breathing ---
    const breath = 1 + 0.012 * Math.sin(time * 2.1) * S;
    rig.body.current?.scale.set(breath, breath, breath);

    // --- apply ---
    const root = rig.root.current;
    if (root) {
      root.position.set(m.moveX, m.rootY, m.moveZ);
    }
    if (rig.body.current) {
      rig.body.current.rotation.x = m.bodyLeanX * S;
    }
    if (rig.head.current) {
      rig.head.current.rotation.y = m.headYaw;
      rig.head.current.rotation.x = m.headPitch;
    }
    if (rig.armL.current) rig.armL.current.rotation.x = m.armLX * S;
    if (rig.armR.current) rig.armR.current.rotation.x = m.armRX * S;
    if (rig.handL.current) rig.handL.current.position.y = m.handLY * S;
    if (rig.handR.current) rig.handR.current.position.y = m.handRY * S;
  });
}
