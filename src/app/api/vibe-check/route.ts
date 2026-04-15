import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { analyzeVibe, embedText } from "@/lib/openai";
import { generateMusic, generateSFX } from "@/lib/elevenlabs";
import {
  upsertVibe,
  findVibeTwin,
  getLibrarySize,
} from "@/lib/turbopuffer";
import type { VibeCheckResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const started = Date.now();
  try {
    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim();
    if (!content || content.length < 3) {
      return NextResponse.json(
        { error: "Need at least a few characters to vibe-check." },
        { status: 400 }
      );
    }
    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Too long — keep it under 5000 characters." },
        { status: 400 }
      );
    }

    const profile = await analyzeVibe(content);

    const embedInput = [
      profile.summary,
      profile.subtext,
      profile.tags.join(", "),
      profile.music_prompt,
    ]
      .filter(Boolean)
      .join(" • ");
    const vector = await embedText(embedInput);

    const id = randomUUID();

    const [twinResult, music, sfx0, sfx1, librarySize] = await Promise.all([
      findVibeTwin(vector, id),
      generateMusic(profile.music_prompt, 20000).catch((e) => {
        console.error("music gen failed", e);
        return "";
      }),
      generateSFX(profile.sfx_prompts[0], 3.5).catch((e) => {
        console.error("sfx0 failed", e);
        return "";
      }),
      generateSFX(profile.sfx_prompts[1] ?? profile.sfx_prompts[0], 3.0).catch(
        (e) => {
          console.error("sfx1 failed", e);
          return "";
        }
      ),
      getLibrarySize(),
    ]);

    upsertVibe(id, vector, profile).catch((e) =>
      console.error("upsert failed", e)
    );

    const result: VibeCheckResult = {
      id,
      profile,
      music_audio_base64: music,
      sfx_audio_base64: [sfx0, sfx1].filter(Boolean),
      vibe_twin: twinResult.twin,
      library_size: (librarySize || 0) + 1,
      similar_count: twinResult.similar_count,
      created_at: new Date().toISOString(),
    };

    console.log(`vibe-check ${id} done in ${Date.now() - started}ms`);
    return NextResponse.json(result);
  } catch (err) {
    console.error("vibe-check failed", err);
    const message =
      err instanceof Error ? err.message : "Something went sideways.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
