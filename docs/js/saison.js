/* Charge Utile — plan de saison : où en est l'athlète (bloc, semaine, prochaine course) et frise des semaines.
   Même modèle que la planif de Nathan : semaines en colonnes, blocs colorés (Transition, PPG, PPO, PPS, PPC…), repères courses/tests, heures prévues.
   Utilisé par l'appli athlète (index.html) et la vue coach (coach.html). Aucune dépendance. */
(function(){
'use strict';
const T = {
  TRANSITION: {l:'Transition', c:'#7C8896'}, PPG: {l:'PPG', long:'Préparation générale', c:'#4C8DFF'}, PPO: {l:'PPO', long:'Préparation orientée', c:'#2FC0AE'},
  PPS: {l:'PPS', long:'Préparation spécifique', c:'#F4B63F'}, PPC: {l:'PPC', long:'Compétition', c:'#FF5A48'}, AFFUTAGE: {l:'Affûtage', c:'#B98AF7'},
  RECUP: {l:'Récup', long:'Récupération', c:'#5B6875'}
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const D = s => new Date(s + 'T12:00:00Z');
const iso = d => d.toISOString().slice(0, 10);
const add = (s, n) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const monday = s => add(s, -((D(s).getUTCDay() + 6) % 7));
const days = (a, b) => Math.round((D(b) - D(a)) / 864e5);
const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const court = s => { const d = D(s); return `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]}`; };
const type = b => T[b.type] || {l: b.type, c: '#7C8896'};
const nom = b => b.nom || type(b).long || type(b).l;
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

function blocs(sa){ return [...((sa && sa.blocs) || [])].sort((a, b) => a.debut.localeCompare(b.debut)); }
function courses(sa){ return [...((sa && sa.courses) || [])].sort((a, b) => a.date.localeCompare(b.date)); }
function range(sa, extra = []){
  const ds = [...blocs(sa).flatMap(b => [b.debut, b.fin]), ...courses(sa).map(c => c.date), ...((sa && sa.tests) || []).map(t => t.date), ...extra].filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  if(!ds.length) return null;
  return {from: monday(ds[0]), to: ds[ds.length - 1]};
}
function weeks(sa, extra){ const r = range(sa, extra); if(!r) return []; const w = []; for(let m = r.from; m <= r.to && w.length < 160; m = add(m, 7)) w.push(m); return w; }   // 3 ans max : garde-fou

/* où en est l'athlète aujourd'hui */
function pos(sa, today = localToday()){
  const B = blocs(sa); if(!B.length && !courses(sa).length) return null;
  const i = B.findIndex(b => b.debut <= today && today <= b.fin);
  const bloc = i >= 0 ? B[i] : null;
  const nSem = bloc ? Math.max(1, Math.ceil((days(monday(bloc.debut), monday(bloc.fin)) + 7) / 7)) : 0;
  const semaine = bloc ? Math.min(nSem, Math.floor(days(monday(bloc.debut), monday(today)) / 7) + 1) : 0;
  const next = courses(sa).find(c => c.date >= today);
  const suivant = B.find(b => b.debut > today);
  return {bloc, semaine, nSem, prochaine: next ? {...next, jours: days(today, next.date)} : null, suivant,
          avant: B.length && today < B[0].debut, finie: B.length && today > B[B.length - 1].fin && !next};
}
const jTxt = j => j === 0 ? 'aujourd’hui' : j === 1 ? 'demain' : `dans ${j} j`;

/* bandeau compact (accueil athlète, carte coach) */
function strip(sa, today = localToday(), id = 'saisonB'){
  const p = pos(sa, today); if(!p) return '';
  const t = p.bloc ? type(p.bloc) : null;
  const top = p.bloc ? `<span class="schip" style="--c:${t.c}">${esc(t.l)}</span><b>${esc(nom(p.bloc))}</b><em>semaine ${p.semaine}/${p.nSem}</em>`
    : p.avant ? `<b>La saison démarre le ${court(blocs(sa)[0].debut)}</b>` : p.suivant ? `<b>Prochain bloc : ${esc(nom(p.suivant))}</b><em>le ${court(p.suivant.debut)}</em>` : `<b>${esc(sa.nom || 'Saison')}</b>`;
  const race = p.prochaine ? `<span class="srace${p.prochaine.prio === 'A' ? ' a' : ''}">${esc(p.prochaine.nom)} · ${jTxt(p.prochaine.jours)}</span>` : '';
  const obj = p.bloc && p.bloc.objectif ? `<span class="sobj">${esc(p.bloc.objectif)}</span>` : '';
  return `<button class="sstrip" id="${id}" style="--c:${t ? t.c : 'var(--line)'}"><div class="stop">${top}</div>${obj}${race}${mini(sa, today)}</button>`;
}
/* mini-frise : tous les blocs en proportion, un trait « aujourd'hui » */
function mini(sa, today){
  const B = blocs(sa); if(!B.length) return '';
  const a = B[0].debut, z = [B[B.length - 1].fin, ...courses(sa).map(c => c.date)].sort().pop(), tot = Math.max(1, days(a, z) + 1);
  const pc = d => Math.max(0, Math.min(100, days(a, d) / tot * 100));
  return `<span class="smini">${B.map(b => `<i style="left:${pc(b.debut)}%;width:${Math.max(.8, pc(add(b.fin, 1)) - pc(b.debut))}%;background:${type(b).c}"></i>`).join('')}
    ${courses(sa).map(c => `<u class="${c.prio === 'A' ? 'a' : ''}" style="left:${pc(c.date)}%"></u>`).join('')}
    ${today >= a && today <= z ? `<s style="left:${pc(today)}%"></s>` : ''}</span>`;
}

/* frise complète en SVG : 1 colonne = 1 semaine (lundi) */
/* frise « tableur » : 1 colonne = 1 semaine (lundi), une ligne par information, étiquettes de lignes fixes à gauche */
const ROW = {mois: [0, 14], sem: [14, 28], blocs: [30, 58], courses: [62, 90], tests: [92, 108], heures: [112, 156]};
function layout(sa, o = {}){
  const reel = o.reel || {}, extraTests = o.tests || [];
  const hPrev = {};
  blocs(sa).forEach(b => (b.heures || []).forEach((h, k) => { const m = add(monday(b.debut), 7 * k); if(m <= b.fin) hPrev[m] = h; }));
  const hasBars = Object.keys(hPrev).length > 0 || Object.keys(reel).length > 0;
  return {hPrev, hasBars, H: hasBars ? ROW.heures[1] + 4 : ROW.tests[1] + 4, tests: [...((sa && sa.tests) || []), ...extraTests]};
}
function svg(sa, o = {}){
  const today = o.today || localToday(), W = 20, P = 6, reel = o.reel || {}, L = layout(sa, o);
  const wk = weeks(sa, L.tests.map(t => t.date)); if(!wk.length) return '';
  const B = blocs(sa), C = courses(sa), H = L.H;
  const maxH = Math.max(1, ...Object.values(L.hPrev), ...Object.values(reel).map(r => r.heures || 0));
  const width = wk.length * W + 2 * P;
  const x = m => P + wk.indexOf(monday(m)) * W;
  let s = `<svg class="sframe" viewBox="0 0 ${width} ${H}" width="${width}" height="${H}" role="img" aria-label="Plan de saison, ${wk.length} semaines">`;
  // fond : une semaine sur deux légèrement marquée, séparateurs de mois
  wk.forEach((m, i) => { if(i % 2) s += `<rect x="${P + i * W}" y="${ROW.sem[0]}" width="${W}" height="${H - ROW.sem[0]}" class="sband"/>`; });
  let last = -1;
  wk.forEach((m, i) => { const k = D(m).getUTCMonth(); if(k !== last){ last = k; s += `<line x1="${P + i * W}" x2="${P + i * W}" y1="0" y2="${H}" class="sgrid"/><text x="${P + i * W + 3}" y="10" class="smo">${MOIS[k]}</text>`; } });
  // numéro de semaine de saison
  wk.forEach((m, i) => { s += `<text x="${P + i * W + W / 2}" y="${ROW.sem[1] - 4}" text-anchor="middle" class="swk${m === monday(today) ? ' now' : ''}">${i + 1}</text>`; });
  // blocs
  B.forEach(b => {
    const x0 = x(b.debut), x1 = x(b.fin) + W, t = type(b), w = x1 - x0;
    s += `<rect x="${x0 + 1}" y="${ROW.blocs[0]}" width="${w - 2}" height="${ROW.blocs[1] - ROW.blocs[0]}" rx="5" fill="${t.c}"><title>${esc(nom(b))} · ${court(b.debut)} → ${court(b.fin)}</title></rect>`;
    const lab = [b.nom, t.l].find(l => l && l.length * 6.6 + 10 <= w);
    if(lab) s += `<text x="${x0 + w / 2}" y="${ROW.blocs[0] + 18}" class="sbl" text-anchor="middle">${esc(lab)}</text>`;
  });
  // courses : triangle (A plus grand) + lettre dedans
  C.forEach(c => { const cx = x(c.date) + W / 2, big = c.prio === 'A', r = big ? 9 : 7.5, y0 = ROW.courses[0] + 2;
    s += `<g class="srace-m ${big ? 'a' : ''}"><path d="M${cx} ${y0} l${r} ${r * 1.7} h${-2 * r} z"/><text x="${cx}" y="${y0 + r * 1.7 - 2.5}" text-anchor="middle" class="sprio">${esc(c.prio || '')}</text><title>${esc(c.nom)} · ${court(c.date)}</title></g>`; });
  // tests : losange sur leur propre ligne
  L.tests.forEach(t => { const cx = x(t.date) + W / 2, cy = (ROW.tests[0] + ROW.tests[1]) / 2; s += `<path class="stest" d="M${cx} ${cy - 6} l6 6 l-6 6 l-6 -6 z"><title>${esc(t.nom || 'Tests')} · ${court(t.date)}</title></path>`; });
  // heures : prévu (contour) / fait (plein)
  if(L.hasBars){
    const top = ROW.heures[0], bh = ROW.heures[1] - ROW.heures[0];
    s += `<line x1="0" x2="${width}" y1="${top + bh}" y2="${top + bh}" class="sgrid"/>`;
    wk.forEach((m, i) => {
      const p = L.hPrev[m], r = reel[m] && reel[m].heures;
      if(p){ const h = p / maxH * bh; s += `<rect x="${P + i * W + 3}" y="${top + bh - h}" width="${W - 6}" height="${h}" rx="2" class="sbarp"><title>${court(m)} : ${p} h prévues</title></rect>`; }
      if(r){ const h = r / maxH * bh; s += `<rect x="${P + i * W + 6}" y="${top + bh - h}" width="${W - 12}" height="${h}" rx="2" class="sbarr"><title>${court(m)} : ${Math.round(r * 10) / 10} h faites</title></rect>`; }
    });
  }
  // aujourd'hui
  if(wk.includes(monday(today))){ const tx = x(today) + ((D(today).getUTCDay() + 6) % 7 + .5) / 7 * W; s += `<line x1="${tx}" x2="${tx}" y1="${ROW.sem[1]}" y2="${H}" class="snow"/>`; }
  return s + '</svg>';
}
/* frise complète : étiquettes fixes + zone qui défile, calée sur aujourd'hui */
function frame(sa, o = {}){
  const L = layout(sa, o), rows = [['Sem.', ROW.sem], ['Blocs', ROW.blocs], ['Courses', ROW.courses], ['Tests', ROW.tests]];
  if(L.hasBars) rows.push(['Heures', ROW.heures]);
  return `<div class="sgridw" style="height:${L.H}px"><div class="srows">${rows.map(([l, r]) => `<span style="top:${r[0]}px;height:${r[1] - r[0]}px">${l}</span>`).join('')}</div><div class="sscroll" style="height:${L.H}px">${svg(sa, o)}</div></div>`;
}
function focus(root){
  const sc = root && root.querySelector('.sscroll'), now = sc && sc.querySelector('.snow');
  if(sc && now) sc.scrollLeft = Math.max(0, +now.getAttribute('x1') - sc.clientWidth * .3);
}
const legend = (sa, reel) => { const seen = [...new Set(blocs(sa).map(b => b.type))];
  return `<div class="slegend">${seen.map(k => `<span><i style="background:${(T[k] || {c:'#7C8896'}).c}"></i>${esc((T[k] || {l:k}).l)}</span>`).join('')}${courses(sa).length ? '<span><b class="lr">▲</b>Course (A, B, C)</span>' : ''}<span><b class="lt">◆</b>Tests</span>${blocs(sa).some(b => b.heures && b.heures.length) ? '<span><i class="lp"></i>Heures prévues / sem.</span>' : ''}${reel && Object.keys(reel).length ? '<span><i class="lf"></i>Heures faites</span>' : ''}</div>`; };

/* détail : blocs et courses */
function details(sa, today = localToday()){
  const p = pos(sa, today) || {};
  const bl = blocs(sa).map(b => { const t = type(b), now = p.bloc === b, past = b.fin < today;
    return `<li class="${now ? 'now' : past ? 'past' : ''}"><i style="background:${t.c}"></i><div><b>${esc(nom(b))}${now ? ` · semaine ${p.semaine}/${p.nSem}` : ''}</b>
      <small>${court(b.debut)} → ${court(b.fin)}${b.heures && b.heures.length ? ` · ${Math.min(...b.heures)} à ${Math.max(...b.heures)} h/sem.` : ''}</small>
      ${b.objectif ? `<span>${esc(b.objectif)}</span>` : ''}${b.muscu ? `<span class="smus">Muscu : ${esc(b.muscu)}</span>` : ''}</div></li>`; }).join('');
  const cs = courses(sa).map(c => { const j = days(today, c.date);
    return `<li class="${c.date < today ? 'past' : ''}"><span class="sprio-b ${c.prio === 'A' ? 'a' : ''}">${esc(c.prio || '·')}</span><div><b>${esc(c.nom)}</b><small>${court(c.date)}${c.lieu ? ' · ' + esc(c.lieu) : ''}${j >= 0 ? ' · ' + jTxt(j) : ''}</small>${c.objectif ? `<span>${esc(c.objectif)}</span>` : ''}</div></li>`; }).join('');
  return `${bl ? `<p class="lbl">Les blocs</p><ul class="sblocs">${bl}</ul>` : ''}${cs ? `<p class="lbl">Les courses</p><ul class="sblocs">${cs}</ul>` : ''}`;
}

window.Saison = {TYPES: T, frame, focus, pos, strip, mini, svg, legend, details, weeks, monday, court, today: localToday};
})();
