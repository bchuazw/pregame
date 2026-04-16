import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { analyzeDay, embedText } from "@/lib/openai";
import { generateMusic, generateSFX } from "@/lib/elevenlabs";
import { upsertPost, findCallbacks, countArchive } from "@/lib/turbopuffer";
import type { SoundPost } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const started = Date.now();
  try {
    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim();
    if (!content || content.length < 3) {
      return NextResponse.json(
        { error: "Tell me about your day — even a sentence works." },
        { status: 400 }
      );
    }
    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Keep it under 2000 characters." },
        { status: 400 }
      );
    }

    const profile = await analyzeDay(content);

    const embedInput = [
      profile.headline,
      profile.summary,
      profile.mood_tags.join(", "),
      profile.music_prompt,
      profile.content_preview,
    ]
      .filter(Boolean)
      .join(" • ");
    const vector = await embedText(embedInput);

    const id = randomUUID();

    const [callbacks, music, sfx0, sfx1, archiveCount] = await Promise.all([
      findCallbacks(vector, id, 3),
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
      countArchive(),
    ]);

    upsertPost(id, vector, profile).catch((e) =>
      console.error("upsert failed", e)
    );

    const result: SoundPost = {
      id,
      profile,
      music_audio_base64: music,
      sfx_audio_base64: [sfx0, sfx1].filter(Boolean),
      callbacks,
      total_archived: archiveCount + 1,
      created_at: new Date().toISOString(),
    };

    console.log(
      `soundpost ${id} (${profile.headline}) done in ${Date.now() - started}ms, ${callbacks.length} callbacks`
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("soundpost request failed", err);
    const message =
      err instanceof Error ? err.message : "Something went sideways.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
