import {
  AbsoluteFill,
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// 15s Seedance clip with Remotion text overlays that build the hook.
// Clip plays full-bleed, muted. Dark vignette + bottom gradient for text legibility.
export const OpenerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hook lands at frame 0 so there's never silent B-roll.
  //   ~0s    "when did today slip away?"  (hook)
  //   ~2.5s  "some days don't need words."
  //   ~6.5s  "just a soundtrack."
  //  ~10.5s  "what if AI scored yours?"
  const hookIn = 0;
  const hookOut = 150;
  const line1In = 150;   // 2.5s
  const line1Out = 360;  // 6s
  const line2In = 390;   // 6.5s
  const line2Out = 600;  // 10s
  const line3In = 630;   // 10.5s
  const line3Out = 900;  // 15s (ride to cut)

  const lhook = fadeBand(frame, hookIn, hookOut);
  const l1 = fadeBand(frame, line1In, line1Out);
  const l2 = fadeBand(frame, line2In, line2Out);
  const l3 = fadeBand(frame, line3In, line3Out);

  // Hook word-by-word reveal: "when did today slip away?"
  const hookWords = ["when", "did", "today", "slip", "away?"];
  const hookWordAt = (i: number) =>
    interpolate(frame, [8 + i * 12, 20 + i * 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const l3Scale = spring({
    frame: frame - line3In,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // Tiny SoundPost watermark bottom-right shows up at the end
  const markOp = interpolate(frame, [750, 860], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* The Seedance cinematic shot — scaled up + shifted to clip the top-left "Ai" watermark */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Video
          src={staticFile("seedance/opener.mp4")}
          muted
          startFrom={0}
          style={{
            position: "absolute",
            top: "-9%",
            left: "-9%",
            width: "118%",
            height: "118%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Top vignette for readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,7,13,0.55) 0%, transparent 35%, transparent 60%, rgba(8,7,13,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* HOOK — lands at frame 0, word-by-word reveal. No silent B-roll. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          textAlign: "center",
          opacity: lhook,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            color: "#fff",
            fontSize: 96,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            textTransform: "lowercase",
            textShadow:
              "0 6px 30px rgba(0,0,0,0.95), 0 0 60px rgba(252,211,77,0.35)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 24px",
          }}
        >
          {hookWords.map((w, i) => (
            <span
              key={i}
              style={{
                opacity: hookWordAt(i),
                transform: `translateY(${(1 - hookWordAt(i)) * 14}px)`,
                color: i === hookWords.length - 1 ? "#fcd34d" : "#fff",
                fontStyle: i === hookWords.length - 1 ? "italic" : "normal",
                fontFamily:
                  i === hookWords.length - 1
                    ? "'Instrument Serif', Georgia, serif"
                    : undefined,
                fontWeight: i === hookWords.length - 1 ? 400 : 900,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Line 1 — small, lower third, quiet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 540,
          textAlign: "center",
          opacity: l1,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            color: "#fef3c7",
            fontSize: 64,
            lineHeight: 1.1,
            textShadow:
              "0 4px 24px rgba(0,0,0,0.9), 0 0 40px rgba(252,211,77,0.25)",
            letterSpacing: "-0.01em",
          }}
        >
          some days don&rsquo;t need words.
        </div>
      </div>

      {/* Line 2 — same position, slightly brighter */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 540,
          textAlign: "center",
          opacity: l2,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            color: "#fcd34d",
            fontSize: 72,
            lineHeight: 1.1,
            textShadow:
              "0 4px 24px rgba(0,0,0,0.9), 0 0 40px rgba(252,211,77,0.45)",
            letterSpacing: "-0.01em",
          }}
        >
          just a soundtrack.
        </div>
      </div>

      {/* Line 3 — bigger, centered, builds into the cut */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: l3,
          padding: "0 70px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 900,
            color: "#fff",
            fontSize: 110,
            lineHeight: 0.95,
            textShadow:
              "0 6px 30px rgba(0,0,0,0.95), 0 0 60px rgba(252,211,77,0.4)",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            transform: `scale(${0.92 + l3Scale * 0.08})`,
          }}
        >
          what if AI <br />
          <span
            style={{
              fontStyle: "italic",
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              color: "#fcd34d",
              textTransform: "lowercase",
            }}
          >
            scored yours?
          </span>
        </div>
      </div>

      {/* SoundPost mark bottom-right toward the end */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: markOp,
        }}
      >
        <div
          style={{
            padding: "10px 22px",
            background: "rgba(252,211,77,0.95)",
            color: "#08070d",
            fontWeight: 900,
            letterSpacing: "0.3em",
            fontSize: 20,
            textTransform: "uppercase",
            boxShadow: "0 0 40px rgba(252,211,77,0.5)",
          }}
        >
          ◆ SoundPost
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Simple fade-in/fade-out band: 0 before in, ramp up, 1 between, ramp down, 0 after out.
function fadeBand(frame: number, inFrame: number, outFrame: number): number {
  const FADE = 20;
  if (frame < inFrame) return 0;
  if (frame > outFrame) return 0;
  const fadeIn = Math.min(1, (frame - inFrame) / FADE);
  const fadeOut = Math.min(1, (outFrame - frame) / FADE);
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
}
