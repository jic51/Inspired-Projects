import { NextRequest, NextResponse } from "next/server";
import { detectObjectsInImage } from "@/lib/gemini";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { sceneId, keyframeUrl, locationHint } = await req.json();

  if (!sceneId || !keyframeUrl) {
    return NextResponse.json({ error: "Missing sceneId or keyframeUrl" }, { status: 400 });
  }

  const objects = await detectObjectsInImage(keyframeUrl, locationHint ?? "");
  const db = createServiceClient();

  const hotspots = objects.map((obj, i) => ({
    scene_id: sceneId,
    object_name: obj.name,
    // Default positions in a ring around center — creator adjusts later
    position_x: Math.cos((i / objects.length) * Math.PI * 2) * 2,
    position_y: 1.0,
    position_z: Math.sin((i / objects.length) * Math.PI * 2) * 2,
    ai_confidence: obj.confidence,
  }));

  const { data, error } = await db
    .from("hotspots")
    .insert(hotspots)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ hotspots: data });
}
