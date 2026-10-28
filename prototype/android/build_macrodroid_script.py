"""Builds android/macrodroid_pocketnag.js: one self-contained script for MacroDroid's 'JavaScript Code' action."""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
lib = json.load(open(os.path.join(P, "lines.json")))
picker = open(os.path.join(P, "picker.js")).read()
js = f"""// Pocket Nag for MacroDroid. Paste ALL of this into the 'JavaScript Code' action.
// Engine: JetPack JavascriptEngine (default) or QuickJS. Output Variable: nag_line (String).
var module = {{ exports: {{}} }};
{picker}
var PN = module.exports;
var LIB = {json.dumps(lib, ensure_ascii=False)};
// MacroDroid fills in the notification title and text once, when the script starts. Apostrophes are fine, but a double quote in a merchant name would break the line.
var title = magicText.evaluateString("{{not_title}}");
var body = magicText.evaluateString("{{notification}}");
// Google Wallet's purchase alert usually has the merchant as the title and "$X.XX with <card>" in the text.
// Not verified on a real phone: if your alert looks different, adjust these two lines.
var amtMatch = (body + " " + title).match(/\\$\\s?([0-9][0-9,]*\\.?[0-9]*)/);
var amount = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, "")) : 0;
var merchant = title && !/^\\$/.test(title) ? title : body.replace(/\\$.*$/, "");
var log = globals.has("pn_log") ? globals.get("pn_log") : [];
var r = PN.recordVisit(log, merchant, Date.now(), LIB);
globals.set("pn_log", r.log);
mdOutput(PN.pick(LIB, merchant, amount, r.count).text);
"""
open(os.path.join(H, "macrodroid_pocketnag.js"), "w").write(js)
print("wrote", len(js), "bytes")
