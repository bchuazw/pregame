import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { HookScene } from "../scenes/HookScene";
import { SetupScene } from "../scenes/SetupScene";
import { DemoScene } from "../scenes/DemoScene";
import { PufferScene } from "../scenes/PufferScene";
import { CloseScene } from "../scenes/CloseScene";
import { Background } from "../scenes/Background";
const FPS = 60;
const s = (n: number) => Math.round(n * FPS);

// 58s total:
//   0-2.5    HOOK           (2.5s)
//   2.5-5    SETUP          (2.5s)
//   5-19     DEMO Interview (14s — music breathes)
//   19-33    DEMO First Date (14s)
//   33-47    Puffer         (14s)
//   47-58    Close          (11s)
//
// Continuous background bed at low volume so it never goes silent.
// During demo windows, bed ducks to ~0.04 so the demo music takes the spotlight.

const DEMO_1 = { start: s(5), end: s(19) };
const DEMO_2 = { start: s(19), end: s(33) };

const bedVolume = (frame: number) => {
  const inDemo1 = frame >= DEMO_1.start && frame < DEMO_1.end;
  const inDemo2 = frame >= DEMO_2.start && frame < DEMO_2.end;
  if (inDemo1 || inDemo2) return 0.05;
  return 0.32;
};

export const PreGame: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#08070d", fontFamily: "system-ui" }}>
      <Background />

      {/* Continuous bed under everything */}
      <Audio src={staticFile("audio/bed.mp3")} volume={bedVolume} loop />

      <Sequence from={0} durationInFrames={s(2.5)}>
        <HookScene />
      </Sequence>

      <Sequence from={s(2.5)} durationInFrames={s(2.5)}>
        <SetupScene />
      </Sequence>

      <Sequence from={s(5)} durationInFrames={s(14)}>
        <DemoScene
          prompt="walking into an interview for the job I've wanted for 3 years"
          momentTag="THE INTERVIEW"
          momentType="job interview"
          mantra="You are ready. Everything you are brings you to this moment."
          tags={["panic", "stakes", "steady"]}
          caption="hands shaking. brain won't stop."
          audioFile="audio/interview.mp3"
          sfxFile="audio/interview-sfx.mp3"
          paletteFrom="#fcd34d"
          paletteTo="#f97316"
        />
      </Sequence>

      <Sequence from={s(19)} durationInFrames={s(14)}>
        <DemoScene
          prompt="first date in 20 min with someone out of my league"
          momentTag="FIRST DATE"
          momentType="first date"
          mantra="Let them meet the real you — that's the only version worth showing up for."
          tags={["butterflies", "open", "playful"]}
          caption="sitting in my car. can't get out."
          audioFile="audio/first-date.mp3"
          paletteFrom="#22d3ee"
          paletteTo="#a78bfa"
        />
      </Sequence>

      <Sequence from={s(33)} durationInFrames={s(14)}>
        <PufferScene />
      </Sequence>

      <Sequence from={s(47)} durationInFrames={s(11)}>
        <CloseScene />
      </Sequence>
    </AbsoluteFill>
  );
};
