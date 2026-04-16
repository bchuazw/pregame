"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading your day...",
  "Finding the temperature...",
  "Searching your archive for echoes...",
  "Composing the score...",
  "Layering sound effects...",
  "Printing the card...",
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
    <div className="vibe-card rounded-3xl p-10 md:p-14 flex flex-col items-center gap-7 animate-fade-in relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-hype-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-flame-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-20 h-20">
        <div className="absolute inset-0 badge-ring rounded-full animate-spin opacity-90" />
        <div className="absolute inset-[3px] rounded-full bg-ink" />
        <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-hype-400/40 to-flame-500/30 animate-pulse-slow" />
      </div>

      <div className="text-center relative">
        <div className="text-[10px] uppercase tracking-[0.35em] text-hype-300 mb-3 font-bold">
          ★ scoring your day ★
        </div>
        <div className="font-display text-3xl md:text-4xl mb-2 typewriter-caret leading-tight">
          {STAGES[idx]}
        </div>
        <div className="text-sm text-white/55">
          About 20 seconds. Stay.
        </div>
      </div>

      <div className="flex gap-2">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= idx ? "bg-hype-400 w-8" : "bg-white/12 w-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
