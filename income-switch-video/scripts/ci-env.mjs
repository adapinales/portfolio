// Read a request file + its lesson config and export the values CI needs.
//   node scripts/ci-env.mjs <requestPath>
import fs from "node:fs";

const requestPath = process.argv[2];
const req = JSON.parse(fs.readFileSync(requestPath, "utf8"));
const cfgPath = `public/lessons/${req.lesson}.json`;
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));

const lines = [
  `LESSON=${req.lesson}`,
  `DRIVE=${req.drive_url}`,
  `CFG=${cfgPath}`,
  `VIDEO=${cfg.videoFile}`,
  `CAPTIONS=${cfg.captionsFile}`,
];

if (process.env.GITHUB_ENV) {
  fs.appendFileSync(process.env.GITHUB_ENV, lines.join("\n") + "\n");
}
console.log(lines.join("\n"));
