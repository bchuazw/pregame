import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// 2.5s SETUP — logo + promise + CTA into first demo
export const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const tagOp = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const watchOp = interpolate(frame, [90, 115], [0, 1], { extrapolateRight: "clamp" });
  const watchPulse = 1 + Math.sin(frame / 6) * 0.04;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
        textAlign: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          background: "#fcd34d",
          color: "#08070d",
          fontSize: 22,
          letterSpacing: "0.32em",
          fontWeight: 900,
          padding: "10px 22px",
          textTransform: "uppercase",
          opacity: tagOp,
          boxShadow: "0 0 40px rgba(252,211,77,0.7)",
        }}
      >
        ★ introducing ★
      </div>

      {/* Logo on dark plate */}
      <div
        style={{
          padding: "20px 50px",
          background: "rgba(8,7,13,0.82)",
          border: "4px solid rgba(252,211,77,0.7)",
          borderRadius: 28,
          transform: `rotate(-2deg) scale(${logoScale})`,
          boxShadow:
            "0 0 80px rgba(252,211,77,0.5), inset 0 0 40px rgba(236,72,153,0.15)",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 220,
            lineHeight: 0.85,
            color: "#fef3c7",
            fontStyle: "italic",
            textShadow:
              "0 0 60px rgba(252,211,77,0.9), 0 0 140px rgba(236,72,153,0.5)",
          }}
        >
          Pre-Game
        </div>
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 900,
          color: "#fafaf7",
          lineHeight: 1.1,
          maxWidth: 900,
          opacity: tagOp,
          letterSpacing: "-0.02em",
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          marginTop: 8,
        }}
      >
        the moment right before
      </div>

      <div
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 64,
          color: "#fcd34d",
          fontStyle: "italic",
          lineHeight: 1.05,
          maxWidth: 900,
          opacity: tagOp,
          marginTop: -6,
          textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(252,211,77,0.4)",
        }}
      >
        deserves a soundtrack.
      </div>

      <div
        style={{
          marginTop: 18,
          padding: "20px 36px",
          background: "linear-gradient(180deg, #fcd34d, #f97316)",
          color: "#08070d",
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          borderRadius: 18,
          opacity: watchOp,
          transform: `scale(${watchPulse})`,
          boxShadow:
            "0 18px 0 -4px rgba(234,88,12,0.6), 0 40px 80px -20px rgba(252,211,77,0.6)",
        }}
      >
        ▶ watch this
      </div>
    </AbsoluteFill>
  );
};
