/* Tapback line picker. Works in the browser (window.Tapback), Node (require) and MacroDroid's JavaScript Code action. */
(function (root) {
  function ordinal(n) { var s = ["TH", "ST", "ND", "RD"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9&.\- ]/g, " ").replace(/\s+/g, " ").trim(); }
  var STORE_NO = /\s*(#|no\.?\s|store\s|t-)?\s*\d{2,}.*$/i;
  function clean(s) { return String(s || "").replace(STORE_NO, "").replace(/\s+(mktp|marketplace)\b.*$/i, "").trim(); }
  function displayName(lib, merchant) {
    var c = clean(merchant), n = norm(c), map = (lib.meta && lib.meta.display_names) || {};
    for (var k in map) if (k.length <= 3 ? (" " + n + " ").indexOf(" " + k + " ") >= 0 : n.indexOf(k) >= 0) return map[k];
    return c.toLowerCase().replace(/(^|[\s\-])([a-z])/g, function (_, a, b) { return a + b.toUpperCase(); }) || "this place";
  }
  function visitKey(lib, merchant) { return norm(displayName(lib, merchant)); }
  function categorize(lib, merchant) {
    var m = " " + norm(merchant) + " ", order = lib.meta.order;
    for (var i = 0; i < order.length; i++) {
      var kws = lib.categories[order[i]].keywords || [];
      for (var j = 0; j < kws.length; j++) {
        var k = norm(kws[j]);
        // short keywords (bp, 76, bar) must match a whole word; longer ones can match inside (e.g. "mcdonalds")
        if (k.length <= 3 ? m.indexOf(" " + k + " ") >= 0 : m.indexOf(k) >= 0) return order[i];
      }
    }
    return "generic";
  }
  // log: array of {m: normalisedMerchant, t: epochMs}. Returns the new pruned log and this visit's count (includes this one).
  function recordVisit(log, merchant, now, lib) {
    now = now || Date.now(); var key = lib ? visitKey(lib, merchant) : norm(clean(merchant)), week = 7 * 864e5;
    log = (log || []).filter(function (e) { return now - e.t < week; });
    log.push({ m: key, t: now });
    var count = log.filter(function (e) { return e.m === key; }).length;
    return { log: log, count: count };
  }
  function pick(lib, merchant, amount, count, rnd) {
    rnd = rnd || Math.random; var cat = categorize(lib, merchant), c = lib.categories[cat], meta = lib.meta, pool;
    var amt = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, "")) || 0;
    if (count <= 2 && amt >= meta.big_threshold && rnd() < 0.5) pool = c.big;
    else if (count <= 2 && amt > 0 && amt <= meta.small_threshold && rnd() < 0.5) pool = c.small;
    else pool = c[String(Math.min(Math.max(count, 1), 4))];
    var line = pool[Math.floor(rnd() * pool.length)];
    var display = displayName(lib, merchant); // "MCDONALD'S #1234" -> "McDonald's"
    var money = "$" + amt.toFixed(2);
    return { category: cat, count: count, text: line.split("{count}").join(ordinal(count)).split("{merchant}").join(display).split("{amount}").join(money) };
  }
  var api = { ordinal: ordinal, displayName: displayName, visitKey: visitKey, categorize: categorize, recordVisit: recordVisit, pick: pick, norm: norm };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Tapback = api;
})(typeof window !== "undefined" ? window : this);
