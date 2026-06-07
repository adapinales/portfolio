// Auto-caption a lesson, fully locally, using whisper.cpp.
//
//   node scripts/transcribe.mjs [inputVideo] [outputJson]
//
// Defaults: public/lesson.mp4  ->  public/captions.json
// Model:    WHISPER_MODEL env var (default "small.en").
//           Bigger = more accurate, slower. Options: tiny.en, base.en,
//           small.en, medium.en, large-v3-turbo.
//
// The output is a Caption[] array consumed by src/components/Captions.tsx.

import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const inputVideo = process.argv[2] ?? path.join("public", "lesson.mp4");
const outputJson = process.argv[3] ?? path.join("public", "captions.json");
const model = process.env.WHISPER_MODEL ?? "small.en";
const whisperVersion = "1.5.5";
const whisperPath = path.join(process.cwd(), "whisper.cpp");

if (!fs.existsSync(inputVideo)) {
  console.error(`✗ Input video not found: ${inputVideo}`);
  console.error("  Put your footage at public/lesson.mp4 (or pass a path).");
  process.exit(1);
}

// 1) Extract 16 kHz mono WAV — the format whisper.cpp requires.
const wavPath = path.join(os.tmpdir(), `tis-${Date.now()}.wav`);
console.log("→ Extracting audio…");
execFileSync(
  ffmpegPath,
  ["-y", "-i", inputVideo, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wavPath],
  { stdio: "inherit" }
);

// 2) Make sure whisper.cpp + the model are installed.
console.log(`→ Ensuring whisper.cpp (${whisperVersion}) + model "${model}"…`);
await installWhisperCpp({ to: whisperPath, version: whisperVersion });
await downloadWhisperModel({ folder: whisperPath, model });

// 3) Transcribe with word-level timestamps.
console.log("→ Transcribing… (this can take a while on long videos)");
const whisperOutput = await transcribe({
  inputPath: wavPath,
  whisperPath,
  model,
  tokenLevelTimestamps: true,
  printOutput: false,
});

// 4) Convert to Remotion captions and write JSON.
const { captions } = toCaptions({ whisperCppOutput: whisperOutput });
fs.mkdirSync(path.dirname(outputJson), { recursive: true });
fs.writeFileSync(outputJson, JSON.stringify(captions, null, 2));
fs.rmSync(wavPath, { force: true });

console.log(`✓ Wrote ${captions.length} caption tokens → ${outputJson}`);
