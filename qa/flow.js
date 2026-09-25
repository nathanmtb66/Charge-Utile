// Parcours complet d'une séance (accéléré x40) : chaque écran, douleur, remplacement, vidéo, fin et message.
const { chromium, devices } = require('playwright');
const SID = process.argv[2] || 0, KNEE = process.argv[3] || 'ok';
(async()=>{
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
  const ctx = await b.newContext({...devices['Pixel 7'], permissions:['camera']});
  await ctx.addInitScript(()=>{ try{ localStorage.setItem('cu.installVu','1'); }catch(e){} });   // l'écran d'installation ne s'affiche qu'une fois
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e=>errs.push('PAGEERR '+e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  ctx.on('page', pg => pg.close().catch(()=>{}));
  await p.goto('http://localhost:8765/?a=demo&vitesse=40'); await p.waitForTimeout(1200);
  const cards = await p.$$('.scard'); await cards[+SID].click(); await p.waitForTimeout(500);

  const shots = {}; let n = 0, guard = 0, rpeI = 0, swapped = false, pained = false, filmed = false;
  const click = async sel => p.evaluate(s=>{ const e = document.querySelector(s); if(e && !e.disabled){ e.click(); return true; } return false; }, sel);
  const off = new Set();
  const snap = async tag => { if(shots[tag]) return; shots[tag] = 1; await p.screenshot({path:`qa/out/f${String(n++).padStart(2,'0')}-${tag}.png`});
    (await p.evaluate(()=>{ const vh = innerHeight, vw = innerWidth, o = []; document.querySelectorAll('#bar button, #bar a').forEach(e=>{ const r = e.getBoundingClientRect(); if(r.width && (r.bottom > vh+1 || r.right > vw+1 || r.left < -1)) o.push((e.id||e.className)+'@'+Math.round(r.bottom)+'/'+vh); }); return o; })).forEach(x => off.add(tag+':'+x)); };
  await click('#go'); await p.waitForTimeout(400);
  while(guard++ < 900){
    const st = await p.evaluate(()=>{ const S = __app._state(); return {screen: S ? S.screen : 'home', i: S && S.i, n: S && S.steps.length, sheet: !document.querySelector('#sheet').hidden && document.querySelector('#sheet').classList.contains('show'), title: document.querySelector('#title').textContent}; });
    if(st.sheet){ if(await click('#okS')) continue; await p.keyboard.press('Escape'); await p.waitForTimeout(300); continue; }
    if(st.screen === 'sent'){ await p.waitForTimeout(500); await snap('sent'); break; }
    if(st.screen === 'blockintro'){ await snap('block'); await click('#go'); }
    else if(st.screen === 'prep'){
      await snap('prep');
      if(!swapped && await p.$('#swapB') && st.title.startsWith('Squat')){ swapped = true; await click('#swapB'); await p.waitForTimeout(500); await snap('swap'); await click('.opt'); await p.waitForTimeout(500); continue; }
      if(!pained && st.title.startsWith('Box')){ pained = true; await click('#painB'); await p.waitForTimeout(500);
        await p.click('#zones button:nth-child(1)'); await p.click('#lvl button:nth-child(4)'); await p.click('#types button:nth-child(2)'); await p.click('#how button:nth-child(1)'); await p.waitForTimeout(300);
        await p.fill('#comment','ça tire sous la rotule'); await snap('pain'); await click('#a1'); await p.waitForTimeout(500); continue; }
      if(await p.$('#nofilm') && !filmed){ filmed = true; await click('#main'); await p.waitForTimeout(1500); await snap('filmsetup'); await click('#rec'); await p.waitForTimeout(600); await snap('filmrec'); await p.waitForTimeout(1200); await click('#main'); await p.waitForTimeout(1500); continue; }
      await click('#main');
    }
    else if(st.screen === 'live'){
      const timed = await p.evaluate(()=>document.querySelector('#hud').classList.contains('timed'));
      await p.waitForTimeout(timed ? 300 : 700); await snap(timed ? 'timed' : 'live');
      if(!timed) await click('#main');
    }
    else if(st.screen === 'transition'){ await snap('transition'); await click('#ready'); }
    else if(st.screen === 'rest'){
      await snap('rest');
      const clicked = await p.evaluate(k=>{ const o = document.querySelectorAll('#rpeCard .rpe5 button'); if(!o.length) return false; o[k % o.length].click(); return true; }, rpeI);
      if(clicked){ rpeI++; await p.waitForTimeout(250); await snap('restfb'); }
      if(await p.$('#sendVid')){ await snap('sendvid'); await click('#sendVid'); await p.waitForTimeout(300); }
      await click('#ready');
    }
    else if(st.screen === 'free'){ await click('#main'); }
    else if(st.screen === 'done'){ await snap('done'); await click('#srpe button[data-n="8"]'); await click('#send'); await p.waitForTimeout(800); }
    await p.waitForTimeout(150);
  }
  const res = await p.evaluate(()=>{ const S = __app._state(); return {i:S.i, steps:S.steps.length, log:S.log.length, adj:S.adj, pain:S.pain.length, recap: __app._recap()}; });
  console.log('iterations', guard, JSON.stringify({i:res.i, steps:res.steps, log:res.log, pain:res.pain}));
  console.log(res.recap);
  console.log('HORS-ECRAN', [...off]);
  console.log('ERRORS', errs);
  await b.close();
})();
