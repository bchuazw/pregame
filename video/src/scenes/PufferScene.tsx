import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";

// 20-second scene. Shows the "live semantic map" of moments as dots
// clustering by moment_type, with a counter ticking up and phase labels.

const MOMENT_TYPES = [
  { label: "interviews", color: "#fcd34d", count: 47, x: 0.3, y: 0.35 },
  { label: "quitting", color: "#ec4899", count: 19, x: 0.7, y: 0.3 },
  { label: "first dates", color: "#22d3ee", count: 62, x: 0.25, y: 0.68 },
  { label: "hard talks", color: "#a78bfa", count: 31, x: 0.72, y: 0.72 },
  { label: "races", color: "#f97316", count: 12, x: 0.52, y: 0.55 },
];

const NUM_DOTS = 140;

type Dot = {
  cluster: number;
  rx: number;
  ry: number;
  delay: number;
};

const DOTS: Dot[] = Array.from({ length: NUM_DOTS }).map((_, i) => {
  const cluster = Math.floor(random(`cluster-${i}`) * MOMENT_TYPES.length);
  const angle = random(`ang-${i}`) * Math.PI * 2;
  const dist = random(`dist-${i}`) * 130 + 10;
  return {
    cluster,
    rx: Math.cos(angle) * dist,
    ry: Math.sin(angle) * dist,
    delay: Math.floor(random(`delay-${i}`) * 240),
  };
});

export const PufferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Explain labels time-phased
  const labelPhase = Math.floor(frame / 100);

  const captionIdx = Math.min(
    2,
    Math.floor(interpolate(frame, [0, 180, 360, 540], [0, 0, 1, 2], { extrapolateRight: "clamp" }))
  );
  const captions = [
    "Every moment becomes a 512-dim vector in turbopuffer.",
    "Time-filtered queries group by moment_type — that's the live board.",
    "ANN search finds your solo twin — who's standing exactly where you are.",
  ];

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg,#cffafe,#22d3ee)",
            color: "#08070d",
            padding: "6px 18px",
            fontWeight: 900,
            letterSpacing: "0.2em",
            fontSize: 16,
            textTransform: "uppercase",
            transform: "rotate(-1.5deg)",
          }}
        >
          under the hood
        </div>
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 64,
            color: "#fafaf7",
          }}
        >
          <span style={{ color: "#22d3ee", fontStyle: "italic" }}>turbopuffer</span>{" "}
          — a live map of human anticipation.
        </div>
      </div>

      {/* Cluster canvas */}
      <div style={{ position: "relative", flex: 1, marginTop: 40 }}>
        {MOMENT_TYPES.map((m, ci) => {
          const cx = width * m.x - 160;
          const cy = height * m.y - 200;

          const countIn = interpolate(frame, [60, 240], [0, m.count], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const labelOpacity = interpolate(frame, [40 + ci * 10, 60 + ci * 10], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={m.label}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                width: 320,
                opacity: labelOpacity,
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 20,
                  background: "rgba(0,0,0,0.55)",
                  border: `1.5px solid ${m.color}66`,
                  boxShadow: `0 0 40px -10px ${m.color}`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    color: m.color,
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: 2,
                  }}
                >
                  right now
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 56,
                      color: "#fafaf7",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {Math.round(countIn)}
                  </div>
                  <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }}>
                    {m.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dots */}
        {DOTS.map((d, i) => {
          const local = frame - d.delay;
          if (local < 0) return null;
          const s = spring({
            frame: local,
            fps,
            config: { damping: 10, mass: 0.4 },
          });
          const m = MOMENT_TYPES[d.cluster];
          const cx = width * m.x;
          const cy = height * m.y;
          const pulse = Math.sin((frame + i * 3) / 8) * 0.25 + 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx + d.rx * s,
                top: cy + d.ry * s,
                width: 8 * pulse,
                height: 8 * pulse,
                borderRadius: 999,
                background: m.color,
                boxShadow: `0 0 12px ${m.color}`,
                opacity: s * 0.9,
              }}
            />
          );
        })}
      </div>

      {/* Caption at bottom */}
      <div
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 42,
          color: "#fafaf7",
          textAlign: "center",
          maxWidth: 1400,
          margin: "0 auto",
          minHeight: 60,
        }}
      >
        <span style={{ color: "#22d3ee", fontStyle: "italic" }}>
          {captions[captionIdx]}
        </span>
      </div>
    </AbsoluteFill>
  );
};
