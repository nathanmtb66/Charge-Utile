/* Charge Utile — mouvements « extra » (séance trail de Nathan) :
   burpee, développé couché barre (benchpress), leg extension machine (legext).
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ---------- géométrie du buste (mêmes constantes que upper.js / trunk.js) ---------- */
const TLINE = 1.78;
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
/** décalage bassin → épaule (plan sagittal) */
function shOff(tilt, dev){
  dev = dev || {}; let x = 0, y = 0;
  for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - TLINE + (dev[k]||0)); x += r[0]; y += r[1]; }
  return [x, y];
}
/** bassin placé pour que l'épaule soit en S et la cheville en A (jambe de longueur Lg) */
function trunk(A, S, Lg, dev){
  const o0 = shOff(0, dev), l = Math.hypot(o0[0], o0[1]), a0 = Math.atan2(o0[0], o0[1]) / D2R;
  const dx = S[0]-A[0], dy = S[1]-A[1], d = Math.hypot(dx, dy);
  const dd = clamp(d, Math.abs(Lg - l) + 1e-4, Lg + l - 1e-4);
  const ux = dx/d, uy = dy/d, a = (dd*dd + Lg*Lg - l*l) / (2*dd), h = Math.sqrt(Math.max(0, Lg*Lg - a*a));
  const H = [A[0] + ux*a - uy*h, A[1] + uy*a + ux*h];
  return {pc:H, tilt:Math.atan2(S[0]-H[0], S[1]-H[1]) / D2R - a0};
}

/* ================================================================ 1. burpee (cyclique)
   debout → accroupi mains au sol → pieds sautés en planche → pieds ramenés → saut vertical bras en haut */
const BU = (() => {
  const HX = .40, HZ = .19, HY = .03;
  const Sp = [HX - .02, .62], Ap = [HX - 1.28, .16];
  const PL = trunk(Ap, Sp, .88, {});
  // mi-saut (pieds en l'air entre accroupi et planche) : bassin haut, épaules au-dessus des mains
  const TM = 96, om = shOff(TM, {lum:3, thlow:1.8}), PM = [Sp[0] - .03 - om[0], .64 - om[1]], AM = [PM[0] - .60, .40];
  // clés : pc, tilt, lum (dos), cheville [x,y], orteil [dx,dy], flexion orteils, genou (0 debout → 1 planche), main (monde ou épaule), coude
  const K = [
    {u:0,   pc:[-.01,.955], tilt:1,  lum:0,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[.02,-.62], hp:[-1,0,.2]},
    {u:.07, pc:[-.10,.66],  tilt:32, lum:4,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[.12,-.58], hp:[-1,0,.3]},
    {u:.13, pc:[-.13,.45],  tilt:60, lum:10, a:[0,.075],  t:[.2,0],     f:0,  kp:0, hw:[HX,HY], hp:[-1,.35,.55], hold:true},
    {u:.19, pc:PM, tilt:TM, lum:3, a:AM, t:[.10,-.17], f:25, kp:.85, hw:[HX,HY], hp:[-1,.1,.3]},
    {u:.25, pc:PL.pc, tilt:PL.tilt, lum:0, a:Ap, t:[.05,-.14], f:70, kp:1, hw:[HX,HY], hp:[-1,0,.15], hold:true},
    {u:.33, pc:PL.pc, tilt:PL.tilt, lum:0, a:Ap, t:[.05,-.14], f:70, kp:1, hw:[HX,HY], hp:[-1,0,.15]},
    {u:.39, pc:PM, tilt:TM, lum:3, a:AM, t:[.10,-.17], f:25, kp:.85, hw:[HX,HY], hp:[-1,.1,.3]},
    {u:.45, pc:[-.13,.45],  tilt:60, lum:10, a:[0,.075],  t:[.2,0],     f:0,  kp:0, hw:[HX,HY], hp:[-1,.35,.55], hold:true},
    {u:.53, pc:[-.12,.66],  tilt:30, lum:2,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[-.12,-.55], hp:[-1,.2,.3]},
    {u:.56, pc:[-.07,.84],  tilt:14, lum:0,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[.52,-.02], hp:[-.6,-.6,.6]},
    {u:.59, pc:[.0,1.00],   tilt:4,  lum:0,  a:[0,.16],   t:[.19,-.12], f:50, kp:0, hs:[.12,.60], hp:[-.4,0,1]},
    {u:.66, pc:[.0,1.16],   tilt:2,  lum:0,  a:[.0,.31],  t:[.14,-.15], f:5,  kp:0, hs:[.08,.62], hp:[-.4,0,1]},
    {u:.73, pc:[.0,1.00],   tilt:4,  lum:0,  a:[0,.16],   t:[.19,-.12], f:50, kp:0, hs:[.42,.30], hp:[-.4,-.3,1]},
    {u:.77, pc:[-.06,.86],  tilt:12, lum:1,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[.50,-.12], hp:[-.6,-.6,.6]},
    {u:.81, pc:[-.10,.78],  tilt:22, lum:2,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[.30,-.42], hp:[-1,-.3,.3]},
    {u:1,   pc:[-.01,.955], tilt:1,  lum:0,  a:[0,.075],  t:[.2,0],     f:0,  kp:0, hs:[.02,-.62], hp:[-1,0,.2]}
  ];
  // main en coordonnées monde pour toutes les clés (interpolation continue du sol à l'épaule)
  for(const k of K){
    if(k.hs){ const o = shOff(k.tilt, {lum:k.lum}); k.h = [k.pc[0] + o[0] + k.hs[0], k.pc[1] + o[1] + k.hs[1], k.hs[1] > 0 ? .20 : .235]; }
    else k.h = [k.hw[0], k.hw[1], HZ];
    delete k.hs; delete k.hw;
  }
  return {K, HZ};
})();
function burpee(s, o, t){
  const k = kf(BU.K, s);
  const ft = z => ({ankle:[k.a[0], k.a[1], z], toe:[k.a[0] + k.t[0], k.a[1] + k.t[1], z + (z > 0 ? .02 : -.02)],
    pole:[lerp(1, 0, k.kp), lerp(0, -1, k.kp), z > 0 ? lerp(.35, 0, k.kp) : -lerp(.35, 0, k.kp)], toeFlex:k.f});
  const fz = lerp(.14, .09, k.kp);
  const u = ((s % 1) + 1) % 1;
  const floorH = u > .11 && u < .5, hz = k.h[2];
  return {
    pc:k.pc, tilt:k.tilt, dev:{lum:k.lum, thlow:k.lum*.6}, gaze: u > .1 && u < .5 ? 'floorAhead' : [3, 1.3], gazeK:.6,
    legs:{L:ft(fz), R:ft(-fz)},
    arms:{mode:'custom', curl: floorH ? 'flat' : 'loose',
      L:{hand:[k.h[0], k.h[1], hz], pole:[k.hp[0], k.hp[1], k.hp[2]], rel:'world'},
      R:{hand:[k.h[0], k.h[1], -hz], pole:[k.hp[0], k.hp[1], -k.hp[2]], rel:'world'}},
    focus:['quads','glutes','pecs','calves'],
    phase: u < .45 ? 0 : u < .81 ? 2 : 3
  };
}

/* ================================================================ accessoires */
// supports de banc de développé couché : deux montants avec crochets en J, côté tête
Rig.prop('extra_rack', {
  make(c){ const T = c.THREE, g = new T.Group();
    for(const z of [-1, 1]){
      const post = c.mk(new T.BoxGeometry(.06, 1, .06), c.mats.mach); post.userData.z = z; g.add(post);
      const hook = c.mk(new T.BoxGeometry(.09, .025, .05), c.mats.steel); hook.userData.z = z; hook.userData.hook = 1; g.add(hook);
      const lip = c.mk(new T.BoxGeometry(.02, .05, .05), c.mats.steel); lip.userData.z = z; lip.userData.lip = 1; g.add(lip);
      const ft = c.mk(new T.BoxGeometry(.5, .04, .08), c.mats.mach); ft.userData.z = z; ft.userData.foot = 1; g.add(ft);
    }
    return g; },
  update(g, s){ const zz = s.zw || .5, H = s.h;
    g.position.set(s.x, 0, 0);
    for(const m of g.children){ const z = m.userData.z * zz;
      if(m.userData.hook){ m.position.set(.035, H - .0125, z); }
      else if(m.userData.lip){ m.position.set(.075, H + .01, z); }
      else if(m.userData.foot){ m.position.set(0, .02, z); }
      else { m.scale.y = H + .12; m.position.set(0, (H + .12)/2, z); } } }
});

/* ================================================================ 2. développé couché barre */
const BP = {h:.43, px:0};           // hauteur du banc, x du bassin
function benchpress(s, o, t){
  const pc = [BP.px, BP.h + .115];
  const shx = -.47;                 // x des épaules (mesuré au rendu)
  const top = [shx + .02, 1.14], bot = [shx + .18, .685];
  const k = s;
  const bx = lerp(top[0], bot[0], k), by = lerp(top[1], bot[1], k);
  const gz = .40;
  return {
    pc, tilt:-90, dev:{lum:-6, thlow:-2}, gaze:'up', gazeK:.8,
    legs:{L:foot(.44, .075, .22, {pole:[.15,1,.25]}), R:foot(.44, .075, -.22, {pole:[.15,1,-.25]})},
    arms:{mode:'custom', curl:'grip',
      L:{hand:[bx, by, gz], pole:[.35,-1,.7], rel:'world'},
      R:{hand:[bx, by, -gz], pole:[.35,-1,-.7], rel:'world'}},
    carry:[{type:'bar', at:'gripMid', axis:'z'}],
    world:{bench:{x0:-1.05, x1:.22, h:BP.h, z:0, w:.30}, extra_rack:{x:-.66, h:1.08, zw:.52}},
    focus:['pecs','triceps','delts']
  };
}

/* ================================================================ 3. leg extension à la machine */
// machine : siège, dossier incliné, bras de levier qui pivote dans l'axe du genou (côté droit),
// rouleau posé sur le bas des tibias, poignées de part et d'autre du siège.
Rig.prop('extra_legext', {
  make(c){ const T = c.THREE, g = new T.Group(), U = g.userData;
    U.seat = c.mk(new T.BoxGeometry(1, .08, .40), c.mats.pad); g.add(U.seat);
    U.seatBase = c.mk(new T.BoxGeometry(1, 1, .30), c.mats.mach); g.add(U.seatBase);
    U.back = c.mk(new T.BoxGeometry(.08, .62, .38), c.mats.pad); g.add(U.back);
    U.backFrame = c.mk(new T.BoxGeometry(.05, .55, .10), c.mats.mach); g.add(U.backFrame);
    U.floor = c.mk(new T.BoxGeometry(1.25, .04, .55), c.mats.mach); g.add(U.floor);
    U.post = c.mk(new T.BoxGeometry(.08, 1, .08), c.mats.mach); g.add(U.post);
    U.hub = c.mk(new T.CylinderGeometry(.07, .07, .06, 24), c.mats.steel); U.hub.rotation.x = Math.PI/2; g.add(U.hub);
    U.lever = c.mk(new T.BoxGeometry(1, .045, .04), c.mats.mach); g.add(U.lever);
    U.cross = c.mk(new T.CylinderGeometry(.016, .016, 1, 10), c.mats.steel); U.cross.rotation.x = Math.PI/2; g.add(U.cross);
    U.roll = c.mk(new T.CylinderGeometry(.055, .055, .46, 24), c.mats.pad); U.roll.rotation.x = Math.PI/2; g.add(U.roll);
    U.handles = [1, -1].map(z => { const h = c.mk(new T.CylinderGeometry(.018, .018, .16, 12), c.mats.dark); h.rotation.z = Math.PI/2; h.userData.z = z; g.add(h); return h; });
    U.hStems = [1, -1].map(z => { const h = c.mk(new T.BoxGeometry(.03, .03, .1), c.mats.mach); h.userData.z = z; g.add(h); return h; });
    return g; },
  update(g, s){ const U = g.userData;
    const S = s.seat, x0 = s.x0, x1 = s.x1, L = x1 - x0, zl = s.lz;
    U.seat.scale.x = L; U.seat.position.set((x0 + x1)/2, S - .04, 0);
    U.seatBase.scale.set(L*.5, S - .08, 1); U.seatBase.position.set((x0 + x1)/2 - L*.1, (S - .08)/2, 0);
    // dossier incliné (angle b par rapport à la verticale, penché vers l'arrière)
    const b = s.backTilt*D2R, bh = .62;
    U.back.rotation.z = b; U.back.position.set(s.bx - Math.sin(b)*bh/2, S + .02 + Math.cos(b)*bh/2, 0);
    U.backFrame.rotation.z = b; U.backFrame.position.set(s.bx - .06 - Math.sin(b)*.3, S + .02 + Math.cos(b)*.3, 0);
    U.floor.position.set((x0 + s.kx)/2 - .05, .02, 0); U.floor.scale.x = (s.kx - x0 + .5)/1.25;
    // montant et axe du levier au niveau du genou, côté droit
    U.post.scale.y = s.ky; U.post.position.set(s.kx, s.ky/2, zl);
    U.hub.position.set(s.kx, s.ky, zl);
    const a = s.a*D2R, d = [Math.cos(a), -Math.sin(a)], n = [Math.sin(a), Math.cos(a)];
    const rx = s.kx + d[0]*s.r + n[0]*s.off, ry = s.ky + d[1]*s.r + n[1]*s.off;
    const lx = rx - s.kx, ly = ry - s.ky, ll = Math.hypot(lx, ly);
    U.lever.scale.x = ll; U.lever.position.set(s.kx + lx/2, s.ky + ly/2, zl); U.lever.rotation.z = Math.atan2(ly, lx);
    U.cross.scale.y = Math.abs(zl) - .02; U.cross.position.set(rx, ry, zl/2 + .02*Math.sign(zl) - .0);
    U.roll.position.set(rx, ry, s.rz || 0);
    U.handles.forEach(h => h.position.set(s.hx, s.hy, s.hz*h.userData.z));
    U.hStems.forEach(h => h.position.set(s.hx - .07, s.hy - .01, (s.hz - .06)*h.userData.z));
  }
});

const LE = {seat:.55, px:-.05, backTilt:14, r:.35, off:.095};
let leDir = 1, leLast = 0, leSide = 'L';
function legext(s, o, t){
  const pc = [LE.px, LE.seat + .093];
  const K = [pc[0] + .445, pc[1]];                 // axe du genou = axe du levier
  const aW = lerp(4, 92, s);                       // angle du tibia sous l'horizontale (4° = jambe tendue, 92° = genou fléchi)
  let aF = aW, side = o.side || leSide;
  if(o.oneDown){
    // sens du mouvement (descente = s qui augmente) pour savoir si on est dans la phase excentrique
    if(s > leLast + 1e-4){ if(leDir !== 1 && !o.side){ leSide = leSide === 'L' ? 'R' : 'L'; side = leSide; } leDir = 1; }
    else if(s < leLast - 1e-4) leDir = -1;
    leLast = s;
    const desc = o.dir ? o.dir === 'down' : leDir === 1;
    // jambe libre : elle quitte le rouleau et redescend vite (le rouleau est posé dessus), puis remonte avec l'autre
    if(desc && s > 0) aF = Math.max(aW, lerp(4, 92, sm(clamp(s/.22, 0, 1))));
  }
  const legAt = (a, z) => { const r = a*D2R, d = [Math.cos(r), -Math.sin(r)], n = [Math.sin(r), Math.cos(r)];
    const an = [K[0] + d[0]*.452, K[1] + d[1]*.452];
    const ft = [an[0] + .2*(n[0]*.93 + d[0]*.37), an[1] + .2*(n[1]*.93 + d[1]*.37)];
    return {ankle:[an[0], an[1], z], toe:[ft[0], ft[1], z*1.1], pole:[.3, 1, z*.3], toeFlex:0}; };
  const free = o.oneDown ? (side === 'L' ? 'R' : 'L') : null;
  const legs = {L:legAt(free === 'L' ? aF : aW, .115), R:legAt(free === 'R' ? aF : aW, -.115)};
  const hx = pc[0] + .10, hy = LE.seat + .02, hz = .30;
  return {
    pc, tilt:-LE.backTilt, dev:{lum:2, thup:2}, gaze:[2.2, .75], gazeK:.6,
    legs,
    arms:{mode:'custom', curl:'grip',
      L:{hand:[hx, hy, hz], pole:[-1, -.2, .5], rel:'world'},
      R:{hand:[hx, hy, -hz], pole:[-1, -.2, -.5], rel:'world'}},
    world:{extra_legext:{seat:LE.seat, x0:pc[0] - .22, x1:K[0] - .07, bx:pc[0] - .165, backTilt:LE.backTilt,
      kx:K[0], ky:K[1], a:aW, r:LE.r, off:LE.off, lz:-.30, rz:-.03, hx, hy, hz}},
    focus: o.oneDown && s > 0 && aF > aW + 1 ? [side === 'L' ? 'quadsL' : 'quads'] : ['quads']
  };
}

const LIB = {burpee, benchpress, legext};
const META = {
  burpee:{family:'cardio', cycle:3.2, frame:{tx:-.15, ty:1.2, H:2.62, W:1.95, el:10, az:32}},
  benchpress:{family:'upper', tempo:true, cycle:3, frame:{tx:-.22, ty:.62, H:1.45, W:1.95, el:26, az:52}},
  legext:{family:'legs', tempo:true, cycle:4, frame:{tx:.12, ty:.72, H:1.65, W:1.6, el:12, az:28}}
};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
