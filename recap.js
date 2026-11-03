// TB-19: Weekly roast recap (Pro preview) built from the demo's own week in localStorage.
(() => {
  const btn = document.getElementById("recap-btn"), out = document.getElementById("recap-out");
  if (!btn || !out) return;
  const money = n => "$" + n.toFixed(2);
  const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; e.textContent = txt; return e; };
  btn.addEventListener("click", () => {
    let buys = [];
    try { buys = (JSON.parse(localStorage.getItem("tapback_visits")) || {}).buys || []; } catch (e) {}
    const now = Date.now(); buys = buys.filter(b => b && now - b.t < 7 * 864e5 && isFinite(+b.a));
    out.replaceChildren();
    if (!buys.length) { out.append(el("p", "recap-line", "Nothing to roast yet. Suspiciously responsible. Tap to pay a few times first.")); return; }
    const total = buys.reduce((s, b) => s + +b.a, 0);
    const by = {}; buys.forEach(b => { by[b.m] = by[b.m] || { n: 0, s: 0 }; by[b.m].n++; by[b.m].s += +b.a; });
    const [topName, top] = Object.entries(by).sort((a, b) => b[1].n - a[1].n || b[1].s - a[1].s)[0];
    const big = buys.reduce((m, b) => (+b.a > +m.a ? b : m));
    const verdict = total > CONFIG.WEEKLY_BUDGET ? "Over budget. The budget would like a word." :
      total > 150 ? "Cutting it close. Your wallet is sweating." :
      total > 50 ? "Respectable. Mostly. We saw that snack run." : "Barely spent a thing. Who are you?";
    const stats = document.createElement("ul"); stats.className = "recap-stats";
    [["Spent", money(total)], ["Purchases", String(buys.length)], ["Favourite haunt", `${topName} ×${top.n}`], ["Biggest hit", `${money(+big.a)} at ${big.m}`]]
      .forEach(([k, v]) => { const li = document.createElement("li"); li.append(el("span", "fine", k), el("b", "", v)); stats.append(li); });
    const line = top.n >= 3 ? `${top.n} trips to ${topName} in one week. They should name a booth after you.` : verdict;
    const share = el("button", "btn btn-sm btn-ghost recap-share", "🖼️ Share as image"); share.type = "button";
    share.addEventListener("click", () => shareImg([["Spent", money(total)], ["Purchases", String(buys.length)], ["Favourite", `${topName} ×${top.n}`], ["Biggest", `${money(+big.a)} at ${big.m}`]], line, share));
    out.append(stats, el("p", "recap-line", `“${line}”`), share);
    if (window.pnTalk) window.pnTalk(line);
  });

  // TB-23: draw the recap as a 1080x1350 card; Web Share with files where supported, else download.
  function wrap(c, text, x, y, w, lh) {
    let ln = "", n = 0;
    for (const word of text.split(" ")) { const t = ln ? ln + " " + word : word; if (c.measureText(t).width > w && ln) { c.fillText(ln, x, y + n++ * lh); ln = word; } else ln = t; }
    c.fillText(ln, x, y + n * lh); return y + (n + 1) * lh;
  }
  function shareImg(rows, line, b) {
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const c = cv.getContext("2d");
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#151a33"); g.addColorStop(1, "#07080d"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    const f = "Inter, system-ui, sans-serif";
    c.fillStyle = "#5eead4"; c.font = `700 34px ${f}`; c.fillText("TAPBACK · WEEKLY ROAST RECAP", 90, 150);
    c.fillStyle = "#fff"; c.font = `800 72px ${f}`; c.fillText("My week, roasted.", 90, 250);
    let y = 380;
    rows.forEach(([k, v]) => { c.fillStyle = "#a3abc0"; c.font = `500 34px ${f}`; c.fillText(k, 90, y); c.fillStyle = "#fff"; c.font = `700 48px ${f}`; y = wrap(c, v, 90, y + 58, W - 180, 58) + 30; });
    c.fillStyle = "#c4b5fd"; c.font = `italic 600 50px ${f}`; wrap(c, `“${line}”`, 90, y + 40, W - 180, 66);
    c.fillStyle = "#a3abc0"; c.font = `500 30px ${f}`; c.fillText("Demo week · try it: charlesanthonyleone.github.io/tapback", 90, H - 90);
    cv.toBlob(async blob => {
      if (!blob) return;
      const file = new File([blob], "tapback-recap.png", { type: "image/png" });
      try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "My Tapback roast recap" }); return; } } catch (e) { if (e.name === "AbortError") return; }
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000); b.textContent = "✅ Saved image";
    }, "image/png");
  }
})();
