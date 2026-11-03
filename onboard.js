// TB-22: "Which phone?" picker on the setup section. Auto-selects from the device, remembers the choice.
(() => {
  const pick = document.querySelector(".os-pick"); if (!pick) return;
  const box = pick.nextElementSibling, cards = box.querySelectorAll("[data-os]"), btns = pick.querySelectorAll("button");
  const set = os => {
    btns.forEach(b => { const on = b.dataset.os === os; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
    cards.forEach(c => { c.hidden = os !== "all" && c.dataset.os !== os; });
    box.classList.toggle("single", os !== "all");
    try { localStorage.setItem("tapback_os", os); } catch (e) {}
  };
  const ua = navigator.userAgent;
  const guess = /iPhone|iPad|iPod/.test(ua) ? "ios" : /Android/.test(ua) ? "android" : "all";
  let saved; try { saved = localStorage.getItem("tapback_os"); } catch (e) {}
  pick.hidden = false; set(saved || guess);
  pick.addEventListener("click", e => { const b = e.target.closest("button"); if (b) set(b.dataset.os); });
  pick.addEventListener("keydown", e => {
    const i = [...btns].findIndex(b => b.getAttribute("aria-checked") === "true"), d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return; e.preventDefault(); const n = btns[(i + d + btns.length) % btns.length]; set(n.dataset.os); n.focus();
  });
})();
