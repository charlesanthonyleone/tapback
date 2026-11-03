// Tapback: visual effects (tilt, particles, editions, talk animation). Respects reduced motion.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);

  // Phone speech bubble + soundwave
  const talk = $("#talk"), bubble = $("#bubble"); let hideT;
  window.pnTalk = (text, mode) => {
    if (!talk) return;
    clearTimeout(hideT);
    if (mode === false) { talk.classList.remove("speaking"); hideT = setTimeout(() => talk.classList.remove("show"), 1800); return; }
    bubble.textContent = text; talk.classList.add("show");
    talk.classList.remove("pop"); void talk.offsetWidth; talk.classList.add("pop");
    talk.classList.add("speaking");
    // If speech doesn't start (muted / unsupported), still animate briefly
    hideT = setTimeout(() => { talk.classList.remove("speaking"); hideT = setTimeout(() => talk.classList.remove("show"), 1500); }, 3500 + text.length * 40);
  };

  // Editions
  document.querySelectorAll(".editions button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".editions button").forEach(x => x.setAttribute("aria-checked", x === b));
    const img = $("#edition-img"); img.classList.add("swap");
    setTimeout(() => { img.src = `assets/ed-${b.dataset.ed}.webp`; img.alt = `Glass Card, ${b.textContent} edition`; }, reduce ? 0 : 180);
    img.onload = () => img.classList.remove("swap");
  }));
  document.querySelectorAll(".hs").forEach(h => {
    const f = document.getElementById(h.getAttribute("aria-describedby"));
    h.setAttribute("aria-label", f.querySelector("b").textContent);
    const on = v => () => f.classList.toggle("lit", v);
    ["mouseenter", "focus"].forEach(e => h.addEventListener(e, on(true)));
    ["mouseleave", "blur"].forEach(e => h.addEventListener(e, on(false)));
  });

  // Count-up stats
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const n = +e.target.dataset.count; if (reduce || !n) return;
    const t0 = performance.now(); const step = t => { const k = Math.min(1, (t - t0) / 1100); e.target.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));

  if (reduce) return;

  // 3D tilt + parallax following mouse / gyro
  const tilt = $("#tilt"), stage = $(".hero") || $(".glass-hero");
  const px = document.querySelectorAll(".parallax");
  // rAF-throttled scroll work (TB-13)
  const onScroll = fn => { let q = false; addEventListener("scroll", () => { if (q) return; q = true; requestAnimationFrame(() => { q = false; fn(); }); }, { passive: true }); };
  if (px.length) onScroll(() => px.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -0.12}px) scale(1.15)`; }));
  if (!tilt || !stage) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const set = (x, y) => { tx = Math.max(-1, Math.min(1, x)); ty = Math.max(-1, Math.min(1, y)); };
  stage.addEventListener("pointermove", e => { const r = stage.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1); });
  stage.addEventListener("pointerleave", () => set(0, 0));
  addEventListener("deviceorientation", e => { if (e.gamma != null) set(e.gamma / 30, (e.beta - 45) / 30); });
  // Only animate while the hero is on screen and the tab is visible (TB-13)
  let live = true; const wake = [];
  const setLive = v => { const was = live; live = v; if (v && !was) wake.forEach(f => requestAnimationFrame(f)); };
  new IntersectionObserver(es => setLive(es[0].isIntersecting && !document.hidden)).observe(stage);
  document.addEventListener("visibilitychange", () => setLive(!document.hidden && stage.getBoundingClientRect().bottom > 0));
  let t = 0;
  wake.push(function loop() {
    t += .016; cx += (tx - cx) * .08; cy += (ty - cy) * .08;
    const idle = Math.sin(t * .8) * 3;
    tilt.style.transform = `rotateY(${cx * 16}deg) rotateX(${-cy * 12 + idle * .4}deg) translateY(${idle}px)`;
    tilt.style.setProperty("--sx", (50 + cx * 40) + "%");
    if (live) requestAnimationFrame(loop);
  }); wake[0]();
  const ts = document.querySelector(".tilt-stage"); onScroll(() => { const y = scrollY; if (y < 900 && ts) ts.style.transform = `translateY(${y * .12}px)`; });

  // Particles
  const cv = $("#particles"); if (!cv) return; const ctx = cv.getContext("2d"); let W, H, P = [];
  const size = () => { W = cv.width = cv.offsetWidth * Math.min(2, devicePixelRatio); H = cv.height = cv.offsetHeight * Math.min(2, devicePixelRatio); };
  size(); addEventListener("resize", size);
  for (let i = 0; i < 46; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, v: Math.random() * .0008 + .0002, h: Math.random() < .5 ? 280 : 190 });
  wake.push(function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) { p.y -= p.v; if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      ctx.beginPath(); ctx.arc(p.x * W + cx * 20 * p.r, p.y * H, p.r * Math.min(2, devicePixelRatio), 0, 7);
      ctx.fillStyle = `hsla(${p.h},90%,75%,${.25 + .5 * Math.sin(p.y * 3.14)})`; ctx.fill(); }
    if (live) requestAnimationFrame(draw);
  }); wake[1]();
})();
