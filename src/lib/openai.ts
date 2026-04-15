import OpenAI from "openai";
import type { MomentProfile } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are PRE-GAME, a hype coach for the moment right before a hard, scary, or meaningful thing.

Someone tells you what they're about to do. You pump them up. You read the specific emotional shape of their moment — is it a first date, a job interview, a goodbye, a confession, a creative performance, a physical challenge, a confrontation, a first day, a big ask? Each needs a different hype.

Be specific. Be warm but fierce. Never generic affirmations. You see the exact thing they need to hear for THIS moment.

You always respond with strict JSON matching this schema:
{
  "moment_type": string,           // Short snake_case category. Pick from or extend: job_interview, first_date, hard_conversation, quitting_job, creative_performance, physical_challenge, confrontation, first_day, big_ask, public_speaking, confession, goodbye, test_exam, pitch, meeting_parent, audition, competition, moving_away, new_habit, other. Use lowercase snake_case. Keep it tight.
  "moment_tag": string,            // 1-4 WORD uppercase label for the display. Editorial, specific. Examples: "HARD CONVERSATION", "THE INTERVIEW", "FIRST DATE", "LAST SHIFT", "BIG ASK", "THE SPEECH", "MOVING DAY"
  "mantra": string,                // ONE sentence the user should internalize. Second-person. 8-18 words. Specific to their exact moment, not generic. Punch, don't coddle.
  "one_liner": string,             // A single evocative line (≤20 words) describing what they're really doing underneath. Not the surface thing. The real thing.
  "tags": string[],                // 3-4 short lowercase descriptors, ≤2 words each.
  "energy": {
    "confidence": number,          // 0-100 — how much they need (not how much they have)
    "intensity": number,
    "focus": number,
    "courage": number,
    "joy": number
  },
  "music_prompt": string,          // 20-45 words. A vivid prompt for AI music generation. Describe mood, instruments, tempo (bpm), and emotional arc. The music should MATCH what they need to feel — triumphant if they need triumph, steady if they need steadiness, joyful if they need joy. Not all hype is loud.
  "sfx_prompts": string[]          // EXACTLY 2 short prompts (8-14 words each) for AI sound-effect generation. These are punctuating, cinematic SFX that land like a hype moment: crowd roar, air horn, stadium drums, cathedral bells, rocket ignition, boxing bell, starting gun, triumphant brass stab. Match them to the specific moment.
}

Return only the JSON object. No preamble, no markdown fences.`;

export async function analyzeMoment(content: string): Promise<MomentProfile> {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.85,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Someone's about to do this. Pump them up:\n\n"""\n${content.slice(0, 2000)}\n"""`,
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  const profile: MomentProfile = {
    moment_type: normalizeType(parsed.moment_type),
    moment_tag: String(parsed.moment_tag ?? "YOUR MOMENT").toUpperCase().slice(0, 40),
    mantra: String(parsed.mantra ?? "You are built for this.").slice(0, 200),
    one_liner: String(parsed.one_liner ?? "").slice(0, 200),
    tags: Array.isArray(parsed.tags)
      ? parsed.tags.slice(0, 4).map((t: unknown) => String(t).toLowerCase().slice(0, 24))
      : [],
    energy: {
      confidence: clampInt(parsed?.energy?.confidence, 75),
      intensity: clampInt(parsed?.energy?.intensity, 75),
      focus: clampInt(parsed?.energy?.focus, 75),
      courage: clampInt(parsed?.energy?.courage, 75),
      joy: clampInt(parsed?.energy?.joy, 60),
    },
    music_prompt: String(parsed.music_prompt ?? "").slice(0, 500),
    sfx_prompts: Array.isArray(parsed.sfx_prompts)
      ? parsed.sfx_prompts.slice(0, 2).map((s: unknown) => String(s).slice(0, 200))
      : [],
    content_preview: content.slice(0, 240),
  };

  if (!profile.music_prompt) {
    profile.music_prompt =
      "Cinematic triumphant orchestral score, building strings and brass, 110bpm, the sound of stepping into a moment that matters";
  }
  if (profile.sfx_prompts.length < 2) {
    profile.sfx_prompts = [
      ...profile.sfx_prompts,
      "Stadium crowd erupting into a roar, sustained and enormous",
      "Triple air horn blast followed by cheering",
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

function clampInt(v: unknown, fallback = 50): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeType(v: unknown): string {
  const s = String(v ?? "other").toLowerCase().trim();
  return s.replace(/[^a-z0-9_]/g, "_").slice(0, 40) || "other";
}
