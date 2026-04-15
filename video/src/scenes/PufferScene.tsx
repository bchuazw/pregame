import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import { CaptionBar } from "../components/CaptionBar";

// 14s @ 60fps = 840 frames. Live semantic map of moments.
// Clusters placed inside 1080px safe area.
const MOMENT_TYPES = [
  { label: "interviews", color: "#fcd34d", target: 47, cx: 300, cy: 680 },
  { label: "quitting", color: "#ec4899", target: 19, cx: 770, cy: 720 },
  { label: "first dates", color: "#22d3ee", target: 62, cx: 280, cy: 1140 },
  { label: "hard talks", color: "#a78bfa", target: 31, cx: 790, cy: 1180 },
  { label: "races", color: "#f97316", target: 12, cx: 540, cy: 920 },
];

const NUM_DOTS = 180;

type Dot = {
  cluster: number;
  rx: number;
  ry: number;
  delay: number;
};

const DOTS: Dot[] = Array.from({ length: NUM_DOTS }).map((_, i) => {
  const cluster = Math.floor(random(`cluster-${i}`) * MOMENT_TYPES.length);
  const angle = random(`ang-${i}`) * Math.PI * 2;
  const dist = random(`dist-${i}`) * 160 + 20;
  return {
    cluster,
    rx: Math.cos(angle) * dist,
    ry: Math.sin(angle) * dist,
    delay: Math.floor(random(`delay-${i}`) * 360) + 40,
  };
});

export const PufferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 4 caption phases
  const captionPhase =
    frame < 180 ? 0 : frame < 420 ? 1 : frame < 660 ? 2 : 3;
  const captions = [
    "not just you.",
    "turbopuffer is mapping every moment.",
    "each one = a vector. live-clustered.",
    "you're never alone standing here.",
  ];

  return (
    <AbsoluteFill>
      {/* Header block */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: headerOp,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, #cffafe, #22d3ee)",
            color: "#08070d",
            padding: "10px 22px",
            fontWeight: 900,
            letterSpacing: "0.25em",
            fontSize: 20,
            textTransform: "uppercase",
            transform: "rotate(-1.5deg)",
            boxShadow: "0 0 40px rgba(34,211,238,0.7)",
          }}
        >
          ★ under the hood ★
        </div>
        <div
          style={{
            marginTop: 20,
            padding: "12px 36px",
            background: "rgba(8,7,13,0.85)",
            border: "3px solid rgba(34,211,238,0.7)",
            borderRadius: 22,
            boxShadow: "0 0 50px rgba(34,211,238,0.5)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 50,
              color: "#fafaf7",
              lineHeight: 1,
              textShadow: "0 4px 18px rgba(0,0,0,0.8)",
            }}
          >
            powered by
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 110,
              color: "#22d3ee",
              fontStyle: "italic",
              marginTop: 0,
              textShadow:
                "0 0 50px rgba(34,211,238,0.9), 0 0 120px rgba(167,139,250,0.5)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            turbopuffer
          </div>
        </div>
      </div>

      {/* Cluster boxes + dots */}
      {MOMENT_TYPES.map((m, ci) => {
        const count = Math.round(
          interpolate(frame, [60 + ci * 15, 240 + ci * 15], [0, m.target], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        );
        const labelOp = interpolate(
          frame,
          [40 + ci * 12, 70 + ci * 12],
          [0, 1],
          { extrapolateRight: "clamp" }
        );

        return (
          <div
            key={m.label}
            style={{
              position: "absolute",
              left: m.cx - 160,
              top: m.cy - 60,
              width: 320,
              opacity: labelOp,
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 20,
                background: "rgba(0,0,0,0.65)",
                border: `2px solid ${m.color}99`,
                boxShadow: `0 0 40px -5px ${m.color}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.25em",
                  color: m.color,
                  textTransform: "uppercase",
                  fontWeight: 900,
                  marginBottom: 2,
                }}
              >
                ● live
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 68,
                    color: "#fafaf7",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </div>
                <div style={{ fontSize: 24, color: "rgba(255,255,255,0.82)", fontWeight: 700 }}>
                  {m.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {DOTS.map((d, i) => {
        const local = frame - d.delay;
        if (local < 0) return null;
        const s = spring({
          frame: local,
          fps,
          config: { damping: 9, mass: 0.4 },
        });
        const m = MOMENT_TYPES[d.cluster];
        const pulse = Math.sin((frame + i * 3) / 9) * 0.3 + 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.cx + d.rx * s,
              top: m.cy + d.ry * s,
              width: 10 * pulse,
              height: 10 * pulse,
              borderRadius: 999,
              background: m.color,
              boxShadow: `0 0 16px ${m.color}`,
              opacity: s * 0.9,
            }}
          />
        );
      })}

      <CaptionBar
        text={captions[captionPhase]}
        accent="#22d3ee"
        startFrame={
          captionPhase === 0
            ? 0
            : captionPhase === 1
            ? 180
            : captionPhase === 2
            ? 420
            : 660
        }
      />
    </AbsoluteFill>
  );
};
