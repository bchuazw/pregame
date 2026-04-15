import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Link from "next/link";
import { GallerySample } from "@/components/GallerySample";

export const dynamic = "force-static";

type SampleMeta = {
  slug: string;
  content: string;
  moment_tag: string;
  moment_type: string;
  mantra: string;
  one_liner: string;
  tags: string[];
  energy: Record<string, number>;
  music_prompt: string;
  sfx_prompts: string[];
  music_file: string;
  sfx_files: string[];
  generated_at: string;
};

async function loadSamples(): Promise<SampleMeta[]> {
  try {
    const raw = await readFile(
      join(process.cwd(), "public", "samples", "index.json"),
      "utf8"
    );
    return JSON.parse(raw) as SampleMeta[];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const samples = await loadSamples();

  return (
    <div className="min-h-screen px-5 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 md:mb-14">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.25em] text-vibe-300 hover:text-vibe-200 transition"
          >
            ← Pre-Game
          </Link>
          <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
            Sample gallery
          </h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            Real outputs from the live model. Each card is one moment,
            one original score, and the SFX that punctuates it.
          </p>
        </div>

        {samples.length === 0 ? (
          <div className="vibe-card rounded-2xl p-8 text-white/60">
            No samples yet. Run{" "}
            <code className="text-vibe-300">npm run gen-samples</code>.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {samples.map((s) => (
              <GallerySample key={s.slug} sample={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
