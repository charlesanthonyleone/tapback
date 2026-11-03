// TB-40: compare table toggle: "All features" / "Only what Pro adds".
(() => {
  const t = document.querySelector("table.compare"); if (!t) return;
  const rows = [...t.tBodies[0].rows], diff = rows.filter(r => r.cells[1].innerHTML !== r.cells[2].innerHTML);
  const bar = document.createElement("div"); bar.className = "seg"; bar.setAttribute("role", "radiogroup"); bar.setAttribute("aria-label", "Rows to show");
  bar.innerHTML = '<button type="button" role="radio" aria-checked="true" data-v="all">All features</button><button type="button" role="radio" aria-checked="false" data-v="diff">Only what Pro adds</button>';
  const note = document.createElement("p"); note.className = "fine center"; note.setAttribute("aria-live", "polite");
  t.closest(".table-wrap").before(bar); t.closest(".table-wrap").after(note);
  const btns = [...bar.children];
  const set = v => {
    btns.forEach(b => { const on = b.dataset.v === v; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
    rows.forEach(r => (r.hidden = v === "diff" && !diff.includes(r)));
    note.textContent = v === "diff" ? `Showing the ${diff.length} things Pro adds. Everything else is free.` : `Showing all ${rows.length} features.`;
  };
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (b) set(b.dataset.v); });
  bar.addEventListener("keydown", e => { const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault();
    const i = btns.findIndex(b => b.getAttribute("aria-checked") === "true"), n = btns[(i + d + 2) % 2]; set(n.dataset.v); n.focus(); });
  set("all");
})();
