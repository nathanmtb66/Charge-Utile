// Chevauchements : sur chaque écran, deux textes qui se recouvrent (ou un texte qui dépasse de son bouton / de l'écran) = défaut.
// Usage : node qa/overlap.js [appareil]      (site sur :8765 ; lance aussi le relais de test pour la vue coach)
const {chromium, devices} = require('playwright');
const R = require('./relais.js');
const DEV = process.argv[2] || 'iPhone SE';
const DIR = 'qa/out/ov-' + DEV.replace(/\s/g, '');
require('fs').mkdirSync(DIR, {recursive: true});

// dans la page : liste des défauts visibles
function scan(){
  const vis = e => { const s = getComputedStyle(e); if(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false;
    for(let p = e; p; p = p.parentElement){ if(p.hidden) return false; const ps = getComputedStyle(p); if(ps.display === 'none' || +ps.opacity === 0) return false; } return true; };
  const clipBox = e => { let r = e.getBoundingClientRect(); for(let p = e; p; p = p.parentElement){ const s = getComputedStyle(p);
      if(/(auto|scroll|hidden|clip)/.test(s.overflowX + s.overflowY)){ const q = p.getBoundingClientRect(); r = {left: Math.max(r.left, q.left), right: Math.min(r.right, q.right), top: Math.max(r.top, q.top), bottom: Math.min(r.bottom, q.bottom)}; } }
    return r.right - r.left > 1 && r.bottom - r.top > 1 ? r : null; };
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const n = walker.currentNode, t = n.textContent.trim(); if(!t) continue;
    const el = n.parentElement; if(!el || !vis(el) || el.closest('canvas,script,style,#hud,.toast,.hint,.sheet[hidden]')) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    for(const r of rg.getClientRects()){ if(r.width < 2 || r.height < 2) continue; const c = clipBox(el); if(!c) continue;
      const b = {left: Math.max(r.left, c.left), right: Math.min(r.right, c.right), top: Math.max(r.top, c.top), bottom: Math.min(r.bottom, c.bottom)};
      if(b.right - b.left < 2 || b.bottom - b.top < 2) continue;
      texts.push({el, t: t.slice(0, 28), r: b, full: r}); }
  }
  const out = [];
  for(let i = 0; i < texts.length; i++) for(let j = i + 1; j < texts.length; j++){
    const a = texts[i], b = texts[j]; if(a.el === b.el) continue;
    const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if(w > 2 && h > 3) out.push(`chevauchement « ${a.t} » / « ${b.t} »`);
  }
  for(const a of texts){ const ov = getComputedStyle(a.el); if(ov.textOverflow === 'ellipsis') continue; if(a.full.right > innerWidth + 1 && !a.el.closest('.sscroll,.cchart,.tabs')) out.push(`hors écran « ${a.t} »`);
    const btn = a.el.closest('button'); if(btn){ const q = btn.getBoundingClientRect(); if(a.full.right > q.right + 1 || a.full.left < q.left - 1 || a.full.bottom > q.bottom + 1) out.push(`dépasse de son bouton « ${a.t} »`); } }
  // textes SVG entre eux
  const st = [...document.querySelectorAll('svg text')].filter(vis).map(e => ({t: e.textContent, r: e.getBoundingClientRect()}));
  for(let i = 0; i < st.length; i++) for(let j = i + 1; j < st.length; j++){ const a = st[i].r, b = st[j].r;
    if(Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) out.push(`SVG « ${st[i].t} » / « ${st[j].t} »`); }
  return [...new Set(out)];
}

(async () => {
  const H = await R.start(true);
  const d = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  for(const [id, k] of [['i10', 1], ['i11', 1.4]]) for(let w = 0; w < 8; w++) for(const j of [1, 3, 5])
    H.F.S.acts[id].push({id: `a${id}${w}${j}`, type: j === 3 ? 'WeightTraining' : 'Ride', start_date_local: d(-w * 7 - j) + 'T09:00:00', moving_time: 3600 * k, icu_training_load: 60 * k, name: 'x'});
  const book = require('fs').readFileSync(require('path').join(H.dir, 'data', 'sessions', 'kjvtsl.json'));
  const b = await chromium.launch({args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream']});
  const ctx = await b.newContext({...devices[DEV], serviceWorkers: 'block', permissions: ['camera']});
  await ctx.addInitScript(([pin]) => { localStorage.setItem('cu.installVu', '1'); localStorage.setItem('cu.relais', JSON.stringify('http://localhost:8790')); localStorage.setItem('cu.pin', JSON.stringify(pin)); }, [R.PIN]);
  await ctx.route('**/data/sessions/kjvtsl.json', r => r.fulfill({body: book, contentType: 'application/json'}));
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const click = s => p.evaluate(s => { const e = document.querySelector(s); if(e && !e.disabled){ e.click(); return true; } return false; }, s);
  const report = {}; let n = 0;
  const check = async (tag, full) => { await p.waitForTimeout(700); const r = await p.evaluate(scan); report[tag] = r;
    await p.screenshot({path: `${DIR}/${String(n++).padStart(2, '0')}-${tag}.png`, fullPage: !!full}); };
  const scrollAll = async tag => { const h = await p.evaluate(() => { const pg = document.querySelector('#page'); return pg ? pg.scrollHeight - pg.clientHeight : 0; });
    for(let y = 0, k = 0; y <= h + 1 && k < 6; y += 450, k++){ await p.evaluate(y => { const pg = document.querySelector('#page'); if(pg) pg.scrollTop = y; }, y); await check(`${tag}${k ? '-' + k : ''}`); } };

  await p.goto('http://localhost:8765/?a=demo&vitesse=40'); await p.waitForTimeout(1500);
  await scrollAll('accueil');
  await click('[data-tab="tests"]'); await scrollAll('tests');
  await click('[data-tab="recup"]'); await scrollAll('recup');
  await click('[data-tab="seances"]'); await p.waitForTimeout(500);
  await click('#saisonB'); await scrollAll('saison');
  await click('#back'); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelectorAll('.scard')[1].click()); await check('intro');
  await click('#detail'); await scrollAll('detail'); await click('#back');
  await p.waitForTimeout(400); await click('#go'); await check('bloc');
  await click('#go'); await check('prep');
  await click('#main'); await p.waitForTimeout(900); await check('live');
  for(let k = 0; k < 40; k++){ const s = await p.evaluate(() => __app._state().screen); if(s === 'rest'){ await check('recup-serie'); break; }
    if(s === 'transition') await click('#ready'); else if(s === 'live') await click('#main'); else if(s === 'prep') await click('#main'); else if(s === 'blockintro') await click('#go'); await p.waitForTimeout(250); }
  await p.evaluate(() => { const S = __app._state(); S.t0 = Date.now() - 40 * 60e3; __app._jump(S.steps.length); }); await p.waitForTimeout(500);
  await click('#srpe button[data-n="7"]'); await scrollAll('fin');
  // athlète réel relié au relais : fin de séance envoyée
  await p.goto('http://localhost:8765/?a=kjvtsl&s=qa-force&vitesse=40'); await p.waitForTimeout(1500);
  await click('#go'); await p.waitForTimeout(300);
  await p.evaluate(() => { const S = __app._state(); S.t0 = Date.now() - 40 * 60e3; __app._jump(S.steps.length); }); await p.waitForTimeout(500);
  await click('#srpe button[data-n="7"]'); await click('#send'); await p.waitForTimeout(2500); await check('envoyee');
  // vue coach
  await p.goto('http://localhost:8765/coach.html'); await p.waitForTimeout(2500); await check('coach', true);
  await click('.ccard[data-code="kjvtsl"] .ctop'); await p.waitForTimeout(800); await check('coach-ouvert', true);

  let bad = 0;
  for(const [k, v] of Object.entries(report)) if(v.length){ bad += v.length; console.log(`${k} :\n  ` + v.join('\n  ')); }
  console.log(bad ? `\n${bad} défaut(s) — captures dans ${DIR}` : `\nAucun chevauchement (${Object.keys(report).length} écrans, ${DEV})`);
  console.log('ERRORS', errs);
  await b.close(); H.close(); process.exit(bad || errs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
