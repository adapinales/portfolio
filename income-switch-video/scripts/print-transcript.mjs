// Turn a generated captions file into a readable, timestamped transcript.
//   node scripts/print-transcript.mjs <captionsPath> <outTxtPath>
import fs from "node:fs";
import path from "node:path";

const captionsPath = process.argv[2];
const outPath = process.argv[3];

const caps = JSON.parse(fs.readFileSync(captionsPath, "utf8"));
let words = [];
let start = null;
const out = [];
const flush = () => {
  if (words.length) {
    out.push(`[${(start / 1000).toFixed(1)}s] ${words.join(" ")}`);
    words = [];
    start = null;
  }
};
for (const x of caps) {
  const t = (x.text || "").trim();
  if (!t) continue;
  if (start === null) start = x.startMs;
  words.push(t);
  if (/[.!?]$/.test(t) || words.length >= 16) flush();
}
flush();

const text = out.join("\n") + "\n";
if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, text);
}
// Always echo to stdout too, so it's visible in CI logs as a fallback.
console.log(text);
