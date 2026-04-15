"use client";

import { useState } from "react";
import { Flame, Zap } from "lucide-react";

const EXAMPLES = [
  { label: "Job interview", text: "I'm about to walk into an interview for the job I've wanted for three years. My hands won't stop shaking." },
  { label: "Quitting", text: "I'm about to tell my boss I'm quitting. I've rehearsed it for weeks. I've never done this before." },
  { label: "First date", text: "First date in 20 minutes with someone who's way out of my league. I don't know what to say." },
  { label: "Hard conversation", text: "I'm about to tell my best friend something that might end our friendship. I'm outside their door." },
  { label: "Big race", text: "Half marathon starts in 30 minutes. I trained for 6 months. I've never done anything this hard." },
  { label: "Asking them out", text: "I'm finally texting them back to ask if they want to get dinner. I've typed and deleted this message 40 times." },
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
    <div className="flex flex-col gap-4">
      <div className="vibe-card rounded-3xl p-4 md:p-5 focus-within:border-vibe-400/40 transition">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="I'm about to..."
          rows={4}
          disabled={loading}
          className="w-full bg-transparent text-white placeholder:text-white/30 text-lg md:text-xl resize-none outline-none disabled:opacity-60"
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
          </div>
          <button
            onClick={submit}
            disabled={value.trim().length < 3 || loading}
            className="btn-primary rounded-xl px-5 py-2.5 flex items-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Loading the hype...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                <span>Hype me up</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-white/40 mr-1">i&apos;m about to:</span>
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
