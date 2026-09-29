// Mise à jour : une nouvelle version publiée recharge l'appli si l'athlète est sur l'accueil, et attend la fin de la séance sinon.
const { chromium, devices } = require('playwright'), fs = require('fs'), path = require('path');
const SW = path.join(__dirname, '..', 'docs', 'sw.js');
(async()=>{
  const orig = fs.readFileSync(SW, 'utf8');
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
  const ctx = await b.newContext({...devices['Pixel 7']});
  await ctx.addInitScript(()=>{ try{ localStorage.setItem('cu.installVu','1'); }catch(e){} });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  let loads = 0; p.on('load', () => loads++);
  const bump = tag => fs.writeFileSync(SW, orig.replace(/const VERSION = 'cu-[^']*'/, `const VERSION = 'cu-test-${tag}'`));
  const out = {};
  try{
    await p.goto('http://localhost:8765/?a=demo'); await p.waitForTimeout(2500);
    await p.reload(); await p.waitForTimeout(2000);                       // contrôlée par le service worker
    out.controlled = await p.evaluate(()=>!!navigator.serviceWorker.controller);
    // 1. sur l'accueil : rechargement automatique
    let l0 = loads; bump('a');
    await p.evaluate(async ()=>{ const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
    await p.waitForTimeout(4000);
    out.accueil_recharge = loads > l0;
    // 2. en séance : pas de rechargement, puis rechargement au retour à l'accueil
    await p.evaluate(()=>[...document.querySelectorAll('.scard')][0].click()); await p.waitForTimeout(400);
    await p.evaluate(()=>document.querySelector('#go').click()); await p.waitForTimeout(800);
    l0 = loads; bump('b');
    await p.evaluate(async ()=>{ const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
    await p.waitForTimeout(4000);
    out.seance_pas_recharge = loads === l0 && await p.evaluate(()=>!!__app._state());
    await p.evaluate(()=>document.querySelector('#btnQuit').click()); await p.waitForTimeout(500);
    await p.evaluate(()=>document.querySelector('#later').click()); await p.waitForTimeout(3000);
    out.recharge_au_retour = loads > l0;
  } finally { fs.writeFileSync(SW, orig); }
  console.log(out, 'ERRORS', errs);
  await b.close();
  process.exit(out.controlled && out.accueil_recharge && out.seance_pas_recharge && out.recharge_au_retour && !errs.length ? 0 : 1);
})();
