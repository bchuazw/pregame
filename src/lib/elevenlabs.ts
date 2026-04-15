const API_KEY = process.env.ELEVENLABS_API_KEY!;
const BASE = "https://api.elevenlabs.io";

async function toBase64(res: Response): Promise<string> {
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString("base64");
}

export async function generateMusic(prompt: string, lengthMs = 20000): Promise<string> {
  const res = await fetch(`${BASE}/v1/music`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      prompt,
      music_length_ms: lengthMs,
      model_id: "music_v1",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs Music API ${res.status}: ${err.slice(0, 300)}`);
  }
  return toBase64(res);
}

export async function generateSFX(prompt: string, durationSeconds = 4): Promise<string> {
  const res = await fetch(`${BASE}/v1/sound-generation`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: prompt,
      duration_seconds: Math.max(0.5, Math.min(22, durationSeconds)),
      prompt_influence: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs SFX API ${res.status}: ${err.slice(0, 300)}`);
  }
  return toBase64(res);
}
