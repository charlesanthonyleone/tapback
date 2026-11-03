import asyncio,sys
from playwright.async_api import async_playwright
import os;os.makedirs('qa/out',exist_ok=True);B='http://localhost:8931/'
PAGES=['index.html','app.html','demo.html','pricing.html','faq.html','about.html','support.html','glass-card.html','press.html']
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(); pg=await c.new_page()
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(B+'index.html'); await pg.evaluate('navigator.serviceWorker.ready.then(()=>1)')
    await pg.reload(); await pg.wait_for_timeout(1000)
    await c.set_offline(True)
    for u in ['index.html','faq.html','nonexistent-offline.html']:
      try: r=await pg.goto(B+u); print('offline',u,r.status if r else None, (await pg.title()))
      except Exception as e: print('offline FAIL',u,e)
    await c.set_offline(False)
    for w in [360,390,768]:
      c2=await b.new_context(viewport={'width':w,'height':800},device_scale_factor=1); q=await c2.new_page()
      q.on('pageerror',lambda e:errs.append(str(e)))
      for u in PAGES:
        await q.goto(B+u); await q.wait_for_timeout(300)
        ov=await q.evaluate('document.documentElement.scrollWidth-innerWidth')
        wide=await q.evaluate('[...document.querySelectorAll("body *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&getComputedStyle(e).position!="fixed").slice(0,3).map(e=>e.tagName+"."+e.className)')
        if ov>0: print(w,u,'overflow',ov,wide)
        if u=='index.html': await q.screenshot(path=f'qa/out/{w}-{u}.png',full_page=False)
      await c2.close()
    print('errors',errs[:5]); await b.close()
asyncio.run(main())
