// Relais intervals.icu : on fait tourner le VRAI relais/worker.js contre un faux intervals.icu (même API, en mémoire).
//   node qa/relais.js          → tous les tests (code 1 en cas d'échec)
//   node qa/relais.js serve    → laisse tourner faux intervals (8799) + relais (8790) pour les tests de l'appli
// Le site doit être servi sur http://localhost:8765 (python3 -m http.server 8765 depuis docs/).
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const KEY = 'cle-de-test', PIN = '4812';
let SITE = 'http://localhost:8765/';
/* site de test : copie des vraies données, + une séance future et une saison chez Simon (pour tester la synchro sans toucher au dépôt) */
function testSite(){
  const src = path.join(__dirname, '..', 'docs', 'data'), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cu-site-'));
  fs.mkdirSync(path.join(dir, 'data', 'sessions'), {recursive: true});
  fs.copyFileSync(path.join(src, 'equipe.json'), path.join(dir, 'data', 'equipe.json'));
  for(const f of fs.readdirSync(path.join(src, 'sessions'))) fs.copyFileSync(path.join(src, 'sessions', f), path.join(dir, 'data', 'sessions', f));
  const d = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  const k = path.join(dir, 'data', 'sessions', 'kjvtsl.json'), b = JSON.parse(fs.readFileSync(k));
  b.seances.push({id: d(3) + '-test', date: d(3), titre: 'Force future', rpe: '7', dureeMin: 50, blocs: [{nom: 'x', type: 'series', items: [{ex: 'squat-barre', series: 3, reps: 5}]}]});
  b.seances.unshift({id: '2026-09-28-passe', date: '2026-09-28', titre: 'Passée', blocs: []}, {id: '2026-09-30-passe', date: '2026-09-30', titre: 'Passée 2', blocs: []});
  const demo = JSON.parse(fs.readFileSync(path.join(src, 'sessions', 'demo.json')));
  const force = JSON.parse(JSON.stringify(demo.seances.find(x => x.titre === 'Force en %') || demo.seances[demo.seances.length - 1]));
  b.seances.push(Object.assign(force, {id: 'qa-force', date: d(0), titre: 'Force QA'}));
  b.saison = {nom: 'Test', blocs: [{type: 'PPG', debut: d(-10), fin: d(20)}, {type: 'PPO', debut: d(21), fin: d(50)}], courses: [{date: d(60), nom: 'Course A', prio: 'A'}]};
  fs.writeFileSync(k, JSON.stringify(b));
  const a = path.join(dir, 'data', 'sessions', '2qzstf.json'), b2 = JSON.parse(fs.readFileSync(a));
  b2.seances.push({id: '2026-09-28-montre', date: '2026-09-28', titre: 'Avec montre', blocs: []}); fs.writeFileSync(a, JSON.stringify(b2));
  const srv = http.createServer((req, res) => { const f = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if(!f.startsWith(dir) || !fs.existsSync(f)){ res.writeHead(404); return res.end(); } res.writeHead(200, {'content-type': 'application/json'}); res.end(fs.readFileSync(f)); }).listen(8766);
  srv.dir = dir; return srv;
}

/* ---------- faux intervals.icu ---------- */
function fakeIcu(){
  const S = {
    athletes: [{id: 'i1', name: 'Nathan Coach'}, {id: 'i10', name: 'Simon'}, {id: 'i11', name: 'Antonin'}, {id: 'i12', name: 'Malone'}, {id: 'i13', name: 'Amael'}],
    acts: {i10: [], i11: [], i12: [], i13: []}, events: {i10: [], i11: [], i12: [], i13: []},
    wellness: {i10: [{id: '', ctl: 42.3, atl: 51.1}], i11: [{ctl: 60, atl: 55}], i12: [{ctl: 30, atl: 28}], i13: [{ctl: 20, atl: 25}]},
    calls: [], nextId: 100, forbidWrite: false
  };
  const srv = http.createServer((req, res) => {
    let body = ''; req.on('data', c => body += c); req.on('end', () => {
      const u = new URL(req.url, 'http://x'), p = u.pathname, m = req.method;
      S.calls.push(`${m} ${p}`);
      const send = (code, obj) => { res.writeHead(code, {'content-type': 'application/json'}); res.end(obj === undefined ? '' : JSON.stringify(obj)); };
      if(req.headers.authorization !== 'Basic ' + Buffer.from('API_KEY:' + KEY).toString('base64')) return send(401, {error: 'auth'});
      const B = body ? JSON.parse(body) : null;
      let r;
      if(m === 'GET' && p === '/api/v1/athletes') return send(200, S.athletes);
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/activities$/)) && m === 'GET'){
        const o = u.searchParams.get('oldest'), n = u.searchParams.get('newest') || '9999';
        return send(200, (S.acts[r[1]] || []).filter(a => a.start_date_local.slice(0, 10) >= o.slice(0, 10) && a.start_date_local <= (n.length === 10 ? n + 'T23:59:59' : n)));
      }
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/activities\/manual\/bulk$/)) && m === 'POST'){
        if(S.forbidWrite) return send(403, {error: 'forbidden'});
        const out = B.map(a => { const L = S.acts[r[1]]; const ex = L.find(x => x.external_id && x.external_id === a.external_id);
          if(ex){ Object.assign(ex, a); return ex; } const n = {id: 'a' + (S.nextId++), icu_training_load: Math.round(a.icu_rpe * a.moving_time / 60), ...a}; L.push(n); return n; });
        return send(200, out);
      }
      if((r = p.match(/^\/api\/v1\/activity\/(a\d+)$/)) && m === 'PUT'){
        for(const L of Object.values(S.acts)){ const a = L.find(x => x.id === r[1]); if(a){ Object.assign(a, B); return send(200, a); } }
        return send(404, {});
      }
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/wellness$/)) && m === 'GET') return send(200, S.wellness[r[1]] || []);
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/events$/)) && m === 'GET'){
        const o = u.searchParams.get('oldest'), n = u.searchParams.get('newest');
        return send(200, (S.events[r[1]] || []).filter(e => e.start_date_local.slice(0, 10) >= o && e.start_date_local.slice(0, 10) <= n));
      }
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/events\/bulk$/)) && m === 'POST'){
        const out = B.map(e => { const n = {id: S.nextId++, ...e}; S.events[r[1]].push(n); return n; }); return send(200, out);
      }
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/events\/bulk-delete$/)) && m === 'PUT'){
        const ids = new Set(B.map(x => x.id)); S.events[r[1]] = S.events[r[1]].filter(e => !ids.has(e.id)); return send(200, {});
      }
      if((r = p.match(/^\/api\/v1\/athlete\/(i\d+)\/events\/(\d+)$/)) && m === 'PUT'){
        const e = S.events[r[1]].find(x => x.id === +r[2]); if(!e) return send(404, {}); Object.assign(e, B); return send(200, e);
      }
      send(404, {error: 'route ' + m + ' ' + p});
    });
  });
  return {S, srv};
}

/* ---------- le vrai worker, servi en local ---------- */
async function loadWorker(){
  const tmp = path.join(os.tmpdir(), `cu-worker-${process.pid}.mjs`);
  fs.copyFileSync(path.join(__dirname, '..', 'relais', 'worker.js'), tmp);
  return (await import('file://' + tmp)).default;
}
function serveWorker(W, env, port){
  return http.createServer(async (req, res) => {
    let body = []; req.on('data', c => body.push(c)); req.on('end', async () => {
      const init = {method: req.method, headers: req.headers};
      if(!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) init.body = Buffer.concat(body);
      const r = await W.fetch(new Request(`http://localhost:${port}${req.url}`, init), env);
      const h = {}; r.headers.forEach((v, k) => h[k] = v);
      res.writeHead(r.status, h); res.end(Buffer.from(await r.arrayBuffer()));
    });
  }).listen(port);
}
const ENV = {ICU_KEY: KEY, PIN, ICU_BASE: 'http://localhost:8799', SITE, ORIGINS: 'https://nathanmtb66.github.io,localhost'};

async function start(test){
  let ts = null; if(test){ ts = testSite(); SITE = ENV.SITE = 'http://localhost:8766/'; }
  const F = fakeIcu(); F.srv.listen(8799);
  const W = await loadWorker();
  const ws = serveWorker(W, ENV, 8790);
  return {F, W, dir: ts && ts.dir, close: () => { F.srv.close(); ws.close(); if(ts) ts.close(); }};
}
module.exports = {start, PIN};
if(require.main !== module) module.exports.seed = null;

if(require.main === module) (async () => {
  const {F, W, close} = await start(process.argv[2] !== 'serve');
  if(process.argv[2] === 'serve'){ console.log('faux intervals :8799 · relais :8790 (PIN ' + PIN + ')'); return; }
  const R = (p, o = {}) => fetch('http://localhost:8790' + p, {...o, headers: {'content-type': 'application/json', origin: 'https://nathanmtb66.github.io', ...(o.headers || {})}});
  let fail = 0; const ok = (c, m) => { console.log((c ? 'OK   ' : 'ÉCHEC ') + m); if(!c) fail++; };
  const book = await (await fetch(SITE + 'data/sessions/kjvtsl.json')).json();
  const sid = '2026-09-28-passe';

  let r = await R('/ping'); let j = await r.json();
  ok(j.ok && j.cle && j.pin, '/ping : relais en ligne, clé et PIN présents');
  ok(r.headers.get('access-control-allow-origin') === 'https://nathanmtb66.github.io', 'CORS : le site de l’appli est autorisé');
  r = await fetch('http://localhost:8790/ping', {headers: {origin: 'https://pirate.example'}});
  ok(!r.headers.get('access-control-allow-origin'), 'CORS : un autre site est refusé');

  // fin de séance, sans activité de montre → activité manuelle
  const body = {code: 'kjvtsl', id: sid, srpe: 7, dureeS: 3120, debutLocal: '2026-09-28T18:05:00', recap: 'Récap test\nSquat : 60 kg RPE 7', fiche: 'FICHE kjvtsl 2026-09-28 genou-mur=G11/D10'};
  r = await R('/seance', {method: 'POST', body: JSON.stringify(body)}); j = await r.json();
  ok(r.status === 200 && j.mode === 'cree', `séance → activité manuelle créée (${JSON.stringify(j)})`);
  const a = F.S.acts.i10[0];
  ok(a && a.type === 'WeightTraining' && a.icu_rpe === 7 && a.moving_time === 3120 && a.external_id === `cu-kjvtsl-${sid}`, 'activité : type muscu, RPE 7, 52 min, identifiant stable');
  ok(a && a.description.includes('FICHE kjvtsl') && a.description.includes('Squat : 60 kg'), 'activité : récap + ligne FICHE dans la description');
  r = await R('/seance', {method: 'POST', body: JSON.stringify(body)}); j = await r.json();
  ok(F.S.acts.i10.length === 1, `renvoi de la même séance : pas de doublon (${F.S.acts.i10.length} activité)`);

  // la montre a enregistré une muscu à la même heure → on complète celle-là
  F.S.acts.i11.push({id: 'a9', type: 'WeightTraining', start_date_local: '2026-09-28T17:58:00', name: 'Musculation', description: '', moving_time: 3300, external_id: null});
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, code: '2qzstf', id: '2026-09-28-montre'})}); j = await r.json();
  ok(j.mode === 'complete' && F.S.acts.i11.length === 1 && F.S.acts.i11[0].icu_rpe === 7, 'activité de montre à la même heure : complétée, pas de 2e activité (charge pas comptée deux fois)');
  F.S.acts.i10.push({id: 'a8', type: 'WeightTraining', start_date_local: '2026-09-30T10:00:00', name: 'Strength', description: 'notes montre', moving_time: 3000, external_id: null});
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, id: '2026-09-30-passe', debutLocal: '2026-09-30T10:10:00'})}); j = await r.json();
  const w = F.S.acts.i10.find(x => x.id === 'a8');
  ok(j.mode === 'complete' && w.icu_rpe === 7 && w.description.startsWith('notes montre') && w.description.includes('Charge Utile ·'), 'montre : RPE posé, ses notes gardées, récap ajouté');

  // refus
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, id: 'nexiste-pas'})}); ok(r.status === 404, 'séance non publiée → refusée (404)');
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, srpe: 14})}); ok(r.status === 400, 'RPE hors 1-10 → refusé (400)');
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, code: '../x'})}); ok(r.status === 400, 'code bidon → refusé (400)');
  const demo = await (await fetch(SITE + 'data/sessions/demo.json')).json();
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, code: 'demo', id: demo.seances[0].id})}); j = await r.json();
  ok(r.status === 409, `démo (pas dans l’équipe intervals) → pas d’écriture (${r.status} ${j.error || ''})`);

  // homonymes : deux « Simon » → on refuse de deviner
  F.S.athletes.push({id: 'i99', name: 'Simon Autre'});
  r = await R('/seance', {method: 'POST', body: JSON.stringify(body)}); j = await r.json();
  ok(r.status === 409 && /plusieurs/.test(j.error), 'deux athlètes au même prénom → refus clair, jamais d’écriture chez le mauvais');
  F.S.athletes.pop();

  // coach
  r = await R('/coach'); ok(r.status === 401, 'vue coach sans PIN → 401');
  r = await R('/coach', {headers: {'x-cu-pin': '0000'}}); ok(r.status === 401, 'vue coach mauvais PIN → 401');
  r = await R('/coach', {headers: {'x-cu-pin': PIN}}); j = await r.json();
  const sim = j.athletes && j.athletes.find(x => x.code === 'kjvtsl');
  ok(r.status === 200 && j.athletes.length === 4, `vue coach : 4 athlètes (${(j.athletes || []).map(x => x.prenom + (x.erreur ? ' ✗ ' + x.erreur : ' ✓')).join(', ')})`);
  ok(sim && sim.forme.ctl === 42.3 && sim.forme.tsb === -8.8, 'vue coach : forme (CTL 42,3 · ATL 51,1 · forme −8,8)');
  ok(sim && sim.faites.length >= 1 && sim.fiche[0] && sim.fiche[0].startsWith('FICHE kjvtsl'), 'vue coach : séances faites + résultats de tests relus depuis intervals');
  ok(sim && sim.semaines.some(s => s.charge > 0 && s.muscu >= 1), 'vue coach : charge par semaine calculée');

  // synchro calendrier
  r = await R('/coach/sync', {method: 'POST', headers: {'x-cu-pin': PIN}}); j = await r.json();
  const futur = book.seances.filter(s => s.date >= new Date(Date.now() - 864e5).toISOString().slice(0, 10)).length;
  const courses = ((book.saison || {}).courses || []).filter(c => c.date >= new Date().toISOString().slice(0, 10)).length;
  const blocs = ((book.saison || {}).blocs || []).filter(c => c.fin >= new Date().toISOString().slice(0, 10)).length;
  ok(j.ok && j.rapport.kjvtsl && j.rapport.kjvtsl.crees === futur + courses + blocs, `synchro : ${futur} séance(s) à venir + ${courses} course(s) + ${blocs} bloc(s) posés chez Simon (${JSON.stringify(j.rapport.kjvtsl)})`);
  const ev = F.S.events.i10.find(e => e.category === 'WORKOUT');
  if(ev) ok(/\?a=kjvtsl&s=/.test(ev.description) && ev.type === 'WeightTraining', 'séance posée : type muscu + lien direct vers la séance dans l’appli');
  r = await R('/coach/sync', {method: 'POST', headers: {'x-cu-pin': PIN}}); j = await r.json();
  ok(j.rapport.kjvtsl.crees === 0 && j.rapport.kjvtsl.maj === 0, 'synchro relancée : rien ne bouge (pas de doublons)');
  // Nathan retire une séance future → elle disparaît du calendrier
  const fake = {id: 424242, external_id: 'cu-kjvtsl-retiree', category: 'WORKOUT', start_date_local: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10) + 'T00:00:00', name: 'Muscu · Vieille'};
  F.S.events.i10.push(fake);
  r = await R('/coach/sync', {method: 'POST', headers: {'x-cu-pin': PIN}}); j = await r.json();
  ok(!F.S.events.i10.find(e => e.id === 424242) && j.rapport.kjvtsl.suppr === 1, 'séance retirée par Nathan : enlevée du calendrier intervals');

  // test des droits
  r = await R('/coach/droits', {method: 'POST', headers: {'x-cu-pin': PIN}}); j = await r.json();
  ok(j.ok && Object.values(j.droits).every(x => x.ok) && !F.S.events.i10.some(e => e.external_id === 'cu-kjvtsl-test-droits'), 'test des droits : note posée puis retirée chez les 4, rien ne reste');
  r = await R('/coach/droits', {method: 'POST'}); ok(r.status === 401, 'test des droits sans PIN → 401');

  // cron
  let waited = null; await W.scheduled({}, ENV, {waitUntil: p => waited = p}); await waited;
  ok(F.S.calls.filter(c => c === 'GET /api/v1/athletes').length > 5, 'tâche horaire : la synchro tourne toute seule');

  // intervals refuse l'écriture (droits coach insuffisants) → message clair, pas de plantage
  F.S.forbidWrite = true;
  r = await R('/seance', {method: 'POST', body: JSON.stringify({...body, id: sid, debutLocal: '2026-09-20T08:00:00'})}); j = await r.json();
  ok(r.status === 403 && /intervals POST/.test(j.error), `droits refusés par intervals → 403 explicite (${j.error})`);
  F.S.forbidWrite = false;

  // sans clé
  r = await W.fetch(new Request('http://x/seance', {method: 'POST', body: '{}'}), {...ENV, ICU_KEY: ''}); ok(r.status === 503, 'relais sans clé → 503 (rien n’est écrit)');

  close();
  console.log(fail ? `\n${fail} ÉCHEC(S)` : '\nRelais : tout est bon.');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
