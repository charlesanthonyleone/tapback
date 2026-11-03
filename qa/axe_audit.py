import asyncio
from playwright.async_api import async_playwright
src=open('qa/node_modules/axe-core/axe.min.js').read()
P='index app demo pricing faq about support glass-card press privacy terms 404'.split()
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch(); q=await b.new_page()
    for u in P:
      await q.goto(f'http://localhost:8931/{u}.html'); await q.add_script_tag(content=src)
      r=await q.evaluate('axe.run().then(r=>r.violations.map(v=>v.id+"("+v.nodes.length+"): "+v.nodes.slice(0,2).map(n=>n.target.join(" ")).join(" | ")))')
      print(u,r)
    await b.close()
asyncio.run(m())
