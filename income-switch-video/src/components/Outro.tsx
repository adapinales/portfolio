import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, brandName } from "../theme";

export type OutroProps = {
  title: string;
  cta: string;
  brandLabel: string;
};

export const outroDefaults: OutroProps = {
  title: "You're in.",
  cta: "Next up: Name What's Running The Show",
  brandLabel: brandName,
};

export const Outro: React.FC<OutroProps> = ({ title, cta, brandLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 28 });
  const rise = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.navy,
        justifyContent: "center",
        alignItems: "center",
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
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 96,
            color: colors.ivory,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 90,
            height: 3,
            backgroundColor: colors.taupe,
            margin: "32px auto",
          }}
        />
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 42,
            color: colors.slateBlue,
          }}
        >
          {cta}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            letterSpacing: 8,
            fontSize: 26,
            color: colors.taupe,
            marginTop: 70,
          }}
        >
          {brandLabel}
        </div>
      </div>
    </AbsoluteFill>
  );
};
