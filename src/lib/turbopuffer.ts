import { Turbopuffer } from "@turbopuffer/turbopuffer";
import type { DayProfile, Callback } from "./types";

const client = new Turbopuffer({
  apiKey: process.env.TURBOPUFFER_API_KEY!,
  region: process.env.TURBOPUFFER_REGION || "gcp-us-central1",
});

const NAMESPACE = process.env.TURBOPUFFER_NAMESPACE || "soundpost-v1";

export function ns() {
  return client.namespace(NAMESPACE);
}

export async function upsertPost(
  id: string,
  vector: number[],
  profile: DayProfile
): Promise<void> {
  const nowMs = Date.now();
  await ns().write({
    distance_metric: "cosine_distance",
    upsert_rows: [
      {
        id,
        vector,
        headline: profile.headline,
        summary: profile.summary,
        content_preview: profile.content_preview,
        mood_tags: profile.mood_tags,
        music_prompt: profile.music_prompt,
        palette_from: profile.palette.from,
        palette_to: profile.palette.to,
        created_at_ms: nowMs,
        created_at_iso: new Date(nowMs).toISOString(),
      },
    ],
  });
}

export async function findCallbacks(
  vector: number[],
  excludeId: string,
  k = 3
): Promise<Callback[]> {
  try {
    const res = await ns().query({
      rank_by: ["vector", "ANN", vector],
      top_k: k + 2,
      include_attributes: [
        "headline",
        "content_preview",
        "created_at_ms",
        "created_at_iso",
      ],
    });
    const rows = (res.rows ?? []) as Array<Record<string, unknown>>;
    const now = Date.now();
    return rows
      .filter((r) => String(r.id) !== excludeId)
      .slice(0, k)
      .map((r) => {
        const distance = Number(r.$dist ?? r.dist ?? 0);
        const similarity = Math.max(0, Math.min(1, 1 - distance));
        const createdAt = Number(r.created_at_ms ?? 0);
        const days_ago =
          createdAt > 0 ? Math.max(0, Math.round((now - createdAt) / (24 * 60 * 60 * 1000))) : 0;
        return {
          id: String(r.id),
          headline: String(r.headline ?? ""),
          content_preview: String(r.content_preview ?? ""),
          similarity,
          days_ago,
          created_at_iso: String(r.created_at_iso ?? ""),
        };
      });
  } catch (err) {
    console.error("turbopuffer callbacks query failed", err);
    return [];
  }
}

export async function countArchive(): Promise<number> {
  try {
    const res = await ns().query({
      top_k: 1000,
      include_attributes: ["created_at_ms"],
    });
    const rows = (res.rows ?? []) as Array<Record<string, unknown>>;
    return rows.length;
  } catch (err) {
    console.error("turbopuffer count failed", err);
    return 0;
  }
}
