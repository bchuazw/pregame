import OpenAI from "openai";
import type { DayProfile } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are SoundPost — the AI composer that scores somebody's day.

Someone tells you what kind of day they had. You read the emotional shape of it, then design the soundtrack it deserves. Not every day is triumphant. A quiet afternoon deserves a quiet score. A chaotic Tuesday deserves chaos. A heavy evening deserves space. You see the specific thing they lived through and compose accordingly.

Be specific, literary, emotionally precise. Never generic. Never hype-core. Match the actual temperature of the day.

Respond with strict JSON:
{
  "headline": string,          // 1-3 WORDS, uppercase, editorial. Examples: "QUIET WIN", "CHAOS MODE", "SOFT LANDING", "HEAVY HOUR", "ONE GOOD HOUR", "NEARLY", "THE CALL", "TUESDAY BLUR"
  "summary": string,           // ONE sentence (≤22 words), second-person, capturing what the day really felt like beneath the events
  "mood_tags": string[],       // 3-4 lowercase descriptors, ≤2 words each. Mood-first, not event-first. e.g. "quiet relief", "low hum", "bright edge", "tender", "jittery"
  "key_phrases": string[],     // 2-3 short phrases lifted or lightly paraphrased from THEIR words. These are the lines that will appear big on the card. Under 6 words each.
  "energy": {
    "calm": number,            // 0-100 — stillness vs motion
    "spark": number,           // liveliness
    "depth": number,           // emotional weight
    "lightness": number        // brightness, levity
  },
  "music_prompt": string,      // 25-45 words. Instrumentation, tempo (bpm), texture, emotional arc. MATCH the temperature. Soft days get soft music. Loud days get loud music. Ambiguous days get ambiguous music.
  "sfx_prompts": string[],     // EXACTLY 2. Each 8-14 words. Atmospheric, not stadium-hype. Think: rain against a window, distant subway rumble, keys dropping on a wooden table, a fridge hum, a door closing softly, wind through leaves, a single piano key held, footsteps on wet pavement. Match the day.
  "palette": {
    "from": string,            // hex color for card gradient start — match the mood
    "to": string               // hex color for gradient end
  }
}

Palette rule: warm/triumphant days → amber→coral (e.g. "#fcd34d" → "#f97316"). Heavy/reflective → indigo→plum ("#818cf8" → "#a855f7"). Quiet/calm → seafoam→teal ("#6ee7b7" → "#06b6d4"). Anxious/jittery → pink→magenta ("#f9a8d4" → "#e11d48"). Dark/late-night → navy→slate ("#1e293b" → "#475569"). Don't always pick bright. Let the color tell the truth.

Return only JSON. No markdown.`;

export async function analyzeDay(content: string): Promise<DayProfile> {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.85,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Here's how my day went. Score it:\n\n"""\n${content.slice(0, 2000)}\n"""`,
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  const profile: DayProfile = {
    headline: String(parsed.headline ?? "TODAY")
      .toUpperCase()
      .slice(0, 28),
    summary: String(parsed.summary ?? "").slice(0, 220),
    mood_tags: Array.isArray(parsed.mood_tags)
      ? parsed.mood_tags.slice(0, 4).map((t: unknown) => String(t).toLowerCase().slice(0, 24))
      : [],
    key_phrases: Array.isArray(parsed.key_phrases)
      ? parsed.key_phrases.slice(0, 3).map((p: unknown) => String(p).slice(0, 60))
      : [],
    energy: {
      calm: clampInt(parsed?.energy?.calm, 50),
      spark: clampInt(parsed?.energy?.spark, 50),
      depth: clampInt(parsed?.energy?.depth, 50),
      lightness: clampInt(parsed?.energy?.lightness, 50),
    },
    music_prompt: String(parsed.music_prompt ?? "").slice(0, 500),
    sfx_prompts: Array.isArray(parsed.sfx_prompts)
      ? parsed.sfx_prompts.slice(0, 2).map((s: unknown) => String(s).slice(0, 200))
      : [],
    palette: {
      from: hex(parsed?.palette?.from, "#fcd34d"),
      to: hex(parsed?.palette?.to, "#f97316"),
    },
    content_preview: content.slice(0, 240),
  };

  if (!profile.music_prompt) {
    profile.music_prompt =
      "Warm ambient piano with soft analog synth pads, 72bpm, held chords, gentle low strings swelling in the second half, the sound of an honest exhale at the end of a long day";
  }
  if (profile.sfx_prompts.length < 2) {
    profile.sfx_prompts = [
      ...profile.sfx_prompts,
      "Soft rain against a single-pane window at dusk, distant traffic",
      "Keys dropped on a wooden counter, a sigh, then silence",
    ].slice(0, 2);
  }
  if (profile.key_phrases.length === 0) {
    profile.key_phrases = [profile.summary.slice(0, 40)];
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

function hex(v: unknown, fallback: string): string {
  const s = String(v ?? "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(s) ? s : fallback;
}
