import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const API = process.env.API_BASE ?? "https://pregame-pthi.onrender.com";
const OUT = join(process.cwd(), "public", "samples");

const SAMPLES: { slug: string; content: string }[] = [
  {
    slug: "interview",
    content:
      "I'm about to walk into an interview for the job I've wanted for three years.",
  },
  {
    slug: "quitting",
    content:
      "In five minutes I'm walking into my boss's office to tell him I quit.",
  },
  {
    slug: "first-date",
    content:
      "I'm sitting in my car outside the restaurant for my first date with her.",
  },
  {
    slug: "breakup",
    content:
      "I'm about to tell my partner of four years that I can't do this anymore.",
  },
  {
    slug: "race-day",
    content:
      "It's marathon morning. I trained for 18 weeks. The gun goes off in an hour.",
  },
  {
    slug: "ask-them-out",
    content:
      "I'm about to walk up to her and finally ask her out after six months.",
  },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const index: {
    slug: string;
    content: string;
    moment_tag: string;
    moment_type: string;
    mantra: string;
    one_liner: string;
    tags: string[];
    energy: Record<string, number>;
    music_prompt: string;
    sfx_prompts: string[];
    music_file: string;
    sfx_files: string[];
    generated_at: string;
  }[] = [];

  for (const s of SAMPLES) {
    console.log(`\n→ ${s.slug}: ${s.content}`);
    const t0 = Date.now();
    const res = await fetch(`${API}/api/hype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: s.content }),
    });
    if (!res.ok) {
      console.error(`  ✗ ${res.status}: ${await res.text()}`);
      continue;
    }
    const data = await res.json();
    const profile = data.profile;
    const dir = join(OUT, s.slug);
    await mkdir(dir, { recursive: true });

    const musicFile = `samples/${s.slug}/music.mp3`;
    await writeFile(
      join(dir, "music.mp3"),
      Buffer.from(data.music_audio_base64, "base64")
    );

    const sfxFiles: string[] = [];
    for (let i = 0; i < data.sfx_audio_base64.length; i++) {
      const name = `sfx-${i}.mp3`;
      await writeFile(
        join(dir, name),
        Buffer.from(data.sfx_audio_base64[i], "base64")
      );
      sfxFiles.push(`samples/${s.slug}/${name}`);
    }

    const meta = {
      slug: s.slug,
      content: s.content,
      moment_tag: profile.moment_tag,
      moment_type: profile.moment_type,
      mantra: profile.mantra,
      one_liner: profile.one_liner,
      tags: profile.tags,
      energy: profile.energy,
      music_prompt: profile.music_prompt,
      sfx_prompts: profile.sfx_prompts,
      music_file: musicFile,
      sfx_files: sfxFiles,
      generated_at: new Date().toISOString(),
    };
    await writeFile(join(dir, "meta.json"), JSON.stringify(meta, null, 2));
    index.push(meta);
    console.log(
      `  ✓ ${profile.moment_tag} — ${Math.round(
        Buffer.from(data.music_audio_base64, "base64").length / 1024
      )}KB music, ${sfxFiles.length} SFX — ${(Date.now() - t0) / 1000}s`
    );
  }

  await writeFile(join(OUT, "index.json"), JSON.stringify(index, null, 2));
  console.log(`\n✓ wrote ${index.length} samples to ${OUT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
