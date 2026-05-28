"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Placeholder creator ID — replace with auth.user.id when auth is added
  const DEMO_CREATOR_ID = "00000000-0000-0000-0000-000000000001";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setStatus("uploading");
    setMessage("Uploading video...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("creatorId", DEMO_CREATOR_ID);

    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) {
      setStatus("error");
      setMessage("Upload failed. Check your R2 configuration.");
      return;
    }

    const { videoId, videoUrl } = await uploadRes.json();
    setStatus("processing");
    setMessage("Detecting scenes with AI...");

    const segmentRes = await fetch("/api/segment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, videoUrl }),
    });

    if (!segmentRes.ok) {
      setStatus("error");
      setMessage("Scene detection failed.");
      return;
    }

    const { scenes, segmentCount } = await segmentRes.json();
    setMessage(`Found ${segmentCount} scenes. Generating 3D environments...`);

    // Kick off 3D generation for each scene (async)
    scenes.forEach(async (scene: { id: string; keyframe_url: string }) => {
      if (!scene.keyframe_url) return;
      await fetch("/api/generate-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneId: scene.id, keyframeUrl: scene.keyframe_url }),
      });
    });

    setStatus("done");
    setMessage(`Video uploaded! ${segmentCount} scenes are being generated (~1 min each).`);

    setTimeout(() => router.push(`/video/${videoId}`), 2000);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Upload a video</h1>
        <p className="text-white/50 text-sm mb-8">
          AI will detect scenes and create 3D environments automatically.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My travel vlog in Tokyo"
              required
              className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/30 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">Video file</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition"
            >
              {file ? (
                <p className="text-white text-sm">{file.name}</p>
              ) : (
                <p className="text-white/40 text-sm">Click to select · MP4, MOV, WebM · max 500MB</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <button
            type="submit"
            disabled={!file || !title.trim() || status !== "idle"}
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition"
          >
            {status === "idle" ? "Upload & Process" : message}
          </button>

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
