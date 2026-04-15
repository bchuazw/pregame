import { Composition } from "remotion";
import { PreGame } from "./compositions/PreGame";

export const FPS = 60;
export const DURATION_SECONDS = 58;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PreGame"
        component={PreGame}
        durationInFrames={DURATION_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
