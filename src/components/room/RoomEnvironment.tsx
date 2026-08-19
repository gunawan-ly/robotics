"use client";

/**
 * The diorama itself: floor, platform, walls, racks, plants and lamps.
 * All geometry is cheap, reused primitives (PRD §11/§12, AGENTS.md §4/§17).
 */
function Plant({ position }: { position: [number, number] }) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh castShadow position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.28, 12]} />
        <meshStandardMaterial color="#262e44" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.56, 0.04]}>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshStandardMaterial color="#2f6b4f" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0.17, 0.44, -0.1]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color="#3b8a63" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Rack({ position }: { position: [number, number, number] }) {
  const rowColors = ["#22d3ee", "#34d399", "#fbbf24"];
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 2.0, 0.7]} />
        <meshStandardMaterial color="#1c2334" roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.05, 0.36]}>
        <boxGeometry args={[0.96, 1.9, 0.02]} />
        <meshStandardMaterial color="#0c101a" />
      </mesh>
      {Array.from({ length: 5 }).flatMap((_, r) =>
        Array.from({ length: 3 }).map((__, c) => (
          <mesh key={`${r}-${c}`} position={[-0.3 + c * 0.3, 1.75 - r * 0.34, 0.372]}>
            <boxGeometry args={[0.16, 0.12, 0.02]} />
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
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#232a3d" roughness={0.85} />
      </mesh>
      <mesh position={[0, size[1] / 2 + 0.025, 0]}>
        <boxGeometry args={[size[0] + 0.01, 0.05, size[2] + 0.01]} />
        <meshStandardMaterial color="#2c3550" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: [number, number] }) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
        <meshStandardMaterial color="#3b4a6b" />
      </mesh>
      <mesh position={[0, 1.98, 0]}>
        <sphereGeometry args={[0.038, 10, 8]} />
        <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.09, 0.12, 12, 1, true]} />
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
        <planeGeometry args={[13, 13]} />
        <meshStandardMaterial color="#161b29" roughness={0.95} />
      </mesh>

      {/* central platform */}
      <mesh receiveShadow position={[0, 0.07, 0]}>
        <boxGeometry args={[10.6, 0.14, 9.8]} />
        <meshStandardMaterial color="#1c2334" roughness={0.85} />
      </mesh>
      <gridHelper args={[10.4, 26, "#2f3852", "#242c42"]} position={[0, 0.151, 0]} />

      {/* walls: far ones (back of the diorama) a bit higher */}
      <Wall position={[0, 0.475, 6.5]} size={[13.2, 0.95, 0.2]} />
      <Wall position={[6.5, 0.475, 0]} size={[0.2, 0.95, 13.2]} />
      <Wall position={[0, 0.85, -6.5]} size={[13.2, 1.7, 0.2]} />
      <Wall position={[-6.5, 0.85, 0]} size={[0.2, 1.7, 13.2]} />

      {/* subtle light strips on the far walls */}
      <mesh position={[0, 1.62, -6.39]}>
        <boxGeometry args={[7, 0.045, 0.03]} />
        <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[-6.39, 1.62, 0]}>
        <boxGeometry args={[0.03, 0.045, 7]} />
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
