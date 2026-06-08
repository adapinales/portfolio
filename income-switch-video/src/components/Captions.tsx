import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
} from "@remotion/captions";
import { colors, fonts } from "../theme";

export type CaptionsProps = {
  captions: Caption[];
  // Group words into a single on-screen line until this much silence/gap.
  combineWithinMs?: number;
  // Optional horizontal region to confine captions to (e.g. under the speaker
  // video in a split layout). Defaults to the full frame width.
  regionLeft?: number;
  regionWidth?: number;
  fontSize?: number;
};

/**
 * Clean subtitle style: one readable line at a time, centered near the bottom
 * in a soft rounded bar — the classic, professional course look.
 */
export const Captions: React.FC<CaptionsProps> = ({
  captions,
  combineWithinMs = 1200,
  regionLeft,
  regionWidth,
  fontSize = 52,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: combineWithinMs,
      }),
    [captions, combineWithinMs]
  );

  const active = pages.find(
    (p) => timeMs >= p.startMs && timeMs < p.startMs + p.durationMs
  );

  if (!active) {
    return null;
  }

  const left = regionLeft ?? 0;
  const regionW = regionWidth ?? width;

  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom: 0,
        width: regionW,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          maxWidth: "88%",
          marginBottom: 64,
          padding: "14px 28px",
          borderRadius: 14,
          backgroundColor: "rgba(15, 26, 46, 0.82)", // navy, semi-transparent
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize,
            lineHeight: 1.25,
            color: colors.ivory,
          }}
        >
          {active.text}
        </span>
      </div>
    </div>
  );
};
