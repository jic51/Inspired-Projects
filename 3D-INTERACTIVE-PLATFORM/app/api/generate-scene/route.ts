import { NextRequest, NextResponse } from "next/server";
import { generateScene, getSceneStatus } from "@/lib/worldlabs";
import { createServiceClient } from "@/lib/supabase";

// Trigger 3D generation for a scene using its keyframe image
export async function POST(req: NextRequest) {
  const { sceneId, keyframeUrl } = await req.json();

  if (!sceneId || !keyframeUrl) {
    return NextResponse.json({ error: "Missing sceneId or keyframeUrl" }, { status: 400 });
  }

  const db = createServiceClient();

  await db.from("scenes").update({ status: "processing" }).eq("id", sceneId);

  const { worldId } = await generateScene(keyframeUrl);

  await db
    .from("scenes")
    .update({ world_labs_id: worldId })
    .eq("id", sceneId);

  return NextResponse.json({ worldLabsId: worldId, status: "processing" });
}

// Poll status and update scene when ready
export async function GET(req: NextRequest) {
  const sceneId = req.nextUrl.searchParams.get("sceneId");
  if (!sceneId) {
    return NextResponse.json({ error: "Missing sceneId" }, { status: 400 });
  }

  const db = createServiceClient();
  const { data: scene, error } = await db
    .from("scenes")
    .select("world_labs_id, status")
    .eq("id", sceneId)
    .single();

  if (error || !scene?.world_labs_id) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  if (scene.status === "ready") {
    return NextResponse.json({ status: "ready" });
  }

  const result = await getSceneStatus(scene.world_labs_id);

  if (result.status === "ready" && result.exportUrls?.glb) {
    await db
      .from("scenes")
      .update({
        status: "ready",
        scene_3d_url: result.exportUrls.glb,
      })
      .eq("id", sceneId);

    return NextResponse.json({ status: "ready", sceneUrl: result.exportUrls.glb });
  }

  if (result.status === "failed") {
    await db.from("scenes").update({ status: "failed" }).eq("id", sceneId);
    return NextResponse.json({ status: "failed" });
  }

  return NextResponse.json({ status: "processing" });
}
