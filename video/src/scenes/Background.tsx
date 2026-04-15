import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 1800], [0, 40]);

  return (
    <AbsoluteFill style={{ zIndex: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          filter: "blur(100px)",
          opacity: 0.9,
          transform: `translate(${drift}px, ${-drift}px)`,
          background: `
            radial-gradient(40% 35% at 20% 18%, rgba(252,211,77,0.45), transparent 60%),
            radial-gradient(42% 38% at 80% 25%, rgba(236,72,153,0.45), transparent 60%),
            radial-gradient(50% 40% at 55% 85%, rgba(34,211,238,0.40), transparent 60%),
            radial-gradient(35% 30% at 75% 65%, rgba(249,115,22,0.40), transparent 60%)
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
