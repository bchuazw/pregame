import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// 11s close / CTA. "Walk in ready." → URL → brands. Safe-zone tuned.
export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagOp = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });
  const walkScale = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const urlOp = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const urlPulse = 1 + Math.sin(frame / 10) * 0.03;
  const ctaOp = interpolate(frame, [180, 220], [0, 1], { extrapolateRight: "clamp" });
  const footerOp = interpolate(frame, [330, 370], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
        textAlign: "center",
        gap: 36,
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: "0.22em",
          color: "#fcd34d",
          fontWeight: 900,
          textTransform: "uppercase",
          opacity: tagOp,
          maxWidth: 940,
        }}
      >
        ★ meet your hypeman ★
      </div>

      <div
        style={{
          padding: "24px 60px",
          background: "rgba(8,7,13,0.85)",
          border: "4px solid rgba(252,211,77,0.7)",
          borderRadius: 32,
          transform: `scale(${walkScale}) rotate(-2deg)`,
          boxShadow:
            "0 0 80px rgba(252,211,77,0.5), inset 0 0 40px rgba(236,72,153,0.15)",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 200,
            lineHeight: 0.88,
            color: "#fef3c7",
            textShadow:
              "0 0 60px rgba(252,211,77,0.9), 0 0 140px rgba(236,72,153,0.5)",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          go
          <br />
          do it.
        </div>
      </div>

      <div
        style={{
          marginTop: 8,
          padding: "22px 32px",
          borderRadius: 20,
          background: "linear-gradient(180deg, #fcd34d, #f97316)",
          color: "#08070d",
          fontSize: 38,
          fontWeight: 900,
          fontFamily: "ui-monospace, monospace",
          opacity: urlOp,
          transform: `scale(${urlPulse})`,
          boxShadow:
            "0 18px 0 -4px rgba(234,88,12,0.65), 0 40px 80px -20px rgba(252,211,77,0.55)",
          letterSpacing: "-0.02em",
          maxWidth: 940,
        }}
      >
        pregame-pthi.onrender.com
      </div>

      <div
        style={{
          fontSize: 40,
          fontWeight: 900,
          color: "#fafaf7",
          opacity: ctaOp,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          maxWidth: 940,
        }}
      >
        which moment are{" "}
        <span
          style={{
            color: "#ec4899",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 72,
          }}
        >
          you
        </span>{" "}
        walking into?
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 130,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: footerOp,
          alignItems: "center",
          left: 0,
          right: 0,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          ★ built for #ElevenHacks ★
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#22d3ee" }}>turbopuffer</span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>×</span>
          <span style={{ color: "#ec4899" }}>elevenlabs</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
