import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// 8s — turbopuffer's moment on camera.
// Header slam → 3 callback rows slide up in sequence → turbopuffer footer chip
// Total 480 frames @ 60fps.
type Callback = {
  headline: string;
  preview: string;
  match: number;
  when: string;
  accent: string;
};

const CALLBACKS: Callback[] = [
  {
    headline: "SLOW SUNDAY",
    preview: "made pasta from scratch, read half a novel, didn't leave the apartment...",
    match: 94,
    when: "6d ago",
    accent: "#6ee7b7",
  },
  {
    headline: "ONE GOOD HOUR",
    preview: "cycled to the market, bumped into someone I hadn't seen in years...",
    match: 88,
    when: "3w ago",
    accent: "#fcd34d",
  },
  {
    headline: "QUIET TUESDAY",
    preview: "closed the laptop at 5pm for once. walked home the long way...",
    match: 81,
    when: "2mo ago",
    accent: "#22d3ee",
  },
];

export const CallbackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.55 },
  });
  const headerOp = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pufferChipOp = interpolate(frame, [15, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#08070d",
        padding: "160px 70px 60px",
        color: "#fff",
      }}
    >
      {/* Cyber glow blob */}
      <div
        style={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 500,
          height: 500,
          background: "#22d3ee",
          borderRadius: 999,
          filter: "blur(160px)",
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          background: "#a78bfa",
          borderRadius: 999,
          filter: "blur(160px)",
          opacity: 0.22,
        }}
      />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: headerOp,
          transform: `scale(${headerScale})`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 20px",
            background: "#22d3ee",
            color: "#08070d",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 28,
            borderRadius: 4,
            boxShadow: "0 0 40px rgba(34,211,238,0.6)",
          }}
        >
          ◆ turbopuffer · ann match
        </div>
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 92,
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#fff",
            textShadow: "0 0 60px rgba(34,211,238,0.4)",
          }}
        >
          days that felt{" "}
          <span
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#22d3ee",
              textTransform: "lowercase",
              fontSize: 100,
            }}
          >
            like this one.
          </span>
        </div>
      </div>

      {/* Callback rows — stagger in */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {CALLBACKS.map((c, i) => {
          const inAt = 40 + i * 35;
          const op = interpolate(frame, [inAt, inAt + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const ty = interpolate(frame, [inAt, inAt + 25], [60, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={c.headline}
              style={{
                opacity: op,
                transform: `translateY(${ty}px)`,
                padding: "28px 32px",
                borderRadius: 26,
                background: "rgba(15,14,22,0.85)",
                border: `2.5px solid ${c.accent}55`,
                boxShadow: `0 0 40px ${c.accent}22`,
                display: "flex",
                alignItems: "center",
                gap: 30,
              }}
            >
              <div style={{ textAlign: "center", minWidth: 130 }}>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 82,
                    fontStyle: "italic",
                    lineHeight: 0.95,
                    color: c.accent,
                    textShadow: `0 0 30px ${c.accent}80`,
                  }}
                >
                  {c.match}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                  }}
                >
                  % match
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      fontWeight: 900,
                      fontSize: 40,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.headline}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: "0.22em",
                      color: "rgba(255,255,255,0.45)",
                      textTransform: "uppercase",
                    }}
                  >
                    · {c.when}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 28,
                    lineHeight: 1.3,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  &ldquo;{c.preview}&rdquo;
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: pufferChipOp,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 24px",
            background: "rgba(34,211,238,0.12)",
            border: "2px solid rgba(34,211,238,0.4)",
            borderRadius: 999,
            fontSize: 20,
            fontFamily: "ui-monospace, monospace",
            color: "#22d3ee",
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#22d3ee",
              boxShadow: "0 0 20px #22d3ee",
            }}
          />
          turbopuffer · ANN · sub-100ms · your archive, searchable
        </div>
      </div>
    </AbsoluteFill>
  );
};
