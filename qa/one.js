// node qa/one.js <indexSeance> <predicate step js> <out> [attente ms] [action: live|prep]
const { chromium, devices } = require('playwright');
(async()=>{
  const [sid, pred, out, wait='2500', action='live'] = process.argv.slice(2);
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
  const ctx = await b.newContext({...devices['iPhone 13']});
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e=>errs.push('PAGEERR '+e.message));
  await p.goto('http://localhost:8765/?a=demo'); await p.waitForTimeout(1200);
  await (await p.$$('.scard'))[+sid].click(); await p.waitForTimeout(400);
  await p.evaluate(()=>{ const k = document.querySelector('.kbtn button[data-k="ok"]'); if(k) k.click(); });
  await p.evaluate(()=>document.querySelector('#go').click()); await p.waitForTimeout(300);
  const idx = await p.evaluate(src=>{ const f = new Function('s','it','return '+src); const S = __app._state(); return S.steps.findIndex(s=>{ const b = S.blocks[s.bi]; const it = b.items && b.items[s.ii]; return f(s, it); }); }, pred);
  await p.evaluate(i=>__app._jump(i), idx); await p.waitForTimeout(600);
  if(action==='live') await p.evaluate(()=>{ const m = document.querySelector('#nofilm') || document.querySelector('#main'); m && m.click(); });
  await p.waitForTimeout(+wait);
  await p.screenshot({path: out});
  console.log(idx, errs);
  await b.close();
})();
