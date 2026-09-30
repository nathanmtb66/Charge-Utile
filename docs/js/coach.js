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
  if(!St.get('pin')) return el.innerHTML = `<span>intervals.icu est branché : tape ton PIN pour voir le réalisé.</span><span class="pinrow"><input id="pin" class="field" inputmode="numeric" autocomplete="off" placeholder="PIN"><button class="primary small" id="pinOk">OK</button></span>`;
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
  const go = () => { const v = ($('#pin') || {}).value; if(!v) return; St.set('pin', v.trim()); fetchLive(); };
  const b = $('#pinOk'); if(b) b.onclick = go;
  const i = $('#pin'); if(i) i.onkeydown = e => { if(e.key === 'Enter') go(); };
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
const ago = d => { const j = days(d, today); return j <= 0 ? 'aujourd’hui' : j === 1 ? 'hier' : `il y a ${j} j`; };
function card(a){
  const book = books[a.code] || {}, sa = book.saison, L = live && live.athletes.find(x => x.code === a.code);
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
    ${L && L.semaines && L.semaines.length ? `<div class="cchart"><small>Charge par semaine <i class="lf"></i>faite <i class="lp"></i>prévue</small>${loadBars(L.semaines)}${axis(L.semaines)}</div>` : ''}
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
  $('#clist').innerHTML = resume() + (team.length ? team.map(card).join('') : `<p class="quote">Aucun athlète publié.</p>`);
  $$('.ccard .ctop').forEach(b => b.onclick = () => { const c = b.parentElement.dataset.code; open = open === c ? null : c; St.set('coachOpen', open); render();
    const el = document.querySelector(`.ccard[data-code="${c}"]`); if(el && open){ Saison.focus(el); el.scrollIntoView({block: 'start', behavior: 'smooth'}); } });
  $('#cfoot').innerHTML = RELAIS && St.get('pin') ? `<button class="ghost" id="syncB">Synchroniser intervals</button><button class="textlink" id="pinX">Oublier le PIN sur ce téléphone</button>`
    : `<p class="note2">Ajoute cette page à ton écran d’accueil : c’est ta vue coach.</p>`;
  const sb = $('#syncB'); if(sb) sb.onclick = syncNow;
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
load().catch(e => { console.error(e); state('Impossible de charger : vérifie ta connexion.'); });
})();
