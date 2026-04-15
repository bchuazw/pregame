"use client";

import type { VibeCheckResult } from "@/lib/types";
import { VibeMeter } from "./VibeMeter";
import { AudioStack } from "./AudioStack";
import { Share2, Users, Sparkles } from "lucide-react";

export function VibeResult({ result }: { result: VibeCheckResult }) {
  const p = result.profile;

  const handleShare = async () => {
    const shareText = `I vibe-checked something and got: "${p.summary}" ${p.tags
      .slice(0, 2)
      .map((t) => `#${t.replace(/\s+/g, "")}`)
      .join(" ")}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Vibe Check", text: shareText, url: typeof window !== "undefined" ? window.location.href : "" });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
        alert("Copied to clipboard");
      } catch {}
    }
  };

  return (
    <div className="animate-slide-up flex flex-col gap-8">
      <div className="vibe-card rounded-3xl p-8 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">
              The vibe is...
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              {p.summary}
            </h2>
            <p className="text-white/70 text-base md:text-lg italic max-w-prose">
              {p.subtext}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {p.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        <div className="mb-8">
          <AudioStack
            musicB64={result.music_audio_base64}
            sfxB64s={result.sfx_audio_base64}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          <VibeMeter label="Energy" value={p.meters.energy} delay={0} />
          <VibeMeter label="Tension" value={p.meters.tension} delay={100} />
          <VibeMeter
            label="Pretension"
            value={p.meters.pretension}
            delay={200}
          />
          <VibeMeter
            label="Sincerity"
            value={p.meters.sincerity}
            delay={300}
          />
          <VibeMeter label="Chaos" value={p.meters.chaos} delay={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.vibe_twin ? (
          <div className="vibe-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vibe-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Vibe Twin
              <span className="text-white/40 normal-case tracking-normal">
                · {Math.round(result.vibe_twin.similarity * 100)}% match
              </span>
            </div>
            <div className="font-display text-xl mb-2">
              {result.vibe_twin.summary}
            </div>
            <div className="text-sm text-white/60 line-clamp-3 italic">
              "{result.vibe_twin.content_preview}"
            </div>
          </div>
        ) : (
          <div className="vibe-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vibe-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Vibe Twin
            </div>
            <div className="text-sm text-white/60">
              You're the first of your kind. This vibe is now in the library.
            </div>
          </div>
        )}

        <div className="vibe-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vibe-300 mb-3">
            <Users className="w-3.5 h-3.5" />
            The Library
          </div>
          <div className="font-display text-3xl mb-1">
            {result.library_size.toLocaleString()}
            <span className="text-white/40 text-lg ml-1">vibes indexed</span>
          </div>
          <div className="text-sm text-white/60">
            {result.similar_count > 0
              ? `${result.similar_count} others felt something close to this.`
              : "No close matches — this is a new frequency."}
          </div>
        </div>
      </div>
    </div>
  );
}
