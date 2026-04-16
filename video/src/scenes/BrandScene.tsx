import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// 3s brand slam — hard cut from Seedance, big logo moment with audio whoosh
export const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = interpolate(frame, [0, 6, 30], [1, 0.6, 0], {
    extrapolateRight: "clamp",
  });
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 11, mass: 0.6 },
  });
  const pulse = 1 + Math.sin(frame / 6) * 0.02;

  const chipOp = interpolate(frame, [8, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const taglineOp = interpolate(frame, [40, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#08070d",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        textAlign: "center",
        gap: 28,
      }}
    >
      {/* White flash on the cut */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, #ffffff, #fcd34d 40%, transparent 80%)",
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "#fcd34d",
          color: "#08070d",
          fontSize: 24,
          letterSpacing: "0.35em",
          fontWeight: 900,
          padding: "10px 22px",
          textTransform: "uppercase",
          opacity: chipOp,
          boxShadow: "0 0 40px rgba(252,211,77,0.7)",
        }}
      >
        ◆ introducing
      </div>

      <div
        style={{
          padding: "22px 56px 30px",
          background: "rgba(8,7,13,0.92)",
          border: "4px solid rgba(252,211,77,0.75)",
          borderRadius: 32,
          transform: `scale(${logoScale * pulse})`,
          boxShadow:
            "0 0 100px rgba(252,211,77,0.55), inset 0 0 50px rgba(236,72,153,0.18)",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 200,
            lineHeight: 0.9,
            color: "#fef3c7",
            fontStyle: "italic",
            textShadow:
              "0 0 60px rgba(252,211,77,0.95), 0 0 140px rgba(236,72,153,0.55)",
            letterSpacing: "-0.02em",
          }}
        >
          SoundPost
        </div>
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: "#fafaf7",
          lineHeight: 1.08,
          maxWidth: 900,
          opacity: taglineOp,
          letterSpacing: "-0.02em",
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          textTransform: "uppercase",
        }}
      >
        your life,{" "}
        <span
          style={{
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            textTransform: "lowercase",
            color: "#fcd34d",
            fontSize: 64,
          }}
        >
          with a score.
        </span>
      </div>
    </AbsoluteFill>
  );
};
