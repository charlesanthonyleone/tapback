// Runs Kokoro-82M (Apache-2.0) in the browser for text that has no pre-rendered clip. Model (~90 MB) downloads once and is cached by the browser.
let tts;
const gpuOk = async () => { try { return !!(self.navigator.gpu && await self.navigator.gpu.requestAdapter()); } catch (e) { return false; } };
self.onmessage = async e => {
  const d = e.data;
  try {
    if (d.type === "load") {
      const { KokoroTTS } = await import("https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm");
      tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", await gpuOk() ? { dtype: "fp32", device: "webgpu" } : { dtype: "q8", device: "wasm" });
      self.postMessage({ type: "ready" });
    } else if (d.type === "speak") {
      const a = await tts.generate(d.text, { voice: d.voice, speed: d.speed });
      self.postMessage({ type: "audio", id: d.id, blob: a.toBlob() });
    }
  } catch (err) { self.postMessage({ type: "error", message: String(err) }); }
};
