export interface VibeProfile {
  summary: string;
  subtext: string;
  tags: string[];
  meters: {
    energy: number;
    tension: number;
    pretension: number;
    sincerity: number;
    chaos: number;
  };
  music_prompt: string;
  sfx_prompts: string[];
  content_preview: string;
}

export interface VibeTwin {
  id: string;
  content_preview: string;
  summary: string;
  similarity: number;
  tags: string[];
}

export interface VibeCheckResult {
  id: string;
  profile: VibeProfile;
  music_audio_base64: string;
  sfx_audio_base64: string[];
  vibe_twin: VibeTwin | null;
  library_size: number;
  similar_count: number;
  created_at: string;
}
