"use client";

import type { SoundPost } from "@/lib/types";
import { AudioStack } from "./AudioStack";
import { Share2 } from "lucide-react";
import { EnergyMeter } from "./VibeMeter";
import { Callbacks } from "./Callbacks";

export function SoundPostCard({ result }: { result: SoundPost }) {
  const p = result.profile;
  const grad = `linear-gradient(150deg, ${p.palette.from}, ${p.palette.to})`;

  const handleShare = async () => {
    const shareText = `${p.headline} — my day, scored. ${p.summary}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "SoundPost", text: shareText, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      alert("Copied to clipboard");
    } catch {}
  };

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      {/* THE VERTICAL CARD — the shareable artifact */}
      <div className="flex justify-center">
        <div
          className="relative rounded-[36px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          style={{
            width: "min(100%, 420px)",
            aspectRatio: "9 / 16",
            background: "rgba(8,7,13,0.95)",
            border: `3px solid ${p.palette.from}55`,
          }}
        >
          {/* Gradient wash */}
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: grad }}
          />
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-50"
            style={{ background: p.palette.from }}
          />
          <div
            className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40"
            style={{ background: p.palette.to }}
          />

          {/* Card content */}
          <div className="relative z-10 h-full flex flex-col p-7 text-white">
            <div className="flex items-center justify-between mb-6">
              <div
                className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded"
                style={{ background: p.palette.from, color: "#08070d" }}
              >
                ◆ SoundPost
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-bold">
                {new Date(result.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-5">
              <h1
                className="font-display text-6xl md:text-7xl leading-[0.92] tracking-tight"
                style={{
                  textShadow: `0 0 60px ${p.palette.from}90, 0 4px 20px rgba(0,0,0,0.8)`,
                }}
              >
                {p.headline}
              </h1>

              {p.key_phrases.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  {p.key_phrases.slice(0, 3).map((ph, i) => (
                    <div
                      key={i}
                      className="font-display italic text-xl md:text-2xl text-white/90 leading-snug"
                      style={{
                        opacity: 1 - i * 0.15,
                      }}
                    >
                      &ldquo;{ph}&rdquo;
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.mood_tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur border border-white/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Visualizer bars */}
            <div className="flex gap-1 items-end h-10 mb-3 justify-center opacity-80">
              {Array.from({ length: 28 }).map((_, i) => {
                const h = 8 + Math.abs(Math.sin(i * 0.6)) * 32 + (i % 3) * 4;
                return (
                  <div
                    key={i}
                    className="w-1.5 rounded-full"
                    style={{
                      height: `${h}px`,
                      background: `linear-gradient(180deg, ${p.palette.from}, ${p.palette.to})`,
                    }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/60 font-bold">
              <span>soundpost · ai scored</span>
              <span>{result.total_archived.toLocaleString()} days archived</span>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIO + META STRIP */}
      <div className="vibe-card rounded-3xl p-6 md:p-7 relative">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">
              your day, scored
            </div>
            <p className="text-white/80 text-base md:text-lg italic leading-snug max-w-prose">
              &ldquo;{p.summary}&rdquo;
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 hover:bg-hype-400/20 border border-white/15 hover:border-hype-400/50 text-sm transition shrink-0 font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <div className="mb-6">
          <AudioStack
            musicB64={result.music_audio_base64}
            sfxB64s={result.sfx_audio_base64}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <EnergyMeter label="Calm" value={p.energy.calm} delay={0} />
          <EnergyMeter label="Spark" value={p.energy.spark} delay={100} />
          <EnergyMeter label="Depth" value={p.energy.depth} delay={200} />
          <EnergyMeter label="Lightness" value={p.energy.lightness} delay={300} />
        </div>
      </div>

      {/* CALLBACKS — turbopuffer's moment */}
      <Callbacks callbacks={result.callbacks} totalArchived={result.total_archived} />
    </div>
  );
}

export { SoundPostCard as HypeResult };
