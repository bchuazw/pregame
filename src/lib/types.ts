export interface DayProfile {
  headline: string;          // 1-3 WORD uppercase title, e.g. "QUIET WIN", "CHAOS DAY"
  summary: string;           // one evocative sentence about the day
  mood_tags: string[];       // 3-4 short mood descriptors
  key_phrases: string[];     // 2-3 lines pulled from user's text to anchor the card
  energy: {
    calm: number;
    spark: number;
    depth: number;
    lightness: number;
  };
  music_prompt: string;
  sfx_prompts: string[];     // exactly 2 short stingers
  palette: {
    from: string;
    to: string;
  };
  content_preview: string;
}

export interface Callback {
  id: string;
  headline: string;
  content_preview: string;
  similarity: number;
  days_ago: number;
  created_at_iso: string;
}

export interface SoundPost {
  id: string;
  profile: DayProfile;
  music_audio_base64: string;
  sfx_audio_base64: string[];
  callbacks: Callback[];
  total_archived: number;
  created_at: string;
}
