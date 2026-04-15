"use client";

import { useState } from "react";
import { MomentInput } from "@/components/MomentInput";
import { HypeResult } from "@/components/HypeResult";
import { LoadingState } from "@/components/LoadingState";
import type { HypeResult as HypeResultData } from "@/lib/types";
import { RotateCcw, Flame } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HypeResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (content: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/hype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 md:px-10 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg vibe-meter-fill flex items-center justify-center">
            <Flame className="w-4 h-4 text-ink" />
          </div>
          <span className="font-display text-xl">Pre-Game</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <a
            href="/gallery"
            className="uppercase tracking-widest text-vibe-300 hover:text-vibe-200 transition"
          >
            Gallery
          </a>
          <span className="text-white/20">·</span>
          <span className="hidden sm:inline">powered by</span>
          <span className="uppercase tracking-widest">turbopuffer</span>
          <span className="text-white/20">×</span>
          <span className="uppercase tracking-widest">elevenlabs</span>
        </div>
      </header>

      <section className="flex-1 px-6 md:px-10 py-8 md:py-14 max-w-4xl mx-auto w-full">
        {!result && !loading && (
          <div className="animate-fade-in flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="uppercase tracking-widest">live hype line</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
                The moment right before
                <br />
                <span className="italic text-vibe-300">deserves a soundtrack.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl">
                Tell us what you&apos;re about to do. We&apos;ll score it — original music,
                punchy sound effects, and a live look at who else is right here
                with you.
              </p>
            </div>

            <MomentInput onSubmit={submit} loading={loading} />

            {error && (
              <div className="vibe-card rounded-xl p-4 border-red-400/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FeatureCard
                num="01"
                title="Read the moment"
                body="GPT-4o reads what you're walking into. Interview panic is not race-day fear is not first-date butterflies."
              />
              <FeatureCard
                num="02"
                title="Score it live"
                body="ElevenLabs Music composes the track you need. SFX punctuation lands like an arena stinger."
              />
              <FeatureCard
                num="03"
                title="You're not alone"
                body="turbopuffer finds who else is here right now — live board of the same moment across the world."
              />
            </div>
          </div>
        )}

        {loading && <LoadingState />}

        {result && (
          <div className="flex flex-col gap-6">
            <HypeResult result={result} />
            <button
              onClick={reset}
              className="self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Another moment
            </button>
          </div>
        )}
      </section>

      <footer className="px-6 md:px-10 py-6 text-xs text-white/30 border-t border-white/5 flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
        <span>Built for #ElevenHacks · turbopuffer × ElevenLabs</span>
        <span>You got this.</span>
      </footer>
    </div>
  );
}

function FeatureCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="vibe-card rounded-2xl p-5">
      <div className="text-xs text-vibe-300 tabular-nums mb-2">{num}</div>
      <div className="font-display text-lg mb-1">{title}</div>
      <div className="text-sm text-white/60">{body}</div>
    </div>
  );
}
