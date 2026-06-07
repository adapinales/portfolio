# The Income Switch — Video Editor (Remotion)

Branded graphics + auto-captions for The Income Switch course lessons, built
with [Remotion](https://www.remotion.dev/). Everything is code, so every lesson
gets the same polished, on-brand look — you just swap the footage and the text.

## What it does

For each lesson it lays over your footage:

- **Auto captions** — clean subtitles (one readable line at a time), transcribed
  locally with Whisper. No upload, no subscription.
- **Intro title card** — *The Income Switch* + lesson title (Playfair Display).
- **Lower-third** — your name / brand, slides in early.
- **Outro card** — a call-to-action appended after the footage.

Brand palette and fonts live in [`src/theme.ts`](src/theme.ts):
slate blue `#6F86A8`, deep navy `#0F1A2E`, soft ivory `#F8F5F0`,
warm taupe `#B89B7A`; Playfair Display (headings) + Montserrat (body/captions).

## One-time setup

```bash
cd income-switch-video
npm install
```

## Editing a lesson

1. **Add your footage.** Download the lesson from Google Drive and save it as
   `public/lesson.mp4`. (Footage is git-ignored — it stays out of the repo.)

2. **Generate captions** (local Whisper):

   ```bash
   npm run transcribe
   # bigger model = more accurate, slower:
   # WHISPER_MODEL=medium.en npm run transcribe
   ```

   This writes `public/captions.json`.

3. **Preview** in the Remotion Studio (live editor — tweak text, timing, colors):

   ```bash
   npm run studio
   ```

   Open the **Lesson** composition. Edit the intro/lower-third/outro text in the
   right-hand props panel (or in `src/Root.tsx`).

4. **Render the finished MP4:**

   ```bash
   npm run render
   # -> out/start-here.mp4
   ```

## Publishing to Skool

Skool embeds video, it doesn't host files. So upload `out/start-here.mp4` to
**YouTube (unlisted)** or **Loom**, then paste that link into your Skool lesson.

## Adding more modules

Duplicate the `Lesson` composition in [`src/Root.tsx`](src/Root.tsx) (or just
change the props) — new title, presenter, CTA, and `videoFile` / `captionsFile`.
Same brand styling, every time.

## Standalone graphics

Render any graphic on its own:

```bash
npm run render:intro   # out/intro.mp4
npm run render:outro   # out/outro.mp4
```

## Notes

- Rendering needs a Chrome/Chromium build; Remotion downloads one automatically
  on first render. (In sandboxed/no-network environments that download may be
  blocked — run renders on your own machine.)
- The transcription step needs build tools for whisper.cpp (Xcode CLT on macOS,
  build-essential on Linux); the first run compiles it once.
