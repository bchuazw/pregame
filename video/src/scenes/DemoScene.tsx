import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Props = {
  dayText: string;
  headline: string;
  keyPhrases: string[];
  moodTags: string[];
  summary: string;
  paletteFrom: string;
  paletteTo: string;
};

// 16s demo at 60fps = 960 frames. Synthesis: readable typing + visible AI work.
//   0-90      prompt card + typed text (1.5s, readable at a glance)
//   90-210    AI parsing — extraction chips pop out of text, tickers, button pulses
//   210       REVEAL — music drops, card slams in
//   210-960   card lives, audio breathes (~12.5s of card)
const TYPE_END = 90;
const REVEAL = 210;

export const DemoScene: React.FC<Props> = ({
  dayText,
  headline,
  keyPhrases,
  moodTags,
  summary,
  paletteFrom,
  paletteTo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typed = dayText.slice(
    0,
    Math.floor(
      interpolate(frame, [0, TYPE_END], [0, dayText.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const caretOn = Math.floor(frame / 16) % 2 === 0;

  const reveal = spring({
    frame: frame - REVEAL,
    fps,
    config: { damping: 14, mass: 0.7 },
  });
  const cardScale = interpolate(
    frame - REVEAL,
    [0, 18, 40],
    [1.12, 0.98, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Softer flash — lower peak, slower decay. Feels like a wave, not a stab.
  const flashOp =
    frame < REVEAL
      ? 0
      : interpolate(frame - REVEAL, [0, 4, 26], [0.6, 0.35, 0], {
          extrapolateRight: "clamp",
        });

  const buttonOn = frame >= TYPE_END && frame < REVEAL;
  const buttonShake = buttonOn ? Math.sin((frame - TYPE_END) * 1.4) * 6 : 0;

  // Two tickers during generate — "finding echoes" + "composing"
  const tickerOn = frame >= TYPE_END + 20 && frame < REVEAL;

  // Music is now handled continuously at the PreGame level (single track across the whole video),
  // so this scene no longer mounts its own music track. SFX also removed earlier per user feedback.

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>

      {/* Flash */}
      {flashOp > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 45%, #ffffff, ${paletteFrom})`,
            opacity: flashOp,
            zIndex: 30,
          }}
        />
      )}

      {/* Top chip — narrates the flow so new viewers understand the product
          Step 1 (typing):     "TYPE ANY DAY"
          Step 2 (generating): "AI IS SCORING..."
          Step 3 (reveal):     "YOUR CUSTOM SCORE" */}
      {(() => {
        const step =
          frame < TYPE_END
            ? { label: "▶ 1 · TYPE YOUR DAY", key: "s1" }
            : frame < REVEAL
              ? { label: "◆ 2 · AI SCORES IT", key: "s2" }
              : { label: "✦ 3 · YOUR DAY, AS A SONG", key: "s3" };
        return (
          <div
            style={{
              position: "absolute",
              top: 100,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              key={step.key}
              style={{
                background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
                color: "#08070d",
                padding: "12px 28px",
                fontWeight: 900,
                letterSpacing: "0.24em",
                fontSize: 24,
                textTransform: "uppercase",
                transform: `rotate(${-2 + Math.sin(frame / 24) * 2}deg)`,
                boxShadow: `0 16px 40px -10px ${paletteFrom}`,
              }}
            >
              {step.label}
            </div>
          </div>
        );
      })()}

      {/* PRE-REVEAL: prompt card */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 60,
          right: 60,
          opacity: interpolate(frame, [REVEAL - 5, REVEAL + 10], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(
            frame,
            [REVEAL, REVEAL + 20],
            [0, -80],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 32,
            padding: 36,
            background: "rgba(8,7,13,0.94)",
            border: `3px solid ${paletteFrom}`,
            boxShadow: `0 0 60px -10px ${paletteFrom}, inset 0 0 40px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.3em",
              color: paletteFrom,
              fontWeight: 900,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            ▶ how was today
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 46,
              lineHeight: 1.2,
              color: "#ffffff",
              minHeight: 300,
              fontStyle: "italic",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {typed}
            {frame < TYPE_END + 10 && caretOn && (
              <span style={{ color: paletteFrom }}>▍</span>
            )}
          </div>
        </div>

        {/* SCORE MY DAY button */}
        {buttonOn && (
          <div
            style={{
              marginTop: 28,
              padding: "24px 36px",
              borderRadius: 22,
              background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
              color: "#08070d",
              fontSize: 50,
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transform: `translateX(${buttonShake}px) scale(${1 + Math.sin((frame - TYPE_END) / 3) * 0.04})`,
              boxShadow: `0 22px 0 -6px ${paletteTo}cc, 0 40px 80px -15px ${paletteFrom}, 0 0 0 4px rgba(8,7,13,0.6)`,
            }}
          >
            ✦ SCORE MY DAY
          </div>
        )}

        {/* Tickers while generating */}
        {tickerOn && (
          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: interpolate(
                frame,
                [TYPE_END + 20, TYPE_END + 40],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            <TickerRow text="searching your archive..." color="#22d3ee" />
            <TickerRow text="composing the score..." color={paletteFrom} />
          </div>
        )}
      </div>

      {/* Extraction chips — fills the empty bottom pre-reveal.
          Shows the AI pulling phrases out of the user's day, one at a time.
          Vanishes exactly at REVEAL so no overlap with the output card. */}
      {frame >= TYPE_END && frame < REVEAL && (
        <div
          style={{
            position: "absolute",
            bottom: 240,
            left: 60,
            right: 60,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            alignItems: "center",
            opacity: interpolate(
              frame,
              [REVEAL - 15, REVEAL],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 20,
              letterSpacing: "0.32em",
              color: paletteFrom,
              fontWeight: 900,
              textTransform: "uppercase",
              opacity: interpolate(
                frame,
                [TYPE_END + 10, TYPE_END + 30],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            ◆ extracted from your day
          </div>
          {keyPhrases.map((phrase, i) => {
            const showAt = TYPE_END + 25 + i * 28;
            const op = interpolate(frame, [showAt, showAt + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const tx = interpolate(frame, [showAt, showAt + 22], [-60, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: op,
                  transform: `translateX(${tx}px)`,
                  padding: "14px 26px",
                  borderRadius: 999,
                  background: "rgba(8,7,13,0.7)",
                  border: `2.5px solid ${paletteFrom}`,
                  color: "#fafaf7",
                  fontSize: 32,
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  boxShadow: `0 0 30px ${paletteFrom}55`,
                  whiteSpace: "nowrap",
                }}
              >
                &ldquo;{phrase}&rdquo;
              </div>
            );
          })}
        </div>
      )}

      {/* POST-REVEAL: the vertical card */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: reveal,
          transform: `scale(${cardScale})`,
        }}
      >
        <SoundPostCardMock
          headline={headline}
          keyPhrases={keyPhrases}
          moodTags={moodTags}
          paletteFrom={paletteFrom}
          paletteTo={paletteTo}
          frame={frame - REVEAL}
        />
      </div>

      {/* Summary subtitle under the card */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 80,
          right: 80,
          opacity: interpolate(frame - REVEAL, [60, 100], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 38,
            lineHeight: 1.25,
            color: "#fafaf7",
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.95)",
          }}
        >
          &ldquo;{summary}&rdquo;
        </div>
      </div>

      {/* Audio viz at the very bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 80,
          right: 80,
          display: "flex",
          gap: 6,
          alignItems: "flex-end",
          height: 90,
          justifyContent: "center",
          opacity: interpolate(frame - REVEAL, [30, 60], [0, 0.9], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {Array.from({ length: 32 }).map((_, i) => {
          const beat = (frame + i * 11) / 5;
          const centerBoost = 1 - Math.abs(i - 16) / 16;
          const h =
            12 + Math.abs(Math.sin(beat)) * (55 + centerBoost * 30);
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: h,
                borderRadius: 4,
                background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
                boxShadow: `0 0 12px ${paletteFrom}aa`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

function TickerRow({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        padding: "14px 22px",
        background: "rgba(8,7,13,0.85)",
        border: `2px solid ${color}55`,
        borderRadius: 14,
        color: "#fafaf7",
        fontFamily: "ui-monospace, monospace",
        fontSize: 24,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 20px ${color}`,
        }}
      />
      {text}
    </div>
  );
}

function SoundPostCardMock({
  headline,
  keyPhrases,
  moodTags,
  paletteFrom,
  paletteTo,
  frame,
}: {
  headline: string;
  keyPhrases: string[];
  moodTags: string[];
  paletteFrom: string;
  paletteTo: string;
  frame: number;
}) {
  // Phrases fade in one at a time
  const phraseOp = (i: number) =>
    interpolate(frame, [40 + i * 12, 60 + i * 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <div
      style={{
        width: 700,
        aspectRatio: "9 / 16" as unknown as number,
        borderRadius: 48,
        overflow: "hidden",
        position: "relative",
        background: "rgba(8,7,13,0.96)",
        border: `4px solid ${paletteFrom}80`,
        boxShadow: `0 0 140px ${paletteFrom}55, 0 40px 120px -20px rgba(0,0,0,0.8)`,
      }}
    >
      {/* Gradient wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(150deg, ${paletteFrom}40, ${paletteTo}40)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          background: paletteFrom,
          borderRadius: 999,
          filter: "blur(100px)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -140,
          left: -100,
          width: 420,
          height: 420,
          background: paletteTo,
          borderRadius: 999,
          filter: "blur(100px)",
          opacity: 0.45,
        }}
      />

      {/* Card content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "50px 46px",
          color: "#fff",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              background: paletteFrom,
              color: "#08070d",
              fontWeight: 900,
              letterSpacing: "0.3em",
              fontSize: 16,
              textTransform: "uppercase",
              borderRadius: 4,
            }}
          >
            ◆ SoundPost
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            APR 16
          </div>
        </div>

        {/* Big headline */}
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 130,
            lineHeight: 0.92,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#fef3c7",
            textShadow: `0 0 50px ${paletteFrom}ee, 0 0 120px ${paletteTo}70`,
            marginBottom: 36,
          }}
        >
          {headline}
        </div>

        {/* Key phrases */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {keyPhrases.map((ph, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 44,
                lineHeight: 1.15,
                color: i === 0 ? "#fff" : "rgba(255,255,255,0.8)",
                opacity: phraseOp(i),
                textShadow: "0 2px 20px rgba(0,0,0,0.7)",
              }}
            >
              &ldquo;{ph}&rdquo;
            </div>
          ))}
        </div>

        {/* Mood chips */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 26,
            opacity: interpolate(frame, [80, 110], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {moodTags.map((t) => (
            <span
              key={t}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.25)",
                color: "#fef3c7",
                fontSize: 20,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* NOW PLAYING kinetic ticker — kills dead air for muted viewers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            marginBottom: 14,
            borderRadius: 12,
            background: "rgba(0,0,0,0.45)",
            border: `2px solid ${paletteFrom}70`,
            overflow: "hidden",
            opacity: interpolate(frame, [50, 80], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#ef4444",
              boxShadow: "0 0 16px #ef4444",
              opacity: 0.5 + Math.abs(Math.sin(frame / 10)) * 0.5,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.28em",
              color: "#fff",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            NOW PLAYING
          </span>
          <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
            <div
              style={{
                display: "inline-block",
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                color: paletteFrom,
                transform: `translateX(${-((frame * 1.6) % 400)}px)`,
              }}
            >
              "the afternoon exhaled" · scored by ElevenLabs · 20s composition · your archive, your score ·&nbsp;&nbsp;&nbsp;
              "the afternoon exhaled" · scored by ElevenLabs · 20s composition · your archive, your score ·&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "flex-end",
            height: 50,
            marginBottom: 18,
            justifyContent: "center",
            opacity: 0.85,
          }}
        >
          {Array.from({ length: 26 }).map((_, i) => {
            const h = 8 + Math.abs(Math.sin((frame + i * 9) / 7)) * 40;
            return (
              <div
                key={i}
                style={{
                  width: 5,
                  height: h,
                  borderRadius: 3,
                  background: `linear-gradient(180deg, ${paletteFrom}, ${paletteTo})`,
                }}
              />
            );
          })}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 15,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            fontWeight: 800,
          }}
        >
          <span>ai scored</span>
          <span>day 1</span>
        </div>
      </div>
    </div>
  );
}
