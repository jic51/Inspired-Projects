import Link from "next/link";
import type { Video } from "@/lib/supabase";

type Props = {
  video: Video & { scene_count?: number };
};

export function VideoCard({ video }: Props) {
  return (
    <Link href={`/video/${video.id}`} className="group block">
      <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/30 transition">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
            ▶
          </div>
        )}

        {video.scene_count && video.scene_count > 0 && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded-full backdrop-blur border border-white/20">
            {video.scene_count} scenes
          </div>
        )}
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-white text-sm font-medium leading-tight line-clamp-2 group-hover:text-blue-400 transition">
          {video.title}
        </h3>
        <p className="text-white/40 text-xs mt-0.5">{video.view_count} views</p>
      </div>
    </Link>
  );
}
