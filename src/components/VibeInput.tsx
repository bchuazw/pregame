"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const PLACEHOLDERS = [
  "Paste a tweet, LinkedIn post, breakup text, corporate email, or any text that deserves a vibe check...",
  "Your last Slack message to your manager...",
  "That passive-aggressive group chat text...",
  "A Craigslist listing that felt off...",
  "Your company's mission statement...",
];

const EXAMPLES = [
  {
    label: "LinkedIn post",
    text: "Grateful and humbled to announce I'm joining @Megacorp as Chief Visionary Officer. This isn't just a job — it's a calling. To the haters: thank you for the fuel. To my real ones: I see you. Day 1, Year 1. Let's build. 🚀",
  },
  {
    label: "Breakup text",
    text: "hey so I've been thinking and I don't think we want the same things anymore. you're amazing but I need to focus on me right now. hope we can still be friends, but if you need space I understand. you'll always have a piece of my heart.",
  },
  {
    label: "Mission statement",
    text: "We believe in a future where synergy meets purpose. Our platform empowers creators to unlock their truest selves, one intentional action at a time. Disrupt boldly. Love louder. Iterate always.",
  },
];

export function VibeInput({
  onSubmit,
  loading,
}: {
  onSubmit: (content: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed.length < 3 || loading) return;
    onSubmit(trimmed);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="vibe-card rounded-3xl p-4 md:p-5 focus-within:border-vibe-400/40 transition">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={5}
          disabled={loading}
          className="w-full bg-transparent text-white placeholder:text-white/30 text-base md:text-lg resize-none outline-none disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              ⌘
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              Enter
            </kbd>
            <span className="ml-1">to submit</span>
          </div>
          <button
            onClick={submit}
            disabled={value.trim().length < 3 || loading}
            className="btn-primary rounded-xl px-5 py-2.5 flex items-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Check the vibe</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-white/40 mr-1">try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setValue(ex.text)}
            disabled={loading}
            className="chip hover:bg-white/10 transition disabled:opacity-50"
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
