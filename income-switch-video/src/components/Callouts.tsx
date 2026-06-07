import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type Callout = {
  startSec: number;
  endSec: number;
  title: string;
  subtitle?: string;
};

export type CalloutsProps = {
  callouts: Callout[];
};

// One animated navy card that slides into the top-right corner over the
// footage. Stays clear of the captions (bottom-center) and lower-third
// (bottom-left). Driven by public/callouts.json.
export const Callouts: React.FC<CalloutsProps> = ({ callouts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const active = callouts.find((c) => t >= c.startSec && t < c.endSec);
  if (!active) {
    return null;
  }

  const startFrame = active.startSec * fps;
  const endFrame = active.endSec * fps;
  const local = frame - startFrame;

  const enter = spring({ frame: local, fps, config: { damping: 200 }, durationInFrames: 22 });
  const exit = interpolate(
    frame,
    [endFrame - 14, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const slide = interpolate(enter, [0, 1], [80, 0]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 90,
          maxWidth: 560,
          transform: `translateX(${slide}px)`,
          opacity: enter * exit,
          display: "flex",
          alignItems: "stretch",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div style={{ width: 8, backgroundColor: colors.taupe }} />
        <div style={{ backgroundColor: colors.navy, padding: "26px 34px" }}>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 48,
              lineHeight: 1.1,
              color: colors.ivory,
            }}
          >
            {active.title}
          </div>
          {active.subtitle ? (
            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: 28,
                color: colors.slateBlue,
                marginTop: 10,
                lineHeight: 1.3,
              }}
            >
              {active.subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
