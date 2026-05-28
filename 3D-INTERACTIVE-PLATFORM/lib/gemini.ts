const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-2.0-flash";

export type DetectedScene = {
  start: number;
  end: number;
  label: string;
};

export type DetectedObject = {
  name: string;
  confidence: number;
  description: string;
};

export async function detectScenes(
  videoUrl: string
): Promise<DetectedScene[]> {
  const res = await fetch(
    `${GEMINI_API}/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this video and identify distinct scene changes where the environment or location changes significantly.
Return a JSON array with this exact format:
[{"start": 0, "end": 45, "label": "modern kitchen"}, {"start": 45, "end": 120, "label": "beach hotel"}]
- "start" and "end" are in seconds
- "label" is a brief 2-3 word description of the environment
- Only include scenes where the environment meaningfully changes (not just camera angles)
- If the entire video is one environment, return a single scene covering 0 to the end
Video URL: ${videoUrl}`,
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
  return JSON.parse(text) as DetectedScene[];
}

export async function detectObjectsInImage(
  imageUrl: string,
  sceneLabel: string
): Promise<DetectedObject[]> {
  const res = await fetch(
    `${GEMINI_API}/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { fileData: { mimeType: "image/jpeg", fileUri: imageUrl } },
              {
                text: `This is a scene from a video (environment: ${sceneLabel}).
Identify the 3-6 most notable objects that someone might want to buy or book.
Return a JSON array:
[{"name": "Le Creuset Dutch Oven", "confidence": 0.9, "description": "Red cast iron pot on the stove"}]
Focus on: furniture, appliances, clothing, accessories, hotels/venues that could have booking links.
Ignore: people, generic architectural elements.`,
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini Vision error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
  return JSON.parse(text) as DetectedObject[];
}
