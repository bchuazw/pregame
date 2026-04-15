"use client";

import type { HypeResult as HypeResultData } from "@/lib/types";
import { EnergyMeter } from "./VibeMeter";
import { AudioStack } from "./AudioStack";
import { Confetti } from "./Confetti";
import { Share2, Users, Radio, Flame } from "lucide-react";

function formatMomentType(t: string) {
  return t.replace(/_/g, " ");
}

export function HypeResult({ result }: { result: HypeResultData }) {
  const p = result.profile;

  const handleShare = async () => {
    const shareText = `Right now I'm heading into "${p.moment_tag}". ${result.league_size.toLocaleString()} people have stood here before. Pre-Game scored my moment.`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pre-Game", text: shareText, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
        alert("Copied to clipboard");
      } catch {}
    }
  };

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div className="vibe-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-hype-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-20 w-72 h-72 bg-flame-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <Confetti />
        </div>

        <div className="flex items-start justify-between gap-4 mb-6 relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-hype-300 font-bold">
              <Flame className="w-3.5 h-3.5" />
              the moment
            </div>
            <h2 className="stamp animate-stamp neon-hype font-display text-5xl md:text-8xl leading-[0.9] tracking-tight">
              {p.moment_tag}
            </h2>
            {p.one_liner && (
              <p className="text-white/60 text-base md:text-lg italic max-w-prose">
                {p.one_liner}
              </p>
            )}
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

        <div className="mb-8 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-hype-400/15 to-flame-500/15 border border-hype-400/30 relative">
          <div className="absolute -top-3 left-6 tape">your mantra</div>
          <div className="text-xs uppercase tracking-widest text-hype-300 mb-2 opacity-0">
            your mantra
          </div>
          <div className="font-display text-2xl md:text-3xl leading-snug">
            "{p.mantra}"
          </div>
        </div>

        <div className="mb-8">
          <AudioStack
            musicB64={result.music_audio_base64}
            sfxB64s={result.sfx_audio_base64}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          <EnergyMeter label="Confidence" value={p.energy.confidence} delay={0} />
          <EnergyMeter label="Intensity" value={p.energy.intensity} delay={100} />
          <EnergyMeter label="Focus" value={p.energy.focus} delay={200} />
          <EnergyMeter label="Courage" value={p.energy.courage} delay={300} />
          <EnergyMeter label="Joy" value={p.energy.joy} delay={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="vibe-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-red-300">live</span>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vibe-300 mb-3">
            <Radio className="w-3.5 h-3.5" />
            Who&apos;s here right now
          </div>
          {result.hype_board.length > 0 ? (
            <>
              <div className="font-display text-3xl mb-1">
                {result.live_count.toLocaleString()}
                <span className="text-white/40 text-lg ml-1">
                  moments in the last hour
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                {result.hype_board.slice(0, 5).map((b) => (
                  <div key={b.moment_type} className="flex items-center justify-between text-sm">
                    <span className="text-white/80 capitalize">
                      {formatMomentType(b.moment_type)}
                    </span>
                    <span className="tabular-nums text-white/50">
                      {b.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm text-white/60">
              You&apos;re first on the board right now. Go set the tone.
            </div>
          )}
        </div>

        <div className="vibe-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vibe-300 mb-3">
            <Users className="w-3.5 h-3.5" />
            Your league
          </div>
          <div className="font-display text-3xl mb-1 capitalize">
            {result.league_size.toLocaleString()}
            <span className="text-white/40 text-lg ml-1 normal-case">
              have stood here
            </span>
          </div>
          <div className="text-sm text-white/60 capitalize">
            {formatMomentType(p.moment_type)}
          </div>
          {result.solo_twin && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
                Closest to yours
                <span className="ml-2 text-vibe-300 normal-case tracking-normal">
                  {Math.round(result.solo_twin.similarity * 100)}% match ·{" "}
                  {result.solo_twin.minutes_ago === 0
                    ? "just now"
                    : `${result.solo_twin.minutes_ago}m ago`}
                </span>
              </div>
              <div className="text-sm text-white/70 italic line-clamp-3">
                &ldquo;{result.solo_twin.content_preview}&rdquo;
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
