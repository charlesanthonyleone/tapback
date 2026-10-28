"""Pocket Nag picker (Python port). Usage: python3 picker.py "MCDONALD'S #123" 8.49"""
import json, random, re, sys, time, os
HERE = os.path.dirname(os.path.abspath(__file__))
def ordinal(n):
    v = n % 100; s = ["TH","ST","ND","RD"]
    return f"{n}{s[(v-20)%10] if 0 < (v-20)%10 < 4 and not 10<=v<=20 else (s[v] if v<4 else 'TH')}"
def norm(s): return re.sub(r"\s+"," ",re.sub(r"[^a-z0-9&.\- ]"," ",str(s).lower().replace("'","").replace("’",""))).strip()
STORE_NO = re.compile(r"\s*(#|no\.?\s|store\s|t-)?\s*\d{2,}.*$", re.I)
def clean(s): return re.sub(r"\s+(mktp|marketplace)\b.*$","",STORE_NO.sub("",str(s)),flags=re.I).strip()
def display_name(lib, merchant):
    c = clean(merchant); n = norm(c)
    for k, v in lib["meta"].get("display_names", {}).items():
        if ((f" {k} " in f" {n} ") if len(k) <= 3 else (k in n)): return v
    return re.sub(r"(^|[\s\-])([a-z])", lambda m: m.group(1)+m.group(2).upper(), c.lower()) or "this place"
def categorize(lib, merchant):
    m = f" {norm(merchant)} "
    for cat in lib["meta"]["order"]:
        for k in map(norm, lib["categories"][cat]["keywords"]):
            if (f" {k} " in m) if len(k) <= 3 else (k in m): return cat
    return "generic"
def record_visit(log, merchant, now=None, lib=None):
    now = now or time.time()*1000; key = norm(display_name(lib, merchant)) if lib else norm(clean(merchant))
    log = [e for e in log if now - e["t"] < 7*864e5] + [{"m": key, "t": now}]
    return log, sum(e["m"] == key for e in log)
def pick(lib, merchant, amount, count, rnd=random.random):
    cat = categorize(lib, merchant); c = lib["categories"][cat]; meta = lib["meta"]
    if count <= 2 and amount >= meta["big_threshold"] and rnd() < .5: pool = c["big"]
    elif count <= 2 and 0 < amount <= meta["small_threshold"] and rnd() < .5: pool = c["small"]
    else: pool = c[str(min(max(count,1),4))]
    name = display_name(lib, merchant)
    line = pool[int(rnd()*len(pool))]
    return cat, line.replace("{count}",ordinal(count)).replace("{merchant}",name).replace("{amount}",f"${amount:.2f}")
if __name__ == "__main__":
    lib = json.load(open(os.path.join(HERE,"lines.json")))
    m = sys.argv[1] if len(sys.argv)>1 else "MCDONALD'S #4521"; a = float(sys.argv[2]) if len(sys.argv)>2 else 8.49
    log = []
    for _ in range(4):
        log, n = record_visit(log, m, lib=lib); print(n, *pick(lib, m, a, n))
