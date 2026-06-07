import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type LowerThirdProps = {
  name: string;
  role: string;
};

export const lowerThirdDefaults: LowerThirdProps = {
  name: "Ada Pinales",
  role: "The Income Switch",
};

export const LowerThird: React.FC<LowerThirdProps> = ({ name, role }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const slide = interpolate(enter, [0, 1], [-60, 0]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 220,
          transform: `translateX(${slide}px)`,
          opacity: enter * exit,
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div style={{ width: 6, backgroundColor: colors.taupe }} />
        <div
          style={{
            backgroundColor: colors.navy,
            padding: "18px 34px",
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 600,
              fontSize: 46,
              color: colors.ivory,
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 26,
              letterSpacing: 2,
              color: colors.slateBlue,
              marginTop: 4,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
