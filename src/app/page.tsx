"use client";

import { useState } from "react";
import { VibeInput } from "@/components/VibeInput";
import { VibeResult } from "@/components/VibeResult";
import { LoadingState } from "@/components/LoadingState";
import type { VibeCheckResult } from "@/lib/types";
import { RotateCcw } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VibeCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (content: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/vibe-check", {
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
          <div className="w-7 h-7 rounded-lg vibe-meter-fill" />
          <span className="font-display text-xl">Vibe Check</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span className="hidden sm:inline">powered by</span>
          <span className="uppercase tracking-widest">turbopuffer</span>
          <span className="text-white/20">×</span>
          <span className="uppercase tracking-widest">elevenlabs</span>
        </div>
      </header>

      <section className="flex-1 px-6 md:px-10 py-10 md:py-16 max-w-4xl mx-auto w-full">
        {!result && !loading && (
          <div className="animate-fade-in flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
                Paste anything.
                <br />
                <span className="italic text-vibe-300">Hear its true vibe.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl">
                Drop a tweet, email, post, or text. AI reads the subtext and generates an
                original score + sound effects that expose what it{" "}
                <em>actually</em> sounds like.
              </p>
            </div>

            <VibeInput onSubmit={submit} loading={loading} />

            {error && (
              <div className="vibe-card rounded-xl p-4 border-red-400/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FeatureCard
                num="01"
                title="Semantic analysis"
                body="Reads mood, energy, subtext, and the secret feeling underneath the words."
              />
              <FeatureCard
                num="02"
                title="Original score"
                body="ElevenLabs Music API composes a unique track that interprets — not matches — the content."
              />
              <FeatureCard
                num="03"
                title="Vibe Twin"
                body="turbopuffer finds the one thing in the library that shares your exact frequency."
              />
            </div>
          </div>
        )}

        {loading && <LoadingState />}

        {result && (
          <div className="flex flex-col gap-6">
            <VibeResult result={result} />
            <button
              onClick={reset}
              className="self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Check another vibe
            </button>
          </div>
        )}
      </section>

      <footer className="px-6 md:px-10 py-6 text-xs text-white/30 border-t border-white/5 flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
        <span>Built for #ElevenHacks · turbopuffer × ElevenLabs</span>
        <span>
          Vibes are opinions. The AI is confident. Take with salt.
        </span>
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
