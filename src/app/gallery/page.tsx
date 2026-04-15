import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Link from "next/link";
import { GallerySample } from "@/components/GallerySample";
import { Marquee } from "@/components/Marquee";
import { Flame } from "lucide-react";

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
    <div className="min-h-screen flex flex-col">
      <Marquee />

      <div className="px-5 md:px-10 py-10 md:py-16 max-w-6xl mx-auto w-full">
        <div className="mb-12 md:mb-16 flex flex-col gap-4 relative">
          <Link
            href="/"
            className="sticker sticker-hype !py-1.5 !px-3 !text-[11px] w-fit"
          >
            <Flame className="w-3.5 h-3.5" />
            back to Hypeman
          </Link>

          <div className="flex items-center gap-3 mt-2">
            <span className="tape animate-wobble">★ the gallery ★</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tight">
            Sample <span className="gradient-hype italic">moments.</span>
          </h1>
          <p className="text-white/65 md:text-lg max-w-2xl leading-relaxed">
            Real outputs from the live model. Each card is one moment, one
            original score, and the SFX that punctuates it.{" "}
            <span className="text-hype-300">Hit &ldquo;Play mix&rdquo;</span> for
            the full experience.
          </p>
        </div>

        {samples.length === 0 ? (
          <div className="vibe-card rounded-2xl p-8 text-white/60">
            No samples yet. Run{" "}
            <code className="text-hype-300">npm run gen-samples</code>.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {samples.map((s, i) => (
              <GallerySample key={s.slug} sample={s} index={i} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-auto px-6 md:px-10 py-8 text-xs border-t border-white/5 text-white/40">
        <span className="font-semibold">
          6 moments · live model · <span className="text-hype-300">turbopuffer × ElevenLabs</span>
        </span>
      </footer>
    </div>
  );
}
