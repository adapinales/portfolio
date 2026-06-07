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
import { Callouts, type Callout } from "./components/Callouts";

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
        // No captions yet — render the video + graphics anyway.
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
        // No callouts file — that's fine, just skip them.
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
      {/* Footage */}
      <Sequence durationInFrames={videoFrames}>
        <OffthreadVideo src={staticFile(videoFile)} />
      </Sequence>

      {/* Pop-up corner callout cards over the footage */}
      <Sequence durationInFrames={videoFrames}>
        <Callouts callouts={callouts} />
      </Sequence>

      {/* Auto captions (clean subtitles) over the footage */}
      <Sequence durationInFrames={videoFrames}>
        <Captions captions={captions} />
      </Sequence>

      {/* Branded intro title card */}
      <Sequence durationInFrames={introFrames}>
        <IntroCard {...intro} />
      </Sequence>

      {/* Lower-third with presenter name */}
      <Sequence from={lowerStart} durationInFrames={lowerFrames}>
        <LowerThird {...lowerThird} />
      </Sequence>

      {/* Branded outro / CTA appended after the footage */}
      <Sequence from={videoFrames} durationInFrames={outroFrames}>
        <Outro {...outro} />
      </Sequence>
    </AbsoluteFill>
  );
};
