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
