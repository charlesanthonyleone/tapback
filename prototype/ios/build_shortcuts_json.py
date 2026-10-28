"""Builds ios/lines_for_shortcuts.json (compact library to paste into the Shortcuts Text action)."""
import json, os
H=os.path.dirname(os.path.abspath(__file__)); L=json.load(open(os.path.join(H,"..","lines.json")))
out={"order":L["meta"]["order"],"big":L["meta"]["big_threshold"],
     "cats":{c:{**{k:v[k] for k in ("1","2","3","4","big","small")},"match":v["match"]} for c,v in L["categories"].items()}}
json.dump(out,open(os.path.join(H,"lines_for_shortcuts.json"),"w"),ensure_ascii=False,separators=(",",":"))
print(os.path.getsize(os.path.join(H,"lines_for_shortcuts.json")))
