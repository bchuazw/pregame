# Vibe Check

Paste anything. Hear its true vibe.

Drop a tweet, email, LinkedIn post, breakup text, or any piece of content. An AI reads the subtext and generates an original music score + sound effects that expose what it *actually* sounds like. Then turbopuffer finds your content's **Vibe Twin** in a growing library of previously-checked vibes.

Built for [ElevenHacks #4 — turbopuffer × ElevenLabs](https://hacks.elevenlabs.io/hackathons/3).

## How it works

1. **You paste content.** Any text — a tweet, an email, a Slack message, a mission statement.
2. **GPT-4o-mini reads the subtext** and returns a structured vibe profile (summary, meters, music prompt, SFX prompts).
3. **ElevenLabs Music API** composes a unique score that *interprets* the vibe — not the topic.
4. **ElevenLabs Sound Effects API** generates two editorial SFX that land like a punchline.
5. **turbopuffer** stores your vibe profile as a vector, finds the closest match in the library, and reveals your Vibe Twin.
6. The library grows with every check. The more people use it, the weirder and better the twins get.

## Stack

- **Frontend**: Next.js 15 (App Router), React 19 RC, Tailwind CSS
- **Vibe analysis**: OpenAI `gpt-4o-mini` (structured JSON output)
- **Embeddings**: OpenAI `text-embedding-3-small` (512 dims)
- **Vector DB**: [turbopuffer](https://turbopuffer.com/) (cosine distance)
- **Audio generation**: [ElevenLabs Music API](https://elevenlabs.io) + [ElevenLabs Sound Effects API](https://elevenlabs.io)

## Running locally

```bash
cp .env.example .env.local
# Fill in your API keys
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deploying to Render

This repo includes a `render.yaml` blueprint. From the Render dashboard:

1. **New → Blueprint**
2. Connect this repo.
3. Set the three secret env vars (`OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `TURBOPUFFER_API_KEY`).
4. Deploy.

## Environment variables

| Name | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key (for analysis + embeddings) |
| `ELEVENLABS_API_KEY` | ElevenLabs API key (Music + SFX) |
| `TURBOPUFFER_API_KEY` | turbopuffer API key |
| `TURBOPUFFER_NAMESPACE` | Namespace name (default: `vibecheck-library`) |
| `TURBOPUFFER_REGION` | turbopuffer region (default: `gcp-us-central1`) |

## Why turbopuffer?

turbopuffer isn't a cache here — it's the **discovery engine**. Every vibe-checked piece of content becomes a point in embedding space. When you submit a new one, turbopuffer finds the one thing in the library that shares your exact frequency.

The magic: a corporate mission statement and a Craigslist ad can end up as Vibe Twins. That cross-content connection is only possible because everything lives together in semantic space — and that's what turbopuffer is built for.

## License

MIT.
