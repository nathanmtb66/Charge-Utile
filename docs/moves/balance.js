/* Charge Utile — famille « balance » : proprioception genou / cheville et pliométrie légère.
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. Appui par défaut : jambe GAUCHE
   (o.side:'R' => miroir, appui jambe droite).
   Niveaux (fiches `progression`) :
     star         o.reach:'near' (facile) · défaut (moyen) · o.pad (coussin, difficile) · o.pad + o.load (hardcore)
     bosubalance  o.surface:'floor' · défaut (demi-swissball) · o.eyes:'closed' · o.surface:'flip' (+ o.ball)
     bosusquat    o.surface:'floor' · défaut · o.deep · o.surface:'flip'
     sllanding    défaut (sol) · o.bosu · o.dir:'side' — boxlanding (box 30 cm → demi-swissball)
     skatereasy · skater · skaterbosu · skaterhard */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ aides */
const TH = .445, SH = .456, HIPZ = .1125;
const nrm2 = (x, z) => { const l = Math.hypot(x, z) || 1; return [x/l, z/l]; };
/** distance hanche-cheville pour une flexion de genou donnée (°) */
const dKnee = f => Math.sqrt(TH*TH + SH*SH + 2*TH*SH*Math.cos(f*D2R));
/** hauteur du bassin pour que le genou d'appui soit fléchi de `f` degrés */
const pcY = (px, pz, ank, side, f) => { const hz = pz + (side === 'L' ? HIPZ : -HIPZ);
  const d = dKnee(f), dx = px - ank[0], dz = hz - ank[2]; return ank[1] + Math.sqrt(Math.max(.01, d*d - dx*dx - dz*dz)); };
/* tables mesurées sur le maillage : [inclinaison du pied °, hauteur de cheville au contact, avance du point de contact]
   FORE : sur l'avant du pied (orteils à plat, toeFlex = inclinaison) — TIP : touche du bout des orteils (toeFlex 0) */
const FORE = [[0,.075,.103],[20,.113,.099],[30,.129,.091],[40,.142,.068],[50,.150,.043],[60,.155,.017]];
const TIP  = [[0,.075,.103],[30,.160,.136],[40,.181,.106],[45,.190,.095],[60,.208,.046]];
const tab = (T, p) => { if(p <= T[0][0]) return T[0]; for(let i=1;i<T.length;i++) if(p <= T[i][0]){ const a = T[i-1], b = T[i], k = (p-a[0])/(b[0]-a[0]); return [p, lerp(a[1],b[1],k), lerp(a[2],b[2],k)]; } return T[T.length-1]; };
/** pied : cheville, direction horizontale h, inclinaison vers le bas phi (°), flexion des orteils */
const leg = (a, h, phi, flex, pole, sole) => { const c = Math.cos(phi*D2R), s = Math.sin(phi*D2R);
  const o = {ankle:a.slice(), toe:[a[0] + .2*h[0]*c, a[1] - .2*s, a[2] + .2*h[1]*c], pole, toeFlex:flex||0};
  if(sole) o.sole = sole; return o; };
/** pied à plat, genou dans l'axe du pied */
const flat = (x, y, z, h) => leg([x, y, z], h, 0, 0, [h[0], 0, h[1]]);
/** cheville telle que l'avant du pied touche le point (cx, cy, cz) */
const fore = (cx, cy, cz, h, phi) => { const r = tab(FORE, phi); return [cx - h[0]*r[2], cy + r[1], cz - h[1]*r[2]]; };
const tip  = (cx, cy, cz, h, phi) => { const r = tab(TIP, phi);  return [cx - h[0]*r[2], cy + r[1], cz - h[1]*r[2]]; };
const OUT_L = nrm2(1, .1), OUT_R = nrm2(1, -.1), FWD = [1, 0];
const K = (u, f) => Object.assign({u}, f);
const lerp3 = (a, b, k) => [0,1,2].map(i => lerp(a[i], b[i], k));

/* demi-swissball (world.bosu) : r .37 => sommet à y = .615 r ≈ .228 */
const BR = .37, TOP = .615*BR, SINK = .005;
/** rotation d'un point / d'une direction solidaire du dôme (Euler XYZ de three.js : Rx·Rz) */
function rotXZ(x, y, z, tx, tz){
  const x1 = x*Math.cos(tz) - y*Math.sin(tz), y1 = x*Math.sin(tz) + y*Math.cos(tz);
  return [x1, y1*Math.cos(tx) - z*Math.sin(tx), y1*Math.sin(tx) + z*Math.cos(tx)];
}
function onBosu(b, p, isDir){
  const tz = (b.tiltZ||0)*D2R, tx = (b.tiltX||0)*D2R;
  if(isDir) return rotXZ(p[0], p[1], p[2], tx, tz);
  const r = rotXZ(p[0] - b.x, p[1], p[2] - (b.z||0), tx, tz);
  return [r[0] + b.x, r[1], r[2] + (b.z||0)];
}
/* demi-swissball RETOURNÉ (plateau en haut, dôme au sol) : il roule sur son dôme.
   Rayon de courbure du bas du dôme : RC = r² / hauteur du dôme. */
const FL_HD = .183, FL_TH = .045, FL_TOP = FL_HD + FL_TH, FL_RC = BR*BR/FL_HD;
function onFlip(b, p, isDir){
  const tz = (b.tiltZ||0)*D2R, tx = (b.tiltX||0)*D2R;
  if(isDir) return rotXZ(p[0], p[1], p[2], tx, tz);
  const r = rotXZ(p[0] - b.x, p[1] - FL_RC, p[2] - (b.z||0), tx, tz);
  return [r[0] + b.x - FL_RC*tz, r[1] + FL_RC, r[2] + (b.z||0) + FL_RC*tx];
}
Rig.prop('balance_flip', {
  make(c){ const T = c.THREE, g = new T.Group();
    const dome = c.mk(new T.SphereGeometry(1, 40, 16, 0, Math.PI*2, Math.PI/2, Math.PI/2), c.mats.bosuTop);
    dome.scale.set(BR, FL_HD, BR); dome.position.y = FL_HD; g.add(dome);
    const plate = c.mk(new T.CylinderGeometry(BR, BR, FL_TH, 40), c.mats.bosuBase); plate.position.y = FL_HD + FL_TH/2; g.add(plate);
    for(const z of [-.2, .2]){ const h = c.mk(new T.BoxGeometry(.05, .012, .1), c.mats.dark); h.position.set(0, FL_TOP + .006, z*BR/.37*1.1); g.add(h); }
    return g; },
  update(g, s, c){ g.rotation.set((s.tiltX||0)*D2R, 0, (s.tiltZ||0)*D2R);
    const p = onFlip(s, [s.x, 0, s.z||0]); g.position.set(p[0], p[1], p[2]); }
});
/* coussin d'équilibre en mousse (50 × 42 cm, 6 cm) */
const PAD_H = .06;
Rig.prop('balance_pad', {
  make(c){ const m = c.mk(new c.THREE.BoxGeometry(.50, PAD_H, .42), c.M(0x1B4A40, .95)); return m; },
  update(m, s){ m.position.set(s.x, PAD_H/2, s.z||0); }
});

/** pied d'appui posé au centre d'une surface : 'floor' | 'bosu' | 'flip' | 'pad' */
function standFoot(kind, b, h){
  if(kind === 'floor') return flat(b.x - .075*h[0], .075, (b.z||0) - .075*h[1], h);
  if(kind === 'pad') return flat(b.x - .075*h[0], .075 + PAD_H - .008, (b.z||0) - .075*h[1], h);
  const top = kind === 'flip' ? FL_TOP : TOP - SINK, tr = kind === 'flip' ? onFlip : onBosu;
  const a0 = [b.x - .075*h[0], top + .075, (b.z||0) - .075*h[1]];
  const t0 = [a0[0] + .2*h[0], a0[1] - (kind === 'flip' ? 0 : .004), a0[2] + .2*h[1]];
  return {ankle:tr(b, a0), toe:tr(b, t0), pole:[h[0], 0, h[1]], toeFlex:0, sole:tr(b, [0,1,0], true)};
}

/* miroir gauche/droite (appui jambe droite) */
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
  if(p.headTurn) q.headTurn = -p.headTurn;
  if(p.headTilt) q.headTilt = -p.headTilt;
  if(p.world){ const w = {};
    for(const k in p.world){ const v = p.world[k];
      if(k === 'cones') w[k] = {at: v.at.map(c => [c[0], -c[1]])};
      else if(v && typeof v === 'object') w[k] = Object.assign({}, v, {z: -(v.z||0)}, v.tiltX ? {tiltX: -v.tiltX} : {});
      else w[k] = v; }
    q.world = w; }
  if(p.carry) q.carry = p.carry.map(c => Object.assign({}, c, Array.isArray(c.at) ? {at:MZ(c.at)} : {}, c.off ? {off:MZ(c.off)} : {}, Array.isArray(c.axis) ? {axis:MZ(c.axis)} : {}));
  if(p.focus) q.focus = p.focus.map(f => f === 'quadsL' ? 'quads' : f);
  return q;
}
const sided = fn => (s, o, t) => { const p = fn(s, o || {}, t || 0); return (o && o.side === 'R') ? mirror(p) : p; };
const sidedFrame = (F) => (o) => { const f = typeof F === 'function' ? F(o || {}) : F; return (o && o.side === 'R') ? Object.assign({}, f, {tz: -(f.tz||0)}) : f; };

/* bras : main relative à l'épaule */
const arm = (x, y, z, pole, curl) => ({hand:[x, y, z], pole, rel:'sh', curl: curl || 'loose'});
const armT = (up, fwd, z, pole, curl) => ({t:[up, fwd, z], pole, rel:'torso', curl: curl || 'grip'});

/* ================================================================ 1. étoile en Y (Y-balance)
   Appui jambe gauche au centre ; la droite touche 3 plots en triangle : devant, arrière-droite (postéro-médial),
   arrière-gauche (postéro-latéral, la jambe passe derrière la jambe d'appui). */
const starCache = {};
function starSet(o){
  const key = (o.reach === 'near' ? 'n' : 'f') + (o.pad ? 'p' : '');
  if(starCache[key]) return starCache[key];
  const near = o.reach === 'near', pad = !!o.pad;
  const A = [0, pad ? .075 + PAD_H - .008 : .075, .08];          // cheville d'appui
  const g = near ? .62 : 1;                                        // échelle des distances
  const dAnt = (near ? .40 : .58)*(pad ? .92 : 1), dPM = near ? .34 : .50, dPL = near ? .28 : .41;
  const HB = nrm2(1, -.25), HL = nrm2(1, .15);
  // points de contact au sol (bout du pied devant, avant du pied derrière)
  const TA = [dAnt, 0, 0.0];
  const TM = [A[0] - dPM*.707, 0, A[2] - dPM*.707];
  const TL = [A[0] - dPL*.707, 0, A[2] + dPL*.707];
  const fxA = near ? 42 : 64, fxP = near ? 38 : 60;
  const C  = {pc:[-.03, .06], fx:14, tilt:4, yaw:0, a:[-.01, pad ? .27 : .19, -.08], ph:30, h:[1, 0], fl:0};
  const FA = {pc:[near ? -.07 : -.12, .06], fx:fxA, tilt:near ? 12 : 20, yaw:0, a:tip(TA[0], 0, TA[2], FWD, 40), ph:40, h:[1, 0], fl:0};
  const FM = {pc:[-.04, .09], fx:fxP, tilt:near ? 28 : 42, yaw:8, a:fore(TM[0], 0, TM[2], HB, 50), ph:50, h:HB, fl:50};
  const MID = {pc:[-.03, .08], fx:near ? 30 : 36, tilt:near ? 14 : 20, yaw:6, a:[-.30, pad ? .26 : .22, .03], ph:25, h:HL, fl:0};
  const FL = {pc:[-.06, .10], fx:near ? 42 : 62, tilt:near ? 30 : 44, yaw:12, a:fore(TL[0], 0, TL[2], HL, 50), ph:50, h:HL, fl:50};
  const F = [K(0,C), K(.04,C), K(.13,FA), K(.18,FA), K(.28,C), K(.32,C), K(.42,FM), K(.47,FM),
             K(.57,C), K(.60,C), K(.67,MID), K(.74,FL), K(.79,FL), K(.86,MID), K(.93,C), K(1,C)];
  return starCache[key] = {F, A, TA, TM, TL, pad,
    cones:[[TA[0] + .13, TA[2]], [TM[0] - .03, TM[2] - .09], [TL[0] - .03, TL[2] + .09]],
    taps:[[.13,.18],[.42,.47],[.74,.79]]};
}
function star(s, o){
  const S = starSet(o), k = kf(S.F, s), A = S.A;
  const pc = [k.pc[0], pcY(k.pc[0], k.pc[1], A, 'L', k.fx), k.pc[1]];
  const h = nrm2(k.h[0], k.h[1]);
  const c = Math.cos(k.ph*D2R), sn = Math.sin(k.ph*D2R);
  const reach = clamp((k.fx - 14)/50, 0, 1);
  const tap = S.taps.some(([a, b]) => s >= a - .005 && s <= b + .005);
  const w = {cones:{at:S.cones}};
  if(S.pad) w.balance_pad = {x:A[0] + .075, z:A[2]};
  return {
    pc, tilt:k.tilt, yaw:k.yaw, dev:{pel:0, lum:0}, gaze:[1.7, .1], gazeK:.45,
    legs:{L: flat(A[0], A[1], A[2], OUT_L),
          R: leg(k.a, h, k.ph, k.fl, [lerp(1, .6, reach), -.1*reach, -.15], [h[0]*sn, c, h[1]*sn])},
    arms:{mode: o.load ? 'goblet' : 'hips'},
    world:w,
    focus:['quadsL', 'glutes', 'calves'], phase: s > .93 ? 3 : (tap ? 1 : 0)
  };
}

/* ================================================================ 2. équilibre sur une jambe (sol / demi-swissball / retourné) */
const BX = .06, BZ = .07;
/** petit rééquilibrage : inclinaisons de la surface + bassin (quasi-périodique, en secondes) */
const wob = (t, amp) => ({
  tz: amp*(1.3*Math.sin(t*1.9 + .8) + .6*Math.sin(t*3.3)),
  tx: amp*(1.5*Math.sin(t*1.35 + 2.0) + .5*Math.sin(t*2.7 + .3)),
  px: amp*(.004*Math.sin(t*1.9 + 2.2) + .002*Math.sin(t*2.9)),
  pz: amp*(.005*Math.sin(t*1.35 + .5)),
  fx: amp*(1.5*Math.sin(t*1.1 + 1))
});
const surfOf = o => o.surface === 'floor' ? 'floor' : o.surface === 'flip' ? 'flip' : 'bosu';
const AMP = {floor:.35, bosu:1, flip:2.4};
/** installation commune : jambe gauche d'appui fléchie de `f`°, jambe droite pliée */
function onSurface(kind, t, f, shift, amp, freeK){
  const w = wob(t, amp);
  const moving = kind === 'bosu' || kind === 'flip';
  const b = {x:BX, z:BZ, r:BR, tiltX: moving ? w.tx : 0, tiltZ: moving ? w.tz : 0};
  const L = standFoot(kind, b, OUT_L);
  // sur le plateau retourné, le bassin compense à l'opposé du roulis
  const comp = kind === 'flip' ? .35 : 0;
  const px = L.ankle[0] + .02 - shift + w.px + comp*(L.ankle[0] - (BX - .075)),
        pz = L.ankle[2] - .025 + w.pz + comp*(L.ankle[2] - BZ);
  const pc = [px, pcY(px, pz, L.ankle, 'L', f + w.fx), pz];
  const fk = freeK || 0;
  const aR = [pc[0] - lerp(.15, .02, fk), pc[1] - lerp(.67, .56, fk), pc[2] - .13];
  const R = leg(aR, FWD, 40, 0, [1, -.15, -.12]);
  const world = kind === 'bosu' ? {bosu:b} : kind === 'flip' ? {balance_flip:b} : {};
  return {b, pc, legs:{L, R}, w, world};
}
const BB_ARMS = [{u:0,k:1},{u:.18,k:1},{u:.40,k:0},{u:.55,k:0},{u:.66,k:1},{u:1,k:1}];
function bosubalance(s, o, t){
  const kind = surfOf(o);
  const d = onSurface(kind, t, 18, 0, AMP[kind]);
  const closed = o.eyes === 'closed';
  const sway = (kind === 'flip' ? .03 : .012)*Math.sin(t*1.6);
  let arms, carry;
  if(o.ball){
    // la balle arrive de devant, rattrapée bras tendus, ramenée à la poitrine, renvoyée
    const out = kf(BB_ARMS, s).k;                       // 0 = poitrine, 1 = bras devant
    const A = side => { const z = side * .105;
      const ch = [-.27, .31, z], fr = [-.22, .58, z];     // repère buste : [le long du buste, devant, z]
      return armT(lerp(ch[0], fr[0], out), lerp(ch[1], fr[1], out), z, [-.2, -1, side*.9]); };
    arms = {mode:'custom', curl:'grip', L:A(1), R:A(-1)};
    const G = [d.pc[0] + .60, d.pc[1] + .47, d.pc[2]];  // position des mains bras tendus (estimée)
    const P0 = [d.pc[0] + 1.35, d.pc[1] + .62, d.pc[2]];
    let fly = null;
    if(s < .18) fly = sm(s/.18);
    else if(s > .66 && s < .80) fly = 1 - sm((s - .66)/.14);
    if(fly === null && s >= .18 && s <= .66) carry = [{type:'ball', at:'gripMid', axis:'grip', off:[.03, 0, 0]}];
    else if(fly !== null){ const arc = .22*fly*(1 - fly)*4*(s < .5 ? .6 : 1);
      carry = [{type:'ball', at:'gripMid', axis:'z', off:[.03 + (P0[0]-G[0])*(1-fly), (P0[1]-G[1])*(1-fly) + arc, 0]}]; }
  } else if(closed){
    // yeux fermés : bras plus bas, près du corps
    arms = {mode:'custom', curl:'loose',
      L: arm(.03, -.585, .13 + sway*.5, [-.6, -.1, 1]),
      R: arm(.03, -.585, -.13 + sway*.5, [-.6, -.1, -1])};
  } else {
    const wide = kind === 'flip' ? .06 : 0;
    arms = {mode:'custom', curl:'loose',
      L: arm(.05, -.555 + wide*.6, .20 + wide + sway, [-.5, -.1, 1]),
      R: arm(.05, -.555 + wide*.6, -.20 - wide + sway, [-.5, -.1, -1])};
  }
  return {
    pc:d.pc, tilt:closed ? 1 : 3, dev:{}, gaze: closed ? [3, 1.66] : [2.2, .45], gazeK: closed ? .95 : .55,
    legs:d.legs, arms, carry,
    world:d.world,
    focus:['quadsL', 'calves', 'glutes', 'abs']
  };
}

/* ================================================================ 3. mini-squat une jambe (tempo) */
function bosusquat(s, o, t){
  const kind = surfOf(o), deep = !!o.deep;
  const e = s;                                   // 0 debout genou souple -> 1 genou à ~60° (75° en profond)
  const d = onSurface(kind, t, lerp(12, deep ? 76 : 60, e), lerp(0, deep ? .15 : .11, e), AMP[kind]*lerp(.6, .35, e), e);
  return {
    pc:d.pc, tilt:lerp(6, deep ? 38 : 30, e), dev:{pel:lerp(0, 3, e)}, gaze:[2.4, .5], gazeK:.6,
    legs:d.legs,
    arms:{mode:'custom', curl:'loose',
      L: arm(lerp(.46, .55, e), lerp(-.26, -.10, e), -.04, [-.2, -1, .6]),
      R: arm(lerp(.46, .55, e), lerp(-.26, -.10, e), .04, [-.2, -1, -.6])},
    world:d.world,
    focus:['quadsL', 'glutes', 'calves']
  };
}

/* ================================================================ 4. réception unipodale stabilisée */
const LAND = {fwd:{LX:.34, S0:0}, bosu:{LX:.425, S0:-.10}, side:{LX:.02, S0:0}};
function landFrames(mode){
  const bosu = mode === 'bosu', side = mode === 'side';
  const {LX, S0} = LAND[mode];
  const LY = bosu ? TOP + .075 - SINK : .075, LZ = side ? .50 : .09;
  const up = bosu ? TOP : 0;
  const fx = f => pcY(LX - .09, LZ - .03, [LX, LY, LZ], 'L', f);
  const st = {pc:[S0-.01,.955,0], tilt:2, aL:[S0,.075,.13], pL:0, fL:0, aR:[S0,.075,-.13], pR:0, fR:0, arm:0, rz:0};
  const X = o => Object.assign({}, st, o);
  const HOLD = side
    ? {pc:[LX-.09, fx(52), LZ-.05], tilt:32, aL:[LX, LY, LZ], pL:0, fL:0, aR:[LX-.18, .40, LZ-.24], pR:35, fR:0, arm:.5, rz:1}
    : {pc:[LX-.09, fx(52), LZ-.03], tilt:34, aL:[LX, LY, LZ], pL:0, fL:0, aR:[LX-.20, .40 + up, -.06], pR:35, fR:0, arm:.5, rz:1};
  const F = [
    K(0, st), K(.08, st),
    K(.17, X({pc:[S0-.13,.73,0], tilt:34, arm:-1})),
    K(.25, X({pc:[S0+(side ? -.02 : .06),1.01, side ? .08 : .01], tilt:14, aL:fore(S0+.103,0,.13,FWD,40), pL:40, fL:40, aR:fore(S0+.103,0,-.13,FWD,40), pR:40, fR:40, arm:.9}))
  ];
  if(side) F.push(
    K(.31, X({pc:[-.05, 1.08, .28], tilt:12, aL:[.02, .25, .40], pL:28, aR:[-.02, .30, .08], pR:35, arm:1})),
    K(.37, X({pc:[-.06, LY + .83, LZ-.09], tilt:16, aL:[LX, LY + .02, LZ], pL:12, aR:[LX-.12, .36, LZ-.26], pR:35, arm:.7})));
  else F.push(
    K(.31, X({pc:[(S0+LX)*.55, 1.08 + up*.7, .05], tilt:12, aL:[(S0+LX)*.6, .25 + up*.8, .11], pL:28, aR:[(S0+LX)*.35, .32 + up*.7, -.08], pR:35, arm:1})),
    K(.37, X({pc:[LX-.06, LY + .83, .06], tilt:14, aL:[LX, LY + .02, LZ], pL:12, aR:[LX-.16, .36 + up, -.07], pR:35, arm:.7})));
  F.push(K(.45, X(HOLD)), K(.74, X(HOLD)));
  if(side) F.push(
    K(.79, X({pc:[LX-.04, .93, LZ-.18], tilt:8, aL:[LX,LY,LZ], aR:[-.03, .20, .10], pR:15, arm:.2, rz:1})),
    K(.85, X({pc:[-.02, .92, .16], tilt:4, aL:[LX,LY,LZ], aR:[0, .075, -.13], rz:1})),
    K(.91, X({pc:[-.02, .93, .03], tilt:3, aL:[.01, .15, .31], pL:15, aR:[0, .075, -.13], rz:1})),
    K(.95, X({pc:[-.01, .95, .01], tilt:2, aL:[S0, .075, .13], aR:[0, .075, -.13]})),
    K(1, st));
  else if(!bosu) F.push(
    K(.80, X({pc:[LX-.03, fx(22), LZ-.06], tilt:6, aL:[LX,LY,LZ], aR:[LX+.02, .13, -.09], pR:10, rz:1})),
    K(.84, X({pc:[LX-.01, .95, 0], tilt:4, aL:[LX,LY,LZ], aR:[LX+.02, .075, -.09], rz:1})),
    K(.89, X({pc:[LX*.6, .93, -.05], tilt:3, aL:[LX*.5, .15, .12], pL:20, aR:[LX+.02, .075, -.09], rz:1})),
    K(.93, X({pc:[LX*.45, .93, -.02], tilt:3, aL:[S0, .075, .13], aR:[LX+.02, .075, -.09], rz:1})),
    K(.97, X({pc:[S0+.06, .95, .03], tilt:2, aL:[S0, .075, .13], aR:[LX*.5, .14, -.12], pR:20})),
    K(1, st));
  else F.push(
    K(.80, X({pc:[LX-.03, 1.00, -.02], tilt:8, aL:[LX,LY,LZ], aR:[LX+.02, .19, -.36], pR:15, rz:1})),
    K(.84, X({pc:[LX-.05, .955, -.12], tilt:8, aL:[LX,LY,LZ], aR:[LX+.02, .075, -.36], rz:1})),
    K(.875, X({pc:[.22, .92, -.12], tilt:6, aL:[.10, .37, .13], pL:0, aR:[LX+.02, .075, -.36], rz:1})),
    K(.90, X({pc:[.19, .91, -.08], tilt:6, aL:[-.08, .21, .13], pL:5, aR:[LX+.02, .075, -.36], rz:1})),
    K(.92, X({pc:[.17, .90, -.04], tilt:5, aL:[S0, .075, .13], aR:[LX+.02, .075, -.36], rz:1})),
    K(.96, X({pc:[S0+.10, .95, .04], tilt:3, aL:[S0, .075, .13], aR:[.10, .15, -.30], pR:20})),
    K(1, st));
  return F;
}
const LANDF = {fwd: landFrames('fwd'), bosu: landFrames('bosu'), side: landFrames('side')};
const landMode = o => o.dir === 'side' ? 'side' : o.bosu ? 'bosu' : 'fwd';
/* bras : -1 en arrière (élan), 1 devant-haut, .5 écartés pour l'équilibre */
const swingArm = (a, side) => a < 0
  ? arm(lerp(.03, -.28, -a), lerp(-.60, -.50, -a), side*lerp(.03, .06, -a), [-1, .2, side*.3])
  : arm(lerp(.03, .40, Math.min(1, a*1.4)) - (a > .6 ? (a - .6)*.3 : 0), lerp(-.60, -.12, a), side*lerp(.03, .10, a), [-.4, -1, side*.5]);
function sllanding(s, o){
  const mode = landMode(o), F = LANDF[mode];
  const k = kf(F, s);
  const {LX, S0} = LAND[mode];
  if(s > .17 && s < .25){ k.aL = fore(S0 + .103, 0, .13, FWD, k.pL); k.aR = fore(S0 + .103, 0, -.13, FWD, k.pR); } // impulsion : l'avant du pied reste au sol
  const hL = k.rz > .5 ? OUT_L : FWD;
  return {
    pc:k.pc, tilt:k.tilt, dev: mode === 'side' ? {bend: -6*clamp(k.rz, 0, 1)*(s < .78 ? 1 : 0)} : {}, gaze:[LX + 2, .3], gazeK:.55,
    legs:{L: leg(k.aL, hL, k.pL, k.fL, [hL[0], 0, hL[1] + .05]),
          R: leg(k.aR, FWD, k.pR, k.fR, [1, 0, -.15])},
    arms:{mode:'custom', curl:'loose', L:swingArm(k.arm, 1), R:swingArm(k.arm, -1)},
    world: mode === 'bosu' ? {bosu:{x:LX + .075, z:.09, r:BR}} : {},
    focus:['quadsL', 'glutes', 'calves'],
    phase: s < .25 ? 0 : s < .45 ? 2 : s < .8 ? 3 : 0
  };
}

/* ---- 4b. saut depuis une box (30 cm) et réception sur une jambe sur demi-swissball ---- */
const BXH = .30, BXX = -.40, BXA = -.42, BLX = .22, BLZ = .09, BLY = TOP + .075 - SINK;
const BXT = BXH + .075;
const bfx = f => pcY(BLX - .09, BLZ - .03, [BLX, BLY, BLZ], 'L', f);
const BST = {pc:[BXA-.01, BXH+.955, 0], tilt:2, aL:[BXA,BXT,.13], pL:0, fL:0, aR:[BXA,BXT,-.13], pR:0, fR:0, arm:0, rz:0};
const BX_ = o => Object.assign({}, BST, o);
const BHOLD = {pc:[BLX-.09, bfx(55), BLZ-.03], tilt:34, aL:[BLX, BLY, BLZ], aR:[BLX-.20, .64, -.06], pR:35, arm:.5, rz:1};
const BOXF = [
  K(0, BST), K(.06, BST),
  K(.15, BX_({pc:[BXA-.13, BXH+.73, 0], tilt:34, arm:-1})),
  K(.22, BX_({pc:[BXA+.06, BXH+1.01, .01], tilt:14, aL:fore(BXA+.103,BXH,.13,FWD,40), pL:40, fL:40, aR:fore(BXA+.103,BXH,-.13,FWD,40), pR:40, fR:40, arm:.9})),
  K(.29, BX_({pc:[-.14, 1.40, .04], tilt:12, aL:[-.12, .60, .11], pL:28, aR:[-.22, .66, -.08], pR:35, arm:1})),
  K(.36, BX_({pc:[BLX-.06, BLY + .83, .06], tilt:14, aL:[BLX, BLY + .02, BLZ], pL:12, aR:[BLX-.16, .60, -.07], pR:35, arm:.7})),
  K(.44, BX_(BHOLD)), K(.68, BX_(BHOLD)),
  // retour : grand pas en arrière du pied droit sur la box, puis le gauche
  K(.74, BX_({pc:[BLX-.10, bfx(40), 0], tilt:14, aL:[BLX,BLY,BLZ], aR:[-.12, .56, -.13], pR:10, arm:.3, rz:1})),
  K(.80, BX_({pc:[-.10, 1.05, -.02], tilt:10, aL:[BLX,BLY,BLZ], aR:[BXA+.02, BXT, -.13], arm:0, rz:1})),
  K(.84, BX_({pc:[-.20, 1.12, -.04], tilt:8, aL:fore(BLX+.103, TOP - .004, BLZ, OUT_L, 35), pL:35, fL:35, aR:[BXA+.02, BXT, -.13], rz:1})),
  K(.89, BX_({pc:[-.32, 1.23, -.03], tilt:5, aL:[-.06, .50, .12], pL:15, aR:[BXA+.02, BXT, -.13]})),
  K(.94, BX_({pc:[BXA-.01, BXH+.95, -.01], tilt:3, aL:[BXA, BXT, .13], aR:[BXA+.02, BXT, -.13]})),
  K(1, BST)
];
function boxlanding(s, o){
  const k = kf(BOXF, s);
  if(s > .15 && s < .22){ k.aL = fore(BXA + .103, BXH, .13, FWD, k.pL); k.aR = fore(BXA + .103, BXH, -.13, FWD, k.pR); }
  const hL = k.rz > .5 ? OUT_L : FWD;
  return {
    pc:k.pc, tilt:k.tilt, dev:{}, gaze:[BLX + 2, .35], gazeK:.55,
    legs:{L: leg(k.aL, hL, k.pL, k.fL, [hL[0], 0, hL[1] + .05]),
          R: leg(k.aR, FWD, k.pR, k.fR, [1, 0, -.15])},
    arms:{mode:'custom', curl:'loose', L:swingArm(k.arm, 1), R:swingArm(k.arm, -1)},
    world:{box:{x:BXX, z:0, h:BXH, w:.6, d:.5}, bosu:{x:BLX + .075, z:BLZ, r:BR}},
    focus:['quadsL', 'glutes', 'calves'],
    phase: s < .22 ? 0 : s < .44 ? 2 : s < .74 ? 3 : 0
  };
}

/* ================================================================ 5. sauts latéraux (skater hops)
   Demi-cycle : stable sur la droite (z<0) -> saut vers la gauche -> stable sur la gauche. 2e moitié = miroir.
   P = {D : demi-distance, fly : durée du vol, hold : tenue (s), bosu : réceptions sur demi-swissball, apex : montée du bassin} */
function skaterSet(P){
  const D = P.D, bosu = !!P.bosu;
  const AY = bosu ? TOP + .075 - SINK : .075, up = AY - .075;
  const fL = f => pcY(-.12, D - .03, [0, AY, D], 'L', f);
  const fR = f => pcY(-.12, -(D - .03), [0, AY, -D], 'R', f);
  const push = fore(.103*OUT_R[0], up, -D + .103*OUT_R[1], OUT_R, 50);
  const T = [0, P.load, P.load + P.push, P.load + P.push + P.fly*.55, P.load + P.push + P.fly, 0, 0, 0];
  T[5] = T[4] + .12; T[6] = T[5] + P.hold; T[7] = T[6] + .19;
  const tot = T[7], u = i => T[i]/tot;
  const STL = {pc:[-.12, fL(50), D-.03], tilt:32, aL:[0,AY,D], pL:0, fL:0, aR:[-.34, AY+.135, D-.10], pR:30, fR:0, arm:1};
  const F = [
    {u:0, pc:[-.12, fR(50), -(D-.03)], tilt:32, aL:[-.34, AY+.135, -(D-.10)], pL:30, fL:0, aR:[0,AY,-D], pR:0, fR:0, arm:-1},
    {u:u(1), pc:[-.14, fR(64), -(D-.05)], tilt:38, aL:[-.28, AY+.105, -(D-.14)], pL:30, fL:0, aR:[0,AY,-D], pR:0, fR:0, arm:-1},
    {u:u(2), pc:[-.07, AY + .875, -D*.42], tilt:26, aL:[-.10, AY + .185, -.02], pL:25, fL:0, aR:push, pR:50, fR:50, arm:0},
    {u:u(3), pc:[-.05, AY + .985 + P.apex, D*.13], tilt:20, aL:[-.02, AY + .195 + P.apex*.8, D-.12], pL:22, fL:0, aR:[-.14, AY + .255 + P.apex*.8, -D*.47], pR:35, fR:0, arm:.7},
    {u:u(4), pc:[-.07, AY + .825, D-.10], tilt:26, aL:[0, AY+.01, D], pL:6, fL:0, aR:[-.22, AY+.195, D*.13], pR:35, fR:0, arm:1, hold:true},
    Object.assign({u:u(5), hold:true}, STL, {pc:[-.12, fL(62), D-.03], tilt:34, aR:[-.34, AY+.125, D-.10]})
  ];
  if(P.hold > .02) F.push(Object.assign({u:u(6)}, STL, {pc:[-.12, fL(58), D-.03], tilt:33, aR:[-.34, AY+.13, D-.10]}));
  F.push(Object.assign({u:1}, STL));
  return {F, D, AY, up, bosu, uPush:u(2), uLand:u(4), tot};
}
function skaterHalf(S, uu){
  const k = kf(S.F, uu);
  const onL = uu > S.uLand - .02, onR = uu < S.uPush + .01;
  const hL = onL ? OUT_L : FWD, bl = clamp((uu - S.uPush)/.12, 0, 1), hR = nrm2(lerp(OUT_R[0], 1, bl), lerp(OUT_R[1], 0, bl));
  if(uu <= S.uPush){ k.aR = fore(.103*OUT_R[0], S.up, -S.D + .103*OUT_R[1], OUT_R, k.pR); } // impulsion : l'avant du pied reste en appui
  const b = (k.arm + 1)/2; // 0 : bras gauche devant en travers, 1 : bras droit devant en travers
  const L = arm(lerp(.40, -.36, b), lerp(-.30, -.40, b), lerp(-.30, .08, b), [-.6, -.3, .8]);
  const R = arm(lerp(-.36, .40, b), lerp(-.40, -.30, b), lerp(-.08, .30, b), [-.6, -.3, -.8]);
  const p = {
    pc:k.pc, tilt:k.tilt, dev:{}, gaze:[2.4, .3], gazeK:.5,
    legs:{L: leg(k.aL, hL, k.pL, k.fL, onL ? [hL[0], 0, hL[1]] : [1, -.3, .1]),
          R: leg(k.aR, hR, k.pR, k.fR, onR ? [hR[0], 0, hR[1]] : [1, -.3, -.1])},
    arms:{mode:'custom', curl:'loose', L, R},
    focus:['glutes', 'quads', 'calves', 'adductors'],
    phase: uu < S.uPush ? 0 : uu < S.uLand ? 2 : 3
  };
  if(S.bosu) p.world = {bosu:{x:.075, z:S.D, r:BR}, bosu2:{x:.075, z:-S.D, r:BR}};
  return p;
}
const makeSkater = S => (s) => { const p = s < .5 ? mirror(skaterHalf(S, s*2)) : skaterHalf(S, s*2 - 1);
  if(S.bosu) p.world = {bosu:{x:.075, z:S.D, r:BR}, bosu2:{x:.075, z:-S.D, r:BR}};   // mêmes dômes des deux côtés
  return p; };
const SK_STD  = skaterSet({D:.38, load:.13, push:.14, fly:.24, hold:0,   apex:0});
const SK_EASY = skaterSet({D:.24, load:.16, push:.14, fly:.18, hold:2.0, apex:-.04});
const SK_BOSU = skaterSet({D:.50, load:.16, push:.15, fly:.30, hold:.9,  apex:.06, bosu:true});
const SK_HARD = skaterSet({D:.52, load:.09, push:.12, fly:.32, hold:3.0, apex:.08});

/* ================================================================ 6. pogo jumps — contact bref, chevilles raides */
const PG = [
  // u, hauteur des pieds (au-dessus du contact), inclinaison du pied, hauteur du bassin, bras
  {u:0,   lift:.06, p:50, py:1.13, arm:1},
  {u:.32, lift:0,   p:40, py:1.02, arm:.3},
  {u:.50, lift:0,   p:32, py:1.005, arm:0},
  {u:.66, lift:0,   p:44, py:1.03, arm:.35},
  {u:1,   lift:.06, p:50, py:1.13, arm:1}
];
function pogo(s){
  const k = kf(PG, s);
  const ft = side => { const cz = side*.12, h = side > 0 ? nrm2(1, .06) : nrm2(1, -.06);
    const m = clamp(k.lift/.03, 0, 1), aF = fore(.10, k.lift, cz, h, k.p), aT = tip(.14, k.lift, cz, h, k.p);
    return leg(lerp3(aF, aT, m), h, k.p, lerp(k.p, k.p*.2, m), [h[0], 0, h[1]]); };
  const a = k.arm;
  return {
    pc:[-.02, k.py, 0], tilt:4, dev:{}, gaze:[3, 1.2], gazeK:.5,
    legs:{L: ft(1), R: ft(-1)},
    arms:{mode:'custom', curl:'loose',
      L: arm(lerp(.18, .26, a), lerp(-.42, -.30, a), -.02, [-1, -.4, .3]),
      R: arm(lerp(.18, .26, a), lerp(-.42, -.30, a), .02, [-1, -.4, -.3])},
    focus:['calves', 'shins'], phase: s > .32 && s < .66 ? 2 : 0
  };
}

/* ================================================================ 7. drop jump (box 40 cm) — contact bref et élastique */
const DJ_H = .40, DJ_X = -.58, DJ_T = DJ_H + .075, DJ_A = DJ_X + .03;
const dj = (o) => Object.assign({pc:[DJ_A-.01, DJ_H+.955, 0], tilt:2, aL:[DJ_A,DJ_T,.13], pL:0, fL:0, aR:[DJ_A,DJ_T,-.13], pR:0, fR:0, arm:0}, o);
const DJF = [
  Object.assign({u:0}, dj({})),
  Object.assign({u:.06}, dj({})),
  // pas dans le vide (pied droit), le gauche quitte la box en dernier
  Object.assign({u:.14}, dj({pc:[DJ_A+.02, DJ_H+.945, .03], tilt:4, aR:[DJ_A+.30, DJ_T+.07, -.12], pR:20, arm:.2})),
  Object.assign({u:.20}, dj({pc:[-.30, 1.30, .01], tilt:5, aL:fore(DJ_A+.103, DJ_H, .13, FWD, 35), pL:35, fL:35, aR:[-.10, .46, -.13], pR:25, arm:.4})),
  Object.assign({u:.235}, dj({pc:[-.21, 1.24, 0], tilt:5, aL:[DJ_A+.15, DJ_T+.08, .13], pL:25, aR:[-.06, .39, -.13], pR:26, arm:.45})),
  Object.assign({u:.27}, dj({pc:[-.12, 1.16, 0], tilt:5, aL:[-.24, .38, .13], pL:30, aR:[-.02, .30, -.13], pR:28, arm:.5})),
  // contact bref (≈ 0,2 s) sur l'avant du pied, genoux peu fléchis, rebond vertical immédiat
  Object.assign({u:.30}, dj({pc:[-.03, 1.02, 0], tilt:5, aL:fore(.103,0,.13,FWD,28), pL:28, fL:28, aR:fore(.103,0,-.13,FWD,28), pR:28, fR:28, arm:.5})),
  Object.assign({u:.33}, dj({pc:[-.06, .92, 0], tilt:14, aL:fore(.103,0,.13,FWD,12), pL:12, fL:12, aR:fore(.103,0,-.13,FWD,12), pR:12, fR:12, arm:-1})),
  Object.assign({u:.37}, dj({pc:[.0, 1.02, 0], tilt:6, aL:fore(.103,0,.13,FWD,45), pL:45, fL:45, aR:fore(.103,0,-.13,FWD,45), pR:45, fR:45, arm:1})),
  Object.assign({u:.46}, dj({pc:[.02, 1.22, 0], tilt:3, aL:[.04,.34,.13], pL:40, aR:[.04,.34,-.13], pR:40, arm:1})),
  Object.assign({u:.55}, dj({pc:[-.02, 1.02, 0], tilt:4, aL:[0,.14,.13], pL:28, aR:[0,.14,-.13], pR:28, arm:.5})),
  Object.assign({u:.61}, dj({pc:[-.11, .80, 0], tilt:28, aL:[0,.075,.13], pL:0, aR:[0,.075,-.13], pR:0, arm:0, hold:true})),
  Object.assign({u:.68}, dj({pc:[-.02, .955, 0], tilt:3, aL:[0,.075,.13], pL:0, aR:[0,.075,-.13], pR:0, arm:0})),
  // retour : remonte sur la box à reculons (pied droit puis gauche)
  Object.assign({u:.71}, dj({pc:[-.03, .95, .04], tilt:3, aL:[0,.075,.13], aR:[0,.075,-.13]})),
  Object.assign({u:.80}, dj({pc:[-.12, .94, .04], tilt:10, aL:[0,.075,.13], aR:[-.28,.60,-.13], pR:10})),
  Object.assign({u:.85}, dj({pc:[-.20, .93, 0], tilt:14, aL:[0,.075,.13], aR:[DJ_A+.03,DJ_T,-.13]})),
  Object.assign({u:.875}, dj({pc:[-.26, .97, -.02], tilt:14, aL:fore(.103,0,.13,FWD,35), pL:35, fL:35, aR:[DJ_A+.03,DJ_T,-.13]})),
  Object.assign({u:.90}, dj({pc:[-.36, 1.12, -.03], tilt:12, aL:[-.12,.26,.13], pL:20, aR:[DJ_A+.03,DJ_T,-.13]})),
  Object.assign({u:.935}, dj({pc:[-.48, 1.28, -.03], tilt:8, aL:[-.36,.62,.13], pL:10, aR:[DJ_A+.03,DJ_T,-.13]})),
  Object.assign({u:.97}, dj({pc:[-.56, 1.33, 0], tilt:3, aL:[DJ_A,DJ_T,.13], aR:[DJ_A+.02,DJ_T,-.13]})),
  Object.assign({u:1}, dj({}))
];
function dropjump(s){
  const k = kf(DJF, s);
  if(s > .30 && s < .37){ // appui : l'avant du pied ne bouge pas
    k.aL = fore(.103, 0, .13, FWD, k.pL); k.aR = fore(.103, 0, -.13, FWD, k.pR); k.fL = k.pL; k.fR = k.pR; }
  const a = k.arm;
  const handFor = side => a < 0
    ? arm(lerp(.03, -.30, -a), lerp(-.60, -.48, -a), side*.06, [-1, .2, side*.3])
    : arm(lerp(.03, .18, a), lerp(-.60, .42, a), side*lerp(.06, .10, a), [-.3, -1, side*.4]);
  return {
    pc:k.pc, tilt:k.tilt, dev:{}, gaze:[2.8, .6], gazeK:.5,
    legs:{L: leg(k.aL, OUT_L, k.pL, k.fL, [1, 0, .15]), R: leg(k.aR, OUT_R, k.pR, k.fR, [1, 0, -.15])},
    arms:{mode:'custom', curl:'loose', L:handFor(1), R:handFor(-1)},
    world:{box:{x:DJ_X, z:0, h:DJ_H, w:.6, d:.5}},
    focus:['quads', 'glutes', 'calves'],
    phase: s < .30 ? 0 : s < .46 ? 2 : s < .7 ? 3 : 0
  };
}

/* ================================================================ 8. hop and stick (saut vertical sur une jambe, réception tenue) */
const HS_A = [0, .075, .08];
const hsY = f => pcY(-.06, .06, HS_A, 'L', f);
const HS = [
  {u:0,   pc:[-.04,hsY(16),.05], tilt:4,  lift:0,   p:0,  fl:0,  aR:[-.18,.36,-.07], arm:0},
  {u:.08, pc:[-.04,hsY(16),.05], tilt:4,  lift:0,   p:0,  fl:0,  aR:[-.18,.36,-.07], arm:0},
  {u:.22, pc:[-.12,hsY(56),.06], tilt:30, lift:0,   p:0,  fl:0,  aR:[-.26,.30,-.07], arm:-1},
  {u:.31, pc:[-.02,1.00,.06],    tilt:10, lift:0,   p:45, fl:45, aR:[-.12,.44,-.07], arm:1},
  {u:.40, pc:[-.02,1.13,.06],    tilt:8,  lift:.11, p:35, fl:5,  aR:[-.14,.52,-.07], arm:1},
  {u:.49, pc:[-.04,.99,.06],     tilt:10, lift:.01, p:22, fl:5,  aR:[-.16,.42,-.07], arm:.6},
  {u:.57, pc:[-.12,hsY(54),.06], tilt:30, lift:0,   p:0,  fl:0,  aR:[-.26,.30,-.07], arm:.3, hold:true},
  {u:.86, pc:[-.12,hsY(54),.06], tilt:30, lift:0,   p:0,  fl:0,  aR:[-.26,.30,-.07], arm:.3},
  {u:1,   pc:[-.04,hsY(16),.05], tilt:4,  lift:0,   p:0,  fl:0,  aR:[-.18,.36,-.07], arm:0}
];
function hopstick(s){
  const k = kf(HS, s);
  const h = OUT_L;
  const aL = k.p > .5 ? fore(HS_A[0] + .103, k.lift, HS_A[2] + .01, h, k.p) : [HS_A[0], HS_A[1] + k.lift, HS_A[2]];
  const a = k.arm;
  const handFor = side => a < 0
    ? arm(lerp(.03, -.28, -a), lerp(-.58, -.48, -a), side*.08, [-1, .2, side*.3])
    : arm(lerp(.03, .30, a), lerp(-.58, -.16, a), side*lerp(.06, .12, a), [-.4, -1, side*.5]);
  return {
    pc:k.pc, tilt:k.tilt, dev:{}, gaze:[2.6, .4], gazeK:.55,
    legs:{L: leg(aL, h, k.p, k.fl, [h[0], 0, h[1]]), R: leg(k.aR, FWD, 35, 0, [1, -.2, -.12])},
    arms:{mode:'custom', curl:'loose', L:handFor(1), R:handFor(-1)},
    focus:['quadsL', 'glutes', 'calves'],
    phase: s < .22 ? 0 : s < .49 ? 2 : s < .9 ? 3 : 0
  };
}

/* ------------------------------------------------------------------ déclarations */
const F_STAR = {tx:-.05, ty:.80, tz:0, H:2.06, W:1.35, el:24, az:38};
const F_BAL = o => o.ball ? {tx:.36, ty:1.04, tz:-.15, H:2.28, W:1.56, el:10, az:40}
  : surfOf(o) === 'floor' ? {tx:.07, ty:.96, tz:0, H:1.96, W:1.1, el:10, az:40} : {tx:.03, ty:1.02, tz:0, H:2.3, W:1.1, el:10, az:40};
const F_SQ = o => surfOf(o) === 'floor' ? {tx:.18, ty:.95, tz:-.1, H:1.96, W:1.1, el:10, az:38} : {tx:.15, ty:1.01, tz:-.09, H:2.28, W:1.2, el:10, az:38};
const F_LAND = o => landMode(o) === 'side' ? {tx:.01, ty:.96, tz:.15, H:2.08, W:1.3, el:10, az:70} : {tx:.26, ty:.99, tz:-.1, H:2.32, W:1.45, el:10, az:30};
Rig.define('star', sided(star), {family:'balance', cycle:7.5, frame:sidedFrame(F_STAR)});
Rig.define('bosubalance', sided(bosubalance), {family:'balance', cycle:5, frame:sidedFrame(F_BAL)});
Rig.define('bosusquat', sided(bosusquat), {family:'balance', tempo:true, cycle:3.5, frame:sidedFrame(F_SQ)});
Rig.define('sllanding', sided(sllanding), {family:'balance', cycle:3.2, frame:sidedFrame(F_LAND)});
Rig.define('boxlanding', sided(boxlanding), {family:'balance', cycle:4.4, frame:sidedFrame({tx:-.04, ty:1.08, tz:-.05, H:2.5, W:1.65, el:10, az:30})});
Rig.define('skater', makeSkater(SK_STD), {family:'plyo', cycle:1.6, frame:{tx:-.06, ty:.89, tz:0, H:2.04, W:1.62, el:12, az:78}});
Rig.define('skatereasy', makeSkater(SK_EASY), {family:'plyo', cycle:+(2*SK_EASY.tot).toFixed(2), frame:{tx:-.05, ty:.87, tz:0, H:1.98, W:1.4, el:12, az:78}});
Rig.define('skaterbosu', makeSkater(SK_BOSU), {family:'plyo', cycle:+(2*SK_BOSU.tot).toFixed(2), frame:{tx:-.05, ty:1.0, tz:0, H:2.36, W:1.95, el:12, az:78}});
Rig.define('skaterhard', makeSkater(SK_HARD), {family:'plyo', cycle:+(2*SK_HARD.tot).toFixed(2), frame:{tx:-.06, ty:.93, tz:0, H:2.12, W:1.95, el:12, az:78}});
Rig.define('pogo', sided(pogo), {family:'plyo', cycle:.45, frame:{tx:.05, ty:1.02, tz:-.03, H:2.2, W:1.2, el:8, az:32}});
Rig.define('dropjump', sided(dropjump), {family:'plyo', cycle:2.8, frame:{tx:-.29, ty:1.12, tz:0, H:2.46, W:1.4, el:10, az:14}});
Rig.define('hopstick', sided(hopstick), {family:'balance', cycle:1.8, frame:sidedFrame({tx:.08, ty:1.0, tz:-.06, H:2.18, W:1.1, el:10, az:36})});
})();
