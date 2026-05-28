import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string | null;
  const creatorId = formData.get("creatorId") as string | null;

  if (!file || !title || !creatorId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `videos/${creatorId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const videoUrl = await uploadToR2(key, buffer, file.type);

  const db = createServiceClient();
  const { data: video, error } = await db
    .from("videos")
    .insert({
      creator_id: creatorId,
      title,
      video_url: videoUrl,
      status: "processing",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ videoId: video.id, videoUrl });
}
