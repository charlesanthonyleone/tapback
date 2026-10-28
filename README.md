# Pocket Nag marketing site (static)
Run: `cd /workspace/pocketnag && python3 -m http.server 8643`, then open http://localhost:8643
Rename the product: edit `CONFIG.BRAND` at the top of app.js.

## Website (multi-page)
Pages live in `src/pages/*.html` (content only). Run `python3 src/build.py` to wrap them with the shared head, header/nav, footer and scripts, which writes the root `*.html` files that GitHub Pages serves.
Shared: `styles.css` (tokens + components), `site.js` (config incl. founder name, mobile menu, reveals, waitlist, page transitions), `epic.js` (tilt/particles/editions), `personas.js`, `demo.js` (playground), `pn-lines.js` + `pn-picker.js` (line library).
