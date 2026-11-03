// TB-36: FAQ search + deep links. Each question gets an id (#slug) and a copyable link; hash opens it.
(() => {
  const qs = [...document.querySelectorAll("main details")]; if (!qs.length) return;
  const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  qs.forEach(d => { const s = d.querySelector("summary"); d.id = d.id || slug(s.textContent); });
  const openHash = () => { const d = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (d && d.tagName === "DETAILS") { d.open = true; d.classList.add("in"); d.scrollIntoView({ block: "center" }); } };
  qs.forEach(d => d.addEventListener("toggle", () => { if (d.open) history.replaceState(null, "", "#" + d.id); }));
  const wrap = document.createElement("div"); wrap.className = "faq-search";
  wrap.innerHTML = '<label for="faq-q" class="sr">Search questions</label><input id="faq-q" type="search" placeholder="Search questions… (e.g. bank, Android, price)" autocomplete="off"><p class="fine" id="faq-n" aria-live="polite"></p>';
  qs[0].before(wrap);
  const inp = wrap.querySelector("input"), n = wrap.querySelector("#faq-n");
  inp.addEventListener("input", () => {
    const words = inp.value.toLowerCase().trim().split(/\s+/).filter(Boolean); let hit = 0;
    qs.forEach(d => { const ok = words.every(w => d.textContent.toLowerCase().includes(w)); d.hidden = !ok; if (ok) hit++; if (words.length) d.open = ok && hit <= 3; d.classList.add("in"); });
    n.innerHTML = !words.length ? "" : hit ? `${hit} matching question${hit === 1 ? "" : "s"}` : 'No matches. <a href="support.html">Ask support</a> instead.';
  });
  openHash(); addEventListener("hashchange", openHash);
})();
