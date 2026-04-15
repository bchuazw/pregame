"use client";

import { useState } from "react";
import { Flame, Zap } from "lucide-react";

const EXAMPLES: { label: string; emoji: string; tone: "hype" | "pink" | "cyber" | "violet"; text: string }[] = [
  { label: "Job interview", emoji: "💼", tone: "hype", text: "I'm about to walk into an interview for the job I've wanted for three years. My hands won't stop shaking." },
  { label: "Quitting", emoji: "🚪", tone: "pink", text: "I'm about to tell my boss I'm quitting. I've rehearsed it for weeks. I've never done this before." },
  { label: "First date", emoji: "🌹", tone: "pink", text: "First date in 20 minutes with someone who's way out of my league. I don't know what to say." },
  { label: "Hard conversation", emoji: "💬", tone: "violet", text: "I'm about to tell my best friend something that might end our friendship. I'm outside their door." },
  { label: "Big race", emoji: "🏃", tone: "cyber", text: "Half marathon starts in 30 minutes. I trained for 6 months. I've never done anything this hard." },
  { label: "Asking them out", emoji: "💌", tone: "hype", text: "I'm finally texting them back to ask if they want to get dinner. I've typed and deleted this message 40 times." },
];

export function MomentInput({
  onSubmit,
  loading,
}: {
  onSubmit: (content: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed.length < 3 || loading) return;
    onSubmit(trimmed);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative group">
        <div className="absolute -inset-[2px] rounded-[28px] bg-gradient-to-r from-hype-400 via-flame-500 to-cyber-400 opacity-40 blur-md group-focus-within:opacity-70 transition" />
        <div className="relative vibe-card rounded-3xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-hype-300 font-bold">
              ▶ tell us what&apos;s about to happen
            </span>
            <span className="caret-blink text-xs" />
          </div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="I'm about to..."
            rows={3}
            disabled={loading}
            className="w-full bg-transparent text-white placeholder:text-white/25 text-xl md:text-2xl font-display resize-none outline-none disabled:opacity-60 leading-snug"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">⌘</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Enter</kbd>
            </div>
            <button
              onClick={submit}
              disabled={value.trim().length < 3 || loading}
              className="btn-hype rounded-2xl px-7 py-3 flex items-center gap-2 text-base uppercase"
            >
              {loading ? (
                <>
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span>Loading the hype...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  <span>Hype me up</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold mr-1">
          try:
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setValue(ex.text)}
            disabled={loading}
            className={`sticker sticker-${ex.tone} disabled:opacity-50`}
          >
            <span className="text-base leading-none">{ex.emoji}</span>
            <span>{ex.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
