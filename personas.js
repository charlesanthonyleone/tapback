// Tapback personalities (shared by app.html and demo.html)
window.PERSONAS = {
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


(() => {
  const box = document.getElementById("persona-cards"); if (!box) return;
  Object.entries(PERSONAS).forEach(([k, p]) => {
    const sample = p.library ? "THIRD time at McDonald's this week?! Are you collecting the toys?" : p.lines ? p.lines.coffee[0].replace("{m}", "Starbucks").replace("{a}", "$6.45").replace("{n}", "three") : "Logged silently.";
    const c = document.createElement("a"); c.href = "demo.html?persona=" + k; c.className = "card persona reveal";
    c.innerHTML = `<div class="emoji" aria-hidden="true">${p.emoji}</div><h3>${p.label}</h3><p>${p.desc}</p><q>${sample}</q><span class="try">Try in the demo →</span>`;
    box.appendChild(c);
  });
})();
