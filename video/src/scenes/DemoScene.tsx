import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Energy = {
  confidence: number;
  intensity: number;
  focus: number;
  courage: number;
  joy: number;
};

type Props = {
  prompt: string;
  momentTag: string;
  momentType: string;
  mantra: string;
  tags: string[];
  energy: Energy;
  audioFile: string;
  sfxFile?: string;
  sfxStartFrame?: number;
  paletteFrom: string;
  paletteTo: string;
};

const TYPING_DURATION_FRAMES = 60; // 2s
const REVEAL_FRAME = 75; // when result "drops"

export const DemoScene: React.FC<Props> = ({
  prompt,
  momentTag,
  momentType,
  mantra,
  tags,
  energy,
  audioFile,
  sfxFile,
  sfxStartFrame = 180,
  paletteFrom,
  paletteTo,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Typing effect
  const typingChars = Math.min(
    prompt.length,
    Math.floor(interpolate(frame, [0, TYPING_DURATION_FRAMES], [0, prompt.length]))
  );
  const typedText = prompt.slice(0, typingChars);
  const caretVisible = Math.floor(frame / 8) % 2 === 0;

  // Reveal spring
  const reveal = spring({
    frame: frame - REVEAL_FRAME,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const revealScale = interpolate(reveal, [0, 1], [0.7, 1]);
  const revealOpacity = interpolate(reveal, [0, 1], [0, 1]);

  // Stamp rotation wobble
  const stampRot = interpolate(
    frame - REVEAL_FRAME,
    [0, 10, 20, 30],
    [-14, 4, -3, -2],
    { extrapolateRight: "clamp" }
  );

  // Audio fade-out in last 30 frames
  const audioVolume = interpolate(
    frame,
    [0, 10, durationInFrames - 40, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <Audio src={staticFile(audioFile)} volume={audioVolume} />
      {sfxFile && (
        <Sequence from={sfxStartFrame}>
          <Audio src={staticFile(sfxFile)} volume={0.75} />
        </Sequence>
      )}

      {/* Corner tape */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 80,
          background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
          color: "#08070d",
          padding: "6px 18px",
          fontWeight: 900,
          letterSpacing: "0.2em",
          fontSize: 18,
          textTransform: "uppercase",
          transform: `rotate(${-2 + Math.sin(frame / 30) * 1.5}deg)`,
          boxShadow: `0 12px 30px -8px ${paletteFrom}`,
        }}
      >
        ★ live · {momentType} ★
      </div>

      <div style={{ display: "flex", gap: 60, height: "100%", alignItems: "stretch" }}>
        {/* LEFT: input-style card */}
        <div
          style={{
            flex: "0 0 600px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              borderRadius: 28,
              padding: 32,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: `2px solid ${paletteFrom}55`,
              boxShadow: `0 0 60px -20px ${paletteFrom}`,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: "0.3em",
                color: paletteFrom,
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              ▶ TELL US WHAT&apos;S ABOUT TO HAPPEN
            </div>
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 28,
                lineHeight: 1.35,
                color: "#fafaf7",
                minHeight: 200,
              }}
            >
              {typedText}
              {frame < TYPING_DURATION_FRAMES + 10 && caretVisible && (
                <span style={{ color: paletteFrom }}>▍</span>
              )}
            </div>
          </div>

          {frame >= REVEAL_FRAME - 5 && (
            <div
              style={{
                padding: "14px 24px",
                borderRadius: 16,
                background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
                color: "#08070d",
                fontSize: 22,
                fontWeight: 900,
                textAlign: "center",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transform: `scale(${0.95 + Math.sin(frame / 10) * 0.02})`,
                boxShadow: `0 20px 40px -10px ${paletteFrom}`,
              }}
            >
              🔥 HYPE ME UP
            </div>
          )}
        </div>

        {/* RIGHT: reveal card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
            opacity: revealOpacity,
            transform: `scale(${revealScale})`,
            transformOrigin: "left center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              letterSpacing: "0.3em",
              color: paletteFrom,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            🔥 the moment
          </div>

          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 200,
              lineHeight: 0.88,
              margin: 0,
              color: "#fef3c7",
              textShadow: `0 0 50px ${paletteFrom}99, 0 0 100px ${paletteTo}66`,
              transform: `rotate(${stampRot}deg)`,
              transformOrigin: "left center",
            }}
          >
            {momentTag}
          </h1>

          <div style={{ display: "flex", gap: 10 }}>
            {tags.map((t) => (
              <div
                key={t}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: `${paletteFrom}22`,
                  border: `1.5px solid ${paletteFrom}66`,
                  color: "#fef3c7",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: 32,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${paletteFrom}22, ${paletteTo}22)`,
              border: `1.5px solid ${paletteFrom}44`,
              position: "relative",
              marginTop: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -14,
                left: 28,
                background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
                color: "#08070d",
                padding: "4px 14px",
                fontWeight: 900,
                letterSpacing: "0.2em",
                fontSize: 13,
                textTransform: "uppercase",
                transform: "rotate(-1.5deg)",
              }}
            >
              your mantra
            </div>
            <div
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 42,
                lineHeight: 1.2,
                color: "#fafaf7",
                marginTop: 6,
              }}
            >
              &ldquo;{mantra}&rdquo;
            </div>
          </div>

          {/* Energy meters */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {(
              ["confidence", "intensity", "focus", "courage", "joy"] as const
            ).map((key, i) => {
              const target = energy[key];
              const growFrame = REVEAL_FRAME + 10 + i * 6;
              const pct = interpolate(frame, [growFrame, growFrame + 30], [0, target], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div key={key} style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      marginBottom: 6,
                      fontWeight: 700,
                    }}
                  >
                    {key}
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.1)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${paletteFrom}, ${paletteTo})`,
                        boxShadow: `0 0 10px ${paletteFrom}`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      color: "#fafaf7",
                      marginTop: 4,
                    }}
                  >
                    {Math.round(pct)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
