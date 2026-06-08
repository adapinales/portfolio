import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, brandName } from "../theme";

export type Callout = {
  startSec: number;
  endSec: number;
  title: string;
  subtitle?: string;
  bullets?: string[];
};

export type SidePanelProps = {
  callouts: Callout[];
  // Shown on the panel when no callout is active (the branded "resting" state).
  brandTitle: string;
  brandSubtitle: string;
  // Left edge of the panel — sits to the right of the speaker video.
  panelLeft: number;
};

const FADE = 0.3; // seconds for a card's content to ease in

// The right-hand branded panel. Fills the space next to the (vertical) speaker
// video so there's never dead navy: it rests on the brand lockup, then swaps to
// the active callout's title + bullets, timed to the speech.
export const SidePanel: React.FC<SidePanelProps> = ({
  callouts,
  brandTitle,
  brandSubtitle,
  panelLeft,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;

  const active = callouts.find((c) => t >= c.startSec && t < c.endSec) ?? null;

  let cardOpacity = 0;
  let cardRise = 0;
  if (active) {
    const local = t - active.startSec;
    cardOpacity = interpolate(local, [0, FADE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cardRise = interpolate(local, [0, FADE], [16, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      style={{
        position: "absolute",
        left: panelLeft,
        top: 0,
        width: width - panelLeft,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        boxSizing: "border-box",
        borderLeft: `2px solid rgba(184,155,122,0.35)`, // faint taupe divider
      }}
    >
      {/* Resting brand lockup */}
      <div style={{ opacity: active ? 0 : 1 }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            letterSpacing: 8,
            fontSize: 30,
            color: colors.taupe,
          }}
        >
          {brandName}
        </div>
        <div style={{ width: 90, height: 3, backgroundColor: colors.taupe, margin: "28px 0" }} />
        <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 104, color: colors.ivory, lineHeight: 1.04 }}>
          {brandTitle}
        </div>
        <div style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: 38, color: colors.slateBlue, marginTop: 22 }}>
          {brandSubtitle}
        </div>
      </div>

      {/* Active callout content (sits on top of the resting state) */}
      {active ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            opacity: cardOpacity,
            transform: `translateY(${cardRise}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              letterSpacing: 6,
              fontSize: 24,
              color: colors.taupe,
              marginBottom: 18,
            }}
          >
            {brandName}
          </div>
          <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 82, color: colors.ivory, lineHeight: 1.05 }}>
            {active.title}
          </div>
          {active.subtitle ? (
            <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 40, color: colors.slateBlue, marginTop: 14 }}>
              {active.subtitle}
            </div>
          ) : null}
          {active.bullets && active.bullets.length > 0 ? (
            <div style={{ marginTop: 40 }}>
              {active.bullets.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", marginTop: i === 0 ? 0 : 26 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: colors.taupe,
                      marginTop: 16,
                      marginRight: 22,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 44, lineHeight: 1.3, color: colors.ivory }}>
                    {b}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
