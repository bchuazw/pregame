import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const subOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const starRot = (frame / fps) * 90;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          fontSize: 18,
          letterSpacing: "0.5em",
          color: "#fcd34d",
          fontWeight: 800,
          transform: `scale(${scale})`,
        }}
      >
        ★ LIVE HYPE LINE ★
      </div>
      <h1
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 340,
          lineHeight: 0.9,
          margin: 0,
          color: "#fef3c7",
          textShadow:
            "0 0 60px rgba(252,211,77,0.7), 0 0 120px rgba(249,115,22,0.45)",
          transform: `rotate(-2deg) scale(${scale})`,
          fontStyle: "italic",
        }}
      >
        Pre-Game
      </h1>
      <div
        style={{
          fontSize: 32,
          color: "rgba(255,255,255,0.75)",
          opacity: subOpacity,
          letterSpacing: "0.05em",
          maxWidth: 1100,
          textAlign: "center",
        }}
      >
        a soundtrack for the moment{" "}
        <span style={{ fontStyle: "italic", color: "#fcd34d" }}>right before.</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 120,
          transform: `rotate(${starRot}deg)`,
          fontSize: 80,
          opacity: subOpacity,
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 160,
          transform: `rotate(${-starRot}deg)`,
          fontSize: 60,
          opacity: subOpacity,
          color: "#22d3ee",
        }}
      >
        ✦
      </div>
    </AbsoluteFill>
  );
};
