"use client";

import type { Scene } from "@/lib/supabase";

type Props = {
  scenes: Scene[];
  currentTime: number;
  onSceneClick: (scene: Scene) => void;
};

export function SceneList({ scenes, currentTime, onSceneClick }: Props) {
  if (scenes.length === 0) return null;

  const activeScene = scenes.findLast(
    (s) => s.start_time_seconds <= currentTime
  );

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
      <div className="flex flex-col gap-2">
        {scenes.map((scene) => {
          const isActive = scene.id === activeScene?.id;
          const isReady = scene.status === "ready";

          return (
            <button
              key={scene.id}
              onClick={() => isReady && onSceneClick(scene)}
              disabled={!isReady}
              className={`group relative w-24 text-left rounded-xl overflow-hidden border transition ${
                isActive
                  ? "border-blue-400 scale-105"
                  : "border-white/15 hover:border-white/40"
              } ${!isReady ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
            >
              <div className="aspect-video bg-white/5">
                {scene.thumbnail_url ? (
                  <img
                    src={scene.thumbnail_url}
                    alt={scene.location_hint ?? `Scene ${scene.scene_index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                    {isReady ? "⬡" : "⏳"}
                  </div>
                )}
              </div>
              <div className="p-1 bg-black/70">
                <p className="text-white/70 text-[10px] leading-tight truncate">
                  {scene.location_hint ?? `Scene ${scene.scene_index + 1}`}
                </p>
              </div>

              {isReady && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition text-white text-xs font-medium">
                  Explore →
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
