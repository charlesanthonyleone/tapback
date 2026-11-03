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
    const verdict = total > 250 ? "Over the demo budget. The budget would like a word." :
      total > 150 ? "Cutting it close. Your wallet is sweating." :
      total > 50 ? "Respectable. Mostly. We saw that snack run." : "Barely spent a thing. Who are you?";
    const stats = document.createElement("ul"); stats.className = "recap-stats";
    [["Spent", money(total)], ["Purchases", String(buys.length)], ["Favourite haunt", `${topName} ×${top.n}`], ["Biggest hit", `${money(+big.a)} at ${big.m}`]]
      .forEach(([k, v]) => { const li = document.createElement("li"); li.append(el("span", "fine", k), el("b", "", v)); stats.append(li); });
    const line = top.n >= 3 ? `${top.n} trips to ${topName} in one week. They should name a booth after you.` : verdict;
    out.append(stats, el("p", "recap-line", `“${line}”`));
    if (window.pnTalk) window.pnTalk(line);
  });
})();
