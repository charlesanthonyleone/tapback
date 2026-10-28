// Pocket Nag interactive playground
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const P = window.PERSONAS, LIB = window.PocketNagLines, PN = window.PocketNag, synth = window.speechSynthesis;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = n => "$" + n.toFixed(2);
  const KEY = "pocketnag_visits";
  const st = { persona: new URLSearchParams(location.search).get("persona") || "sassy", rate: 1, vol: 1, sound: true, voice: "", busy: false };
  if (!P[st.persona]) st.persona = "sassy";
  let data = load();
  function load() { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.log) return d; } catch (e) {} return { log: [], buys: [] }; }
  function save() { localStorage.setItem(KEY, JSON.stringify(data)); }

  // Personas
  const box = $("#personas");
  Object.entries(P).forEach(([k, p]) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.setAttribute("role", "radio"); b.dataset.p = k; b.textContent = `${p.emoji} ${p.label}`; box.appendChild(b); });
  const setP = k => { st.persona = k; $$("#personas .chip").forEach(b => b.setAttribute("aria-checked", b.dataset.p === k)); $("#persona-desc").textContent = P[k].desc; };
  box.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setP(b.dataset.p); }); setP(st.persona);

  // Stores
  const setStore = (n, a) => { $("#store").value = n; $("#amount").value = a; $$(".store").forEach(b => b.setAttribute("aria-pressed", b.dataset.store === n)); syncTerm(); };
  $$(".store").forEach(b => b.addEventListener("click", () => setStore(b.dataset.store, b.dataset.amt)));
  const syncTerm = () => { $("#t-store").textContent = $("#store").value || "Store"; $("#t-amt").textContent = fmt(+$("#amount").value || 0); };
  $("#store").addEventListener("input", () => { $$(".store").forEach(b => b.setAttribute("aria-pressed", "false")); syncTerm(); });
  $("#amount").addEventListener("input", syncTerm); setStore("McDonald's", "11.38");

  // Voice controls
  const loadVoices = () => { const vs = synth.getVoices().filter(v => /^en/i.test(v.lang)); $("#voice").innerHTML = '<option value="">Default voice</option>' + vs.map(v => `<option>${v.name}</option>`).join(""); $("#voice").value = st.voice; };
  if (synth) { loadVoices(); synth.addEventListener ? synth.addEventListener("voiceschanged", loadVoices) : (synth.onvoiceschanged = loadVoices); }
  $("#voice").onchange = e => (st.voice = e.target.value);
  $("#rate").oninput = e => { st.rate = +e.target.value; $("#rate-out").textContent = st.rate.toFixed(1) + "×"; };
  $("#vol").oninput = e => { st.vol = +e.target.value; $("#vol-out").textContent = Math.round(st.vol * 100) + "%"; };
  $("#sound").onclick = e => { st.sound = !st.sound; e.currentTarget.setAttribute("aria-checked", st.sound); if (!st.sound && synth) synth.cancel(); };

  // Talk bubble + wave
  const talk = (text, on) => { $("#bubble").textContent = text; $("#talk").classList.add("show"); $("#talk").classList.toggle("speaking", !!on); };
  function speak(text) {
    $("#sr-said").textContent = text;
    if (!synth || !st.sound || st.persona === "off" || st.vol === 0) { talk(text, false); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text); u.rate = st.rate; u.volume = st.vol; u.pitch = P[st.persona].pitch || 1;
    const v = synth.getVoices().find(v => v.name === st.voice); if (v) u.voice = v;
    u.onstart = () => talk(text, true); u.onend = u.onerror = () => talk(text, false);
    talk(text, true); synth.speak(u);
  }

  // Line choice
  const CAT = { coffee: "coffee", online: "shopping", big_box: "shopping", groceries: "groceries", fast_food: "delivery", bars: "delivery", gas: "shopping", generic: "shopping" };
  function line(store, amt, count) {
    const p = P[st.persona];
    if (st.persona === "off") return { text: `Logged silently: ${fmt(amt)} at ${store}.`, cat: PN.categorize(LIB, store) };
    const r = PN.pick(LIB, store, amt, count);
    if (p.library) return { text: r.text, cat: r.category };
    const pool = p.lines[CAT[r.category] || "shopping"], l = pool[Math.floor(Math.random() * pool.length)];
    const ord = PN.ordinal(count).toLowerCase();
    return { text: l.split("{m}").join(PN.displayName(LIB, store)).split("{a}").join(fmt(amt)).split("{n}").join(ord), cat: r.category };
  }
  const ICON = { coffee: "☕", online: "📦", big_box: "🛒", groceries: "🥦", fast_food: "🍟", bars: "🍸", gas: "⛽", generic: "💳" };

  // Pay!
  let nt;
  $("#pay").addEventListener("click", () => {
    if (st.busy) return;
    const store = ($("#store").value || "").trim() || "Corner Store", amt = Math.max(0.01, +$("#amount").value || 0);
    st.busy = true; $("#pay").disabled = true; syncTerm();
    const ph = $("#sim-phone"), term = $("#terminal");
    ph.classList.add("tapping"); term.classList.add("reading"); $("#t-status").textContent = "Reading…";
    setTimeout(() => {
      term.classList.remove("reading"); term.classList.add("ok"); $("#t-status").textContent = "Approved ✓";
      const now = Date.now(), rv = PN.recordVisit(data.log, store, now, LIB); data.log = rv.log;
      const { text, cat } = line(store, amt, rv.count);
      data.buys.push({ m: PN.displayName(LIB, store), a: amt, t: now, c: cat }); data.buys = data.buys.filter(b => now - b.t < 7 * 864e5); save();
      $("#visit-n").textContent = rv.count; $("#visit-lbl").textContent = `${rv.count === 1 ? "visit" : "visits"} to ${PN.displayName(LIB, store)} this week`;
      $(".visit-ring").classList.toggle("hot", rv.count >= 4); $(".visit-ring").classList.remove("pop"); void $(".visit-ring").offsetWidth; $(".visit-ring").classList.add("pop");
      const n = $("#notif"); clearTimeout(nt); n.hidden = true; n.classList.remove("out"); void n.offsetWidth;
      $("#notif-title").textContent = `${PN.displayName(LIB, store)} · ${fmt(amt)}`; $("#notif-body").textContent = text; n.hidden = false;
      nt = setTimeout(() => { n.classList.add("out"); setTimeout(() => (n.hidden = true), 400); }, 6000);
      speak(text); render(text, ICON[cat]);
      setTimeout(() => { ph.classList.remove("tapping"); term.classList.remove("ok"); $("#t-status").textContent = "Tap phone"; st.busy = false; $("#pay").disabled = false; }, reduce ? 300 : 1200);
    }, reduce ? 50 : 900);
  });
  $("#reset").addEventListener("click", () => { data = { log: [], buys: [] }; save(); if (synth) synth.cancel(); $("#visit-n").textContent = "0"; $("#visit-lbl").textContent = "visits this week"; $(".visit-ring").classList.remove("hot"); talk("Fresh week. Clean slate. Don't make me regret it.", false); render(); });

  // Dashboard
  function render(quote, ico) {
    const week = data.buys.reduce((s, b) => s + b.a, 0), B = CONFIG.WEEKLY_BUDGET, pct = Math.min(100, week / B * 100);
    $("#d-week").textContent = $("#w-week").textContent = fmt(week);
    $("#d-left").textContent = fmt(Math.max(0, B - week)); $("#d-bar").style.width = $("#w-bar").style.width = pct + "%";
    $("#d-bar").parentElement.classList.toggle("over", week > B);
    if (quote) $("#w-quote").textContent = `“${quote}”`; else if (!data.buys.length) $("#w-quote").textContent = "“Quiet week so far. Suspicious.”";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], tot = Array(7).fill(0), today = new Date().getDay();
    data.buys.forEach(b => (tot[new Date(b.t).getDay()] += b.a)); const mx = Math.max(1, ...tot);
    $("#chart").innerHTML = days.map((d, i) => `<div class="col${i === today ? " today" : ""}"><i style="height:${Math.max(3, tot[i] / mx * 100)}%" title="${d}: ${fmt(tot[i])}"></i><span>${d}</span></div>`).join("");
    const cnt = {}; data.buys.forEach(b => (cnt[b.m] = (cnt[b.m] || 0) + 1));
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 4);
    $("#top").innerHTML = top.length ? top.map(([m, c]) => `<li><span>${m}</span><b>${c}×</b></li>`).join("") : '<li class="empty">Nothing yet. Go tap!</li>';
    const feed = $("#feed");
    if (!data.buys.length) { feed.innerHTML = '<li class="empty">Your purchases will show up here.</li>'; return; }
    if (quote) { feed.querySelector(".empty") && (feed.innerHTML = ""); const b = data.buys[data.buys.length - 1], li = document.createElement("li");
      li.innerHTML = `<span class="m-ico" aria-hidden="true">${ico || "💳"}</span><span class="m-name">${b.m}<small>${quote}</small></span><strong>−${fmt(b.a)}</strong>`; feed.prepend(li); while (feed.children.length > 6) feed.lastChild.remove(); }
    else if (feed.querySelector(".empty")) { feed.innerHTML = data.buys.slice(-6).reverse().map(b => `<li><span class="m-ico" aria-hidden="true">${ICON[b.c] || "💳"}</span><span class="m-name">${b.m}<small>${new Date(b.t).toLocaleDateString(undefined, { weekday: "short" })}</small></span><strong>−${fmt(b.a)}</strong></li>`).join(""); }
  }
  render();
  const clock = () => ($("#ls-time").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/i, "")); clock(); setInterval(clock, 30000);

  // One-Tap Unlock simulator
  const uc = $("#ucard"); let uTimer, uSel = null;
  const lock = msg => { clearInterval(uTimer); uc.className = "ucard locked"; $("#u-lock").textContent = "🔒"; $("#u-name").textContent = "Locked"; $("#u-last").textContent = "Choose a card"; $("#u-tap").disabled = true; $("#u-ring").style.width = "0%"; $$(".saved button").forEach(b => b.setAttribute("aria-checked", "false")); uSel = null; $("#u-msg").textContent = msg || "Locked. Pick a card to unlock."; };
  $$(".saved button").forEach(b => b.addEventListener("click", () => {
    $$(".saved button").forEach(x => x.setAttribute("aria-checked", x === b)); uSel = b;
    uc.className = "ucard unlocked"; uc.style.setProperty("--uc", b.style.getPropertyValue("--c"));
    $("#u-lock").textContent = "🔓"; $("#u-name").textContent = b.dataset.card; $("#u-last").textContent = "•• " + b.dataset.last + " · ready for 1 tap";
    $("#u-tap").disabled = false; $("#u-msg").textContent = `${b.dataset.card} unlocked for one tap. Re-locks in 15s.`;
    clearInterval(uTimer); let t = 15; $("#u-ring").style.width = "100%";
    uTimer = setInterval(() => { t--; $("#u-ring").style.width = (t / 15 * 100) + "%"; if (t <= 0) lock("Timed out, so it locked itself again. Safe."); }, 1000);
  }));
  $("#u-tap").addEventListener("click", () => {
    if (!uSel) return; clearInterval(uTimer); uc.className = "ucard paid"; $("#u-lock").textContent = "✅"; $("#u-last").textContent = "Paid · re-locking…"; $("#u-tap").disabled = true;
    $("#u-msg").textContent = `Paid with ${uSel.dataset.card}. Locking again…`;
    setTimeout(() => lock(`Paid with ${uSel ? uSel.dataset.card : "your card"} and locked again automatically. 🔒`), reduce ? 400 : 1600);
  });
})();
