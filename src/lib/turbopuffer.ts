import { Turbopuffer } from "@turbopuffer/turbopuffer";
import type { MomentProfile, HypeBoardItem, SoloTwin } from "./types";

const client = new Turbopuffer({
  apiKey: process.env.TURBOPUFFER_API_KEY!,
  region: process.env.TURBOPUFFER_REGION || "gcp-us-central1",
});

const NAMESPACE = process.env.TURBOPUFFER_NAMESPACE || "pregame-hype-v1";

export function ns() {
  return client.namespace(NAMESPACE);
}

export async function upsertMoment(
  id: string,
  vector: number[],
  profile: MomentProfile
): Promise<void> {
  const nowMs = Date.now();
  await ns().write({
    distance_metric: "cosine_distance",
    upsert_rows: [
      {
        id,
        vector,
        moment_type: profile.moment_type,
        moment_tag: profile.moment_tag,
        content_preview: profile.content_preview,
        tags: profile.tags,
        music_prompt: profile.music_prompt,
        created_at_ms: nowMs,
        created_at_iso: new Date(nowMs).toISOString(),
      },
    ],
  });
}

export async function findSoloTwin(
  vector: number[],
  excludeId: string
): Promise<SoloTwin | null> {
  try {
    const res = await ns().query({
      rank_by: ["vector", "ANN", vector],
      top_k: 10,
      include_attributes: [
        "moment_tag",
        "moment_type",
        "content_preview",
        "created_at_ms",
      ],
    });
    const rows = (res.rows ?? []) as Array<Record<string, unknown>>;
    const others = rows.filter((r) => String(r.id) !== excludeId);
    if (others.length === 0) return null;

    const best = others[0];
    const distance = Number(best.$dist ?? best.dist ?? 0);
    const similarity = Math.max(0, Math.min(1, 1 - distance));
    const createdAt = Number(best.created_at_ms ?? 0);
    const minutes_ago = createdAt > 0 ? Math.max(0, Math.round((Date.now() - createdAt) / 60000)) : 0;

    return {
      id: String(best.id),
      content_preview: String(best.content_preview ?? ""),
      moment_tag: String(best.moment_tag ?? ""),
      moment_type: String(best.moment_type ?? ""),
      similarity,
      minutes_ago,
    };
  } catch (err) {
    console.error("turbopuffer solo-twin query failed", err);
    return null;
  }
}

export async function getLiveHypeBoard(
  windowMs: number = 60 * 60 * 1000
): Promise<{ board: HypeBoardItem[]; live_count: number }> {
  const since = Date.now() - windowMs;
  try {
    const res = await ns().query({
      top_k: 250,
      filters: ["created_at_ms", "Gt", since],
      include_attributes: ["moment_type", "created_at_ms"],
    });
    const rows = (res.rows ?? []) as Array<Record<string, unknown>>;
    const counts = new Map<string, number>();
    for (const r of rows) {
      const t = String(r.moment_type ?? "other");
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    const board: HypeBoardItem[] = Array.from(counts.entries())
      .map(([moment_type, count]) => ({ moment_type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    return { board, live_count: rows.length };
  } catch (err) {
    console.error("turbopuffer hype-board query failed", err);
    return { board: [], live_count: 0 };
  }
}

export async function countLeague(momentType: string): Promise<number> {
  try {
    const res = await ns().query({
      top_k: 1000,
      filters: ["moment_type", "Eq", momentType],
      include_attributes: ["moment_type"],
    });
    const rows = (res.rows ?? []) as Array<Record<string, unknown>>;
    return rows.length;
  } catch (err) {
    console.error("turbopuffer league-count failed", err);
    return 0;
  }
}
