import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// 2.5s HOOK — stop-the-scroll number counter + reveal
// Vertical stacked layout with dark plates so text never fights the bg.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0, 40], [0, 47], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const numPop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6 },
  });
  const subOp = interpolate(frame, [45, 70], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(frame / 4) * 0.04;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "180px 60px 60px",
        textAlign: "center",
      }}
    >
      {/* Live tag chip */}
      <div
        style={{
          background: "#ec4899",
          color: "#fff",
          fontSize: 24,
          letterSpacing: "0.3em",
          fontWeight: 900,
          padding: "10px 22px",
          textTransform: "uppercase",
          boxShadow: "0 0 30px rgba(236,72,153,0.8)",
          marginBottom: 60,
        }}
      >
        ● live right now
      </div>

      {/* Number on a dark plate so it punches against any bg */}
      <div
        style={{
          background: "rgba(8,7,13,0.85)",
          border: "4px solid rgba(252,211,77,0.6)",
          borderRadius: 32,
          padding: "20px 60px 30px",
          transform: `scale(${numPop})`,
          boxShadow:
            "0 0 80px rgba(252,211,77,0.4), inset 0 0 40px rgba(252,211,77,0.1)",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 360,
            lineHeight: 0.95,
            color: "#fef3c7",
            textShadow:
              "0 0 40px rgba(252,211,77,0.9), 0 0 100px rgba(249,115,22,0.6)",
            fontVariantNumeric: "tabular-nums",
            fontStyle: "italic",
          }}
        >
          {count}
        </div>
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: "#fafaf7",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          opacity: subOp,
          textTransform: "lowercase",
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        }}
      >
        people are walking into
      </div>

      {/* Bottom plate for the moment word */}
      <div
        style={{
          marginTop: 18,
          padding: "14px 36px",
          background: "rgba(8,7,13,0.8)",
          border: "3px solid rgba(252,211,77,0.7)",
          borderRadius: 18,
          opacity: subOp,
          transform: `scale(${pulse})`,
          boxShadow: "0 0 50px rgba(252,211,77,0.4)",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 88,
            color: "#fcd34d",
            fontStyle: "italic",
            lineHeight: 1,
          }}
        >
          job interviews
        </div>
      </div>

      <div
        style={{
          fontSize: 38,
          fontWeight: 900,
          color: "#fafaf7",
          marginTop: 28,
          letterSpacing: "0.06em",
          opacity: subOp,
          textTransform: "uppercase",
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        }}
      >
        right this second.
      </div>
    </AbsoluteFill>
  );
};
