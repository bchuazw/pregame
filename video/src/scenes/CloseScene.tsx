import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 14 } });
  const urlOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });
  const footerOpacity = interpolate(frame, [90, 130], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 220,
          lineHeight: 0.9,
          color: "#fef3c7",
          textShadow:
            "0 0 60px rgba(252,211,77,0.7), 0 0 120px rgba(236,72,153,0.35)",
          transform: `scale(${s}) rotate(-2deg)`,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Walk in ready.
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: urlOpacity,
          fontSize: 36,
          color: "#fafaf7",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        <span style={{ color: "#fcd34d" }}>→</span>
        pregame-pthi.onrender.com
      </div>

      <div
        style={{
          display: "flex",
          gap: 30,
          opacity: footerOpacity,
          marginTop: 20,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#22d3ee" }}>turbopuffer</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>×</span>
        <span style={{ color: "#ec4899" }}>elevenlabs</span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 16,
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: footerOpacity,
        }}
      >
        ★ built for #ElevenHacks ★
      </div>
    </AbsoluteFill>
  );
};
