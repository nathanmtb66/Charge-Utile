/* Charge Utile — famille « trailmob » : mobilité et étirements pour le trail (et la récupération).
   Colonne (chat-vache, enfiler l'aiguille, livre ouvert, enroulement), chevilles et pieds (soléaire,
   tibial antérieur, voûte plantaire, chien tête en bas), hanches (couch stretch, pigeon, lézard,
   avion de hanche, grenouille, cossack), ischios (sangle), respiration (allongé, assis).
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ aides vectorielles */
const add = (a, b) => [a[0]+b[0], a[1]+b[1], (a[2]||0)+(b[2]||0)];
const sub = (a, b) => [a[0]-b[0], a[1]-b[1], (a[2]||0)-(b[2]||0)];
const scl = (a, k) => [a[0]*k, a[1]*k, (a[2]||0)*k];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const len = a => Math.hypot(a[0], a[1], a[2]||0);
const nrm = a => { const l = len(a) || 1; return [a[0]/l, a[1]/l, (a[2]||0)/l]; };
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const mix = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
/** rotation autour de Y (convention du moteur : + = vers la droite de l'athlète) */
const rotY = (v, deg) => { const c = Math.cos(deg*D2R), s = Math.sin(deg*D2R); return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c]; };

/* ------------------------------------------------------------------ gabarit */
const TLINE = 1.78, TH = .445, SHK = .456, HIPZ = .113, SHZ = .208, ARM = .60;
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
/** décalage bassin → épaule dans le plan sagittal (sans rotation) */
function shOff(tilt, dev){
  dev = dev || {}; let x = 0, y = 0;
  for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - TLINE + (dev[k]||0)); x += r[0]; y += r[1]; }
  return [x, y];
}
/** tilt tel que la direction bassin → épaule vise (dx, dy) */
function tiltTo(dx, dy, dev){ const o = shOff(0, dev); return Math.atan2(dx, dy)/D2R - Math.atan2(o[0], o[1])/D2R; }
/** épaules et haut du dos calculés exactement comme le moteur (avec rotation, inclinaison, cap) */
const JR = {hipC:[-.003,.970,0], S0:[-.026,1.064,0], S1:[-.025,1.189,0], S2:[-.047,1.332,0], S3:[.015,1.549,0]};
function trunkPts(pc, tilt, dev, yaw){
  dev = dev || {}; yaw = yaw || 0;
  const dT = tilt - TLINE, TW = dev.twist || 0, BD = dev.bend || 0;
  const MR = (Dd, b, t) => { const m = new THREE.Matrix4().makeRotationY(yaw*D2R).multiply(new THREE.Matrix4().makeRotationZ(-Dd*D2R));
    if(b) m.multiply(new THREE.Matrix4().makeRotationX(b*D2R)); if(t) m.multiply(new THREE.Matrix4().makeRotationY(t*D2R)); return m; };
  const pel = MR(dT + (dev.pel||0), dev.pelBend||0, dev.pelTwist||0), lum = MR(dT + (dev.lum||0), BD*.35, TW*.3);
  const thl = MR(dT + (dev.thlow||0), BD*.7, TW*.65), thu = MR(dT + (dev.thup||0), BD, TW);
  const off = (a, b, M) => { const v = new THREE.Vector3(a[0]-b[0], a[1]-b[1], a[2]-b[2]).applyMatrix4(M); return [v.x, v.y, v.z]; };
  const P = [pc[0], pc[1], pc[2]||0];
  const S0 = add(P, off(JR.S0, JR.hipC, pel)), S1 = add(S0, off(JR.S1, JR.S0, lum)), S2 = add(S1, off(JR.S2, JR.S1, thl));
  return {S0, S2, S3:add(S2, off(JR.S3, JR.S2, thu)),
    shL:add(S2, off([.022,1.442,SHZ], JR.S2, thu)), shR:add(S2, off([.022,1.442,-SHZ], JR.S2, thu)),
    hipL:add(P, off([-.003,.970,HIPZ], JR.hipC, pel)), hipR:add(P, off([-.003,.970,-HIPZ], JR.hipC, pel))};
}
/** genou calculé comme le moteur (IK deux segments) */
function kneeIK(hip, ank, pole){
  const d0 = sub(ank, hip), dir = nrm(d0);
  const d = clamp(len(d0), Math.abs(TH-SHK)+1e-3, TH+SHK-1e-3);
  const ca = (TH*TH + d*d - SHK*SHK)/(2*TH*d), sa = Math.sqrt(Math.max(0, 1-ca*ca));
  let n = sub(pole, scl(dir, dot(pole, dir))); n = nrm(n);
  return add(add(hip, scl(dir, TH*ca)), scl(n, TH*sa));
}
/** direction du genou connaissant le genou voulu */
const poleOf = (hip, knee, ank) => { const dir = nrm(sub(ank, hip)), k = sub(knee, hip); return nrm(sub(k, scl(dir, dot(k, dir)))); };
/** jambe : cheville, direction des orteils, direction du genou, dessus du pied (facultatif) */
const lg = (ankle, dir, pole, up, flex) => { const o = {ankle, toe:add(ankle, scl(nrm(dir), .2)), pole, toeFlex:flex||0}; if(up) o.sole = up; return o; };
const hipPos = (pc, side, yaw = 0) => add([pc[0], pc[1], pc[2]||0], rotY([0, 0, side === 'L' ? HIPZ : -HIPZ], yaw));
/** main posée sur une cible, jamais plus loin que la longueur du bras */
const reach = (sh, target, max = ARM) => { const d = sub(target, sh), l = len(d); return l <= max ? target : add(sh, scl(d, max/l)); };
/** jambe dans le plan sagittal : cuisse à l'angle a (° depuis +X), genou fléchi de f */
function legAt(hip, a, f){
  const k = [hip[0] + TH*Math.cos(a*D2R), hip[1] + TH*Math.sin(a*D2R)];
  const b = (a - f)*D2R;
  return {knee:k, ankle:[k[0] + SHK*Math.cos(b), k[1] + SHK*Math.sin(b)], shin:a - f};
}
/** pied en appui sur l'avant-pied (pivot sous les métatarses en (mx, gy)), th = talon levé (°) */
function ballFoot(mx, gy, z, th, pole){
  const a = th*D2R, c = Math.cos(a), s = Math.sin(a), px = .14, py = -.074;
  const ax = mx - (px*c + py*s), ay = gy - (-px*s + py*c);
  return {ankle:[ax, ay, z], toe:[ax + .2*c, ay - .2*s, z + (z > 0 ? .02 : -.02)], pole:pole || [1, 0, z > 0 ? .2 : -.2], toeFlex:th > 0 ? th*.55 : 0};
}
const flatFoot = (x, z, out = 0, pole) => lg([x, .075, z], [Math.cos(out*D2R), 0, Math.sin(out*D2R)*(z > 0 ? 1 : -1)], pole || [1, 0, z > 0 ? .25 : -.25], [0, 1, 0]);
/** respiration lente pour les tenues (t en secondes) */
const breath = t => .5 + .5*Math.sin((t||0)*1.25);

/* ------------------------------------------------------------------ miroir gauche / droite */
const MZ = a => Array.isArray(a) ? [a[0], a[1], -(a[2]||0)] : a;
const SZM = () => new THREE.Matrix4().makeScale(1, 1, -1);
function mirror(p){
  const q = Object.assign({}, p);
  q.pc = MZ(p.pc);
  const ml = l => Object.assign({}, l, {ankle:MZ(l.ankle), toe:MZ(l.toe), pole:MZ(l.pole)}, l.sole ? {sole:MZ(l.sole)} : {});
  q.legs = {L:ml(p.legs.R), R:ml(p.legs.L)};
  if(p.dev){ q.dev = Object.assign({}, p.dev); for(const k of ['twist','bend','pelTwist','pelBend']) if(q.dev[k]) q.dev[k] = -q.dev[k]; }
  for(const k of ['yaw','headTurn','headTilt']) if(p[k]) q[k] = -p[k];
  if(p.arms && p.arms.mode === 'custom'){
    const ma = a => a && Object.assign({}, a, a.hand ? {hand:MZ(a.hand)} : {}, a.t ? {t:[a.t[0], a.t[1], -a.t[2]]} : {}, {pole:MZ(a.pole)});
    q.arms = Object.assign({}, p.arms, {L:ma(p.arms.R), R:ma(p.arms.L)});
  }
  if(p.root && p.root.m) q.root = {m:SZM().multiply(p.root.m).multiply(SZM())};
  if(p.world){ const w = {};
    for(const k in p.world){ const v = p.world[k];
      w[k] = (v && typeof v === 'object') ? Object.assign({}, v, {z:-(v.z||0)}, v.rot ? {rot:-v.rot} : {}, v.side ? {side:v.side === 'L' ? 'R' : 'L'} : {}) : v; }
    q.world = w; }
  if(p.focus) q.focus = p.focus.map(f => f === 'quadsL' ? 'quads' : f);
  return q;
}
const sided = fn => (s, o, t) => { o = o || {}; const p = fn(s, o, t || 0); return o.side === 'R' ? mirror(p) : p; };
/** alterné : première moitié du cycle côté gauche, seconde moitié en miroir */
const alternate = half => (s, o, t) => { const u = ((s % 1) + 1) % 1; return u < .5 ? half(u*2, o || {}, t || 0) : mirror(half(u*2 - 1, o || {}, t || 0)); };

/* ------------------------------------------------------------------ accessoire : sangle autour de l'avant-pied */
Rig.prop('trailmob_strap', {
  make(c){ const g = new c.THREE.Group();
    for(let i = 0; i < 3; i++) g.add(c.mk(new c.THREE.CylinderGeometry(.008, .008, 1, 6), c.mats.band));
    return g; },
  update(g, s, c){
    const T = c.THREE, sk = c.sk, side = s.side || 'L';
    const A = sk['ankle'+side], F = sk['fF'+side], D = sk['fD'+side];
    const lat = new T.Vector3().crossVectors(F, D).normalize();
    const sole = A.clone().add(F.clone().multiplyScalar(.12)).add(D.clone().multiplyScalar(-.05));
    const p1 = sole.clone().add(lat.clone().multiplyScalar(.055)), p2 = sole.clone().add(lat.clone().multiplyScalar(-.055));
    const gL = sk.gripL, gR = sk.gripR;
    const swap = p1.distanceTo(gL) + p2.distanceTo(gR) > p1.distanceTo(gR) + p2.distanceTo(gL);
    const segs = [[p1, p2], [p1, swap ? gR : gL], [p2, swap ? gL : gR]];
    const Y = new T.Vector3(0, 1, 0);
    segs.forEach(([a, b], i) => { const m = g.children[i], d = b.clone().sub(a), l = d.length();
      m.position.copy(a).add(b).multiplyScalar(.5); m.scale.set(1, Math.max(l, .001), 1); m.quaternion.setFromUnitVectors(Y, d.normalize()); });
  }
});

/* ================================================================ quadrupédie : repères communs */
const QKY = .065;
const QD = {pc:[0, QKY + TH, 0], tilt:80};
/** hauteur du bassin quand il recule (genoux fixes au sol, sous les hanches au départ) */
const quadY = px => QKY + Math.sqrt(Math.max(0, TH*TH - px*px - .013*.013));
const QD_S = trunkPts(QD.pc, QD.tilt, {}).shL;
const QD_H = [QD_S[0] + .03, .03, SHZ - .02];                  // main gauche à plat sous l'épaule
/** genou au sol sous la hanche, dessus du pied à plat derrière */
const quadLeg = (z, pc = QD.pc) => { const knee = [0, QKY, z], ank = [-.44, .048, z];
  return lg(ank, [-.97, -.2, 0], poleOf(hipPos(pc, z > 0 ? 'L' : 'R'), knee, ank), [0, -1, 0], 0); };

/* ================================================================ 1. chat-vache */
const CC_F = [{u:0, c:0}, {u:.22, c:-1, hold:true}, {u:.36, c:-1}, {u:.62, c:1, hold:true}, {u:.76, c:1}, {u:1, c:0}];
function tm_catcow(s, o, t){
  const c = kf(CC_F, s).c, cat = Math.max(0, c), cow = Math.max(0, -c);
  const pc = QD.pc;
  const dev = {lum:0, thlow:16*cat - 16*cow, thup:30*cat - 30*cow};
  let tilt = QD.tilt;
  for(let i = 0; i < 3; i++){
    dev.pel = (QD.tilt - 22*cat + 20*cow) - tilt;             // bassin : rétroversion (chat) / antéversion (vache)
    tilt = tiltTo(QD_S[0] - pc[0], QD_S[1] - pc[1] + .03*cat - .01*cow, dev);
  }
  const g = c < 0 ? mix([pc[0] + 1.2, 0], [pc[0] + 1.3, 1.25], cow) : mix([pc[0] + 1.2, 0], [pc[0] + .05, 0], cat);
  return {
    pc, tilt, dev, gaze:g, gazeK:lerp(.6, .9, Math.max(cat, cow)),
    legs:{L:quadLeg(.10), R:quadLeg(-.10)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:QD_H, pole:[-1, .2, .3], rel:'world'},
      R:{hand:MZ(QD_H), pole:[-1, .2, -.3], rel:'world'}},
    world:{mat:{x:-.1}},
    focus:['lowback','abs','upperback'],
    phase: s < .36 ? 0 : s < .76 ? 2 : 3
  };
}

/* ================================================================ 2. enfiler l'aiguille (bras droit) */
const TH_F = [
  {u:0,   a:0},
  {u:.3,  a:-1, hold:true},
  {u:.42, a:-1},
  {u:.72, a:1, hold:true},
  {u:.84, a:1},
  {u:1,   a:0}
];
function threadHalf(v){
  const a = kf(TH_F, v).a, w = sm(Math.abs(a)), thr = a < 0 ? w : 0, opn = a > 0 ? w : 0;
  const px = QD.pc[0] - .14*thr, pc = [px, quadY(px), 0];
  const dev = {twist:-62*thr + 50*opn, thlow:8*thr, thup:10*thr, bend:-6*thr};
  const tilt = QD.tilt + 34*thr;
  const P = trunkPts(pc, tilt, dev);
  const base = MZ(QD_H);
  let hR, poleR, curlR = 'flat';
  if(a <= 0){
    const thread = [QD_S[0] - .16, .045, .52];
    hR = mix(base, thread, sm(thr));
    hR[1] = .03 + .015*thr + .03*Math.sin(Math.PI*sm(thr));
    hR = reach(P.shR, hR, .6);
    poleR = nrm(mix([-1, .2, -.3], [-.2, 1, -.5], thr));
    curlR = thr > .15 ? 'loose' : 'flat';
  } else {
    const d0 = nrm(sub(base, P.shR)), up = nrm([-.02, 1, -.12]);
    const side = [0, 0, -1];
    const d = nrm(add(add(scl(d0, 1 - opn), scl(up, opn)), scl(side, .6*Math.sin(Math.PI*opn))));
    hR = add(P.shR, scl(d, lerp(len(sub(base, P.shR)), .6, sm(Math.min(1, opn*2)))));
    if(hR[1] < .03) hR[1] = .03;
    poleR = nrm(mix([-1, .2, -.3], [-1, 0, 0], opn));
    curlR = opn > .1 ? 'loose' : 'flat';
  }
  return {
    pc, tilt, dev, headTurn:-25*thr + 30*opn, headTilt:-10*thr, gaze:[pc[0] + 1.2, 0], gazeK:.5,
    legs:{L:quadLeg(.10, pc), R:quadLeg(-.10, pc)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:QD_H, pole:nrm([-1, .2 + .4*thr, .3 + .6*thr]), rel:'world'},
      R:{hand:hR, pole:poleR, rel:'world', curl:curlR}},
    world:{mat:{x:-.1}},
    focus:['upperback','obliques','delts'],
    phase: v < .42 ? 0 : v < .84 ? 2 : 3
  };
}
const tm_thread = alternate(threadHalf);

/* ================================================================ 3. livre ouvert (couché sur le côté droit, genoux fléchis)
   Le corps est décrit « debout » (bassin en [0, .955, 0]) puis basculé sur le côté par root.m. */
const OB = {beta:0, ty:.21};
const OB_M = (() => {
  const th = (-90 + OB.beta)*D2R;
  return new THREE.Matrix4().makeTranslation(0, OB.ty - .955*Math.cos(th), -.955*Math.sin(th)).multiply(new THREE.Matrix4().makeRotationX(th));
})();
const OB_F = [{u:0, k:0}, {u:.1, k:0}, {u:.45, k:1, hold:true}, {u:.62, k:1}, {u:.95, k:0}, {u:1, k:0}];
function tm_openbook(s, o, t){
  const k = kf(OB_F, s).k, e = sm(k);
  const pc = [0, .955, 0];
  // hanches et genoux fléchis à 90° (genoux empilés)
  const legB = (z, zk) => { const hip = [pc[0], pc[1], z*HIPZ];
    const knee = [hip[0] + .43, hip[1] - .10, zk];
    const ank = [knee[0] - .02, knee[1] - .45, zk + .005];
    return lg(ank, [.97, -.1, 0], poleOf(hip, knee, ank), null, 0); };
  const tw = -85*e;
  const dev = {twist:tw, pelTwist:-6*e, thup:2, bend:lerp(13, -5, e)};
  // bras du dessous : tendu devant, au sol ; bras du dessus : arc de l'avant vers l'arrière
  const hR = [.58, -.04, .04];
  const ph = lerp(-30, 205, e)*D2R;
  const dirL = nrm([Math.cos(ph), -.04 - .08*Math.sin(Math.PI*e), Math.sin(ph)]);
  const Lr = lerp(.58, .6, e);
  const hL = add(scl(dirL, Lr), [0, 0, 0]);
  return {
    pc, tilt:0, dev, headTurn:-35*e, gaze:[3, 1.45], gazeK:.4,
    legs:{L:legB(1, .02), R:legB(-1, -.11)},
    arms:{mode:'custom', curl:'loose',
      L:{hand:hL, pole:nrm(mix([0, -1, .6], [0, -1, .2], e)), rel:'sh', curl:'loose'},
      R:{hand:hR, pole:[0, -1, -.4], rel:'sh', curl:'loose'}},
    root:{m:OB_M},
    world:{mat:{x:.1, z:-.2, rot:90}},
    focus:['upperback','obliques','pecs'],
    phase: s < .45 ? 0 : s < .95 ? 2 : 3
  };
}

/* ================================================================ à genoux, assis sur les talons : repères communs */
const KN = {kx:.30, ky:.065};
/** genoux au sol en (kx, ±kz), pieds à plat (dessus au sol) en arrière ; bassin assis sur les talons */
function kneelSit(hipY, kz, az, lift = 0){
  const legs = {}, kk = {};
  for(const sd of ['L', 'R']){
    const sz = sd === 'L' ? 1 : -1;
    const ank = [KN.kx - SHK + .01, .046, az*sz];
    // le tibia pivote autour de la cheville quand le genou se lève (lift en mètres)
    const d0 = nrm(sub([KN.kx, KN.ky, kz*sz], ank));
    const a = Math.asin(clamp(d0[1] + lift/SHK, -1, 1)), h = Math.hypot(d0[0], d0[2]);
    const dir = [Math.cos(a)*d0[0]/h, Math.sin(a), Math.cos(a)*d0[2]/h];
    kk[sd] = add(ank, scl(dir, SHK));
    legs[sd] = {ank};
  }
  const k = kk.L, dy = hipY - k[1];
  const px = k[0] - Math.sqrt(Math.max(0, TH*TH - dy*dy - (kz - HIPZ)**2));
  const pc = [px, hipY, 0];
  for(const sd of ['L', 'R']){ const sz = sd === 'L' ? 1 : -1, ank = legs[sd].ank;
    legs[sd] = lg(ank, [-.97, -.22, .05*sz], poleOf(hipPos(pc, sd), kk[sd], ank), [0, -1, 0], 0);
    legs[sd].knee = kk[sd]; }
  return {pc, legs};
}

/* ================================================================ 4. posture de l'enfant */
function tm_childpose(s, o, t){
  const b = osc(s);
  const K = kneelSit(.225 + .005*b, .22, .06);
  const pc = K.pc;
  const dev = {pel:6, lum:16, thlow:16 + 2*b, thup:10 + 2*b};
  const S = [pc[0] + .40, .20 + .008*b];
  const tilt = tiltTo(S[0] - pc[0], S[1] - pc[1], dev);
  const P = trunkPts(pc, tilt, dev);
  const hx = P.shL[0] + .55;
  return {
    pc, tilt, dev, gaze:[pc[0] + .7, -.3], gazeK:.8,
    legs:K.legs,
    arms:{mode:'custom', curl:'flat',
      L:{hand:reach(P.shL, [hx, .045, .17]), pole:[-.2, 1, .3], rel:'world'},
      R:{hand:reach(P.shR, [hx, .045, -.17]), pole:[-.2, 1, -.3], rel:'world'}},
    world:{mat:{x:.1}},
    focus:['lowback','lats','glutes']
  };
}

/* ================================================================ 5. chien tête en bas, pédalage des talons */
const DD = {pc:[.44, .85, 0], mx:.14, hx:1.16};
function tm_downdog(s, o, t){
  const kL = bump(s, .25, .25), kR = bump(s, .75, .25);
  const pc = [DD.pc[0], DD.pc[1] - .01*(kL + kR), 0];
  const dev = {pel:-2, lum:-2, thlow:-5, thup:-8};
  // tilt : le bras (épaule → main) prolonge le buste
  const H = [DD.hx, .03];
  let lo = 110, hi = 175;
  for(let i = 0; i < 30; i++){ const m = (lo + hi)/2, so = shOff(m, dev); const d = Math.hypot(H[0] - pc[0] - so[0], H[1] - pc[1] - so[1]);
    if(d > .595) hi = m; else lo = m; }
  const tilt = (lo + hi)/2;
  const ft = (k, z) => ballFoot(DD.mx, .001, z, 42*sm(k), [1, 0, z > 0 ? .12 : -.12]);
  return {
    pc, tilt, dev, gaze:[.1, .1], gazeK:.5,
    legs:{L:ft(kL, .12), R:ft(kR, -.12)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[DD.hx, .03, .17], pole:[-1, 0, .5], rel:'world'},
      R:{hand:[DD.hx, .03, -.17], pole:[-1, 0, -.5], rel:'world'}},
    world:{mat:{x:.55}},
    focus:['calves','hams','delts'],
    phase: (s > .25 && s < .5) || s > .75 ? 3 : 0
  };
}

/* ================================================================ 6. couch stretch (genou gauche contre le mur) */
const CO = {wx:-.45};
function tm_couch(s, o, t){
  const b = osc(s);
  const kL = [CO.wx + .065, .05, .10];
  const aL = [CO.wx + .045, .05 + .445, .10];
  const e = lerp(10, 15, b);
  const hipL = add(kL, [TH*Math.sin(e*D2R), TH*Math.cos(e*D2R), .013]);
  const pc = [hipL[0], hipL[1], 0];
  const legL = lg(aL, [-.03, 1, 0], poleOf(hipL, kL, aL), [-1, 0, 0], 0);
  const hipR = hipPos(pc, 'R');
  const aR = [hipL[0] + .43, .075, -.15];
  const kR = [aR[0] + .01, .075 + .45, -.14];
  const legR = lg(aR, [1, 0, -.08], poleOf(hipR, kR, aR), [0, 1, 0], 0);
  const kneeR = kneeIK(hipR, aR, legR.pole);
  const top = add(kneeR, [-.03, .075, 0]);
  const dev = {pel:lerp(-4, -9, b), lum:1, thup:1};
  return {
    pc, tilt:lerp(1, -2, b), dev, gaze:[3, 1.2], gazeK:.4,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'loose',
      L:{hand:add(top, [.0, .03, .06]), pole:[-.3, -.2, 1], rel:'world'},
      R:{hand:add(top, [-.02, 0, -.03]), pole:[-.3, -.4, -1], rel:'world'}},
    world:{wall:{x:CO.wx, z:0}, mat:{x:CO.wx + 1.1}},
    focus:['hipflex','quads']
  };
}

/* ================================================================ 7. pigeon au sol, buste penché (jambe gauche devant) */
function tm_pigeon(s, o, t){
  const b = osc(s);
  const kL = [.30, .075, .20];
  const hy = .20 - .01*b;
  const dz = HIPZ - kL[2], dy = hy - kL[1];
  const hipL = [kL[0] - Math.sqrt(TH*TH - dy*dy - dz*dz), hy, HIPZ];
  const pc = [hipL[0], hy, 0];
  const sd = nrm([-.30, 0, -.95]);
  const aL = add(kL, add(scl(sd, SHK*.98), [0, -.015, 0]));
  const legL = lg(aL, [.95, .05, -.30], poleOf(hipL, kL, aL), nrm([.3, .15, .95]), 0);
  const hipR = hipPos(pc, 'R');
  const ry = hy - .045, rx = Math.sqrt(.895*.895 - ry*ry);
  const aR = [hipR[0] - rx, .045, -.12];
  const legR = lg(aR, [-1, -.12, 0], [0, -1, 0], [0, -1, 0], 0);
  const dev = {pel:2, lum:10, thlow:18 + 2*b, thup:18 + 2*b};
  const S = [pc[0] + .44, .33 - .01*b];
  const tilt = tiltTo(S[0] - pc[0], S[1] - pc[1], dev);
  const P = trunkPts(pc, tilt, dev);
  const arm = (sh, z) => ({hand:[sh[0] + .30, .045, z], pole:[-.1, -1, z > 0 ? .5 : -.5], rel:'world', curl:'flat'});
  return {
    pc, tilt, dev, gaze:'down', gazeK:.6,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'flat', L:arm(P.shL, .10), R:arm(P.shR, -.10)},
    world:{mat:{x:-.2}},
    focus:['glutes','hipflex']
  };
}

/* ================================================================ 8. fente basse « lézard » (pied gauche devant, à l'extérieur des mains) */
const LZ = {kx:-.35, fx:.27};
const LZ_F = [{u:0, d:0}, {u:.1, d:0}, {u:.36, d:1, hold:true}, {u:.86, d:1}, {u:1, d:0}];
function tm_lizard(s, o, t){
  const d = sm(kf(LZ_F, s).d), b = breath(t)*d;
  const kR = [LZ.kx, .065, -.11];
  const e = lerp(40, 50, d) + 1.5*b;
  const hipR = [kR[0] + TH*Math.sin(e*D2R), kR[1] + TH*Math.cos(e*D2R), -HIPZ - .02];
  const pc = [hipR[0], hipR[1], -.02];
  const aR = [kR[0] - SHK + .01, .046, -.11];
  const legR = lg(aR, [-.97, -.22, 0], poleOf(hipR, kR, aR), [0, -1, 0], 0);
  const aL = [LZ.fx, .075, .31];
  const legL = lg(aL, [.97, 0, .24], [.6, .5, .8], [0, 1, 0], 0);
  const dev = {pel:lerp(4, 6, d), lum:lerp(2, 6, d), thlow:lerp(2, 8, d), thup:lerp(0, 6, d)};
  const S = [lerp(LZ.fx + .01, LZ.fx + .12, d), lerp(.60, .31, d)];
  const tilt = tiltTo(S[0] - pc[0], S[1] - pc[1], dev);
  const P = trunkPts(pc, tilt, dev);
  const hx = lerp(LZ.fx + .08, P.shL[0] + .32, d), hy = lerp(.03, .045, d) + .03*Math.sin(Math.PI*d);
  const arm = (sh, z) => ({hand:reach(sh, [hx, hy, z]), pole:nrm(mix([-1, .1, z > 0 ? .3 : -.3], [-.1, -1, z > 0 ? .3 : -.3], d)), rel:'world', curl:'flat'});
  return {
    pc, tilt, dev, gaze:[pc[0] + 1.2, 0], gazeK:.45,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'flat', L:arm(P.shL, .10), R:arm(P.shR, -.15)},
    world:{mat:{x:-.1}},
    focus:['hipflex','adductors','glutes']
  };
}

/* ================================================================ 9. ischios à la sangle, cheville qui fléchit et s'étend (jambe gauche) */
const SUP_Y = .09;
const HF_F = [{u:0, k:0}, {u:.4, k:1}, {u:.55, k:1, hold:true}, {u:.92, k:0}, {u:1, k:0}];
function tm_hamfloss(s, o, t){
  const k = kf(HF_F, s).k;
  const pc = [0, SUP_Y, 0];
  const a = lerp(70, 76, k);
  const L = legAt(pc, a, 2);
  const aL = [L.ankle[0], L.ankle[1], .10];
  const fa = (L.shin + lerp(55, 105, k))*D2R;                // pointe tendue → pied flexé
  const legL = {ankle:aL, toe:[aL[0] + .2*Math.cos(fa), aL[1] + .2*Math.sin(fa), .11], pole:[-.2, 1, .1], toeFlex:0};
  const legR = {ankle:[.89, .08, -.11], toe:[.89 + .07, .08 + .19, -.13], pole:[0, 1, -.1], toeFlex:0};
  const P = trunkPts(pc, -90, {pel:-2, thup:3});
  const tgt = [aL[0], aL[1], 0];
  const arm = (sh, z) => { const d = nrm(sub(tgt, sh)); const h = add(sh, scl(d, .50 + .02*k)); return {hand:[h[0], h[1], z], pole:[.3, -.5, z > 0 ? 1 : -1], rel:'world', curl:'grip'}; };
  return {
    pc, tilt:-90, dev:{pel:-2, thup:3}, gaze:[aL[0], aL[1]], gazeK:.3,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'grip', L:arm(P.shL, .12), R:arm(P.shR, .03)},
    world:{mat:{x:-.1}, trailmob_strap:{side:'L'}},
    focus:['hams','calves'],
    phase: s < .4 ? 0 : s < .92 ? 2 : 3
  };
}

/* ================================================================ 10. avion de hanche (appui gauche)
   Le haut du corps et le bassin tournent d'un bloc autour de l'axe du buste, pivot sur la hanche d'appui. */
const HA = {tilt:74, hip:[-.03, .945, .115], ank:[0, .075, .115]};
const HA_F = [{u:0, r:0}, {u:.25, r:1, hold:true}, {u:.38, r:1}, {u:.62, r:-.65, hold:true}, {u:.75, r:-.65}, {u:1, r:0}];
function tm_hipairplane(s, o, t){
  const r = kf(HA_F, s).r;
  const rho = (r > 0 ? 45 : 40)*r;
  const P0 = HA.hip;
  const ax = nrm([Math.sin(HA.tilt*D2R), Math.cos(HA.tilt*D2R), 0]);
  const M = new THREE.Matrix4().makeTranslation(P0[0], P0[1], P0[2])
    .multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(ax[0], ax[1], ax[2]), rho*D2R))
    .multiply(new THREE.Matrix4().makeTranslation(-P0[0], -P0[1], -P0[2]));
  const Mi = M.clone().invert();
  const toB = p => { const v = new THREE.Vector3(p[0], p[1], p[2]).applyMatrix4(Mi); return [v.x, v.y, v.z]; };
  const dirB = d => { const v = new THREE.Vector3(d[0], d[1], d[2]).transformDirection(Mi); return [v.x, v.y, v.z]; };
  const pc = [P0[0], P0[1], P0[2] - HIPZ];
  // appui : pied fixe au sol (exprimé dans le repère du corps)
  const A = HA.ank, T = [A[0] + .2, A[1], A[2] + .03];
  const legL = {ankle:toB(A), toe:toB(T), pole:dirB([1, 0, .12]), sole:dirB([0, 1, 0]), toeFlex:0};
  // jambe libre : dans le prolongement du buste
  const hr = hipPos(pc, 'R');
  const la = (HA.tilt + 3)*D2R, dL = [-Math.sin(la), -Math.cos(la), 0];
  const aR = add(hr, add(scl(dL, .875), [0, 0, .03]));
  const legR = lg(aR, nrm(add(scl([Math.cos(la), -Math.sin(la), 0], 1), scl(dL, -.1))), [0, -1, 0], null, 0);
  legR.toe = add(aR, scl(nrm([.1, -1, 0]), .2));
  return {
    pc, tilt:HA.tilt, dev:{thup:3}, gaze:[pc[0] + 1.4, 0], gazeK:.35,
    legs:{L:legL, R:legR},
    arms:{mode:'hips'},
    root:{m:M},
    focus:['glutes','adductors','hams'],
    phase: s < .38 ? 0 : s < .75 ? 2 : 3
  };
}

/* ================================================================ 11. étirement du soléaire au mur (jambe gauche derrière, genou fléchi) */
const SO = {wx:.84};
function tm_calfsoleus(s, o, t){
  const b = osc(s);
  const pc = [.12 + .02*b, .80 - .03*b, .01];
  const tilt = 16 + 2*b;
  const legL = flatFoot(0, .12, 4, [1, 0, .12]);
  const legR = flatFoot(.44, -.12, 4, [1, 0, -.15]);
  const P = trunkPts(pc, tilt, {});
  const hy = P.shL[1] - .08;
  return {
    pc, tilt, dev:{}, gaze:[SO.wx, 1.3], gazeK:.3,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'flat',
      L:{hand:reach(P.shL, [SO.wx - .03, hy, .22], .56), pole:[-.3, -1, .6], rel:'world'},
      R:{hand:reach(P.shR, [SO.wx - .03, hy, -.22], .56), pole:[-.3, -1, -.6], rel:'world'}},
    world:{wall:{x:SO.wx, z:0}},
    focus:['calves']
  };
}

/* ================================================================ 12. étirement du tibial antérieur (assis sur les talons, genoux qui se soulèvent) */
const TB_F = [{u:0, k:0}, {u:.3, k:1, hold:true}, {u:.75, k:1}, {u:.95, k:0}, {u:1, k:0}];
function tm_tibstretch(s, o, t){
  const k = sm(kf(TB_F, s).k);
  const K = kneelSit(.235 + .02*k, .10, .08, .07*k);
  const pc = K.pc;
  const tilt = lerp(-40, -44, k);
  const dev = {pel:-2, thup:-2};
  const P = trunkPts(pc, tilt, dev);
  const hx = KN.kx - SHK - .07;
  return {
    pc, tilt, dev, gaze:[3, 1.0], gazeK:.4,
    legs:K.legs,
    arms:{mode:'custom', curl:'flat',
      L:{hand:reach(P.shL, [hx, .03, .26]), pole:[1, .2, .5], rel:'world'},
      R:{hand:reach(P.shR, [hx, .03, -.26]), pole:[1, .2, -.5], rel:'world'}},
    world:{mat:{x:.0}},
    focus:['shins']
  };
}

/* ================================================================ 13. voûte plantaire : assis sur les talons, orteils retournés */
function tm_toeyoga(s, o, t){
  const b = osc(s);
  const hy = .285 - .01*b;
  const kz = .10, dy = hy - KN.ky;
  const px = KN.kx - Math.sqrt(TH*TH - dy*dy - (kz - HIPZ)**2);
  const pc = [px, hy, 0];
  const leg = sd => { const sz = sd === 'L' ? 1 : -1;
    const knee = [KN.kx, KN.ky, kz*sz];
    const ank = [KN.kx - .43, .15, .085*sz];
    return lg(ank, [.32, -.95, .02*sz], poleOf(hipPos(pc, sd), knee, ank), [-.95, -.3, 0], 78); };
  const legs = {L:leg('L'), R:leg('R')};
  const onThigh = sd => { const sz = sd === 'L' ? 1 : -1; return [KN.kx - .10, KN.ky + .14, (kz + .03)*sz]; };
  return {
    pc, tilt:2 - 2*b, dev:{pel:2, thup:-1 - b}, gaze:[3, 1.1], gazeK:.4,
    legs,
    arms:{mode:'custom', curl:'loose',
      L:{hand:onThigh('L'), pole:[-.3, -.2, 1], rel:'world'},
      R:{hand:onThigh('R'), pole:[-.3, -.2, -1], rel:'world'}},
    world:{mat:{x:.0}},
    focus:['calves']
  };
}

/* ================================================================ 14. grenouille (adducteurs) avec bascule arrière */
const FR = {kz:.40, ky:.065, hx:.42};
const FR_F = [{u:0, k:0}, {u:.4, k:1}, {u:.55, k:1, hold:true}, {u:.92, k:0}, {u:1, k:0}];
function tm_frog(s, o, t){
  const k = kf(FR_F, s).k;
  const px = lerp(.02, -.24, k);
  const dz = FR.kz - HIPZ, h = Math.sqrt(TH*TH - dz*dz - px*px);
  const pc = [px, FR.ky + h - .005, 0];
  const leg = sd => { const sz = sd === 'L' ? 1 : -1;
    const knee = [0, FR.ky, FR.kz*sz], ank = [-SHK + .02, .06, (FR.kz + .02)*sz];
    return lg(ank, [0, -.05, sz], poleOf(hipPos(pc, sd), knee, ank), [1, 0, 0], 0); };
  const dev = {pel:lerp(-2, 4, k), thup:lerp(-2, 2, k)};
  const S = [lerp(.34, .12, k), lerp(.55, .50, k)];
  const tilt = tiltTo(S[0] - pc[0], S[1] - pc[1], dev);
  const P = trunkPts(pc, tilt, dev);
  const H = sz => [FR.hx, .03, .20*sz];
  return {
    pc, tilt, dev, gaze:[pc[0] + 1.3, 0], gazeK:.5,
    legs:{L:leg('L'), R:leg('R')},
    arms:{mode:'custom', curl:'flat',
      L:{hand:reach(P.shL, H(1)), pole:[-1, .1, .5], rel:'world'},
      R:{hand:reach(P.shR, H(-1)), pole:[-1, .1, -.5], rel:'world'}},
    world:{mat:{x:-.1, rot:90}},
    focus:['adductors','glutes'],
    phase: s < .4 ? 0 : s < .92 ? 2 : 3
  };
}

/* ================================================================ 15. cossack squat (fente latérale profonde, alterné) */
const CS = {fz:.64};
const CS_F = [{u:0, w:0}, {u:.35, w:1, hold:true}, {u:.5, w:1}, {u:1, w:0}];
function cossackHalf(v){                                          // v : milieu → gauche (plié) → milieu
  const w = sm(kf(CS_F, v).w);
  const pc = [lerp(-.07, -.13, w), lerp(.66, .40, w), lerp(0, .36, w)];
  const tilt = lerp(12, 30, w);
  const legL = flatFoot(0, CS.fz, 22, [1, .1, .8]);
  // jambe droite : se tend, le pied pivote sur le talon (pointe vers le haut)
  const th = 70*sm(clamp((w - .35)/.65, 0, 1));
  const heel = [-.05, .01, -CS.fz];
  const c = Math.cos(th*D2R), sn = Math.sin(th*D2R);
  const aR = [heel[0] + .05*c - .07*sn, heel[1] + .05*sn + .07*c, heel[2]];
  const out = -22*(1 - th/70);
  const fd = [c*Math.cos(out*D2R), sn, c*Math.sin(out*D2R)];
  const legR = lg(aR, fd, nrm([lerp(1, 0, w), lerp(.1, 1, w), lerp(-.8, -.2, w)]), null, 0);
  const cl = (sz) => ({t:[-.12, .30, .035*sz], pole:[-.3, -1, .8*sz], rel:'torso', curl:'loose'});
  return {
    pc, tilt, dev:{pel:lerp(2, 6, w), lum:lerp(0, 4, w)}, gaze:[2.6, .9], gazeK:.4,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'loose', L:cl(1), R:cl(-1)},
    world:{mat:{x:.0, rot:90}},
    focus:['adductors','quadsL','glutes'],
    phase: v < .35 ? 0 : v < .9 ? 2 : 3
  };
}
const tm_cossack = alternate(cossackHalf);

/* ================================================================ 16. enroulement vertébral debout (roll down / roll up) */
const RD_F = [
  {u:0,   tilt:0,  px:-.01, py:.955, pel:0,  lum:0,  thl:0,  thu:0,  n:0},
  {u:.08, tilt:0,  px:-.01, py:.955, pel:0,  lum:0,  thl:0,  thu:12, n:.6},
  {u:.2,  tilt:0,  px:-.02, py:.95,  pel:0,  lum:6,  thl:26, thu:44, n:1},
  {u:.32, tilt:10, px:-.06, py:.94,  pel:0,  lum:18, thl:40, thu:56, n:1},
  {u:.46, tilt:66, px:-.16, py:.88,  pel:0,  lum:22, thl:40, thu:46, n:1, hold:true},
  {u:.56, tilt:66, px:-.16, py:.88,  pel:0,  lum:22, thl:40, thu:46, n:1},
  {u:.72, tilt:10, px:-.06, py:.94,  pel:0,  lum:18, thl:40, thu:56, n:1},
  {u:.84, tilt:0,  px:-.02, py:.95,  pel:0,  lum:6,  thl:26, thu:44, n:1},
  {u:.94, tilt:0,  px:-.01, py:.955, pel:0,  lum:0,  thl:0,  thu:10, n:.5},
  {u:1,   tilt:0,  px:-.01, py:.955, pel:0,  lum:0,  thl:0,  thu:0,  n:0}
];
function tm_jefferson(s, o, t){
  const k = kf(RD_F, s);
  const pc = [k.px, k.py, 0];
  const dev = {pel:k.pel, lum:k.lum, thlow:k.thl, thup:k.thu};
  const P = trunkPts(pc, k.tilt, dev);
  const arm = (sh, z) => { const drop = Math.min(.59, sh[1] - .06);
    const dx = Math.sqrt(Math.max(0, .59*.59 - drop*drop));
    return {hand:[sh[0] + .03 + dx*.4, sh[1] - drop, z], pole:[-1, .1, z > 0 ? .3 : -.3], rel:'world', curl:'loose'}; };
  return {
    pc, tilt:k.tilt, dev, gaze:mix([3, 1.5], [pc[0] + .1, 0], k.n), gazeK:lerp(.4, .7, k.n),
    legs:{L:flatFoot(0, .12, 5, [1, 0, .15]), R:flatFoot(0, -.12, 5, [1, 0, -.15])},
    arms:{mode:'custom', curl:'loose', L:arm(P.shL, P.shL[2] - .02), R:arm(P.shR, P.shR[2] + .02)},
    focus:['lowback','hams','upperback'],
    phase: s < .46 ? 0 : s < .94 ? 2 : 3
  };
}

/* ================================================================ 17. respiration allongé sur le dos (cycle 10 s : 5 s d'inspiration, 5 s d'expiration) */
const breathCycle = s => { const u = ((s % 1) + 1) % 1; return u < .5 ? sm(u*2) : 1 - sm(u*2 - 1); };
function tm_breath(s, o, t){
  const b = breathCycle(s);
  const pc = [0, SUP_Y + .015, 0];
  const dev = {pel:-2 - 2*b, lum:-1 - 4*b, thlow:1 + 1.5*b, thup:3 + 1*b};
  const leg = z => { const L = legAt(pc, 58, 114);
    return lg([L.ankle[0], .075, z], [1, 0, 0], [0, 1, z*.6], [0, 1, 0], 0); };
  const belly = [-.16, .23 + .028*b, .02];
  const chest = [-.40, .25 + .012*b, -.02];
  return {
    pc, tilt:-90, dev, gaze:'ceiling', gazeK:.3,
    legs:{L:leg(.13), R:leg(-.13)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:belly, pole:[.2, .4, 1], rel:'world', curl:'flat'},
      R:{hand:chest, pole:[.3, .2, -1], rel:'world', curl:'flat'}},
    world:{mat:{x:-.1}},
    focus:['abs']
  };
}

/* ================================================================ 18. respiration assis en tailleur (cycle 10 s) */
function tm_seatbreath(s, o, t){
  const b = breathCycle(s);
  const pc = [0, .10, 0];
  const legs = {};
  for(const sd of ['L', 'R']){
    const sz = sd === 'L' ? 1 : -1;
    const knee = [.37, .14, .35*sz];
    const ank = sd === 'L' ? [.30, .105, -.08] : [.44, .105, .08];
    const shin = nrm(sub(ank, knee));
    const hip = hipPos(pc, sd);
    legs[sd] = lg(ank, nrm(add(shin, [.35, -.05, 0])), poleOf(hip, knee, ank), nrm([.4, .5, .3*sz]), 0);
    legs[sd].knee = knee;
  }
  const hnd = sd => { const k = legs[sd].knee, sz = sd === 'L' ? 1 : -1; return [k[0] - .02, k[1] + .09, k[2] - .02*sz]; };
  return {
    pc, tilt:2, dev:{pel:6, lum:-2 - 1.5*b, thlow:-1 - 1.5*b, thup:-1 - 2*b}, gaze:[3, 1.1], gazeK:.4,
    legs,
    arms:{mode:'custom', curl:'loose',
      L:{hand:hnd('L'), pole:[-.2, -.3, 1], rel:'world', roll:-10},
      R:{hand:hnd('R'), pole:[-.2, -.3, -1], rel:'world', roll:-10}},
    world:{mat:{x:.1}},
    focus:['abs']
  };
}

/* ------------------------------------------------------------------ déclarations */
const sf = fr => o => (o && o.side === 'R') ? Object.assign({}, fr, {az:180 - fr.az, tz:-(fr.tz||0)}) : fr;
const DEFS = {
  tm_catcow:      [tm_catcow,              {family:'mobility', cycle:6,   frame:{tx:.12, ty:.38, tz:0, H:1.0, W:1.4, el:14, az:30}}],
  tm_thread:      [tm_thread,              {family:'mobility', cycle:10,  frame:{tx:.1, ty:.66, tz:0, H:1.55, W:1.6, el:16, az:40}}],
  tm_openbook:    [tm_openbook,            {family:'mobility', cycle:6,   frame:{tx:.15, ty:.35, tz:-.15, H:1.25, W:1.7, el:40, az:60}}],
  tm_childpose:   [tm_childpose,           {family:'stretch',  cycle:6,   frame:{tx:.3, ty:.25, tz:0, H:.8, W:1.35, el:20, az:30}}],
  tm_downdog:     [tm_downdog,             {family:'mobility', cycle:2.4, frame:{tx:.6, ty:.55, tz:0, H:1.25, W:1.6, el:10, az:25}}],
  tm_couch:       [sided(tm_couch),        {family:'stretch',  cycle:6,   frame:sf({tx:-.05, ty:.75, tz:0, H:1.65, W:1.1, el:10, az:30})}],
  tm_pigeon:      [sided(tm_pigeon),       {family:'stretch',  cycle:6,   frame:sf({tx:-.1, ty:.25, tz:0, H:.7, W:1.55, el:25, az:40})}],
  tm_lizard:      [sided(tm_lizard),       {family:'stretch',  cycle:9,   frame:sf({tx:0, ty:.45, tz:0, H:1.0, W:1.6, el:14, az:30})}],
  tm_hamfloss:    [sided(tm_hamfloss),     {family:'mobility', cycle:2.6, frame:sf({tx:.1, ty:.5, tz:0, H:1.2, W:1.65, el:14, az:30})}],
  tm_hipairplane: [sided(tm_hipairplane),  {family:'mobility', cycle:5,   frame:sf({tx:-.15, ty:.78, tz:0, H:1.75, W:1.7, el:12, az:50})}],
  tm_calfsoleus:  [sided(tm_calfsoleus),   {family:'stretch',  cycle:6,   frame:sf({tx:.35, ty:.88, tz:0, H:1.85, W:1.2, el:12, az:-25})}],
  tm_tibstretch:  [tm_tibstretch,          {family:'stretch',  cycle:6,   frame:{tx:-.05, ty:.5, tz:0, H:1.15, W:1.0, el:12, az:30}}],
  tm_toeyoga:     [tm_toeyoga,             {family:'stretch',  cycle:6,   frame:{tx:.1, ty:.6, tz:0, H:1.25, W:.9, el:15, az:-35}}],
  tm_frog:        [tm_frog,                {family:'mobility', cycle:4,   frame:{tx:.1, ty:.35, tz:0, H:.9, W:1.4, el:20, az:50}}],
  tm_cossack:     [tm_cossack,             {family:'mobility', cycle:6,   frame:{tx:0, ty:.8, tz:0, H:1.7, W:1.8, el:10, az:75}}],
  tm_jefferson:   [tm_jefferson,           {family:'mobility', cycle:9,   frame:{tx:.05, ty:.9, tz:0, H:1.9, W:1.1, el:10, az:20}}],
  tm_breath:      [tm_breath,              {family:'stretch',  cycle:10,  frame:{tx:-.15, ty:.25, tz:0, H:.7, W:1.45, el:30, az:40}}],
  tm_seatbreath:  [tm_seatbreath,          {family:'stretch',  cycle:10,  frame:{tx:.15, ty:.52, tz:0, H:1.15, W:1.1, el:15, az:60}}]
};
for(const k in DEFS) Rig.define(k, DEFS[k][0], DEFS[k][1]);
})();
