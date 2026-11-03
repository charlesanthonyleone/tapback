/* Tapback voice: natural pre-rendered clips (Kokoro-82M, Apache-2.0), optional in-browser Kokoro for custom text,
   and the best available system voice as a last resort. Works in the browser (window.TapbackVoice) and Node (require). */
(function (root) {
  // Kokoro voice per persona (all voicepacks ship with Kokoro-82M under Apache-2.0)
  var VOICES = { coach: { id: "af_heart", speed: 1.0 }, sassy: { id: "af_bella", speed: 1.05 }, strict: { id: "bm_george", speed: 1.05 }, grandma: { id: "bf_emma", speed: 0.92 } };
  var WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  var TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  var ORD = { one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth" };
  function num(n) { n = Math.floor(n); if (n < 20) return WORDS[n]; if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + WORDS[n % 10] : "");
    if (n < 1000) return WORDS[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + num(n % 100) : ""); return String(n); }
  function ordWord(n) { var w = num(n), p = w.split("-"), l = p.pop(); l = ORD[l] || (/y$/.test(l) ? l.slice(0, -1) + "ieth" : l + "th"); p.push(l); return p.join("-"); }
  function money(d, c) { var s = num(+d) + (+d === 1 ? " dollar" : " dollars"); return +c ? s + " " + num(+c) : s; }
  // Turn display text into something a TTS engine reads naturally
  function speechText(t) {
    return String(t).replace(/\$(\d+)(?:\.(\d\d))?/g, function (_, d, c) { return money(d, c || 0); })
      .replace(/\b(\d+)(ST|ND|RD|TH|st|nd|rd|th)\b/g, function (_, n) { return ordWord(+n); })
      .replace(/\b([A-Z]{3,})\b/g, function (w) { return /^(KFC|CVS|ATM)$/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase(); })
      .replace(/\s+/g, " ").trim();
  }
  function hash(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
  function key(persona, text) { return hash(persona + "|" + speechText(text)); }
  var api = { VOICES: VOICES, speechText: speechText, hash: hash, key: key, num: num, ordWord: ordWord };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  // ---------- Browser engine ----------
  var manifest = null, audio = null, worker = null, pending = {}, seq = 0, neural = "off", listeners = [];
  var synth = root.speechSynthesis;
  function emit() { listeners.forEach(function (f) { f(neural); }); }
  fetch("assets/voice/manifest.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (m) { manifest = m; }).catch(function () {});
  function bestSystemVoice(pref) {
    if (!synth) return null; var vs = synth.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
    if (pref) { var p = vs.find(function (v) { return v.name === pref; }); if (p) return p; }
    var rank = [/natural/i, /neural/i, /premium|enhanced/i, /google (us|uk) english/i, /samantha|ava|allison|serena|karen|daniel/i];
    for (var i = 0; i < rank.length; i++) { var f = vs.find(function (v) { return rank[i].test(v.name); }); if (f) return f; }
    return vs[0] || null;
  }
  function stop() { if (audio) { audio.pause(); audio.onended = null; } if (synth) synth.cancel(); seq++; }
  function playUrl(url, opts, my) {
    audio = audio || new Audio(); audio.src = url; audio.volume = opts.volume == null ? 1 : opts.volume; audio.playbackRate = opts.rate || 1;
    audio.onplay = function () { if (my === seq && opts.onstart) opts.onstart("natural"); };
    audio.onended = audio.onerror = function () { if (my === seq && opts.onend) opts.onend(); };
    return audio.play();
  }
  function system(text, opts, my) {
    if (!synth) { opts.onend && opts.onend(); return; }
    var u = new SpeechSynthesisUtterance(speechText(text)); u.rate = opts.rate || 1; u.volume = opts.volume == null ? 1 : opts.volume; u.pitch = opts.pitch || 1;
    var v = bestSystemVoice(opts.systemVoice); if (v) u.voice = v;
    u.onstart = function () { if (my === seq && opts.onstart) opts.onstart("system"); }; u.onend = u.onerror = function () { if (my === seq && opts.onend) opts.onend(); };
    synth.speak(u);
  }
  function enableNeural() {
    if (worker) return; neural = "loading"; emit();
    try { worker = new Worker("tb-voice-worker.js", { type: "module" }); } catch (e) { neural = "error"; emit(); return; }
    worker.onmessage = function (e) { var d = e.data;
      if (d.type === "ready") { neural = "ready"; emit(); }
      else if (d.type === "error") { neural = "error"; emit(); Object.keys(pending).forEach(function (id) { pending[id](null); delete pending[id]; }); }
      else if (d.type === "audio" && pending[d.id]) { pending[d.id](d.blob); delete pending[d.id]; } };
    worker.onerror = function () { neural = "error"; emit(); };
    worker.postMessage({ type: "load" });
  }
  function speak(persona, text, opts) {
    opts = opts || {}; stop(); var my = seq, v = VOICES[persona];
    if (!v) { opts.onend && opts.onend(); return; }
    var k = key(persona, text);
    if (manifest && manifest.clips && manifest.clips.indexOf(k) >= 0) {
      var p = playUrl("assets/voice/" + k + ".mp3", opts, my); if (p && p.catch) p.catch(function () { if (my === seq) system(text, opts, my); }); return;
    }
    if (neural === "ready") { var id = ++seq; my = id; var done = false, to = setTimeout(function () { if (!done && my === seq) { done = true; system(text, opts, my); } }, 12000);
      pending[id] = function (blob) { clearTimeout(to); if (done || my !== seq) return; done = true; if (blob) playUrl(URL.createObjectURL(blob), opts, my); else system(text, opts, my); };
      worker.postMessage({ type: "speak", id: id, text: speechText(text), voice: v.id, speed: v.speed }); return; }
    system(text, opts, my);
  }
  root.TapbackVoice = { VOICES: VOICES, speechText: speechText, key: key, speak: speak, stop: stop, enableNeural: enableNeural,
    neuralState: function () { return neural; }, onNeural: function (f) { listeners.push(f); }, bestSystemVoice: bestSystemVoice };
})(typeof window !== "undefined" ? window : this);
