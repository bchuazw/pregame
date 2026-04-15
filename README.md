# Pre-Game

The moment right before deserves a soundtrack.

Tell us what you're about to do — job interview, quitting conversation, first date, big race, hard goodbye. We score your moment with original music + sound effects, hand you a mantra, and show you in real time who else is standing exactly where you are right now.

Built for [ElevenHacks #4 — turbopuffer × ElevenLabs](https://hacks.elevenlabs.io/hackathons/3).

## How it works

1. **You tell us what's about to happen.** "I'm about to walk into an interview for the job I've wanted for three years."
2. **GPT-4o-mini reads your exact moment** — the kind of fear, the specific stakes, the energy you need (not the energy you have).
3. **ElevenLabs Music API** composes a hype track tuned to that moment. Interview panic needs steady-ness. Race day needs triumph. First date needs joy.
4. **ElevenLabs Sound Effects API** drops the punctuating moments — stadium roar, air horn, cathedral bell.
5. **turbopuffer** embeds your moment, finds the closest other person who stood here, and shows the **Live Hype Board**: how many people are heading into interviews, hard conversations, quitting moments, right now.
6. You walk in with the mantra, the soundtrack, and the knowledge that 47 other people are also about to quit their jobs.

## Why this is different

Every other entry in the hackathon is a **production tool** — for musicians, podcasters, creators. Pre-Game is **for the rest of us**, in the exact 30 seconds before the hard thing.

The turbopuffer magic isn't caching. It's **live semantic clustering of real human anticipation** — a map of what the world is nervous about right now.

## Stack

- **Frontend**: Next.js 15 (App Router), React 19 RC, Tailwind CSS
- **Analysis**: OpenAI `gpt-4o-mini` with structured JSON output
- **Embeddings**: OpenAI `text-embedding-3-small` (512 dims)
- **Vector DB**: [turbopuffer](https://turbopuffer.com/) — cosine distance, time-filtered queries for the live board
- **Audio**: [ElevenLabs Music API](https://elevenlabs.io) + [ElevenLabs Sound Effects API](https://elevenlabs.io)

## Running locally

```bash
cp .env.example .env.local
# Fill in your API keys
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

| Name | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key (for analysis + embeddings) |
| `ELEVENLABS_API_KEY` | ElevenLabs API key (Music + SFX) |
| `TURBOPUFFER_API_KEY` | turbopuffer API key |
| `TURBOPUFFER_NAMESPACE` | Namespace name (default: `pregame-hype-v1`) |
| `TURBOPUFFER_REGION` | turbopuffer region (default: `gcp-us-central1`) |

## Deploying to Render

This repo includes `render.yaml`. From the Render dashboard → New → Blueprint → connect this repo → set the three secret env vars → deploy.

## License

MIT.
