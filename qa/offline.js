// Hors-ligne : 1er lancement avec réseau, puis coupure réseau et rechargement → l'appli et la séance doivent s'afficher.
const pw = require('playwright');
(async()=>{
  const engine = process.argv[2] || 'chromium';
  const opts = engine === 'chromium' ? {args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']} : {};
  const b = await pw[engine].launch(opts);
  const dev = engine === 'webkit' ? pw.devices['iPhone 13'] : pw.devices['Pixel 7'];
  const ctx = await b.newContext({...dev});
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e=>errs.push(e.message));
  await p.goto('http://localhost:8765/?a=demo'); await p.waitForTimeout(2500);
  const swReady = await p.evaluate(async()=>{ if(!navigator.serviceWorker) return 'pas de SW'; const r = await navigator.serviceWorker.ready; return !!r.active; });
  await p.waitForTimeout(1500);
  await ctx.setOffline(true);
  await p.reload(); await p.waitForTimeout(2500);
  const cards = await p.$$eval('.scard b', els => els.map(e=>e.textContent));
  await p.click('.scard'); await p.waitForTimeout(500);
  await p.evaluate(()=>{ document.querySelector('#go').click(); });
  await p.waitForTimeout(1500);
  const gl = await p.evaluate(()=>!!document.querySelector('#gl') && !document.querySelector('.fallback'));
  await p.screenshot({path:`qa/out/offline-${engine}.png`});
  console.log(engine, {swReady, cards, gl, errs});
  await b.close();
})();
