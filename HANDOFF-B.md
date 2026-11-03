# Worker B handoff (TB-1 … TB-19)

Worktree: `/workspace/tb-b` (detached; `git pull --rebase origin main`, push `git push origin HEAD:main`). Build: `python3 src/build.py` (edit `src/pages/*.html`, never the root HTML). Commit identity via env vars (GIT_AUTHOR_NAME/EMAIL, GIT_COMMITTER_NAME/EMAIL); don't write shared git config. Voice belongs to the other worker (tb-voice*.js, Kokoro).

## What exists
- Offline: `sw.js` (network-first pages, stale-while-revalidate assets; bump `CACHE` when CORE changes), `manifest.webmanifest`, icons.
- QA: `qa/` (offline + 360/390/768 overflow, axe-core). Serve on port 8931 (8765 is taken by another process).
- Perf: responsive `-640.webp` variants (not on `ed-*`: epic.js swaps `src`); epic.js loops pause off-screen.
- SEO: canonical, generated `sitemap.xml`/`robots.txt` (in build.py).
- Demo extras: `share.js` (share a roast; `demo.html?r=` landing, link/handle text rejected), `recap.js` (weekly roast recap, Pro preview).

## Ideas not done
- Home-page onboarding: "Which phone?" picker on app.html showing only that platform's steps.
- Share the recap as an image (canvas → Web Share files).
- Remove canonical from 404.html; page-split CSS only if Lighthouse flags it.

## TB-21 to TB-24 (2026-11-02)
- "4 taps logs 3" is intended: `#pay` is disabled while `st.busy` (the tap animation) runs. TB-24 adds a visible disabled style (`.btn:disabled`) so it reads as busy.
- TB-21: 404 has noindex and no canonical (build.py head()).
- TB-22: `onboard.js` adds the phone picker on app.html setup (auto-detects from the user agent, stored in localStorage `tapback_os`, arrow-key radios). Without JS, both cards show.
- TB-23: recap.js "Share as image" draws a 1080x1350 PNG and uses Web Share files, falling back to a download. SW is `tapback-v5`.
- Gotcha: sw.js uses single quotes in CORE.

## TB-25 to TB-27 (2026-11-02)
- TB-25: onboard.js points PDF guide links at `#page=1` (iPhone) / `#page=3` (Android) per picker choice. Re-check if the PDF is regenerated.
- TB-26: Lighthouse App 98 / Demo 95, a11y/BP/SEO 100. Fixes: 64px `logo-64.webp` for small logos (nav, footer, demo notif/widget), app hero `sizes` fixed, nav scroll check runs in rAF (it was a forced reflow). SW is `tapback-v6`.
- Remaining Lighthouse items are server-side (cache headers/compression on local http.server; GitHub Pages handles these) or render-blocking styles.css (39KB, not worth splitting).

## TB-27 check (2026-11-02 21:30 ET)
- Re-ran qa/offline_mobile.py and qa/axe_audit.py: no errors on any page. The PDF serves 200, has 4 pages, Part 1 iPhone is on p1 and Part 2 Android is on p3, so the onboard.js `#page=` anchors are correct.
