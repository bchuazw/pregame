"use client";

import { useState } from "react";
import { MomentInput } from "@/components/MomentInput";
import { HypeResult } from "@/components/HypeResult";
import { LoadingState } from "@/components/LoadingState";
import { Marquee } from "@/components/Marquee";
import type { HypeResult as HypeResultData } from "@/lib/types";
import {
  RotateCcw,
  Flame,
  Zap,
  Headphones,
  Radio,
  Sparkles,
  Clock,
  Users,
  Search,
} from "lucide-react";

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
      <Marquee />

      <header className="px-6 md:px-10 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 badge-ring rounded-xl animate-spin-slow opacity-90" />
            <div className="absolute inset-[3px] bg-ink rounded-[9px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-hype-300" />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-2xl">Pre-Game</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-hype-300/70">
              a soundtrack for right-before
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <a
            href="/gallery"
            className="sticker sticker-hype !py-1.5 !px-3 !text-[11px]"
          >
            <Headphones className="w-3.5 h-3.5" /> Gallery
          </a>
          <div className="hidden md:flex items-center gap-2 text-white/40">
            <span className="uppercase tracking-[0.25em] text-hype-300">turbopuffer</span>
            <span className="text-white/20">×</span>
            <span className="uppercase tracking-[0.25em] text-flame-400">elevenlabs</span>
          </div>
        </div>
      </header>

      <section className="flex-1 px-6 md:px-10 py-8 md:py-16 max-w-5xl mx-auto w-full">
        {!result && !loading && (
          <div className="animate-fade-in flex flex-col gap-14">
            {/* HERO */}
            <div className="flex flex-col gap-6 relative">
              <div className="absolute -top-8 -right-6 md:right-10 rotate-6 opacity-80 pointer-events-none hidden sm:block">
                <div className="tape animate-wobble">★ LIVE · RIGHT NOW ★</div>
              </div>

              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-gradient-to-r from-flame-500/20 to-hype-400/20 border border-flame-400/30 text-xs text-flame-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-flame-400 animate-pulse" />
                <span className="uppercase tracking-[0.25em]">live hype line</span>
              </div>

              <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tight">
                The moment
                <br />
                right before
                <br />
                <span className="gradient-hype italic animate-glitch-x">deserves a soundtrack.</span>
              </h1>

              <p className="text-lg md:text-2xl text-white/70 max-w-3xl leading-relaxed">
                Tell us what you&apos;re about to do. We&apos;ll score it —
                <span className="text-hype-200"> original music</span>,
                <span className="text-flame-400"> punchy SFX</span>, and a
                <span className="text-cyber-300"> live board</span> of who else
                is right here with you.
              </p>
            </div>

            {/* INPUT */}
            <MomentInput onSubmit={submit} loading={loading} />

            {error && (
              <div className="vibe-card rounded-2xl p-4 border-flame-400/40 text-flame-300 text-sm">
                {error}
              </div>
            )}

            {/* HOW IT WORKS */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="tape">the drop</span>
                <div className="h-px flex-1 bg-gradient-to-r from-hype-400/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard
                  icon={<Sparkles className="w-5 h-5" />}
                  color="hype"
                  num="01"
                  title="Read the moment"
                  body="GPT-4o reads what you're walking into. Interview panic ≠ race-day fear ≠ first-date butterflies."
                />
                <FeatureCard
                  icon={<Zap className="w-5 h-5" />}
                  color="flame"
                  num="02"
                  title="Score it live"
                  body="ElevenLabs Music composes your track. SFX lands like a stadium stinger. 20 seconds of exactly-you."
                />
                <FeatureCard
                  icon={<Radio className="w-5 h-5" />}
                  color="cyber"
                  num="03"
                  title="You're not alone"
                  body="turbopuffer finds who else is here right now — a live semantic map of anticipation."
                />
              </div>
            </div>

            {/* TURBOPUFFER SECTION */}
            <TurbopufferSection />
          </div>
        )}

        {loading && <LoadingState />}

        {result && (
          <div className="flex flex-col gap-6">
            <HypeResult result={result} />
            <button
              onClick={reset}
              className="self-center flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Another moment
            </button>
          </div>
        )}
      </section>

      <footer className="px-6 md:px-10 py-8 text-xs border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-between text-white/40">
        <span className="font-semibold tracking-wide">
          Built for <span className="text-hype-300">#ElevenHacks</span> ·{" "}
          <span className="text-flame-400">turbopuffer × ElevenLabs</span>
        </span>
        <span className="italic text-hype-300">you got this.</span>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  num,
  title,
  body,
  color,
}: {
  icon: React.ReactNode;
  num: string;
  title: string;
  body: string;
  color: "hype" | "flame" | "cyber";
}) {
  const ringCls =
    color === "hype"
      ? "from-hype-400/30 to-hype-600/10 border-hype-400/30 text-hype-300"
      : color === "flame"
      ? "from-flame-500/30 to-flame-600/10 border-flame-400/40 text-flame-300"
      : "from-cyber-400/30 to-cyber-500/10 border-cyber-400/40 text-cyber-300";

  return (
    <div className={`vibe-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition bg-gradient-to-br ${ringCls}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${ringCls} border`}>
          {icon}
        </div>
        <div className="font-display text-3xl text-white/20 tabular-nums">{num}</div>
      </div>
      <div className="font-display text-xl mb-1 text-white">{title}</div>
      <div className="text-sm text-white/65 leading-relaxed">{body}</div>
    </div>
  );
}

function TurbopufferSection() {
  return (
    <div className="relative flex flex-col gap-6 mt-4">
      <div className="flex items-center gap-3">
        <span className="tape" style={{ background: "linear-gradient(180deg,#cffafe,#22d3ee)" }}>
          under the hood
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-cyber-400/40 to-transparent" />
      </div>

      <div className="vibe-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-vibe-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-400/30 to-vibe-500/30 border border-cyber-400/40 flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyber-300" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-cyber-300">
                powered by
              </div>
              <h3 className="font-display text-3xl md:text-4xl">
                How <span className="gradient-cyber italic">turbopuffer</span> works here
              </h3>
            </div>
          </div>

          <p className="text-white/70 md:text-lg max-w-3xl leading-relaxed mb-8">
            turbopuffer isn&apos;t a cache for us — it&apos;s the{" "}
            <span className="text-cyber-300 font-semibold">real-time semantic map of human anticipation</span>.
            Every moment someone types here becomes a vector, and the three queries
            below are what make Pre-Game feel alive.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PufferCard
              icon={<Sparkles className="w-5 h-5" />}
              title="1. Embed your moment"
              body="Your sentence plus the mantra, tags, and music prompt get embedded into a 512-dim vector with OpenAI text-embedding-3-small, then upserted into turbopuffer with moment_type, tags, and created_at."
              code="upsert({ id, vector, attrs: { moment_type, created_at_ms, content_preview } })"
            />
            <PufferCard
              icon={<Clock className="w-5 h-5" />}
              title="2. Live Hype Board"
              body="We query turbopuffer filtered by created_at_ms > (now - 60min) and group by moment_type client-side — that's your live feed of who's facing what, right now across the world."
              code={`filters: ["created_at_ms", "Gt", since]`}
            />
            <PufferCard
              icon={<Search className="w-5 h-5" />}
              title="3. Find your solo twin"
              body="ANN search on your vector finds the closest other person who stood exactly where you are — same fear, same stakes — and surfaces the most recent match with cosine similarity."
              code={`rank_by: ["vector", "ANN", yourVector], top_k: 10`}
            />
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between p-5 rounded-2xl bg-gradient-to-r from-cyber-500/10 via-vibe-500/10 to-flame-500/10 border border-white/5">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-cyber-300" />
              <div className="text-sm md:text-base text-white/80">
                Result: <span className="text-cyber-300 font-semibold">sub-100ms</span> semantic
                clustering of moments as they happen — no batch jobs, no caches to invalidate.
              </div>
            </div>
            <a
              href="https://turbopuffer.com"
              target="_blank"
              rel="noopener"
              className="sticker sticker-cyber self-start"
            >
              turbopuffer.com →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PufferCard({
  icon,
  title,
  body,
  code,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  code: string;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/10 hover:border-cyber-400/40 transition flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-cyber-500/20 border border-cyber-400/40 flex items-center justify-center text-cyber-300">
          {icon}
        </div>
        <div className="font-display text-lg">{title}</div>
      </div>
      <div className="text-sm text-white/65 leading-relaxed">{body}</div>
      <code className="mt-auto text-[11px] leading-relaxed font-mono bg-black/40 text-cyber-200 px-3 py-2 rounded-lg border border-white/5 break-all">
        {code}
      </code>
    </div>
  );
}
