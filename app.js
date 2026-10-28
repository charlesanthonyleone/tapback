// ===== Config: rename the product here =====
const CONFIG = { BRAND: "Pocket Nag", WEEKLY_BUDGET: 250 };

document.querySelectorAll("[data-brand]").forEach(el => (el.textContent = CONFIG.BRAND));
document.title = `${CONFIG.BRAND}: Your wallet finally has something to say`;

const MERCHANTS = [
  { name: "McDonald's", amount: 11.38, cat: "delivery", icon: "🍟", color: "#3d2a10" },
  { name: "Starbucks", amount: 6.45, cat: "coffee", icon: "☕", color: "#1f3d2e" },
  { name: "Amazon", amount: 89.99, cat: "shopping", icon: "📦", color: "#3d2f14" },
  { name: "Whole Foods", amount: 142.10, cat: "groceries", icon: "🥦", color: "#173d22" },
  { name: "DoorDash", amount: 38.20, cat: "delivery", icon: "🛵", color: "#3d1a17" },
  { name: "Target", amount: 23.17, cat: "shopping", icon: "🎯", color: "#3d1420" },
];

const PERSONAS = {
  coach: { label: "Gentle Coach", emoji: "🌱", desc: "Kind and encouraging, and it still keeps you honest.", pitch: 1.0,
    lines: {
      coffee: ["{m}, {a}. A little treat is fine. Just keep an eye on how often.", "Coffee number {n} this week. Maybe brew one at home tomorrow?"],
      shopping: ["{a} at {m}. Was that on your list? No judgement, just checking.", "{m} again. Let's pause for a second before the next one."],
      groceries: ["Nice, groceries. That's a responsible one.", "{a} on groceries. Cooking at home is a great move."],
      delivery: ["Delivery for {a}. Totally okay on a busy day.", "{m} again. Want to plan a couple of home meals this week?"] } },
  sassy: { label: "Sassy Friend", emoji: "💅", desc: "Your bestie who absolutely will say something, and gets louder each visit.", pitch: 1.2, library: true,
    lines: {
      coffee: ["Man, AGAIN? Coffee number {n} this week.", "{a} for bean water. Iconic. Financially questionable."],
      shopping: ["Whoa, what are you doing? {a} at {m}?", "Another {m} box? Your porch is a warehouse now."],
      groceries: ["Groceries? Look at you, being an adult.", "{a} on actual food. I'm proud and a little shocked."],
      delivery: ["{m} again? Your kitchen misses you.", "{a} so someone else can carry your dinner up the stairs. Okay, royalty."] } },
  strict: { label: "Strict Accountant", emoji: "📊", desc: "Numbers only. No feelings. Plenty of facts.", pitch: 0.85,
    lines: {
      coffee: ["{m}: {a}. Coffee transactions this week: {n}.", "Logged {a}. Discretionary spending is rising."],
      shopping: ["{m}: {a}. You have used {pct} percent of your weekly budget.", "Unplanned purchase noted: {a}. Please justify it."],
      groceries: ["Groceries, {a}. Essential category. Approved.", "{a} recorded under essentials. Acceptable."],
      delivery: ["Delivery fee and markup estimated at thirty percent. Total {a}.", "{m}: {a}. Weekly total is now {week}."] } },
  grandma: { label: "Grandma", emoji: "👵", desc: "Loving, a little worried, remembers when bread cost a nickel.", pitch: 1.1,
    lines: {
      coffee: ["{a} for a coffee? Sweetheart, I have a perfectly good percolator.", "Another coffee, dear? That's {n} this week. Are you sleeping?"],
      shopping: ["Oh honey, {a} at {m}? What did you buy now?", "In my day, {a} bought a whole week of groceries."],
      groceries: ["Groceries! Good. Make sure you eat a vegetable.", "{a} on food. Good. You're too thin."],
      delivery: ["{m} again? I'd have made you soup.", "{a} for takeout? Come over, I'll cook."] } },
  off: { label: "Off", emoji: "🔕", desc: "Silent tracking. It just logs your purchases.", pitch: 1, lines: null },
};

const $ = s => document.querySelector(s);
const fmt = n => "$" + n.toFixed(2);
const state = { persona: "sassy", rate: 1, sound: true, voice: "", week: 0, coffees: 0, last: null };

// Personality chips + cards
const chipBox = $("#persona-chips"), cardBox = $("#persona-cards");
function selectPersona(key, focus) {
  state.persona = key;
  chipBox.querySelectorAll(".chip").forEach(c => { const on = c.dataset.k === key; c.setAttribute("aria-checked", on); c.tabIndex = on ? 0 : -1; if (on && focus) c.focus(); });
  cardBox.querySelectorAll(".persona").forEach(c => { c.classList.toggle("active", c.dataset.k === key); c.setAttribute("aria-pressed", c.dataset.k === key); });
}
Object.entries(PERSONAS).forEach(([k, p]) => {
  const b = document.createElement("button");
  b.className = "chip"; b.type = "button"; b.dataset.k = k; b.setAttribute("role", "radio");
  b.textContent = `${p.emoji} ${p.label}`; b.onclick = () => selectPersona(k);
  chipBox.appendChild(b);
  const sample = p.lines ? p.lines.coffee[0].replace("{m}", "Starbucks").replace("{a}", "$6.45").replace("{n}", "three") : "Logged silently.";
  const c = document.createElement("button");
  c.className = "card persona reveal"; c.dataset.k = k; c.type = "button";
  c.innerHTML = `<div class="emoji" aria-hidden="true">${p.emoji}</div><h3>${p.label}</h3><p>${p.desc}</p><q>${sample}</q>`;
  c.onclick = () => { selectPersona(k); $("#demo").scrollIntoView({ behavior: "smooth" }); };
  cardBox.appendChild(c);
});
chipBox.addEventListener("keydown", e => {
  const keys = Object.keys(PERSONAS); let i = keys.indexOf(state.persona);
  if (["ArrowRight", "ArrowDown"].includes(e.key)) i = (i + 1) % keys.length;
  else if (["ArrowLeft", "ArrowUp"].includes(e.key)) i = (i - 1 + keys.length) % keys.length; else return;
  e.preventDefault(); selectPersona(keys[i], true);
});
selectPersona(state.persona);

// Voice controls
const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
function loadVoices() {
  if (!synth) return;
  const sel = $("#voice"), vs = synth.getVoices().filter(v => v.lang.startsWith("en"));
  sel.innerHTML = '<option value="">Default voice</option>' + vs.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join("");
  sel.value = state.voice;
}
if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }
else $("#speech-support").textContent = "Your browser doesn't support speech, so comments will show as text only.";
$("#voice").onchange = e => (state.voice = e.target.value);
$("#rate").oninput = e => { state.rate = +e.target.value; $("#rate-out").textContent = state.rate.toFixed(1) + "×"; };
$("#sound").onclick = e => { state.sound = !state.sound; e.currentTarget.setAttribute("aria-checked", state.sound); if (!state.sound && synth) synth.cancel(); };

function speak(text) {
  if (!synth || !state.sound || state.persona === "off") return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = state.rate; u.pitch = PERSONAS[state.persona].pitch;
  const v = synth.getVoices().find(v => v.name === state.voice); if (v) u.voice = v;
  synth.speak(u);
}

// Real prototype picker (prototype/picker.js + lines.json): per-merchant visits over a rolling 7 days
let visitLog = []; try { visitLog = JSON.parse(localStorage.getItem("pocketnag_visits") || "[]"); } catch {}
function comment(m) {
  const p = PERSONAS[state.persona];
  const lib = window.PocketNagLines, PN = window.PocketNag;
  let count = 1;
  if (lib && PN) { const r = PN.recordVisit(visitLog, m.name, Date.now(), lib); visitLog = r.log; count = r.count;
    try { localStorage.setItem("pocketnag_visits", JSON.stringify(visitLog)); } catch {} }
  m.visits = count;
  if (!p.lines) return `Logged ${fmt(m.amount)} at ${m.name}.`;
  if (p.library && lib && PN) return PN.pick(lib, m.name, m.amount, count).text;
  const pool = p.lines[m.cat];
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return pool[Math.floor(Math.random() * pool.length)]
    .replaceAll("{m}", m.name).replaceAll("{a}", fmt(m.amount))
    .replaceAll("{n}", words[state.coffees] || state.coffees)
    .replaceAll("{pct}", Math.round((state.week / CONFIG.WEEKLY_BUDGET) * 100))
    .replaceAll("{week}", fmt(state.week));
}

let notifTimer;
$("#simulate").onclick = () => {
  // McDonald's comes up often so the escalation is easy to hear (1st → 2nd → 3rd → 4th visit this week)
  let m = Math.random() < 0.45 ? MERCHANTS[0] : MERCHANTS[1 + Math.floor(Math.random() * (MERCHANTS.length - 1))];
  state.last = m; state.week += m.amount; if (m.cat === "coffee") state.coffees++;
  const text = comment(m);
  const feed = $("#feed"); feed.querySelector(".empty")?.remove();
  const li = document.createElement("li");
  li.innerHTML = `<span class="m-ico" style="background:${m.color}" aria-hidden="true">${m.icon}</span><span class="m-name">${m.name}<small>visit #${m.visits} this week · just now</small></span><strong>−${fmt(m.amount)}</strong>`;
  feed.prepend(li); while (feed.children.length > 6) feed.lastChild.remove();
  $("#phone-week").textContent = $("#w-week").textContent = fmt(state.week);
  $("#w-bar").style.width = Math.min(100, (state.week / CONFIG.WEEKLY_BUDGET) * 100) + "%";
  $("#w-quote").textContent = `“${text}”`;
  const n = $("#notif"); clearTimeout(notifTimer);
  n.hidden = true; n.classList.remove("out"); void n.offsetWidth;
  $("#notif-title").textContent = `${m.name} · ${fmt(m.amount)}`; $("#notif-body").textContent = text; n.hidden = false;
  notifTimer = setTimeout(() => { n.classList.add("out"); setTimeout(() => (n.hidden = true), 400); }, 5000);
  speak(text);
};

// Waitlist (front-end only, saved to localStorage)
const KEY = CONFIG.BRAND.toLowerCase().replace(/\s+/g,"") + "_waitlist";
$("#waitlist").onsubmit = e => {
  e.preventDefault();
  const inp = $("#email"), msg = $("#wl-msg");
  if (!inp.checkValidity() || !inp.value) { msg.className = "wl-msg err"; msg.textContent = "Please enter a valid email."; inp.focus(); return; }
  const list = JSON.parse(localStorage.getItem(KEY) || "[]");
  if (!list.includes(inp.value)) list.push(inp.value);
  localStorage.setItem(KEY, JSON.stringify(list));
  msg.className = "wl-msg"; msg.textContent = `Thanks! You're on the ${CONFIG.BRAND} list. We'll be in touch.`; inp.value = "";
};

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
