import {
  AbsoluteFill,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// 8s close — Seedance B-roll under Remotion text overlays + URL CTA
// 480 frames @ 60fps
export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp slams in almost immediately
  const stampScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.55 },
  });
  const stampOp = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle fades in after
  const subOp = interpolate(frame, [40, 75], [0, 1], {
    extrapolateRight: "clamp",
  });

  // URL button rises from bottom
  const urlOp = interpolate(frame, [90, 130], [0, 1], {
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(frame, [90, 140], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // URL pulse amplifies in the final 2s — draws the eye back to the CTA before fade-out
  const pulseAmp = interpolate(frame, [300, 360], [0.03, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlPulse = 1 + Math.sin(frame / 9) * pulseAmp;

  // URL glow intensifies toward the end
  const urlGlow = interpolate(frame, [300, 380], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hashtag footer — earlier so it breathes before the 50s end
  const footerOp = interpolate(frame, [180, 240], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Global soft fade-out in the last 30 frames (0.5s) so the end feels composed, not chopped
  const endFade = interpolate(frame, [450, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: endFade }}>
      {/* Seedance B-roll — scaled up + shifted to clip the top-left "Ai" watermark */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Video
          src={staticFile("seedance/close.mp4")}
          muted
          startFrom={0}
          style={{
            position: "absolute",
            top: "-9%",
            left: "-9%",
            width: "118%",
            height: "118%",
            objectFit: "cover",
            opacity: 0.7,
          }}
        />
      </AbsoluteFill>

      {/* Darken so text reads */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,7,13,0.7) 0%, rgba(8,7,13,0.35) 30%, rgba(8,7,13,0.7) 70%, rgba(8,7,13,0.92) 100%)",
        }}
      />

      {/* Hero stamp — "STOP LOSING DAYS." + "START SCORING THEM." */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: stampOp,
          transform: `scale(${stampScale})`,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "#fff",
            textTransform: "uppercase",
            textShadow: "0 6px 30px rgba(0,0,0,0.95), 0 0 60px rgba(252,211,77,0.3)",
          }}
        >
          stop losing
          <br />
          <span style={{ color: "#fcd34d" }}>days.</span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOp,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 68,
            lineHeight: 1.08,
            color: "#fcd34d",
            textShadow:
              "0 4px 24px rgba(0,0,0,0.9), 0 0 40px rgba(252,211,77,0.5)",
            letterSpacing: "-0.01em",
          }}
        >
          start scoring them.
        </div>
      </div>

      {/* ONE CARD A DAY — now the hero positioning statement */}
      <div
        style={{
          position: "absolute",
          bottom: 420,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: urlOp,
          transform: `translateY(${urlY}px) scale(${urlPulse})`,
          padding: "0 50px",
        }}
      >
        <div
          style={{
            padding: "22px 38px",
            borderRadius: 18,
            background: "linear-gradient(180deg, #ec4899, #a21caf)",
            color: "#fff",
            fontSize: 58,
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            boxShadow: `0 20px 0 -4px rgba(162,28,175,0.8), 0 40px 100px -20px rgba(236,72,153,${
              0.6 + urlGlow * 0.3
            }), 0 0 ${40 * urlGlow}px rgba(236,72,153,${urlGlow * 0.7}), 0 0 0 4px rgba(8,7,13,0.7)`,
            textShadow: "0 3px 20px rgba(0,0,0,0.6)",
          }}
        >
          ★ ONE CARD
          <br />A DAY ★
        </div>
      </div>

      {/* URL — smaller, secondary, clean */}
      <div
        style={{
          position: "absolute",
          bottom: 340,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: urlOp,
        }}
      >
        <div
          style={{
            padding: "12px 22px",
            borderRadius: 999,
            background: "rgba(252,211,77,0.14)",
            border: "2px solid #fcd34d",
            color: "#fcd34d",
            fontSize: 24,
            fontWeight: 800,
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "-0.01em",
            boxShadow: `0 0 ${24 + urlGlow * 40}px rgba(252,211,77,${0.3 + urlGlow * 0.4})`,
          }}
        >
          ▶ pregame-pthi.onrender.com
        </div>
      </div>

      {/* Hashtag footer */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: footerOp,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.6)",
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
          <span style={{ color: "rgba(255,255,255,0.3)" }}>×</span>
          <span style={{ color: "#ec4899" }}>elevenlabs</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
