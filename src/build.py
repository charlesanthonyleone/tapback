"""Builds the Tapback site: wraps src/pages/*.html with the shared head, header and footer.
Each page file starts with a front-matter block:  <!--title: ...\ndesc: ...\nscripts: a.js b.js\nnav: key-->"""
import os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://charlesanthonyleone.github.io/tapback/"
NAV = [("index.html","Home","home"),("app.html","The App","app"),("demo.html","Demo","demo"),("glass-card.html","Glass Card","glass"),("pricing.html","Pricing","pricing"),("about.html","About","about")]
def head(title, desc, page):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">{'<base href="/tapback/">' if page=='404.html' else ''}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0a0614">
<link rel="icon" href="assets/favicon.png" type="image/png"><link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Tapback"><meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{URL}assets/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="{URL}{'' if page=='index.html' else page}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="styles.css">
</head>'''
def header(active):
    links = "".join(f'<a href="{h}"{" aria-current=\"page\"" if k==active else ""}>{t}</a>' for h,t,k in NAV)
    return f'''<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap nav-in">
    <a href="index.html" class="logo"><img src="assets/logo.webp" alt="" width="30" height="30" class="logo-img"><span>Tapback</span></a>
    <button id="menu-toggle" class="menu-toggle" aria-expanded="false" aria-controls="site-menu"><span class="sr">Menu</span><i></i><i></i><i></i></button>
    <nav id="site-menu" aria-label="Primary">{links}<a href="demo.html" class="btn btn-sm nav-cta">Try the demo</a></nav>
  </div>
</header>'''
FOOT = '''<footer class="footer">
  <div class="wrap foot-grid">
    <div class="foot-brand"><a href="index.html" class="logo"><img src="assets/logo.webp" alt="" width="30" height="30" class="logo-img" loading="lazy"><span>Tapback</span></a>
      <p>Your tap gets a comeback.</p>
      <form class="waitlist waitlist-sm" novalidate><label class="sr" for="f-email">Email address</label><input id="f-email" type="email" placeholder="you@example.com" autocomplete="email" required><button class="btn btn-sm" type="submit">Join</button></form>
      <p class="wl-msg" role="status" aria-live="polite"></p></div>
    <nav aria-label="Product"><h4>Product</h4><a href="app.html">The App</a><a href="demo.html">Live demo</a><a href="glass-card.html">Glass Card</a><a href="pricing.html">Pricing</a></nav>
    <nav aria-label="Company"><h4>Company</h4><a href="about.html">About</a><a href="press.html">Press kit</a></nav>
    <nav aria-label="Help"><h4>Help</h4><a href="faq.html">FAQ</a><a href="support.html">Support</a><a href="prototype/SETUP_GUIDE.pdf">Setup guide (PDF)</a></nav>
    <nav aria-label="Legal"><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></nav>
  </div>
  <div class="wrap foot-base"><span>© <span data-year>2026</span> Tapback · Founded by <span data-founder>Roseann Mary Geiger</span></span><span>Not a bank. No ads. Your data is never sold.</span></div>
</footer>'''
for f in sorted(os.listdir(os.path.join(R,"src","pages"))):
    src = open(os.path.join(R,"src","pages",f)).read()
    m = re.match(r"<!--(.*?)-->\n", src, re.S); meta = dict((x.strip() for x in l.split(":",1)) for l in m.group(1).strip().splitlines())
    body = src[m.end():]
    scripts = "".join(f'<script src="{s}"></script>\n' for s in (["site.js"] + meta.get("scripts","").split()) if s)
    html = head(meta["title"], meta["desc"], f) + "\n" + header(meta.get("nav","")) + f'\n<main id="main">\n{body}</main>\n' + FOOT + "\n" + scripts + "</body>\n</html>\n"
    open(os.path.join(R,f),"w").write(html); print("built", f)
