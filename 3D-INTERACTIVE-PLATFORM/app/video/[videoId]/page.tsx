"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Video, type Scene } from "@/lib/supabase";
import { UIOverlay } from "@/components/UIOverlay";
import { CommentsPanel } from "@/components/CommentsPanel";
import { SceneList } from "@/components/SceneList";

export default function VideoPage({ params }: { params: { videoId: string } }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { videoId } = params;

  useEffect(() => {
    supabase
      .from("videos")
      .select("*")
      .eq("id", videoId)
      .single()
      .then(({ data }) => setVideo(data));

    supabase
      .from("scenes")
      .select("*")
      .eq("video_id", videoId)
      .order("scene_index")
      .then(({ data }) => setScenes(data ?? []));
  }, [videoId]);

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      {/* Full-screen video */}
      <video
        ref={videoRef}
        src={video.video_url ?? ""}
        className="absolute inset-0 w-full h-full object-contain"
        controls={false}
        autoPlay
        playsInline
        loop
        onClick={(e) => {
          const v = e.currentTarget;
          v.paused ? v.play() : v.pause();
        }}
      />

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* 2D UI overlay */}
      <UIOverlay creatorName="creator" title={video.title}>
        <CommentsPanel />
        <SceneList
          scenes={scenes}
          currentTime={0}
          onSceneClick={(scene) => router.push(`/scene/${scene.id}`)}
        />
      </UIOverlay>

      {/* Video controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6 pt-16 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.paused ? v.play() : v.pause();
            }}
            className="text-white text-xl w-8 h-8 flex items-center justify-center"
          >
            ▶
          </button>
          <div className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer">
            <div className="h-full bg-white rounded-full" style={{ width: "30%" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
