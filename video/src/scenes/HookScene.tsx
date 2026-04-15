import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

const LINES = [
  { t: 0, text: "Job interview in 5 minutes." },
  { t: 40, text: "You've waited three years for this." },
  { t: 90, text: "Your hands won't stop shaking." },
  { t: 140, text: "What do you need?" },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          alignItems: "center",
          maxWidth: 1500,
          textAlign: "center",
        }}
      >
        {LINES.map((l, i) => {
          const opacity = interpolate(
            frame,
            [l.t, l.t + 15, l.t + 50, l.t + 70],
            [0, 1, 1, i === LINES.length - 1 ? 1 : 0.35],
            { extrapolateRight: "clamp" }
          );
          const y = interpolate(frame, [l.t, l.t + 20], [20, 0], {
            extrapolateRight: "clamp",
          });
          const isLast = i === LINES.length - 1;
          return (
            <div
              key={i}
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: isLast ? 140 : 78,
                lineHeight: 1.02,
                color: isLast ? "#fef3c7" : "#fafaf7",
                fontStyle: isLast ? "italic" : "normal",
                opacity,
                transform: `translateY(${y}px)`,
                textShadow: isLast
                  ? "0 0 40px rgba(252,211,77,0.6)"
                  : "none",
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
