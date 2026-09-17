const { chromium, devices } = require('playwright');
(async()=>{
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
  const p = await (await b.newContext({...devices['iPhone 13']})).newPage();
  p.on('pageerror', e=>console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8765/?a=demo'); await p.waitForTimeout(1200);
  await (await p.$$('.scard'))[0].click(); await p.waitForTimeout(300);
  await p.evaluate(()=>{ document.querySelector('.kbtn button[data-k="ok"]').click(); document.querySelector('#go').click(); });
  await p.evaluate(()=>__app._jump(11)); await p.waitForTimeout(300); await p.evaluate(()=>document.querySelector('#main').click());
  for(const t of [500,1500,2500,3500,5000,8000]){ await p.waitForTimeout(t - (globalThis.last||0)); globalThis.last = t;
    console.log(t, await p.evaluate(()=>({tv:document.querySelector('#tv')&&document.querySelector('#tv').textContent, sub:document.querySelector('#tsub')&&document.querySelector('#tsub').textContent, scr:__app._state().screen}))); }
  await p.evaluate(()=>__app._jump(5)); await p.waitForTimeout(3000);
  await p.screenshot({path:'qa/out/o3.png'});
  await b.close();
})();
