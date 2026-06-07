import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, brandName } from "../theme";

export type IntroCardProps = {
  title: string;
  subtitle: string;
  brandLabel: string;
};

export const introCardDefaults: IntroCardProps = {
  title: "Start Here",
  subtitle: "Welcome to The Income Switch",
  brandLabel: brandName,
};

export const IntroCard: React.FC<IntroCardProps> = ({
  title,
  subtitle,
  brandLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  // Fade the whole card out over the last 18 frames so it dissolves into the video.
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rise = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.navy,
        justifyContent: "center",
        alignItems: "center",
        opacity: exit,
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `translateY(${rise}px)`,
          opacity: enter,
          padding: "0 120px",
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            letterSpacing: 8,
            fontSize: 30,
            color: colors.taupe,
            marginBottom: 28,
          }}
        >
          {brandLabel}
        </div>
        <div
          style={{
            width: 90,
            height: 3,
            backgroundColor: colors.taupe,
            margin: "0 auto 36px",
          }}
        />
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 110,
            lineHeight: 1.05,
            color: colors.ivory,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: 40,
            color: colors.slateBlue,
            marginTop: 28,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
