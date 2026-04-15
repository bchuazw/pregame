"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading the moment...",
  "Matching your frequency...",
  "Finding who else is here right now...",
  "Composing your hype...",
  "Loading the crowd...",
  "Almost game time...",
];

export function LoadingState() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="vibe-card rounded-3xl p-10 flex flex-col items-center gap-6 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-vibe-400/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-vibe-400 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-vibe-500/20 animate-pulse-slow" />
      </div>
      <div className="text-center">
        <div className="font-display text-2xl mb-1 typewriter-caret">
          {STAGES[idx]}
        </div>
        <div className="text-sm text-white/40">
          About 20 seconds. You got this.
        </div>
      </div>
      <div className="flex gap-1.5">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition ${
              i <= idx ? "bg-vibe-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
