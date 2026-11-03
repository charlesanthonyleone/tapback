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

## TB-28 to TB-32 (2026-11-02, ~21:30–21:50 ET)
- TB-28 perf. Lighthouse mobile: Home 73→98, Demo 67→89, App 98. A11y/BP/SEO are all 100. Changes: build.py emits `defer` scripts. epic.js hero bob is now the CSS `.bob` (`translate`), and the tilt rAF loop sleeps once it catches the pointer. Particles start after load/idle and draw at ~30fps. `main>section~section{content-visibility:auto}`. `.soon`, `.sheen` and `.hs` loops are finite. page-in starts at opacity .35 so LCP isn't delayed.
- TB-29: app.html setup steps are checkboxes (onboard.js), with progress saved in localStorage `tapback_steps_<os>`. When all steps are done it shows "All set" and links to the demo.
- TB-30: the weekly budget on the demo dashboard is editable (`#budget`, localStorage `tapback_budget`, read into CONFIG in site.js). The recap verdict uses it.
- TB-31: `card-*-960.webp` variants are in srcset (home/glass-card/press).
- TB-32: the demo has a T key shortcut for Tap to pay (ignored in fields). The `<kbd>` hint is hidden on touch screens.
- SW is `tapback-v9`. QA (offline/overflow/axe) is clean after each step.
- Ideas next: demo LCP (2.8s) is mostly styles.css render-blocking plus backdrop-filter cost. Could try critical CSS inline for the demo hero, export/import the demo week as JSON, and a reduced-transparency media query.

## TB-33 to TB-38 (2026-11-02, ~21:45–22:10 ET)
- TB-33: a page front-matter flag `inline_css: yes` makes build.py inline styles.css (comments stripped). It's used on demo only: Lighthouse demo 89→98, LCP 2.1s. Output is pixel-identical to the linked CSS. Other pages score 97–100.
- TB-34: demo "Save week"/"Load week" (JSON `{app:"tapback-demo",v:1,budget,data}`). Loads are size-capped and field-validated, and names are escaped in render.
- TB-35: `prefers-reduced-transparency` removes blur and uses solid surfaces.
- TB-36: faq.js adds search (multi-word, live count, support fallback) and `#slug` deep links that open the question. The open question updates the hash. SW v11 caches faq.js.
- TB-37: demo "Undo last tap".
- TB-38: forced-colors (High Contrast) rules for gradient text, switches, bars and selected states.
- TB-39: print stylesheet (black on white, no nav/effects, cards unbroken, external URLs shown).
- Ideas next: pricing comparison toggle, a demo "share my week" link (encode buys in URL hash).

## TB-40 to TB-42 (2026-11-02, ~21:55–22:15 ET)
- TB-40: pricing.js adds a segmented toggle over the compare table: All features, or "Only what Pro adds" (rows where the Free and Pro cells differ). Radio keyboard nav, live count. Selected text is dark (#06070b) for contrast.
- TB-41: demo "🔗 Share my week". The URL hash is `#w=` base64url of JSON `[[store, cents, hoursAgo]]` (max 40 items), so it is never sent to a server. Recipients see an opt-in card ("Load it into my demo" / "No thanks") before their week is replaced. Input is strictly validated, and the hash is cleared afterwards. Web Share first, then clipboard, then prompt.
- TB-42: demo controls are tidied. The main row is Tap / Undo / Reset. Share, Save and Load are in a "Share, save or load this week" disclosure.
- SW is `tapback-v12` (pricing.js cached).

- TB-43: 404 "Did you mean" (nf.js).
- TB-44: support.html "Check my browser" diagnostic (support.js) + prefilled issue link; sw tapback-v14.
