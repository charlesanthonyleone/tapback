// TB-22: "Which phone?" picker on the setup section. Auto-selects from the device, remembers the choice.
(() => {
  const pick = document.querySelector(".os-pick"); if (!pick) return;
  const box = pick.nextElementSibling, cards = box.querySelectorAll("[data-os]"), btns = pick.querySelectorAll("button");
  const set = os => {
    btns.forEach(b => { const on = b.dataset.os === os; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
    cards.forEach(c => { c.hidden = os !== "all" && c.dataset.os !== os; });
    box.classList.toggle("single", os !== "all");
    try { localStorage.setItem("tapback_os", os); } catch (e) {}
    // TB-25: PDF guide links open at the matching part (iPhone p.1, Android p.3).
    document.querySelectorAll('a[href^="prototype/SETUP_GUIDE.pdf"]').forEach(a => {
      a.href = "prototype/SETUP_GUIDE.pdf" + ({ ios: "#page=1", android: "#page=3" }[os] || "");
    });
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

// TB-29: setup checklist. Each step becomes a checkbox; progress is saved per phone.
(() => {
  document.querySelectorAll("[data-os] ol.mini").forEach(ol => {
    const os = ol.closest("[data-os]").dataset.os, key = "tapback_steps_" + os, items = [...ol.children];
    let done = []; try { done = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) {}
    const prog = document.createElement("p"); prog.className = "step-prog"; prog.setAttribute("aria-live", "polite");
    const upd = () => {
      const n = items.filter(li => li.querySelector("input").checked).length;
      prog.innerHTML = n === items.length ? 'All set! 🎉 <a href="demo.html">Try a pretend tap in the demo</a>.' : `${n} of ${items.length} steps done`;
      ol.closest("[data-os]").classList.toggle("all-done", n === items.length);
    };
    items.forEach((li, i) => {
      const id = `st-${os}-${i}`, cb = document.createElement("input");
      cb.type = "checkbox"; cb.id = id; cb.checked = done.includes(i);
      const lab = document.createElement("label"); lab.htmlFor = id; lab.append(...li.childNodes);
      li.append(cb, lab); li.classList.add("chk");
      cb.addEventListener("change", () => {
        done = items.map((x, j) => x.querySelector("input").checked ? j : -1).filter(j => j >= 0);
        try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {}
        upd();
      });
    });
    ol.after(prog); upd();
  });
})();
