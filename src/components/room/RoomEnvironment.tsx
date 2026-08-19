"use client";

import { SCENE_SCALE as S } from "@/config/providers";

/**
 * The diorama itself: floor, platform, walls, racks, plants and lamps.
 * All geometry is cheap, reused primitives (PRD §11/§12, AGENTS.md §4/§17).
 * Everything is scaled by SCENE_SCALE so the content fills narrow screens.
 */
function Plant({ position }: { position: [number, number] }) {
  return (
    <group position={[position[0] * S, 0, position[1] * S]}>
      <mesh castShadow position={[0, 0.14 * S, 0]}>
        <cylinderGeometry args={[0.2 * S, 0.24 * S, 0.28 * S, 12]} />
        <meshStandardMaterial color="#262e44" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.56 * S, 0.04 * S]}>
        <sphereGeometry args={[0.24 * S, 12, 10]} />
        <meshStandardMaterial color="#2f6b4f" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0.17 * S, 0.44 * S, -0.1 * S]}>
        <sphereGeometry args={[0.15 * S, 10, 8]} />
        <meshStandardMaterial color="#3b8a63" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Rack({ position }: { position: [number, number, number] }) {
  const rowColors = ["#22d3ee", "#34d399", "#fbbf24"];
  return (
    <group position={[position[0] * S, position[1] * S, position[2] * S]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1 * S, 2.0 * S, 0.7 * S]} />
        <meshStandardMaterial color="#1c2334" roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.05 * S, 0.36 * S]}>
        <boxGeometry args={[0.96 * S, 1.9 * S, 0.02 * S]} />
        <meshStandardMaterial color="#0c101a" />
      </mesh>
      {Array.from({ length: 5 }).flatMap((_, r) =>
        Array.from({ length: 3 }).map((__, c) => (
          <mesh key={`${r}-${c}`} position={[(-0.3 + c * 0.3) * S, (1.75 - r * 0.34) * S, 0.372 * S]}>
            <boxGeometry args={[0.16 * S, 0.12 * S, 0.02 * S]} />
            <meshStandardMaterial
              color={rowColors[(r + c) % 3]}
              emissive={rowColors[(r + c) % 3]}
              emissiveIntensity={0.55}
              toneMapped={false}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function Wall({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <group position={[position[0] * S, position[1] * S, position[2] * S]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size[0] * S, size[1] * S, size[2] * S]} />
        <meshStandardMaterial color="#232a3d" roughness={0.85} />
      </mesh>
      <mesh position={[0, (size[1] / 2 + 0.025) * S, 0]}>
        <boxGeometry args={[(size[0] + 0.01) * S, 0.05 * S, (size[2] + 0.01) * S]} />
        <meshStandardMaterial color="#2c3550" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: [number, number] }) {
  return (
    <group position={[position[0] * S, 0, position[1] * S]}>
      <mesh position={[0, 2.15 * S, 0]}>
        <cylinderGeometry args={[0.008 * S, 0.008 * S, 0.3 * S, 6]} />
        <meshStandardMaterial color="#3b4a6b" />
      </mesh>
      <mesh position={[0, 1.98 * S, 0]}>
        <sphereGeometry args={[0.038 * S, 10, 8]} />
        <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.0 * S, 0]}>
        <coneGeometry args={[0.09 * S, 0.12 * S, 12, 1, true]} />
        <meshStandardMaterial color="#31405c" side={2} />
      </mesh>
    </group>
  );
}

export default function RoomEnvironment() {
  return (
    <group>
      {/* floor */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[13 * S, 13 * S]} />
        <meshStandardMaterial color="#161b29" roughness={0.95} />
      </mesh>

      {/* central platform */}
      <mesh receiveShadow position={[0, 0.07 * S, 0]}>
        <boxGeometry args={[10.6 * S, 0.14 * S, 9.8 * S]} />
        <meshStandardMaterial color="#1c2334" roughness={0.85} />
      </mesh>
      <gridHelper args={[10.4 * S, 26, "#2f3852", "#242c42"]} position={[0, 0.151 * S, 0]} />

      {/* walls: far ones (back of the diorama) a bit higher */}
      <Wall position={[0, 0.475 * S, 6.5 * S]} size={[13.2 * S, 0.95, 0.2]} />
      <Wall position={[6.5 * S, 0.475 * S, 0]} size={[0.2, 0.95, 13.2 * S]} />
      <Wall position={[0, 0.85 * S, -6.5 * S]} size={[13.2 * S, 1.7, 0.2]} />
      <Wall position={[-6.5 * S, 0.85 * S, 0]} size={[0.2, 1.7, 13.2 * S]} />

      {/* subtle light strips on the far walls */}
      <mesh position={[0, 1.62 * S, -6.39 * S]}>
        <boxGeometry args={[7 * S, 0.045, 0.03]} />
        <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[-6.39 * S, 1.62 * S, 0]}>
        <boxGeometry args={[0.03, 0.045, 7 * S]} />
        <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>

      {/* server racks */}
      <Rack position={[5.9, 0, -3.4]} />
      <Rack position={[5.9, 0, -1.2]} />
      <Rack position={[-5.9, 0, 0.8]} />

      {/* plants */}
      <Plant position={[-5.5, 4.7]} />
      <Plant position={[5.5, -4.7]} />

      {/* pendant lamps */}
      <Lamp position={[-2.8, -2.8]} />
      <Lamp position={[2.8, -2.8]} />
      <Lamp position={[0, 2.9]} />
    </group>
  );
}
