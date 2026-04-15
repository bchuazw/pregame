import { useCurrentFrame, interpolate } from "remotion";

type Props = {
  text: string;
  startFrame?: number;
  accent?: string;
};

export const CaptionBar: React.FC<Props> = ({
  text,
  startFrame = 0,
  accent = "#fcd34d",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame - startFrame,
    [0, 10, 10_000],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(
    frame - startFrame,
    [0, 15],
    [30, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 180,
        opacity,
        transform: `translateY(${y}px)`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#000",
          color: "#fff",
          fontSize: 48,
          fontWeight: 900,
          lineHeight: 1.15,
          padding: "20px 28px",
          textAlign: "center",
          maxWidth: 960,
          letterSpacing: "-0.02em",
          textTransform: "lowercase",
          boxShadow: `0 0 0 4px ${accent}, 0 0 30px ${accent}66, 0 20px 50px -10px rgba(0,0,0,0.7)`,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {text}
      </div>
    </div>
  );
};
