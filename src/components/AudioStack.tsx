"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";

function base64ToDataUrl(b64: string) {
  return `data:audio/mpeg;base64,${b64}`;
}

export function AudioStack({
  musicB64,
  sfxB64s,
}: {
  musicB64: string;
  sfxB64s: string[];
}) {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const musicSrc = useMemo(
    () => (musicB64 ? base64ToDataUrl(musicB64) : ""),
    [musicB64]
  );
  const sfxSrcs = useMemo(
    () => sfxB64s.map(base64ToDataUrl),
    [sfxB64s]
  );

  useEffect(() => {
    const el = musicRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration) setProgress((el.currentTime / el.duration) * 100);
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [musicSrc]);

  const toggle = async () => {
    const music = musicRef.current;
    if (!music) return;

    if (playing) {
      music.pause();
      sfxRefs.current.forEach((r) => r?.pause());
      setPlaying(false);
      return;
    }

    music.volume = 0.55;
    music.currentTime = 0;
    await music.play().catch(() => {});
    setPlaying(true);

    sfxRefs.current.forEach((ref, i) => {
      if (!ref) return;
      ref.volume = 0.9;
      ref.currentTime = 0;
      const delay = i === 0 ? 1800 : 9500;
      setTimeout(() => {
        ref.play().catch(() => {});
      }, delay);
    });
  };

  const downloadMix = () => {
    if (!musicSrc) return;
    const a = document.createElement("a");
    a.href = musicSrc;
    a.download = "vibecheck-music.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!musicSrc && sfxSrcs.length === 0) {
    return (
      <div className="text-sm text-white/60 italic">
        Audio generation failed — try again or check API keys.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-14 h-14 rounded-full btn-primary"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </button>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="text-xs uppercase tracking-widest text-white/50">
            your vibe, scored
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full vibe-meter-fill transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={downloadMix}
          className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition"
          aria-label="Download"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <audio ref={musicRef} src={musicSrc} preload="auto" />
      {sfxSrcs.map((src, i) => (
        <audio
          key={i}
          ref={(el) => {
            sfxRefs.current[i] = el;
          }}
          src={src}
          preload="auto"
        />
      ))}
    </div>
  );
}
