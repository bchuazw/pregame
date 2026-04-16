"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

const EXAMPLES: { label: string; emoji: string; tone: "hype" | "pink" | "cyber" | "violet"; text: string }[] = [
  {
    label: "Quiet win",
    emoji: "🌿",
    tone: "cyber",
    text: "Nothing huge happened today. Finished the thing I'd been avoiding for two weeks. Ate lunch outside. The afternoon felt like it exhaled.",
  },
  {
    label: "Chaos day",
    emoji: "🌀",
    tone: "pink",
    text: "Missed the bus, spilled coffee on my laptop, got blindsided by a Slack message at 4pm. Ended the day laughing in the kitchen at how much went wrong.",
  },
  {
    label: "Heavy hour",
    emoji: "🌧️",
    tone: "violet",
    text: "Had the call I'd been putting off. Said what I needed to say. Walked home slowly. The city felt far away but in a good way.",
  },
  {
    label: "Bright Tuesday",
    emoji: "☀️",
    tone: "hype",
    text: "First real warm day of the year. Cycled everywhere. Bumped into an old friend at the coffee shop. Stayed up late on the roof just because I could.",
  },
  {
    label: "Slow sunday",
    emoji: "📖",
    tone: "cyber",
    text: "Didn't leave the apartment. Read half a novel. Made pasta from scratch. The kind of day you don't post about but remember.",
  },
  {
    label: "Nearly",
    emoji: "🎯",
    tone: "violet",
    text: "Pitched the idea. They almost said yes. Walked out knowing I was closer than I've ever been and further than I wanted to be.",
  },
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
              ▶ how was today
            </span>
            <span className="caret-blink text-xs" />
          </div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="a few sentences. a moment. whatever the day actually felt like."
            rows={4}
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
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scoring your day…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Score my day</span>
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
