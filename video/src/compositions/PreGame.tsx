import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { OpenerScene } from "../scenes/OpenerScene";
import { BrandScene } from "../scenes/BrandScene";
import { DemoScene } from "../scenes/DemoScene";
import { CallbackScene } from "../scenes/CallbackScene";
import { CloseScene } from "../scenes/CloseScene";
import { Background } from "../scenes/Background";

const FPS = 60;
const s = (n: number) => Math.round(n * FPS);

// SoundPost reel — 50s total:
//   0–15    OPENER      Seedance cinematic walk + text overlays
//   15–18   BRAND       SoundPost logo slam
//   18–34   DEMO        type day → card reveal → audio plays (16s, music breathes)
//   34–42   CALLBACKS   turbopuffer "days that felt like this"
//   42–50   CLOSE       Seedance intimate phone-at-night + URL CTA
//
// Continuous bed so we never go silent. Ducks under demo music and opener.

const END = s(50);

// Ambient bed — subtle, constant, fades at very end. No per-scene ducking
// anymore; scene dynamics come from the melody volume, not the bed.
const bedVolume = (frame: number) =>
  interpolate(frame, [0, END - 30, END], [0.13, 0.13, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Continuous melody (first-date.mp3) — one track across the whole video.
// Volume arc creates the dynamics without ever switching tracks:
//   0s   quiet intro (0.22)
//  13s   building into brand (0.32)
//  15s   brand slam — hits (0.42)
//  17s   brand held at full energy (0.42) — don't duck during the slam itself
//  18s   ducks for typing (0.22)
//  21.5s reveal surge — peak (0.78)
//  34s   callback, sustained (0.55)
//  42s   close, sustained (0.48)
//  49s   gentle fade to 0
const REVEAL_OVERALL = s(18) + 210; // DemoScene REVEAL frame in overall timeline
const melodyVolume = (frame: number) =>
  interpolate(
    frame,
    [
      0,
      s(13),
      s(15),
      s(17),
      s(18),
      REVEAL_OVERALL - 20,
      REVEAL_OVERALL,
      s(34),
      s(42),
      s(49),
      END,
    ],
    [0.22, 0.32, 0.42, 0.42, 0.22, 0.15, 0.78, 0.55, 0.48, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

export const PreGame: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#08070d", fontFamily: "system-ui" }}>
      {/* Background only during non-video scenes — video scenes cover it anyway */}
      <Background />

      {/* Ambient bed — subtle, continuous */}
      <Audio src={staticFile("audio/bed.mp3")} volume={bedVolume} loop />

      {/* Single continuous melody across all 50s — volume arc drives dynamics, no track-switching */}
      <Audio src={staticFile("audio/first-date.mp3")} volume={melodyVolume} loop />

      <Sequence from={0} durationInFrames={s(15)}>
        <OpenerScene />
      </Sequence>

      <Sequence from={s(15)} durationInFrames={s(3)}>
        <BrandScene />
      </Sequence>

      <Sequence from={s(18)} durationInFrames={s(16)}>
        <DemoScene
          dayText="finished the thing i'd been avoiding. ate lunch outside. the afternoon exhaled."
          headline="QUIET WIN"
          keyPhrases={[
            "finished the thing",
            "ate lunch outside",
            "the afternoon exhaled",
          ]}
          moodTags={["quiet relief", "warm", "earned"]}
          summary="A day that didn't announce itself. The kind you don't post about, but remember."
          paletteFrom="#6ee7b7"
          paletteTo="#06b6d4"
        />
      </Sequence>

      <Sequence from={s(34)} durationInFrames={s(8)}>
        <CallbackScene />
      </Sequence>

      <Sequence from={s(42)} durationInFrames={s(8)}>
        <CloseScene />
      </Sequence>
    </AbsoluteFill>
  );
};
