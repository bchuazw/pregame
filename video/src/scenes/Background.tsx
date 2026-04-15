import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 1800], [0, 40]);

  return (
    <AbsoluteFill style={{ zIndex: 0, overflow: "hidden", background: "#08070d" }}>
      {/* Aurora blobs (muted so text reads) */}
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          filter: "blur(120px)",
          opacity: 0.45,
          transform: `translate(${drift}px, ${-drift}px)`,
          background: `
            radial-gradient(40% 35% at 20% 18%, rgba(252,211,77,0.55), transparent 60%),
            radial-gradient(42% 38% at 80% 25%, rgba(236,72,153,0.55), transparent 60%),
            radial-gradient(50% 40% at 55% 85%, rgba(34,211,238,0.50), transparent 60%),
            radial-gradient(35% 30% at 75% 65%, rgba(249,115,22,0.50), transparent 60%)
          `,
        }}
      />
      {/* Vignette darkens edges so text against bg always reads */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(8,7,13,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
