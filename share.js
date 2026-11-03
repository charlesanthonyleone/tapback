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
    const text = `My wallet just roasted me: “${line()}”`, url = new URL("demo.html", location.href).href;
    try {
      if (navigator.share) { await navigator.share({ title: "Tapback", text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      btn.textContent = "✅ Copied"; status.textContent = "Roast copied to clipboard";
      setTimeout(() => { btn.textContent = "📤 Share this roast"; status.textContent = ""; }, 2000);
    } catch (e) { /* share sheet dismissed */ }
  });
})();
