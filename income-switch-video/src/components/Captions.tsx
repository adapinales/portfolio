import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
} from "@remotion/captions";
import { colors, fonts } from "../theme";

export type CaptionsProps = {
  captions: Caption[];
  // Group words into a single on-screen line until this much silence/gap.
  combineWithinMs?: number;
};

/**
 * Clean subtitle style: one readable line at a time, centered near the bottom
 * in a soft rounded bar — the classic, professional course look.
 */
export const Captions: React.FC<CaptionsProps> = ({
  captions,
  combineWithinMs = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          maxWidth: "72%",
          marginBottom: 96,
          padding: "16px 32px",
          borderRadius: 14,
          backgroundColor: "rgba(15, 26, 46, 0.78)", // navy, semi-transparent
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.25,
            color: colors.ivory,
          }}
        >
          {active.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
