"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF, Sky } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { Hotspot } from "./Hotspot";
import { HotspotPanel } from "./HotspotPanel";
import type { Hotspot as HotspotType, Scene } from "@/lib/supabase";

const SCENE_BOUNDS = 8;
const MOVE_SPEED = 4;

function PlayerController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Track key state
  if (typeof window !== "undefined") {
    window.onkeydown = (e) => { keys.current[e.code] = true; };
    window.onkeyup = (e) => { keys.current[e.code] = false; };
  }

  useFrame((_, delta) => {
    direction.current.set(0, 0, 0);

    if (keys.current["KeyW"] || keys.current["ArrowUp"])
      direction.current.z -= 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"])
      direction.current.z += 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"])
      direction.current.x -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"])
      direction.current.x += 1;

    if (direction.current.length() === 0) return;

    direction.current.normalize();
    direction.current.applyEuler(camera.rotation);
    direction.current.y = 0; // Keep horizontal movement only
    direction.current.normalize();

    velocity.current.copy(direction.current).multiplyScalar(MOVE_SPEED * delta);

    const next = camera.position.clone().add(velocity.current);

    // Enforce scene boundary (invisible wall)
    const dist = Math.sqrt(next.x ** 2 + next.z ** 2);
    if (dist > SCENE_BOUNDS) {
      const scale = SCENE_BOUNDS / dist;
      next.x *= scale;
      next.z *= scale;
    }

    camera.position.set(next.x, 1.6, next.z);
  });

  return null;
}

function SceneModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

type Props = {
  scene: Scene;
  hotspots: HotspotType[];
  onExit: () => void;
};

export function SceneViewer({ scene, hotspots, onExit }: Props) {
  const [activeHotspot, setActiveHotspot] = useState<HotspotType | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef<PointerLockControlsImpl>(null);

  const handleHotspotEnter = useCallback((hotspot: HotspotType) => {
    setActiveHotspot(hotspot);
  }, []);

  const handleHotspotLeave = useCallback((hotspotId: string) => {
    setActiveHotspot((prev) => (prev?.id === hotspotId ? null : prev));
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Controls hint */}
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-black/70 text-white px-6 py-4 rounded-xl text-center backdrop-blur border border-white/10">
            <p className="text-lg font-medium mb-1">Click to explore</p>
            <p className="text-sm text-white/60">WASD to move · ESC to exit</p>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-4 h-4 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/60 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/60 -translate-x-1/2" />
          </div>
        </div>
      )}

      {/* Exit button */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-20 px-4 py-2 bg-black/70 text-white rounded-lg text-sm font-medium border border-white/20 hover:bg-white/10 transition backdrop-blur"
      >
        ← Back to video
      </button>

      {/* Scene info */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-1 bg-black/60 text-white/80 rounded-full text-sm backdrop-blur border border-white/10">
          {scene.location_hint}
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        onClick={() => controlsRef.current?.lock()}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Sky />

        <Suspense fallback={null}>
          {scene.scene_3d_url && <SceneModel url={scene.scene_3d_url} />}
        </Suspense>

        {hotspots.map((h) => (
          <Hotspot
            key={h.id}
            hotspot={h}
            onEnter={handleHotspotEnter}
            onLeave={handleHotspotLeave}
          />
        ))}

        <PlayerController />
        <PointerLockControls
          ref={controlsRef}
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />
      </Canvas>

      {/* Hotspot panel (slides in from right) */}
      {activeHotspot && (
        <HotspotPanel
          hotspot={activeHotspot}
          onClose={() => setActiveHotspot(null)}
        />
      )}
    </div>
  );
}
