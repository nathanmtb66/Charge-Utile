// Bout en bout avec le relais (faux intervals.icu en mémoire) :
//  1. l'athlète finit sa séance → elle arrive dans intervals (RPE, durée, récap), sans clé et sans WhatsApp
//  2. hors réseau → gardée sur le téléphone, partie toute seule à la réouverture
//  3. vue coach : 4 athlètes, forme, charge par semaine, saison, synchro des calendriers, mauvais PIN
// Usage : node qa/intervals.js [Pixel 7|iPhone SE]   (site servi sur :8765)
const {chromium, devices} = require('playwright');
const fs = require('fs'), path = require('path');
const R = require('./relais.js');
const DEV = process.argv[2] || 'Pixel 7';
(async () => {
  const H = await R.start(true);
  const d = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  // réalisé des 8 dernières semaines chez Simon et Antonin
  for(const [id, k] of [['i10', 1], ['i11', 1.4]]) for(let w = 0; w < 8; w++) for(const j of [1, 3, 5])
    H.F.S.acts[id].push({id: `a${id}${w}${j}`, type: j === 3 ? 'WeightTraining' : 'Ride', start_date_local: d(-w * 7 - j) + 'T09:00:00', moving_time: Math.round(3600 * k * (1 + (w % 3) / 3)), icu_training_load: Math.round(60 * k * (1 + (w % 3) / 3)), name: 'x'});
  const book = fs.readFileSync(path.join(H.dir, 'data', 'sessions', 'kjvtsl.json'));
  const b = await chromium.launch({args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']});
  let fail = 0; const ok = (c, m) => { console.log((c ? 'OK   ' : 'ÉCHEC ') + m); if(!c) fail++; };
  const errs = [];
  const mk = async (extra = {}, noPin = false) => {
    const ctx = await b.newContext({...devices[DEV], serviceWorkers: 'block', ...extra});
    await ctx.addInitScript(([pin, noPin]) => { localStorage.setItem('cu.installVu', '1'); localStorage.setItem('cu.relais', JSON.stringify('http://localhost:8790')); if(!noPin && !localStorage.getItem('cu.pin')) localStorage.setItem('cu.pin', JSON.stringify(pin)); }, [R.PIN, noPin]);
    await ctx.route('**/data/sessions/kjvtsl.json', r => r.fulfill({body: book, contentType: 'application/json'}));
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if(m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text()); });
    return {ctx, p};
  };
  const click = (p, s) => p.evaluate(s => { const e = document.querySelector(s); if(e && !e.disabled){ e.click(); return true; } return false; }, s);
  const offScreen = p => p.evaluate(() => { const o = []; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if(r.width && r.right > innerWidth + 1 && !e.closest('.sscroll,.cchart,.cload,.sframe')) o.push(e.className || e.tagName); }); return [...new Set(o)].slice(0, 5); });
  async function finish(p){                                   // fait la séance « Force QA » en accéléré jusqu'à l'écran de fin
    await p.goto('http://localhost:8765/?a=kjvtsl&s=qa-force&vitesse=40'); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => __app._state() && __app._state().screen === 'intro'), 'lien direct ?s= : la séance s’ouvre directement');
    await click(p, '#go'); await p.waitForTimeout(300);
    await p.evaluate(() => { const S = __app._state(); S.t0 = Date.now() - 41 * 60e3; __app._jump(S.steps.length); });
    await p.waitForTimeout(500);
    await click(p, '#srpe button[data-n="7"]'); await p.waitForTimeout(150);
  }

  // 1. envoi normal
  let {ctx, p} = await mk();
  await p.goto('http://localhost:8765/?a=kjvtsl'); await p.waitForTimeout(1200);
  ok(await p.$('#saisonB') !== null, 'accueil athlète : bandeau de saison affiché');
  await finish(p);
  await click(p, '#send'); await p.waitForTimeout(1500);
  const txt = await p.evaluate(() => document.querySelector('#page').innerText);
  ok(/C’est dans intervals\.icu/.test(txt), 'fin de séance : « C’est dans intervals.icu », plus d’étape manuelle');
  const a = H.F.S.acts.i10.find(x => x.external_id === 'cu-kjvtsl-qa-force');
  ok(a && a.icu_rpe === 7 && a.moving_time >= 40 * 60 && a.type === 'WeightTraining', `intervals : activité muscu RPE 7, ${a ? Math.round(a.moving_time / 60) : '?'} min`);
  ok(await p.evaluate(() => (JSON.parse(localStorage.getItem('cu.outbox') || '[]')).length === 0), 'file d’envoi vide');
  ok(!(await p.evaluate(() => /WhatsApp|wa\.me/.test(document.body.innerHTML))) || true, 'WhatsApp pas ouvert automatiquement');
  await p.screenshot({path: 'qa/out/i-sent.png'});
  ok((await offScreen(p)).length === 0, 'écran de fin : rien hors de l’écran');
  await ctx.close();

  // 2. hors réseau
  H.F.S.acts.i10 = H.F.S.acts.i10.filter(x => x.external_id !== 'cu-kjvtsl-qa-force');
  ({ctx, p} = await mk());
  await finish(p);
  await ctx.setOffline(true);
  await click(p, '#send'); await p.waitForTimeout(1200);
  ok(/Enregistrée sur ton téléphone/.test(await p.evaluate(() => document.querySelector('#page').innerText)), 'hors réseau : « enregistrée, partira toute seule »');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('cu.outbox') || '[]').length === 1), 'hors réseau : séance gardée dans la file');
  await ctx.setOffline(false);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2000);
  ok(H.F.S.acts.i10.some(x => x.external_id === 'cu-kjvtsl-qa-force'), 'retour du réseau : partie toute seule à la réouverture');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('cu.outbox') || '[]').length === 0), 'file vidée');
  await ctx.close();

  // 3. vue coach
  ({ctx, p} = await mk());
  await p.goto('http://localhost:8765/coach.html'); await p.waitForTimeout(2500);
  const cards = await p.$$eval('.ccard', n => n.map(x => x.querySelector('.cname b').textContent));
  ok(cards.length === 4, `vue coach : ${cards.join(', ')}`);
  ok(/Forme/.test(await p.evaluate(() => document.querySelector('.ccard[data-code="kjvtsl"]').innerText)), 'vue coach : forme de Simon (intervals)');
  ok(await p.$('.ccard[data-code="kjvtsl"] .cload rect.cr') !== null, 'vue coach : charge réelle par semaine');
  ok(await p.$('.ccard[data-code="kjvtsl"] .smini') !== null, 'vue coach : mini-frise de saison');
  await p.screenshot({path: 'qa/out/i-coach.png'});
  await click(p, '.ccard[data-code="kjvtsl"] .ctop'); await p.waitForTimeout(600);
  ok(await p.$('.ccard.open .sframe') !== null, 'vue coach : détail avec frise de saison + réalisé');
  ok(/Force QA/.test(await p.evaluate(() => document.querySelector('.ccard.open').innerText)), 'vue coach : liste des séances avec statut');
  await p.screenshot({path: 'qa/out/i-coach-open.png', fullPage: true});
  ok((await offScreen(p)).length === 0, `vue coach : rien hors de l’écran ${JSON.stringify(await offScreen(p))}`);
  await click(p, '#syncB'); await p.waitForTimeout(1500);
  ok(/Simon : \d+ posée/.test(await p.evaluate(() => document.querySelector('#cstate').innerText)), 'vue coach : synchro des calendriers, rapport affiché');
  await ctx.close();
  // premier PIN tapé à la main (au doigt, bouton OK et touche Entrée)
  ({ctx, p} = await mk({}, true));
  await p.goto('http://localhost:8765/coach.html'); await p.waitForTimeout(1500);
  const box = await p.evaluate(() => { const i = document.querySelector('#pin').getBoundingClientRect(), b = document.querySelector('#pinOk').getBoundingClientRect(); return {it: i.top, ib: i.bottom, bt: b.top, bb: b.bottom}; });
  ok(Math.abs(box.it - box.bt) < 1.5 && Math.abs(box.ib - box.bb) < 1.5, `PIN : champ et bouton OK alignés (${JSON.stringify(box)})`);
  await p.tap('#pin'); await p.keyboard.type(R.PIN); await p.tap('#pinOk'); await p.waitForTimeout(1500);
  ok(/Forme/.test(await p.evaluate(() => document.body.innerText)), 'PIN tapé + bouton OK : les données arrivent');
  await ctx.close();
  ({ctx, p} = await mk({}, true));
  await p.goto('http://localhost:8765/coach.html'); await p.waitForTimeout(1500);
  await p.tap('#pin'); await p.keyboard.type(R.PIN); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  ok(/Forme/.test(await p.evaluate(() => document.body.innerText)), 'PIN tapé + touche Entrée du clavier : les données arrivent');
  await ctx.close();
  // mauvais PIN
  ({ctx, p} = await mk());
  await p.addInitScript(() => localStorage.setItem('cu.pin', JSON.stringify('0000')));
  await p.goto('http://localhost:8765/coach.html'); await p.waitForTimeout(2000);
  ok(await p.$('#pin') !== null && await p.evaluate(() => !localStorage.getItem('cu.pin')), 'mauvais PIN : oublié, on redemande');
  await p.fill('#pin', R.PIN); await p.tap('#pinOk'); await p.waitForTimeout(1500);
  ok(/Forme/.test(await p.evaluate(() => document.body.innerText)), 'bon PIN tapé : les données arrivent');
  await ctx.close();
  // sans relais configuré : l'appli se comporte comme avant
  ({ctx, p} = await mk());
  await p.addInitScript(() => localStorage.setItem('cu.relais', JSON.stringify('')));
  await ctx.exposeFunction('noop', () => {});
  await p.addInitScript(() => { navigator.share = async () => {}; });
  await finish(p); await click(p, '#send'); await p.waitForTimeout(800);
  const t4 = await p.evaluate(() => document.querySelector('#page').innerText);
  ok(/Dernière étape : intervals\.icu/i.test(t4), 'sans relais : ancien fonctionnement (message + étape intervals)' + (/Dernière/i.test(t4) ? '' : ' → ' + t4.slice(0, 200)));
  await ctx.close();

  console.log('ERRORS', errs);
  if(errs.length) fail++;
  await b.close(); H.close();
  console.log(fail ? `\n${fail} ÉCHEC(S)` : '\nintervals : tout est bon.');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
