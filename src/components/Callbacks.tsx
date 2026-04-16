"use client";

import type { Callback } from "@/lib/types";
import { Radio, Archive } from "lucide-react";

function whenLabel(c: Callback): string {
  if (c.days_ago === 0) return "today";
  if (c.days_ago === 1) return "yesterday";
  if (c.days_ago < 7) return `${c.days_ago}d ago`;
  if (c.days_ago < 30) return `${Math.round(c.days_ago / 7)}w ago`;
  return `${Math.round(c.days_ago / 30)}mo ago`;
}

export function Callbacks({
  callbacks,
  totalArchived,
}: {
  callbacks: Callback[];
  totalArchived: number;
}) {
  if (callbacks.length === 0) {
    return (
      <div className="vibe-card rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyber-300 font-bold mb-3">
          <Archive className="w-3.5 h-3.5" />
          your archive
        </div>
        <div className="font-display text-2xl mb-1">
          This is day one.
        </div>
        <div className="text-sm text-white/60">
          Tomorrow, SoundPost will surface days that felt like this one. The more you post, the sharper the memory.
        </div>
      </div>
    );
  }

  return (
    <div className="vibe-card rounded-3xl p-6 md:p-7 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyber-300 font-bold mb-1.5">
            <Radio className="w-3.5 h-3.5" />
            days that felt like this
          </div>
          <div className="text-sm text-white/55">
            turbopuffer found the closest matches in your archive.
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <div className="font-display text-2xl text-white tabular-nums">
            {totalArchived.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
            archived
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {callbacks.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl p-4 bg-white/[0.04] border border-white/10 hover:border-cyber-400/40 transition flex items-start gap-4"
          >
            <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 pt-1">
              <div className="font-display text-2xl text-cyber-300 tabular-nums leading-none">
                {Math.round(c.similarity * 100)}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">
                match
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-display text-base tracking-tight text-white">
                  {c.headline || "UNLABELED"}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  · {whenLabel(c)}
                </span>
              </div>
              <div className="text-sm text-white/60 italic line-clamp-2">
                &ldquo;{c.content_preview}&rdquo;
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
