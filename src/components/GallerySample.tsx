"use client";

import { useRef, useState } from "react";
import { Play, Pause, Music, Sparkles } from "lucide-react";
import { EnergyMeter } from "./VibeMeter";

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
};

function formatMomentType(t: string) {
  return t.replace(/_/g, " ");
}

const TONES = ["hype", "flame", "cyber", "violet"] as const;

export function GallerySample({ sample, index = 0 }: { sample: SampleMeta; index?: number }) {
  const tone = TONES[index % TONES.length];
  const accent =
    tone === "hype"
      ? "from-hype-400/20 to-hype-600/5 border-hype-400/30"
      : tone === "flame"
      ? "from-flame-500/20 to-flame-600/5 border-flame-400/40"
      : tone === "cyber"
      ? "from-cyber-400/20 to-cyber-600/5 border-cyber-400/40"
      : "from-vibe-500/20 to-vibe-700/5 border-vibe-400/40";
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [mixing, setMixing] = useState(false);

  const playMix = async () => {
    const music = musicRef.current;
    if (!music) return;
    setMixing(true);
    music.currentTime = 0;
    sfxRefs.current.forEach((s) => {
      if (s) {
        s.currentTime = 0;
        s.pause();
      }
    });
    await music.play();

    const delays = [1200, 9000];
    sfxRefs.current.forEach((s, i) => {
      if (!s) return;
      window.setTimeout(() => {
        s.currentTime = 0;
        s.play().catch(() => {});
      }, delays[i] ?? 2000 + i * 4000);
    });

    const onEnd = () => {
      setMixing(false);
      music.removeEventListener("ended", onEnd);
    };
    music.addEventListener("ended", onEnd);
  };

  const stopAll = () => {
    musicRef.current?.pause();
    sfxRefs.current.forEach((s) => s?.pause());
    setMixing(false);
  };

  return (
    <div className={`vibe-card rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-br ${accent} hover:-translate-y-1 transition duration-300`}>
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-4 relative">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mb-2">
            {formatMomentType(sample.moment_type)}
          </div>
          <h2 className="stamp font-display text-3xl md:text-5xl leading-[0.95] tracking-tight neon-hype">
            {sample.moment_tag}
          </h2>
        </div>
        <button
          onClick={mixing ? stopAll : playMix}
          className="btn-hype rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm shrink-0 uppercase"
        >
          {mixing ? (
            <>
              <Pause className="w-4 h-4" /> Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Play mix
            </>
          )}
        </button>
      </div>

      <p className="text-white/60 text-sm md:text-base italic mb-5">
        &ldquo;{sample.content}&rdquo;
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {sample.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <div className="mb-6 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-vibe-500/15 to-pink-500/10 border border-vibe-400/20">
        <div className="text-[10px] uppercase tracking-widest text-vibe-300 mb-1.5">
          mantra
        </div>
        <div className="font-display text-lg md:text-2xl leading-snug">
          &ldquo;{sample.mantra}&rdquo;
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vibe-300">
          <Music className="w-3.5 h-3.5" />
          Original score
        </div>
        <audio
          ref={musicRef}
          src={`/${sample.music_file}`}
          controls
          preload="metadata"
          className="w-full"
        />
        <div className="text-[11px] text-white/40 italic line-clamp-2">
          {sample.music_prompt}
        </div>

        {sample.sfx_files.map((f, i) => (
          <div key={f} className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-pink-300/80">
              <Sparkles className="w-3 h-3" />
              SFX {i + 1}
            </div>
            <audio
              ref={(el) => {
                sfxRefs.current[i] = el;
              }}
              src={`/${f}`}
              controls
              preload="metadata"
              className="w-full"
            />
            <div className="text-[11px] text-white/40 italic line-clamp-2">
              {sample.sfx_prompts[i]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3 md:gap-5">
        <EnergyMeter label="Conf" value={sample.energy.confidence} delay={0} />
        <EnergyMeter label="Int" value={sample.energy.intensity} delay={80} />
        <EnergyMeter label="Focus" value={sample.energy.focus} delay={160} />
        <EnergyMeter label="Courage" value={sample.energy.courage} delay={240} />
        <EnergyMeter label="Joy" value={sample.energy.joy} delay={320} />
      </div>
    </div>
  );
}
