// Vérification rapide : accueil, séance, écrans principaux, erreurs console.
const { chromium, devices } = require('playwright');
(async()=>{
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const ctx = await b.newContext({...devices['iPhone 13'], hasTouch:true});
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e=>errs.push('PAGEERR '+e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('http://localhost:8765/?a=demo&vitesse=1'); await p.waitForTimeout(1500);
  await p.screenshot({path:'qa/out/s01-home.png'});
  await p.click('.scard'); await p.waitForTimeout(700);
  await p.screenshot({path:'qa/out/s02-intro.png'});
  await p.click('.kbtn button[data-k="mal"]'); await p.waitForTimeout(400);
  await p.screenshot({path:'qa/out/s03-knee.png'});
  await p.click('.kbtn button[data-k="ok"]'); await p.waitForTimeout(300);
  await p.click('#go'); await p.waitForTimeout(900);
  await p.screenshot({path:'qa/out/s04-block.png'});
  // saute au squat (corps de séance)
  const idx = await p.evaluate(()=>__app._state().steps.findIndex(s=>s.t==='reps' && s.bi===2));
  await p.evaluate(i=>__app._jump(i), idx); await p.waitForTimeout(900);
  await p.screenshot({path:'qa/out/s05-prep.png'});
  await p.evaluate(()=>{ document.querySelector('#nofilm') ? document.querySelector('#nofilm').click() : document.querySelector('#main').click(); }); await p.waitForTimeout(1200);
  await p.screenshot({path:'qa/out/s06-lead.png'});
  await p.waitForTimeout(3200);
  await p.screenshot({path:'qa/out/s07-descends.png'});
  await p.waitForTimeout(3200);
  await p.screenshot({path:'qa/out/s08-tiens.png'});
  await p.waitForTimeout(2600);
  await p.screenshot({path:'qa/out/s09-monte.png'});
  await p.click('#main'); await p.waitForTimeout(800);
  await p.screenshot({path:'qa/out/s10-rest.png'});
  await p.click('#rpeCard .rpe5 button[data-n="6"]'); await p.waitForTimeout(700);
  await p.screenshot({path:'qa/out/s11-fb.png'});
  console.log('ERRORS', errs);
  await b.close();
})();
