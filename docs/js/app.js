/* Charge Utile — lecteur de séance v5 (web-app hors-ligne) */
(function(){
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const ICO = {
  swap:'<path d="M7 4L3 8l4 4"/><path d="M3 8h14"/><path d="M17 20l4-4-4-4"/><path d="M21 16H7"/>',
  pain:'<path d="M12 3.5l9 16H3z"/><path d="M12 10v4.5M12 17.5h.01"/>',
  cam:'<rect x="3" y="7" width="13" height="11" rx="2.5"/><path d="M16 11l5-2.5v8L16 14"/>',
  play:'<path d="M8 5.5v13l10-6.5z" fill="currentColor"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  bolt:'<path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z" fill="currentColor" stroke="none"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  eye:'<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  send:'<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
  sound:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>',
  mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  chev:'<path d="M9 5l7 7-7 7"/>',
  knee:'<path d="M9 3v7c0 2 1 3 3 3s3 1 3 3v5"/><circle cx="12" cy="13" r="2.2"/>',
  dl:'<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'
};
const ico = (n, cls='ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICO[n]}</svg>`;
const Q = new URLSearchParams(location.search);
const SPEED = Math.max(1, +Q.get('vitesse') || 1);
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ============ stockage local (confort uniquement, tout marche sans) ============ */
const Store = {
  get(k, d=null){ try{ const v = localStorage.getItem('cu.'+k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('cu.'+k, JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem('cu.'+k); }catch(e){} }
};

/* ============ données ============ */
const Data = {
  ex: {}, list: [], book: null, tests: {},
  async load(code){
    const inline = window.CU_DATA;
    const exs = inline ? inline.exercises : await (await fetch('data/exercises.json')).json();
    this.list = exs; this.ex = {}; exs.forEach(x => this.ex[x.id] = x);
    try{ const t = inline ? inline.tests : await (await fetch('data/tests.json')).json(); this.tests = {}; ((t && t.tests) || []).forEach(x => this.tests[x.id] = x); }catch(e){ this.tests = {}; }
    if(!code){ this.book = null; return; }
    if(inline){ this.book = inline.sessions[code] || null; return; }
    try{
      const r = await fetch(`data/sessions/${encodeURIComponent(code)}.json`, {cache:'no-cache'});
      this.book = r.ok ? await r.json() : null;
      if(this.book) Store.set('book', this.book);
    }catch(e){ this.book = Store.get('book'); }
    if(!this.book){ const b = Store.get('book'); if(b && b.athlete === code) this.book = b; }
  }
};

/* ============ défilement : on prévient quand il reste du contenu sous l'écran ============ */
function scrollWatch(){
  const app = $('#app'), bar = $('#bar'), down = $('#scrolldown');
  const boxes = ['#page','#panel'].map($).filter(Boolean);
  const live = () => boxes.find(n => !n.hidden && n.scrollHeight - n.clientHeight > 12);
  const upd = () => {
    const n = live();
    const more = !!n && !app.classList.contains('live') && n.scrollTop + n.clientHeight < n.scrollHeight - 12;
    app.classList.toggle('more', more);
    if(more && down) down.style.bottom = (bar.offsetHeight + 10) + 'px';
  };
  boxes.forEach(n => {
    n.addEventListener('scroll', upd, {passive:true});
    new ResizeObserver(upd).observe(n);
    new MutationObserver(upd).observe(n, {childList:true, subtree:true, characterData:true});
  });
  new ResizeObserver(upd).observe(bar);
  addEventListener('resize', upd);
  if(down) down.onclick = () => { const n = live(); if(n) n.scrollBy({top: n.clientHeight * .8, behavior:'smooth'}); };
  upd();
}

/* ============ son, vibration, écran ============ */
let actx = null;
/* trois familles de sons, réglables séparément par l'athlète */
const SND_LABELS = {tempo:['Bips du rythme','Le tempo pendant la série : descends, tiens, monte'], count:['Bips du décompte','Les 5 dernières secondes avant de démarrer ou de repartir'], end:['Signal de fin','Le son qui annonce la fin d’une série ou d’une récup']};
const sndPrefs = (()=>{
  const old = Store.get('sound', null);                       // ancien réglage unique : on le reprend
  const base = {tempo: old !== false, count: old !== false, end: old !== false};
  return Object.assign(base, Store.get('snd', {}));
})();
function sndSet(k, v){ sndPrefs[k] = v; Store.set('snd', sndPrefs); }
function audio(){
  if(!actx){
    try{
      // les bips se mélangent à la musique de l'athlète au lieu de la couper (Safari 16.4+)
      if(navigator.audioSession) navigator.audioSession.type = 'ambient';
      actx = new (window.AudioContext||window.webkitAudioContext)();
    }catch(e){ return null; }
  }
  if(actx.state === 'suspended') actx.resume().catch(()=>{});
  return actx;
}
function beep(f=880, d=.12, v=.2, when=0, type='sine', cat='end'){
  if(!sndPrefs[cat]) return;
  const a = audio(); if(!a) return;
  try{
    const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); o.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .008);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.start(t); o.stop(t + d + .03);
  }catch(e){}
}
// signatures sonores du tempo
const SND = {
  down: ()=>beep(520, .09, .22, 0, 'sine', 'tempo'),                 // descente : tic grave à chaque seconde
  hold: ()=>beep(700, .07, .16, 0, 'triangle', 'tempo'),             // pause : tic moyen
  up:   ()=>{ beep(880, .07, .26, 0, 'sine', 'tempo'); beep(1320, .12, .26, .07, 'sine', 'tempo'); }, // montée : double note montante
  rep:  ()=>beep(990, .05, .12, 0, 'sine', 'tempo'),
  breath:(f,d,v)=>beep(f, d, v, 0, 'sine', 'tempo'),
  count:()=>beep(640, .08, .2, 0, 'sine', 'count'),
  go:   ()=>beep(1040, .22, .26, 0, 'sine', 'end'),
  end:  ()=>{ beep(880, .12, .24, 0, 'sine', 'end'); beep(1175, .2, .24, .13, 'sine', 'end'); },
  tap:  ()=>beep(700, .04, .08, 0, 'sine', 'end')
};
const buzz = p => { try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} };
let wake = null, wantWake = false;
async function keepAwake(){ wantWake = true; try{ wake = await navigator.wakeLock.request('screen'); }catch(e){} }
function releaseWake(){ wantWake = false; try{ wake && wake.release(); }catch(e){} wake = null; }
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible' && wantWake) keepAwake(); });

/* ============ petites animations d'interface ============ */
function stagger(root){ if(!root || RM) return; Array.from(root.children).forEach((c,i)=>{ c.style.setProperty('--i', i); c.classList.remove('rise'); void c.offsetWidth; c.classList.add('rise'); }); }
const fmtN = (v, target=v) => (Number.isInteger(target) ? Math.round(v) : (Math.round(v*2)/2)).toString().replace('.',',');
function countUp(el, to, dur=520){
  if(!el) return; if(RM || isNaN(to)){ el.textContent = fmtN(to); return; }
  const t0 = performance.now();
  const step = now => { const k = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-k,3); el.textContent = fmtN(to*e, to); if(k<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function pop(el, cls='pop'){ if(!el || RM) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
const mmss = s => { s = Math.max(0, Math.ceil(s)); return s>=60 ? `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` : `${s}`; };
const kg = n => (Math.round(n*10)/10).toString().replace('.',',');
const DAYS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function dayLabel(iso){
  const d = new Date(iso + 'T12:00:00'), now = new Date(); now.setHours(12,0,0,0);
  const diff = Math.round((d - now)/86400000);
  const base = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  if(diff === 0) return 'Aujourd’hui';
  if(diff === 1) return 'Demain';
  if(diff === -1) return 'Hier';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/* ============ scène 3D ============ */
const Stage = (()=>{
  const el = $('#stage'), glc = $('#gl');
  const ok = typeof THREE !== 'undefined' && typeof Rig !== 'undefined' && typeof BODY !== 'undefined' && (()=>{ try{ return !!document.createElement('canvas').getContext('webgl'); }catch(e){ return false; } })();
  const PRESETS = [['3/4',null],['Profil',0],['Face',90]];
  let renderer, scene, cam, rig, W=1, H=1, dpr=1;
  let exo=null, tl=null, t0=0, az=36, azTarget=null, preset=0, running=false, key='';
  let guide = null;              // séance guidée en cours (plein écran)
  const hud = $('#hud'), viewLbl = $('#viewLbl'), hint = $('#hint'), viewBtn = $('#btnView');
  if(!ok){ el.insertAdjacentHTML('beforeend','<div class="fallback">La démo 3D a besoin de WebGL.<br>Ouvre la page dans Safari ou Chrome.</div>'); }
  else {
    renderer = new THREE.WebGLRenderer({canvas:glc, antialias:true, alpha:true, powerPreference:'low-power'});
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xF2F5FF, 0x262B32, .95));
    const keyL = new THREE.DirectionalLight(0xFFFFFF, 1.2); keyL.position.set(1.8,4,2.6); keyL.castShadow = true;
    keyL.shadow.mapSize.set(1024,1024); Object.assign(keyL.shadow.camera,{left:-2.8,right:2.8,top:2.8,bottom:-2.8,near:.5,far:12}); keyL.shadow.bias = -.0006; scene.add(keyL);
    const rim = new THREE.DirectionalLight(0xFFC9BA, .5); rim.position.set(-2.5,2.4,-2); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xBFD6FF, .3); fill.position.set(2,1,-3); scene.add(fill);
    const cv = document.createElement('canvas'); cv.width = cv.height = 256;
    const g = cv.getContext('2d'); const grd = g.createRadialGradient(128,128,0,128,128,128);
    grd.addColorStop(0,'rgba(120,135,150,.26)'); grd.addColorStop(.6,'rgba(120,135,150,.08)'); grd.addColorStop(1,'rgba(120,135,150,0)');
    g.fillStyle = grd; g.fillRect(0,0,256,256);
    const spot = new THREE.Mesh(new THREE.PlaneGeometry(6,6), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv), transparent:true, depthWrite:false}));
    spot.rotation.x = -Math.PI/2; spot.position.set(0,.001,0); scene.add(spot);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(12,12), new THREE.ShadowMaterial({opacity:.34}));
    shadow.rotation.x = -Math.PI/2; shadow.receiveShadow = true; scene.add(shadow);
    rig = Rig.build(scene, BODY);
    cam = new THREE.PerspectiveCamera(28, 1, .05, 40);
    new ResizeObserver(resize).observe(el);
    let drag = null, vel = 0, down = null;
    el.addEventListener('pointerdown', e=>{
      if(e.target.closest('button')) return;
      down = {x:e.clientX, y:e.clientY, t:performance.now(), moved:0};
      drag = {x:e.clientX}; vel = 0; azTarget = null; try{ el.setPointerCapture(e.pointerId); }catch(_){}
    });
    el.addEventListener('pointermove', e=>{
      if(!drag) return; const dx = e.clientX - drag.x; drag.x = e.clientX;
      if(down) down.moved = Math.max(down.moved, Math.hypot(e.clientX-down.x, e.clientY-down.y));
      if(down && down.moved < 8) return;
      vel = dx; az -= dx*.5; viewLbl.textContent = 'Libre'; hint.style.opacity = 0;
    });
    const endDrag = (e)=>{
      if(down && down.moved < 10 && performance.now() - down.t < 400 && guide && guide.onTap && e.type === 'pointerup') guide.onTap();
      down = null;
      if(!drag) return; drag = null; const glide = ()=>{ vel *= .9; az -= vel*.5; if(Math.abs(vel) > .2) requestAnimationFrame(glide); }; if(!RM) glide();
    };
    el.addEventListener('pointerup', endDrag); el.addEventListener('pointercancel', endDrag);
  }
  viewBtn.addEventListener('click', ()=>{ preset = (preset+1)%PRESETS.length; azTarget = presetAz(); viewLbl.textContent = PRESETS[preset][0]; hint.style.opacity = 0; pop(viewBtn); });
  const meta = () => (exo && Rig.META[exo.anim]) || {};
  const frame = () => { const f = meta().frame; return (typeof f === 'function' ? f(exo.opts||{}) : f) || {tx:0,ty:.9,H:2.1,W:1.6,az:36}; };
  function presetAz(){ const f = frame(); return preset===0 ? (f.az ?? 36) : PRESETS[preset][1]; }
  function resize(){
    const r = el.getBoundingClientRect(); W = Math.max(1,r.width); H = Math.max(1,r.height); dpr = Math.min(2, window.devicePixelRatio||1);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    cam.aspect = W/H; cam.updateProjectionMatrix();
  }
  function timeline(e){
    const m = Rig.META[e.anim] || {};
    const tp = typeof m.tempo === 'function' ? m.tempo(e.opts||{}) : m.tempo;
    if(tp && e.tempo) return Rig.tempoTimeline(e.tempo);
    if(tp) return Rig.tempoTimeline(['2','0','1','0']);
    return Rig.cycleTimeline(e.cycle || m.cycle || 3);
  }
  function setExo(e, view){
    const k = e.anim + JSON.stringify(e.opts||{}) + (e.tempo||'');
    const changed = k !== key; key = k;
    exo = e; t0 = performance.now();
    tl = timeline(e);
    preset = view!=null ? view : 0;
    if(changed){ az = presetAz(); azTarget = null; } else azTarget = presetAz();
    viewLbl.textContent = PRESETS[preset][0];
    if(ok){ const p = Rig.P[e.anim](0, e.opts||{}, 0); rig.setFocus(e.muscles && e.muscles.length ? e.muscles : p.focus); if(changed) pop(glc, 'fadein'); }
    hudIdle();
  }
  /* ---------- HUD ---------- */
  const PH = {0:'Descends', 1:'Tiens', 2:'Monte', 3:'En haut'};
  function hudIdle(){
    if(guide) return;
    const t = exo && exo.tempo && isTempo(exo) ? exo.tempo : null;
    hud.className = 'hud idle';
    hud.innerHTML = t ? `<div class="tchips">${t.map((v,i)=>`<span data-i="${i}">${v}</span>`).join('')}<em id="tlab"></em></div>` : '';
  }
  function phaseWord(ph){ if(ph===2 && exo.tempo && exo.tempo[2]==='X') return 'Explose !'; return PH[ph]; }
  /* ---------- séance guidée : compte, bips et rythme sur la même horloge ---------- */
  function startGuide(o){
    stopGuide();
    // rythme sonore : seulement quand l'athlète compte des reps. Sur un exo au chrono, le silence.
    guide = Object.assign({count:0, lastPh:-1, lastSec:-1, lead:o.leadIn ?? 3, t0:performance.now(), done:false, lastCyc:-1, rhythm: o.rhythm !== false && !!o.target}, o);
    const tempo = tl && !tl.cyclic;
    hud.className = 'hud live';
    hud.innerHTML = `
      <div class="hreps"><b id="hCount">0</b><span>/ ${o.target ?? '–'}</span><small id="hSide">${o.twoSides ? '1er côté' : (o.unit || 'reps')}</small></div>
      ${o.load ? `<div class="hload">${esc(o.load)}</div>` : ''}
      <div class="hlead" id="hLead"></div>
      <div class="hphase${tempo ? '' : ' lbl2'}" id="hPhase">${tempo ? '' : `<b>${esc(o.label || 'À ton rythme')}</b>`}</div>
      <div class="htap" id="hTap">Tape l’écran quand tu as fini</div>
      ${o.breath ? `<div class="hbreath">${esc(o.breath)}</div>` : ''}`;
    el.classList.add('guided');
  }
  function stopGuide(){ guide = null; el.classList.remove('guided'); hudIdle(); }
  function guideTick(now){
    const g = guide; const tempo = tl && !tl.cyclic;
    let tg = (now - g.t0)/1000*SPEED - g.lead;
    if(tg < 0){ // décompte de départ : le mannequin attend en position de départ
      const n = Math.ceil(-tg);
      if(n !== g.lastLead){ g.lastLead = n; const L = $('#hLead'); L.textContent = n; pop(L,'tick'); SND.count(); buzz(20); }
      return {s:0, t:0};
    }
    if(g.lastLead !== 0){ g.lastLead = 0; const L = $('#hLead'); L.textContent = 'Go'; pop(L,'tick'); SND.go(); buzz(60); setTimeout(()=>{ if(L) L.textContent = ''; }, 700); }
    const target = g.target;
    if(g.done) return {s:g.freezeS ?? 0, t:g.freezeT ?? tg};
    if(tempo){
      const total = tl.total;
      const r = tl.at(tg);
      const cnt = tg >= tl.bounds[3] ? Math.floor((tg - tl.bounds[3]) / total) + 1 : 0;
      if(cnt !== g.count){ g.count = cnt; const c = $('#hCount'); c.textContent = cnt; pop(c,'tick'); if(g.onRep) g.onRep(cnt); }
      if(target && cnt >= target){ g.freezeS = 0; g.freezeT = tg; finishGuide(); return {s:0, t:tg}; }
      const d = tl.durations[r.phase];
      const secLeft = Math.ceil(r.left - 1e-6);
      if(r.phase !== g.lastPh){
        g.lastPh = r.phase; g.lastSec = secLeft;
        const P = $('#hPhase');
        const word = phaseWord(r.phase);
        const show = d >= .5 || r.phase === 2;
        if(show){ P.innerHTML = `<b>${word}</b><i id="hSec">${r.phase===2 && exo.tempo[2]==='X' ? '' : secLeft}</i>`; P.dataset.ph = r.phase; pop(P,'phasein'); }
        if(g.rhythm){ if(r.phase===0) SND.down(); else if(r.phase===1 && d >= .5) SND.hold(); else if(r.phase===2) SND.up(); }
        if(r.phase===2) buzz(30);
      } else if(secLeft !== g.lastSec){
        g.lastSec = secLeft;
        const S = $('#hSec'); if(S && S.textContent !== '') { S.textContent = secLeft; pop(S,'pulse'); }
        if(g.rhythm){ if(r.phase===0) SND.down(); else if(r.phase===1) SND.hold(); }
      }
      return {s:r.s, t:tg};
    }
    // mouvement cyclique : un bip par rep
    const per = tl.total, half = g.half ? per/2 : per;
    const cnt = Math.floor(tg / half);
    if(cnt !== g.count){ g.count = cnt; const c = $('#hCount'); c.textContent = cnt; pop(c,'tick'); if(g.rhythm) SND.rep(); if(g.onRep) g.onRep(cnt); }
    if(target && cnt >= target){ const tEnd = cnt*half; g.freezeS = (tEnd % per)/per; g.freezeT = tEnd; finishGuide(); return {s:g.freezeS, t:tEnd}; }
    return {s:(tg % per)/per, t:tg};
  }
  function finishGuide(){
    const g = guide; if(!g || g.done) return;
    if(g.twoSides && !g.second){ // premier côté fini : on relance le compte pour l'autre côté
      g.second = true; g.count = 0; g.lastPh = -1; g.lastSec = -1; g.lastLead = undefined; g.lead = 4; g.t0 = performance.now();
      SND.end(); buzz([80,60,80]);
      const c = $('#hCount'); if(c) c.textContent = '0';
      const P = $('#hPhase'); if(P) P.innerHTML = '<b>Autre côté</b>';
      const u = $('#hSide'); if(u) u.textContent = '2e côté';
      return;
    }
    g.done = true; SND.end(); buzz([80,60,80]);
    el.classList.add('reached');
    const T = $('#hTap'); if(T){ T.textContent = 'C’est fait ! Tape l’écran'; pop(T); }
    const P = $('#hPhase'); if(P) P.innerHTML = '<b>Bravo</b>';
    if(g.onReached) g.onReached();
  }
  function start(){ if(!ok || running) return; running = true; requestAnimationFrame(loop); }
  function stop(){ running = false; }
  function loop(now){
    if(!running) return;
    let s = 0, t = (now - t0)/1000, phase = -1;
    if(guide){ const r = guideTick(now); s = r.s; t = Math.max(0, r.t); }
    else if(tl){ const r = tl.at(t*SPEED); s = r.s; phase = r.phase;
      if(!tl.cyclic && phase !== hudPh){ hudPh = phase; const chips = hud.querySelectorAll('.tchips span'); chips.forEach((c,i)=>c.classList.toggle('on', i===phase)); const lab = $('#tlab'); if(lab) lab.textContent = phase>=0 ? phaseWord(phase) : ''; } }
    const p = Rig.P[exo.anim](s, exo.opts||{}, t);
    rig.update(p);
    if(guide && !guide.done && tl && tl.cyclic && p.label !== guide.poseLabel){
      guide.poseLabel = p.label;
      const P = $('#hPhase'); if(P){ P.innerHTML = `<b>${esc(p.label || guide.label || 'À ton rythme')}</b>`; P.classList.toggle('alert', !!p.label); if(p.label) pop(P,'phasein'); }
    }
    if(azTarget != null){ az += (azTarget - az)*.12; if(Math.abs(azTarget-az) < .1){ az = azTarget; azTarget = null; } }
    const f = frame();
    const need = Math.max(f.H, f.W / (W/H));
    const dist = need/2/Math.tan(14*Math.PI/180) * 1.06;
    const a = az*Math.PI/180, e = (f.el ?? 9)*Math.PI/180, tz = f.tz||0;
    cam.position.set(f.tx + dist*Math.sin(a)*Math.cos(e), f.ty + dist*Math.sin(e), tz + dist*Math.cos(a)*Math.cos(e));
    cam.lookAt(f.tx, f.ty, tz);
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  let hudPh = -2;
  return {setExo, start, stop, startGuide, stopGuide, finishGuide, ok, get guide(){ return guide; },
          reached(){ el.classList.remove('reached'); }};
})();

/* ============ caméra : enregistrement de la série dans l'appli ============ */
const Rec = (()=>{
  const video = $('#camv');
  let stream = null, rec = null, chunks = [], mime = '';
  const pick = () => ['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || '';
  return {
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder),
    async open(){
      stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment', width:{ideal:1280}, height:{ideal:720}}, audio:false});
      video.srcObject = stream; video.hidden = false; await video.play().catch(()=>{});
    },
    start(){ chunks = []; mime = pick(); rec = new MediaRecorder(stream, mime ? {mimeType:mime} : undefined); rec.ondataavailable = e => { if(e.data && e.data.size) chunks.push(e.data); }; rec.start(1000); },
    stop(name){ return new Promise(res => {
      if(!rec || rec.state === 'inactive'){ res(null); return; }
      rec.onstop = () => { const type = (rec.mimeType || mime || 'video/mp4').split(';')[0]; const ext = type.includes('webm') ? 'webm' : 'mp4';
        res(new File(chunks, `${name}.${ext}`, {type})); };
      rec.stop();
    }); },
    close(){ try{ stream && stream.getTracks().forEach(t=>t.stop()); }catch(e){} stream = null; video.srcObject = null; video.hidden = true; }
  };
})();
async function shareFile(file, text){
  try{
    if(navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], text}); return 'shared'; }
  }catch(e){ if(e && e.name === 'AbortError') return 'aborted'; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  return 'downloaded';
}
async function shareText(text){
  try{ if(navigator.share){ await navigator.share({text}); return 'shared'; } }catch(e){ if(e && e.name === 'AbortError') return 'aborted'; }
  try{ await navigator.clipboard.writeText(text); }catch(e){}
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  return 'wa';
}

/* ============ questions de ressenti (selon le type d'exercice) ============ */
const CR10 = ['','Très facile','Facile','Modéré','Un peu dur','Dur','Dur +','Très dur','Très dur +','Presque max','Maximal'];
const RPEQ = {
  reps:   {q:'Il t’en restait combien ?', sub:e=> e.rpe ? `Objectif RPE ${e.rpe} : il devait t’en rester ${10-e.rpe}.` : 'Sois honnête, ça règle la suite.',
           opts:[[5,'5 ou +'],[6,'4'],[7,'3'],[8,'2'],[9,'1'],[10,'0']], unit:'reps en réserve', num:true},
  hold:   {q:'Tu aurais tenu combien de plus ?', sub:()=>'À peu près, en secondes.',
           opts:[[6,'20 s +'],[7,'15 s'],[8,'10 s'],[9,'5 s'],[10,'0 s']], unit:'en réserve', num:true},
  plyo:   {q:'Tes sauts sont restés explosifs ?', sub:()=>'C’est la qualité qui compte ici, pas la fatigue.',
           opts:[[7,'Tous explosifs'],[8,'Un peu moins à la fin'],[9,'Ça a bien baissé'],[10,'Plus du tout']], num:false},
  effort: {q:'Ton effort sur cette série ?', sub:e=>`Objectif : ${e.rpe || 9}/10${e.intent ? ', ' + e.intent.toLowerCase() : ''}.`,
           opts:[[6,'Dur'],[7,'Très dur'],[8,'Très très dur'],[9,'Presque à fond'],[10,'À fond']], num:true},
  level:  {q:'C’était comment ?', sub:()=>'L’appli ajuste le niveau de la prochaine série.',
           opts:[[5,'Trop facile'],[7,'Juste bien'],[8,'Difficile'],[10,'Je perds l’équilibre']], num:false},
  round:  {q:'Ce tour, c’était comment ?', sub:()=>`Objectif de la séance : RPE ${App.session().rpe}.`,
           opts:[[5,'Dur'],[6,'Dur +'],[7,'Très dur'],[8,'Très dur +'],[9,'Presque max'],[10,'Maximal']], num:true}
};
const STATIC = new Set(['plank','sideplankstatic','wallsit','hollow','copenhagen','bosubalance']);
const isTempo = e => { const m = (typeof Rig !== 'undefined' && Rig.META[e.anim]) || {}; return typeof m.tempo === 'function' ? m.tempo(e.opts||{}) : !!m.tempo; };
/** consigne de respiration courte affichée pendant la série */
function breathCue(it){
  const heavy = typeof it.load === 'number' && (it.rpe || 0) >= 8 && ['squat','charniere','fente'].includes(it.famille);
  if(heavy) return 'Grande inspiration, bloque pendant la descente, souffle après le point dur';
  if(it.kind === 'plyo') return 'Souffle court à chaque impulsion · contact au sol le plus court possible';
  if(it.famille === 'etirement') return 'Respire lentement par le nez, relâche à chaque expiration';
  if(it.famille === 'mobilite') return 'Respire calmement, ne force pas l’amplitude';
  if(it.kind === 'hold') return 'Ne bloque pas : respire court et régulier, ventre gainé';
  if(it.kind === 'effort') return 'Respire fort et vite, rythme maximal';
  if(it.kind === 'cardio') return 'Respire par le nez si tu peux : allure facile';
  if(it.tempoTxt || it.tempo) return 'Inspire pendant la descente, souffle en remontant';
  return 'Souffle pendant l’effort, inspire au retour';
}
const holdLabel = it => (it.famille === 'etirement' || it.famille === 'gainage' || STATIC.has(it.anim) || (it.famille === 'proprio' && it.kind === 'hold')) ? 'Tiens la position' : it.famille === 'mobilite' ? 'Suis le mouvement' : 'Continue';
const qKind = it => it.progression ? 'level' : it.dur ? (it.kind === 'effort' ? 'effort' : it.kind === 'plyo' ? 'plyo' : 'hold') : (it.kind === 'plyo' ? 'plyo' : it.kind === 'effort' ? 'effort' : 'reps');

/* ============ fiche de tests locale : sert au lecteur et au calcul des charges en % du max ============ */
const D2R = Math.PI/180;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const r25 = v => Math.max(0, Math.floor(v/2.5 + 1e-9)*2.5);           // arrondi à 2,5 kg en dessous
const fKey = () => 'fiche.' + (Store.get('code') || 'x');
const ficheAll = () => Store.get(fKey(), []);
/** dernier max estimé connu : celui du téléphone (test refait par l'athlète) ou celui écrit par Nathan dans la séance, le plus récent gagne */
function e1rmFor(lift, src){
  const id = lift === 'squat' ? 'squat-e1rm' : 'sdt-e1rm';
  const loc = ficheAll().filter(e => e.test === id && e.v && !e.v.skip && e.v.e1rm).sort((a,b) => a.date.localeCompare(b.date)).pop();
  const a = loc ? {e1rm: +loc.v.e1rm, date: loc.date, local: true} : null;
  const b = src && src.e1rm ? {e1rm: +src.e1rm, date: src.e1rmDate || '0', local: false} : null;
  if(a && b) return a.date > b.date ? a : b;
  return a || b;
}

/* ============ moteur de séance ============ */
function buildItem(src){
  const x = Data.ex[src.ex] || {nom:src.ex, anim:'squat', type:'reps'};
  const m = (typeof Rig !== 'undefined' && Rig.META[x.anim]) || {};
  let load = src.charge, pctTxt = null;
  // charge en % du max estimé : Nathan écrit pct + base (+ charge calculée) ; si l'athlète a refait son test depuis, le téléphone recalcule
  if(src.pct && src.base){
    const e = e1rmFor(src.base, src);
    if(e){ if(e.local || typeof load !== 'number') load = r25(e.e1rm*src.pct/100); pctTxt = `${src.pct} % de ton max estimé (${kg(e.e1rm)} kg)`; }
  }
  const tempoOk = typeof m.tempo === 'function' ? m.tempo(x.opts || {}) : m.tempo;
  return {
    id: src.ex, src, name: src.nom || x.nom, anim: x.anim, opts: x.opts || {}, kind: x.type || 'reps',
    reps: src.reps, dur: src.duree, sets: src.series || 1, load, step: src.pas || (typeof load === 'number' ? 2.5 : 0),
    rpe: src.rpe, rest: src.recup ?? 60, tempo: tempoOk ? (src.tempo || x.tempoConseille || null) : null, tempoTxt: src.tempo || null,
    filmSet: src.filmer || 0, alt: !!src.alterne, perSide: !!src.parCote || (!!x.unilateral && !src.alterne), intent: src.intention, level: src.niveau,
    repsTodo: !!src.repsAConfirmer, cues: (src.consignes && src.consignes.length ? src.consignes : x.consignes) || [],
    why: x.pourquoi, breath: x.respiration, safety: x.securite, errors: x.erreurs || [], musclesTxt: x.musclesTxt, muscles: x.muscles,
    note: src.note, link: x.voirEnVrai, niveau: x.niveau || 1, famille: x.famille, progression: x.progression || null, tags: x.tags || [],
    alts: (x.alternatives || []).map(id => Data.ex[id]).filter(a => a && a.valide !== false), cycle: m.cycle, pctTxt
  };
}
/** un test de la batterie (bloc de type « test ») */
function buildTestItem(src){
  const d = Data.tests[src.test] || {id:src.test, nom:src.test, mode:'saisie', unite:'', cotes:false};
  const anim = typeof Rig !== 'undefined' && d.anim && typeof Rig.P[d.anim] === 'function' ? d.anim : null;
  return {id: src.test, src, test: d, kind:'test', name: src.nom || d.nom, anim, opts: d.opts || {}, sets: 1, cues: d.etapes || [], errors: [], alts: [],
    note: src.note, famille: 'test', muscles: null, why: d.pourquoi, safety: d.securite, reps: null, dur: null};
}
function buildBlocks(sess){
  return sess.blocs.map(b => ({
    name: b.nom, type: ({series:'sets', libre:'free'})[b.type] || b.type,
    rounds: b.tours || 1, restEx: b.recupExo ?? 15, restRound: b.recupTour ?? 90, min: b.min, max: b.max, note: b.note, noRpe: !!b.noRpe,
    items: (b.items || []).map(b.type === 'test' ? buildTestItem : buildItem)
  }));
}
function buildSteps(blocks){
  const steps = [];
  blocks.forEach((b, bi)=>{
    steps.push({t:'intro', bi});
    if(b.type==='cardio') b.items.forEach((it, ii)=> steps.push({t:'timer', bi, ii, rest:0}));
    if(b.type==='circuit'){
      for(let r=1; r<=b.rounds; r++){
        b.items.forEach((it, ii)=>{
          const last = ii === b.items.length-1;
          steps.push({t: it.dur ? 'timer' : 'reps', bi, ii, round:r, auto: ii>0, rest: last ? 0 : b.restEx, restKind:'transition'});
        });
        if(!b.noRpe) steps.push({t:'rpe', bi, round:r, rest: r < b.rounds ? b.restRound : 0});
      }
    }
    if(b.type==='sets') b.items.forEach((it, ii)=>{
      for(let s=1; s<=it.sets; s++){
        const lastOfBlock = ii === b.items.length-1 && s === it.sets;
        steps.push({t: it.dur ? 'timer' : 'reps', bi, ii, set:s, rest: lastOfBlock ? 0 : it.rest});
      }
    });
    if(b.type==='free') steps.push({t:'free', bi});
    if(b.type==='test') b.items.forEach((it, ii)=> steps.push({t:'test', bi, ii, rest:0}));
  });
  return steps;
}

const App = (()=>{
  let S = null, SESS = null, tick = null, cueTimer = null;
  const clone = o => JSON.parse(JSON.stringify(o));
  const step = () => S.steps[S.i];
  const blk = st => S.blocks[(st||step()).bi];
  const item = st => { st = st || step(); const b = S.blocks[st.bi]; return b && b.items ? b.items[st.ii] : null; };
  function clearTimers(){ clearInterval(cueTimer); clearInterval(tick); cueTimer = tick = null; tClean(); }
  const on = (sel, fn) => { const n = $(sel); if(n) n.onclick = fn; };
  function layout({stage=false, page=false, panel=false, tools=true, live=false, top=true}){
    $('#stage').hidden = !stage; $('#page').hidden = !page; $('#panel').hidden = !panel; $('#panel').classList.remove('tpanel','tfill');
    $('#app').classList.toggle('live', live);
    $('#app').classList.toggle('home', !top);
    $('#btnQuit').classList.toggle('off', !tools); $('#btnInfo').classList.toggle('off', !tools);
    if(stage) Stage.start(); else Stage.stop();
    if(!live) Stage.stopGuide();
  }
  function head(k, t){ const tt = $('#title'); if(tt.textContent !== t){ tt.textContent = t; pop(tt,'slidein'); } $('#kicker').textContent = k; }
  function progress(){
    const box = $('#segs');
    if(!S){ box.innerHTML = ''; return; }
    const nb = S.blocks.length;
    if(box.children.length !== nb) box.innerHTML = S.blocks.map(()=>'<i><b></b></i>').join('');
    S.blocks.forEach((b, bi)=>{
      const all = S.steps.map((s,i)=>[s,i]).filter(([s])=>s.bi===bi && s.t!=='intro');
      const done = all.filter(([,i])=>S.done.includes(i)).length;
      const cell = box.children[bi];
      cell.className = bi === (step()||{}).bi && !['intro','done'].includes(S.screen) ? 'now' : '';
      cell.firstChild.style.width = (all.length ? done/all.length*100 : 0) + '%';
    });
  }
  function bar(html){ $('#bar').innerHTML = html; stagger($('#bar')); }
  const goBtn = (label, id='go') => `<button class="go" id="${id}">${ico('bolt')}<span>${label}</span></button>`;
  const SKIP = new Set(['lastItem','pendingRpe','video']);
  function save(){ if(S && SESS) try{ Store.set('progress', {sid:SESS.id, at:Date.now(), S:JSON.parse(JSON.stringify({...S, screen:'x'}, (k,v)=> SKIP.has(k) ? undefined : v))}); }catch(e){} }
  function kicker(st){
    const b = blk(st);
    if(b.type==='circuit') return b.rounds > 1 ? `Tour ${st.round}/${b.rounds} · ${st.ii+1}/${b.items.length}` : `Exercice ${st.ii+1}/${b.items.length}`;
    if(b.type==='sets'){ const it = item(st); return `Série ${st.set}/${it.sets}`; }
    return b.name;
  }
  function volume(it){
    if(it.kind === 'test') return it.test.cotes ? 'gauche + droite' : (it.test.mode === 'force' ? 'série test' : '1 mesure');
    if(it.dur) return (it.dur >= 60 ? `${Math.round(it.dur/60)} min` : `${it.dur} s`) + (it.perSide ? ' / côté' : '');
    return `${it.reps}${it.alt ? ' alternés' : it.perSide ? ' / côté' : ''}`;
  }
  const loadTxt = it => typeof it.load === 'number' ? `${kg(it.load)} kg` : it.load ? it.load : '';
  function blockSummary(b){
    if(b.type==='circuit') return [b.rounds > 1 ? `${b.rounds} tours` : '', `${b.items.length} exos`, `${b.restEx} s entre les exos`,
      b.rounds > 1 ? `${b.restRound >= 60 ? b.restRound/60 + ' min' : b.restRound + ' s'} entre les tours` : ''].filter(Boolean).join(' · ');
    if(b.type==='sets') return b.items.map(it=>`${it.sets} × ${volume(it)} ${it.name.toLowerCase()}`).join(' · ');
    if(b.type==='free') return `${b.min} à ${b.max} min`;
    if(b.type==='test') return `${b.items.length} test${b.items.length > 1 ? 's' : ''} : ` + b.items.map(it => (it.test.court || it.name).toLowerCase()).join(', ');
    return b.items.map(it=>`${volume(it)} ${it.name.toLowerCase()}`).join(' + ');
  }
  const videoLink = it => it.link || ('https://www.youtube.com/results?search_query=' + encodeURIComponent(it.name + ' exercice technique'));

  /* ================= ACCUEIL ================= */
  async function home(){
    clearTimers(); releaseWake(); S = null; SESS = null;
    layout({page:true, tools:false, top:false}); progress();
    const code = Store.get('code');
    head('Charge Utile', code ? 'Mes séances' : 'Bienvenue');
    if(!code) return setup();
    await Data.load(code);
    const book = Data.book;
    if(!book){ return setup('Code introuvable. Vérifie avec Nathan, ou essaie la démo.'); }
    if(needInstallScreen()) return installScreen(book.prenom);
    const hist = Store.get('history', {});
    const prog = Store.get('progress');
    const today = new Date().toISOString().slice(0,10);
    const list = [...book.seances].sort((a,b)=>a.date.localeCompare(b.date));
    const todo = list.filter(s => !hist[s.id]);
    const done = list.filter(s => hist[s.id]).reverse();
    const resume = prog && list.find(s => s.id === prog.sid) && Date.now() - prog.at < 12*3600e3 ? list.find(s => s.id === prog.sid) : null;
    const card = (s, i) => `<button class="scard${i===0 ? ' first' : ''}" data-id="${esc(s.id)}">
        <div><small>${dayLabel(s.date)}${s.date < today ? ' · en retard' : ''}</small><b>${esc(s.titre)}</b>
        <span>${s.blocs.length} blocs · ≈ ${s.dureeMin || '?'} min · RPE ${esc(s.rpe || '—')}</span></div>${ico('chev')}</button>`;
    $('#page').innerHTML = `
      <div class="hero"><h2>${book.prenom ? 'Salut ' + esc(book.prenom) : 'Salut'}</h2><p class="tagline">${todo.length ? `${todo.length} séance${todo.length>1?'s':''} à faire` : list.length ? 'Tout est fait, bravo' : 'Nathan prépare ta première séance'}</p></div>
      ${resume ? `<button class="resume" id="resume">${ico('play')}<div><b>Reprendre ${esc(resume.titre)}</b><span>Là où tu t’es arrêté</span></div></button>` : ''}
      ${todo.length ? `<div class="slist">${todo.map(card).join('')}</div>` : `<p class="quote">${list.length ? 'Nathan n’a pas encore publié ta prochaine séance.' : 'Ton espace est prêt. Ta première séance arrivera ici.'}<small>En attendant, la récup et la mobilité sont déjà dispo.</small></p>`}
      <button class="recupbtn" id="recupB"><div><b>Récup &amp; mobilité</b><span>Étirements, mobilité, respiration · 5 à 20 min</span></div>${ico('chev')}</button>
      ${ficheAll().length ? `<button class="recupbtn" id="ficheB"><div><b>Ma fiche</b><span>Tes tests datés : force, souplesse, symétrie</span></div>${ico('chev')}</button>` : ''}
      ${installCard()}
      <div id="offb"></div>
      ${done.length ? `<p class="lbl">Déjà faites</p><ul class="list tight">${done.slice(0,6).map(s=>`<li><span>${esc(s.titre)}</span><span>${dayLabel(s.date)} · RPE ${hist[s.id].srpe ?? '—'}</span></li>`).join('')}</ul>` : ''}
      <div class="foot"><button class="textlink" id="snd">Sons : ${sndSummary()}</button><button class="textlink" id="chg">Changer de code</button></div>`;
    stagger($('#page'));
    bar('');
    offlineBadge();
    $$('.scard').forEach(b => b.onclick = ()=>{ SND.tap(); intro(list.find(s=>s.id===b.dataset.id)); });
    on('#resume', ()=>{ resumeSession(resume, prog); });
    on('#recupB', ()=>{ SND.tap(); recupHome(); });
    on('#ficheB', ()=>{ SND.tap(); ficheScreen(); });
    on('#snd', ()=>{ SND.tap(); soundSheet(()=>{ const s = $('#snd'); if(s) s.textContent = `Sons : ${sndSummary()}`; }); });
    on('#chg', ()=>{ Store.del('code'); home(); });
    bindInstall();
  }
  function setup(msg){
    head('Charge Utile', 'Bienvenue');
    $('#page').innerHTML = `
      <div class="hero"><h2>Tes séances de muscu</h2><p class="tagline">Préparées par Nathan</p></div>
      <p class="quote">Entre le code que Nathan t’a donné. Tu ne le feras qu’une fois.</p>
      ${msg ? `<p class="warn">${esc(msg)}</p>` : ''}
      <input class="field code" id="code" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Ton code">
      <button class="textlink" id="demo">Essayer la démo</button>`;
    stagger($('#page'));
    bar(`<button class="primary" id="ok">Valider</button>`);
    const go = c => { c = (c||'').trim().toLowerCase(); if(!c) return; Store.set('code', c); home(); };
    on('#ok', ()=>go($('#code').value));
    $('#code').onkeydown = e => { if(e.key === 'Enter') go(e.target.value); };
    on('#demo', ()=>go('demo'));
  }
  /* installation sur l'écran d'accueil */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; const c = $('#install'); if(c) c.hidden = false; });
  const standalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  const UA = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(UA) || (/Macintosh/.test(UA) && navigator.maxTouchPoints > 1);
  const iosOtherBrowser = isIOS && /CriOS|FxiOS|EdgiOS|OPiOS/i.test(UA);   // sur iPhone, seul Safari sait installer
  function installCard(){
    if(standalone() || window.CU_DATA) return '';
    if(iosOtherBrowser) return `<div class="install" id="install"><b>Installe l’appli</b><span>Ouvre ce lien dans <b>Safari</b>, puis Partager → « Sur l’écran d’accueil ».</span><button class="ghost small" id="copyLink">Copier le lien</button></div>`;
    if(isIOS) return `<div class="install" id="install"><b>Installe l’appli</b><span>${ico('dl','ico sm')} Partager → « Sur l’écran d’accueil ». Elle marchera ensuite sans réseau en salle.</span></div>`;
    return `<div class="install" id="install" ${deferredPrompt ? '' : 'hidden'}><b>Installe l’appli</b><span>Elle marchera ensuite sans réseau en salle.</span><button class="ghost small" id="doInstall">Installer</button></div>`;
  }
  async function copyLink(){
    const url = location.origin + location.pathname + '?a=' + (Store.get('code') || '');
    try{ await navigator.clipboard.writeText(url); toast('Lien copié : ouvre-le dans Safari'); }
    catch(e){ toast(url); }
  }
  function bindInstall(){
    on('#doInstall', async ()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); try{ await deferredPrompt.userChoice; }catch(e){} deferredPrompt = null; const c = $('#install'); if(c) c.hidden = true; });
    on('#copyLink', copyLink);
  }
  /* ---------- écran d'installation : montré une fois, impossible à rater ---------- */
  function needInstallScreen(){ return !standalone() && !window.CU_DATA && !Store.get('installVu') && !!Store.get('code'); }
  function installScreen(prenom){
    Store.set('installVu', 1);
    layout({page:true, tools:false, top:false});
    head('Charge Utile', 'Installe l’appli');
    const steps = iosOtherBrowser
      ? [`Ouvre ce lien dans <b>Safari</b> (pas Chrome) : c’est le seul navigateur qui sait installer l’appli sur iPhone.`,
         `Dans Safari, touche <b>Partager</b> ${ico('dl','ico sm')} en bas de l’écran.`,
         `Choisis <b>« Sur l’écran d’accueil »</b>, puis <b>Ajouter</b>.`]
      : isIOS
      ? [`Touche <b>Partager</b> ${ico('dl','ico sm')} en bas de l’écran.`,
         `Fais défiler et choisis <b>« Sur l’écran d’accueil »</b>.`,
         `Touche <b>Ajouter</b> : Charge Utile apparaît avec tes autres applis.`]
      : [`Ouvre le menu <b>⋮</b> en haut à droite de ton navigateur.`,
         `Choisis <b>« Installer l’application »</b> (ou « Ajouter à l’écran d’accueil »).`,
         `Valide : Charge Utile apparaît avec tes autres applis.`];
    $('#page').innerHTML = `
      <div class="hero"><h2>${prenom ? 'Salut ' + esc(prenom) : 'Bienvenue'}</h2><p class="tagline">Installe l’appli avant ta première séance</p></div>
      <p class="quote">En salle, le réseau passe mal. Une fois installée, l’appli marche <b>sans connexion</b> : tes séances, les animations et les bips sont enregistrés sur ton téléphone.<small>1 minute, une seule fois</small></p>
      <ol class="steps">${steps.map(t => `<li>${t}</li>`).join('')}</ol>
      ${iosOtherBrowser ? `<button class="ghost" id="copyLink2">Copier le lien pour Safari</button>` : ''}
      ${deferredPrompt ? `<button class="primary" id="doInstall2">${ico('dl')}Installer maintenant</button>` : ''}`;
    stagger($('#page'));
    bar(`<button class="ghost" id="later">Plus tard, je continue ici</button>`);
    on('#later', home);
    on('#copyLink2', copyLink);
    on('#doInstall2', async ()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); try{ await deferredPrompt.userChoice; }catch(e){} deferredPrompt = null; home(); });
  }
  /* ---------- état hors-ligne : l'athlète doit savoir que sa séance est enregistrée ---------- */
  async function offlineBadge(){
    const el = $('#offb'); if(!el) return;
    if(!('serviceWorker' in navigator) || !('caches' in window)){ el.innerHTML = ''; return; }
    try{
      const ready = !!(await navigator.serviceWorker.getRegistration())?.active;
      const keys = await caches.keys();
      const app = keys.find(k => k.startsWith('cu-'));
      const nb = app ? (await (await caches.open(app)).keys()).length : 0;
      const sess = await caches.open('cu-seances').then(c => c.keys()).catch(()=>[]);
      const ok = ready && nb > 10 && sess.length > 0;
      el.innerHTML = ok
        ? `<p class="okline">${ico('check','ico sm')} Prête pour la salle : ta séance marche sans réseau</p>`
        : `<p class="waitline">Enregistrement en cours pour le hors-réseau… garde l’appli ouverte quelques secondes</p>`;
      if(!ok) setTimeout(offlineBadge, 2500);
    }catch(e){ el.innerHTML = ''; }
  }

  /* ================= PRÉSENTATION DE LA SÉANCE ================= */
  function intro(sess){
    clearTimers(); SESS = sess;
    const blocks = buildBlocks(sess);
    S = {screen:'intro', blocks, steps: buildSteps(blocks), i:0, log:[], adj:[], t0:null, pain:[], srpe:null, filmed:{}, done:[], extraRest:0, videos:0};
    layout({page:true, tools:false}); progress();
    head(dayLabel(sess.date), 'Ta séance');
    const render = () => {
      $('#page').innerHTML = `
        <div class="hero"><h2>${esc(sess.titre)}</h2><p class="tagline">RPE visé ${esc(sess.rpe || '—')} · ≈ ${sess.dureeMin || '?'} min</p></div>
        ${sess.message ? `<p class="quote">${esc(sess.message)}<small>${esc(Data.book.coach || 'Nathan')}</small></p>` : ''}
        <ol class="blocks">${S.blocks.map((b,i)=>`<li><i>${i+1}</i><div><b>${esc(b.name)}</b><span>${esc(blockSummary(b))}</span></div></li>`).join('')}</ol>
        <button class="detailbtn" id="detail"><div><b>Voir la séance en détail</b><span>Tous les exos, charges, tempo et récup</span></div>${ico('chev')}</button>`;
      stagger($('#page'));
      bar(`<div class="pair"><button class="ghost" id="back">Retour</button>${goBtn('C’est parti')}</div>`);
      on('#back', home);
      on('#detail', ()=>{ SND.tap(); detailScreen(()=>{ layout({page:true, tools:false}); head(dayLabel(sess.date), 'Ta séance'); render(); }); });
      on('#go', ()=>{ audio(); SND.go(); buzz(20); keepAwake(); S.t0 = Date.now(); run(); });
    };
    render();
  }
  /* ---------- la séance en détail : tout est écrit, pour celui qui veut la faire sans guidage ---------- */
  function itemLine(it, b){
    if(it.kind === 'test') return `<li><b>${esc(it.name)}</b><span>${esc(it.test.mesure || '')} · ${volume(it)}</span><em>${esc((it.test.materiel || []).join(' · '))}</em></li>`;
    const bits = [];
    if(b.type === 'sets' && it.sets > 1) bits.push(`${it.sets} séries`);
    bits.push(volume(it));
    if(loadTxt(it)) bits.push(loadTxt(it)); else if(b.type !== 'cardio' && it.kind !== 'cardio') bits.push('poids du corps');
    if(it.kind === 'cardio' && it.level) bits.push(esc(it.level));
    else if(qKind(it) === 'plyo' && it.intent) bits.push(esc(it.intent));
    else if(it.rpe) bits.push(`RPE ${it.rpe}`);
    const t = it.tempoTxt || it.tempo;
    const extra = [];
    if(t) extra.push(`Tempo ${t.join('-')}`);
    if(b.type === 'sets' && it.rest) extra.push(`Récup ${it.rest >= 60 ? (it.rest/60).toFixed(0).replace('.0','') + ' min' : it.rest + ' s'}`);
    if(it.progression) extra.push(`Niveau ${it.progression.nom.toLowerCase()}`);
    if(it.filmSet) extra.push(`Série ${it.filmSet} à filmer`);
    if(it.pctTxt) extra.push(esc(it.pctTxt));
    if(it.note) extra.push(esc(it.note));
    return `<li><b>${esc(it.name)}</b><span>${bits.join(' · ')}</span>${extra.length ? `<em>${extra.join(' · ')}</em>` : ''}
      ${it.cues && it.cues.length ? `<u>${it.cues.map(c => esc(c)).join(' · ')}</u>` : ''}</li>`;
  }
  function sessionText(){
    const L = [`${SESS.titre} · ${dayLabel(SESS.date)} · RPE ${SESS.rpe || '—'} · ≈ ${SESS.dureeMin || '?'} min`];
    S.blocks.forEach((b, i) => {
      L.push(``, `${i+1}. ${b.name.toUpperCase()} — ${blockSummary(b)}`);
      (b.items || []).forEach(it => {
        if(it.kind === 'test') return L.push(`- ${it.name} : ${volume(it)}`);
        const t = it.tempoTxt || it.tempo;
        L.push(`- ${it.name} : ${[b.type === 'sets' && it.sets > 1 ? it.sets + ' séries' : '', volume(it), loadTxt(it), it.rpe ? 'RPE ' + it.rpe : '',
          t ? 'tempo ' + t.join('-') : '', b.type === 'sets' && it.rest ? 'récup ' + it.rest + ' s' : ''].filter(Boolean).join(' · ')}`);
      });
      if(b.note) L.push(`  (${b.note})`);
    });
    return L.join('\n');
  }
  function detailScreen(back){
    S.screen = 'detail';
    layout({page:true, tools:false});
    head(esc(SESS.titre), 'La séance en détail');
    $('#page').innerHTML = `
      <div class="hero"><h2>${esc(SESS.titre)}</h2><p class="tagline">RPE visé ${esc(SESS.rpe || '—')} · ≈ ${SESS.dureeMin || '?'} min</p></div>
      <p class="quote">Tu connais déjà la séance ? Tu peux la faire sans guidage.<small>Les bips se coupent dans les réglages</small></p>
      ${S.blocks.map((b, i) => `<div class="dblock"><p class="dhead"><i>${i+1}</i>${esc(b.name)}</p>
        <p class="dsum">${esc(blockSummary(b))}</p>
        ${b.note ? `<p class="dnote">${esc(b.note)}</p>` : ''}
        <ol class="dlist">${(b.items || []).map(it => itemLine(it, b)).join('')}</ol></div>`).join('')}
      <div class="minor"><button id="sndD">${ico('sound')}Réglages des sons</button><button id="shareS">${ico('send')}Envoyer la séance</button></div>`;
    stagger($('#page'));
    bar(`<div class="pair"><button class="ghost" id="backD">Retour</button>${goBtn('C’est parti')}</div>`);
    on('#backD', back);
    on('#sndD', ()=>{ SND.tap(); soundSheet(); });
    on('#shareS', async ()=>{ const r = await shareText(sessionText()); if(r !== 'aborted') toast(r === 'shared' ? 'Séance envoyée' : 'Séance copiée'); });
    on('#go', ()=>{ audio(); SND.go(); buzz(20); keepAwake(); S.t0 = Date.now(); run(); });
  }
  function resumeSession(sess, prog){
    SESS = sess; S = prog.S; S.t0 = S.t0 || Date.now(); audio(); keepAwake(); run();
  }

  /* ================= AIGUILLAGE ================= */
  function run(){
    const st = step();
    save();
    if(!st) return done_();
    if(st.t==='intro') return blockIntro();
    if(st.t==='timer') return prep();
    if(st.t==='reps') return prep();
    if(st.t==='rpe') return restScreen(Math.max(st.rest, 45), {round:true});
    if(st.t==='free') return freeScreen();
    if(st.t==='test') return testIntro();
  }
  function next(){
    if(!S.done.includes(S.i)) S.done.push(S.i);
    const st = step();
    S.i++;
    let rest = (st && st.rest ? st.rest : 0) + (S.extraRest || 0);
    if(S.pendingRpe && rest < 30) rest = 30;   // le ressenti se donne toujours pendant une récup, même courte
    S.extraRest = 0;
    save();
    if(!step()) return done_();
    if(rest > 0) return st.restKind==='transition' && !S.pendingRpe ? transition(rest) : restScreen(rest);
    run();
  }

  /* ================= CARTE DE BLOC ================= */
  function blockIntro(){
    clearTimers(); S.screen = 'blockintro';
    const b = blk(); const first = b.items && b.items[0] && b.items[0].anim ? b.items[0] : null;
    layout({stage: !!first, panel:true}); progress();
    if(first) Stage.setExo(first);
    head(`Bloc ${step().bi+1}/${S.blocks.length}`, b.name);
    $('#panel').innerHTML = `
      <p class="bsum">${esc(blockSummary(b))}</p>
      ${b.items && b.items.length ? `<ul class="list tight">${b.items.map(it=>`<li><span>${esc(it.name)}</span><span>${it.sets > 1 ? it.sets+' × ' : ''}${volume(it)}${loadTxt(it) ? ' · '+esc(loadTxt(it)) : ''}</span></li>`).join('')}</ul>` : `<p class="cue">${esc(b.note || '')}</p>`}`;
    stagger($('#panel'));
    bar(goBtn(S.i === 0 && !SESS.recup && b.type === 'cardio' ? 'Démarrer l’échauffement' : 'C’est parti'));
    on('#go', ()=>{ SND.go(); buzz(20); if(!S.done.includes(S.i)) S.done.push(S.i); S.i++; run(); });
  }

  /* ================= PRÉPARATION D'UN EXERCICE ================= */
  function presc(it){
    const c1 = it.dur
      ? `<div><b id="v1">${it.dur >= 60 ? Math.round(it.dur/60) : it.dur}</b><span>${it.dur >= 60 ? 'minutes' : 'secondes'}${it.perSide ? ' / côté' : ''}</span></div>`
      : `<div><b id="v1">${it.reps}</b><span>${it.alt ? 'reps alternées' : it.perSide ? 'reps / côté' : 'reps'}${it.repsTodo ? ' <em class="todo">à confirmer</em>' : ''}</span></div>`;
    const c2 = typeof it.load === 'number' ? `<div><b id="loadN">${kg(it.load)}</b><span>kg</span></div>`
      : it.load ? `<div><b class="sm">${esc(it.load)}</b><span>charge</span></div>` : `<div><b class="sm">Poids du corps</b><span>charge</span></div>`;
    const k = qKind(it);
    let c3;
    if(it.kind==='cardio') c3 = `<div><b class="word">${esc(it.level || 'Facile')}</b><span>intensité</span></div>`;
    else if(k==='plyo') c3 = `<div><b class="word">${esc(it.intent || 'Explosif')}</b><span>intention</span><small>qualité avant tout</small></div>`;
    else if(k==='effort') c3 = `<div><b>${it.rpe || 9}</b><span>RPE visé</span><small>${esc(it.intent || 'à fond')}</small></div>`;
    else if(it.rpe && k==='reps') c3 = `<div><b>${it.rpe}</b><span>RPE visé</span><small>${10-it.rpe} rep${10-it.rpe>1?'s':''} en réserve</small></div>`;
    else if(it.rpe) c3 = `<div><b>${it.rpe}</b><span>RPE visé</span></div>`;
    else c3 = `<div><b class="word">${esc((SESS.rpe||'').replace(' à ','-') || '—')}</b><span>RPE de la séance</span></div>`;
    return `<div class="presc${it.kind==='cardio'?' two':''}">${c1}${it.kind==='cardio' ? '' : c2}${c3}</div>`;
  }
  function cueRotate(it, sel='#cue'){
    if(!it.cues || it.cues.length < 2) return;
    let ci = 0;
    cueTimer = setInterval(()=>{ const c = $(sel); if(!c) return; c.classList.add('out'); setTimeout(()=>{ ci = (ci+1)%it.cues.length; c.textContent = it.cues[ci]; c.classList.remove('out'); }, 280); }, 5000);
  }
  function tools(it){
    return `<div class="minor"><a class="mbtn" href="${esc(videoLink(it))}" target="_blank" rel="noopener">${ico('eye')}Voir en vrai</a>${it.alts && it.alts.length ? `<button id="swapB">${ico('swap')}Remplacer</button>` : ''}<button id="painB">${ico('pain')}Douleur</button></div>`;
  }
  function tempoLine(it){
    const t = it.tempoTxt || it.tempo; if(!t) return '';
    const w = [`${t[0]} s descente`, +t[1] ? `${t[1]} s pause` : '', t[2]==='X' ? 'montée explosive' : `${t[2]} s montée`, +t[3] ? `${t[3]} s en haut` : ''].filter(Boolean).join(' · ');
    return `<p class="last">Tempo ${t.join('-')} : ${w}</p>`;
  }
  function prep(){
    clearTimers(); const st = step(), it = item(st), b = blk(st);
    // enchaînement direct : série suivante du même exo, ou exo de circuit après la transition
    const same = S.lastItem === it && S.screen === 'rest-go';
    const filmDue = !!it.filmSet && it.filmSet === st.set && !S.filmed[S.i];
    S.screen = 'prep'; S.lastItem = it;
    if((st.auto || same) && !filmDue) return live();
    layout({stage:true, panel:true}); progress();
    Stage.setExo(it);
    head(kicker(st), it.name);
    const filmNow = !!it.filmSet && it.filmSet === st.set && !S.filmed[S.i];
    $('#panel').innerHTML = `
      ${filmNow ? `<div class="flag">${ico('cam')}Nathan veut voir cette série en vidéo</div>` : ''}
      ${presc(it)}
      <p class="cue" id="cue">${esc(it.cues[0] || '')}</p>
      ${it.note ? `<p class="last">${esc(it.note)}</p>` : it.replaced ? `<p class="last">Remplace « ${esc(it.replaced)} »</p>` : tempoLine(it)}
      ${it.pctTxt ? `<p class="last">${esc(it.pctTxt)}</p>` : ''}
      <p class="breathline">${esc(breathCue(it))}</p>
      ${it.progression ? `<p class="lvline">Niveau ${it.progression.niveau}/4 · ${esc(it.progression.nom)}</p>` : ''}`;
    stagger($('#panel'));
    countUp($('#v1'), it.dur ? (it.dur >= 60 ? Math.round(it.dur/60) : it.dur) : it.reps);
    if(typeof it.load === 'number') countUp($('#loadN'), it.load);
    cueRotate(it);
    const label = it.dur ? (it.kind==='cardio' ? `Démarrer · ${volume(it)}` : `C’est parti · ${volume(it)}`) : 'C’est parti';
    bar(tools(it) + (filmNow
      ? `<div class="pair"><button class="ghost" id="nofilm">Sans vidéo</button><button class="primary" id="main">${ico('cam')}Filmer</button></div>`
      : `<button class="primary" id="main">${ico('play')}${label}</button>`));
    on('#main', ()=>{ audio(); buzz(15); filmNow ? film() : live(); });
    on('#nofilm', ()=>{ S.filmed[S.i] = 'skip'; live(); });
    on('#swapB', swapSheet); on('#painB', painSheet);
  }

  /* ================= PENDANT LA SÉRIE (plein écran) ================= */
  const MOTIV = (left, total) => left <= 3 ? 'Dernières secondes !' : left <= 5 ? 'Tu y es presque !' : left <= 10 ? `Plus que ${Math.ceil(left)} s` :
    left <= total*.5 ? 'Mi-parcours, lâche rien' : left <= total*.8 ? 'Respire, ça tient' : 'C’est parti !';
  const MOTIV_CARDIO = (left, total) => left <= 10 ? 'Presque fini' : left <= 60 ? 'Dernière minute' : left <= total*.5 ? 'Tranquille, régulier' : 'Monte en température';
  function live(opts={}){
    clearTimers(); const st = step(), it = item(st), b = blk(st);
    S.screen = 'live';
    layout({stage:true, panel:true, live:true}); progress();
    Stage.setExo(it);
    head(kicker(st), it.name);
    const circuit = b.type === 'circuit';
    if(it.dur) return timedLive(it, st, b, opts);
    const half = it.alt;
    const unit = it.alt ? 'alternées' : it.perSide ? 'par côté' : 'reps';
    Stage.startGuide({target: it.reps, unit, load: loadTxt(it), half, leadIn: opts.leadIn ?? 3, twoSides: it.perSide && !it.alt, breath: breathCue(it),
      label: it.intent || (it.alt ? 'En alternant' : 'À ton rythme'),
      onTap: ()=>finishSet(), onReached: ()=>{ const m = $('#main'); if(m){ m.classList.add('urgent'); } }});
    $('#panel').innerHTML = `<p class="cue big" id="cue">${esc(it.cues[0] || '')}</p>`;
    cueRotate(it);
    bar(`<div class="pair"><button class="ghost" id="restart">Relancer</button><button class="primary" id="main">${ico('check')}${circuit ? 'Fait' : 'Série faite'}</button></div>`);
    on('#main', ()=>finishSet());
    on('#restart', ()=>{ Stage.reached(); live({leadIn:3}); });
    function finishSet(){
      if(S.screen !== 'live') return;
      S.screen = 'x'; SND.tap(); buzz(15); Stage.stopGuide(); Stage.reached();
      if(opts.onDone) return opts.onDone();
      if(circuit){ S.log.push({i:S.i, name:it.name, round:st.round}); return next(); }
      afterSet(it, st, {});
    }
  }
  function timedLive(it, st, b, opts){
    const cardio = it.kind === 'cardio', circuit = b.type === 'circuit';
    const total = it.dur;
    Stage.startGuide({target: null, unit: 'secondes', load: loadTxt(it), leadIn: 0, label: it.intent || it.level || holdLabel(it), breath: breathCue(it)});
    $('#hud').classList.add('timed');
    $('#panel').innerHTML = `${ring(cardio ? 'cardio' : 'effort', 3, 'prêt ?')}<p class="motiv" id="motiv">Mets-toi en place</p><p class="cue" id="cue">${esc(it.cues[0] || '')}</p>`;
    cueRotate(it);
    bar(cardio ? `<div class="pair"><button class="ghost" id="stopB">Passer</button><button class="ghost" id="pauseB">Pause</button></div>` : `<button class="ghost" id="stopB">J’ai lâché</button>`);
    let phase = 'in', countIn = 3, end = Date.now() + countIn*1000/SPEED, lastSec = -1, lastMsg = '', paused = false, pauseLeft = 0, side = 1;
    const sides = it.perSide ? 2 : 1;
    const begin = () => { phase = 'go'; end = Date.now() + total*1000/SPEED; $('#tsub').textContent = sides > 1 ? (side === 1 ? '1er côté' : '2e côté') : cardio ? 'restant' : 'tiens'; SND.go(); buzz(60); pop($('#tv')); };
    tick = setInterval(()=>{
      if(paused) return;
      if(phase==='in' && end - Date.now() <= 0){ begin(); lastSec = -1; }
      const left = Math.max(0, (end - Date.now())*SPEED/1000);
      setRing(left, phase==='in' ? countIn : total);
      const sec = Math.ceil(left);
      if(sec !== lastSec){
        lastSec = sec;
        if(phase==='in'){ if(sec>0){ SND.count(); pop($('#tv'),'tick'); } }
        else {
          if(sec<=5 && sec>0){ SND.count(); pop($('#tv'),'tick'); }   // rien pendant l'exo, le décompte seulement à la fin
          const m = (cardio ? MOTIV_CARDIO : MOTIV)(left, total);
          if(m !== lastMsg){ lastMsg = m; const mv = $('#motiv'); if(mv){ mv.textContent = m; pop(mv); } }
        }
      }
      if(left <= 0){
        if(phase==='in'){ begin(); return; }
        if(side < sides){ side++; phase = 'in'; countIn = 5; end = Date.now() + countIn*1000/SPEED; lastSec = -1; SND.end(); buzz([80,60,80]);
          const mv = $('#motiv'); if(mv){ mv.textContent = 'Change de côté'; pop(mv); } const ts = $('#tsub'); if(ts) ts.textContent = 'change de côté'; return; }
        clearTimers(); SND.end(); buzz([120,60,120]);
        const mv = $('#motiv'); if(mv){ mv.textContent = cardio ? 'Terminé' : 'Bravo !'; pop(mv); }
        setTimeout(()=> afterTimed(total, false), 450);
      }
    }, 100);
    on('#stopB', ()=>{ const held = phase==='go' ? Math.round(total - Math.max(0,(end-Date.now())*SPEED/1000)) : 0; clearTimers(); afterTimed(held, !cardio); });
    on('#pauseB', ()=>{ paused = !paused; const pb = $('#pauseB');
      if(paused){ pauseLeft = end - Date.now(); pb.textContent = 'Reprendre'; } else { end = Date.now() + pauseLeft; pb.textContent = 'Pause'; } });
    function afterTimed(held, partial){
      Stage.stopGuide();
      if(cardio || circuit){ S.log.push({i:S.i, name:it.name, held, partial, round:st.round}); return next(); }
      afterSet(it, st, {held, partial});
    }
  }
  function afterSet(it, st, res){
    S.pendingRpe = {i:S.i, it, st, res, answered:false};
    S.log.push({i:S.i, name:it.name, set:st.set, sets:it.sets, load:it.load, reps:it.reps, dur:it.dur, ...res, kind:qKind(it)});
    next();
  }

  /* ================= VIDÉO ================= */
  async function film(){
    const st = step(), it = item(st);
    if(!Rec.supported) return filmFallback(it);
    try{ await Rec.open(); }catch(e){ return filmFallback(it); }
    S.screen = 'film';
    layout({stage:true, panel:true, live:true});
    $('#stage').classList.add('camon');
    head(`Vidéo · série ${st.set}`, it.name);
    $('#panel').innerHTML = `<p class="cue">Pose ton téléphone à 2-3 m, de profil</p><p class="last">Tout ton corps dans le cadre. Tu as 8 s pour te placer après avoir lancé.</p>`;
    bar(`<div class="pair"><button class="ghost" id="cancelFilm">Annuler</button><button class="primary" id="rec">${ico('cam')}Lancer</button></div>`);
    on('#cancelFilm', ()=>{ Rec.close(); $('#stage').classList.remove('camon'); S.screen = 'x'; prep(); });
    on('#rec', ()=>{
      Rec.start(); $('#stage').classList.add('recording');
      live({leadIn: 8, onDone: async ()=>{
        const file = await Rec.stop(`${it.name.replace(/\W+/g,'-').toLowerCase()}-serie${st.set}`);
        Rec.close(); $('#stage').classList.remove('camon','recording');
        S.filmed[S.i] = 'done'; S.video = file;
        afterSet(it, st, {video:true});
      }});
    });
  }
  function filmFallback(it){
    const inp = $('#camfile');
    inp.value = '';
    inp.onchange = () => { const f = inp.files && inp.files[0]; const st = step(); if(!f){ return; } S.filmed[S.i] = 'done'; S.video = f; afterSet(it, st, {video:true}); };
    inp.click();
    toast('Filme ta série, puis valide la vidéo');
  }

  /* ================= TRANSITION DE CIRCUIT ================= */
  function transition(sec){
    clearTimers(); S.screen = 'transition';
    const st = step(), it = item(st), b = blk(st);
    layout({stage:true, panel:true}); progress();
    Stage.setExo(it);
    head('Enchaîne', it.name);
    const end = Date.now() + sec*1000/SPEED;
    $('#panel').innerHTML = `
      ${ring('small trans', sec, 'transition')}
      <div class="next"><div><small>Exo ${st.ii+1}/${b.items.length}${b.rounds > 1 ? ' · tour ' + st.round : ''}</small><b>${esc(it.name)}</b></div><span>${volume(it)}${loadTxt(it) ? '<br>'+esc(loadTxt(it)) : ''}</span></div>`;
    stagger($('#panel'));
    bar(goBtn('Je suis en place', 'ready'));
    let lastSec = -1;
    tick = setInterval(()=>{
      const left = Math.max(0,(end-Date.now())*SPEED/1000);
      setRing(left, sec);
      const s = Math.ceil(left); if(s !== lastSec){ lastSec = s; if(s<=5 && s>0){ SND.count(); pop($('#tv'),'tick'); } }
      if(left<=0){ clearTimers(); go(); }
    }, 100);
    const go = (lead=0) => { clearTimers(); S.screen = 'x'; live({leadIn: lead}); };
    on('#ready', ()=>{ buzz(20); go(3); });
  }

  /* ================= RÉCUPÉRATION + RESSENTI ================= */
  const C = 2*Math.PI*84;
  function ring(kind, val, sub){
    return `<div class="timer ${kind}"><svg viewBox="0 0 188 188"><circle class="bgc" cx="94" cy="94" r="84"/><circle class="fgc" id="fg" cx="94" cy="94" r="84" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg>
      <div class="val"><b id="tv">${mmss(val)}</b><small id="tsub">${sub}</small></div></div>`;
  }
  function setRing(left, total){ const fg = $('#fg'), tv = $('#tv'); if(!fg) return; fg.style.strokeDashoffset = C*(1 - Math.max(0,Math.min(1,left/total))); tv.textContent = mmss(left); }
  function rpeCard(kind, ref){
    const Qd = RPEQ[kind];
    return `<div class="rpecard" id="rpeCard"><p class="rq">${Qd.q}</p><p class="rsub">${esc(Qd.sub(ref))}</p>
      <div class="rpe5 c${Qd.opts.length}${Qd.num ? '' : ' words'}">${Qd.opts.map(([n,l])=>`<button data-n="${n}" class="${ref && n===ref.rpe ? 'target' : ''}">${Qd.num ? `<b>${n}</b>` : ''}<span>${l}</span></button>`).join('')}</div>
      ${kind==='reps' ? `<button class="textlink" id="short">Je n’ai pas fait toutes les reps</button>` : ''}</div>`;
  }
  function restScreen(total, o={}){
    clearTimers(); S.screen = 'rest';
    const st = step();
    const pend = o.round ? null : S.pendingRpe;
    const roundSt = o.round ? st : null;
    // après un tour de circuit, on passe à l'étape suivante pendant la récup
    if(o.round){ if(!S.done.includes(S.i)) S.done.push(S.i); S.i++; }
    const nst = step();
    const nb = nst ? blk(nst) : null, nit = nst ? item(nst) : null;
    layout({stage: !!(nit && nit.anim), panel:true}); progress();
    if(nit && nit.anim) Stage.setExo(nit);
    const newThing = !nst ? 'Fin de séance' : nst.t==='intro' ? nb.name : nit ? nit.name : nb.name;
    head('Récupération', nst && nst.t==='intro' ? `Ensuite : ${newThing}` : newThing);
    let rt = total, end = Date.now() + total*1000/SPEED;
    const nextHtml = () => {
      if(!nst) return '';
      const lab = nst.t==='intro' ? `<small>Bloc suivant</small><b>${esc(newThing)}</b>` :
        nb.type==='circuit' ? `<small>Tour ${nst.round}/${nb.rounds}</small><b>${esc(nit.name)}</b>` :
        nit ? `<small>${nst.set===1 ? 'Nouvel exo' : 'Ensuite'}</small><b>${nst.set===1 ? esc(nit.name) : `Série ${nst.set} sur ${nit.sets}`}</b>` : `<b>${esc(newThing)}</b>`;
      const vol = nit && nst.t !== 'intro' ? `${volume(nit)}${loadTxt(nit) ? '<br><span id="nextLoad">'+esc(loadTxt(nit))+'</span>' : ''}` : '';
      return `<div class="next"><div>${lab}</div><span>${vol}</span></div>`;
    };
    const askKind = pend ? qKind(pend.it) : o.round ? 'round' : null;
    $('#panel').innerHTML = `
      ${ring('small', total, 'récup')}
      <div id="fbZone">${askKind ? rpeCard(askKind, pend ? pend.it : null) : ''}</div>
      ${S.video ? `<button class="sendvid" id="sendVid">${ico('send')}Envoyer la vidéo à Nathan</button>` : ''}
      <div id="nextZone">${nextHtml()}</div>`;
    stagger($('#panel'));
    const answer = v => {
      if(S.screen !== 'rest' || !$('#fbZone')) { if(pend && !pend.answered){ pend.answered = true; adjust(pend, v); S.pendingRpe = null; } return; }
      if(pend){ pend.answered = true; const fb = adjust(pend, v); S.pendingRpe = null; showFb(fb); }
      else { S.log.push({round:roundSt.round, bi:roundSt.bi, rpe:v}); const b = S.blocks[roundSt.bi];
        showFb(roundSt.round < b.rounds ? {c:'ok', t:`Tour ${roundSt.round} bouclé`, s:`Ressenti ${v}/10 · encore ${b.rounds - roundSt.round}`} : {c:'ok', t:`${b.name} bouclé`, s:'Belle série de tours'}); }
      $('#nextZone').innerHTML = nextHtml();
      save();
    };
    const showFb = fb => { const z = $('#fbZone'); z.innerHTML = `<div class="fb ${fb.c}"><b>${esc(fb.t)}</b><span>${esc(fb.s)}</span></div>`; pop(z.firstChild); if(fb.extra){ end += fb.extra*1000/SPEED; } };
    $$('#rpeCard .rpe5 button').forEach(b => b.onclick = ()=>{ pop(b); SND.tap(); buzz(12); setTimeout(()=>answer(+b.dataset.n), 120); });
    on('#short', ()=>shortSheet(pend, n=>{ pend.res.partial = true; pend.res.done = n; answer(10); }));
    on('#sendVid', async ()=>{ const f = S.video; const r = await shareFile(f, `${SESS.titre} · ${pend ? pend.it.name : ''}`); if(r !== 'aborted'){ S.videos++; S.video = null; const btn = $('#sendVid'); if(btn){ btn.outerHTML = `<p class="last okc">${r==='downloaded' ? 'Vidéo enregistrée : envoie-la à Nathan sur WhatsApp' : 'Vidéo envoyée'}</p>`; } } });
    const readyLabel = !nst ? 'Terminer' : (nst.t==='intro' || (nit && (nst.set===1 || nb.type==='circuit'))) ? 'C’est parti' : 'C’est reparti';
    bar(`<div class="pair"><button class="ghost" id="plus">+30 s</button>${goBtn(readyLabel, 'ready')}</div>`);
    let lastSec = -1;
    const leave = () => { clearTimers(); if(S.pendingRpe && !S.pendingRpe.answered){ S.pendingRpe = null; } const same = nit && nst.t !== 'intro' && nst.set > 1; S.screen = same ? 'rest-go' : 'x'; if(!step()) return done_(); run(); };
    tick = setInterval(()=>{
      const left = Math.max(0, (end - Date.now())*SPEED/1000);
      if(left > rt) rt = left;
      setRing(left, rt);
      const sec = Math.ceil(left);
      if(sec !== lastSec){
        lastSec = sec;
        if(sec === 10){ const ts = $('#tsub'); if(ts){ ts.textContent = 'prépare-toi'; pop(ts); } const r = $('#ready'); if(r) r.classList.add('urgent'); buzz(40); }
        if(sec<=5 && sec>0){ SND.count(); pop($('#tv'),'tick'); }
      }
      if(left <= 0){ SND.go(); buzz([150,80,150]); leave(); }
    }, 100);
    on('#plus', ()=>{ end += 30000/SPEED; const ts = $('#tsub'); if(ts) ts.textContent = 'récup'; const r = $('#ready'); if(r) r.classList.remove('urgent'); pop($('#tv')); });
    on('#ready', ()=>{ SND.tap(); buzz(25); leave(); });
  }
  /** ajustements automatiques après la réponse de l'athlète */
  function adjust(pend, v){
    const {it, st, res} = pend;
    const more = st.set < it.sets;
    const log = S.log.find(l => l.i === pend.i); if(log){ log.rpe = v; Object.assign(log, res); }
    const k = qKind(it);
    if(k==='level'){
      const pr = it.progression, grp = Data.list.filter(x => x.progression && x.progression.groupe === pr.groupe && x.valide !== false);
      const want = v <= 5 ? pr.niveau + 1 : v >= 10 ? pr.niveau - 1 : pr.niveau;
      const nx = grp.find(x => x.progression.niveau === want);
      if(!more) return {c: v >= 10 ? 'down' : 'ok', t: v <= 5 ? 'Trop facile' : v >= 10 ? 'Équilibre difficile' : 'Exo bouclé', s: 'Noté pour Nathan'};
      if(nx && want !== pr.niveau){
        const bl = S.blocks[st.bi], n = buildItem({...it.src, ex: nx.id, nom: undefined, consignes: undefined});
        bl.items[st.ii] = n; S.adj.push(`${it.name} → ${n.name} (niveau ${want})`);
        return {c: want > pr.niveau ? 'up' : 'down', t: want > pr.niveau ? 'On monte d’un niveau' : 'On redescend d’un niveau', s: `Prochaine série : ${n.progression.nom.toLowerCase()} · ${n.name}`};
      }
      return {c:'ok', t: v <= 5 ? 'Déjà au niveau max' : v >= 10 ? 'Déjà au niveau le plus facile' : 'Dans la cible', s:'Même exercice sur la prochaine'};
    }
    if(k==='reps'){
      const target = it.rpe || 8, diff = v - target, num = typeof it.load==='number' && it.step;
      const bump = dir => {
        if(!more) return dir>0 ? 'Noté : Nathan montera la prochaine fois' : 'Noté : Nathan ajustera la prochaine fois';
        if(!num) return dir>0 ? 'Prochaine série : ralentis la descente' : 'Prochaine série : amplitude un peu réduite';
        const from = it.load; it.load = Math.max(0, it.load + dir*it.step); S.adj.push(`${it.name} : ${kg(from)} → ${kg(it.load)} kg`); return `Prochaine série : ${kg(it.load)} kg`;
      };
      if(res.partial) return {c:'down', t:'Série incomplète', s:bump(-1)};
      if(diff <= -2) return {c:'up', t:'Trop facile', s:bump(1)};
      if(diff >= 2 || v >= 10) return {c:'down', t:'Trop dur', s:bump(-1)};
      return {c:'ok', t: more ? 'Dans la cible' : 'Exo bouclé', s: more ? (num ? `On garde ${kg(it.load)} kg` : 'Même consigne') : 'Propre. On passe à la suite.'};
    }
    if(k==='plyo'){
      if(v >= 9 && more){ S.adj.push(`${it.name} : +30 s de récup`); return {c:'down', t:'Sauts moins vifs', s:'+30 s de récup pour retrouver ton explosivité', extra:30}; }
      if(v >= 9) return {c:'down', t:'Sauts moins vifs', s:'Noté pour Nathan'};
      return {c:'ok', t: v===7 ? 'Explosif, parfait' : 'Ça tient', s: more ? 'Même consigne sur la prochaine' : 'Exo bouclé'};
    }
    if(k==='effort'){
      if(res.partial) return {c:'down', t:'Série écourtée', s:'Récupère bien, repars à fond'};
      if(v < (it.rpe || 9) - 1) return {c:'up', t:'Tu peux pousser plus', s: more ? 'La prochaine : vraiment à fond' : 'Noté pour Nathan'};
      return {c:'ok', t:'Dans l’intensité', s: more ? 'Garde ce niveau' : 'Exo bouclé'};
    }
    // tenue
    if(res.partial) return {c:'down', t:'Tenue écourtée', s:'On garde la même durée'};
    if(v <= 6 && more){ it.dur += 5; S.adj.push(`${it.name} : ${it.dur-5} → ${it.dur} s`); return {c:'up', t:'Trop facile', s:`Prochaine série : ${it.dur} s`}; }
    if(v >= 10 && more){ const f = it.dur; it.dur = Math.max(10, it.dur-5); S.adj.push(`${it.name} : ${f} → ${it.dur} s`); return {c:'down', t:'Trop dur', s:`Prochaine série : ${it.dur} s`}; }
    return {c:'ok', t:'Dans la cible', s: more ? 'Même durée' : 'Exo bouclé'};
  }

  /* ================= BLOC LIBRE ================= */
  function freeScreen(){
    clearTimers(); const b = blk(); S.screen = 'free';
    layout({panel:true}); progress();
    head(`Bloc ${step().bi+1}/${S.blocks.length}`, b.name);
    const t0 = Date.now();
    $('#panel').innerHTML = `
      <div class="timer free"><svg viewBox="0 0 188 188"><circle class="bgc" cx="94" cy="94" r="84"/><circle class="fgc" id="fg" cx="94" cy="94" r="84" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
        <div class="val"><b id="tv">0:00</b><small id="tsub">objectif ${b.min}-${b.max} min</small></div></div>
      <p class="cue">${esc(b.note || '')}</p>`;
    stagger($('#panel'));
    bar(`<button class="primary" id="main">${ico('check')}Terminé</button>`);
    let lastMin = -1;
    tick = setInterval(()=>{
      const s = (Date.now()-t0)*SPEED/1000;
      $('#tv').textContent = `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
      $('#fg').style.strokeDashoffset = C*(1 - Math.min(1, s/(b.max*60)));
      const m = Math.floor(s/60);
      if(m !== lastMin){ lastMin = m; if(m === b.min){ SND.end(); buzz(80); const ts = $('#tsub'); ts.textContent = 'objectif atteint'; pop(ts); } }
    }, 250);
    on('#main', ()=>{ S.log.push({i:S.i, free: Math.round((Date.now()-t0)*SPEED/1000)}); clearTimers(); next(); });
  }


  /* ================= RÉCUP & MOBILITÉ ================= */
  const RZONES = [['cou','Cou'],['epaules','Épaules'],['haut-du-dos','Haut du dos'],['bas-du-dos','Bas du dos'],['hanches','Hanches'],['fessiers','Fessiers'],['adducteurs','Adducteurs'],['quadriceps','Quadriceps'],['ischios','Ischios'],['genoux','Genoux'],['mollets','Mollets'],['chevilles','Chevilles']];
  const ZNAME = Object.fromEntries(RZONES);
  function seeded(seed){ let h = 2166136261; for(const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }
  const isAlt = x => /altern/i.test([x.nom, ...(x.consignes||[])].join(' '));
  function exDur(x){
    const m = Rig.META[x.anim] || {};
    const sides = x.unilateral && !isAlt(x) ? 2 : 1;
    if(x.type === 'hold' || !x.repsConseillees) return (x.dureeConseillee || 30) * sides + 8;
    return Math.round((x.repsConseillees || 8) * (m.cycle || 3) * (isAlt(x) ? .5 : 1) * sides) + 8;
  }
  /** construit une routine de récup selon le temps, le sport du jour, les douleurs et les points faibles donnés par Nathan */
  function genRoutine(o){
    const today = new Date().toISOString().slice(0,10);
    const rnd = seeded(today + o.kind + o.sport + o.minutes + (o.round || 0));
    const excl = new Set(o.exclude || []);
    const famOk = x => o.kind === 'mobilite' ? (x.famille === 'mobilite' || (x.famille === 'mollet-cheville' && (x.tags||[]).includes('mobilite'))) : x.famille === 'etirement';
    const pool = Data.list.filter(x => x.valide !== false && famOk(x) && !/^respiration-/.test(x.id) && Rig.META[x.anim]
      && !(x.zones||[]).some(z => o.pain.includes(z)));

    const sportTag = {velo:'velo', trail:'trail'}[o.sport];
    const scored = pool.map(x => {
      const t = x.tags || [], z = x.zones || [];
      let sc = rnd() * 2 - (excl.has(x.id) ? 5 : 0);   // « autres exercices » : ceux déjà proposés passent en dernier
      if(sportTag && t.includes(sportTag)) sc += 3;
      if(o.sport === 'muscu' && (z.includes('hanches') || z.includes('bas-du-dos') || z.includes('ischios'))) sc += 1.5;
      if(z.some(q => o.focus.includes(q))) sc += 3;
      if(o.kind === 'mobilite' && t.includes('avant-effort')) sc += 1;
      if(o.kind === 'etirement' && t.includes('recuperation')) sc += 1;
      return {x, sc};
    }).sort((a,b) => b.sc - a.sc);
    const budget = o.minutes * 60, perZone = {}, out = []; let used = 0;
    for(const {x} of scored){
      const d = exDur(x); if(used + d > budget + 20) continue;
      const z0 = (x.zones||[])[0] || 'autre'; if((perZone[z0]||0) >= 2) continue;
      perZone[z0] = (perZone[z0]||0) + 1; out.push(x); used += d;
      if(used >= budget - 15) break;
    }
    const ty = x => { const f = (Rig.META[x.anim]||{}).frame; const fr = typeof f === 'function' ? f({}) : f; return fr ? fr.ty : .9; };
    out.sort((a,b) => ty(b) - ty(a));   // debout d'abord, au sol ensuite
    const items = out.map(x => x.type === 'hold' || !x.repsConseillees
      ? {ex:x.id, duree:x.dureeConseillee || 30, parCote: !!x.unilateral && !isAlt(x)}
      : {ex:x.id, reps:x.repsConseillees, parCote: !!x.unilateral && !isAlt(x), alterne: isAlt(x)});
    const label = o.kind === 'mobilite' ? 'Mobilité' : 'Étirements';
    return {id:`recup-${today}-${o.kind}-${Date.now()%100000}`, date:today, titre:`${label} ${o.minutes} min`, rpe:'—', dureeMin: Math.round(used/60), recup:true,
      message: o.kind === 'mobilite' ? 'Amplitude sans forcer, respiration calme.' : 'Étirements doux : jamais de douleur, respire lentement.',
      blocs:[{nom: label, type:'circuit', tours:1, recupExo:8, recupTour:0, noRpe:true, items}]};
  }
  function recupHome(pre={}){
    clearTimers(); S = null; SESS = null;
    layout({page:true, tools:false, top:false}); progress();
    head('Charge Utile', 'Récup & mobilité');
    const st = Object.assign({kind:'etirement', minutes:10, sport:'repos', pain:[]}, Store.get('recupPrefs', {}), pre);
    const focus = (Data.book && Data.book.focus) || [];
    const chip = (grp, val, lab, on) => `<button data-g="${grp}" data-v="${val}" class="${on ? 'on' : ''}">${lab}</button>`;
    const render = () => {
      $('#page').innerHTML = `
        <div class="hero"><h2>Récup</h2><p class="tagline">Une routine faite pour toi, maintenant</p></div>
        <div class="rgroup"><p class="lbl">Tu veux faire quoi ?</p><div class="kbtn three">
          ${chip('kind','mobilite','Mobilité', st.kind==='mobilite')}${chip('kind','etirement','Étirements', st.kind==='etirement')}${chip('kind','respiration','Respiration', st.kind==='respiration')}</div>
          <p class="kadv">${st.kind==='mobilite' ? 'Le matin ou avant une séance : on bouge les articulations.' : st.kind==='etirement' ? 'Le soir ou après l’effort : on relâche.' : 'Pour te calmer, mieux dormir ou te concentrer.'}</p></div>
        ${st.kind === 'respiration' ? breathChooser() : `
        <div class="rgroup"><p class="lbl">Combien de temps ?</p><div class="kbtn four">${[5,10,15,20].map(m => chip('minutes', m, m + ' min', st.minutes===m)).join('')}</div></div>
        <div class="rgroup"><p class="lbl">Ta journée</p><div class="kbtn four">${[['velo','Vélo'],['trail','Trail'],['muscu','Muscu'],['repos','Repos']].map(([v,l]) => chip('sport', v, l, st.sport===v)).join('')}</div></div>
        <div class="rgroup"><p class="lbl">Tu as mal quelque part ? <em>on évite la zone</em></p><div class="chips">${RZONES.map(([v,l]) => chip('pain', v, l, st.pain.includes(v))).join('')}</div></div>
        ${focus.length ? `<p class="quote">Nathan a ciblé : ${focus.map(z => esc(ZNAME[z] || z)).join(', ')}<small>La routine insiste dessus</small></p>` : ''}`}`;
      stagger($('#page'));
      bar(st.kind === 'respiration' ? '' : `<div class="pair"><button class="ghost" id="back">Retour</button>${goBtn('Créer ma routine')}</div>`);
      $$('#page [data-g]').forEach(b => b.onclick = () => {
        SND.tap(); const g = b.dataset.g, v = b.dataset.v;
        if(g === 'pain'){ st.pain = st.pain.includes(v) ? st.pain.filter(x => x !== v) : st.pain.concat(v); }
        else st[g] = g === 'minutes' ? +v : v;
        Store.set('recupPrefs', {kind:st.kind, minutes:st.minutes, sport:st.sport});
        render();
      });
      on('#back', home);
      on('#go', () => {
        st.round = 0; st.exclude = [];
        const sess = genRoutine({...st, focus});
        if(!sess.blocs[0].items.length){ toast('Aucun exercice possible avec ces zones, enlève-en une'); return; }
        routinePreview(sess, st);
      });
      bindBreath();
    };
    render();
  }
  function routinePreview(sess, st){
    const blocks = buildBlocks(sess);
    layout({page:true, tools:false, top:false});
    head('Récup', sess.titre);
    $('#page').innerHTML = `
      <div class="hero"><h2>${esc(sess.titre)}</h2><p class="tagline">${blocks[0].items.length} exercices · ≈ ${sess.dureeMin} min</p></div>
      <ul class="list tight">${blocks[0].items.map(it => `<li><span>${esc(it.name)}</span><span>${volume(it)}</span></li>`).join('')}</ul>
      <button class="textlink" id="reroll">Proposer d’autres exercices</button>`;
    stagger($('#page'));
    bar(`<div class="pair"><button class="ghost" id="back">Retour</button>${goBtn('C’est parti')}</div>`);
    on('#back', () => recupHome(st));
    on('#reroll', () => { st.round = (st.round || 0) + 1; st.exclude = blocks[0].items.map(i => i.id);
      routinePreview(genRoutine({...st, focus:(Data.book && Data.book.focus) || []}), st); });
    on('#go', () => { SESS = sess; S = {screen:'intro', blocks, steps: buildSteps(blocks), i:0, log:[], adj:[], t0:Date.now(), pain:[], srpe:null, filmed:{}, done:[], extraRest:0, videos:0};
      audio(); SND.go(); keepAwake(); run(); });
  }

  /* ---------- respiration guidée ---------- */
  const BREATH = [
    {id:'coherence', nom:'Cohérence cardiaque', phases:[['Inspire', 5, 'in'], ['Expire', 5, 'out']], def:5,
     quand:'Pour te poser, avant de dormir ou avant une course.', comment:'6 respirations par minute, le ventre gonfle à l’inspiration. La méthode « 365 » : 3 fois par jour, 6 respirations par minute, 5 minutes.'},
    {id:'soupir', nom:'Soupir cyclique', phases:[['Inspire par le nez', 2.5, 'in'], ['Encore un peu', 1, 'in2'], ['Souffle longuement par la bouche', 6, 'out']], def:5,
     quand:'Pour faire baisser le stress. 5 minutes par jour ont amélioré l’humeur plus que la méditation dans une étude de Stanford (2023).', comment:'Deux inspirations par le nez, la deuxième plus courte, puis une très longue expiration.'},
    {id:'carree', nom:'Respiration carrée', phases:[['Inspire', 4, 'in'], ['Bloque', 4, 'hold'], ['Expire', 4, 'out'], ['Bloque', 4, 'hold0']], def:4,
     quand:'Pour te concentrer avant une séance ou un départ.', comment:'4 temps égaux. Si bloquer te gêne, raccourcis les pauses.'},
    {id:'longue', nom:'Expiration longue', phases:[['Inspire', 4, 'in'], ['Expire', 6, 'out']], def:5,
     quand:'Pour récupérer après l’effort ou t’endormir.', comment:'L’expiration plus longue que l’inspiration aide à ralentir le cœur.'}
  ];
  let breathSel = {id:'coherence', min:5};
  function breathChooser(){
    return `<div class="rgroup"><div class="bcards">${BREATH.map(b => `<button class="bcard${breathSel.id===b.id?' on':''}" data-b="${b.id}"><b>${b.nom}</b><span>${esc(b.quand)}</span></button>`).join('')}</div></div>
      <div class="rgroup"><p class="lbl">Durée</p><div class="kbtn four">${[2,5,10].map(m => `<button data-bm="${m}" class="${breathSel.min===m?'on':''}">${m} min</button>`).join('')}</div></div>
      <button class="primary" id="bgo">${ico('play')}Commencer</button>`;
  }
  function bindBreath(){
    $$('[data-b]').forEach(b => b.onclick = () => { SND.tap(); breathSel.id = b.dataset.b; recupHome({kind:'respiration'}); });
    $$('[data-bm]').forEach(b => b.onclick = () => { SND.tap(); breathSel.min = +b.dataset.bm; recupHome({kind:'respiration'}); });
    on('#bgo', () => breathRun(BREATH.find(b => b.id === breathSel.id), breathSel.min));
  }
  function breathRun(tech, minutes){
    clearTimers(); audio(); keepAwake();
    layout({page:true, tools:false, top:false});
    head('Respiration', tech.nom);
    const total = minutes * 60, cyc = tech.phases.reduce((a,p) => a + p[1], 0);
    $('#page').innerHTML = `
      <div class="breath"><div class="bring"><div class="bball" id="bball"></div><div class="btxt"><b id="bph">Prêt ?</b><span id="bsec"></span></div></div>
      <p class="kadv">${esc(tech.comment)}</p><p class="bleft" id="bleft">${minutes}:00</p></div>`;
    bar(`<button class="ghost" id="bstop">Arrêter</button>`);
    const ball = $('#bball');
    const t0 = Date.now() + 3000/SPEED; let lastPh = -1, lastSec = -1;
    const scale = (kind, u) => kind === 'in' ? .45 + .45*u : kind === 'in2' ? .9 + .1*u : kind === 'hold' ? 1 : kind === 'hold0' ? .45 : 1 - .55*u;
    tick = setInterval(() => {
      const el = (Date.now() - t0) * SPEED / 1000;
      if(el < 0){ const n = Math.ceil(-el); if(n !== lastSec){ lastSec = n; $('#bph').textContent = n; SND.count(); } ball.style.transform = 'scale(.45)'; return; }
      if(el >= total){ clearTimers(); SND.end(); buzz([80,60,80]); releaseWake(); breathDone(tech, minutes); return; }
      let t = el % cyc, i = 0; while(t >= tech.phases[i][1]){ t -= tech.phases[i][1]; i++; }
      const [lab, dur, kind] = tech.phases[i], u = t / dur;
      ball.style.transform = `scale(${scale(kind, u).toFixed(3)})`;
      if(i !== lastPh){ lastPh = i; $('#bph').textContent = lab; pop($('#bph'), 'phasein');
        if(kind === 'in') SND.breath(420, .35, .12); else if(kind === 'out') SND.breath(300, .45, .12); else if(kind === 'in2') SND.breath(520, .2, .1); buzz(15); }
      const sl = Math.ceil(dur - t); if(sl !== lastSec){ lastSec = sl; $('#bsec').textContent = sl; }
      const left = total - el; $('#bleft').textContent = `${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')}`;
    }, 50);
    on('#bstop', () => { clearTimers(); releaseWake(); recupHome({kind:'respiration'}); });
  }
  function breathDone(tech, minutes){
    const h = Store.get('breathLog', []); h.push({id:tech.id, min:minutes, at:Date.now()}); Store.set('breathLog', h.slice(-60));
    $('#page').innerHTML = `<div class="big-ok"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="c" cx="26" cy="26" r="24"/><path class="k" d="M15 27l7 7 15-16"/></svg></div>
      <div class="hero"><h2>Bien respiré</h2><p class="tagline">${minutes} min · ${esc(tech.nom)}</p></div>`;
    stagger($('#page'));
    bar(`<button class="primary light" id="homeB">Terminé</button>`);
    on('#homeB', home);
  }

  /* ---------- conseils de récup en fin de séance ---------- */
  function recoveryCard(){
    const w = Store.get('poids', null), tomorrow = S.tomorrow || null;
    return `<div class="reco" id="reco">
      <p class="lbl" style="margin-top:0">Ta récup</p>
      <div class="recoin"><label for="poids">Ton poids</label><input class="field" id="poids" type="number" inputmode="decimal" min="35" max="140" step="0.5" placeholder="kg" value="${w ?? ''}"><span>kg</span></div>
      <div class="recoin"><label for="poidsAp">Pesée après <em>si tu t’es pesé</em></label><input class="field" id="poidsAp" type="number" inputmode="decimal" min="35" max="140" step="0.1" placeholder="kg" value="${S.poidsAp ?? ''}"><span>kg</span></div>
      <p class="lbl">Demain</p>
      <div class="kbtn four">${[['repos','Repos'],['facile','Facile'],['dure','Séance dure'],['course','Course']].map(([v,l]) => `<button data-tm="${v}" class="${tomorrow===v?'on':''}">${l}</button>`).join('')}</div>
      <div id="recoOut">${recoveryAdvice(w, tomorrow, S.poidsAp)}</div></div>`;
  }
  /** repères chiffrés, calculés sur le poids, le ressenti de la séance et la journée de demain */
  function recoveryAdvice(w, tomorrow, after){
    const g = (x, r=5) => Math.round(x/r)*r;                       // arrondi lisible
    const hardTomorrow = tomorrow === 'dure' || tomorrow === 'course';
    const hardToday = (S.srpe || 0) >= 8;
    const loss = w && after && w - after > .2 && w - after < 5 ? +(w - after).toFixed(1) : null;
    const L = [];

    // 1. boire : le seul repère fiable est ce que tu as perdu sur la balance
    if(loss){
      const lo = Math.round(loss * 1.25 * 10) / 10, hi = Math.round(loss * 1.5 * 10) / 10;
      L.push(`<li><b>Boire</b> · tu as perdu ${loss} kg → <b>${lo} à ${hi} L</b> sur les 3 h qui viennent, en 4 fois (≈ ${Math.round(lo*1000/4/10)*10} mL par prise). Avec du sel : ≈ 2 g de sel par litre, ou un vrai repas salé si tu manges dans l’heure.</li>`);
    } else {
      L.push(`<li><b>Boire</b> · pèse-toi avant et après tes grosses séances : il faut <b>1,25 à 1,5 L par kg perdu</b>, en 4 fois sur 3 h, avec du sel. Sans pesée : bois à ta soif, et vérifie le matin (ton poids doit être revenu à la normale).</li>`);
    }

    // 2. protéines : dose de la prise + total du jour, le timing compte moins que le total
    if(w){
      const shot = g(w * .5), day = g(w * (tomorrow === 'repos' ? 2 : 1.8));
      L.push(`<li><b>Protéines</b> · <b>${shot} g</b> à ton prochain repas (≈ ${Math.round(shot/25*100)} g de viande ou de poisson, ou 2 skyr + 2 œufs), et <b>${day} g sur la journée</b> en 4 prises${hardToday || hardTomorrow ? `, dont <b>40 g avant de dormir</b>` : ''}. Pas de course contre la montre : c’est le total du jour qui compte, pas la demi-heure après la séance.</li>`);
    } else {
      L.push(`<li><b>Protéines</b> · 0,4 à 0,55 g par kg à chaque repas, 4 fois dans la journée. Le total du jour compte plus que l’heure de la prise.</li>`);
    }

    // 3. glucides : réglés sur la charge de demain, pas sur un dogme
    const CH = {repos:[3,5,'journée calme'], facile:[5,7,'séance facile'], dure:[6,10,'grosse séance'], course:[8,10,'course']}[tomorrow || 'facile'];
    if(w) L.push(`<li><b>Glucides</b> · demain ${CH[2]} → <b>${g(w*CH[0], 10)} à ${g(w*CH[1], 10)} g sur la journée</b> (100 g de pâtes crues ≈ 75 g, une banane ≈ 25 g)${hardTomorrow ? '. Si tu repars dans moins de 4 h, monte à ' + g(w) + ' g par heure, tout de suite' : '. Repas normaux, rien à forcer'}.</li>`);
    else L.push(`<li><b>Glucides</b> · 3 à 5 g par kg les jours calmes, 6 à 10 g par kg quand la charge est grosse.</li>`);

    // 4. froid : la règle n'est pas la même après la muscu et après l'endurance
    L.push(`<li><b>Bain froid</b> · <b>pas après la muscu</b> : il rabote les gains de force et de muscle. Après du vélo ou du trail, il ne freine rien : 10 à 15 °C, 10 à 15 min, utile surtout s’il fait chaud ou si tu enchaînes deux efforts en 48 h.</li>`);

    // 5. ce qui ne marche pas, dit franchement
    L.push(`<li><b>Étirements</b> · aucun effet sur les courbatures ni sur ta forme de demain. Fais-les si ça te fait du bien, pas pour récupérer : <button class="textlink inline" id="goRecup">routine mobilité 10 min</button>.</li>`);

    // 6. sommeil : le levier le mieux prouvé
    L.push(`<li><b>Sommeil</b> · <b>${hardToday || hardTomorrow ? '9 à 10 h' : '8 à 10 h'} au lit</b> cette nuit. Sieste possible : 25 à 90 min, entre 13 h et 16 h. Si tu dors moins de 6 h, compte environ <b>−7 % de performance</b> : déplace ta séance le matin, c’est là que le manque de sommeil se voit le moins.</li>`);

    L.push(`<li><b>Le reste</b> · massage, compression, rouleau, électrostimulation : agréable, mais rien de solide chez les athlètes d’endurance. Dormir, manger, boire : c’est là que tout se joue.</li>`);

    return `<ul class="recolist">${L.join('')}</ul>
      <details class="src"><summary>D’où viennent ces repères ?</summary><p>
      Boire : Peden et al., Frontiers in Sports and Active Living, 2023 ; Armstrong et al., Open Access J Sports Med, 2025.
      Protéines : Witard et al., Sports Medicine, 2025 (1,8 à 2,0 g/kg/j chez l’athlète d’endurance) ; Trommelen et al., Cell Reports Medicine, 2023 (la fenêtre d’une heure n’existe pas).
      Glucides : position de l’American College of Sports Medicine, Thomas et al., 2016 ; Podlogar &amp; Wallis, Sports Medicine, 2022.
      Bain froid : Malta et al., Sports Medicine, 2021 ; Piñero et al., Eur J Sport Sci, 2024.
      Étirements : Afonso et al., Frontiers in Physiology, 2021.
      Sommeil : consensus du CIO, Walsh et al., BJSM, 2021 ; Craven et al., Sports Medicine, 2022 ; sieste : Boukhris et al., Biology of Sport, 2025.
      Les autres méthodes : Li et al., Sports Medicine Open, 2024 (revue des revues chez l’athlète d’endurance).
      Ce sont des repères généraux pour un adulte en bonne santé, pas une prescription. Une douleur qui dure, c’est le kiné ou le médecin.</p></details>`;
  }
  function bindRecovery(){
    const upd = () => { $('#recoOut').innerHTML = recoveryAdvice(Store.get('poids', null), S.tomorrow || null, S.poidsAp); on('#goRecup', () => { SND.tap(); recupHome({kind:'mobilite', minutes:10, sport:'muscu'}); }); };
    const num = (sel, fn) => { const inp = $(sel); if(inp) inp.oninput = () => { const v = parseFloat(inp.value.replace(',', '.')); if(v >= 35 && v <= 140){ fn(v); upd(); } }; };
    num('#poids', v => Store.set('poids', v));
    num('#poidsAp', v => { S.poidsAp = v; });
    $$('[data-tm]').forEach(b => b.onclick = () => { S.tomorrow = b.dataset.tm; $$('[data-tm]').forEach(x => x.classList.toggle('on', x === b)); SND.tap(); upd(); });
    upd();
  }


  /* ================= TESTS : batterie en autonomie, résultats datés dans « Ma fiche » ================= */
  const SIDE = {g:'Gauche', d:'Droite'};
  const SIDEL = {g:'gauche', d:'droite'}, COTE = {g:'gauche', d:'droit'};
  const n1 = v => v == null ? '—' : (Math.round(v*10)/10).toString().replace('.',',');
  const unitTxt = u => u === '°' ? '°' : ' ' + u;
  const valTxt = (v, u) => v == null ? '—' : `${n1(v)}${unitTxt(u)}`;
  /** e1RM (Epley). reps + reps en réserve = reps possibles jusqu'à l'échec */
  const epley = (kgv, reps, rir) => kgv * (1 + (reps + rir)/30);
  /* ---------- fiche locale (sur le téléphone) ---------- */
  function ficheAdd(test, v){
    const all = ficheAll().filter(e => !(e.test === test && e.date === today()));
    all.push({date: today(), test, v}); Store.set(fKey(), all.slice(-400));
  }
  const ficheOf = test => ficheAll().filter(e => e.test === test && !e.v.skip).sort((a,b) => a.date.localeCompare(b.date));
  const latestE1rm = e1rmFor;
  /* ---------- lecture d'un résultat : symétrie, repère, évolution ---------- */
  const mainVal = (d, v) => d.cotes ? null : (d.mode === 'force' ? v.e1rm : v.val);
  function asymOf(d, v){
    if(!d.cotes || v.g == null || v.d == null) return null;
    const lo = Math.min(v.g, v.d), hi = Math.max(v.g, v.d), weak = v.g < v.d ? 'g' : v.d < v.g ? 'd' : null;
    if(d.asymPct){ const pct = hi > 0 ? lo/hi*100 : 100; return {weak, txt: weak ? `${SIDEL[weak]} à ${Math.round(pct)} %` : 'égalité', flag: pct < d.asymPct}; }
    if(d.asym != null){ const diff = hi - lo; return {weak, txt:`écart ${n1(diff)}${unitTxt(d.unite)}`, flag: diff >= d.asym}; }
    return {weak, txt:'', flag:false};
  }
  function trendOf(d, prev, now){
    if(prev == null || now == null) return null;
    const diff = now - prev, lim = d.mdcPct ? prev*d.mdcPct/100 : (d.mdc || 0);
    if(Math.abs(diff) < lim) return {c:'st', t:'stable'};
    return diff > 0 ? {c:'up', t:`+${n1(diff)}${unitTxt(d.unite)}`} : {c:'dn', t:`${n1(diff)}${unitTxt(d.unite)}`};
  }
  const lowRep = (d, x) => d.repere && d.repere.min != null && x != null && x < d.repere.min;
  /** ce qui est « à travailler » dans un résultat (jamais de diagnostic, juste des chiffres) */
  function flagsOf(d, v){
    if(!v || v.skip) return [];
    const f = [];
    if(d.mode === 'video') return (d.criteres || []).filter(c => v[c.k] === 0).map(c => c.pb);
    const a = asymOf(d, v); if(a && a.flag) f.push(`côté ${COTE[a.weak]} plus faible (${a.txt})`);
    if(d.cotes){ const lo = ['g','d'].filter(s => lowRep(d, v[s])); if(lo.length) f.push(`${lo.length === 2 ? 'les deux côtés' : SIDEL[lo[0]]} sous le repère`); }
    return f;
  }
  function resLine(d, v){
    if(v.skip) return `non fait (${v.skip})`;
    if(d.mode === 'video'){ const ko = (d.criteres || []).filter(c => v[c.k] === 0).map(c => c.pb); return `${v.score}/${(d.criteres || []).length}${ko.length ? ' (' + ko.join(', ') + ')' : ''}`; }
    if(d.mode === 'force') return `${n1(v.e1rm)} kg estimés (${n1(v.kg)} kg × ${v.reps}, ${v.rir >= 3 ? '3+' : v.rir} en réserve${v.variante ? ', ' + v.variante : ''})`;
    if(d.cotes) return `G ${valTxt(v.g, d.unite)} · D ${valTxt(v.d, d.unite)}`;
    return valTxt(v.val, d.unite);
  }
  /** ligne machine, recopiée par Nathan : FICHE <code> <date> | test clé=valeur … */
  function ficheLine(entries){
    const code = Store.get('code') || '?';
    const kv = (id, v) => v.skip ? `${id} skip=${v.skip.replace(/\s+/g,'-')}` : `${id} ` + Object.entries(v).filter(([k,x]) => x != null && typeof x !== 'object').map(([k,x]) => `${k}=${String(x).replace(/\s+/g,'-')}`).join(' ');
    return `FICHE ${code} ${today()} | ` + entries.map(([id, v]) => kv(id, v)).join(' | ');
  }

  /* ---------- capteur d'inclinaison (angles au téléphone) ---------- */
  /** direction du haut (opposé à la gravité) dans le repère du téléphone, depuis beta/gamma (convention W3C Z-X'-Y'').
      Exacte pour toutes les orientations : près de beta = ±90°, gamma est mal défini mais son poids (cos beta) tend vers 0. */
  const upVec = (b, g) => { const B = b*D2R, G = g*D2R; return [-Math.sin(G)*Math.cos(B), Math.sin(B), Math.cos(G)*Math.cos(B)]; };
  /** angle entre deux directions : atan2(|u×v|, u·v), précis de 0 à 180° (acos perd en précision aux extrémités) */
  const angBetween = (a, b) => { const c = [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    return Math.atan2(Math.hypot(c[0], c[1], c[2]), a[0]*b[0] + a[1]*b[1] + a[2]*b[2])/D2R; };
  const Tilt = {
    on:false, u:null, last:0, fn:null,
    async ask(){
      try{ if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'){ const r = await DeviceOrientationEvent.requestPermission(); if(r !== 'granted') return false; } }catch(e){ return false; }
      return 'DeviceOrientationEvent' in window;
    },
    start(){
      if(this.on) return; this.on = true; this.u = null; this.last = 0;
      this.fn = e => { if(e.beta == null || e.gamma == null) return;
        const v = upVec(e.beta, e.gamma), k = .3;
        this.u = this.u ? this.u.map((x, i) => x + (v[i] - x)*k) : v;
        const n = Math.hypot(...this.u); this.u = this.u.map(x => x/n); this.beta = e.beta; this.last = performance.now(); };
      addEventListener('deviceorientation', this.fn);
    },
    stop(){ if(this.fn) removeEventListener('deviceorientation', this.fn); this.fn = null; this.on = false; },
    fresh(){ return this.u && performance.now() - this.last < 1500; }
  };
  /* son des tests : toujours joué (le test en dépend), même si les bips de séance sont coupés */
  function tbeep(f, d=.12, v=.26, when=0){ const a = audio(); if(!a) return; try{ const t = a.currentTime + when, o = a.createOscillator(), g = a.createGain();
    o.frequency.setValueAtTime(f, t); o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .03); }catch(e){} }
  const TB = {count:()=>tbeep(640, .08, .22), go:()=>tbeep(1040, .25, .28), hi:()=>tbeep(1175, .13, .28), lo:()=>tbeep(523, .13, .28),
    ok:()=>{ tbeep(880, .1, .26); tbeep(1320, .16, .26, .11); }, end:()=>{ tbeep(880, .12, .26); tbeep(1175, .2, .26, .13); }};

  /* ---------- état du test en cours ---------- */
  let TS = null;                                    // {it, d, v, cleanup}
  function tClean(){ if(TS && TS.cleanup){ try{ TS.cleanup(); }catch(e){} TS.cleanup = null; } Tilt.stop(); const z = $('#tapzone'); if(z) z.remove(); }
  function tStage(it, side){
    if(!it.anim || !Stage.ok) return false;
    Stage.setExo({...it, tempo:null, opts:{...(it.opts || {}), side: side === 'd' ? 'R' : 'L'}});
    return true;
  }
  function tLayout(it, side, withStage=true){
    const st = !!(withStage && it.anim && Stage.ok);
    layout({stage: st, panel:true}); progress();
    if(st) tStage(it, side);
    $('#panel').classList.add('tpanel'); $('#panel').classList.toggle('tfill', !st);
    return st;
  }
  const tKick = () => { const st = step(), b = blk(st); return `Test ${st.ii+1}/${b.items.length}`; };
  function tVariante(it){ const v = it.src.variante; return v === 'trap' ? 'trap bar' : v === 'classique' ? 'barre classique' : v || null; }

  /* ----- 1. présentation du test ----- */
  function testIntro(){
    clearTimers(); S.screen = 'test';
    const st = step(), it = item(st), d = it.test;
    S.tests = S.tests || {};
    TS = {it, d, v: d.cotes ? {g:null, d:null} : {}};
    tLayout(it, 'g');
    head(tKick(), it.name);
    const vari = tVariante(it);
    $('#panel').innerHTML = `
      <p class="tmes">${esc(d.mesure || '')}${vari ? ` · <b>${esc(vari)}</b>` : ''}</p>
      <ol class="tsteps">${(d.etapes || []).map(e => `<li>${esc(e)}</li>`).join('')}</ol>
      ${d.montage ? `<p class="tmont">${ico('phone','ico sm')}${esc(d.montage)}</p>` : ''}
      ${d.stop && d.stop.length ? `<p class="tstop"><b>L’essai ne compte pas si</b> ${d.stop.map(esc).join(' · ').toLowerCase()}</p>` : ''}
      ${d.avant ? `<p class="last">${esc(d.avant)}</p>` : ''}
      ${it.note ? `<p class="last">${esc(it.note)}</p>` : ''}
      <p class="tmat">${(d.materiel || []).map(m => `<span>${esc(m)}</span>`).join('')}</p>`;
    stagger($('#panel'));
    bar(`<div class="minor"><button id="skipT">${ico('pain')}Je ne peux pas</button></div><button class="primary" id="main">${ico('play')}${d.cotes ? 'Commencer · gauche' : 'Commencer'}</button>`);
    on('#skipT', skipTestSheet);
    on('#main', ()=>{ audio(); buzz(15); SND.tap(); testStart(); });
  }
  function testStart(){
    const m = TS.d.mode;
    if(m === 'saisie') return tSaisie();
    if(m === 'angle') return tAngle('g', 1);
    if(m === 'chrono') return tChrono();
    if(m === 'metronome') return tMetro('g');
    if(m === 'force') return tForceSetup();
    if(m === 'video') return tVideo();
    tSaisie();
  }
  function skipTestSheet(){
    const it = TS.it; let why = null;
    openSheet(`<h3>Tu ne peux pas faire ce test ?</h3><p class="sub">Pas de souci : on le saute. Nathan le verra dans ton message.</p>
      <div class="chips col" id="why">${['Ça me gêne ou ça fait mal', 'Je n’ai pas le matériel', 'Autre raison'].map(l => `<button>${l}</button>`).join('')}</div>
      <textarea class="field" id="whyc" rows="2" placeholder="Un mot pour Nathan (facultatif)"></textarea>
      <div class="actions"><button class="primary" id="okS" disabled>Passer ce test</button><button class="ghost" id="keepT">Je le fais</button></div>`);
    body.querySelectorAll('#why button').forEach(b => b.onclick = ()=>{ why = b.textContent; body.querySelectorAll('#why button').forEach(x => x.classList.toggle('on', x === b)); $('#okS').disabled = false; pop(b); });
    on('#keepT', ()=>closeSheet());
    on('#okS', ()=>{ const c = ($('#whyc').value || '').trim();
      const code = why.startsWith('Ça') ? 'gêne' : why.startsWith('Je') ? 'matériel' : 'autre';
      closeSheet(true); testSave({skip: code, note: c || undefined}); });
  }

  /* ----- 2a. saisie au mètre ----- */
  function tSaisie(){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS;
    tLayout(it, 'g');
    head(tKick(), it.name);
    const sides = d.cotes ? ['g','d'] : ['v'];
    const prev = ficheOf(d.id).pop();
    const row = s => `<div class="tin"><label for="in_${s}">${s === 'v' ? 'Résultat' : SIDE[s]}${prev && prev.v[s === 'v' ? 'val' : s] != null ? `<em>avant : ${valTxt(prev.v[s === 'v' ? 'val' : s], d.unite)}</em>` : ''}</label>
      <button class="tpm" data-s="${s}" data-k="-1" aria-label="Moins">−</button><input class="field" id="in_${s}" type="number" inputmode="decimal" step="${d.pas || 1}" min="${d.min ?? 0}" max="${d.max ?? 999}" placeholder="${esc(d.unite)}"><button class="tpm" data-s="${s}" data-k="1" aria-label="Plus">+</button></div>`;
    $('#panel').innerHTML = `
      <p class="tmes">${esc(d.saisie || 'Ton meilleur essai')}${d.essais ? ` · ${d.essais} essais par côté` : ''}</p>
      ${sides.map(row).join('')}
      <p class="last" id="twarn"></p>`;
    stagger($('#panel'));
    bar(`<div class="pair"><button class="ghost" id="backT">Retour</button><button class="primary" id="main" disabled>${ico('check')}Valider</button></div>`);
    const read = s => { const x = parseFloat(($('#in_' + s).value || '').replace(',', '.')); return isNaN(x) ? null : x; };
    const check = () => {
      const vals = sides.map(read), okAll = vals.every(x => x != null && x >= (d.min ?? 0) && x <= (d.max ?? 999));
      $('#main').disabled = !okAll;
      const bad = vals.some(x => x != null && (x < (d.min ?? 0) || x > (d.max ?? 999)));
      $('#twarn').textContent = bad ? `Valeur entre ${d.min ?? 0} et ${d.max ?? 999}${unitTxt(d.unite)}` : '';
    };
    $$('.tin input').forEach(i => i.oninput = check);
    $$('.tpm').forEach(b => b.onclick = ()=>{ const s = b.dataset.s, inp = $('#in_' + s); const cur = read(s) ?? (prev && prev.v[s === 'v' ? 'val' : s]) ?? (d.min ?? 0);
      const nv = Math.round((cur + (+b.dataset.k)*(d.pas || 1))*100)/100; inp.value = Math.max(d.min ?? 0, Math.min(d.max ?? 999, nv)); pop(b); check(); });
    on('#backT', testIntro);
    on('#main', ()=>{ const v = d.cotes ? {g: read('g'), d: read('d')} : {val: read('v')}; testSave(v); });
  }

  /* ----- 2b. angle au capteur du téléphone ----- */
  function tAngle(side, trial){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS;
    TS.acc = TS.acc || {g:[], d:[]};
    if(trial === 1) TS.acc[side] = [];
    tLayout(it, side);
    head(`${tKick()} · ${SIDEL[side]}`, it.name);
    $('#panel').innerHTML = `
      <div class="tang"><b id="aval">—</b><span id="aunit">°</span></div>
      <p class="tstat" id="astat">${SIDE[side]} · essai ${trial}/${d.essais || 2}</p>
      <p class="tmes">${S.tiltSign ? esc(d.montage || '') : 'Garde le téléphone en main et touche Démarrer : l’appli vérifie d’abord le capteur, puis tu le fixes.'}</p>
      <p class="last">${S.tiltSign ? 'Téléphone fixé, touche Démarrer : tu n’as plus à le toucher, il bipe au zéro puis à chaque mesure.' : esc(d.montage || '')}</p>`;
    stagger($('#panel'));
    bar(`<div class="pair"><button class="ghost" id="manual">Manuel</button><button class="primary" id="main">${ico('play')}Démarrer</button></div>`);
    on('#manual', ()=>tAngleManual(side));
    on('#main', async ()=>{
      audio(); const ok = await Tilt.ask();
      if(!ok){ toast('Capteur refusé : saisis l’angle à la main'); return tAngleManual(side); }
      Tilt.start(); keepAwake();
      $('#stage').hidden = true; Stage.stop(); $('#panel').classList.add('tfill');   // téléphone fixé : pas de 3D, batterie et capteur au calme
      if(S.tiltSign) return tAngleRun(side, trial);
      bar(`<button class="ghost" id="stopA">Annuler</button>`); on('#stopA', ()=>{ tClean(); tAngle(side, trial); });
      tAngleCheck(()=>{                                   // capteur vérifié : on fixe le téléphone, puis on lance
        const m = $('.tmes'); if(m) m.textContent = TS.d.montage || '';
        bar(`<button class="primary" id="go2">${ico('play')}Téléphone fixé : lancer</button>`);
        on('#go2', ()=>{ audio(); tAngleRun(side, trial); });
      }, ()=>tAngleManual(side));
    });
  }
  /** vérification du capteur, une fois par séance : téléphone tenu debout, écran face à soi.
      Par la norme, beta vaut alors +90° ; un téléphone qui renverrait −90° a le signe inversé : on le corrige (seul le test de Thomas a besoin du signe). */
  function tAngleCheck(ok, ko){
    const stat = t => { const e = $('#astat'); if(e){ e.textContent = t; pop(e); } };
    stat('Vérification du capteur');
    const m = $('.tmes'); if(m) m.textContent = 'Avant de le fixer : tiens ton téléphone debout devant toi, écran face à toi, 2 secondes.';
    let t0 = performance.now(), okSince = 0, sign = 0;
    const iv = setInterval(()=>{
      const now = performance.now();
      if(!Tilt.fresh()){ if(now - t0 > 3000){ clearInterval(iv); TS.cleanup = null; Tilt.stop(); toast('Pas de signal du capteur : saisis à la main'); ko(); } return; }
      const b = Tilt.beta, e = $('#aval'); if(e) e.textContent = Math.round(Math.abs(b));
      const sg = b > 70 ? 1 : b < -70 ? -1 : 0;
      if(sg && sg === sign){ if(now - okSince > Math.max(400, 1500/SPEED)){ clearInterval(iv); TS.cleanup = null; S.tiltSign = sign; TB.ok(); buzz(60); stat('Capteur OK · fixe ton téléphone'); setTimeout(ok, Math.max(200, 900/SPEED)); } }
      else { sign = sg; okSince = now; }
      if(now - t0 > 20000){ clearInterval(iv); TS.cleanup = null; Tilt.stop(); toast('Capteur instable : saisis à la main'); ko(); }
    }, 50);
    TS.cleanup = ()=>clearInterval(iv);
  }
  function tAngleRun(side, trial){
    const {d} = TS;
    const TH = !!d.signe;                                              // Thomas : zéro assis (cuisse posée), mesure allongé, avec le signe
    const stat = t => { const e = $('#astat'); if(e){ e.textContent = t; pop(e); } };
    const show = x => { const e = $('#aval'); if(e) e.textContent = x == null ? '—' : Math.round(x); };
    const lead = 8;
    let phase = 'lead', tEnd = performance.now() + lead*1000/SPEED, lastN = -1, zero = null, best = null, buf = [], zbuf = [], started = performance.now(), noSig = 0, lieEnd = 0;
    bar(`<button class="ghost" id="stopA">Arrêter</button>`);
    on('#stopA', ()=>{ tClean(); tAngle(side, trial); });
    stat(TH ? 'Assis au bord de la table, cuisse posée à plat' : 'Mets-toi en position de départ');
    const ms = sec => Math.max(350, sec*1000/SPEED);                  // en test accéléré, le capteur garde sa vraie cadence
    /** angle depuis le zéro : exact quel que soit le sens du téléphone sur le membre (le membre tourne autour d'un axe horizontal) */
    const angleNow = () => {
      if(!Tilt.fresh() || !zero) return null;
      const a = angBetween(zero, Tilt.u);
      if(!TH) return a;
      // signe : le haut du téléphone (vers le genou) descend quand la cuisse passe sous l'horizontale → valeur positive
      const dy = (Tilt.u[1] - zero[1])*(S.tiltSign || 1);
      return dy < 0 ? a : -a;
    };
    const stable = (win, tol) => { const now = performance.now(), w = buf.filter(p => now - p[0] <= ms(win));
      if(w.length < 4 || now - w[0][0] < ms(win)*.8) return null; const xs = w.map(p => p[1]);
      if(Math.max(...xs) - Math.min(...xs) > tol) return null;
      const tail = xs.slice(Math.floor(xs.length/2)); return tail.reduce((a,b)=>a+b,0)/tail.length; };   // moyenne de la fin de la tenue : pas de biais de mise en place
    const iv = setInterval(()=>{
      const now = performance.now();
      if(!Tilt.fresh()){ if(now - started > 2500){ noSig++; if(noSig === 1){ clearInterval(iv); tClean(); toast('Pas de signal du capteur : saisis à la main'); return tAngleManual(side); } } return; }
      if(phase === 'lead'){
        const n = Math.ceil((tEnd - now)*SPEED/1000);
        if(n !== lastN){ lastN = n; if(n <= 3 && n > 0){ TB.count(); buzz(20); } stat(`${TH ? 'Assis, cuisse posée' : 'Position de départ'} · ${n}`); }
        if(n <= 0){ phase = 'zero'; zbuf = []; stat('Ne bouge plus : zéro…'); }
        return;
      }
      if(phase === 'zero'){                                           // zéro : le vecteur ne bouge plus pendant 1 s
        zbuf.push([now, Tilt.u.slice()]); zbuf = zbuf.filter(p => now - p[0] <= ms(1));
        const ref = zbuf[zbuf.length-1][1];
        if(now - zbuf[0][0] >= ms(1)*.8 && zbuf.length >= 4 && zbuf.every(p => angBetween(p[1], ref) < 1.5)){
          zero = zbuf.reduce((acc, p) => acc.map((x, k) => x + p[1][k]), [0,0,0]); const nz = Math.hypot(...zero); zero = zero.map(x => x/nz);
          buf = []; TB.go(); buzz(60); show(0);
          if(TH){ phase = 'lie'; lieEnd = now + Math.max(1500, 10000/SPEED); lastN = -1; }
          else { phase = 'move'; stat('Zéro pris : va au bout du mouvement et tiens 2 s'); }
        }
        return;
      }
      const a = angleNow(); if(a == null) return;
      buf.push([now, a]); buf = buf.filter(p => now - p[0] <= Math.max(2500, ms(2.5)));
      show(a);
      if(phase === 'lie'){                                            // Thomas : le temps de basculer sur le dos
        const n = Math.ceil((lieEnd - now)*SPEED/1000);
        if(n !== lastN){ lastN = n; stat(`Zéro pris : allonge-toi, genou contre la poitrine · ${Math.max(0, n)}`); if(n <= 3 && n > 0) TB.count(); }
        if(now >= lieEnd){ phase = 'hold'; stat('Relâche la jambe, ne bouge plus…'); }
        return;
      }
      if(phase === 'hold'){                                           // Thomas : la valeur tenue 2 s, jambe relâchée
        const m = stable(2, 1.5);
        if(m != null){ best = m; TB.ok(); buzz([60,40,60]); return trialDone(); }
        if(now - lieEnd > Math.max(8000, 30000/SPEED)) return trialDone();
        return;
      }
      // mouvement : on garde l'angle maximal tenu 1 s
      const m = stable(1, 1.5);
      if(m != null && m >= 8 && (best == null || m > best + .5)){ best = m; TB.ok(); buzz([60,40,60]); stat(`Mesuré : ${Math.round(best)}° · reviens au départ`); }
      if(best != null && a < Math.max(5, best*.35)) return trialDone();
      if(now - started > lead*1000/SPEED + Math.max(10000, 40000/SPEED)) return trialDone();
    }, 50);
    TS.cleanup = ()=>clearInterval(iv);
    function trialDone(){
      clearInterval(iv); TS.cleanup = null;
      const n = d.essais || 2;
      if(best == null){ Tilt.stop(); TB.end(); toast('Pas de mesure tenue : on recommence'); return tAngle(side, trial); }
      TS.acc[side].push(Math.round(best*10)/10);
      TB.end(); buzz([100,60,100]);
      if(trial < n){ Tilt.stop(); return tAngleBetween(side, trial); }
      Tilt.stop(); tAngleSideDone(side);
    }
  }
  function tAngleBetween(side, trial){
    const {d} = TS; const got = TS.acc[side];
    $('#astat').textContent = `Essai ${trial} : ${Math.round(got[got.length-1])}°`;
    $('#aval').textContent = Math.round(got[got.length-1]);
    bar(`<div class="pair"><button class="ghost" id="redo">Refaire</button>${goBtn(`Essai ${trial+1}/${d.essais || 2}`, 'main')}</div>`);
    on('#redo', ()=>{ TS.acc[side].pop(); tAngle(side, trial); });
    on('#main', ()=>tAngle(side, trial + 1));
  }
  function tAngleSideDone(side){
    const {d} = TS; const got = TS.acc[side];
    const best = Math.max(...got);
    TS.v[side] = Math.round(best*10)/10;
    TS.v['ess_' + side] = got.map(x => Math.round(x)).join('/');
    $('#aval').textContent = Math.round(best);
    $('#astat').textContent = `${SIDE[side]} : ${Math.round(best)}° (essais ${got.map(Math.round).join(' / ')})`;
    const nextSide = side === 'g' && d.cotes;
    bar(`<div class="pair"><button class="ghost" id="redo">Refaire ${SIDEL[side]}</button>${goBtn(nextSide ? 'Côté droit' : 'Voir le résultat', 'main')}</div>`);
    on('#redo', ()=>tAngle(side, 1));
    on('#main', ()=> nextSide ? tAngle('d', 1) : testSave(TS.v));
  }
  function tAngleManual(side){
    clearTimers(); tClean();
    const {it, d} = TS;
    tLayout(it, side);
    head(`${tKick()} · ${SIDEL[side]}`, it.name);
    $('#panel').innerHTML = `
      <p class="tmes">Sans le capteur : mesure avec une appli niveau (ex. « Mesures » sur iPhone) posée comme indiqué, et note ton meilleur angle.</p>
      <div class="tin"><label for="in_m">${SIDE[side]}</label><button class="tpm" data-k="-1">−</button><input class="field" id="in_m" type="number" inputmode="decimal" step="1" placeholder="°"><button class="tpm" data-k="1">+</button></div>`;
    bar(`<div class="pair"><button class="ghost" id="backA">Capteur</button><button class="primary" id="main" disabled>${ico('check')}Valider</button></div>`);
    const inp = $('#in_m'), rd = () => { const x = parseFloat((inp.value || '').replace(',', '.')); return isNaN(x) ? null : x; };
    const ok = () => { const x = rd(); $('#main').disabled = x == null || x < -60 || x > 200; };
    inp.oninput = ok;
    $$('.tpm').forEach(b => b.onclick = ()=>{ inp.value = (rd() ?? 0) + +b.dataset.k; ok(); });
    on('#backA', ()=>tAngle(side, 1));
    on('#main', ()=>{ TS.acc = TS.acc || {g:[], d:[]}; TS.acc[side] = [rd()]; TS.v.manuel = 1; TS.v[side] = rd(); TS.v['ess_' + side] = String(Math.round(rd()));
      if(side === 'g' && d.cotes) return tAngle('d', 1); testSave(TS.v); });
  }

  /* ----- plein écran « touche l'écran pour arrêter » (chrono, métronome) ----- */
  function tapZone(html, onTap){
    Stage.stop();                                       // la 3D est cachée : on ne la calcule plus
    const z = document.createElement('div'); z.id = 'tapzone'; z.className = 'tapzone'; z.innerHTML = html;
    $('#app').appendChild(z);
    let armed = false; setTimeout(()=>{ armed = true; }, 400);
    z.addEventListener('pointerdown', e => { e.preventDefault(); if(armed) onTap(); });
    return z;
  }

  /* ----- 2c. chrono : sur une jambe yeux fermés ----- */
  function tChrono(){
    const {it, d} = TS;
    const order = []; for(let k=1; k<=(d.essais || 3); k++) (d.cotes ? ['g','d'] : ['v']).forEach(s => order.push([s, k]));
    TS.order = order; TS.k = 0; TS.acc = {g:[], d:[], v:[]};
    tChronoReady();
  }
  function tChronoReady(){
    clearTimers(); tClean(); S.screen = 'test';
    const {it, d} = TS; const [side, k] = TS.order[TS.k];
    tLayout(it, side === 'd' ? 'd' : 'g');
    head(`${tKick()} · ${SIDEL[side] || ''}`, it.name);
    const done = ['g','d'].filter(s => TS.acc[s].length).map(s => `<li><span>${SIDE[s]}</span><span>${TS.acc[s].map(x => n1(x) + ' s').join(' · ')}</span></li>`).join('');
    $('#panel').innerHTML = `
      <p class="tstat">${SIDE[side] || 'Essai'} · essai ${k}/${d.essais || 3}</p>
      <p class="tmes">Bras croisés, téléphone contre la poitrine. Au bip, ferme les yeux. Touche l’écran dès que tu perds la position.</p>
      <p class="last">${ico('sound','ico sm')} Son monté, mode silencieux coupé : le bip te dit quand fermer les yeux.</p>
      ${done ? `<ul class="list tight">${done}</ul>` : ''}`;
    stagger($('#panel'));
    bar(`${TS.k ? `<div class="pair"><button class="ghost" id="redo">Refaire le dernier</button>` : ''}${goBtn(`Lancer · ${SIDEL[side] || ''}`, 'main')}${TS.k ? '</div>' : ''}`);
    on('#redo', ()=>{ TS.k--; const [s] = TS.order[TS.k]; TS.acc[s].pop(); tChronoReady(); });
    on('#main', ()=>{ audio(); keepAwake(); tChronoRun(); });
  }
  function tChronoRun(){
    const {d} = TS; const [side] = TS.order[TS.k];
    const max = d.max || 45;
    let phase = 'lead', t0 = performance.now(), lastN = -1, stopped = false;
    const z = tapZone(`<div class="tzin"><small id="zs">Mets-toi en place</small><b id="zv">5</b><span id="zw">${SIDE[side] || ''}</span><em>Touche l’écran pour arrêter</em></div>`, ()=>finish());
    const iv = setInterval(()=>{
      const el = (performance.now() - t0)*SPEED/1000;
      if(phase === 'lead'){
        const n = Math.ceil(5 - el);
        if(n !== lastN){ lastN = n; if(n > 0){ $('#zv').textContent = n; TB.count(); } }
        if(el >= 5){ phase = 'go'; t0 = performance.now(); TB.go(); buzz(80); $('#zs').textContent = 'Yeux fermés'; }
        return;
      }
      $('#zv').textContent = Math.floor(el);
      if(el >= max) finish(true);
    }, 50);
    TS.cleanup = ()=>clearInterval(iv);
    function finish(cap){
      if(stopped) return;
      if(phase === 'lead'){ clearInterval(iv); tClean(); return tChronoReady(); }
      stopped = true; clearInterval(iv);
      const t = Math.min(max, (performance.now() - t0)*SPEED/1000);
      TS.acc[side].push(Math.round(t*10)/10);
      cap ? TB.end() : TB.lo(); buzz([100,60,100]);
      tClean(); TS.k++;
      if(TS.k < TS.order.length){ toast(`${n1(t)} s${cap ? ' · maximum' : ''}`); return tChronoReady(); }
      const best = s => TS.acc[s].length ? Math.max(...TS.acc[s]) : null;
      const v = d.cotes ? {g: best('g'), d: best('d'), ess_g: TS.acc.g.join('/'), ess_d: TS.acc.d.join('/')} : {val: best('v')};
      testSave(v);
    }
  }

  /* ----- 2d. métronome : reps comptées par l'appli ----- */
  function tMetro(side){
    clearTimers(); tClean(); S.screen = 'test';
    const {it, d} = TS;
    tLayout(it, side);
    head(`${tKick()} · ${SIDEL[side] || ''}`, it.name);
    const [w1, w2] = d.mots || ['Monte', 'Descends'];
    $('#panel').innerHTML = `
      <p class="tstat">${SIDE[side] || ''}</p>
      <p class="tmes">Bip aigu : ${esc(w1.toLowerCase())}. Bip grave : ${esc(w2.toLowerCase())}. ${d.periode || 2} s par rep. L’appli compte, tu touches l’écran quand tu ne peux plus suivre.</p>
      <p class="last">${ico('sound','ico sm')} Son monté, mode silencieux coupé : le rythme se suit à l’oreille.</p>
      ${side === 'd' && TS.v.g != null ? `<ul class="list tight"><li><span>Gauche</span><span>${TS.v.g} reps</span></li></ul>` : ''}`;
    stagger($('#panel'));
    bar(goBtn(`Lancer · ${SIDEL[side] || ''}`, 'main'));
    on('#main', ()=>{ audio(); keepAwake(); tMetroRun(side); });
  }
  function tMetroRun(side){
    const {d} = TS; const per = d.periode || 2, half = per/2, max = d.max || 60;
    const [w1, w2] = d.mots || ['Monte', 'Descends'];
    let phase = 'lead', t0 = performance.now(), lastN = -1, lastBeat = -1, reps = 0, stopped = false;
    const z = tapZone(`<div class="tzin"><small id="zs">Mets-toi en place</small><b id="zv">5</b><span id="zw">${SIDE[side] || ''}</span><em>Touche l’écran quand tu ne peux plus suivre</em></div>`, ()=>finish());
    const iv = setInterval(()=>{
      const el = (performance.now() - t0)*SPEED/1000;
      if(phase === 'lead'){
        const n = Math.ceil(5 - el);
        if(n !== lastN){ lastN = n; if(n > 0){ $('#zv').textContent = n; TB.count(); } }
        if(el >= 5){ phase = 'go'; t0 = performance.now(); lastBeat = -1; $('#zv').textContent = '0'; $('#zs').textContent = 'reps'; }
        return;
      }
      const beat = Math.floor(el/half);
      if(beat !== lastBeat){
        lastBeat = beat;
        if(beat % 2 === 0){ if(beat > 0){ reps = beat/2; $('#zv').textContent = reps; } TB.hi(); $('#zw').textContent = w1; buzz(25); }
        else { TB.lo(); $('#zw').textContent = w2; }
        if(reps >= max) finish(true);
      }
    }, 20);
    TS.cleanup = ()=>clearInterval(iv);
    function finish(cap){
      if(stopped) return;
      if(phase === 'lead'){ clearInterval(iv); tClean(); return tMetro(side); }
      stopped = true; clearInterval(iv); TB.end(); buzz([100,60,100]); tClean();
      tMetroConfirm(side, reps, cap);
    }
  }
  function tMetroConfirm(side, reps, cap){
    const {d} = TS; let n = reps;
    $('#panel').innerHTML = `
      <p class="tstat">${SIDE[side] || ''}${cap ? ' · maximum atteint' : ''}</p>
      <div class="stepper"><button id="m" aria-label="Moins">−</button><b id="n">${n}</b><button id="p" aria-label="Plus">+</button></div>
      <p class="last">Reps complètes. Corrige si l’appli s’est trompée d’une.</p>`;
    stagger($('#panel'));
    on('#m', ()=>{ n = Math.max(0, n-1); $('#n').textContent = n; pop($('#n')); });
    on('#p', ()=>{ n = Math.min(d.max || 99, n+1); $('#n').textContent = n; pop($('#n')); });
    const nextSide = side === 'g' && d.cotes;
    bar(`<div class="pair"><button class="ghost" id="redo">Refaire</button>${goBtn(nextSide ? 'Côté droit' : 'Voir le résultat', 'main')}</div>`);
    on('#redo', ()=>tMetro(side));
    on('#main', ()=>{ if(d.cotes) TS.v[side] = n; else TS.v.val = n; if(nextSide) return tMetro('d'); testSave(TS.v); });
  }

  /* ----- 2e. force : max estimé sans le tenter ----- */
  function tForceSetup(){
    clearTimers(); tClean(); S.screen = 'test';
    const {it, d} = TS;
    tLayout(it, 'g');
    head(tKick(), it.name);
    const prev = latestE1rm(d.lift, it.src), lastBox = (ficheOf(d.id).pop() || {v:{}}).v.box;
    const sug = prev ? r25(prev.e1rm*.85) : null;
    TS.f = {kg: sug, box: lastBox || null, safe: d.lift !== 'squat'};
    $('#panel').innerHTML = `
      <p class="tmes">${prev ? `Ton dernier max estimé : <b>${n1(prev.e1rm)} kg</b>. L’appli propose 85 % pour ta série test (≈ 5 reps).` : 'Premier test : choisis la charge que tu penses lever <b>6 fois proprement</b>. Pas plus.'}</p>
      <div class="tin"><label for="in_kg">Charge de la série test</label><button class="tpm" data-k="-2.5">−</button><input class="field" id="in_kg" type="number" inputmode="decimal" step="2.5" min="20" max="400" placeholder="kg" value="${sug ?? ''}"><button class="tpm" data-k="2.5">+</button></div>
      ${d.lift === 'squat' ? `<div class="tin"><label for="in_box">Hauteur de ta box <em>${lastBox ? 'la dernière fois : ' + lastBox + ' cm' : 'facultatif, garde toujours la même'}</em></label><button class="tpm" data-b="-1">−</button><input class="field" id="in_box" type="number" inputmode="numeric" step="1" min="20" max="80" placeholder="cm" value="${lastBox ?? ''}"><button class="tpm" data-b="1">+</button></div>
        <button class="tcheck" id="safe">${ico('check','ico sm')}Barres de sécurité réglées juste sous ma position basse</button>` : ''}
      ${tVariante(it) ? `<p class="last">Barre : <b>${esc(tVariante(it))}</b></p>` : ''}`;
    stagger($('#panel'));
    bar(`<div class="pair"><button class="ghost" id="backT">Retour</button><button class="primary" id="main" disabled>Échauffement</button></div>`);
    const kgIn = $('#in_kg');
    const rd = el => { const x = parseFloat((el.value || '').replace(',', '.')); return isNaN(x) ? null : x; };
    const ok = () => { TS.f.kg = rd(kgIn); const b = $('#in_box'); if(b) TS.f.box = rd(b); $('#main').disabled = !(TS.f.kg >= 20 && TS.f.kg <= 400 && TS.f.safe); };
    kgIn.oninput = ok; const bx = $('#in_box'); if(bx) bx.oninput = ok;
    $$('.tpm').forEach(b => b.onclick = ()=>{ if(b.dataset.b){ const x = rd(bx) ?? 45; bx.value = x + +b.dataset.b; } else { kgIn.value = Math.max(20, (rd(kgIn) ?? 40) + +b.dataset.k); } pop(b); ok(); });
    on('#safe', ()=>{ TS.f.safe = !TS.f.safe; $('#safe').classList.toggle('on', TS.f.safe); SND.tap(); ok(); });
    on('#backT', testIntro);
    on('#main', ()=>{ TS.f.ramp = rampOf(TS.f.kg); TS.f.rk = 0; TS.f.sets = []; tForceRamp(); });
    ok();
  }
  /** échauffement calculé depuis la charge test : 40 % ×8 (ou barre), 60 % ×5, 80 % ×3, 90 % ×1 */
  function rampOf(L){
    const w = [[.4, 8, 60], [.6, 5, 90], [.8, 3, 120], [.9, 1, 150]].map(([p, r, rest]) => ({kg: Math.max(20, r25(L*p)), reps: r, rest}));
    return w.filter((x, i) => i === 0 || x.kg > w[i-1].kg);
  }
  function tForceRamp(){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS, f = TS.f;
    tLayout(it, 'g');
    head(`${tKick()} · échauffement`, it.name);
    const cur = f.rk;
    $('#panel').innerHTML = `
      <ol class="tramp">${f.ramp.map((x, i) => `<li class="${i < cur ? 'ok' : i === cur ? 'now' : ''}"><b>${n1(x.kg)} kg</b><span>× ${x.reps}</span>${i < cur ? ico('check','ico sm') : ''}</li>`).join('')}
        <li class="${cur >= f.ramp.length ? 'now' : ''} test"><b>${n1(f.kg)} kg</b><span>série test · ≈ 5 reps</span></li></ol>
      <p class="last">${cur < f.ramp.length ? 'Reps faciles et propres : c’est de l’échauffement, pas de la fatigue.' : 'Arrête quand il ne t’en reste qu’une, ou dès que la technique lâche.'}</p>`;
    stagger($('#panel'));
    if(cur < f.ramp.length) bar(`<div class="pair"><button class="ghost" id="skipW">Passer</button><button class="primary" id="main">${ico('check')}${n1(f.ramp[cur].kg)} kg fait</button></div>`);
    else bar(`<button class="primary" id="main">${ico('check')}Série test faite</button>`);
    on('#skipW', ()=>{ f.rk++; tForceRamp(); });
    on('#main', ()=>{ SND.tap(); buzz(15);
      if(cur < f.ramp.length){ f.rk++; return tRest(f.ramp[cur].rest, tForceRamp); }
      tForceResult(); });
  }
  function tRest(sec, then){
    clearTimers(); S.screen = 'test';
    $('#panel').innerHTML = `${ring('small', sec, 'récup')}<p class="last">Prochaine série à la fin du chrono, ou quand tu es prêt.</p>`;
    bar(`<div class="pair"><button class="ghost" id="plus">+30 s</button>${goBtn('Je suis prêt', 'ready')}</div>`);
    let end = Date.now() + sec*1000/SPEED, rt = sec, lastSec = -1;
    tick = setInterval(()=>{ const left = Math.max(0, (end - Date.now())*SPEED/1000); if(left > rt) rt = left; setRing(left, rt);
      const s = Math.ceil(left); if(s !== lastSec){ lastSec = s; if(s <= 5 && s > 0){ SND.count(); pop($('#tv'),'tick'); } }
      if(left <= 0){ clearTimers(); SND.go(); buzz([150,80,150]); then(); } }, 100);
    on('#plus', ()=>{ end += 30000/SPEED; });
    on('#ready', ()=>{ clearTimers(); then(); });
  }
  function tForceResult(){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS, f = TS.f;
    let reps = 5, rir = null;
    tLayout(it, 'g', false);
    head(`${tKick()} · résultat`, it.name);
    $('#panel').innerHTML = `
      <p class="lbl" style="margin:0">Reps faites à ${n1(f.kg)} kg</p>
      <div class="stepper"><button id="m" aria-label="Moins">−</button><b id="n">${reps}</b><button id="p" aria-label="Plus">+</button></div>
      <p class="lbl" style="margin:0">Il t’en restait combien ?</p>
      <div class="rpe5 c4" id="rir">${[[0,'0','échec'],[1,'1','idéal'],[2,'2',''],[3,'3+','trop léger']].map(([v,l,s]) => `<button data-r="${v}"><b>${l}</b><span>${s}</span></button>`).join('')}</div>
      <p class="tres" id="fres"></p>`;
    stagger($('#panel'));
    bar(`<button class="primary" id="main" disabled>${ico('check')}Valider</button>`);
    const upd = () => {
      const out = $('#fres');
      if(rir == null){ out.innerHTML = ''; $('#main').disabled = true; return; }
      const r = reps + rir, e = epley(f.kg, reps, rir);
      out.innerHTML = `Max estimé : <b>${n1(Math.round(e*2)/2)} kg</b>${r > 8 ? '<br><em>Charge trop légère : estimation moins précise.</em>' : reps < 2 ? '<br><em>Charge très lourde : garde une rep en réserve la prochaine fois.</em>' : ''}`;
      $('#main').disabled = false;
    };
    on('#m', ()=>{ reps = Math.max(1, reps-1); $('#n').textContent = reps; pop($('#n')); upd(); });
    on('#p', ()=>{ reps = Math.min(15, reps+1); $('#n').textContent = reps; pop($('#n')); upd(); });
    $$('#rir button').forEach(b => b.onclick = ()=>{ rir = +b.dataset.r; $$('#rir button').forEach(x => x.classList.toggle('on', x === b)); pop(b); buzz(10); upd(); });
    on('#main', ()=>{
      const r = reps + rir, e = Math.round(epley(f.kg, reps, rir)*2)/2;
      f.sets.push({kg:f.kg, reps, rir, e1rm:e});
      const v = {e1rm:e, kg:f.kg, reps, rir, box: f.box || undefined, variante: tVariante(it) || undefined, series: f.sets.length};
      if(r > 8 && f.sets.length < 2){
        const nk = Math.max(f.kg + 2.5, Math.ceil(f.kg*1.1/2.5)*2.5);
        openSheet(`<h3>Charge trop légère</h3><p class="sub">Avec ${r} reps possibles, l’estimation perd en précision. Une 2e série test à <b>${n1(nk)} kg</b> après 4 min de repos donne un chiffre plus juste.</p>
          <div class="actions"><button class="primary" id="okS">Refaire à ${n1(nk)} kg</button><button class="ghost" id="keepF">Garder ${n1(e)} kg</button></div>`);
        on('#okS', ()=>{ closeSheet(true); f.kg = nk; tRest(240, ()=>{ f.rk = f.ramp.length; tForceRamp(); }); });
        on('#keepF', ()=>{ closeSheet(true); testSave(v); });
        return;
      }
      testSave(v);
    });
  }

  /* ----- 2f. vidéo + critères oui/non (squat bras levés) ----- */
  function tVideo(){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS;
    tLayout(it, 'g');
    head(tKick(), it.name);
    $('#panel').innerHTML = `
      <p class="tmes">Pose ton téléphone <b>de profil</b>, à 2-3 m, à hauteur de hanche : tout ton corps et le bâton dans le cadre.</p>
      <p class="last">Tu as 8 s pour te placer, puis l’appli filme 5 reps (20 s) et bipe à la fin.</p>`;
    stagger($('#panel'));
    bar(`<div class="pair"><button class="ghost" id="backT">Retour</button><button class="primary" id="main">${ico('cam')}Filmer</button></div>`);
    on('#backT', testIntro);
    on('#main', async ()=>{ audio(); keepAwake();
      if(!Rec.supported) return tVideoFile();
      try{ await Rec.open(); }catch(e){ return tVideoFile(); }
      tVideoRec(); });
  }
  function tVideoFile(){
    const inp = $('#camfile'); inp.value = '';
    inp.onchange = () => { const f = inp.files && inp.files[0]; if(f) tVideoReview(f); };
    inp.click(); toast('Filme tes 5 reps de profil, puis valide la vidéo');
  }
  function tVideoRec(){
    const {it} = TS;
    layout({stage:true, panel:true, live:true}); $('#stage').classList.add('camon');
    head(`${tKick()} · vidéo`, it.name);
    $('#panel').innerHTML = `<p class="tstat" id="vst">Place-toi · 8</p><p class="last">De profil, tout le corps dans le cadre.</p>`;
    bar(`<div class="pair"><button class="ghost" id="cancelV">Annuler</button><button class="primary" id="stopV" disabled>${ico('check')}Fini</button></div>`);
    let phase = 'lead', t0 = performance.now(), lastN = -1, stopped = false;
    const REC = 20;
    const iv = setInterval(()=>{
      const el = (performance.now() - t0)*SPEED/1000;
      if(phase === 'lead'){ const n = Math.ceil(8 - el);
        if(n !== lastN){ lastN = n; if(n <= 3 && n > 0) TB.count(); $('#vst').textContent = `Place-toi · ${n}`; }
        if(el >= 8){ phase = 'rec'; t0 = performance.now(); Rec.start(); $('#stage').classList.add('recording'); TB.go(); buzz(60); $('#stopV').disabled = false; }
        return; }
      const left = Math.max(0, Math.ceil(REC - el)); $('#vst').textContent = `On filme · ${left} s`;
      if(el >= REC) finish();
    }, 100);
    TS.cleanup = () => { clearInterval(iv); if(!stopped){ try{ Rec.close(); }catch(e){} $('#stage').classList.remove('camon','recording'); } };
    on('#cancelV', ()=>{ tClean(); tVideo(); });
    on('#stopV', ()=>finish());
    async function finish(){
      if(stopped) return; stopped = true; clearInterval(iv); TS.cleanup = null; TB.end(); buzz([100,60,100]);
      const file = phase === 'rec' ? await Rec.stop('squat-bras-leves') : null;
      Rec.close(); $('#stage').classList.remove('camon','recording');
      if(!file || !file.size){ toast('La vidéo n’a pas été enregistrée : on recommence'); return tVideo(); }
      tVideoReview(file);
    }
  }
  function tVideoReview(file){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS; TS.file = file;
    tLayout(it, 'g', false);
    head(`${tKick()} · revois ta vidéo`, it.name);
    const url = URL.createObjectURL(file); TS.url = url;
    const crit = d.criteres || [], ans = {};
    $('#panel').innerHTML = `
      <video class="tvid" src="${url}" playsinline muted loop autoplay controls></video>
      <p class="tmes">Regarde ta rep la plus basse. Pour chaque critère : oui ou non.</p>
      <div class="tcrit">${crit.map(c => `<div class="tcr" data-k="${c.k}"><span>${esc(c.txt)}</span><div><button data-v="1">Oui</button><button data-v="0">Non</button></div></div>`).join('')}</div>`;
    stagger($('#panel'));
    bar(`<div class="pair"><button class="ghost" id="redoV">Refilmer</button><button class="primary" id="main" disabled>${ico('check')}Valider</button></div>`);
    $$('.tcr button').forEach(b => b.onclick = ()=>{ const row = b.closest('.tcr'); ans[row.dataset.k] = +b.dataset.v;
      row.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); pop(b); SND.tap();
      $('#main').disabled = Object.keys(ans).length < crit.length; });
    on('#redoV', ()=>{ URL.revokeObjectURL(url); tVideo(); });
    on('#main', ()=>{ const v = {score: crit.filter(c => ans[c.k] === 1).length}; crit.forEach(c => v[c.k] = ans[c.k]); v.video = 1; testSave(v); });
  }

  /* ----- 3. enregistrement + résultat ----- */
  function testSave(v){
    clearTimers(); tClean();
    const {it, d} = TS;
    Object.keys(v).forEach(k => v[k] === undefined && delete v[k]);
    S.tests = S.tests || {}; S.tests[d.id] = v;
    S.log.push({i:S.i, test:d.id});
    ficheAdd(d.id, v); save();
    testResult();
  }
  function testResult(){
    clearTimers(); S.screen = 'test';
    const {it, d} = TS; const v = S.tests[d.id];
    tLayout(it, 'g', false);
    head(tKick(), it.name);
    const hist = ficheOf(d.id).filter(e => e.date !== today()), prev = hist.pop();
    let html;
    if(v.skip) html = `<p class="quote">Test passé (${esc(v.skip)}). Nathan le verra dans ton message.</p>`;
    else if(d.mode === 'video'){
      const crit = d.criteres || [], tr = prev ? trendOf(d, prev.v.score, v.score) : null;
      html = `<div class="tbig"><b>${v.score}/${crit.length}</b><span>critères réussis</span>${tr ? `<em class="${tr.c}">${tr.t}</em>` : ''}</div>
        <ul class="list tight">${crit.map(c => `<li><span>${esc(c.txt)}</span><span class="${v[c.k] ? 'okc' : 'warnc'}">${v[c.k] ? 'oui' : 'à travailler'}</span></li>`).join('')}</ul>
        ${TS.file ? `<button class="sendvid" id="sendV">${ico('send')}Envoyer la vidéo à Nathan</button>` : ''}`;
    }
    else if(d.mode === 'force'){
      const tr = prev ? trendOf(d, prev.v.e1rm, v.e1rm) : null;
      html = `<div class="tbig"><b>${n1(v.e1rm)}</b><span>kg · max estimé</span>${tr ? `<em class="${tr.c}">${tr.t} depuis le ${prev.date.split('-').reverse().slice(0,2).join('/')}</em>` : ''}</div>
        <p class="last">${n1(v.kg)} kg × ${v.reps} reps, ${v.rir >= 3 ? '3 ou plus' : v.rir} en réserve · marge ±5 %</p>
        <ul class="list tight">${[70,75,80,85].map(p => `<li><span>${p} % pour tes séances</span><span>${n1(r25(v.e1rm*p/100))} kg</span></li>`).join('')}</ul>`;
    } else {
      const a = asymOf(d, v);
      const cell = s => { const x = s === 'v' ? v.val : v[s], p = prev ? (s === 'v' ? prev.v.val : prev.v[s]) : null, tr = trendOf(d, p, x);
        return `<div class="${a && a.flag && a.weak === s ? 'weak' : ''}"><small>${s === 'v' ? 'Résultat' : SIDE[s]}</small><b>${x == null ? '—' : n1(x)}<i>${esc(d.unite)}</i></b>${tr ? `<em class="${tr.c}">${tr.t}</em>` : ''}${lowRep(d, x) ? '<u>sous le repère</u>' : ''}</div>`; };
      html = `<div class="tduo">${(d.cotes ? ['g','d'] : ['v']).map(cell).join('')}</div>
        ${a ? `<p class="tsym ${a.flag ? 'flag' : ''}">${a.flag ? `À travailler : côté ${COTE[a.weak]} (${esc(a.txt)})` : `Symétrie correcte${a.txt ? ' · ' + esc(a.txt) : ''}`}</p>` : ''}
        ${d.repere ? `<p class="last">Repère : ${esc(d.repere.txt)}</p>` : ''}
        ${prev ? `<p class="last">Comparé au test du ${prev.date.split('-').reverse().join('/')}. En dessous de l’erreur de mesure, c’est « stable ».</p>` : '<p class="last">Premier test : c’est ta référence.</p>'}`;
    }
    $('#panel').innerHTML = html;
    stagger($('#panel'));
    const last = !S.steps[S.i + 1] || S.steps[S.i + 1].t !== 'test';
    bar(`<div class="pair"><button class="ghost" id="redoT">Refaire</button>${goBtn(last ? 'Continuer' : 'Test suivant', 'main')}</div>`);
    on('#sendV', async ()=>{ const r = await shareFile(TS.file, `${SESS.titre} · ${it.name}`); if(r !== 'aborted'){ S.videos++; const bt = $('#sendV'); if(bt) bt.outerHTML = `<p class="last okc">${r === 'downloaded' ? 'Vidéo enregistrée : envoie-la à Nathan sur WhatsApp' : 'Vidéo envoyée'}</p>`; } });
    on('#redoT', ()=>{ delete S.tests[d.id]; S.log = S.log.filter(l => !(l.i === S.i && l.test)); testIntro(); });
    on('#main', ()=>{ SND.go(); buzz(20); TS = null; next(); });
  }

  /* ----- Ma fiche (sur le téléphone) ----- */
  function ficheScreen(){
    clearTimers(); S = null; SESS = null;
    layout({page:true, tools:false, top:false}); progress();
    head('Charge Utile', 'Ma fiche');
    const all = ficheAll(), tests = Object.values(Data.tests || {});
    const blocks = tests.map(d => {
      const h = all.filter(e => e.test === d.id).sort((a,b) => a.date.localeCompare(b.date));
      if(!h.length) return '';
      const last = h[h.length-1], ok = h.filter(e => !e.v.skip), prev = ok.length > 1 ? ok[ok.length-2] : null;
      const cur = last.v.skip ? null : last;
      let tr = '';
      if(cur && prev){ if(d.mode === 'force'){ const t = trendOf(d, prev.v.e1rm, cur.v.e1rm); tr = t ? `<em class="${t.c}">${t.t}</em>` : ''; }
        else if(d.cotes){ tr = ['g','d'].map(s => { const t = trendOf(d, prev.v[s], cur.v[s]); return t ? `<em class="${t.c}">${s.toUpperCase()} ${t.t}</em>` : ''; }).join(' '); }
        else { const k = d.mode === 'video' ? 'score' : 'val'; const t = trendOf(d, prev.v[k], cur.v[k]); tr = t ? `<em class="${t.c}">${t.t}</em>` : ''; } }
      const fl = cur ? flagsOf(d, cur.v) : [];
      return `<li class="fline"><div><b>${esc(d.court || d.nom)}</b><span>${esc(resLine(d, last.v))}</span>${fl.length ? `<u>${esc(fl.join(' · '))}</u>` : ''}</div><div><small>${last.date.split('-').reverse().slice(0,2).join('/')}</small>${tr}</div></li>`;
    }).filter(Boolean);
    $('#page').innerHTML = `
      <div class="hero"><h2>Ma fiche</h2><p class="tagline">Tes derniers tests, datés</p></div>
      ${blocks.length ? `<ul class="list fiche">${blocks.join('')}</ul>` : `<p class="quote">Aucun test pour l’instant. Nathan t’enverra une séance de tests.</p>`}
      <p class="last">« Stable » = changement plus petit que l’erreur de mesure du test. Les écarts gauche/droite servent à choisir tes exercices, ce n’est pas un avis médical.</p>`;
    stagger($('#page'));
    bar(`<div class="pair"><button class="ghost" id="back">Retour</button><button class="primary light" id="shareF" ${blocks.length ? '' : 'disabled'}>${ico('send')}Envoyer à Nathan</button></div>`);
    on('#back', home);
    on('#shareF', async ()=>{
      const lastBy = {}; all.forEach(e => { if(!lastBy[e.test] || lastBy[e.test].date <= e.date) lastBy[e.test] = e; });
      const L = ['Ma fiche de tests'].concat(Object.values(lastBy).map(e => { const d = Data.tests[e.test]; return d ? `${d.nom} (${e.date}) : ${resLine(d, e.v)}` : ''; }).filter(Boolean));
      const byDate = {}; Object.values(lastBy).forEach(e => (byDate[e.date] = byDate[e.date] || []).push([e.test, e.v]));
      Object.entries(byDate).forEach(([dt, en]) => L.push(ficheLine(en).replace(/ \d{4}-\d{2}-\d{2} \|/, ` ${dt} |`)));
      const r = await shareText(L.join('\n')); if(r !== 'aborted') toast('Fiche envoyée');
    });
  }

  /* ================= FEUILLES ================= */
  const scrim = $('#scrim'), sheet = $('#sheet'), body = $('#sheetBody');
  let onClose = null, hideT = null;
  function openSheet(html, closeCb){
    clearTimeout(hideT);
    body.innerHTML = `<div class="grab"></div>${html}`; onClose = closeCb || null;
    scrim.hidden = false; sheet.hidden = false; sheet.scrollTop = 0;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ scrim.classList.add('show'); sheet.classList.add('show'); }));
    stagger(body);
  }
  function closeSheet(silent){
    scrim.classList.remove('show'); sheet.classList.remove('show');
    hideT = setTimeout(()=>{ scrim.hidden = true; sheet.hidden = true; }, 380);
    const cb = onClose; onClose = null; if(!silent && cb) cb();
  }
  scrim.onclick = ()=>closeSheet();
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !sheet.hidden) closeSheet(); });

  function shortSheet(pend, cb){
    const it = pend.it; let n = Math.max(0, (it.reps||1)-1);
    openSheet(`<h3>Combien de reps ?</h3><p class="sub">Pas grave : la suite s’adapte.</p>
      <div class="stepper"><button id="m" aria-label="Moins">−</button><b id="n">${n}</b><button id="p" aria-label="Plus">+</button></div>
      <div class="actions"><button class="primary" id="okS">Valider</button></div>`);
    on('#m', ()=>{ n = Math.max(0,n-1); $('#n').textContent = n; pop($('#n')); });
    on('#p', ()=>{ n = Math.min((it.reps||1)-1,n+1); $('#n').textContent = n; pop($('#n')); });
    on('#okS', ()=>{ closeSheet(true); cb(n); });
  }

  /* ---------- remplacer (dernier recours) ---------- */
  function swapSheet(){
    const it = item();
    if(!it.orig) it.orig = {id:it.id, src:it.src};
    const list = it.alts.filter(a => a.id !== it.id).map(a => ({id:a.id, name:a.nom, detail:(a.materiel||[]).filter(m=>m!=='aucun').join(', ') || 'sans matériel', level: a.niveau < it.niveau ? 'easy' : 'eq'}));
    if(it.replaced) list.unshift({back:true, id:it.orig.id, name:it.replaced, detail:'Revenir à l’exo prévu'});
    openSheet(`<h3>Remplacer l’exo</h3>
      <p class="sub">Seulement si le matériel est pris ou absent et que tu ne peux pas attendre. Nathan le verra.</p>
      <div class="opts">${list.map((a,i)=>`<button class="opt" data-i="${i}"><div><b>${esc(a.name)}</b><span>${esc(a.detail)}</span></div><em class="lv ${a.back?'back':a.level}">${a.back?'Prévu':a.level==='easy'?'Plus facile':'Équivalent'}</em></button>`).join('')}</div>
      <div class="actions"><button class="ghost" id="keep">Garder cet exo</button></div>`);
    body.querySelectorAll('.opt').forEach(b=>b.onclick = ()=>{
      const a = list[+b.dataset.i];
      const st = step(), bl = blk(st);
      // même matériel → même charge ; matériel différent → charge à trouver au RPE visé ; sans matériel → poids du corps
      const matA = (Data.ex[it.orig.id] || {}).materiel || [], matB = Data.ex[a.id].materiel || [];
      const sameGear = matB.length && matB.every(m => matA.includes(m));
      const charge = a.back ? it.orig.src.charge : matB.includes('aucun') ? undefined : sameGear ? it.orig.src.charge : (it.orig.src.charge != null ? 'à ajuster au RPE' : undefined);
      const n = buildItem({...it.orig.src, ex:a.id, nom:undefined, consignes:undefined, note:undefined, tempo: it.orig.src.tempo, charge, pas: typeof charge === 'number' ? it.orig.src.pas : undefined});
      n.orig = it.orig; n.replaced = a.back ? null : (it.replaced || it.name);
      if(a.back) n.replaced = null;
      bl.items[st.ii] = n;
      S.adj.push(a.back ? `Retour à ${a.name}` : `${it.replaced || it.name} remplacé par ${a.name}`);
      pop(b); closeSheet(true); S.screen='x'; S.lastItem = null; prep();
      toast(a.back ? `Retour à ${a.name}` : `Remplacé par ${a.name}`);
    });
    on('#keep', ()=>closeSheet());
  }

  /* ---------- douleur (mots simples) ---------- */
  const PAIN_TYPES = [
    ['Ça brûle ou ça tire dans le muscle','muscle'],
    ['Ça tire près d’une articulation','tendon'],
    ['Ça coince, ou ça lâche (genou, cheville…)','articulation'],
    ['Ça fait mal à un point précis quand j’appuie sur l’os','os'],
    ['Ça picote, ça fourmille, comme une décharge','nerf'],
    ['Je ne sais pas trop','?']
  ];
  const PAIN_HOW = ['Petit à petit','D’un coup, pendant un mouvement','Après une chute ou un choc','C’était déjà là avant la séance'];
  const PAIN_FLAGS = ['C’est gonflé','Ça fait mal même sans bouger'];
  function painSheet(){
    const it = item() || {name:'—', alts:[]};
    const st = {zone:null, other:'', lvl:null, types:new Set(), how:null, flags:new Set(), comment:''};
    openSheet(`<h3>Douleur</h3><p class="sub">Quelques questions simples pour que Nathan comprenne ce que tu sens.</p>
      <section class="q"><p class="lbl">Où ?</p>
        <div class="chips" id="zones">${['Genou','Hanche','Bas du dos','Cheville / Achille','Cuisse','Épaule','Autre'].map(z=>`<button>${z}</button>`).join('')}</div>
        <input class="field" id="otherZone" placeholder="Précise l’endroit" hidden></section>
      <section class="q" id="q2" hidden><p class="lbl">Ça fait mal comment, sur 10 ?</p>
        <div class="scale" id="lvl">${[...Array(11).keys()].map(n=>`<button>${n}</button>`).join('')}</div>
        <div class="scalelbl"><span>0 · rien</span><span>10 · insupportable</span></div></section>
      <section class="q" id="q3" hidden><p class="lbl">Qu’est-ce que tu sens ? <em>plusieurs choix possibles</em></p>
        <div class="chips col" id="types">${PAIN_TYPES.map(([l])=>`<button>${l}</button>`).join('')}</div></section>
      <section class="q" id="q4" hidden><p class="lbl">C’est arrivé comment ?</p>
        <div class="chips col" id="how">${PAIN_HOW.map(l=>`<button>${l}</button>`).join('')}</div>
        <div class="chips" id="flags" style="margin-top:8px">${PAIN_FLAGS.map(l=>`<button class="soft">${l}</button>`).join('')}</div></section>
      <section class="q" id="q5" hidden><p class="lbl">Tu veux ajouter un mot ? <em>facultatif</em></p>
        <textarea class="field" id="comment" rows="2" placeholder="Ex. ça tire quand je descends, pas quand je remonte"></textarea></section>
      <div id="adv"></div>`);
    const show = id => { const s = $(id); if(s.hidden){ s.hidden = false; pop(s,'reveal'); setTimeout(()=>s.scrollIntoView({behavior:RM?'auto':'smooth', block:'nearest'}), 60); } };
    const single = (sel, fn) => body.querySelectorAll(sel+' button').forEach(b=>b.onclick = ()=>{ body.querySelectorAll(sel+' button').forEach(x=>x.classList.toggle('on', x===b)); pop(b); fn(b); });
    const multi = (sel, set, fn) => body.querySelectorAll(sel+' button').forEach(b=>b.onclick = ()=>{ const t = b.textContent; set.has(t) ? set.delete(t) : set.add(t); b.classList.toggle('on', set.has(t)); pop(b); fn(); });
    single('#zones', b=>{ st.zone = b.textContent; const o = $('#otherZone'); o.hidden = st.zone!=='Autre'; if(!o.hidden){ pop(o,'reveal'); o.focus(); } show('#q2'); upd(); });
    $('#otherZone').oninput = ev => { st.other = ev.target.value.trim(); };
    single('#lvl', b=>{ st.lvl = +b.textContent; show('#q3'); upd(); });
    multi('#types', st.types, ()=>{ if(st.types.size) show('#q4'); upd(); });
    single('#how', b=>{ st.how = b.textContent; show('#q5'); upd(); });
    multi('#flags', st.flags, upd);
    $('#comment').oninput = ev => { st.comment = ev.target.value.trim(); };
    function upd(){
      const adv = $('#adv');
      if(st.zone==null || st.lvl==null || !st.types.size || !st.how){ adv.innerHTML = ''; return; }
      const k = PAIN_TYPES.filter(([l])=>st.types.has(l)).map(([,x])=>x);
      const sudden = st.how.startsWith('D’un coup'), shock = st.how.startsWith('Après');
      const red = st.lvl >= 6 || k.includes('os') || k.includes('nerf') || (k.includes('articulation') && st.lvl>=3) || shock || (sudden && st.lvl>=4) || st.flags.has('C’est gonflé');
      const orange = !red && (st.lvl >= 4 || k.includes('tendon') || sudden || st.flags.has('Ça fait mal même sans bouger'));
      let h;
      if(red) h = `<div class="advice r"><b>Arrête cet exo</b>Pas de série de plus sur cette zone aujourd’hui. Nathan le verra dans ton message de fin. Si ça ne passe pas, va voir un médecin ou un kiné.</div>
        <div class="actions"><button class="primary" id="a3">Passer à l’exo suivant</button><button class="ghost" id="a4">Arrêter la séance</button></div>`;
      else if(orange) h = `<div class="advice o"><b>On adapte</b>Allège ou prends une variante plus douce. Nathan le verra dans ton message de fin.</div>
        <div class="actions"><button class="primary" id="a1">Continuer plus léger</button>${it.alts && it.alts.length ? `<button class="ghost" id="a2">Choisir une variante</button>` : ''}</div>`;
      else h = `<div class="advice g"><b>Tu peux continuer</b>Réduis l’amplitude si ça tire. Nathan le verra dans ton message de fin.</div>
        <div class="actions"><button class="primary" id="a1">Continuer</button></div>`;
      const had = adv.innerHTML !== '';
      adv.innerHTML = h; if(!had){ pop(adv,'reveal'); setTimeout(()=>adv.scrollIntoView({behavior:RM?'auto':'smooth', block:'end'}), 80); }
      const note = sev => { S.pain.push({zone: st.zone==='Autre' ? (st.other || 'Autre') : st.zone, lvl:st.lvl, types:[...st.types], how:st.how, flags:[...st.flags], comment:st.comment, exo:it.name, sev}); save(); };
      on('#a1', ()=>{ note(orange ? 'orange' : 'vert'); const light = st.lvl>=4 || orange; if(light && typeof it.load==='number'){ const f = it.load; it.load = Math.max(0, it.load - (it.step||2)); S.adj.push(`${it.name} : ${kg(f)} → ${kg(it.load)} kg (douleur)`); } closeSheet(true); S.screen='x'; S.lastItem = null; prep(); toast(light ? 'Noté · on allège' : 'Noté · Nathan le verra'); });
      on('#a2', ()=>{ note('orange'); closeSheet(true); setTimeout(swapSheet, 400); });
      on('#a3', ()=>{ note('rouge'); closeSheet(true); skipItem(); });
      on('#a4', ()=>{ note('rouge'); closeSheet(true); done_(true); });
    }
  }
  function skipItem(){
    const st = step();
    const same = s => s.bi===st.bi && s.ii===st.ii;
    const name = item(st).name;
    while(step() && same(step())){ if(!S.done.includes(S.i)) S.done.push(S.i); S.log.push({i:S.i, skipped:true, name}); S.i++; }
    S.skipped = (S.skipped||[]).concat(name);
    S.pendingRpe = null;
    if(!step()) return done_();
    toast('Exo arrêté · Nathan le verra');
    restScreen(45);
  }

  /* ---------- comprendre l'exo ---------- */
  function infoSheet(){
    const st = step(); const it = st && item(st); const b = st && blk(st);
    if(!it){ openSheet(`<h3>${esc(b ? b.name : SESS.titre)}</h3><div class="info"><p>${esc(b && b.note ? b.note : SESS.message || '')}</p></div>`); return; }
    if(it.kind === 'test'){ const d = it.test;
      openSheet(`<h3>${esc(it.name)}</h3><div class="info">
        <h4>Ce que ça mesure</h4><p>${esc(d.mesure || '')}</p>
        <h4>Pourquoi pour toi</h4><p>${esc(d.pourquoi || '')}</p>
        ${d.repere ? `<h4>Repère</h4><p>${esc(d.repere.txt)}. Ce n’est pas une note : ce qui compte, c’est ton évolution et l’écart entre tes deux côtés.</p>` : ''}
        <h4>Sécurité</h4><p>${esc(d.securite || 'Douleur : arrête le test.')}</p>
        <h4>Fiabilité</h4><p>${esc(d.fiabilite || '')}</p>
        ${d.source ? `<p class="rule">${esc(d.source)}</p>` : ''}
      </div>`); return; }
    const t = it.tempoTxt || it.tempo;
    const tempoTxt = t ? `<h4>Le tempo ${t.join('-')}</h4><p>${t[0]} s pour descendre, ${+t[1] ? t[1]+' s de pause en bas' : 'pas de pause en bas'}, ${t[2]==='X' ? 'remonte le plus vite possible' : t[2]+' s pour remonter'}${+t[3] ? ', '+t[3]+' s en haut' : ''}.</p>
      <p class="rule">Pendant la série, le mannequin suit ce rythme et les bips te le donnent : tic grave = descends, tic moyen = tiens, double note = monte. Si tu n’entends rien, coupe le mode silencieux.</p>` : '';
    const k = qKind(it);
    const rpeTxt = b.type==='circuit' ? `<h4>Le ressenti</h4><p>Tu donnes ton ressenti à la fin de chaque tour. Objectif du circuit : RPE ${esc(SESS.rpe)}.</p>` : {
      reps: `<h4>Le RPE</h4><p>Ton effort sur 10, jugé sur le nombre de reps qu’il te restait à la fin de la série.${it.rpe ? ` RPE ${it.rpe} = il t’en restait ${10-it.rpe}.` : ''}</p>${typeof it.load==='number' ? `<p class="rule">Règle de Nathan : 2 points sous l’objectif → +${kg(it.step)} kg ; 2 points au-dessus → −${kg(it.step)} kg. Le nombre de reps ne change pas.</p>` : ''}`,
      hold: `<h4>Le ressenti</h4><p>Après la série, dis combien de secondes tu aurais encore tenu. La durée s’ajuste de 5 s si c’était trop facile ou trop dur.</p>`,
      plyo: `<h4>Le ressenti</h4><p>Ici on juge la qualité : tes sauts restent-ils vifs ? Si ça baisse, tu gagnes 30 s de récup en plus.</p>`,
      effort: `<h4>Le ressenti</h4><p>Ton effort sur 10. Objectif ${it.rpe || 9} : quasiment à fond.</p>`
    }[it.kind==='cardio' ? 'none' : k] || (it.kind==='cardio' ? `<h4>L’intensité</h4><p>${esc(it.level || 'Facile')} : tu dois pouvoir parler en faisant l’exercice.</p>` : '');
    openSheet(`<h3>${esc(it.name)}</h3>
      <div class="info">
        ${it.musclesTxt ? `<p class="muscles">${esc(it.musclesTxt)}</p>` : ''}
        <h4>Pourquoi pour toi</h4><p>${esc(it.why || 'Travail choisi par Nathan pour ce bloc.')}</p>
        <h4>Les consignes</h4><ul>${it.cues.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>
        ${it.errors.length ? `<h4>Les erreurs à éviter</h4><ul>${it.errors.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>` : ''}
        <h4>Respiration</h4><p>${esc(it.breath || 'Respire régulièrement, sans bloquer.')}</p>
        <h4>Sécurité</h4><p>${esc(it.safety || 'Douleur vive : arrête et signale-la.')}</p>
        ${tempoTxt}${rpeTxt}
        <a class="ghost small linkbtn" href="${esc(videoLink(it))}" target="_blank" rel="noopener">${ico('eye')}Voir une vraie vidéo${it.link ? '' : ' (YouTube)'}</a>
        <button class="ghost small" id="snd">${ico('sound')}Réglages des sons</button>
      </div>`);
    on('#snd', ()=>{ SND.tap(); soundSheet(); });
  }
  /* ---------- réglages des sons ---------- */
  function sndSummary(){
    const on = Object.keys(SND_LABELS).filter(k => sndPrefs[k]);
    return on.length === 3 ? 'tous activés' : on.length === 0 ? 'coupés' : `${on.length}/3 activés`;
  }
  function soundSheet(after){
    const row = k => `<button class="swrow${sndPrefs[k] ? ' on' : ''}" data-s="${k}"><div><b>${SND_LABELS[k][0]}</b><span>${SND_LABELS[k][1]}</span></div><i class="sw"></i></button>`;
    openSheet(`<h3>Les sons</h3><p class="sub">Coupe seulement ce qui te gêne.</p>
      <div class="swlist">${Object.keys(SND_LABELS).map(row).join('')}</div>
      <p class="last">Tes bips se mélangent à ta musique, ils ne la coupent pas.</p>`);
    $$('[data-s]').forEach(b => b.onclick = ()=>{
      const k = b.dataset.s; sndSet(k, !sndPrefs[k]); b.classList.toggle('on', sndPrefs[k]);
      if(sndPrefs[k]){ audio(); k === 'tempo' ? SND.up() : k === 'count' ? SND.count() : SND.end(); }
      if(after) after();
    });
  }
  function quitSheet(){
    openSheet(`<h3>Quitter ?</h3><p class="sub">Tu peux reprendre plus tard là où tu t’es arrêté, ou terminer maintenant et envoyer ce que tu as fait.</p>
      <div class="actions"><button class="primary light" id="stay">Continuer la séance</button><button class="ghost" id="later">Reprendre plus tard</button><button class="ghost" id="leave">Terminer maintenant</button></div>`);
    on('#stay', ()=>closeSheet());
    on('#later', ()=>{ closeSheet(true); save(); home(); });
    on('#leave', ()=>{ closeSheet(true); done_(true); });
  }
  let tt = null;
  function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(()=>t.classList.remove('show'), 2400); }

  /* ================= FIN ================= */
  const painLine = p => `${p.zone} ${p.lvl}/10 (${p.exo}) : ${p.types.join(', ').toLowerCase()}, ${p.how.toLowerCase()}${p.flags.length ? ', ' + p.flags.join(', ').toLowerCase() : ''}${p.comment ? ` « ${p.comment} »` : ''}`;
  function recap(){
    const secs = Math.round((Date.now() - (S.t0||Date.now()))/1000);
    const h = Math.floor(secs/3600), m = Math.floor(secs%3600/60);
    const L = [];
    L.push(`${SESS.titre} · ${dayLabel(SESS.date).toLowerCase()}${S.early ? ' (arrêtée avant la fin)' : ''}`);
    L.push(`Durée : ${h ? h+' h '+String(m).padStart(2,'0') : m+' min'} · RPE séance : ${S.srpe ?? '—'}/10 (visé ${SESS.rpe})`);
    // détail par exercice suivi en séries
    const byName = {};
    S.log.filter(l => l.set).forEach(l => { (byName[l.name] = byName[l.name] || []).push(l); });
    const PLY = {7:'explosif', 8:'un peu moins à la fin', 9:'ça a baissé', 10:'plus du tout'};
    const LVL = {5:'trop facile', 7:'juste bien', 8:'difficile', 10:'perd l’équilibre'};
    const HOLD = {6:'réserve 20 s+', 7:'réserve 15 s', 8:'réserve 10 s', 9:'réserve 5 s', 10:'à bloc'};
    for(const [name, ls] of Object.entries(byName)){
      const k = ls[0].kind;
      const parts = ls.map(l => {
        const r = l.rpe == null ? '?' : k === 'plyo' ? PLY[l.rpe] : k === 'hold' ? HOLD[l.rpe] : k === 'level' ? LVL[l.rpe] : l.rpe;
        const v = typeof l.load === 'number' ? `${kg(l.load)} kg ` : '';
        const miss = l.partial ? (l.done != null ? ` (${l.done} reps)` : ' (écourtée)') : '';
        return `${v}${k==='plyo' || k==='hold' || k==='level' ? '' : 'RPE '}${r}${miss}${l.video ? ' [vidéo]' : ''}`;
      });
      L.push(`${name} : ${parts.join(' / ')}`);
    }
    const rounds = S.log.filter(l => l.round && l.rpe != null && l.bi != null);
    [...new Set(rounds.map(r=>r.bi))].forEach(bi => L.push(`${S.blocks[bi].name} (tours) : RPE ${rounds.filter(r=>r.bi===bi).map(r=>r.rpe).join(' / ')}`));
    if(S.tests && Object.keys(S.tests).length){
      const en = Object.entries(S.tests);
      en.forEach(([id, v]) => { const d = Data.tests[id] || {nom:id, unite:''}; const fl = d.mode === 'video' ? [] : flagsOf(d, v);
        L.push(`${d.nom} : ${resLine(d, v)}${v.note ? ` « ${v.note} »` : ''}${fl.length ? ' → ' + fl.join(', ') : ''}`); });
      L.push(ficheLine(en));
    }
    if(S.adj.length) L.push(`Ajustements : ${S.adj.join(' ; ')}`);
    if(S.skipped && S.skipped.length) L.push(`Exos arrêtés : ${[...new Set(S.skipped)].join(', ')}`);
    S.pain.forEach(p => L.push(`Douleur : ${painLine(p)}`));
    if(S.videos) L.push(`${S.videos} vidéo${S.videos>1?'s':''} envoyée${S.videos>1?'s':''} à part`);
    return L.join('\n');
  }
  function done_(early){
    if(SESS && SESS.recup) return recupDone();
    clearTimers(); S.screen = 'done'; S.early = !!early; Stage.stopGuide(); try{ Rec.close(); }catch(e){}
    layout({page:true, tools:false}); S.steps.forEach((_,i)=>{ if(i < S.i && !S.done.includes(i)) S.done.push(i); }); progress();
    releaseWake();
    const secs = Math.round((Date.now() - (S.t0||Date.now()))/1000);
    const work = S.steps.filter((s,i)=>['timer','reps','free','test'].includes(s.t) && S.done.includes(i) && !S.log.find(l=>l.i===i && l.skipped)).length;
    const total = S.steps.filter(s=>['timer','reps','free','test'].includes(s.t)).length;
    head(SESS.titre, early ? 'Séance arrêtée' : 'Séance terminée');
    $('#page').innerHTML = `
      <div class="big-ok"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="c" cx="26" cy="26" r="24"/><path class="k" d="M15 27l7 7 15-16"/></svg></div>
      <div class="facts"><div><b>${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}</b>durée</div><div><b><span id="dn">${work}</span>/${total}</b>${S.steps.some(s => s.t === 'test') ? 'étapes et tests' : 'séries et exos'}</div><div><b>${S.adj.length}</b>ajustement${S.adj.length>1?'s':''}</div></div>
      <div><p class="lbl" style="margin-top:0">Ta séance entière, sur 10 ?</p>
      <div class="rpegrid" id="srpe">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button data-n="${n}">${n}</button>`).join('')}</div>
      <p class="legend" id="srpeL">Objectif de Nathan : ${esc(SESS.rpe)}</p></div>
      ${S.pain.length ? `<p class="quote">${S.pain.map(p=>esc(painLine(p))).join('<br>')}<small>Sera dans ton message à Nathan</small></p>` : ''}
      ${recoveryCard()}`;
    stagger($('#page'));
    bindRecovery();
    countUp($('#dn'), work);
    bar(`<button class="primary" id="send" disabled>${ico('send')}Envoyer à Nathan</button>`);
    $$('#srpe button').forEach(b=>b.onclick = ()=>{
      $$('#srpe button').forEach(x=>x.classList.toggle('on', x===b)); pop(b);
      S.srpe = +b.dataset.n; $('#srpeL').textContent = `${S.srpe} · ${CR10[S.srpe]}`; $('#send').disabled = false; buzz(10); save();
      const ro = $('#recoOut'); if(ro){ ro.innerHTML = recoveryAdvice(Store.get('poids', null), S.tomorrow || null); on('#goRecup', () => recupHome({kind:'etirement', minutes:10, sport:'muscu'})); }
    });
    on('#send', sent);
  }
  function recupDone(){
    clearTimers(); S.screen = 'done'; Stage.stopGuide(); releaseWake();
    layout({page:true, tools:false}); progress();
    const h = Store.get('recupLog', []); h.push({titre:SESS.titre, at:Date.now()}); Store.set('recupLog', h.slice(-60));
    head('Récup', 'Routine terminée');
    $('#page').innerHTML = `<div class="big-ok"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="c" cx="26" cy="26" r="24"/><path class="k" d="M15 27l7 7 15-16"/></svg></div>
      <div class="hero"><h2>Bien joué</h2><p class="tagline">${esc(SESS.titre)}</p></div>
      <p class="quote">Refais-la quand tu veux : la routine change un peu chaque jour.</p>`;
    stagger($('#page'));
    bar(`<button class="primary light" id="homeB">Terminé</button>`);
    on('#homeB', home);
  }
  async function sent(){
    const text = recap();
    const hist = Store.get('history', {}); hist[SESS.id] = {at:Date.now(), srpe:S.srpe, early:S.early}; Store.set('history', hist);
    Store.del('progress');
    const r = await shareText(text);
    S.screen = 'sent'; layout({page:true, tools:false});
    head(SESS.titre, r === 'aborted' ? 'Pas encore envoyé' : 'Bien joué');
    $('#page').innerHTML = `
      <div class="big-ok"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="c" cx="26" cy="26" r="24"/><path class="k" d="M15 27l7 7 15-16"/></svg></div>
      <div class="todo2"><b>Dernière étape : intervals.icu</b><span>Arrête ta montre si ce n’est pas fait, puis ouvre la séance dans intervals.icu et mets ton RPE : <strong>${S.srpe}/10</strong>. C’est ce qui compte la muscu dans ta charge d’entraînement.</span></div>
      <p class="lbl">Ton message à Nathan</p>
      <pre class="recap">${esc(text)}</pre>`;
    stagger($('#page'));
    bar(`<div class="pair"><button class="ghost" id="again">${ico('send')}Renvoyer</button><button class="primary light" id="homeB">Terminé</button></div>`);
    on('#again', ()=>shareText(text));
    on('#homeB', home);
  }

  $('#btnInfo').onclick = infoSheet;
  $('#btnQuit').onclick = quitSheet;
  setTimeout(()=>{ const h = $('#hint'); if(h) h.style.opacity = 0; }, 6000);
  return {start: async ()=>{
            const a = Q.get('a'); if(a){ Store.set('code', a.trim().toLowerCase()); history.replaceState(null, '', location.pathname); }
            await home();
          },
          session: ()=>SESS || {}, _state: ()=>S, _jump: n=>{ S.i = n; S.screen='x'; run(); }, _recap: ()=>recap()};
})();
window.__app = App;
scrollWatch();
App.start().catch(e => { console.error(e); const p = $('#page'); if(p){ p.hidden = false; p.innerHTML = `<p class="warn">Impossible de charger tes séances. Vérifie ta connexion au premier lancement.</p>`; } });
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !window.CU_DATA){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
})();
