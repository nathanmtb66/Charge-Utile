/* Charge Utile — relais intervals.icu (Cloudflare Worker).
   Garde la clé API de COACH de Nathan (secret ICU_KEY) : les athlètes n'ont jamais de clé à donner.
   Un athlète est relié tout seul dès qu'il a accepté Nathan comme coach sur intervals.icu : son prénom
   (fichier de séances) est retrouvé dans la liste des athlètes coachés ; « icu » dans le fichier force l'id si deux prénoms se ressemblent.

   POST /seance        (appli athlète, sans secret)  fin de séance → activité muscu dans intervals (RPE, durée, récap, lignes FICHE)
   GET  /coach         (en-tête x-cu-pin = PIN)       vue coach : forme, charge par semaine, séances Charge Utile, résultats de tests
   POST /coach/sync    (PIN)                           pose tout de suite les séances et la saison dans les calendriers intervals
   cron (toutes les heures)                            même synchro, sans que personne n'ouvre rien
   GET  /ping                                          état du relais (clé et PIN présents ?), sans rien révéler */

const ICU = 'https://intervals.icu';
const CU_TAG = 'charge-utile';

/* ---------------- petits outils ---------------- */
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {status, headers: {'content-type': 'application/json; charset=utf-8', ...headers}});
const iso = d => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const monday = s => { const d = new Date(s + 'T12:00:00Z'); const k = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - k); return iso(d); };
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
function sameSecret(a, b){                      // comparaison à temps constant
  a = String(a || ''); b = String(b || ''); if(!a || !b) return false;
  let r = a.length ^ b.length; for(let i = 0; i < Math.max(a.length, b.length); i++) r |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return r === 0;
}
function cors(req, env){
  const o = req.headers.get('origin') || '';
  const ok = (env.ORIGINS || 'https://nathanmtb66.github.io').split(',').map(s => s.trim()).some(a => a && (o === a || (a === 'localhost' && /^http:\/\/localhost(:\d+)?$/.test(o))));
  return ok ? {'access-control-allow-origin': o, 'access-control-allow-headers': 'content-type, x-cu-pin', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'vary': 'origin'} : {};
}

/* ---------------- intervals.icu ---------------- */
function icu(env){
  const base = env.ICU_BASE || ICU;
  const auth = 'Basic ' + btoa('API_KEY:' + env.ICU_KEY);
  return async (method, path, body) => {
    const r = await fetch(base + path, {method, headers: {authorization: auth, 'content-type': 'application/json', accept: 'application/json'}, body: body === undefined ? undefined : JSON.stringify(body)});
    const t = await r.text();
    if(!r.ok){ const e = new Error(`intervals ${method} ${path.split('?')[0]} → ${r.status}`); e.status = r.status; e.detail = t.slice(0, 300); throw e; }
    return t ? JSON.parse(t) : null;
  };
}

/* ---------------- données du site (séances publiées) ---------------- */
async function site(env, path){
  const r = await fetch((env.SITE || 'https://nathanmtb66.github.io/Charge-Utile/') + path, {cf: {cacheTtl: 60}, headers: {'cache-control': 'no-cache'}});
  if(!r.ok) return null;
  return r.json();
}
async function equipe(env){ const e = await site(env, 'data/equipe.json'); return (e && e.athletes) || []; }

/* code Charge Utile → id intervals, via la liste des athlètes coachés (prénom), ou « icu » dans le fichier */
/* athlètes suivis sur intervals (sans le coach lui-même) : c'est la liste de référence, un nouvel athlète y apparaît tout seul */
async function suivis(call){
  const [list, me] = await Promise.all([call('GET', '/api/v1/athletes'), call('GET', '/api/v1/athlete/0').catch(() => null)]);
  return (list || []).filter(a => !me || a.id !== me.id).map(a => ({id: a.id, name: a.name || [a.firstname, a.lastname].filter(Boolean).join(' '),
    prenom: a.firstname || String(a.name || '').split(/\s+/)[0] || a.id, perm: a.icu_permission || null}));
}
/* code Charge Utile → athlète intervals : « icu » dans son fichier, sinon le prénom (n'importe quel mot du nom intervals, accents ignorés) */
async function lier(env, call, team, list){
  list = list || await suivis(call);
  const out = {};
  for(const a of team){
    if(a.icu){ const x = list.find(y => y.id === a.icu); out[a.code] = x || {id: a.icu, name: a.prenom, prenom: a.prenom}; continue; }
    const p = norm(a.prenom); if(!p) continue;
    let hits = list.filter(x => norm(x.prenom) === p);
    if(!hits.length) hits = list.filter(x => norm(x.name).split(/[\s\-]+/).includes(p));
    if(!hits.length) hits = list.filter(x => norm(x.name).split(/[\s\-]+/).some(t => t.length >= 3 && (t.startsWith(p) || p.startsWith(t))));
    if(hits.length === 1) out[a.code] = hits[0];
    else out[a.code] = {error: hits.length ? `plusieurs athlètes « ${a.prenom} » sur intervals : dis à Claude lequel est le bon` : `« ${a.prenom} » pas trouvé parmi tes athlètes intervals`};
  }
  return out;
}

/* ---------------- fin de séance → intervals ---------------- */
function descSeance(b){
  return [`Charge Utile · ${b.titre}${b.manuel ? ' (validée sans l’appli)' : ''}`, b.recap ? String(b.recap).slice(0, 3500) : '', ...(b.fiche ? [String(b.fiche).slice(0, 1500)] : [])].filter(Boolean).join('\n\n');
}
async function seance(req, env){
  const b = await req.json().catch(() => null);
  if(!b || !/^[a-z0-9]{3,12}$/.test(b.code || '') || typeof b.id !== 'string') return json({ok: false, error: 'requête invalide'}, 400);
  const srpe = Math.round(+b.srpe), duree = Math.round(+b.dureeS);
  if(!(srpe >= 1 && srpe <= 10) || !(duree >= 60 && duree <= 6 * 3600)) return json({ok: false, error: 'RPE (1-10) et durée (1 min à 6 h) requis'}, 400);
  const book = await site(env, `data/sessions/${b.code}.json`);
  const s = book && (book.seances || []).find(x => x.id === b.id);
  if(!s) return json({ok: false, error: 'séance inconnue'}, 404);          // on n'écrit que des séances vraiment publiées
  const call = icu(env);
  const team = await equipe(env);
  const me = team.find(a => a.code === b.code) || {code: b.code, prenom: book.prenom, icu: book.icu};
  const link = (await lier(env, call, [me]))[b.code];
  if(!link || !link.id) return json({ok: false, error: (link && link.error) || 'athlète non relié'}, 409);
  const ext = `cu-${b.code}-${b.id}`;
  const end = b.fin ? new Date(b.fin) : new Date();
  const startLocal = (b.debutLocal && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(b.debutLocal)) ? b.debutLocal.slice(0, 19) : new Date(end.getTime() - duree * 1000).toISOString().slice(0, 19);
  const day = startLocal.slice(0, 10);
  const description = descSeance({...b, titre: s.titre});
  // 1. la montre a déjà enregistré la séance de muscu ? on la complète au lieu d'en créer une 2e (sinon la charge compte double)
  const acts = await call('GET', `/api/v1/athlete/${link.id}/activities?oldest=${day}&newest=${day}T23:59:59`);
  const t0 = Date.parse(startLocal + 'Z');
  const watch = (acts || []).find(a => a.external_id === ext) ||
    (acts || []).find(a => /weight|strength|workout|training/i.test(a.type || '') && !String(a.external_id || '').startsWith('cu-') &&
      (b.manuel || Math.abs(Date.parse(String(a.start_date_local).slice(0, 19) + 'Z') - t0) < 3 * 3600e3));   // validée à la main : n'importe quelle muscu du jour
  if(watch){
    await call('PUT', `/api/v1/activity/${watch.id}`, {icu_rpe: srpe, name: watch.external_id === ext ? `Muscu · ${s.titre}` : watch.name,
      description: watch.description && !String(watch.description).includes('Charge Utile ·') ? `${watch.description}\n\n${description}` : description});
    return json({ok: true, mode: 'complete', activite: watch.id});
  }
  // 2. sinon : activité manuelle, idempotente (renvoyer deux fois ne crée pas de doublon)
  const created = await call('POST', `/api/v1/athlete/${link.id}/activities/manual/bulk`, [{
    start_date_local: startLocal, type: 'WeightTraining', name: `Muscu · ${s.titre}`, moving_time: duree, elapsed_time: duree,
    icu_rpe: srpe, description, external_id: ext}]);
  const id = Array.isArray(created) && created[0] ? created[0].id : null;
  return json({ok: true, mode: 'cree', activite: id});
}
/* la séance prévue posée par la synchro (même jour, type muscu) est appariée à l'activité par intervals lui-même */

/* ---------------- synchro : séances + saison → calendrier intervals ---------------- */
const TYPE_LABEL = {TRANSITION: 'Transition', PPG: 'PPG · générale', PPO: 'PPO · orientée', PPS: 'PPS · spécifique', PPC: 'PPC · compétition', AFFUTAGE: 'Affûtage', RECUP: 'Récupération'};
function eventsFor(env, book, code){
  const base = env.SITE || 'https://nathanmtb66.github.io/Charge-Utile/';
  const today = iso(new Date());
  const ev = [];
  for(const s of book.seances || []){
    if(s.date < addDays(today, -1)) continue;                                      // on ne touche pas au passé
    const test = (s.blocs || []).some(b => b.type === 'test');
    ev.push({external_id: `cu-${code}-${s.id}`, category: 'WORKOUT', type: 'WeightTraining', start_date_local: `${s.date}T00:00:00`,
      name: `${test ? 'Tests' : 'Muscu'} · ${s.titre}`, moving_time: (s.dureeMin || 45) * 60,
      description: `Ouvre ta séance dans Charge Utile :\n${base}?a=${code}&s=${encodeURIComponent(s.id)}\n\nRPE visé : ${s.rpe || '—'}${s.message ? '\n' + s.message : ''}`});
  }
  const sa = book.saison;
  if(sa){
    for(const c of sa.courses || []){
      if(c.date < today) continue;
      ev.push({external_id: `cu-${code}-course-${c.date}`, category: 'RACE_' + (['A', 'B', 'C'].includes(c.prio) ? c.prio : 'C'), start_date_local: `${c.date}T00:00:00`,
        name: c.nom, description: [c.lieu, c.objectif].filter(Boolean).join('\n') || undefined});
    }
    for(const bl of sa.blocs || []){
      if(bl.fin < today) continue;
      ev.push({external_id: `cu-${code}-bloc-${bl.debut}`, category: 'NOTE', start_date_local: `${bl.debut}T00:00:00`, end_date_local: `${addDays(bl.fin, 1)}T00:00:00`,
        name: `${bl.nom || TYPE_LABEL[bl.type] || bl.type}`, description: [bl.objectif, bl.muscu ? 'Muscu : ' + bl.muscu : ''].filter(Boolean).join('\n') || undefined});
    }
  }
  return ev;
}
const SYNC_FIELDS = ['category', 'type', 'start_date_local', 'end_date_local', 'name', 'moving_time', 'description'];
async function sync(env){
  const call = icu(env);
  const team = await equipe(env);
  const links = await lier(env, call, team);
  const report = {};
  const today = iso(new Date());
  for(const a of team){
    const L = links[a.code];
    if(!L || !L.id){ report[a.code] = {prenom: a.prenom, erreur: (L && L.error) || 'non relié'}; continue; }
    try{
      const book = await site(env, `data/sessions/${a.code}.json`);
      if(!book){ report[a.code] = {prenom: a.prenom, erreur: 'fichier de séances introuvable'}; continue; }
      const want = eventsFor(env, book, a.code);
      const oldest = [addDays(today, -2), ...want.map(e => e.start_date_local.slice(0, 10))].sort()[0], newest = addDays(today, 400);   // un bloc en cours a commencé avant
      const have = (await call('GET', `/api/v1/athlete/${L.id}/events?oldest=${oldest}&newest=${newest}`)) || [];
      const mine = new Map(have.filter(e => String(e.external_id || '').startsWith(`cu-${a.code}-`)).map(e => [e.external_id, e]));
      let crees = 0, maj = 0, suppr = 0;
      const toCreate = [];
      for(const e of want){
        const h = mine.get(e.external_id); mine.delete(e.external_id);
        if(!h){ toCreate.push(e); continue; }
        const diff = SYNC_FIELDS.some(k => e[k] !== undefined && String(h[k] ?? '').slice(0, 19) !== String(e[k]).slice(0, 19));
        if(diff){ await call('PUT', `/api/v1/athlete/${L.id}/events/${h.id}`, e); maj++; }
      }
      if(toCreate.length){ await call('POST', `/api/v1/athlete/${L.id}/events/bulk`, toCreate); crees = toCreate.length; }
      // séances retirées par Nathan : on enlève leur trace future (jamais une séance déjà faite)
      const gone = [...mine.values()].filter(e => String(e.start_date_local).slice(0, 10) >= today);
      if(gone.length){ await call('PUT', `/api/v1/athlete/${L.id}/events/bulk-delete`, gone.map(e => ({id: e.id}))); suppr = gone.length; }
      report[a.code] = {prenom: a.prenom, icu: L.id, crees, maj, suppr};
    }catch(e){ report[a.code] = {prenom: a.prenom, erreur: e.message}; }
  }
  return report;
}

/* ---------------- test des droits : pose puis retire une note du jour chez chaque athlète ---------------- */
async function droits(env){
  const call = icu(env), team = await equipe(env), list = await suivis(call), links = await lier(env, call, team, list), today = iso(new Date()), out = {};
  const linked = new Set(Object.values(links).filter(L => L && L.id).map(L => L.id));
  const all = [...team, ...list.filter(x => !linked.has(x.id)).map(x => ({code: 'icu-' + x.id, prenom: x.prenom, _id: x.id}))];
  for(const a of all){
    const L = a._id ? {id: a._id} : links[a.code];
    if(!L || !L.id){ out[a.code] = {prenom: a.prenom, ok: false, erreur: (L && L.error) || 'non relié'}; continue; }
    try{
      await call('GET', `/api/v1/athlete/${L.id}/activities?oldest=${addDays(today, -7)}&newest=${today}&limit=1`);
      const ev = await call('POST', `/api/v1/athlete/${L.id}/events/bulk`, [{category: 'NOTE', start_date_local: `${today}T00:00:00`, name: 'Test Charge Utile (retiré tout seul)', external_id: `cu-${a.code}-test-droits`}]);
      const id = Array.isArray(ev) && ev[0] ? ev[0].id : null;
      if(id) await call('PUT', `/api/v1/athlete/${L.id}/events/bulk-delete`, [{id}]);
      out[a.code] = {prenom: a.prenom, ok: true, appli: !a._id};
    }catch(e){ out[a.code] = {prenom: a.prenom, ok: false, erreur: e.message}; }
  }
  return out;
}

/* ---------------- vue coach ---------------- */
const FICHE_RE = /^FICHE .*$/m;
const SPORT = t => /ride|bike|cycl|velo/i.test(t) ? 'velo' : /run|trail|walk|hike/i.test(t) ? 'course' : /weight|strength/i.test(t) ? 'muscu' : 'autre';
async function coach(env){
  const call = icu(env);
  const [team, list] = await Promise.all([equipe(env), suivis(call)]);
  const links = await lier(env, call, team, list);
  const byId = {}; for(const [code, L] of Object.entries(links)) if(L && L.id) byId[L.id] = code;
  const today = iso(new Date());
  const from = monday(addDays(today, -7 * 7));                       // 8 semaines de réalisé
  const to = addDays(monday(today), 7 * 4 - 1);                      // 4 semaines de prévu
  const rows = list.map(x => ({icu: x.id, prenom: x.prenom, perm: x.perm, code: byId[x.id] || null}));
  for(const a of team) if(!rows.find(r => r.code === a.code)){ const L = links[a.code]; rows.push({code: a.code, prenom: a.prenom, erreur: (L && L.error) || 'non relié'}); }
  await Promise.all(rows.filter(r => r.icu).map(async row => {
    const code = row.code;
    try{
      const [acts, wel, evs] = await Promise.all([
        call('GET', `/api/v1/athlete/${row.icu}/activities?oldest=${from}&newest=${today}T23:59:59&fields=id,start_date_local,type,name,moving_time,icu_training_load,icu_rpe,external_id,description`),
        call('GET', `/api/v1/athlete/${row.icu}/wellness?oldest=${addDays(today, -1)}&newest=${today}`),
        call('GET', `/api/v1/athlete/${row.icu}/events?oldest=${today}&newest=${to}`)]);
      const w = (wel || []).slice(-1)[0] || {};
      row.forme = {ctl: w.ctl ?? null, atl: w.atl ?? null, tsb: w.ctl != null && w.atl != null ? Math.round((w.ctl - w.atl) * 10) / 10 : null};
      const weeks = {};
      const wk = k => (weeks[k] = weeks[k] || {semaine: k, charge: 0, heures: 0, muscu: 0, prevu: 0, prevuH: 0, sports: {velo: 0, course: 0, muscu: 0, autre: 0}});
      for(const x of acts || []){
        const k = wk(monday(String(x.start_date_local).slice(0, 10))), h = (x.moving_time || 0) / 3600, sp = SPORT(x.type || '');
        k.charge += x.icu_training_load || 0; k.heures += h; k.sports[sp] += h;
        if(sp === 'muscu') k.muscu++;
      }
      for(const e of evs || []){
        if(e.category !== 'WORKOUT') continue;
        const k = wk(monday(String(e.start_date_local).slice(0, 10)));
        k.prevu += e.icu_training_load || e.load_target || 0; k.prevuH += (e.moving_time || 0) / 3600;
      }
      const r1 = v => Math.round(v * 10) / 10;
      row.semaines = Object.values(weeks).sort((x, y) => x.semaine.localeCompare(y.semaine)).map(k => ({...k, charge: Math.round(k.charge), heures: r1(k.heures), prevu: Math.round(k.prevu), prevuH: r1(k.prevuH),
        sports: {velo: r1(k.sports.velo), course: r1(k.sports.course), muscu: r1(k.sports.muscu), autre: r1(k.sports.autre)}}));
      const mine = x => code && (String(x.external_id || '').startsWith(`cu-${code}-`) || String(x.description || '').includes('Charge Utile ·'));
      row.faites = (acts || []).filter(mine).map(x => ({id: String(x.external_id || '').replace(`cu-${code}-`, ''), date: String(x.start_date_local).slice(0, 10), nom: x.name, rpe: x.icu_rpe ?? null, min: Math.round((x.moving_time || 0) / 60)}));
      row.fiche = (acts || []).map(x => (String(x.description || '').match(FICHE_RE) || [])[0]).filter(Boolean);
      const recent = addDays(today, -14);
      row.douleurs = (acts || []).filter(x => String(x.start_date_local).slice(0, 10) >= recent)
        .flatMap(x => (String(x.description || '').match(/^Douleur : .*$/gm) || []).map(t => ({date: String(x.start_date_local).slice(0, 10), txt: t.replace(/^Douleur : /, '')})));
      row.derniere = (acts || []).map(x => String(x.start_date_local).slice(0, 10)).sort().pop() || null;
      row.courses = (evs || []).filter(e => /^RACE_/.test(e.category || '')).map(e => ({date: String(e.start_date_local).slice(0, 10), nom: e.name, prio: e.category.slice(5)}));
    }catch(e){ row.erreur = e.message; }
  }));
  const ord = r => { const i = team.findIndex(a => a.code === r.code); return i < 0 ? 100 : i; };
  rows.sort((x, y) => ord(x) - ord(y) || String(x.prenom).localeCompare(String(y.prenom)));
  return {date: today, athletes: rows};
}

/* ---------------- routeur ---------------- */
export default {
  async fetch(req, env){
    const url = new URL(req.url), h = cors(req, env);
    if(req.method === 'OPTIONS') return new Response(null, {status: 204, headers: h});
    try{
      if(url.pathname === '/ping') return json({ok: true, cle: !!env.ICU_KEY, pin: !!env.PIN}, 200, h);
      if(!env.ICU_KEY) return json({ok: false, error: 'clé intervals absente (secret ICU_KEY)'}, 503, h);
      if(url.pathname === '/seance' && req.method === 'POST') return withH(await seance(req, env), h);
      if(url.pathname.startsWith('/coach')){
        if(!sameSecret(req.headers.get('x-cu-pin'), env.PIN)) return json({ok: false, error: 'PIN'}, 401, h);
        if(url.pathname === '/coach' && req.method === 'GET') return json(await coach(env), 200, h);
        if(url.pathname === '/coach/sync' && req.method === 'POST') return json({ok: true, rapport: await sync(env)}, 200, h);
        if(url.pathname === '/coach/droits' && req.method === 'POST') return json({ok: true, droits: await droits(env)}, 200, h);
      }
      return json({ok: false, error: 'introuvable'}, 404, h);
    }catch(e){
      return json({ok: false, error: e.message, detail: e.detail}, e.status === 403 ? 403 : 502, h);
    }
  },
  async scheduled(_ev, env, ctx){ if(env.ICU_KEY) ctx.waitUntil(sync(env)); }
};
function withH(r, h){ const n = new Response(r.body, r); for(const [k, v] of Object.entries(h)) n.headers.set(k, v); return n; }
export {lier, eventsFor, monday};
