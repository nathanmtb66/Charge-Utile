// Séances de tests (batterie) de bout en bout, accéléré : saisie, force, angles au capteur simulé, chrono, métronome, fiche, message.
// Usage : node qa/tests.js [A|B|AB] [appareil]   (serveur sur http://localhost:8765 depuis docs/)
const { chromium, devices } = require('playwright');
const WHICH = (process.argv[2] || 'AB').toUpperCase(), DEV = process.argv[3] || 'Pixel 7';
(async()=>{
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
  const ctx = await b.newContext({...devices[DEV], permissions:['camera']});
  await ctx.addInitScript(()=>{ try{ localStorage.setItem('cu.installVu','1'); }catch(e){} });
  const p = await ctx.newPage();
  const errs = [], off = new Set(); p.on('pageerror', e=>errs.push('PAGEERR '+e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  ctx.on('page', pg => { if(pg !== p) pg.close().catch(()=>{}); });
  p.on('crash', ()=>console.log('PAGE CRASH')); p.on('close', ()=>console.log('PAGE CLOSE', new Date().toISOString()));
  const shots = {}; let n = 0;
  const snap = async tag => { if(shots[tag]) return; shots[tag] = 1; await p.screenshot({path:`qa/out/t${String(n++).padStart(2,'0')}-${tag}.png`}); };
  const click = sel => p.evaluate(s=>{ const e = document.querySelector(s); if(e && !e.disabled){ e.click(); return true; } return false; }, sel);
  const has = sel => p.evaluate(s=>!!document.querySelector(s), sel);
  const txt = sel => p.evaluate(s=>{ const e = document.querySelector(s); return e ? e.textContent : ''; }, sel);
  // rien d'utile hors de l'écran : boutons de la barre et zone « touche l'écran »
  const checkOff = async tag => { const o = await p.evaluate(()=>{ const vw = innerWidth, vh = innerHeight, out = [];
      document.querySelectorAll('#bar button, #bar a, #tapzone').forEach(e=>{ const r = e.getBoundingClientRect(); if(r.width && (r.bottom > vh+1 || r.top < -1 || r.right > vw+1 || r.left < -1)) out.push((e.id||e.className)+'@'+Math.round(r.bottom)+'/'+vh); });
      return out; }); o.forEach(x => off.add(tag+':'+x)); };
  // capteur : on envoie l'orientation d'un téléphone (beta, gamma) toutes les 30 ms
  let tilt = {beta:0, gamma:0};
  await p.addInitScript(()=>{ window.__T = {beta:0, gamma:0}; setInterval(()=>{ const t = window.__T; window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {alpha:0, beta:t.beta, gamma:t.gamma})); }, 40); });
  const setTilt = async v => { tilt = v; await p.evaluate(v => { window.__T = v; }, v); };
  await p.goto('http://localhost:8765/?a=demo&vitesse=25'); await p.waitForTimeout(1500);
  const TARGET = {'thomas':[ -8, 12 ], 'rotation-interne-hanche':[38, 31], 'jambe-tendue':[82, 76], 'flexion-epaule':[168, 171], 'rotation-externe-epaule':[82, 64]};
  const results = {};
  for(const title of (WHICH.includes('A') ? ['Tests force'] : []).concat(WHICH.includes('B') ? ['Tests mobilité'] : [])){
    await p.goto('http://localhost:8765/?vitesse=25'); await p.waitForTimeout(1200);
    await p.evaluate(t=>{ const c = [...document.querySelectorAll('.scard')].find(x=>x.textContent.includes(t)); c.click(); }, title); await p.waitForTimeout(500);
    await snap('intro-'+title.split(' ')[1]); await checkOff('intro');
    await click('#detail'); await p.waitForTimeout(400); await snap('detail-'+title.split(' ')[1]); await click('#backD'); await p.waitForTimeout(300);
    await click('#go'); await p.waitForTimeout(400);
    let guard = 0, angleTrial = {}, lastSig = '', same = 0;
    while(guard++ < 1500){
      const st = await p.evaluate(()=>{ const S = __app._state(); const it = S && S.steps[S.i] && S.blocks[S.steps[S.i].bi].items ? S.blocks[S.steps[S.i].bi].items[S.steps[S.i].ii] : null;
        return {screen: S ? S.screen : 'home', i: S && S.i, test: it && it.kind === 'test' ? it.test.id : null, mode: it && it.test ? it.test.mode : null,
          sheet: !document.querySelector('#sheet').hidden && document.querySelector('#sheet').classList.contains('show'), zone: !!document.querySelector('#tapzone'), astat: (document.querySelector('#astat')||{}).textContent || ''}; });
      const sig = JSON.stringify(st); if(sig === lastSig){ same++; } else { same = 0; lastSig = sig; if(process.env.DBG) console.log(sig); }
      if(same > 400){ console.log('BLOQUÉ', sig); await snap('bloque'); break; }
      if(st.sheet){ await snap('sheet'); if(await click('#okS')) { await p.waitForTimeout(300); continue; } await click('#keepF'); await p.waitForTimeout(300); continue; }
      if(st.screen === 'sent'){ await snap('sent-'+title.split(' ')[1]); break; }
      if(st.screen === 'done'){ await snap('done-'+title.split(' ')[1]); await checkOff('done'); await click('#srpe button[data-n="6"]'); await click('#send'); await p.waitForTimeout(800); continue; }
      if(st.screen === 'blockintro'){ await snap('block'); await click('#go'); await p.waitForTimeout(250); continue; }
      if(st.screen === 'prep'){ await click('#main'); await p.waitForTimeout(250); continue; }
      if(st.screen === 'live'){ await p.waitForTimeout(300); continue; }
      if(st.screen === 'rest'){ await click('#ready'); await p.waitForTimeout(250); continue; }
      if(st.screen !== 'test'){ await p.waitForTimeout(150); continue; }
      const T = st.test, tag = T;
      // présentation
      if(await has('#skipT')){ await snap('p-'+tag); await checkOff('p-'+tag);
        if(T === 'rotation-externe-epaule' && !results.skipDone){ results.skipDone = 1; await click('#skipT'); await p.waitForTimeout(500); await p.evaluate(()=>document.querySelector('#why button').click()); await snap('skip'); await click('#okS'); await p.waitForTimeout(500); continue; }
        await click('#main'); await p.waitForTimeout(300); continue; }
      // résultat
      if(await has('#redoT')){ await snap('r-'+tag); await checkOff('r-'+tag); results[T] = await txt('#panel'); await click('#main'); await p.waitForTimeout(300); continue; }
      if(st.mode === 'saisie'){
        if(await has('#in_g')){ const v = T === 'genou-mur' ? ['11.5','8'] : ['142','121'];
          await p.fill('#in_g', v[0]); await p.fill('#in_d', v[1]); await p.click('.tpm[data-s="g"][data-k="1"]'); await snap('s-'+tag); await checkOff('s-'+tag); await click('#main'); await p.waitForTimeout(300); }
        continue;
      }
      if(st.mode === 'force'){
        if(await has('#in_kg')){ await p.fill('#in_kg', T === 'squat-e1rm' ? '60' : '80'); if(await has('#in_box')) await p.fill('#in_box', '46');
          await p.dispatchEvent('#in_kg', 'input'); await click('#safe'); await snap('f-'+tag); await checkOff('f-'+tag); await click('#main'); await p.waitForTimeout(300); continue; }
        if(await has('.tramp')){ await snap('ramp-'+tag); await checkOff('ramp'); await click('#main'); await p.waitForTimeout(300); continue; }
        if(await has('#tv') && await has('#ready')){ await snap('trest'); await click('#ready'); await p.waitForTimeout(300); continue; }
        if(await has('#rir')){ // squat : 10 reps possibles → trop léger → on refait à +10 % ; soulevé : 5 reps RIR 1
          const first = !results['_f'+T]; results['_f'+T] = 1;
          const reps = T === 'squat-e1rm' && first ? 9 : 5;
          for(let k = 5; k < reps; k++) await click('#p');
          await p.evaluate(r=>document.querySelector(`#rir button[data-r="${r}"]`).click(), T === 'squat-e1rm' && first ? 1 : 1);
          await snap('fres-'+tag+(first?'':'2')); await checkOff('fres'); await click('#main'); await p.waitForTimeout(400); continue; }
        await p.waitForTimeout(150); continue;
      }
      if(st.mode === 'angle'){
        if(await has('#manual') && (await txt('#main')).includes('Démarrer')){ await setTilt({beta:0, gamma:0}); await snap('a-'+tag); await checkOff('a-'+tag); await click('#main'); await p.waitForTimeout(200); continue; }
        if(await has('#go2')){ await snap('a-ok'); await setTilt({beta:0, gamma:0}); await click('#go2'); await p.waitForTimeout(200); continue; }
        if(await has('#stopA')){ // vérification du capteur, puis mesure : on joue le mouvement
          const side = (await txt('#kicker')).includes('droite') ? 1 : 0, tgt = TARGET[T][side];
          const s = st.astat;
          if(s.includes('Vérification')){ await setTilt({beta:90, gamma:2}); await snap('a-check'); }
          else if(T === 'thomas'){ await setTilt(s.includes('Zéro pris') || s.includes('Relâche') ? {beta: -tgt, gamma: 0} : {beta:0, gamma:0}); }
          else if(s.includes('Zéro pris') || s.startsWith('Mesuré')){ if(s.startsWith('Mesuré')){ await snap('am-'+tag); await setTilt({beta:0, gamma:0}); } else await setTilt({beta: tgt, gamma: 0}); }
          else await setTilt({beta:0, gamma:0});
          await p.waitForTimeout(40); continue; }
        if(await has('#redo')){ await snap('ab-'+tag); await checkOff('ab-'+tag); await setTilt({beta:0, gamma:0}); await click('#main'); await p.waitForTimeout(250); continue; }
        await p.waitForTimeout(80); continue;
      }
      if(st.mode === 'video'){
        if(await has('.tcr')){ await p.evaluate(()=>{ document.querySelectorAll('.tcr').forEach((r, i) => r.querySelector(i === 1 ? '[data-v="0"]' : '[data-v="1"]').click()); });
          await p.waitForTimeout(300); await snap('v-review'); await checkOff('v-review'); await click('#main'); await p.waitForTimeout(300); continue; }
        if(await has('#stopV')){ await snap('v-rec'); if(await click('#stopV')) await p.waitForTimeout(1200); else await p.waitForTimeout(200); continue; }
        await snap('v-'+tag); await checkOff('v-'+tag); await click('#main'); await p.waitForTimeout(1500); continue;
      }
      if(st.mode === 'chrono'){
        if(st.zone){ const t = await txt('#zs'); if(t.includes('Yeux')){ await p.waitForTimeout(300); await snap('zone-chrono'); await checkOff('zone'); await p.mouse.click(200, 400); await p.waitForTimeout(200); } else await p.waitForTimeout(100); continue; }
        await snap('c-'+tag); await checkOff('c-'+tag); await click('#main'); await p.waitForTimeout(250); continue;
      }
      if(st.mode === 'metronome'){
        if(st.zone){ const t = await txt('#zs'); if(t === 'reps'){ const r = +(await txt('#zv')); if(r >= (T === 'mollet-unipodal' ? 12 : 9)){ await snap('zone-metro'); await p.mouse.click(200, 400); await p.waitForTimeout(250); } else await p.waitForTimeout(60); } else await p.waitForTimeout(80); continue; }
        if(await has('.stepper')){ await snap('m-'+tag); await checkOff('m-'+tag); await click('#main'); await p.waitForTimeout(300); continue; }
        await click('#main'); await p.waitForTimeout(250); continue;
      }
      await p.waitForTimeout(100);
    }
    const res = await p.evaluate(()=>({tests: __app._state() ? __app._state().tests : null, recap: document.querySelector('.recap') ? document.querySelector('.recap').textContent : ''}));
    console.log('\n=== ' + title + ' (' + guard + ' itérations)'); console.log(res.recap);
  }
  // fiche sur l'accueil
  await p.goto('http://localhost:8765/?vitesse=25'); await p.waitForTimeout(1200);
  await snap('home'); await click('#ficheB'); await p.waitForTimeout(600); await snap('fiche'); await checkOff('fiche');
  console.log('\n=== Ma fiche'); console.log(await txt('#page'));
  // prescription en % : séance avec pct + base, le téléphone recalcule depuis son test plus récent
  const pct = await p.evaluate(()=>{ const f = JSON.parse(localStorage.getItem('cu.fiche.demo') || '[]'); return f.filter(e=>e.test.endsWith('e1rm')).map(e=>e.test+' '+e.v.e1rm); });
  console.log('\nFiche e1RM', pct);
  // la séance « Force en % » : Nathan a écrit 80 % de 75 kg (60 kg) ; le téléphone a un test plus récent → il recalcule
  await p.goto('http://localhost:8765/?vitesse=25'); await p.waitForTimeout(1200);
  const hasPct = await p.evaluate(()=>{ const c = [...document.querySelectorAll('.scard')].find(x=>x.textContent.includes('Force en %')); if(c){ c.click(); return true; } return false; });
  if(hasPct){ await p.waitForTimeout(400); await click('#go'); await p.waitForTimeout(400);
    const i = await p.evaluate(()=>__app._state().steps.findIndex(s=>s.t==='reps')); await p.evaluate(i=>__app._jump(i), i); await p.waitForTimeout(900);
    await snap('pct'); console.log('Charge en % :', await txt('#loadN'), 'kg ·', await p.evaluate(()=>[...document.querySelectorAll('#panel .last')].map(e=>e.textContent).join(' | '))); }
  console.log('\nHORS-ECRAN', [...off]);
  console.log('ERRORS', errs);
  await b.close();
})();
