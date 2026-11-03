// TB-43: 404 "Did you mean…?" Suggests the closest real page to the mistyped URL.
(() => {
  const el = document.getElementById("nf-guess"); if (!el) return;
  const pages = { "index": "Home", "app": "The App", "demo": "Demo", "glass-card": "Glass Card", "pricing": "Pricing", "about": "About", "faq": "FAQ", "support": "Support", "press": "Press kit", "privacy": "Privacy", "terms": "Terms" };
  const seg = decodeURIComponent(location.pathname.split("/").pop() || "").toLowerCase().replace(/\.html?$/, "").replace(/[^a-z-]/g, "");
  if (!seg) return;
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1]));
    return d[a.length][b.length]; };
  let best = null, bd = 99;
  for (const k in pages) { const s = seg.length >= 3 && (k.startsWith(seg) || seg.startsWith(k)) ? 0 : lev(seg, k); if (s < bd) { bd = s; best = k; } }
  if (best && bd <= Math.max(2, Math.floor(best.length / 3))) {
    const a = document.createElement("a"); a.href = best + ".html"; a.textContent = pages[best];
    el.append("Did you mean ", a, "?"); el.hidden = false;
  }
})();
