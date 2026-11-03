// Pre-renders every line the demo can say for its preset stores with Kokoro-82M (Apache-2.0), as small mono MP3s.
// Usage: (cd /workspace/qa && node /workspace/tapback/tools/render_voices.mjs [shard] [shards])   needs kokoro-js + ffmpeg
import { createRequire } from "module"; import fs from "fs"; import { execFileSync } from "child_process";
const require = createRequire(import.meta.url), R = new URL("..", import.meta.url).pathname;
const V = require(R + "tb-voice.js"), PN = require(R + "pn-picker.js");
const load = f => { const w = {}; new Function("window", "document", "PERSONAS", fs.readFileSync(R + f, "utf8").replace(/Object.entries\(PERSONAS\)/g, "Object.entries(window.PERSONAS)"))(w, { getElementById: () => null }); return w; };
const LIB = load("pn-lines.js").TapbackLines, P = load("personas.js").PERSONAS;
const STORES = [...fs.readFileSync(R + "src/pages/demo.html", "utf8").matchAll(/data-store="([^"]+)" data-amt="([^"]+)"/g)].map(m => [m[1].replace("&#39;", "'"), +m[2]]);
const CAT = { coffee: "coffee", online: "shopping", big_box: "shopping", groceries: "groceries", fast_food: "delivery", bars: "delivery", gas: "shopping", generic: "shopping" };
const fmt = n => "$" + n.toFixed(2), jobs = new Map(), add = (p, t) => jobs.set(V.key(p, t), [p, t]);
for (const [store, amt] of STORES) {
  const cat = PN.categorize(LIB, store), c = LIB.categories[cat], name = PN.displayName(LIB, store);
  const fill = (l, n) => l.split("{count}").join(PN.ordinal(n)).split("{merchant}").join(name).split("{amount}").join(fmt(amt));
  for (const t of ["1", "2", "3", "4", "big", "small"]) for (const l of c[t] || []) for (const n of (t === "4" ? [4, 5, 6] : t === "big" || t === "small" ? [1, 2] : [+t])) add("sassy", fill(l, n));
  for (const p of ["coach", "strict", "grandma"]) for (const l of P[p].lines[CAT[cat]]) { if (/\{(pct|week)\}/.test(l)) continue;
    for (const n of (l.includes("{n}") ? [1, 2, 3, 4, 5, 6] : [1])) add(p, l.split("{m}").join(name).split("{a}").join(fmt(amt)).split("{n}").join(String(n))); }
}
for (const [p, x] of Object.entries(P)) if (x.lines) add(p, x.library ? "THIRD time at McDonald's this week?! Are you collecting the toys?" : x.lines.coffee[0].replace("{m}", "Starbucks").replace("{a}", "$6.45").replace("{n}", "three"));
for (const p of Object.keys(V.VOICES)) add(p, "Fresh week. Clean slate. Don't make me regret it.");
const all = [...jobs.keys()].sort(), [shard, shards] = [+(process.argv[2] || 0), +(process.argv[3] || 1)];
if (process.argv[2] === "manifest") {
  for (const f of fs.readdirSync(R + "assets/voice")) if (f.endsWith(".mp3") && !jobs.has(f.slice(0, -4))) fs.rmSync(R + "assets/voice/" + f);
  const have = all.filter(k => fs.existsSync(`${R}assets/voice/${k}.mp3`));
  fs.writeFileSync(R + "assets/voice/manifest.json", JSON.stringify({ engine: "Kokoro-82M v1.0 (Apache-2.0)", voices: V.VOICES, clips: have }));
  console.log("manifest", have.length, "/", all.length); process.exit(0);
}
const { KokoroTTS } = await import(process.env.KOKORO || "kokoro-js");
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });
for (const [i, k] of all.entries()) { if (i % shards !== shard) continue; const out = `${R}assets/voice/${k}.mp3`; if (fs.existsSync(out)) continue;
  const [p, t] = jobs.get(k), v = V.VOICES[p], a = await tts.generate(V.speechText(t), { voice: v.id, speed: v.speed }), wav = `/tmp/tb_${k}.wav`; await a.save(wav);
  try { execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", wav, "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,aformat=sample_fmts=s16:sample_rates=24000:channel_layouts=mono", "-b:a", "40k", out]); } catch (e) { fs.rmSync(out, { force: true }); console.error("FAIL", k, t); } fs.rmSync(wav, { force: true });
  console.log(i, p, t); }
