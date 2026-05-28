"use client";

import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Hotspot as HotspotType } from "@/lib/supabase";

const PROXIMITY_RADIUS = 1.5;

type Props = {
  hotspot: HotspotType;
  onEnter: (hotspot: HotspotType) => void;
  onLeave: (hotspotId: string) => void;
};

export function Hotspot({ hotspot, onEnter, onLeave }: Props) {
  const { camera } = useThree();
  const isNear = useRef(false);
  const position = new THREE.Vector3(
    hotspot.position_x,
    hotspot.position_y,
    hotspot.position_z
  );

  useFrame(() => {
    const dist = camera.position.distanceTo(position);
    const nowNear = dist < PROXIMITY_RADIUS;

    if (nowNear && !isNear.current) {
      isNear.current = true;
      onEnter(hotspot);
    } else if (!nowNear && isNear.current) {
      isNear.current = false;
      onLeave(hotspot.id);
    }
  });

  return (
    <group position={[hotspot.position_x, hotspot.position_y, hotspot.position_z]}>
      {/* Pulsing sphere indicator */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4f9cf5"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Billboard label (always faces camera) */}
      <Html
        center
        distanceFactor={4}
        occlude
        style={{ pointerEvents: "none" }}
      >
        <div className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-black/70 text-white border border-white/20 backdrop-blur">
          {hotspot.object_name}
        </div>
      </Html>
    </group>
  );
}
