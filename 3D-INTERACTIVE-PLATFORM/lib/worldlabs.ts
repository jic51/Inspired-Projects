const WORLDLABS_API = "https://api.worldlabs.ai";

export async function generateScene(keyframeUrl: string): Promise<{
  worldId: string;
  status: string;
  estimatedTime?: number;
}> {
  const res = await fetch(`${WORLDLABS_API}/marble/v1/worlds:generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WORLDLABS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_url: keyframeUrl }),
  });

  if (!res.ok) {
    throw new Error(`World Labs API error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export async function getSceneStatus(worldLabsId: string): Promise<{
  status: "pending" | "processing" | "ready" | "failed";
  exportUrls?: { glb?: string; splat?: string };
}> {
  const res = await fetch(
    `${WORLDLABS_API}/marble/v1/worlds/${worldLabsId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.WORLDLABS_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`World Labs status error: ${res.status}`);
  }

  return res.json();
}
