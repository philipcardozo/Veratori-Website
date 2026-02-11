"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import * as THREE from "three";

/* ─── Stock level colors ─── */
const STOCK = {
  full: "#5F974F",   // Sage — full stock
  medium: "#2640CE", // Electric — medium stock
  low: "#ABCEE1",    // Sky — low stock
  empty: "#F2F6F9",  // Mist — empty
};

/* ═══════════════════════════════════════════════════════
   SHELF — interactive shelves with hover tooltip
   ═══════════════════════════════════════════════════════ */
interface ShelfProps {
  position: [number, number, number];
  color: string;
  label: string;
  stock: number; // 0-100
}

function Shelf({ position, color, label, stock }: ShelfProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const stockColor =
    stock > 75 ? STOCK.full : stock > 40 ? STOCK.medium : stock > 10 ? STOCK.low : STOCK.empty;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Uprights */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 1, 0]} castShadow>
          <boxGeometry args={[0.08, 2, 0.5]} />
          <meshStandardMaterial
            color={hovered ? "#5a6a80" : "#4a5568"}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Shelf platforms */}
      {[0, 0.7, 1.4].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.06, 0.5]} />
          <meshStandardMaterial color="#718096" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}

      {/* Boxes */}
      {[
        { p: [-0.4, 0.25, 0] as [number, number, number], s: [0.35, 0.35, 0.3] as [number, number, number] },
        { p: [0.3, 0.25, 0] as [number, number, number], s: [0.4, 0.3, 0.3] as [number, number, number] },
        { p: [-0.2, 0.95, 0] as [number, number, number], s: [0.3, 0.3, 0.28] as [number, number, number] },
        { p: [0.4, 0.95, 0] as [number, number, number], s: [0.25, 0.35, 0.3] as [number, number, number] },
        { p: [0, 1.65, 0] as [number, number, number], s: [0.35, 0.3, 0.3] as [number, number, number] },
      ].map((b, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0} floatIntensity={0.08}>
          <mesh position={b.p} castShadow>
            <boxGeometry args={b.s} />
            <meshStandardMaterial
              color={color}
              metalness={0.1}
              roughness={0.7}
              emissive={hovered ? color : "#000000"}
              emissiveIntensity={hovered ? 0.15 : 0}
            />
          </mesh>
        </Float>
      ))}

      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[0, 2.4, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(14,21,38,0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: 10,
              padding: "8px 14px",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, margin: 0, fontFamily: "Inter, sans-serif" }}>
              {label}
            </p>
            <p style={{ color: stockColor, fontSize: 11, fontWeight: 600, margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
              Stock: {stock}%
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   FLOOR
   ═══════════════════════════════════════════════════════ */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a2340" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   ROTATING ACCENT LIGHT
   ═══════════════════════════════════════════════════════ */
function RotatingLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = Math.sin(clock.elapsedTime * 0.3) * 4;
      ref.current.position.z = Math.cos(clock.elapsedTime * 0.3) * 4;
    }
  });
  return (
    <pointLight ref={ref} position={[0, 5, 0]} intensity={0.5} color="#2640CE" />
  );
}

/* ═══════════════════════════════════════════════════════
   LiDAR POINT CLOUD — simulated scan effect
   ═══════════════════════════════════════════════════════ */
function LidarPointCloud({ pointCount = 2000 }: { pointCount?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    const col = new Float32Array(pointCount * 3);

    // Sky Tint: 171/255, 206/255, 225/255
    // Electric: 38/255, 64/255, 206/255
    const skyR = 171 / 255, skyG = 206 / 255, skyB = 225 / 255;
    const elR = 38 / 255, elG = 64 / 255, elB = 206 / 255;

    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      // Spread across warehouse volume
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = Math.random() * 3;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;

      // Blend between Sky Tint and Electric Blue
      const t = Math.random();
      col[i3] = skyR * (1 - t) + elR * t;
      col[i3 + 1] = skyG * (1 - t) + elG * t;
      col[i3 + 2] = skyB * (1 - t) + elB * t;
    }
    return { positions: pos, colors: col };
  }, [pointCount]);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Gentle breathing effect
      const t = clock.elapsedTime;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.12 + Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT — Enhanced warehouse scene
   ═══════════════════════════════════════════════════════ */
const shelves: ShelfProps[] = [
  { position: [-2.5, 0, -1], color: STOCK.full, label: "Aisle A — Produce", stock: 87 },
  { position: [0, 0, -1], color: STOCK.medium, label: "Aisle B — Dairy", stock: 52 },
  { position: [2.5, 0, -1], color: STOCK.low, label: "Aisle C — Bakery", stock: 24 },
  { position: [-2.5, 0, 1.5], color: STOCK.low, label: "Aisle D — Beverages", stock: 31 },
  { position: [0, 0, 1.5], color: STOCK.full, label: "Aisle E — Frozen", stock: 93 },
  { position: [2.5, 0, 1.5], color: STOCK.medium, label: "Aisle F — Dry Goods", stock: 68 },
];

export default function Warehouse3D() {
  return (
    <Canvas
      camera={{ position: [6, 4, 6], fov: 45 }}
      shadows
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      {/* Improved lighting */}
      <ambientLight intensity={0.35} />
      <hemisphereLight
        color="#F2F6F9"
        groundColor="#0E1526"
        intensity={0.3}
      />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.7}
        color="#F2F6F9"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-near={0.5}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <RotatingLight />

      {/* Shelves with labels */}
      {shelves.map((s) => (
        <Shelf key={s.label} {...s} />
      ))}

      {/* LiDAR point cloud overlay */}
      <LidarPointCloud pointCount={1800} />

      <Floor />

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        enableDamping
        dampingFactor={0.05}
      />

      <fog attach="fog" args={["#0E1526", 8, 18]} />
    </Canvas>
  );
}
