"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Scene, type Hotspot } from "@/lib/supabase";
import { SceneViewer } from "@/components/SceneViewer";

export default function ScenePage({ params }: { params: { sceneId: string } }) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const router = useRouter();
  const { sceneId } = params;

  useEffect(() => {
    supabase
      .from("scenes")
      .select("*")
      .eq("id", sceneId)
      .single()
      .then(({ data }) => setScene(data));

    supabase
      .from("hotspots")
      .select("*")
      .eq("scene_id", sceneId)
      .then(({ data }) => setHotspots(data ?? []));
  }, [sceneId]);

  if (!scene) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading scene...</div>
      </div>
    );
  }

  if (scene.status !== "ready" || !scene.scene_3d_url) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-base">
          {scene.status === "processing"
            ? "Generating 3D scene..."
            : scene.status === "failed"
            ? "Scene generation failed."
            : "Scene not ready yet."}
        </div>
        <p className="text-white/40 text-sm">{scene.location_hint}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition"
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <SceneViewer
      scene={scene}
      hotspots={hotspots}
      onExit={() => router.back()}
    />
  );
}
