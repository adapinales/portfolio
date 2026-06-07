import React from "react";
import { Composition, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { type Caption } from "@remotion/captions";

import { Lesson, type LessonProps } from "./Lesson";
import { IntroCard, introCardDefaults } from "./components/IntroCard";
import { Outro, outroDefaults } from "./components/Outro";
import { LowerThird, lowerThirdDefaults } from "./components/LowerThird";
import { brandName } from "./theme";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

// Defaults for the "Start Here" lesson. Duplicate this composition (or just
// change the props) for every module — same look, new text + footage.
const startHereProps: LessonProps = {
  videoFile: "lesson.mp4",
  captionsFile: "captions.json",
  calloutsFile: "callouts.json",
  intro: {
    title: "Start Here",
    subtitle: "Welcome to The Income Switch",
    brandLabel: brandName,
  },
  lowerThird: {
    name: "Ada Pinales",
    role: "The Income Switch",
  },
  outro: {
    title: "You're in.",
    cta: "Next up: Name What's Running The Show",
    brandLabel: brandName,
  },
  outroSeconds: 4,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Lesson"
        component={Lesson}
        defaultProps={startHereProps}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        // Duration is computed from the footage; outro is appended after it.
        durationInFrames={FPS * 60}
        calculateMetadata={async ({ props }) => {
          const outroFrames = Math.round(props.outroSeconds * FPS);
          let seconds = 60;

          // Most accurate: read the footage duration directly (isomorphic —
          // works in Studio and during render).
          try {
            const { slowDurationInSeconds } = await parseMedia({
              src: staticFile(props.videoFile),
              acknowledgeRemotionLicense: true,
              fields: { slowDurationInSeconds: true },
            });
            if (slowDurationInSeconds && slowDurationInSeconds > 0) {
              seconds = slowDurationInSeconds;
            }
          } catch {
            // Fallback: derive length from the captions if the video isn't here yet.
            try {
              const res = await fetch(staticFile(props.captionsFile));
              if (res.ok) {
                const caps: Caption[] = await res.json();
                const lastEnd = Math.max(0, ...caps.map((c) => c.endMs));
                if (lastEnd > 0) seconds = lastEnd / 1000;
              }
            } catch {
              // Keep the 60s placeholder.
            }
          }

          return {
            durationInFrames: Math.ceil(seconds * FPS) + outroFrames,
            fps: FPS,
            width: WIDTH,
            height: HEIGHT,
          };
        }}
      />

      {/* Standalone branded graphics — render these alone if you want clips. */}
      <Composition
        id="IntroCard"
        component={IntroCard}
        defaultProps={introCardDefaults}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={Math.round(FPS * 3.5)}
      />
      <Composition
        id="Outro"
        component={Outro}
        defaultProps={outroDefaults}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={FPS * 4}
      />
      <Composition
        id="LowerThird"
        component={LowerThird}
        defaultProps={lowerThirdDefaults}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={FPS * 5}
      />
    </>
  );
};
