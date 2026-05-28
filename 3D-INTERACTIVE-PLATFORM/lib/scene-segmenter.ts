import { detectScenes, type DetectedScene } from "./gemini";

export type SceneSegment = DetectedScene & {
  keyframeTimestamp: number;
};

export async function segmentVideo(videoUrl: string): Promise<SceneSegment[]> {
  const scenes = await detectScenes(videoUrl);

  return scenes.map((scene) => ({
    ...scene,
    // Pick keyframe at 40% into the scene (avoids fade-ins at start/end)
    keyframeTimestamp: scene.start + (scene.end - scene.start) * 0.4,
  }));
}
