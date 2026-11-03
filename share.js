// TB-16: "Share this roast" for the demo. Web Share API on phones, clipboard fallback elsewhere.
(() => {
  const reset = document.getElementById("reset"), bubble = document.getElementById("bubble");
  if (!reset || !bubble) return;
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "btn btn-ghost btn-sm"; btn.id = "share-roast"; btn.style.display = "none";
  btn.textContent = "📤 Share this roast";
  const status = document.createElement("span"); status.className = "sr"; status.setAttribute("role", "status");
  reset.after(btn, status);
  const line = () => (bubble.textContent || "").trim();
  const initial = line();
  new MutationObserver(() => { if (line() && line() !== initial) btn.style.display = ""; }).observe(bubble, { childList: true, characterData: true, subtree: true });
  btn.addEventListener("click", async () => {
    const text = `My wallet just roasted me: “${line()}”`, u = new URL("demo.html", location.href); u.searchParams.set("r", line().slice(0, 200)); const url = u.href;
    try {
      if (navigator.share) { await navigator.share({ title: "Tapback", text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      btn.textContent = "✅ Copied"; status.textContent = "Roast copied to clipboard";
      setTimeout(() => { btn.textContent = "📤 Share this roast"; status.textContent = ""; }, 2000);
    } catch (e) { /* share sheet dismissed */ }
  });

  // Landing from a shared link: show the friend's roast (textContent only, length-capped).
  const shared = (new URLSearchParams(location.search).get("r") || "").trim().slice(0, 200);
  const hero = document.querySelector("main .page-hero .wrap, main section .wrap");
  const looksSafe = s => !/https?:|www\.|\.(com|net|org|io|ly|co)\b|@|<|>/i.test(s);
  if (shared && hero && looksSafe(shared)) {
    const box = document.createElement("div"); box.className = "card shared-roast"; box.setAttribute("role", "note");
    const k = document.createElement("p"); k.className = "eyebrow"; k.textContent = "A friend got roasted";
    const q = document.createElement("p"); q.className = "shared-q"; q.textContent = `“${shared}”`;
    const c = document.createElement("p"); c.className = "fine"; c.textContent = "Your turn: pick a store below and tap to pay.";
    box.append(k, q, c); hero.append(box);
  }
})();
