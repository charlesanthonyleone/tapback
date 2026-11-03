# Tapback marketing site (static)
Run: `cd /workspace/tapback && python3 -m http.server 8643`, then open http://localhost:8643
Brand and founder config: `CONFIG` at the top of site.js.

## Website (multi-page)
Pages live in `src/pages/*.html` (content only). Run `python3 src/build.py` to wrap them with the shared head, header/nav, footer and scripts, which writes the root `*.html` files that GitHub Pages serves.
Shared: `styles.css` (tokens + components), `site.js` (config incl. founder name, mobile menu, reveals, waitlist, page transitions), `epic.js` (tilt/particles/editions), `personas.js`, `demo.js` (playground), `pn-lines.js` + `pn-picker.js` (line library).

## Voices
The personas talk with natural neural voices, not the browser's robotic default:
1. **Pre-rendered clips** (`assets/voice/*.mp3`, about 20 KB each) cover every line the demo can say for its preset stores, plus the persona samples. They were made offline with Kokoro-82M (Apache-2.0); see `assets/voice/LICENSE.md`. Regenerate them with `cd /workspace/qa && KOKORO=$PWD/node_modules/kokoro-js/dist/kokoro.js node /workspace/tapback/tools/render_voices.mjs 0 1 && node /workspace/tapback/tools/render_voices.mjs manifest` (needs `npm i kokoro-js` and ffmpeg).
2. **In-browser Kokoro** (`tb-voice-worker.js`, opt-in, about 90 MB downloaded once) handles custom store names.
3. **The best system voice** (Natural, Neural or Enhanced voices are preferred) is the last fallback.
`tb-voice.js` turns text into speech-friendly words ($11.38 becomes "eleven dollars thirty-eight", 4TH becomes "fourth") and picks a clip by hashing the persona and the text.

Waitlist: front-end only for now (see DECISIONS-NEEDED.md). QA: axe-core plus Playwright scripts kept outside the repo in /workspace/qa.
