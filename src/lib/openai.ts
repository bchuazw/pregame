import OpenAI from "openai";
import type { VibeProfile } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are VibeCheck, a witty cultural critic and sound-designer hybrid. Given any piece of text, you analyze its *true* underlying vibe — the energy, emotion, subtext, and secret feelings it betrays.

Be sharp. Be specific. Be a little mean when it's earned. Never generic. Never "this is a thoughtful piece." Find what's actually happening.

You always respond with strict JSON matching this schema:
{
  "summary": string,             // A short, catchy title for the vibe. 2-5 words. Editorial and specific. Examples: "Weaponized Vulnerability", "Exhausted Optimism, Corporate Edition", "Divorced Dad Energy at a Wedding", "3am Philosopher Mode"
  "subtext": string,             // One sentence (≤18 words) calling out what the content is secretly doing.
  "tags": string[],              // 3-5 short lowercase tags, ≤3 words each. e.g. ["humble brag", "trying too hard", "corporate speak"]
  "meters": {
    "energy": number,            // 0-100
    "tension": number,           // 0-100
    "pretension": number,        // 0-100
    "sincerity": number,         // 0-100
    "chaos": number              // 0-100
  },
  "music_prompt": string,        // A vivid 1-2 sentence prompt for an AI music generator. Describe mood, instruments, tempo, and emotional arc that MUSICALLY INTERPRETS the content's true vibe (not its literal topic). 15-40 words.
  "sfx_prompts": string[]        // EXACTLY 2 short prompts (8-14 words each) for an AI sound-effect generator. These should land like a punchline — editorial reactions, not ambient background. Examples: "Single awkward golf clap in an empty auditorium", "Distant elevator music suddenly cut off by a record scratch".
}

Return only the JSON object. No preamble, no markdown fences.`;

export async function analyzeVibe(content: string): Promise<VibeProfile> {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.9,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Vibe-check this:\n\n"""\n${content.slice(0, 4000)}\n"""`,
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  const profile: VibeProfile = {
    summary: String(parsed.summary ?? "Unnamed Vibe").slice(0, 80),
    subtext: String(parsed.subtext ?? "").slice(0, 200),
    tags: Array.isArray(parsed.tags)
      ? parsed.tags.slice(0, 5).map((t: unknown) => String(t).toLowerCase().slice(0, 30))
      : [],
    meters: {
      energy: clampInt(parsed?.meters?.energy),
      tension: clampInt(parsed?.meters?.tension),
      pretension: clampInt(parsed?.meters?.pretension),
      sincerity: clampInt(parsed?.meters?.sincerity),
      chaos: clampInt(parsed?.meters?.chaos),
    },
    music_prompt: String(parsed.music_prompt ?? "").slice(0, 500),
    sfx_prompts: Array.isArray(parsed.sfx_prompts)
      ? parsed.sfx_prompts.slice(0, 2).map((s: unknown) => String(s).slice(0, 200))
      : [],
    content_preview: content.slice(0, 240),
  };

  if (!profile.music_prompt) profile.music_prompt = "Cinematic score matching a mysterious and unresolved emotional state, 80bpm, ambient textures";
  if (profile.sfx_prompts.length < 2) {
    profile.sfx_prompts = [
      ...profile.sfx_prompts,
      "A single awkward cough in a silent room",
      "Distant wind through an empty hallway",
    ].slice(0, 2);
  }
  return profile;
}

export async function embedText(text: string): Promise<number[]> {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 512,
  });
  return res.data[0].embedding;
}

function clampInt(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}
