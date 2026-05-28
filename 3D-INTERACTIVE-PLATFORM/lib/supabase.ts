import { createClient } from "@supabase/supabase-js";

let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// Convenience export — use getSupabase() for lazy init in server contexts
export const supabase = {
  from: (...args: Parameters<ReturnType<typeof createClient>["from"]>) =>
    getSupabase().from(...args),
} as ReturnType<typeof createClient>;

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type Video = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: "processing" | "ready" | "failed";
  created_at: string;
  view_count: number;
};

export type Scene = {
  id: string;
  video_id: string;
  scene_index: number;
  start_time_seconds: number;
  end_time_seconds: number;
  keyframe_url: string | null;
  scene_3d_url: string | null;
  thumbnail_url: string | null;
  location_hint: string | null;
  status: "pending" | "processing" | "ready" | "failed";
  world_labs_id: string | null;
  created_at: string;
};

export type Hotspot = {
  id: string;
  scene_id: string;
  object_name: string;
  position_x: number;
  position_y: number;
  position_z: number;
  product_url: string | null;
  product_price: number | null;
  product_image_url: string | null;
  ai_confidence: number | null;
  created_at: string;
};
