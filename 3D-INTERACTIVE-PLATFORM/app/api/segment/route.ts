import { NextRequest, NextResponse } from "next/server";
import { segmentVideo } from "@/lib/scene-segmenter";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { videoId, videoUrl } = await req.json();

  if (!videoId || !videoUrl) {
    return NextResponse.json({ error: "Missing videoId or videoUrl" }, { status: 400 });
  }

  const segments = await segmentVideo(videoUrl);
  const db = createServiceClient();

  const scenesToInsert = segments.map((seg, i) => ({
    video_id: videoId,
    scene_index: i,
    start_time_seconds: seg.start,
    end_time_seconds: seg.end,
    location_hint: seg.label,
    status: "pending" as const,
  }));

  const { data: scenes, error } = await db
    .from("scenes")
    .insert(scenesToInsert)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    scenes,
    segmentCount: segments.length,
    keyframes: segments.map((s) => ({
      timestamp: s.keyframeTimestamp,
      label: s.label,
    })),
  });
}
