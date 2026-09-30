/* Charge Utile — vue coach (Nathan, sur son téléphone) : où en est chaque athlète.
   Sans relais : saison + séances publiées. Avec le relais intervals (PIN tapé une fois sur ce téléphone) : forme, charge réelle par semaine,
   séances faites avec leur RPE, derniers tests. Rien de secret dans cette page : les données intervals ne sortent du relais qu'avec le PIN. */
(function(){
'use strict';
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const St = {get(k, d = null){ try{ const v = localStorage.getItem('cu.' + k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
            set(k, v){ try{ localStorage.setItem('cu.' + k, JSON.stringify(v)); }catch(e){} }, del(k){ try{ localStorage.removeItem('cu.' + k); }catch(e){} }};
const today = Saison.today();
const court = Saison.court;
const days = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5);
let toastT = null;
function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
const getJSON = async (u, o) => { const r = await fetch(u, {cache: 'no-cache', ...o}); if(!r.ok){ const e = new Error(String(r.status)); e.status = r.status; try{ e.body = await r.json(); }catch(_){} throw e; } return r.json(); };

let RELAIS = '', team = [], books = {}, live = null, open = St.get('coachOpen', null);

async function load(){
  const cfg = await getJSON('data/config.json').catch(() => ({}));
  RELAIS = St.get('relais') ?? (cfg.relais || '');
  team = ((await getJSON('data/equipe.json').catch(() => ({}))).athletes) || [];
  await Promise.all(team.map(async a => { books[a.code] = await getJSON(`data/sessions/${a.code}.json`).catch(() => null); }));
  render();
  if(RELAIS && St.get('pin')) fetchLive();
  else state();
}
function state(msg){
  const el = $('#cstate');
  if(msg) return el.innerHTML = msg;
  if(!RELAIS) return el.innerHTML = `Plans et séances publiés. <b>intervals.icu pas encore branché</b> : la forme et le réalisé s’afficheront dès que le relais est en ligne.`;
  if(!St.get('pin')){ el.innerHTML = `<span>intervals.icu est branché : tape ton PIN pour voir le réalisé.</span><form class="pinrow" id="pinF"><input id="pin" class="field" type="password" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="PIN" aria-label="PIN"><button class="primary small" id="pinOk" type="submit">OK</button></form>`; bindPin(); return; }
  el.textContent = live ? `intervals.icu · à jour ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}` : 'intervals.icu…';
}
async function fetchLive(){
  state('intervals.icu…');
  try{
    live = await getJSON(RELAIS.replace(/\/$/, '') + '/coach', {headers: {'x-cu-pin': St.get('pin')}});
    state(); render();
  }catch(e){
    if(e.status === 401){ St.del('pin'); live = null; state(); bindPin(); toast('PIN refusé'); return; }
    live = null; state(`intervals.icu injoignable (${esc(e.body && e.body.error || e.message)}) : plans seulement.`);
  }
}
function bindPin(){
  const f = $('#pinF'); if(!f) return;
  f.onsubmit = e => { e.preventDefault(); const v = ($('#pin') || {}).value; if(!v || !v.trim()){ toast('Tape ton PIN'); return; }
    St.set('pin', v.trim()); const b = $('#pinOk'); if(b){ b.disabled = true; b.textContent = '…'; } fetchLive(); };
}

/* ---------- une carte par athlète ---------- */
function formeTxt(f){
  if(!f || f.tsb == null) return '';
  const t = f.tsb, cls = t < -25 ? 'bad' : t < -10 ? 'warn' : t > 5 ? 'fresh' : 'ok';
  const lab = t < -25 ? 'très chargé' : t < -10 ? 'en charge' : t > 5 ? 'frais' : 'équilibré';
  const n = v => String(Math.round(v * 10) / 10).replace('.', ',');
  return `<div class="ctiles"><div><b class="${cls}">${t > 0 ? '+' : ''}${n(t)}</b><span>Forme · ${lab}</span></div><div><b>${Math.round(f.ctl)}</b><span>Fitness</span></div><div><b>${Math.round(f.atl)}</b><span>Fatigue</span></div></div>`;
}
/* charge intervals par semaine : barre pleine = fait, contour = prévu ; la semaine en cours en couleur */
function loadBars(sem){
  if(!sem || !sem.length) return '';
  const W = 24, H = 56, max = Math.max(1, ...sem.map(s => Math.max(s.charge, s.prevu)));
  const thisMon = Saison.monday(today), w = sem.length * W;
  let s = `<svg class="cload" viewBox="0 0 ${w} ${H + 14}" preserveAspectRatio="none" role="img" aria-label="Charge par semaine">`;
  sem.forEach((k, i) => {
    const x = i * W, fut = k.semaine > thisMon, now = k.semaine === thisMon;
    if(k.prevu){ const h = Math.max(2, k.prevu / max * H); s += `<rect x="${x + 4}" y="${H - h}" width="${W - 8}" height="${h}" rx="2" class="cp"/>`; }
    if(k.charge && !fut){ const h = Math.max(2, k.charge / max * H); s += `<rect x="${x + 5}" y="${H - h}" width="${W - 10}" height="${h}" rx="2" class="cr${now ? ' now' : ''}"/>`; }
  });
  return s + '</svg>';
}
function axis(sem){
  if(!sem || !sem.length) return '';
  const lab = k => { const [, m, d] = k.semaine.split('-'); return `${+d}/${+m}`; };
  const thisMon = Saison.monday(today), i = sem.findIndex(k => k.semaine === thisMon);
  const n = sem.length, showNow = i > 1, showEnd = i < 0 || i < n - 3;
  return `<div class="caxis"><span>${lab(sem[0])}</span>${showNow ? `<span class="now" style="left:${Math.min(88, (i + .5) / n * 100)}%">cette sem.</span>` : ''}${showEnd ? `<span>${lab(sem[n - 1])}</span>` : ''}</div>`;
}
const vue = () => St.get('coachVue', 'volume');
function chart(L){
  if(!L || !L.semaines || !L.semaines.length) return '';
  const v = vue();
  const tabs = `<span class="cvtab"><button data-vue="volume" class="${v === 'volume' ? 'on' : ''}">Volume</button><button data-vue="charge" class="${v === 'charge' ? 'on' : ''}">Charge</button></span>`;
  return v === 'volume'
    ? `<div class="cchart"><small>${tabs}</small>${volBars(L.semaines)}${axis(L.semaines.filter(k => k.semaine <= Saison.monday(today)))}${volLegend(L.semaines)}</div>`
    : `<div class="cchart"><small>${tabs}<i class="lf"></i>faite <i class="lp"></i>prévue</small>${loadBars(L.semaines)}${axis(L.semaines)}</div>`;
}
/* athlète suivi sur intervals mais pas encore dans l'appli muscu */
function cardHorsAppli(a){
  const L = a.L || {}, alerts = [];
  if(L.erreur) alerts.push(`intervals : ${esc(L.erreur)}`);
  if(L.derniere && days(L.derniere, today) >= 5) alerts.push(`aucune activité sur intervals depuis ${days(L.derniere, today)} jours`);
  return `<article class="ccard" data-code="${esc(a.key)}">
    <div class="cname"><b>${esc(a.prenom)}</b><span class="ctag"><em class="dim">pas encore dans l’appli muscu</em></span></div>
    ${alerts.length ? `<p class="calert">${alerts.join('<br>')}</p>` : ''}
    ${formeTxt(L.forme)}
    ${chart(L)}
    <p class="cnote">Pour lui créer son appli muscu, dis à Claude : « ajoute ${esc(a.prenom)} » (en même temps que sa première séance).</p>
    <button class="textlink cmask" data-mask="${esc(a.key)}">Masquer (ce n’est pas un de mes athlètes)</button>
  </article>`;
}
const ago = d => { const j = days(d, today); return j <= 0 ? 'aujourd’hui' : j === 1 ? 'hier' : `il y a ${j} j`; };
/* la liste vient d'intervals (tout athlète suivi apparaît tout seul) ; sans le relais, celle des fiches publiées */
function people(){
  const hidden = new Set(St.get('caches', []));
  const all = live ? live.athletes.map(L => ({key: L.code || 'icu-' + L.icu, code: L.code, prenom: ((L.code && team.find(t => t.code === L.code)) || {}).prenom || L.prenom, L}))
    : team.map(a => ({key: a.code, code: a.code, prenom: a.prenom, L: null}));
  return {shown: all.filter(a => !hidden.has(a.key)), hidden: all.filter(a => hidden.has(a.key))};
}
const SP = [['velo', 'Vélo', '#4C8DFF'], ['course', 'Course', '#F4B63F'], ['muscu', 'Muscu', '#FF5A48'], ['autre', 'Autre', '#7C8896']];
/* volume par semaine, empilé par sport ; la semaine en cours est encadrée */
function volBars(sem){
  if(!sem || !sem.length) return '';
  const W = 24, H = 56, thisMon = Saison.monday(today), past = sem.filter(k => k.semaine <= thisMon);
  const max = Math.max(1, ...past.map(k => k.heures));
  let s = `<svg class="cload" viewBox="0 0 ${past.length * W} ${H}" preserveAspectRatio="none" role="img" aria-label="Volume par semaine et par sport">`;
  past.forEach((k, i) => { let y = H;
    SP.forEach(([id, , c]) => { const v = (k.sports || {})[id] || 0; if(!v) return; const h = v / max * H; y -= h; s += `<rect x="${i * W + 5}" y="${y}" width="${W - 10}" height="${h}" fill="${c}"/>`; });
    if(k.semaine === thisMon) s += `<rect x="${i * W + 2}" y="0.5" width="${W - 4}" height="${H - 1}" rx="3" class="cnow"/>`; });
  return s + '</svg>';
}
function volLegend(sem){
  const thisMon = Saison.monday(today), k = (sem || []).find(x => x.semaine === thisMon), last = (sem || []).filter(x => x.semaine < thisMon).slice(-1)[0];
  const h = v => String(Math.round(v * 10) / 10).replace('.', ',');
  const ref = k && k.heures ? k : last;
  return `<div class="cvleg">${SP.map(([id, l, c]) => `<span><i style="background:${c}"></i>${l}${ref && ref.sports && ref.sports[id] ? ` ${h(ref.sports[id])} h` : ''}</span>`).join('')}${ref ? `<em>${ref === k ? 'cette sem.' : 'sem. dernière'} : ${h(ref.heures)} h</em>` : ''}</div>`;
}
function card(a){
  const book = (a.code && books[a.code]) || {}, sa = book.saison, L = a.L;
  if(!a.code) return cardHorsAppli(a);
  const seances = [...(book.seances || [])].sort((x, y) => x.date.localeCompare(y.date));
  const faites = new Set(((L && L.faites) || []).map(f => f.id));
  const avenir = seances.filter(s => s.date >= today && !faites.has(s.id));
  const retard = L ? seances.filter(s => s.date < today && days(s.date, today) <= 14 && !faites.has(s.id)) : [];
  const p = sa ? Saison.pos(sa, today) : null;
  const next = avenir[0];
  const tag = p && p.bloc ? `<span class="schip" style="--c:${(Saison.TYPES[p.bloc.type] || {c:'#7C8896'}).c}">${esc((Saison.TYPES[p.bloc.type] || {l: p.bloc.type}).l)}</span><em>sem. ${p.semaine}/${p.nSem}</em>` : `<em class="dim">saison à définir</em>`;
  const race = p && p.prochaine ? `<span class="crace${p.prochaine.prio === 'A' ? ' a' : ''}">▲ ${esc(p.prochaine.nom)} · J-${p.prochaine.jours}</span>` : '';
  const alerts = [];
  if(L && L.erreur) alerts.push(`intervals : ${esc(L.erreur)}`);
  if(!live && !L && a.code && RELAIS && St.get('pin')) alerts.push('intervals…');
  (L && L.douleurs || []).forEach(d => alerts.push(`<b>Douleur</b> ${court(d.date)} : ${esc(d.txt)}`));
  if(L && L.derniere && days(L.derniere, today) >= 5) alerts.push(`aucune activité sur intervals depuis ${days(L.derniere, today)} jours`);
  if(retard.length) alerts.push(`${retard.length} séance${retard.length > 1 ? 's' : ''} de muscu pas faite${retard.length > 1 ? 's' : ''} (15 derniers jours)`);
  if(!avenir.length) alerts.push('aucune séance de muscu à venir');
  const last = L && L.faites && L.faites.length ? [...L.faites].sort((x, y) => x.date.localeCompare(y.date)).pop() : null;
  const mon = Saison.monday(today), sun = new Date(new Date(mon + 'T12:00:00Z').getTime() + 6 * 864e5).toISOString().slice(0, 10);
  const semaine = {prevues: seances.filter(s => s.date >= mon && s.date <= sun).length, faites: ((L && L.faites) || []).filter(f => f.date >= mon && f.date <= sun).length};
  const isOpen = open === a.code;
  const reel = {}; ((L && L.semaines) || []).forEach(k => reel[k.semaine] = {heures: k.heures, charge: k.charge});
  const detail = !isOpen ? '' : `
    ${sa ? `<p class="lbl">Saison</p>${Saison.frame(sa, {reel, tests: seances.filter(s => s.blocs.some(b => b.type === 'test')).map(s => ({date: s.date, nom: s.titre}))})}${Saison.legend(sa, reel)}${p && p.bloc && p.bloc.muscu ? `<p class="quote">Muscu du bloc : ${esc(p.bloc.muscu)}</p>` : ''}` : `<p class="quote">Pas encore de saison : dicte-la à Claude (blocs, courses A/B/C, heures par semaine).</p>`}
    <p class="lbl">Séances de muscu</p>
    <ul class="list tight">${seances.slice(-8).reverse().map(s => { const f = L && L.faites.find(x => x.id === s.id);
      return `<li><span>${esc(s.titre)}</span><span>${court(s.date)} · ${f ? `faite${f.rpe ? ' RPE ' + f.rpe : ''}` : s.date < today ? (L ? '<b class="warnt">pas faite</b>' : '—') : 'à venir'}</span></li>`; }).join('') || '<li><span>Aucune séance publiée</span><span></span></li>'}</ul>
    ${L && L.fiche && L.fiche.length ? `<p class="lbl">Derniers tests</p><pre class="recap">${esc(L.fiche.slice(0, 3).join('\n'))}</pre>` : ''}
    <a class="textlink" href="./?a=${esc(a.code)}" target="_blank" rel="noopener">Ouvrir son appli</a>`;
  return `<article class="ccard${isOpen ? ' open' : ''}" data-code="${esc(a.code)}">
    <button class="ctop" aria-expanded="${isOpen}">
      <div class="cname"><b>${esc(a.prenom || a.code)}</b><span class="ctag">${tag}</span></div>
      ${race}
      ${p && p.bloc && p.bloc.objectif ? `<span class="cobj">${esc(p.bloc.objectif)}</span>` : ''}
      ${sa ? Saison.mini(sa, today) : ''}
    </button>
    ${alerts.length ? `<p class="calert">${alerts.join('<br>')}</p>` : ''}
    ${formeTxt(L && L.forme)}
    ${chart(L)}
    <div class="crow"><span>Prochaine muscu</span><b>${next ? `${esc(next.titre)} · ${days(today, next.date) === 0 ? 'aujourd’hui' : court(next.date)}` : '—'}</b></div>
    ${last ? `<div class="crow"><span>Dernière faite</span><b>${esc(last.nom.replace(/^Muscu · /, ''))} · ${ago(last.date)}${last.rpe ? ` · RPE ${last.rpe}` : ''}</b></div>` : ''}
    ${L ? `<div class="crow"><span>Muscu cette semaine</span><b>${semaine.faites}/${semaine.prevues}</b></div>` : ''}
    ${detail}
  </article>`;
}
function resume(){
  if(!live) return '';
  const A = live.athletes || [];
  const douleurs = A.reduce((n, a) => n + ((a.douleurs || []).length), 0);
  const mon = Saison.monday(today);
  let prev = 0, fait = 0;
  team.forEach(a => { const bk = books[a.code] || {}; prev += (bk.seances || []).filter(s => s.date >= mon && s.date <= today).length;
    const L = A.find(x => x.code === a.code); fait += ((L && L.faites) || []).filter(f => f.date >= mon).length; });
  return `<div class="csum"><div><b>${fait}/${prev}</b><span>muscu faites cette semaine</span></div><div class="${douleurs ? 'bad' : ''}"><b>${douleurs}</b><span>douleur${douleurs > 1 ? 's' : ''} signalée${douleurs > 1 ? 's' : ''} (14 j)</span></div></div>`;
}
function render(){
  const P = people();
  $('#clist').innerHTML = resume() + (P.shown.length ? P.shown.map(card).join('') : `<p class="quote">Aucun athlète.</p>`)
    + (P.hidden.length ? `<button class="textlink" id="showHidden">Afficher les masqués (${P.hidden.length})</button>` : '');
  $$('[data-vue]').forEach(b => b.onclick = e => { e.stopPropagation(); St.set('coachVue', b.dataset.vue); render(); });
  $$('[data-mask]').forEach(b => b.onclick = () => { const c = St.get('caches', []); c.push(b.dataset.mask); St.set('caches', c); render(); toast('Masqué sur ce téléphone'); });
  const sh = $('#showHidden'); if(sh) sh.onclick = () => { St.del('caches'); render(); };
  $$('.ccard .ctop').forEach(b => b.onclick = () => { const c = b.parentElement.dataset.code; open = open === c ? null : c; St.set('coachOpen', open); render();
    const el = document.querySelector(`.ccard[data-code="${c}"]`); if(el && open){ Saison.focus(el); el.scrollIntoView({block: 'start', behavior: 'smooth'}); } });
  $('#cfoot').innerHTML = RELAIS && St.get('pin') ? `<button class="ghost" id="syncB">Synchroniser intervals</button><button class="textlink" id="droitsB">Vérifier les droits intervals</button><button class="textlink" id="pinX">Oublier le PIN sur ce téléphone</button>`
    : `<p class="note2">Ajoute cette page à ton écran d’accueil : c’est ta vue coach.</p>`;
  const sb = $('#syncB'); if(sb) sb.onclick = syncNow;
  const db = $('#droitsB'); if(db) db.onclick = async () => { db.textContent = 'Vérification…';
    try{ const r = await getJSON(RELAIS.replace(/\/$/, '') + '/coach/droits', {method: 'POST', headers: {'x-cu-pin': St.get('pin')}});
      state(Object.values(r.droits).map(x => `${esc(x.prenom)} : ${x.ok ? '✓ lecture et écriture OK' + (x.appli === false ? ' (pas encore dans l’appli muscu)' : '') : '✗ ' + esc(x.erreur)}`).join('<br>')); }
    catch(e){ toast('Vérification impossible : ' + (e.body && e.body.error || e.message)); }
    db.textContent = 'Vérifier les droits intervals'; };
  const px = $('#pinX'); if(px) px.onclick = () => { St.del('pin'); live = null; state(); bindPin(); render(); };
  bindPin();
}
async function syncNow(){
  const b = $('#syncB'); b.disabled = true; b.textContent = 'Synchro…';
  try{
    const r = await getJSON(RELAIS.replace(/\/$/, '') + '/coach/sync', {method: 'POST', headers: {'x-cu-pin': St.get('pin')}});
    const rep = Object.values(r.rapport || {}).map(x => x.erreur ? `${x.prenom} : ${x.erreur}` : `${x.prenom} : ${x.crees} posée${x.crees > 1 ? 's' : ''}, ${x.maj} mise${x.maj > 1 ? 's' : ''} à jour${x.suppr ? `, ${x.suppr} retirée${x.suppr > 1 ? 's' : ''}` : ''}`);
    toast('Calendriers intervals à jour'); state(rep.map(esc).join('<br>'));
  }catch(e){ toast('Synchro impossible : ' + (e.body && e.body.error || e.message)); }
  b.disabled = false; b.textContent = 'Synchroniser intervals';
}
window.__coach = {reload: load, state: () => ({RELAIS, live, team: team.length})};
/* nouvelle version publiée : on la prend tout de suite (la vue coach n'a jamais de séance en cours) */
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')){
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').then(reg => { document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') reg.update().catch(() => {}); }); }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if(had && !window.__cuReloading){ window.__cuReloading = true; location.reload(); } });
}
load().catch(e => { console.error(e); state('Impossible de charger : vérifie ta connexion.'); });
})();
