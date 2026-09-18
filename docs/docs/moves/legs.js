/* Charge Utile — famille « legs » : squats, fentes, chaise, step-up / step-down.
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z.
   Unilatéraux : jambe GAUCHE qui travaille par défaut (o.side:'R' => miroir). */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ aides */
const TH = .445, SH = .456, HIPZ = .1125, LEGMAX = .893;
const nrm2 = (x, z) => { const l = Math.hypot(x, z) || 1; return [x/l, z/l]; };
/** distance hanche-cheville pour une flexion de genou donnée (°) */
const dKnee = f => Math.sqrt(TH*TH + SH*SH + 2*TH*SH*Math.cos(f*D2R));
/** hauteur du bassin pour que la jambe `side` ait une portée d (hanche → cheville) */
const pcYd = (px, pz, ank, side, d) => { const hz = pz + (side === 'L' ? HIPZ : -HIPZ);
  const dx = px - ank[0], dz = hz - ank[2]; return ank[1] + Math.sqrt(Math.max(.01, d*d - dx*dx - dz*dz)); };
const pcY = (px, pz, ank, side, f) => pcYd(px, pz, ank, side, dKnee(f));
/* avant-pied au sol (mesuré sur le maillage) : [inclinaison du pied °, hauteur de cheville, avance du point d'appui] */
const FORE = [[0,.075,.103],[20,.113,.099],[30,.129,.091],[40,.142,.068],[50,.150,.043],[60,.155,.017]];
const tab = (T, p) => { if(p <= T[0][0]) return T[0]; for(let i=1;i<T.length;i++) if(p <= T[i][0]){ const a = T[i-1], b = T[i], k = (p-a[0])/(b[0]-a[0]); return [p, lerp(a[1],b[1],k), lerp(a[2],b[2],k)]; } return T[T.length-1]; };
/** cheville telle que l'avant du pied touche (cx, cy, cz), pied incliné de phi (° ; + = talon levé) */
const fore = (cx, cy, cz, h, phi) => { const r = tab(FORE, Math.max(0, phi)); return [cx - h[0]*r[2], cy + r[1], cz - h[1]*r[2]]; };
/** pied : cheville a, direction horizontale h, inclinaison phi (+ = pointe vers le bas), orteils, pole, semelle */
const leg = (a, h, phi, flex, pole, sole) => { const c = Math.cos(phi*D2R), s = Math.sin(phi*D2R);
  const o = {ankle:a.slice(), toe:[a[0] + .2*h[0]*c, a[1] - .2*s, a[2] + .2*h[1]*c], pole, toeFlex:flex||0};
  if(sole) o.sole = sole; return o; };
/** pied à plat, semelle au sol, genou dans l'axe du pied */
const flat = (x, z, h, y = .075, pz = 0) => leg([x, y, z], h, 0, 0, [h[0], pz, h[1]], [0,1,0]);
/** pied posé sur l'avant-pied au point (cx, cy, cz) */
const onBall = (cx, cy, cz, h, phi, pole) => leg(fore(cx, cy, cz, h, phi), h, phi, phi, pole || [h[0], 0, h[1]]);
const FWD = [1, 0];
const OUT = a => [nrm2(1, Math.tan(a*D2R)), nrm2(1, -Math.tan(a*D2R))];   // [gauche, droite] pointes ouvertes de a°

/** bras qui balance dans le plan sagittal : phi = angle depuis la verticale basse (+ = vers l'avant) */
const swing = (phi, side, L = .585, z = .05) => { const a = phi*D2R, sz = side === 'L' ? 1 : -1;
  return {hand:[L*Math.sin(a), -L*Math.cos(a), z*sz], pole:[-Math.cos(a), -Math.sin(a), .35*sz], rel:'sh', curl:'loose'}; };
/** haltères tenus le long du corps, un peu écartés des cuisses */
const DB_SIDES = {mode:'custom', curl:'grip',
  L:{hand:[.02, -.595, .07], pole:[-1, 0, .25], rel:'sh', curl:'grip'},
  R:{hand:[.02, -.595, -.07], pole:[-1, 0, -.25], rel:'sh', curl:'grip'}};
const DB_CARRY = [{type:'db', at:'gripL', axis:[1,0,0]}, {type:'db', at:'gripR', axis:[1,0,0]}];
const swingArms = (phiL, phiR, z) => ({mode:'custom', curl:'loose', L:swing(phiL, 'L', undefined, z), R:swing(phiR, 'R', undefined, z)});

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
  if(p.world){ const w = {};
    for(const k in p.world){ const v = p.world[k];
      w[k] = (v && typeof v === 'object') ? Object.assign({}, v, {z: -(v.z||0)}) : v; }
    q.world = w; }
  if(p.carry) q.carry = p.carry.map(c => Object.assign({}, c,
    c.at === 'gripL' ? {at:'gripR'} : c.at === 'gripR' ? {at:'gripL'} : Array.isArray(c.at) ? {at:MZ(c.at)} : {},
    c.off ? {off:MZ(c.off)} : {}, Array.isArray(c.axis) ? {axis:MZ(c.axis)} : {}));
  if(p.focus) q.focus = p.focus.map(f => f === 'quadsL' ? 'quads' : f);
  return q;
}
const sided = fn => (s, o, t) => { o = o || {}; const p = fn(s, o, t || 0); return o.side === 'R' ? mirror(p) : p; };

/* ------------------------------------------------------------------ accessoires */
/** segment cylindrique entre deux points (mise à jour à chaque image) */
function seg(m, a, b){
  const d = b.clone().sub(a), L = d.length();
  m.position.copy(a).add(b).multiplyScalar(.5);
  m.scale.set(1, Math.max(L, 1e-4), 1);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize());
}
// pan de mur étroit derrière l'athlète (chaise) : face avant en x
Rig.prop('legs_wall', {
  make(c){ const m = new c.THREE.Mesh(new c.THREE.BoxGeometry(1,1,1), c.mats.wall); m.receiveShadow = true; m.castShadow = true; return m; },
  update(m, s){ const T = .1, H = s.h || 1.9, W = s.w || 1.1; m.scale.set(T, H, W); m.position.set(s.x - T/2, H/2, s.z || 0); }
});
// montant fixe + sangle passée derrière les genoux (spanish squat)
Rig.prop('legs_band', {
  make(c){ const T = c.THREE, g = new T.Group();
    const post = c.mk(new T.BoxGeometry(.08,1.5,.08), c.mats.mach); post.position.y = .75; g.add(post);
    const foot_ = c.mk(new T.BoxGeometry(.36,.03,.36), c.mats.mach); foot_.position.y = .015; g.add(foot_);
    const ring = c.mk(new T.TorusGeometry(.035,.008,8,20), c.mats.steel); ring.rotation.y = Math.PI/2; g.add(ring);
    const band = [];
    for(let i=0;i<5;i++){ const m = c.mk(new T.CylinderGeometry(.012,.012,1,8), c.mats.band); g.add(m); band.push(m); }
    g.userData = {band, ring};
    return g; },
  update(g, s, c){ const V_ = c.V, sk = c.sk, y = s.y || .5;
    g.position.set(s.x, 0, 0); g.userData.ring.position.set(-.05, y, 0);
    const o_ = V_(s.x, 0, 0), kL = sk.kneeL.clone().sub(o_), kR = sk.kneeR.clone().sub(o_);
    const A = V_(-.05, y, .012), B = V_(-.05, y, -.012);
    const P1 = V_(kL.x + .01, kL.y - .005, kL.z + .07), P2 = V_(kL.x - .065, kL.y - .01, kL.z);
    const P3 = V_(kR.x - .065, kR.y - .01, kR.z), P4 = V_(kR.x + .01, kR.y - .005, kR.z - .07);
    const pts = [[A,P1],[P1,P2],[P2,P3],[P3,P4],[P4,B]];
    g.userData.band.forEach((m, i) => seg(m, pts[i][0], pts[i][1]));
  }
});

/* ================================================================ 1. squat sauté */
const JS_Z = .14, [JS_HL, JS_HR] = OUT(10);
const JSF = [
  {u:0,   pc:[-.01,.955], tilt:2,  lift:0,   p:0,  fl:0,  arm:4},
  {u:.08, pc:[-.01,.955], tilt:2,  lift:0,   p:0,  fl:0,  arm:4},
  {u:.30, pc:[-.16,.64],  tilt:34, lift:0,   p:0,  fl:0,  arm:-42},
  {u:.40, pc:[.00,1.025], tilt:6,  lift:0,   p:44, fl:44, arm:120},
  {u:.52, pc:[.00,1.17],  tilt:5,  lift:.17, p:34, fl:6,  arm:95},
  {u:.62, pc:[-.01,1.05], tilt:5,  lift:.05, p:26, fl:6,  arm:60},
  {u:.67, pc:[-.03,.99],  tilt:7,  lift:0,   p:24, fl:24, arm:50},
  {u:.75, pc:[-.15,.67],  tilt:30, lift:0,   p:0,  fl:0,  arm:55, hold:true},
  {u:.88, pc:[-.05,.90],  tilt:8,  lift:0,   p:0,  fl:0,  arm:20},
  {u:1,   pc:[-.01,.955], tilt:2,  lift:0,   p:0,  fl:0,  arm:4}
];
function jumpsquat(s, o){
  const k = kf(JSF, s);
  const ft = (z, h) => leg(fore(.103, k.lift, z + h[1]*.103, h, k.p), h, k.p, k.fl, [h[0], 0, h[1]*1.3], k.lift > .01 ? undefined : (k.p < 1 ? [0,1,0] : undefined));
  return {
    pc:k.pc, tilt:k.tilt, dev:{}, gaze:[2.6, .9], gazeK:.5,
    legs:{L:ft(JS_Z, JS_HL), R:ft(-JS_Z, JS_HR)},
    arms:swingArms(k.arm, k.arm, .06),
    focus:['quads','glutes','calves'],
    phase: s < .30 ? 0 : s < .67 ? 2 : 3
  };
}

/* ================================================================ 2. chaise contre le mur (tenue) */
const WS_HX = .035, WS_HY = .425, WS_HZ = .29, WS_POLE = [.1, 0, 1];   // coude vers l'extérieur => main à plat contre le mur
function wallsit(s, o, t){
  const br = Math.sin((t||0)*Math.PI*2/4);            // respiration sur 4 s
  const kx = .01, ky = .075 + SH;                      // genou au-dessus de la cheville (tibia vertical)
  const pc = [kx - TH + .005, ky + .01 + .002*br];     // cuisse horizontale
  const [hL, hR] = OUT(8);
  const wx = pc[0] - .125;                             // face du mur
  let R = flat(0, -.13, hR);
  if(o.single){                                        // jambe droite tendue devant, à hauteur de hanche
    const hip = [pc[0], pc[1], -HIPZ], a = 84*D2R, L = .875;
    const an = [hip[0] + L*Math.sin(a), hip[1] - L*Math.cos(a), -.12];
    R = {ankle:an, toe:[an[0] + .06, an[1] + .19, -.13], pole:[0,1,-.05], toeFlex:0};
  }
  return {
    pc, tilt:-1, dev:{thup:.8*br, lum:1}, gaze:[3, 1.0], gazeK:.5,
    legs:{L:flat(0, .13, hL), R},
    // bras le long du corps, mains plaquées au mur de chaque côté des hanches
    arms:{mode:'custom', curl:'flat',
      L:{hand:[wx + WS_HX, WS_HY, WS_HZ], pole:WS_POLE, rel:'world', curl:'flat'},
      R:{hand:[wx + WS_HX, WS_HY, -WS_HZ], pole:[WS_POLE[0], WS_POLE[1], -WS_POLE[2]], rel:'world', curl:'flat'}},
    world:{legs_wall:{x:wx, w:1.0}},
    focus: o.single ? ['quadsL','glutes'] : ['quads','glutes']
  };
}

/* ================================================================ 3. spanish squat (tempo) */
function spanish(s){
  const e = sm(s)*.3 + s*.7;
  // genou sur un cercle autour de la cheville : tibia légèrement vers l'arrière
  const sa = lerp(-2, -4, e)*D2R, K = [SH*Math.sin(sa) + .01, .075 + SH*Math.cos(sa)];
  const th = lerp(76, 2, e)*D2R;                        // cuisse : 90 = verticale, 0 = horizontale
  const pc = [K[0] - TH*Math.cos(th), K[1] + TH*Math.sin(th)];
  const [hL, hR] = OUT(8);
  return {
    pc, tilt:lerp(3, 12, e), dev:{pel:lerp(0, 3, e)}, gaze:[2.6, 1.0], gazeK:.5,
    legs:{L:flat(0, .14, hL), R:flat(0, -.14, hR)},
    arms:{mode:'none'},
    world:{legs_band:{x:1.15, y:.50}},
    focus:['quads']
  };
}

/* ================================================================ 4. fentes avant / arrière (tempo, jambe gauche devant) */
/** abaisse le bassin si une jambe devrait dépasser sa portée */
function fitY(pc, legs, max = LEGMAX){
  let y = pc[1];
  for(const k of ['L','R']){ const a = legs[k].ankle, hz = (pc[2]||0) + (k === 'L' ? HIPZ : -HIPZ);
    const dx = pc[0] - a[0], dz = hz - a[2];
    y = Math.min(y, a[1] + Math.sqrt(Math.max(.01, max*max - dx*dx - dz*dz))); }
  return [pc[0], y, pc[2]||0];
}
const LG_Z = .11;
/** position basse : pied arrière sur l'avant-pied au point xr ; renvoie bassin et cheville avant */
function lungeLow(xr){
  const pr = 52;
  const aR = fore(xr, 0, -LG_Z, FWD, pr);
  // genou arrière à ~4 cm du sol, presque sous la hanche
  const ky = .098;
  const kR = [aR[0] + Math.sqrt(SH*SH - Math.pow(ky - aR[1], 2)), ky];
  const hip = [kR[0] + .06, kR[1] + Math.sqrt(TH*TH - .06*.06)];
  // cuisse avant presque horizontale, tibia avant légèrement incliné vers l'avant
  const kF = [hip[0] + TH*Math.cos(6*D2R), hip[1] - TH*Math.sin(6*D2R)];
  const xf = kF[0] - .06;
  return {pc:hip, xf, pr};
}
const LG_LOW = lungeLow(.103);
function lunge(s, o){
  const back = o.dir === 'back';
  const L0 = LG_LOW, off = back ? -L0.xf : 0;           // fente arrière : le pied avant reste en 0
  const low = {pc:[L0.pc[0] + off, L0.pc[1]], xf:L0.xf + off, xr:.103 + off};
  let F;
  if(!back) F = [
    {u:0,   pc:[-.01,.955], tilt:2, aF:[0,.075],          pF:0,   xr:.103, pr:0},
    {u:.20, pc:[.10,.935],  tilt:3, aF:[.30,.22],         pF:-6,  xr:.103, pr:10},
    {u:.34, pc:[.34,.885],  tilt:4, aF:[.76,.15],         pF:-12, xr:.103, pr:26},
    {u:.46, pc:[.49,.80],   tilt:5, aF:[low.xf,.075],     pF:0,   xr:.103, pr:38},
    {u:1,   pc:low.pc,      tilt:6, aF:[low.xf,.075],     pF:0,   xr:.103, pr:L0.pr}
  ];
  else F = [
    {u:0,   pc:[-.01,.955], tilt:2, aF:[0,.075], pF:0, xr:.103, pr:0},
    {u:.20, pc:[-.05,.935], tilt:5, aF:[0,.075], pF:0, xr:-.20, pr:25},
    {u:.34, pc:[-.17,.88],  tilt:7, aF:[0,.075], pF:0, xr:-.56, pr:38},
    {u:.46, pc:[-.31,.79],  tilt:8, aF:[0,.075], pF:0, xr:low.xr, pr:45},
    {u:1,   pc:low.pc,      tilt:8, aF:[0,.075], pF:0, xr:low.xr, pr:L0.pr}
  ];
  const k = kf(F, s);
  let R;
  if(back){
    // pied arrière en l'air pendant le pas (u .03 → .46), puis posé sur l'avant-pied
    const air = s > .03 && s < .46 ? Math.sin(clamp((s - .03)/.43, 0, 1)*Math.PI) : 0;
    const a = fore(k.xr, air*.09, -LG_Z, FWD, k.pr);
    R = leg(a, FWD, k.pr, k.pr*(1 - air*.7), [.3, -1, -.1]);
  } else { const q = clamp(k.pr/40, 0, 1); R = onBall(k.xr, 0, -LG_Z, FWD, k.pr, [lerp(1, .3, q), -q, -.1]); }
  const L = k.pF === 0 && k.aF[1] < .076 ? flat(k.aF[0], LG_Z, FWD) : leg([k.aF[0], k.aF[1], LG_Z], FWD, k.pF, 0, [1, 0, .08]);
  const legs = {L, R};
  const load = o.load === 'db';
  return {
    pc:fitY(k.pc, legs), tilt:k.tilt, dev:{}, gaze:[k.pc[0] + 2.4, .8], gazeK:.5,
    legs,
    arms: load ? DB_SIDES : {mode:'hips'}, carry: load ? DB_CARRY : undefined,
    focus:['quadsL','glutes']
  };
}

/* ================================================================ 5. fente latérale (tempo, pas à gauche) */
const SL_RZ = -.12, SL_LZ = .80, SL_PLANT = .42;
/** hauteur du bassin quand la jambe droite reste tendue */
const slY = (px, pz) => .075 + Math.sqrt(LEGMAX*LEGMAX - px*px - Math.pow(pz - HIPZ - SL_RZ, 2));
function sidelunge(s, o){
  const F = [
    {u:0,   px:-.01, pz:0,    y:.955, tilt:2,  a:[0,.075,.12]},
    {u:.16, px:-.02, pz:-.03, y:.945, tilt:3,  a:[.02,.19,.30]},
    {u:.30, px:-.04, pz:.10,  y:.93,  tilt:6,  a:[.01,.14,.60]},
    {u:SL_PLANT, px:-.06, pz:.35, y:.90, tilt:10, a:[0,.075,SL_LZ]},
    {u:1,   px:-.22, pz:.66,  y:.60,  tilt:36, a:[0,.075,SL_LZ]}
  ];
  const k = kf(F, s);
  const [hL, hR] = OUT(12);
  const L = k.a[1] < .076 ? flat(k.a[0], k.a[2], hL) : leg(k.a, hL, -4, 0, [1, .2, .3]);
  const R = flat(0, SL_RZ, hR);
  let pc = [k.px, k.y, k.pz];
  if(s >= SL_PLANT) pc[1] = slY(k.px, k.pz) - .004;      // jambe droite tendue, la gauche plie
  pc = fitY(pc, {L, R});
  const goblet = o.load === 'goblet';
  return {
    pc, tilt:k.tilt, dev:{pel:lerp(0, 4, s)}, gaze:[2.6, .7], gazeK:.5,
    legs:{L, R},
    arms:{mode: goblet ? 'goblet' : 'none'},
    focus:['quadsL','glutes','adductors']
  };
}

/* ================================================================ 6. fentes sautées (2 sauts par cycle) */
const SJ_Z = .11, SJ_XF = .44, SJ_XR = -.40;
const sjLowY = pcYd(-.03, 0, [SJ_XF - .103, .075, SJ_Z], 'L', dKnee(92));
/* demi-cycle : jambe gauche devant -> jambe droite devant. Pieds : point d'appui cx, décollage lift, inclinaison p */
const SJH = [
  {u:0,   pc:[-.03,sjLowY+.03], tilt:5, cL:SJ_XF, lL:0, pL:0, cR:SJ_XR, lR:0, pR:50, arm:1, up:0},
  {u:.14, pc:[-.04,sjLowY-.02], tilt:9, cL:SJ_XF, lL:0, pL:0, cR:SJ_XR, lR:0, pR:52, arm:1, up:0},
  {u:.30, pc:[.0,.955],         tilt:4, cL:SJ_XF, lL:0, pL:38, cR:SJ_XR, lR:0, pR:60, arm:.6, up:1},
  {u:.46, pc:[.0,1.12],         tilt:3, cL:.26, lL:.17, pL:22, cR:-.10, lR:.20, pR:40, arm:0, up:1},
  {u:.60, pc:[-.01,.95],        tilt:4, cL:SJ_XR, lL:.03, pL:45, cR:SJ_XF, lR:.03, pR:-8, arm:-.8, up:.3},
  {u:.66, pc:[-.02,sjLowY+.10], tilt:5, cL:SJ_XR, lL:0, pL:48, cR:SJ_XF, lR:0, pR:0, arm:-1, up:0},
  {u:.80, pc:[-.04,sjLowY-.02], tilt:9, cL:SJ_XR, lL:0, pL:52, cR:SJ_XF, lR:0, pR:0, arm:-1, up:0, hold:true},
  {u:1,   pc:[-.03,sjLowY+.03], tilt:5, cL:SJ_XR, lL:0, pL:50, cR:SJ_XF, lR:0, pR:0, arm:-1, up:0}
];
function splitHalf(u){
  const k = kf(SJH, u);
  const ft = (c, l, p, z, front) => {
    const ph = p < 0 ? p : p, a = fore(c, l, z, FWD, Math.max(0, p));
    const contact = l < .005;
    const pole = front ? [1, 0, z > 0 ? .08 : -.08] : [.3, -1, z > 0 ? .1 : -.1];
    const lg = leg(a, FWD, ph, contact ? Math.max(0, p) : Math.max(0, p)*.3, pole);
    if(contact && p < .5) lg.sole = [0,1,0];
    return lg;
  };
  const frontL = k.cL > 0;
  const a = k.arm, b = k.up;   // a = 1 : bras droit devant (jambe gauche devant)
  const phR = lerp(-35, 55, (a + 1)/2) + 25*b, phL = lerp(55, -35, (a + 1)/2) + 25*b;
  const legs = {L:ft(k.cL, k.lL, k.pL, SJ_Z, frontL), R:ft(k.cR, k.lR, k.pR, -SJ_Z, !frontL)};
  return {
    pc:fitY(k.pc, legs), tilt:k.tilt, dev:{}, gaze:[2.6, .8], gazeK:.5,
    legs,
    arms:swingArms(phL, phR, .07),
    focus:['quads','glutes','calves'],
    phase: u < .30 ? 0 : u < .66 ? 2 : 3
  };
}
function splitjump(s){ return s < .5 ? splitHalf(s*2) : mirror(splitHalf(s*2 - 1)); }

/* ================================================================ 7. step-up sur box (pied gauche sur la box) */
const SU_H = .45, SU_BX = .47, SU_AX = .40, SU_TOP = SU_H + .075;
const SU_Z = .12;
const suTopY = SU_TOP + Math.sqrt(LEGMAX*LEGMAX - .03*.03 - .01*.01);
const SUF = [
  // pc, tilt, pied gauche (cheville, inclinaison), pied droit (cheville visée en l'air, inclinaison), bras (phi)
  {u:0,   pc:[-.01,.955], tilt:2,  aL:[0,.075],  pL:0,  aR:[0,.075],   pR:0,  arm:0},
  {u:.06, pc:[-.01,.955], tilt:2,  aL:[0,.075],  pL:0,  aR:[0,.075],   pR:0,  arm:0},
  {u:.16, pc:[.00,.94],   tilt:5,  aL:[.22,.60], pL:-5, aR:[0,.075],   pR:0,  arm:8},
  {u:.24, pc:[.05,.93],   tilt:10, aL:[SU_AX,SU_TOP], pL:0, aR:[0,.075], pR:0, arm:10},
  {u:.34, pc:[.19,.97],   tilt:24, aL:[SU_AX,SU_TOP], pL:0, aR:[0,.075], pR:34, arm:18},
  {u:.44, pc:[.31,1.17],  tilt:16, aL:[SU_AX,SU_TOP], pL:0, aR:[-.04,.30], pR:45, arm:14},
  {u:.50, pc:[.35,1.32],  tilt:9,  aL:[SU_AX,SU_TOP], pL:0, aR:[.12,.66], pR:30, arm:11},
  {u:.56, pc:[SU_AX-.03,suTopY], tilt:4, aL:[SU_AX,SU_TOP], pL:0, aR:[.34,.98], pR:20, arm:8},
  {u:.64, pc:[SU_AX-.03,suTopY], tilt:4, aL:[SU_AX,SU_TOP], pL:0, aR:[.34,.98], pR:20, arm:8},
  {u:.72, pc:[SU_AX-.06,suTopY-.03], tilt:9, aL:[SU_AX,SU_TOP], pL:0, aR:[.02,.60], pR:35, arm:12},
  {u:.76, pc:[.26,1.18],  tilt:13, aL:[SU_AX,SU_TOP], pL:0, aR:[-.03,.33], pR:38, arm:14},
  {u:.80, pc:[.15,.965],  tilt:15, aL:[SU_AX,SU_TOP], pL:0, aR:[.02,.14], pR:35, arm:16},
  {u:.86, pc:[.10,.95],   tilt:12, aL:[SU_AX,SU_TOP], pL:0, aR:[0,.075], pR:0,  arm:12},
  {u:.94, pc:[.02,.955],  tilt:5,  aL:[.18,.30], pL:5, aR:[0,.075],   pR:0,  arm:4},
  {u:1,   pc:[-.01,.955], tilt:2,  aL:[0,.075],  pL:0,  aR:[0,.075],   pR:0,  arm:0}
];
/** ramène une cheville en l'air à portée de la hanche et au-dessus du sol */
function reach(a, hip, max){
  const d = [a[0]-hip[0], a[1]-hip[1], a[2]-hip[2]], L = Math.hypot(...d);
  const r = L > max ? d.map(x => x*max/L) : d;
  const o = [hip[0]+r[0], hip[1]+r[1], hip[2]+r[2]];
  o[1] = Math.max(o[1], .09); return o;
}
function stepup(s, o){
  const k = kf(SUF, s);
  const pc = [k.pc[0], k.pc[1], .01];
  // pied gauche : au sol, en l'air, puis posé à plat sur la box
  const onBox = s >= .24 && s <= .86;
  const L = onBox ? flat(SU_AX, SU_Z, FWD, SU_TOP)
    : (s <= .06 || s >= .999) ? flat(0, SU_Z, FWD)
    : leg([k.aL[0], k.aL[1], SU_Z], FWD, k.pL, 0, [1, .1, .1]);
  // pied droit : au sol (le talon se lève puis l'avant-pied quitte le sol), en l'air, reposé avec l'avant-pied d'abord
  let R;
  const hipR = [pc[0], pc[1], pc[2] - HIPZ];
  if(s <= .34 || s >= .80){
    const p = s >= .86 ? 0 : k.pR;
    R = p < .5 ? flat(0, -SU_Z, FWD) : onBall(.103, 0, -SU_Z, FWD, p, [1, 0, -.1]);
  } else {
    const a = reach([k.aR[0], k.aR[1], -SU_Z], hipR, .885);
    R = leg(a, FWD, k.pR, 0, [1, .15, -.1]);
  }
  const legs = {L, R};
  const load = o.load === 'db';
  const arms = load ? DB_SIDES : swingArms(2 - k.arm*.5, k.arm*2.4, .06);
  return {
    pc:fitY(pc, legs), tilt:k.tilt, dev:{}, gaze:[2.8, 1.1], gazeK:.5,
    legs, arms, carry: load ? DB_CARRY : undefined,
    world:{box:{x:SU_BX, z:0, h:SU_H, w:.6, d:.44}},
    focus:['quadsL','glutes'],
    phase: s < .24 ? 0 : s < .56 ? 2 : s < .9 ? 3 : 0
  };
}

/* ================================================================ 8. step-down latéral (tempo, appui gauche sur la marche)
   o.h : hauteur de marche (0.10 / 0.20 / 0.30) · o.load:'db' : haltères le long du corps */
const SD_FA = 4*D2R, SD_LR = .885, SDK = -.12;
function stepdown(s, o, t){
  const H = clamp(o.h || .20, .08, .35), q = H/.20;         // q = 1 pour la marche de référence (20 cm)
  const A = [0, H + .075, .07];
  const top = pcY(-.02, .02, A, 'L', 6), bot = .085 + SD_LR*Math.cos(SD_FA);
  const e = sm(s)*.25 + s*.75;
  const sway = Math.sin((t||0)*1.4)*.003;
  const px = lerp(-.02, -.04 - .08*q, e) + sway, pz = lerp(.02, .035, e);
  const pc = [px, lerp(top, bot, e), pz];
  const [hL] = OUT(8);
  // jambe libre tendue, pied relâché puis talon qui vient effleurer le sol
  const hipR = [px, pc[1], pz - HIPZ];
  const a = [hipR[0] + SD_LR*Math.sin(SD_FA), hipR[1] - SD_LR*Math.cos(SD_FA), -.135];
  const pitch = lerp(12, -14, e);
  const R = leg(a, nrm2(1, -.05), pitch, 0, [1, .05, -.1]);
  const load = o.load === 'db';
  const phi = lerp(28, 28 + 50*Math.min(q, 1.1), e);
  return {
    pc, tilt:lerp(4, 8 + 12*q, e), dev:{pel:lerp(0, 2, e)}, gaze:[2.4, lerp(.9, .5, e)], gazeK:.5,
    legs:{L:leg(A, hL, 0, 0, [1, 0, SDK], [0,1,0]), R},
    arms: load ? DB_SIDES : swingArms(phi, phi, .1), carry: load ? DB_CARRY : undefined,
    world:{step:{x:.03, h:H, z:.15, w:.36, d:.46}},
    focus:['quadsL','glutes']
  };
}

/* ================================================================ 9. squat au poids du corps (bras devant) */
function bwsquat(s, o){
  const e = sm(s)*.3 + s*.7;
  const [hL, hR] = OUT(12);
  return {
    pc:[lerp(-.01, -.22, e), lerp(.955, .45, s)], tilt:lerp(1, 40, e), dev:{pel:lerp(0, 5, e)},
    gaze:[2.6, .6], gazeK:.6,
    legs:{L:flat(0, .16, hL), R:flat(0, -.16, hR)},
    arms:{mode:'none'},
    focus:['quads','glutes']
  };
}

/* ================================================================ 10. squat sumo goblet */
const SU_W = .36, [SM_HL, SM_HR] = OUT(35);
const sumoTop = .075 + Math.sqrt(LEGMAX*LEGMAX - Math.pow(SU_W - HIPZ + .02*0, 2) - .02*.02);
const KZ = 1.7;
function sumo(s, o){
  const e = sm(s)*.3 + s*.7;
  return {
    pc:[lerp(-.02, -.10, e), lerp(sumoTop, .50, s)], tilt:lerp(2, 16, e), dev:{pel:lerp(0, 4, e)},
    gaze:[2.6, .9], gazeK:.5,
    legs:{L:leg([0,.075,SU_W], SM_HL, 0, 0, [SM_HL[0], 0, SM_HL[1]*KZ], [0,1,0]), R:leg([0,.075,-SU_W], SM_HR, 0, 0, [SM_HR[0], 0, SM_HR[1]*KZ], [0,1,0])},
    arms:{mode:'goblet'},
    focus:['quads','glutes','adductors']
  };
}

/* ------------------------------------------------------------------ déclarations */
Rig.define('jumpsquat', jumpsquat, {family:'plyo', cycle:1.6, frame:{tx:.05, ty:1.02, tz:0, H:2.45, W:1.4, el:10, az:34}});
Rig.define('wallsit', wallsit, {family:'squat', cycle:4, frame:{tx:.0, ty:.72, tz:0, H:1.7, W:1.6, el:10, az:30}});
Rig.define('spanish', spanish, {family:'squat', tempo:true, cycle:3.5, frame:{tx:.3, ty:.8, tz:0, H:1.95, W:2.2, el:10, az:24}});
Rig.define('lunge', sided(lunge), {family:'lunge', tempo:true, cycle:3, frame:{tx:.12, ty:.84, tz:0, H:1.95, W:2.25, el:10, az:30}});
Rig.define('sidelunge', sided(sidelunge), {family:'lunge', tempo:true, cycle:3, frame:{tx:.0, ty:.84, tz:0, H:1.95, W:2.4, el:12, az:70}});
Rig.define('splitjump', splitjump, {family:'plyo', cycle:1.4, frame:{tx:.0, ty:.98, tz:0, H:2.3, W:1.9, el:10, az:30}});
Rig.define('stepup', sided(stepup), {family:'lunge', cycle:2.6, frame:{tx:.25, ty:1.2, tz:0, H:2.6, W:1.9, el:10, az:28}});
Rig.define('stepdown', sided(stepdown), {family:'balance', tempo:true, cycle:3.5,
  frame:o => { const h = (o && o.h) || .20; return {tx:.05, ty:1.0 + (h - .20)*.5, tz:0, H:2.35 + (h - .20), W:1.4, el:12, az:62}; }});
Rig.define('bwsquat', bwsquat, {family:'squat', tempo:true, cycle:3, frame:{tx:.05, ty:.88, tz:0, H:2.05, W:1.6, el:10, az:36}});
Rig.define('sumo', sumo, {family:'squat', tempo:true, cycle:3, frame:{tx:-.02, ty:.86, tz:0, H:2.0, W:1.6, el:10, az:50}});
})();
