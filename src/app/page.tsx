"use client";

import { useState } from "react";
import { MomentInput } from "@/components/MomentInput";
import { SoundPostCard } from "@/components/SoundPostCard";
import { LoadingState } from "@/components/LoadingState";
import type { SoundPost } from "@/lib/types";
import {
  RotateCcw,
  Disc3,
  Radio,
  Sparkles,
  Clock,
  Archive,
  Search,
  Music2,
} from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoundPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (content: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/post", {
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
      <header className="px-6 md:px-10 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 badge-ring rounded-xl animate-spin-slow opacity-90" />
            <div className="absolute inset-[3px] bg-ink rounded-[9px] flex items-center justify-center">
              <Disc3 className="w-5 h-5 text-hype-300" />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-2xl">SoundPost</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-hype-300/70">
              your life, with a score
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-white/40">
          <span className="uppercase tracking-[0.25em] text-hype-300">turbopuffer</span>
          <span className="text-white/20">×</span>
          <span className="uppercase tracking-[0.25em] text-flame-400">elevenlabs</span>
        </div>
      </header>

      <section className="flex-1 px-6 md:px-10 py-8 md:py-16 max-w-5xl mx-auto w-full">
        {!result && !loading && (
          <div className="animate-fade-in flex flex-col gap-14">
            {/* HERO */}
            <div className="flex flex-col gap-6 relative">
              <div className="absolute -top-8 -right-6 md:right-10 rotate-6 opacity-80 pointer-events-none hidden sm:block">
                <div className="tape animate-wobble">★ ONE CARD A DAY ★</div>
              </div>

              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-gradient-to-r from-flame-500/25 to-hype-400/25 border border-flame-400/40 text-xs text-flame-200 font-bold backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-flame-400 animate-pulse" />
                <span className="uppercase tracking-[0.25em]">ai-scored journaling · new</span>
              </div>

              <h1 className="font-display text-6xl md:text-8xl leading-[0.88] tracking-tight">
                Some days don&apos;t
                <br />
                need <span className="gradient-hype italic">words.</span>
                <br />
                <span className="text-white/85">Just a soundtrack.</span>
              </h1>

              <p className="text-lg md:text-2xl text-white/75 max-w-3xl leading-relaxed">
                Tell SoundPost what today was. It writes you a{" "}
                <span className="text-hype-200 font-semibold">custom score</span>, layers in{" "}
                <span className="text-flame-300 font-semibold">sound effects</span>, and prints a{" "}
                <span className="text-cyber-300 font-semibold">shareable card</span> — then remembers.
                Every post makes the next one sharper.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/55 font-bold">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-hype-300" /> ~20s to score</span>
                <span className="text-white/20">·</span>
                <span className="flex items-center gap-1.5"><Music2 className="w-3.5 h-3.5 text-flame-300" /> custom music + sfx</span>
                <span className="text-white/20">·</span>
                <span className="flex items-center gap-1.5"><Archive className="w-3.5 h-3.5 text-cyber-300" /> archive that compounds</span>
              </div>
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
                <span className="tape">how it works</span>
                <div className="h-px flex-1 bg-gradient-to-r from-hype-400/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard
                  icon={<Sparkles className="w-5 h-5" />}
                  color="hype"
                  num="01"
                  title="Read the day"
                  body="GPT-4o reads the temperature of what you wrote — a quiet Tuesday gets a different score than a breakthrough call."
                />
                <FeatureCard
                  icon={<Music2 className="w-5 h-5" />}
                  color="flame"
                  num="02"
                  title="Score it live"
                  body="ElevenLabs composes a 20-second track tuned to your day's mood, plus two atmospheric SFX stingers that punctuate the card."
                />
                <FeatureCard
                  icon={<Radio className="w-5 h-5" />}
                  color="cyber"
                  num="03"
                  title="Your archive remembers"
                  body="turbopuffer embeds every post. Next time you write something that rhymes, it surfaces the day it reminded it of."
                />
              </div>
            </div>

            <TurbopufferSection />
          </div>
        )}

        {loading && <LoadingState />}

        {result && (
          <div className="flex flex-col gap-6">
            <SoundPostCard result={result} />
            <button
              onClick={reset}
              className="self-center flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Score another day
            </button>
          </div>
        )}
      </section>

      <footer className="px-6 md:px-10 py-8 text-xs border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-between text-white/40">
        <span className="font-semibold tracking-wide">
          Built for <span className="text-hype-300">#ElevenHacks</span> ·{" "}
          <span className="text-flame-400">turbopuffer × ElevenLabs</span>
        </span>
        <span className="italic text-hype-300">every day deserves a soundtrack.</span>
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
                Why <span className="gradient-cyber italic">turbopuffer</span> is the spine
              </h3>
            </div>
          </div>

          <p className="text-white/70 md:text-lg max-w-3xl leading-relaxed mb-8">
            Every SoundPost is a 512-dimension vector pressed into your archive. The magic
            isn&apos;t the first one — it&apos;s the fifth, the fiftieth. Write something today and
            turbopuffer instantly finds the day from March that rhymed with it. Your
            archive becomes a{" "}
            <span className="text-cyber-300 font-semibold">searchable emotional memory</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PufferCard
              icon={<Sparkles className="w-5 h-5" />}
              title="1. Embed the day"
              body="Your text, mood tags, and music prompt get embedded via OpenAI text-embedding-3-small (512-dim), then upserted into turbopuffer with the palette, headline, and a millisecond timestamp."
              code="upsert({ id, vector, attrs: { headline, mood_tags, created_at_ms } })"
            />
            <PufferCard
              icon={<Search className="w-5 h-5" />}
              title="2. Find the callbacks"
              body="ANN search over your vector returns the top-3 most semantically similar past entries — days that felt like this one, even if they had nothing in common on the surface."
              code={`rank_by: ["vector", "ANN", vector], top_k: 5`}
            />
            <PufferCard
              icon={<Archive className="w-5 h-5" />}
              title="3. Archive compounds"
              body="No schema migrations. No cache invalidation. Every post is instantly queryable. The archive grows silently, sharpening what SoundPost can surface back to you."
              code={`ns("soundpost-v1") // your life, indexed`}
            />
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between p-5 rounded-2xl bg-gradient-to-r from-cyber-500/10 via-vibe-500/10 to-flame-500/10 border border-white/5">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-cyber-300" />
              <div className="text-sm md:text-base text-white/80">
                Result: <span className="text-cyber-300 font-semibold">sub-100ms</span>{" "}
                semantic memory recall — turned on from day one, sharper every post.
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
