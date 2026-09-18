/* Charge Utile — famille « ankle » : chevilles du traileur (mobilité, renforcement, réactivité).
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. Jambe de travail par défaut : GAUCHE (o.side:'R' => miroir). */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ aides */
const TH = .445, SH = .456, HIPZ = .1125;
const nrm2 = (x, z) => { const l = Math.hypot(x, z) || 1; return [x/l, z/l]; };
const nrm3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };
const add3 = (a, b, k = 1) => [a[0] + b[0]*k, a[1] + b[1]*k, a[2] + b[2]*k];
const cross = (a, b) => [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const lerp3 = (a, b, k) => [0,1,2].map(i => lerp(a[i], b[i], k));
const dKnee = f => Math.sqrt(TH*TH + SH*SH + 2*TH*SH*Math.cos(f*D2R));
const pcY = (px, pz, ank, side, f) => { const hz = pz + (side === 'L' ? HIPZ : -HIPZ);
  const d = dKnee(f), dx = px - ank[0], dz = hz - ank[2]; return ank[1] + Math.sqrt(Math.max(.01, d*d - dx*dx - dz*dz)); };
/* mesures sur le maillage : [inclinaison du pied °, hauteur de cheville au contact, avance du point de contact] */
const FORE = [[0,.075,.103],[20,.113,.099],[30,.129,.091],[40,.142,.068],[50,.150,.043],[60,.155,.017]];
const TIP  = [[0,.075,.103],[30,.160,.136],[40,.181,.106],[45,.190,.095],[60,.208,.046]];
const HEEL = [[-30,.083,-.014],[-20,.081,-.019],[-10,.077,-.019],[0,.075,.103]];
const tab = (T, p) => { if(p <= T[0][0]) return T[0]; for(let i=1;i<T.length;i++) if(p <= T[i][0]){ const a = T[i-1], b = T[i], k = (p-a[0])/(b[0]-a[0]); return [p, lerp(a[1],b[1],k), lerp(a[2],b[2],k)]; } return T[T.length-1]; };
const leg = (a, h, phi, flex, pole, sole) => { const c = Math.cos(phi*D2R), s = Math.sin(phi*D2R);
  const o = {ankle:a.slice(), toe:[a[0] + .2*h[0]*c, a[1] - .2*s, a[2] + .2*h[1]*c], pole, toeFlex:flex||0};
  if(sole) o.sole = sole; return o; };
const flat = (x, y, z, h) => leg([x, y, z], h, 0, 0, [h[0], 0, h[1]]);
const fore = (cx, cy, cz, h, phi) => { const r = tab(FORE, phi); return [cx - h[0]*r[2], cy + r[1], cz - h[1]*r[2]]; };
const tip  = (cx, cy, cz, h, phi) => { const r = tab(TIP, phi);  return [cx - h[0]*r[2], cy + r[1], cz - h[1]*r[2]]; };
const OUT_L = nrm2(1, .1), OUT_R = nrm2(1, -.1), FWD = [1, 0];
const K = (u, f) => Object.assign({u}, f);
const arm = (x, y, z, pole, curl) => ({hand:[x, y, z], pole, rel:'sh', curl: curl || 'loose'});
const wArm = (x, y, z, pole, curl) => ({hand:[x, y, z], pole, rel:'world', curl: curl || 'loose'});

/** pied en appui sur l'avant-pied au bord d'une marche (pivot sous les métatarsiens) ; th > 0 talon levé, th < 0 talon sous la marche */
function ballFoot(mx, gy, z, th){
  const a = th*D2R, c = Math.cos(a), s = Math.sin(a);
  const px = .14, py = -.074;
  const ax = mx - (px*c + py*s), ay = gy - (-px*s + py*c) + (th < 0 ? -th*.0008 : 0);   // talon sous la marche : correction mesurée
  const tf = th > 0 ? th*.55 : th*.6;
  return {ankle:[ax, ay, z], toe:[ax + .2*c, ay - .2*s, z + (z > 0 ? .02 : -.02)], pole:[1,0,z>0?.12:-.12], toeFlex:tf};
}

/* miroir gauche/droite */
const MZ = a => a && [a[0], a[1], -(a[2]||0)];
function mirror(p){
  const q = Object.assign({}, p);
  q.pc = [p.pc[0], p.pc[1], -(p.pc[2]||0)];
  const ml = l => Object.assign({}, l, {ankle:MZ(l.ankle), toe:MZ(l.toe), pole:MZ(l.pole)}, l.sole ? {sole:MZ(l.sole)} : {});
  q.legs = {L: ml(p.legs.R), R: ml(p.legs.L)};
  if(p.arms.mode === 'custom'){
    const ma = a => a && Object.assign({}, a, a.hand ? {hand:MZ(a.hand)} : {}, a.t ? {t:MZ(a.t)} : {}, {pole:MZ(a.pole)});
    q.arms = Object.assign({}, p.arms, {L: ma(p.arms.R), R: ma(p.arms.L)});
  }
  if(p.yaw) q.yaw = -p.yaw;
  if(p.dev){ q.dev = Object.assign({}, p.dev); for(const k of ['twist','bend','pelTwist','pelBend']) if(q.dev[k]) q.dev[k] = -q.dev[k]; }
  if(p.world){ const w = {};
    for(const k in p.world){ const v = p.world[k];
      if(k === 'ankle_marks') w[k] = {at: v.at.map(c => [c[0], -c[1]]), hi: v.hi};
      else if(k === 'ankle_band') w[k] = Object.assign({}, v, {anchor:MZ(v.anchor), segs:v.segs.map(sg => [MZ(sg[0]), MZ(sg[1])])});
      else if(v && typeof v === 'object') w[k] = Object.assign({}, v, {z: -(v.z||0)});
      else w[k] = v; }
    q.world = w; }
  if(p.carry) q.carry = p.carry.map(c => Object.assign({}, c, Array.isArray(c.at) ? {at:MZ(c.at)} : {}, c.off ? {off:MZ(c.off)} : {}, Array.isArray(c.axis) ? {axis:MZ(c.axis)} : {}));
  return q;
}
const sided = fn => (s, o, t) => { const p = fn(s, o || {}, t || 0); return (o && o.side === 'R') ? mirror(p) : p; };
const sidedFrame = F => o => { const f = typeof F === 'function' ? F(o || {}) : F; return (o && o.side === 'R') ? Object.assign({}, f, {tz: -(f.tz||0)}) : f; };

/* ------------------------------------------------------------------ accessoires */
function seg(m, a, b){
  const d = new THREE.Vector3(b[0]-a[0], b[1]-a[1], b[2]-a[2]), L = d.length();
  m.position.set((a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
  m.scale.set(1, Math.max(L, 1e-4), 1);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize());
}
/* élastique : ancrage (poteau bas facultatif) + brins.
   spec : {anchor:[x,y,z], post:bool, segs:[[p, q], …]} (jusqu'à 6 brins) */
Rig.prop('ankle_band', {
  make(c){ const T = c.THREE, g = new T.Group();
    const post = c.mk(new T.BoxGeometry(.07, 1, .07), c.mats.mach); g.add(post);
    const base = c.mk(new T.BoxGeometry(.30, .03, .30), c.mats.mach); g.add(base);
    const band = []; for(let i=0;i<6;i++){ const m = c.mk(new T.CylinderGeometry(.009, .009, 1, 8), c.mats.band); g.add(m); band.push(m); }
    g.userData = {post, base, band};
    return g; },
  update(g, s){ const {post, base, band} = g.userData, A = s.anchor;
    post.visible = base.visible = !!s.post;
    if(s.post){ const ph = A[1] + .10; post.scale.y = ph; post.position.set(A[0] - .045, ph/2, A[2]); base.position.set(A[0] - .045, .015, A[2]); }
    band.forEach((m, i) => { const sg = s.segs[i]; m.visible = !!sg; if(sg) seg(m, sg[0], sg[1]); });
  }
});
/* repères plats au sol (pastilles) ; hi = index de la pastille mise en valeur */
Rig.prop('ankle_marks', {
  make(c){ const T = c.THREE, g = new T.Group();
    for(let i=0;i<5;i++){ const d = new T.Mesh(new T.CylinderGeometry(.085, .085, .006, 28), i === 0 ? c.M(0x9AA3AD, .8) : c.mats.cone); d.receiveShadow = true; g.add(d); }
    return g; },
  update(g, s){ g.children.forEach((d, i) => { const p = s.at[i]; d.visible = !!p; if(p) d.position.set(p[0], .003, p[1]); }); }
});
/* ligne au sol (ruban) le long de x */
Rig.prop('ankle_line', {
  make(c){ const m = new c.THREE.Mesh(new c.THREE.BoxGeometry(1, .004, .035), c.M(0xE8E2D0, .8)); m.receiveShadow = true; return m; },
  update(m, s){ m.scale.x = s.len || 1.2; m.position.set(s.x || 0, .002, s.z || 0); }
});
/* mur latéral (appui d'une main) */
Rig.prop('ankle_wall', {
  make(c){ const m = c.mk(new c.THREE.BoxGeometry(1, 1, 1), c.mats.wall); return m; },
  update(m, s){ const L = s.len || 1.3, H = s.h || 2.1, T = .1; m.scale.set(L, H, T); m.position.set(s.x || 0, H/2, s.z + (s.z > 0 ? T/2 : -T/2)); }
});

/* ================================================================ 1. mobilisation de cheville en demi-genou
   Genou droit au sol, pied gauche devant à plat. Le genou gauche avance au-dessus des orteils, talon collé au sol. */
const MB = {XK:-.30, KY:.045, XA:.045, ZA:.13};
function mobPose(a){
  const sh = lerp(10, 36, a)*D2R;                                   // inclinaison du tibia vers l'avant
  const A = [MB.XA, .075, MB.ZA];
  const k = [A[0] + SH*Math.sin(sh), A[1] + SH*Math.cos(sh)];       // genou avant (plan sagittal)
  let px = k[0] - TH, py = .49;
  for(let i=0;i<4;i++){ py = MB.KY + Math.sqrt(TH*TH - (px - MB.XK)**2); px = k[0] - Math.sqrt(Math.max(0, TH*TH - (k[1] - py)**2)); }
  return {A, k, pc:[px, py, 0]};
}
const MOBK = [{u:0,a:0},{u:.40,a:1,hold:true},{u:.62,a:1},{u:1,a:0}];
function mobBase(s, o){
  const a = kf(MOBK, s).a, P = mobPose(a), pc = P.pc, k = P.k;
  const KR = [MB.XK, MB.KY, -.11], AR = [MB.XK - .445, MB.KY + .10, -.11];
  const legs = {
    L: leg(P.A, OUT_L, 0, 0, [OUT_L[0], 0, OUT_L[1]]),
    R: {ankle:AR, toe:[AR[0] + .04, .02, -.11], pole:[.3,-1,0], toeFlex:65}
  };
  const load = o.load === 'kb';
  const tilt = load ? lerp(8, 18, a) : lerp(14, 30, a);
  let arms, carry;
  // haut de la cuisse gauche, près du genou
  const hip = [pc[0], pc[1], HIPZ], kk = [k[0], k[1], MB.ZA];
  const T = add3(lerp3(hip, kk, .72), [0, .075, 0]);
  if(load){
    const G = [T[0], T[1] + .215, T[2]];
    arms = {mode:'custom', curl:'grip', L:wArm(G[0], G[1], G[2] + .045, [-.5,-.6,1], 'grip'), R:wArm(G[0], G[1], G[2] - .045, [-.5,-.6,-1], 'grip')};
    carry = [{type:'kb', at:'gripMid', axis:'grip'}];
  } else {
    arms = {mode:'custom', curl:'loose',
      L: wArm(kk[0] + .01, kk[1] + .075, kk[2] + .05, [-.3,-.6,1]),
      R: wArm(kk[0] - .02, kk[1] + .08, kk[2] - .05, [-.3,-.6,-1])};
  }
  return {pc, tilt, dev:{}, gaze:[k[0] + .5, 0], gazeK:.45, legs, arms, carry, a, k, P,
    focus:['calves', 'shins'], phase: s < .40 ? 0 : s < .62 ? 1 : 2};
}
function anklemob(s, o){
  const p = mobBase(s, o); delete p.a; delete p.k; delete p.P;
  p.world = {mat:{x:-.2, z:0}};
  return p;
}
function ankleband(s, o){
  const p = mobBase(s, o), A = p.P.A;
  // boucle basse autour de la cheville, tirée vers l'arrière par un poteau
  const lo = [A[0] + .005, A[1] + .045, A[2]];
  const An = [-.68, .10, MB.ZA], a = [lo[0] - .01, lo[1], lo[2] + .042], b = [lo[0] - .01, lo[1], lo[2] - .042], c = [lo[0] + .045, lo[1] + .005, lo[2]];
  const band = {anchor:An, post:true, segs:[[[An[0], An[1], An[2] + .012], a], [[An[0], An[1], An[2] - .012], b], [a, c], [c, b]]};
  delete p.a; delete p.k; delete p.P;
  p.world = {mat:{x:-.2, z:0}, ankle_band:band};
  return p;
}

/* ================================================================ 2. alphabet de la cheville (assis sur un banc, jambe gauche tendue) */
const AB_SEAT = .45, AB_PC = [-.18, .545, 0];
const LETTERS = [
  // A
  [[0,0],[.5,1],[1,0],[.78,.45],[.22,.45]],
  // B
  [[.1,0],[.1,1],[.75,.88],[.75,.6],[.1,.5],[.85,.38],[.85,.1],[.1,0]],
  // C
  [[1,.85],[.55,1],[.08,.72],[.08,.28],[.55,0],[1,.15]]
];
const AB_KEYS = (() => { const pts = []; for(const L of LETTERS){ for(const p of L) pts.push(p); }
  pts.push(LETTERS[0][0]);
  const d = [0]; for(let i=1;i<pts.length;i++) d.push(d[i-1] + Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
  return pts.map((p, i) => ({u:d[i]/d[d.length-1], q:p[0], p:p[1]})); })();
function anklealpha(s, o){
  const k = kf(AB_KEYS, s);
  const pc = AB_PC.slice();
  const beta = 8*D2R, Ld = [Math.cos(beta), -Math.sin(beta), 0];          // direction de la jambe tendue
  const hipL = [pc[0], pc[1], HIPZ];
  const aL = [hipL[0] + .885*Ld[0], hipL[1] + .885*Ld[1], .15];
  const F0 = [Math.sin(beta), Math.cos(beta), 0];                          // pied neutre : pointe vers le haut
  const pp = lerp(.75, -.32, k.p), qq = lerp(-.42, .42, k.q);             // bas de la lettre = pointe tendue
  const F = nrm3(add3(add3(F0, Ld, pp), [0, 0, 1], qq));
  const toe = add3(aL, F, .2);
  // dessus du pied tourné vers le corps, avec une légère rotation (inversion / éversion)
  const back = [-Ld[0], -Ld[1], 0], D0 = nrm3(add3(back, F, -dot(back, F)));
  const r = -qq*.8, S = nrm3(add3(add3([0,0,0], D0, Math.cos(r)), cross(F, D0), Math.sin(r)));
  return {
    pc, tilt:12, dev:{thup:4}, gaze:[aL[0] + .1, aL[1]], gazeK:.6,
    legs:{L:{ankle:aL, toe, pole:[0, 1, .1], toeFlex:0, sole:S},
          R:flat(.20, .075, -.17, OUT_R)},
    // mains croisées sous la cuisse gauche, près du genou : elles soutiennent la jambe
    arms:{mode:'custom', curl:'grip',
      L: wArm(hipL[0] + .30, hipL[1] - .07, .19, [-.2, -1, .8]),
      R: wArm(hipL[0] + .27, hipL[1] - .075, .07, [-.2, -1, -.6])},
    world:{bench:{x0:-.62, x1:.06, h:AB_SEAT, z:0, w:.62}},
    focus:['calves', 'shins']
  };
}

/* ================================================================ 3. marche sur les talons / sur les pointes (sur place) */
const HT_W = {heels:{p:-24, tab:HEEL}, toes:{p:48, tab:FORE}};
/** fenêtre w ∈ [0,1] : deux pas (gauche puis droite) ; ramp = mise en place de l'appui (0 → 1) */
function htFoot(mode, w, side, ramp){
  const z = side*.12, h = side > 0 ? OUT_L : OUT_R;
  const liftK = side > 0 ? bump(w, .27, .15) : bump(w, .73, .15);
  const P = HT_W[mode], ph = P.p*ramp;
  const r = tab(P.tab, ph);
  const cx = .103;                                            // point d'appui de référence (pied à plat)
  // talons : appui sous le talon, pointe relevée ; pointes : appui sous l'avant-pied
  const ay = r[1] + liftK*.07;
  const ax = mode === 'heels' ? lerp(0, cx - (-.019) - .103, ramp)*0 : cx - lerp(.103, r[2], ramp);
  const flex = mode === 'toes' ? ph*(1 - liftK*.6) : 0;
  const knee = liftK;
  return {l: leg([ax, ay, z], h, ph, flex, [h[0], -.05*knee, h[1]]), lift:liftK};
}
function heeltoewalk(s, o){
  const mode = o.mode;
  let w, ramp, m;
  if(mode === 'heels' || mode === 'toes'){ m = mode; w = (s*2) % 1; ramp = 1; }
  else { m = s < .5 ? 'heels' : 'toes'; w = (s*2) % 1; ramp = sm(clamp(w/.1, 0, 1))*sm(clamp((1 - w)/.1, 0, 1)); w = clamp((w - .1)/.8, 0, 1); }
  const L = htFoot(m, w, 1, ramp), R = htFoot(m, w, -1, ramp);
  // bassin : jambe d'appui presque tendue, léger transfert latéral
  const shift = (R.lift - L.lift)*.035;
  const stanceY = Math.min(L.l.ankle[1] + (L.lift > .01 ? .2 : 0), R.l.ankle[1] + (R.lift > .01 ? .2 : 0));
  const py = stanceY + .875;
  const swing = L.lift - R.lift;
  const toes = m === 'toes';
  return {
    pc:[-.01, py, shift], tilt: toes ? lerp(6, 3, ramp) : 6, dev:{}, gaze:[3, 1.3], gazeK:.4,
    legs:{L:L.l, R:R.l},
    arms:{mode:'custom', curl:'loose',
      L: arm(.05 - swing*.10, -.56, .05, [-1, 0, .3]),
      R: arm(.05 + swing*.10, -.56, -.05, [-1, 0, -.3])},
    focus: toes ? ['calves'] : ['shins'],
    phase: w < .5 ? 0 : 3
  };
}

/* ================================================================ 4. inversion / éversion contre un élastique (assis au sol, jambes tendues) */
const IV_PC = [-.55, .09, 0];
const IVK = [{u:0,k:0},{u:.40,k:1,hold:true},{u:.55,k:1},{u:1,k:0}];
function invev(s, o){
  const out = o.dir === 'out';
  const k = kf(IVK, s).k, th = (out ? -18 : 28)*k*D2R;
  const pc = IV_PC.slice();
  const aL = [pc[0] + .87, .072, .15], aR = [pc[0] + .87, .072, -.15];
  const F0 = nrm3([Math.sin(12*D2R), Math.cos(12*D2R), 0]);
  const n0 = nrm3([Math.cos(12*D2R), -Math.sin(12*D2R), 0]);          // plante du pied (vers l'avant)
  const n = nrm3(add3(add3([0,0,0], n0, Math.cos(th)), cross(F0, n0), Math.sin(th)));
  const F = nrm3(add3(F0, [0, 0, -.25*Math.sin(th)*1.6], 1));
  const Fz = nrm3(add3(F, n, -dot(F, n)));
  const toeL = add3(aL, Fz, .2);
  const legs = {
    L:{ankle:aL, toe:toeL, pole:[0, 1, .05], toeFlex:0, sole:[-n[0], -n[1], -n[2]]},
    R:{ankle:aR, toe:add3(aR, nrm3([.25, 1, -.12]), .2), pole:[0, 1, -.05], toeFlex:0}
  };
  // élastique autour de l'avant-pied : ancré à l'extérieur (inversion) ou autour des deux pieds (éversion)
  const fl = add3(aL, Fz, .13), fr = add3(aR, nrm3([.25, 1, -.12]), .13);
  let band;
  if(out){ // boucle autour des deux avant-pieds (passe côté dessus et côté plante)
    const Ll = add3(fl, [0, 0, .045]), Rl = add3(fr, [0, 0, -.045]), d = [-.035, .01, 0], pl = [.035, -.01, 0];
    band = {anchor:fr, post:false, segs:[[add3(Rl, d), add3(Ll, d)], [add3(Rl, pl), add3(Ll, pl)], [add3(Ll, d), add3(Ll, pl)], [add3(Rl, d), add3(Rl, pl)]]};
  } else { // ancré à l'extérieur : l'élastique tire le pied vers l'extérieur, on tourne la plante vers l'intérieur
    const An = [fl[0] + .05, .16, .72], m = add3(fl, [0, 0, -.045]), d = [-.035, .01, 0], pl = [.035, -.01, 0];
    band = {anchor:An, post:true, segs:[[[An[0], An[1] + .01, An[2]], add3(add3(fl, [0, 0, .04]), d)], [[An[0], An[1] - .01, An[2]], add3(add3(fl, [0, 0, .04]), pl)],
      [add3(add3(fl, [0, 0, .04]), d), add3(m, d)], [add3(add3(fl, [0, 0, .04]), pl), add3(m, pl)], [add3(m, d), add3(m, pl)]]};
  }
  return {
    pc, tilt:6, dev:{lum:3}, gaze:[aL[0] + .1, .2], gazeK:.5,
    legs,
    // assis grand, mains posées sur le haut des cuisses
    arms:{mode:'custom', curl:'loose',
      L: wArm(pc[0] + .30, .20, .15, [-.3, -.4, 1]),
      R: wArm(pc[0] + .30, .20, -.15, [-.3, -.4, -1])},
    world:{mat:{x:-.15, z:0}, ankle_band:band},
    focus:['shins', 'calves'],
    phase: s < .4 ? 2 : s < .55 ? 1 : 0
  };
}

/* ================================================================ 5. petits sauts latéraux au-dessus d'une ligne */
const LH = {
  two:[{u:0,p:36,y:0},{u:.13,p:26,y:-.015},{u:.28,p:44,y:0},{u:.30,p:46,y:.005},{u:.65,p:40,y:.06},{u:.98,p:36,y:.005},{u:1,p:36,y:0}]
};
function lathops(s, o){
  const single = !!o.single;
  const i = s < .5 ? 0 : 1, h = s < .5 ? s*2 : s*2 - 1;
  const A = i === 0 ? 1 : -1, B = -A;
  const CZ = single ? .11 : .14;
  const k = kf(LH.two, h);
  const air = h > .29 && h < .99;
  const mv = sm(clamp((h - .29)/.69, 0, 1));
  const cz = lerp(A*CZ, B*CZ, mv);
  const lift = Math.max(0, k.y);
  const footAt = (fz, h2) => {
    const aF = fore(.103, lift, fz, h2, k.p), aT = tip(.14, lift, fz, h2, k.p), m = clamp(lift/.03, 0, 1);
    return leg(lerp3(aF, aT, m), h2, k.p, lerp(k.p, k.p*.25, m), [h2[0], 0, h2[1]]);
  };
  let legs, pc;
  if(single){
    const L = footAt(cz, OUT_L);
    pc = [-.05, L.ankle[1] + .865 + Math.min(0, k.y), cz - .02];
    const aR = [pc[0] - .17, pc[1] - .60, pc[2] - .15];
    legs = {L, R:leg(aR, FWD, 30, 0, [1, -.3, -.1])};
  } else {
    const L = footAt(cz + .08, OUT_L), R = footAt(cz - .08, OUT_R);
    pc = [-.03, L.ankle[1] + .87 + Math.min(0, k.y), cz];
    legs = {L, R};
  }
  const lean = (B - A)*mv*(1 - mv)*4;
  return {
    pc, tilt:6, dev:{bend: -lean*3}, gaze:[3, 1.2], gazeK:.45,
    legs,
    arms:{mode:'custom', curl:'loose',
      L: arm(.18, -.40 + lift*.8, .02, [-1, -.4, .3]),
      R: arm(.18, -.40 + lift*.8, -.02, [-1, -.4, -.3])},
    world:{ankle_line:{x:.05, z:0, len:1.0}},
    focus:['calves', 'shins'],
    phase: air ? 2 : 3
  };
}

/* ================================================================ 6. sauts unipodaux multidirectionnels (jambe gauche)
   centre → avant → centre → côté → centre → arrière → centre, réception stabilisée à chaque fois */
const SH_C = [0, .10], SH_PTS = [SH_C, [.30, .10], SH_C, [0, .40], SH_C, [-.28, .10], SH_C];
const HOP = [
  {u:0,   fx:20, tilt:6,  lift:0,   p:0,  fl:0,  mv:0,   arm:0},
  {u:.08, fx:20, tilt:6,  lift:0,   p:0,  fl:0,  mv:0,   arm:0},
  {u:.22, fx:50, tilt:26, lift:0,   p:0,  fl:0,  mv:0,   arm:-1},
  {u:.30, fx:26, tilt:14, lift:0,   p:45, fl:45, mv:.04, arm:1},
  {u:.42, fx:14, tilt:10, lift:.10, p:30, fl:6,  mv:.5,  arm:1},
  {u:.54, fx:24, tilt:12, lift:.02, p:16, fl:6,  mv:1,   arm:.6},
  {u:.63, fx:52, tilt:30, lift:0,   p:0,  fl:0,  mv:1,   arm:.3, hold:true},
  {u:.88, fx:52, tilt:30, lift:0,   p:0,  fl:0,  mv:1,   arm:.3},
  {u:1,   fx:20, tilt:6,  lift:0,   p:0,  fl:0,  mv:1,   arm:0}
];
function slhopmulti(s, o){
  const n = SH_PTS.length - 1, i = Math.min(n - 1, Math.floor(s*n)), h = s*n - i;
  const k = kf(HOP, h);
  const P0 = SH_PTS[i], P1 = SH_PTS[i+1];
  const m = k.mv > .04 && k.mv < 1 ? sm((k.mv - .04)/.96) : k.mv >= 1 ? 1 : 0;
  const cx = lerp(P0[0], P1[0], m), cz = lerp(P0[1], P1[1], m);
  const h2 = OUT_L;
  const base = [cx - .075, .075, cz];                           // cheville pied à plat centré sur la pastille
  let aL;
  if(k.lift < .004 && k.p > .5) aL = fore(base[0] + .103, 0, cz, h2, k.p);
  else if(k.lift >= .004){ const mm = clamp(k.lift/.03, 0, 1); aL = lerp3(fore(base[0] + .103, k.lift, cz, h2, k.p), tip(base[0] + .14, k.lift, cz, h2, k.p), mm); }
  else aL = base;
  const px = aL[0] - .06, pz = cz - .03;
  const pc = [px, pcY(px, pz, aL, 'L', k.fx), pz];
  const aR = [pc[0] - .17, pc[1] - .62, pc[2] - .15];
  const a = k.arm;
  const handFor = side => a < 0
    ? arm(lerp(.03, -.28, -a), lerp(-.58, -.48, -a), side*.08, [-1, .2, side*.3])
    : arm(lerp(.03, .30, a), lerp(-.58, -.16, a), side*lerp(.06, .14, a), [-.4, -1, side*.5]);
  return {
    pc, tilt:k.tilt, dev:{}, gaze:[2.6, .3], gazeK:.5,
    legs:{L: leg(aL, h2, k.p, k.fl, [h2[0], 0, h2[1]]), R: leg(aR, FWD, 30, 0, [1, -.3, -.1])},
    arms:{mode:'custom', curl:'loose', L:handFor(1), R:handFor(-1)},
    world:{ankle_marks:{at:[[SH_C[0], SH_C[1]], [.30, .10], [0, .40], [-.28, .10]]}},
    focus:['calves', 'quadsL', 'glutes'],
    phase: h < .30 ? 0 : h < .63 ? 2 : 3
  };
}

/* ================================================================ 7. descente excentrique du mollet sur une jambe (marche)
   monte sur 2 pieds, lève le droit, descend lentement sur le gauche, repose le droit en bas. */
const CE_H = .15, CE_MX = .14;
const CEK = [
  {u:0,   thL:0,   thR:0,   lift:0, sh:0},
  {u:.04, thL:0,   thR:0,   lift:0, sh:0},
  {u:.16, thL:30,  thR:30,  lift:0, sh:0},
  {u:.24, thL:30,  thR:30,  lift:1, sh:1},
  {u:.78, thL:-26, thR:-26, lift:1, sh:1},
  {u:.86, thL:-26, thR:-26, lift:0, sh:0},
  {u:.96, thL:0,   thR:0,   lift:0, sh:0},
  {u:1,   thL:0,   thR:0,   lift:0, sh:0}
];
function calfecc(s, o){
  const k = kf(CEK, s);
  const L = ballFoot(CE_MX, CE_H, .11, k.thL);
  const Rg = ballFoot(CE_MX, CE_H, -.11, k.thR);
  const pz = lerp(0, .07, k.sh);
  const pc = [L.ankle[0] - .03, L.ankle[1] + .882, pz];
  // pied droit : levé derrière (genou plié) pendant la descente sur une jambe
  const lifted = [pc[0] - .30, pc[1] - .50, pz - .15];
  const aR = lerp3(Rg.ankle, lifted, sm(k.lift));
  const R = k.lift > .02 ? {ankle:aR, toe:add3(aR, nrm3([-.4, -.9, 0]), .2), pole:[1, 0, -.1], toeFlex:0} : Rg;
  const wallZ = -.62;
  return {
    pc, tilt:1, dev:{}, gaze:[3, 1.6], gazeK:.4,
    legs:{L, R},
    arms:{mode:'custom', curl:'loose',
      L: wArm(pc[0] + .04, pc[1] + .09, pz + .20, [-.6, 0, 1]),
      R: wArm(pc[0] + .16, pc[1] + .45, wallZ + .025, [0, -1, 0], 'flat')},
    world:{step:{x:CE_MX - .03 + .2, h:CE_H, d:.4, w:.8}, ankle_wall:{x:.1, z:wallZ, len:1.3}},
    focus:['calves'],
    phase: s < .24 ? 2 : s < .78 ? 0 : 3
  };
}

/* ------------------------------------------------------------------ déclarations */
Rig.define('anklemob', sided(anklemob), {family:'ankle', cycle:3.2, frame:sidedFrame({tx:-.18, ty:.68, tz:0, H:1.52, W:1.3, el:10, az:20})});
Rig.define('ankleband', sided(ankleband), {family:'ankle', cycle:3.2, frame:sidedFrame({tx:-.19, ty:.67, tz:-.02, H:1.5, W:1.3, el:12, az:24})});
Rig.define('anklealpha', sided(anklealpha), {family:'ankle', cycle:9, frame:sidedFrame({tx:.22, ty:.74, tz:-.06, H:1.46, W:1.2, el:14, az:30})});
Rig.define('heeltoewalk', heeltoewalk, {family:'ankle', cycle:2.4, frame:{tx:.05, ty:.97, tz:0, H:2.12, W:1.0, el:8, az:30}});
Rig.define('invev', sided(invev), {family:'ankle', cycle:2.6, frame:sidedFrame({tx:-.10, ty:.51, tz:.04, H:1.26, W:1.3, el:22, az:40})});
Rig.define('lathops', lathops, {family:'ankle', cycle:.8, frame:{tx:.01, ty:1.0, tz:0, H:2.18, W:1.1, el:10, az:70}});
Rig.define('slhopmulti', sided(slhopmulti), {family:'ankle', cycle:6.3, frame:sidedFrame({tx:.08, ty:1.01, tz:.05, H:2.24, W:1.45, el:14, az:40})});
Rig.define('calfecc', sided(calfecc), {family:'ankle', cycle:5.5, frame:sidedFrame({tx:.01, ty:1.0, tz:-.06, H:2.32, W:1.4, el:8, az:62})});
})();
