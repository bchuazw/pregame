import { Turbopuffer } from "@turbopuffer/turbopuffer";
import type { VibeProfile, VibeTwin } from "./types";

const client = new Turbopuffer({
  apiKey: process.env.TURBOPUFFER_API_KEY!,
  region: process.env.TURBOPUFFER_REGION || "gcp-us-central1",
});

const NAMESPACE = process.env.TURBOPUFFER_NAMESPACE || "vibecheck-library";

export function ns() {
  return client.namespace(NAMESPACE);
}

export interface StoredVibe {
  id: string;
  vibe_summary: string;
  content_preview: string;
  tags: string[];
  music_prompt: string;
  sfx_prompts: string[];
  meters_json: string;
  created_at: string;
}

export async function upsertVibe(
  id: string,
  vector: number[],
  profile: VibeProfile
): Promise<void> {
  await ns().write({
    distance_metric: "cosine_distance",
    upsert_rows: [
      {
        id,
        vector,
        vibe_summary: profile.summary,
        content_preview: profile.content_preview,
        tags: profile.tags,
        music_prompt: profile.music_prompt,
        sfx_prompts: profile.sfx_prompts,
        meters_json: JSON.stringify(profile.meters),
        created_at: new Date().toISOString(),
      },
    ],
  });
}

export async function findVibeTwin(
  vector: number[],
  excludeId: string
): Promise<{ twin: VibeTwin | null; similar_count: number }> {
  try {
    const res = await ns().query({
      rank_by: ["vector", "ANN", vector],
      top_k: 12,
      include_attributes: ["vibe_summary", "content_preview", "tags"],
    });

    const rows = (res.rows ?? []) as Array<Record<string, unknown>>;
    const others = rows.filter((r) => String(r.id) !== excludeId);

    let twin: VibeTwin | null = null;
    if (others.length > 0) {
      const best = others[0];
      const distance = Number(best.$dist ?? best.dist ?? 0);
      const similarity = Math.max(0, Math.min(1, 1 - distance));
      twin = {
        id: String(best.id),
        content_preview: String(best.content_preview ?? ""),
        summary: String(best.vibe_summary ?? ""),
        similarity,
        tags: Array.isArray(best.tags) ? (best.tags as string[]) : [],
      };
    }

    const similar_count = others.filter((r) => {
      const d = Number(r.$dist ?? r.dist ?? 1);
      return 1 - d > 0.55;
    }).length;

    return { twin, similar_count };
  } catch (err) {
    console.error("turbopuffer query failed", err);
    return { twin: null, similar_count: 0 };
  }
}

export async function getLibrarySize(): Promise<number> {
  try {
    const meta = await ns().metadata();
    const m = meta as unknown as { approx_count?: number; document_count?: number };
    return m.approx_count ?? m.document_count ?? 0;
  } catch {
    return 0;
  }
}
