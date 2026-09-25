// Récup & mobilité + respiration + conseils de fin de séance
const { chromium, devices } = require('playwright');
(async()=>{
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
  const ctx = await b.newContext({...devices['iPhone 13']});
  await ctx.addInitScript(()=>{ try{ localStorage.setItem('cu.installVu','1'); }catch(e){} });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e=>errs.push('PAGEERR '+e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  const ev = s => p.evaluate(s => { const e = document.querySelector(s); if(e){ e.click(); return true; } return false; }, s);
  const shot = async n => p.screenshot({path:`qa/out/r_${n}.png`});
  await p.goto('http://localhost:8765/?a=demo&vitesse=30'); await p.waitForTimeout(1200);
  await shot('0home');
  await ev('#recupB'); await p.waitForTimeout(500); await shot('1recup');
  await ev('[data-g="kind"][data-v="mobilite"]'); await ev('[data-g="sport"][data-v="trail"]'); await ev('[data-g="minutes"][data-v="15"]'); await ev('[data-g="pain"][data-v="genoux"]');
  await p.waitForTimeout(300); await shot('2choix');
  await ev('#go'); await p.waitForTimeout(500); await shot('3preview');
  const list = await p.$$eval('.list li', ls => ls.map(l => l.textContent));
  console.log('routine mobilité trail 15 min (sans genoux) :', list);
  await ev('#reroll'); await p.waitForTimeout(300);
  console.log('autre proposition :', await p.$$eval('.list li', ls => ls.map(l => l.textContent)));
  await ev('#go'); await p.waitForTimeout(600);
  let g = 0;
  while(g++ < 200){
    const sc = await p.evaluate(()=>{ const S = __app._state(); return S ? S.screen : 'home'; });
    if(sc === 'done'){ await shot('4done'); break; }
    if(sc === 'blockintro') await ev('#go');
    else if(sc === 'prep') await ev('#main');
    else if(sc === 'live'){ await p.waitForTimeout(400); if(g < 6) await shot('5live'+g); await ev('#main'); }
    else if(sc === 'transition') await ev('#ready');
    await p.waitForTimeout(300);
  }
  await ev('#homeB'); await p.waitForTimeout(600);
  await ev('#recupB'); await p.waitForTimeout(300);
  await ev('[data-g="kind"][data-v="respiration"]'); await p.waitForTimeout(300); await shot('6breath');
  await ev('[data-b="soupir"]'); await p.waitForTimeout(300); await ev('[data-bm="2"]'); await p.waitForTimeout(300);
  await ev('#bgo'); await p.waitForTimeout(1500); await shot('7breathrun');
  await p.waitForTimeout(3500); await shot('8breathrun');
  await p.waitForTimeout(3000); await shot('9breathend');
  // conseils de fin de séance
  await p.goto('http://localhost:8765/?a=demo&vitesse=30'); await p.waitForTimeout(1000);
  await ev('.scard'); await p.waitForTimeout(300); await ev('#go'); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const S = __app._state(); S.t0 = Date.now() - 75*60000; __app._jump(S.steps.length); });
  await p.waitForTimeout(500);
  await ev('#srpe button[data-n="8"]'); await p.fill('#poids', '68'); await ev('[data-tm="dure"]'); await p.waitForTimeout(400);
  await p.evaluate(()=>document.querySelector('#reco').scrollIntoView()); await shot('10reco');
  console.log(await p.$eval('#recoOut', e => e.innerText));
  console.log('ERRORS', errs);
  await b.close();
})();
