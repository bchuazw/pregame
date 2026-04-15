import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { analyzeMoment, embedText } from "@/lib/openai";
import { generateMusic, generateSFX } from "@/lib/elevenlabs";
import {
  upsertMoment,
  findSoloTwin,
  getLiveHypeBoard,
  countLeague,
} from "@/lib/turbopuffer";
import type { HypeResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const started = Date.now();
  try {
    const body = (await req.json()) as { content?: string };
    const content = (body.content ?? "").trim();
    if (!content || content.length < 3) {
      return NextResponse.json(
        { error: "Tell me what you're about to do — a sentence is enough." },
        { status: 400 }
      );
    }
    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Keep it short — under 2000 characters." },
        { status: 400 }
      );
    }

    const profile = await analyzeMoment(content);

    const embedInput = [
      profile.moment_tag,
      profile.one_liner,
      profile.tags.join(", "),
      profile.music_prompt,
    ]
      .filter(Boolean)
      .join(" • ");
    const vector = await embedText(embedInput);

    const id = randomUUID();

    const [soloTwin, liveBoard, music, sfx0, sfx1, leagueSize] = await Promise.all([
      findSoloTwin(vector, id),
      getLiveHypeBoard(),
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
      countLeague(profile.moment_type),
    ]);

    upsertMoment(id, vector, profile).catch((e) =>
      console.error("upsert failed", e)
    );

    const result: HypeResult = {
      id,
      profile,
      music_audio_base64: music,
      sfx_audio_base64: [sfx0, sfx1].filter(Boolean),
      solo_twin: soloTwin,
      hype_board: liveBoard.board,
      live_count: liveBoard.live_count,
      league_size: (leagueSize || 0) + 1,
      created_at: new Date().toISOString(),
    };

    console.log(`hype ${id} (${profile.moment_type}) done in ${Date.now() - started}ms`);
    return NextResponse.json(result);
  } catch (err) {
    console.error("hype request failed", err);
    const message =
      err instanceof Error ? err.message : "Something went sideways.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
