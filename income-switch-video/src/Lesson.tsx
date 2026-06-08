import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import { type Caption } from "@remotion/captions";
import { colors } from "./theme";
import { IntroCard, type IntroCardProps } from "./components/IntroCard";
import { LowerThird, type LowerThirdProps } from "./components/LowerThird";
import { Outro, type OutroProps } from "./components/Outro";
import { Captions } from "./components/Captions";
import { SidePanel, type Callout } from "./components/Callouts";

// Vertical speaker video sits flush-left at full height; the branded panel
// fills the rest of the 16:9 frame to its right.
const PANEL_LEFT = 680;
const CAPTION_REGION_WIDTH = 660;

export type LessonProps = {
  videoFile: string;
  captionsFile: string;
  calloutsFile: string;
  intro: IntroCardProps;
  lowerThird: LowerThirdProps;
  outro: OutroProps;
  // Seconds of branded outro appended after the footage ends.
  outroSeconds: number;
};

export const Lesson: React.FC<LessonProps> = ({
  videoFile,
  captionsFile,
  calloutsFile,
  intro,
  lowerThird,
  outro,
  outroSeconds,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  const [captions, setCaptions] = useState<Caption[]>([]);
  const [handle] = useState(() => delayRender("loading-captions"));

  const [callouts, setCallouts] = useState<Callout[]>([]);
  const [calloutHandle] = useState(() => delayRender("loading-callouts"));

  useEffect(() => {
    fetch(staticFile(captionsFile))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Caption[]) => {
        setCaptions(Array.isArray(data) ? data : []);
        continueRender(handle);
      })
      .catch(() => {
        continueRender(handle);
      });
  }, [captionsFile, handle]);

  useEffect(() => {
    fetch(staticFile(calloutsFile))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Callout[]) => {
        setCallouts(Array.isArray(data) ? data : []);
        continueRender(calloutHandle);
      })
      .catch(() => {
        continueRender(calloutHandle);
      });
  }, [calloutsFile, calloutHandle]);

  const outroFrames = Math.round(outroSeconds * fps);
  const videoFrames = Math.max(1, durationInFrames - outroFrames);
  const introFrames = Math.round(3.5 * fps);
  const lowerStart = Math.round(2 * fps);
  const lowerFrames = Math.round(5 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      {/* Speaker video (vertical), flush-left at full height */}
      <Sequence durationInFrames={videoFrames}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(videoFile)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "auto",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Branded right-hand panel: rests on the brand lockup, swaps to callouts */}
      <Sequence durationInFrames={videoFrames}>
        <SidePanel
          callouts={callouts}
          brandTitle={intro.title}
          brandSubtitle={intro.subtitle}
          panelLeft={PANEL_LEFT}
        />
      </Sequence>

      {/* Captions, kept under the speaker (left region) */}
      <Sequence durationInFrames={videoFrames}>
        <Captions
          captions={captions}
          regionLeft={0}
          regionWidth={CAPTION_REGION_WIDTH}
          fontSize={40}
        />
      </Sequence>

      {/* Branded intro title card (full screen) */}
      <Sequence durationInFrames={introFrames}>
        <IntroCard {...intro} />
      </Sequence>

      {/* Lower-third with presenter name */}
      <Sequence from={lowerStart} durationInFrames={lowerFrames}>
        <LowerThird {...lowerThird} />
      </Sequence>

      {/* Branded outro / CTA appended after the footage (full screen) */}
      <Sequence from={videoFrames} durationInFrames={outroFrames}>
        <Outro {...outro} />
      </Sequence>
    </AbsoluteFill>
  );
};
