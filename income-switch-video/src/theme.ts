import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// Headings: Playfair Display. Body / captions: Montserrat.
const playfair = loadPlayfair("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const montserrat = loadMontserrat("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const fonts = {
  heading: playfair.fontFamily,
  body: montserrat.fontFamily,
};

// The Income Switch brand palette.
export const colors = {
  slateBlue: "#6F86A8",
  navy: "#0F1A2E",
  ivory: "#F8F5F0",
  taupe: "#B89B7A",
};

export const brandName = "THE INCOME SWITCH";
