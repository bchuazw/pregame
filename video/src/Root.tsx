import { Composition } from "remotion";
import { PreGame } from "./compositions/PreGame";

export const FPS = 30;
export const DURATION_SECONDS = 85;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PreGame"
        component={PreGame}
        durationInFrames={DURATION_SECONDS * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
