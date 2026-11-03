// TB-44/45: "Check my browser" for the demo: speech, voices, sound unlock, offline, storage. Prefills a GitHub issue.
(() => {
  const btn = document.getElementById("diag-run"), out = document.getElementById("diag-out"); if (!btn) return;
  const row = (ok, label, tip) => `<li class="${ok ? "ok" : "warn"}"><span aria-hidden="true">${ok ? "✅" : "⚠️"}</span><span><b>${label}</b>${tip ? `<small>${tip}</small>` : ""}</span></li>`;
  const voices = () => new Promise(r => { const s = window.speechSynthesis; if (!s) return r([]); const v = s.getVoices(); if (v.length) return r(v);
    let done = false; s.addEventListener("voiceschanged", () => { if (!done) { done = true; r(s.getVoices()); } }, { once: true }); setTimeout(() => { if (!done) { done = true; r(s.getVoices()); } }, 1500); });
  btn.addEventListener("click", async () => {
    btn.disabled = true; out.innerHTML = "<li>Checking…</li>";
    const v = await voices(), en = v.filter(x => /^en/i.test(x.lang));
    let store = false; try { localStorage.setItem("tb_t", "1"); localStorage.removeItem("tb_t"); store = true; } catch (e) {}
    const sw = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
    const r = [
      [!!window.speechSynthesis, "Built-in speech", window.speechSynthesis ? "" : "This browser can't speak. Try Chrome, Safari or Edge."],
      [en.length > 0, `${en.length} English voice${en.length === 1 ? "" : "s"} found`, en.length ? "" : "Preset stores still use natural voices. For typed stores, install a system voice or turn on the natural voice option."],
      [!!(window.AudioContext || window.webkitAudioContext), "Audio playback", ""],
      [!!window.WebAssembly && !!window.Worker, "Natural voice for any store", window.WebAssembly ? "Supported (one-time download when you switch it on)." : "Not supported here; preset stores still work."],
      [store, "Saving on this device", store ? "" : "Private mode may block it, so your demo week won't be remembered."],
      [sw, "Works offline", sw ? "" : "Visit once more online to enable it."],
    ];
    const bad = r.filter(x => !x[0]).length;
    out.innerHTML = `<li class="diag-sum"><b>${bad ? `${bad} thing${bad === 1 ? "" : "s"} to check` : "All good. The demo should work here."}</b></li>` + r.map(x => row(...x)).join("");
    const body = `**What happened**\n\n\n**Browser check**\n${r.map(x => `- ${x[0] ? "OK" : "Issue"}: ${x[1]}`).join("\n")}\n- Browser: ${navigator.userAgent}`;
    const a = document.getElementById("diag-issue");
    a.href = "https://github.com/charlesanthonyleone/tapback/issues/new?" + new URLSearchParams({ title: "Demo problem: ", body }); a.hidden = false;
    const c = document.getElementById("diag-copy"); c.hidden = false;
    c.onclick = async () => { try { await navigator.clipboard.writeText(body); c.textContent = "Copied"; } catch (e) { window.prompt("Copy these details:", body); } setTimeout(() => { c.textContent = "Copy details"; }, 2000); };
    btn.disabled = false; btn.textContent = "Check again";
  });
})();
