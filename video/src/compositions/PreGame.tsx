import { AbsoluteFill, Sequence } from "remotion";
import { TitleScene } from "../scenes/TitleScene";
import { HookScene } from "../scenes/HookScene";
import { DemoScene } from "../scenes/DemoScene";
import { PufferScene } from "../scenes/PufferScene";
import { CloseScene } from "../scenes/CloseScene";
import { Background } from "../scenes/Background";
import { FPS } from "../Root";

const s = (n: number) => n * FPS;

export const PreGame: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#08070d", fontFamily: "system-ui" }}>
      <Background />

      {/* 0-4s: Title */}
      <Sequence from={0} durationInFrames={s(4)}>
        <TitleScene />
      </Sequence>

      {/* 4-10s: Hook */}
      <Sequence from={s(4)} durationInFrames={s(6)}>
        <HookScene />
      </Sequence>

      {/* 10-27s: Demo 1 — Interview (17s) */}
      <Sequence from={s(10)} durationInFrames={s(17)}>
        <DemoScene
          prompt="I'm about to walk into an interview for the job I've wanted for three years."
          momentTag="THE INTERVIEW"
          momentType="job interview"
          mantra="You are ready; everything you are brings you to this moment."
          tags={["panic", "stakes", "steady"]}
          energy={{ confidence: 55, intensity: 85, focus: 75, courage: 80, joy: 40 }}
          audioFile="audio/interview.mp3"
          sfxFile="audio/interview-sfx.mp3"
          sfxStartFrame={s(6)}
          paletteFrom="#fcd34d"
          paletteTo="#f97316"
        />
      </Sequence>

      {/* 27-42s: Demo 2 — Quitting (15s) */}
      <Sequence from={s(27)} durationInFrames={s(15)}>
        <DemoScene
          prompt="In five minutes I'm walking into my boss's office to tell him I quit."
          momentTag="LAST SHIFT"
          momentType="quitting"
          mantra="You are not running away. You are running toward yourself."
          tags={["resolve", "release", "owned"]}
          energy={{ confidence: 80, intensity: 70, focus: 90, courage: 95, joy: 60 }}
          audioFile="audio/quitting.mp3"
          paletteFrom="#ec4899"
          paletteTo="#db2777"
        />
      </Sequence>

      {/* 42-55s: Demo 3 — First Date (13s) */}
      <Sequence from={s(42)} durationInFrames={s(13)}>
        <DemoScene
          prompt="I'm sitting in my car outside the restaurant for my first date with her."
          momentTag="FIRST DATE"
          momentType="first date"
          mantra="Let them meet the real you — that's the only version worth showing up for."
          tags={["butterflies", "open", "playful"]}
          energy={{ confidence: 60, intensity: 55, focus: 50, courage: 70, joy: 90 }}
          audioFile="audio/first-date.mp3"
          paletteFrom="#22d3ee"
          paletteTo="#a78bfa"
        />
      </Sequence>

      {/* 55-75s: turbopuffer magic */}
      <Sequence from={s(55)} durationInFrames={s(20)}>
        <PufferScene />
      </Sequence>

      {/* 75-85s: Close */}
      <Sequence from={s(75)} durationInFrames={s(10)}>
        <CloseScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export { s };
