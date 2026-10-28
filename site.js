// Pocket Nag: shared site behaviour (config, nav, reveals, waitlist, page transitions)
const CONFIG = { BRAND: "Pocket Nag", FOUNDER: "Roseann Mary Geiger", WEEKLY_BUDGET: 250 };
(() => {
  const $ = s => document.querySelector(s);
  document.querySelectorAll("[data-founder]").forEach(el => (el.textContent = CONFIG.FOUNDER));
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile menu
  const tg = $("#menu-toggle"), menu = $("#site-menu");
  if (tg) {
    const set = open => { tg.setAttribute("aria-expanded", open); document.body.classList.toggle("menu-open", open); };
    tg.addEventListener("click", () => set(tg.getAttribute("aria-expanded") !== "true"));
    addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { set(false); tg.focus(); } });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => set(false)));
  }
  // Nav shadow on scroll
  const nav = $(".nav"); const onS = () => nav && nav.classList.toggle("scrolled", scrollY > 8); onS(); addEventListener("scroll", onS, { passive: true });

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Waitlist forms (front-end only, localStorage)
  const KEY = "pocketnag_waitlist";
  document.querySelectorAll("form.waitlist").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const inp = f.querySelector("input[type=email]"), msg = f.parentElement.querySelector(".wl-msg");
    if (!inp.value || !inp.checkValidity()) { msg.className = "wl-msg err"; msg.textContent = "Please enter a valid email."; inp.focus(); return; }
    const list = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!list.includes(inp.value)) list.push(inp.value);
    localStorage.setItem(KEY, JSON.stringify(list));
    msg.className = "wl-msg ok"; msg.textContent = f.dataset.thanks || "You're on the list! We'll be in touch."; inp.value = "";
  }));

  // Page transitions (fallback for browsers without cross-document View Transitions)
  if (!reduce && !("onpagereveal" in window)) {
    document.addEventListener("click", e => {
      const a = e.target.closest("a"); if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname || /\.(pdf|png|webp|jpg|zip)$/i.test(u.pathname)) return;
      e.preventDefault(); document.body.classList.add("leaving"); setTimeout(() => (location.href = a.href), 220);
    });
    addEventListener("pageshow", () => document.body.classList.remove("leaving"));
  }
})();
