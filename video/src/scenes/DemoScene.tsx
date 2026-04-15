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
import { CaptionBar } from "../components/CaptionBar";

type Props = {
  prompt: string;
  momentTag: string;
  momentType: string;
  mantra: string;
  tags: string[];
  caption: string;
  audioFile: string;
  sfxFile?: string;
  paletteFrom: string;
  paletteTo: string;
};

// 60fps. Demo is 14s (840 frames) — plenty of room for music to sink in.
//   0–90f     prompt types in (1.5s)
//   90–150f   HYPE button pulses (1s)
//   150f      ⚡ DROP — white flash, full-volume music, SFX stinger, stamp slams in
//   150–840f  music plays, mantra, tags, meters, audio viz all live
const TYPE_END = 90;
const REVEAL = 150;

export const DemoScene: React.FC<Props> = ({
  prompt,
  momentTag,
  momentType,
  mantra,
  tags,
  caption,
  audioFile,
  sfxFile,
  paletteFrom,
  paletteTo,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Prompt typing
  const typed = prompt.slice(
    0,
    Math.floor(
      interpolate(frame, [0, TYPE_END], [0, prompt.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const caretOn = Math.floor(frame / 16) % 2 === 0;

  // Reveal spring
  const reveal = spring({
    frame: frame - REVEAL,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Stamp rotation — overshoot wobble
  const stampRot = interpolate(
    frame - REVEAL,
    [0, 10, 20, 40, 80],
    [-22, 8, -4, -1, -2],
    { extrapolateRight: "clamp" }
  );

  // Stamp SCALE PUNCH — slams from 1.4 → 1 in 12 frames for impact
  const stampScale = interpolate(
    frame - REVEAL,
    [0, 12, 25],
    [1.4, 0.96, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // WHITE FLASH at drop frame — 6 frames decay
  const flashOp = interpolate(
    frame - REVEAL,
    [0, 2, 14],
    [0.85, 0.65, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Whole-reveal zoom punch
  const revealScale = interpolate(
    frame - REVEAL,
    [0, 20, 40],
    [1.08, 1.01, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const buttonFlash = frame >= TYPE_END && frame < REVEAL;
  const buttonShake = buttonFlash ? Math.sin((frame - TYPE_END) * 1.4) * 6 : 0;

  // Audio — HARD cut-in at REVEAL, full volume instantly. Fade only at end.
  const audioVolume = interpolate(
    frame,
    [REVEAL - 2, REVEAL, durationInFrames - 60, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile(audioFile)} volume={audioVolume} />
      {sfxFile && (
        <Sequence from={REVEAL - 3}>
          <Audio src={staticFile(sfxFile)} volume={0.85} />
        </Sequence>
      )}

      {/* WHITE FLASH on drop — viral beat-drop feel */}
      {flashOp > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 45%, #ffffff, ${paletteFrom})`,
            opacity: flashOp,
            zIndex: 30,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Live tape chip — always visible */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
            color: "#08070d",
            padding: "10px 28px",
            fontWeight: 900,
            letterSpacing: "0.22em",
            fontSize: 24,
            textTransform: "uppercase",
            transform: `rotate(${-2 + Math.sin(frame / 24) * 2}deg)`,
            boxShadow: `0 16px 40px -10px ${paletteFrom}`,
          }}
        >
          ★ live · {momentType} ★
        </div>
      </div>

      {/* PRE-REVEAL: prompt input card */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          opacity: interpolate(frame, [REVEAL - 5, REVEAL + 10], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(
            frame,
            [REVEAL, REVEAL + 20],
            [0, -80],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 32,
            padding: 36,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            border: `3px solid ${paletteFrom}66`,
            boxShadow: `0 0 60px -10px ${paletteFrom}88`,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.3em",
              color: paletteFrom,
              fontWeight: 900,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            ▶ i&apos;m about to
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 54,
              lineHeight: 1.15,
              color: "#fafaf7",
              minHeight: 340,
              fontStyle: "italic",
            }}
          >
            {typed}
            {frame < TYPE_END + 10 && caretOn && (
              <span style={{ color: paletteFrom }}>▍</span>
            )}
          </div>
        </div>

        {buttonFlash && (
          <div
            style={{
              marginTop: 28,
              padding: "24px 36px",
              borderRadius: 22,
              background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
              color: "#08070d",
              fontSize: 52,
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transform: `translateX(${buttonShake}px) scale(${1 + Math.sin((frame - TYPE_END) / 3) * 0.04})`,
              boxShadow: `0 22px 0 -6px ${paletteTo}cc, 0 40px 80px -15px ${paletteFrom}`,
            }}
          >
            🔥 HYPE ME UP
          </div>
        )}
      </div>

      {/* POST-REVEAL: moment stamp + tags + mantra */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          padding: "0 60px",
          opacity: reveal,
          transform: `scale(${revealScale})`,
        }}
      >
        {/* Moment STAMP on dark plate */}
        <div
          style={{
            background: "rgba(8,7,13,0.85)",
            border: `4px solid ${paletteFrom}`,
            borderRadius: 28,
            padding: "22px 44px",
            transform: `rotate(${stampRot}deg) scale(${stampScale})`,
            boxShadow: `0 0 80px ${paletteFrom}80, inset 0 0 40px ${paletteFrom}22`,
            maxWidth: 960,
          }}
        >
          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 150,
              lineHeight: 0.9,
              margin: 0,
              color: "#fef3c7",
              textShadow: `0 0 50px ${paletteFrom}ee, 0 0 100px ${paletteTo}88`,
              textAlign: "center",
              letterSpacing: "-0.03em",
            }}
          >
            {momentTag}
          </h1>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 960 }}>
          {tags.map((t, i) => {
            const tagOp = interpolate(
              frame - REVEAL,
              [15 + i * 6, 30 + i * 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const tagS = interpolate(
              frame - REVEAL,
              [15 + i * 6, 35 + i * 6],
              [0.6, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={t}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "rgba(8,7,13,0.85)",
                  border: `2.5px solid ${paletteFrom}`,
                  color: "#fef3c7",
                  fontSize: 28,
                  fontWeight: 800,
                  opacity: tagOp,
                  transform: `scale(${tagS})`,
                  boxShadow: `0 0 20px ${paletteFrom}55`,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>

        {/* Mantra card */}
        <div
          style={{
            padding: "32px 30px 30px",
            borderRadius: 26,
            background: "rgba(8,7,13,0.88)",
            border: `2.5px solid ${paletteFrom}`,
            position: "relative",
            boxShadow: `0 0 50px ${paletteFrom}55`,
            maxWidth: 920,
            width: "100%",
            marginTop: 6,
            opacity: interpolate(frame - REVEAL, [40, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(
              frame - REVEAL,
              [40, 70],
              [30, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -16,
              left: 28,
              background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
              color: "#08070d",
              padding: "5px 16px",
              fontWeight: 900,
              letterSpacing: "0.2em",
              fontSize: 16,
              textTransform: "uppercase",
              transform: "rotate(-2deg)",
            }}
          >
            your mantra
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 44,
              lineHeight: 1.22,
              color: "#fafaf7",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            &ldquo;{mantra}&rdquo;
          </div>
        </div>
      </div>

      {/* Audio visualizer — reacts to music beat */}
      <div
        style={{
          position: "absolute",
          bottom: 340,
          left: 60,
          right: 60,
          display: "flex",
          gap: 6,
          alignItems: "flex-end",
          height: 120,
          opacity: interpolate(frame - REVEAL, [30, 60], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          justifyContent: "center",
        }}
      >
        {Array.from({ length: 36 }).map((_, i) => {
          const beatPhase = (frame + i * 11) / 5;
          const centerBoost = 1 - Math.abs(i - 18) / 18;
          const h =
            14 +
            Math.abs(Math.sin(beatPhase)) * (70 + centerBoost * 40) +
            Math.abs(Math.sin(beatPhase / 3)) * 20;
          return (
            <div
              key={i}
              style={{
                width: 16,
                height: h,
                borderRadius: 4,
                background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
                boxShadow: `0 0 14px ${paletteFrom}aa`,
              }}
            />
          );
        })}
      </div>

      <CaptionBar text={caption} accent={paletteFrom} />
    </AbsoluteFill>
  );
};
