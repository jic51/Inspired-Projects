import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { HeroDemoVideo } from "@/components/HeroDemoVideo";
import { VideoCard } from "@/components/VideoCard";
import { supabase, type Video } from "@/lib/supabase";

async function getVideos(search?: string) {
  let query = supabase
    .from("videos")
    .select("*, scenes(count)")
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(24);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data } = await query;
  return (data ?? []) as (Video & { scene_count: number })[];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const { q } = searchParams;
  const hasSearch = Boolean(q);
  const videos = hasSearch ? await getVideos(q) : [];

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {!hasSearch && <HeroDemoVideo />}

      {hasSearch && (
        <div className="absolute inset-0 bg-black/90" />
      )}

      {/* Center content */}
      <div
        className={`absolute inset-0 flex flex-col items-center z-20 transition-all duration-500 ${
          hasSearch ? "justify-start pt-8" : "justify-center"
        }`}
      >
        {!hasSearch && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Scenix
            </h1>
            <p className="text-white/50 text-sm">
              Step inside the video. Buy what you see.
            </p>
          </div>
        )}

        <div className={`w-full px-4 ${hasSearch ? "max-w-2xl" : "max-w-xl"}`}>
          <SearchBar />
        </div>

        {/* Search results */}
        {hasSearch && (
          <div className="w-full max-w-5xl px-4 mt-8 overflow-y-auto">
            {videos.length === 0 ? (
              <p className="text-white/40 text-center py-16 text-sm">
                No videos found for &quot;{q}&quot;
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload link */}
      <a
        href="/upload"
        className="absolute bottom-6 right-6 z-20 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl border border-white/20 backdrop-blur transition"
      >
        + Upload video
      </a>
    </main>
  );
}
