export interface MomentProfile {
  moment_type: string;
  moment_tag: string;
  mantra: string;
  one_liner: string;
  tags: string[];
  energy: {
    confidence: number;
    intensity: number;
    focus: number;
    courage: number;
    joy: number;
  };
  music_prompt: string;
  sfx_prompts: string[];
  content_preview: string;
}

export interface HypeBoardItem {
  moment_type: string;
  count: number;
}

export interface SoloTwin {
  id: string;
  content_preview: string;
  moment_tag: string;
  moment_type: string;
  similarity: number;
  minutes_ago: number;
}

export interface HypeResult {
  id: string;
  profile: MomentProfile;
  music_audio_base64: string;
  sfx_audio_base64: string[];
  solo_twin: SoloTwin | null;
  hype_board: HypeBoardItem[];
  live_count: number;
  league_size: number;
  created_at: string;
}
