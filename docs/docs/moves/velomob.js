/* Charge Utile — famille « velomob » : activation / mobilité avant le vélo, étirements, gainage.
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
/** rotation autour de Y (même convention que le moteur : + = vers la droite de l'athlète) */
const rotY = (v, deg) => { const c = Math.cos(deg*D2R), s = Math.sin(deg*D2R); return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c]; };
/** rotation d'un vecteur autour d'un axe (Rodrigues) */
const rotAx = (v, ax, deg) => { const k = nrm(ax), c = Math.cos(deg*D2R), s = Math.sin(deg*D2R), kv = cross(k, v), d = dot(k, v);
  return [0,1,2].map(i => v[i]*c + kv[i]*s + k[i]*d*(1-c)); };

/* ------------------------------------------------------------------ gabarit */
const TLINE = 1.78, TH = .445, SHK = .456, HIPZ = .113, SHZ = .208;
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
/** décalage bassin → épaule dans le plan sagittal */
function shOff(tilt, dev){
  dev = dev || {}; let x = 0, y = 0;
  for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - TLINE + (dev[k]||0)); x += r[0]; y += r[1]; }
  return [x, y];
}
/** tilt tel que la direction bassin → épaule vise (dx, dy) */
function tiltTo(dx, dy, dev){ const o = shOff(0, dev); return Math.atan2(dx, dy)/D2R - Math.atan2(o[0], o[1])/D2R; }
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
/** cheville à partir de la hanche, direction de cuisse et direction de tibia (genou exact) */
function legFrom(hip, dThigh, dShin){ const knee = add(hip, scl(nrm(dThigh), TH)); const ankle = add(knee, scl(nrm(dShin), SHK)); return {knee, ankle, pole:poleOf(hip, knee, ankle)}; }
/** jambe : cheville, direction des orteils, dessus du pied (facultatif), direction du genou */
const lg = (ankle, dir, pole, up, flex) => { const o = {ankle, toe:add(ankle, scl(nrm(dir), .2)), pole, toeFlex:flex||0}; if(up) o.sole = up; return o; };
const hipPos = (pc, side, yaw = 0) => add([pc[0], pc[1], pc[2]||0], rotY([0, 0, side === 'L' ? HIPZ : -HIPZ], yaw));

/* ------------------------------------------------------------------ miroir gauche / droite */
const MZ = a => Array.isArray(a) ? [a[0], a[1], -(a[2]||0)] : a;
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
  if(p.world){ const w = {};
    for(const k in p.world){ const v = p.world[k];
      w[k] = (v && typeof v === 'object') ? Object.assign({}, v, {z:-(v.z||0)}, v.rot ? {rot:-v.rot} : {}) : v; }
    q.world = w; }
  if(p.focus) q.focus = p.focus.map(f => f === 'quadsL' ? 'quads' : f);
  return q;
}
const sided = fn => (s, o, t) => { o = o || {}; const p = fn(s, o, t || 0); return o.side === 'R' ? mirror(p) : p; };

/* ================================================================ debout : repères */
const STAND = .955, FZ = .12;
const flatFoot = (x, z, out = 0) => lg([x, .075, z], [Math.cos(out*D2R), 0, Math.sin(out*D2R)*(z > 0 ? 1 : -1)], [1, 0, z > 0 ? .25 : -.25], [0, 1, 0]);
/** main posée sur un point en restant à portée du bras (sinon elle glisse vers l'épaule) */
const reach = (sh, target, max = .585) => { const d = sub(target, sh), l = len(d); return l <= max ? target : add(sh, scl(d, max/l)); };
/** point sur l'avant de la cuisse, à la fraction f depuis le genou */
const onThigh = (hip, knee, f, off = .07) => { const d = nrm(sub(hip, knee)); const n = nrm(cross(cross(d, [0, 1, 0]), d)); return add(add(knee, scl(sub(hip, knee), f)), scl(n.map((x, i) => i === 1 ? Math.abs(x) : x), off)); };
/** épaule (dos neutre, sans rotation) */
const shoulder = (pc, tilt, dev, side) => { const o = shOff(tilt, dev); return [pc[0] + o[0], pc[1] + o[1], (pc[2]||0) + (side === 'L' ? SHZ : -SHZ)]; };

/* ================================================================ 1. étirement dynamique des ischios
   Debout, buste penché dos plat, mains sur le bas des cuisses : les genoux plient puis se tendent. */
const HAM_F = [{u:0, k:0}, {u:.42, k:1}, {u:.55, k:1}, {u:.95, k:0}, {u:1, k:0}];
function vm_hamdyn(s, o, t){
  const k = kf(HAM_F, s).k;                       // 0 = genoux fléchis, 1 = genoux tendus
  const flex = lerp(62, 6, k), tilt = lerp(46, 62, k);
  const d = Math.sqrt(TH*TH + SHK*SHK + 2*TH*SHK*Math.cos(flex*D2R));
  const px = lerp(-.08, -.17, k);
  const pc = [px, .075 + Math.sqrt(d*d - px*px - (FZ - HIPZ)**2)];
  const dev = {pel:lerp(2, 0, k), lum:lerp(2, 0, k), thlow:2, thup:4};
  const legs = {L:flatFoot(0, FZ, 6), R:flatFoot(0, -FZ, 6)};
  const arm = side => {
    const sz = side === 'L' ? 1 : -1, hip = hipPos(pc, side), ank = legs[side].ankle;
    const knee = kneeIK(hip, ank, [1, 0, .05*sz]);
    const sh = shoulder(pc, tilt, dev, side);
    const h = reach(sh, onThigh(hip, knee, .2, .085), .575);
    return {hand:[h[0], h[1], knee[2] + .01*sz], pole:[-.2, -.3, 1*sz], rel:'world', curl:'loose', roll:-20};
  };
  return {
    pc, tilt, dev, gaze:[pc[0] + 1.4, 0], gazeK:.5,
    legs, arms:{mode:'custom', curl:'loose', L:arm('L'), R:arm('R')},
    focus:['hams','glutes'],
    phase: s < .42 ? 2 : s < .95 ? 0 : 3
  };
}

/* ================================================================ fente à genou (genou droit au sol, pied gauche devant) */
const KY = .05;
/** e = inclinaison de la cuisse arrière (° ; + = bassin devant le genou) ; kx = abscisse du genou arrière */
function halfKneel(e, kx, fx){
  const kR = [kx, KY, -.11];
  const hipR = [kx + TH*Math.sin(e*D2R), KY + TH*Math.cos(e*D2R), -HIPZ];
  const pc = [hipR[0], hipR[1], 0];
  const aR = [kx - SHK, KY - .008, -.11];
  const aL = [fx, .075, .13];
  return {pc, legs:{
    L:lg(aL, [1, 0, .05], [1, .15, .12], [0, 1, 0]),
    R:lg(aR, [-.97, -.24, 0], poleOf(hipR, kR, aR), [0, -1, 0], 0)}};
}
/* ================================================================ 2. étirement dynamique du psoas : rotations du buste en fente à genou */
function vm_psoasrot(s, o, t){
  const r = sm(osc(s));                          // 0 = face, 1 = buste tourné vers la jambe avant (gauche)
  const K = halfKneel(lerp(9, 13, r), -.30, .40);
  const tw = -48*r;
  const side = sz => { const p = rotY([.05, .35, sz], tw); return {t:[.16, -.07, .075*sz], pole:p, rel:'torso', curl:'loose'}; };
  return {
    pc:K.pc, tilt:-2, dev:{pel:-5, twist:tw, pelTwist:-4*r}, headTurn:-12*r, gaze:[3, 1.1], gazeK:.4,
    legs:K.legs,
    arms:{mode:'custom', curl:'loose', L:side(1), R:side(-1)},
    world:{mat:{x:-.1}},
    focus:['hipflex','obliques','quads'],
    phase: s < .5 ? 2 : s < .95 ? 0 : 3
  };
}


/* ================================================================ planche mains : base des pas « spiderman » */
const PL = {pc:[-.30, .49], tilt:71, ax:-1.10};
const PL_S = shoulder(PL.pc, PL.tilt, {}, 'L');
const PL_H = [PL_S[0] + .02, .03, .17];
const plankFoot = z => ({ankle:[PL.ax, .16, z], toe:[PL.ax + .05, .02, z], pole:[0, -1, 0], toeFlex:70});
/** pied gauche amené à côté de la main gauche (k = 0 planche → 1 pied posé), sink = hanches qui descendent */
function stepIn(k, sink, footX, footZ){
  const w = sm(k);
  const A1 = [footX, .075, footZ], P0 = [PL.ax, .16, .09];
  const arc = Math.sin(Math.PI*w);
  const ankle = add(mix(P0, A1, w), [0, .16*arc, .07*arc]);
  const fd = nrm(mix([.25, -.97, 0], [1, 0, .12], sm(clamp(w*1.3, 0, 1))));
  const pc = [lerp(PL.pc[0], -.29, w), lerp(PL.pc[1], .44, w) - sink, 0];
  const S = [PL_S[0] - .01*w, PL_S[1] - .02*w - sink*.4];
  const tilt = tiltTo(S[0] - pc[0], S[1] - pc[1], {});
  const L = {ankle, toe:add(ankle, scl(fd, .2)), pole:nrm(mix([0, -1, 0], [.35, .25, 1], sm(clamp(w*2, 0, 1)))), toeFlex:70*(1 - sm(clamp(w*1.5, 0, 1)))};
  if(w > .98) L.toe[1] = ankle[1];
  return {pc, tilt, legs:{L, R:plankFoot(-.09)}};
}
const plankHands = (curlL) => ({mode:'custom', curl:'flat',
  L:{hand:PL_H, pole:[-1, .3, .4], rel:'world', curl:curlL || 'flat'},
  R:{hand:MZ(PL_H), pole:[-1, .3, -.4], rel:'world'}});

/* ================================================================ 6. mountain climber « spiderman » : le pied se pose à l'extérieur de la main */
const SPI_F = [{u:0, k:0, d:0}, {u:.36, k:1, d:0, hold:true}, {u:.5, k:1, d:1}, {u:.64, k:1, d:0, hold:true}, {u:1, k:0, d:0}];
function spiderSide(v){
  const f = kf(SPI_F, v);
  const P = stepIn(f.k, .04*f.d, PL_H[0] - .17, .33);
  if(f.k > .98) P.legs.L.ankle[1] = P.legs.L.toe[1] = .085;
  return {pc:P.pc, tilt:P.tilt, dev:{}, gaze:'floorAhead', gazeK:.7, legs:P.legs, arms:plankHands(),
    world:{mat:{x:-.3}}, focus:['hipflex','adductors','abs','glutes'], phase: v < .36 ? 0 : v < .9 ? 2 : 3};
}
function vm_spiderman(s){ const u = ((s % 1) + 1) % 1; return u < .5 ? spiderSide(u*2) : mirror(spiderSide(u*2 - 1)); }

/* ================================================================ 4. fente basse + rotation du buste (world's greatest stretch) */
const WGS_F = [
  {u:0,   k:0, r:0},
  {u:.2,  k:1, r:0, hold:true},
  {u:.44, k:1, r:1},
  {u:.58, k:1, r:1, hold:true},
  {u:.78, k:1, r:0, hold:true},
  {u:1,   k:0, r:0}
];
function wgsSide(v){
  const f = kf(WGS_F, v), r = sm(f.r);
  const P = stepIn(f.k, .07*sm(f.k), PL_H[0] - .15, .34);
  if(f.k > .98) P.legs.L.ankle[1] = P.legs.L.toe[1] = .085;
  const tw = -78*r;
  const arms = plankHands();
  if(f.r > 0){
    // le bras gauche décrit un arc du sol vers le ciel en passant par le côté
    const sh0 = shoulder(P.pc, P.tilt, {}, 'L');
    const F = sub([PL_H[0], .03, PL_H[2]], sh0), L0 = len(F);
    const th = r*Math.PI, L = lerp(L0, .59, sm(clamp(r*2, 0, 1)));
    const d0 = nrm(F), side = [0, 0, 1];
    const dir = nrm(add(scl(d0, Math.cos(th)), add(scl(side, Math.sin(th)*.9), [0, r > .5 ? 0 : 0, 0])));
    const dUp = nrm([-.05, 1, .06]);
    const dd = r < .5 ? dir : nrm(mix(dir, dUp, sm((r - .5)/.5)));
    arms.L = {hand:scl(dd, L), pole:nrm(mix([-1, .3, .4], [-.3, .1, 1], sm(clamp(r*3, 0, 1)))), rel:'sh', curl: r > .08 ? 'loose' : 'flat'};
  }
  return {pc:P.pc, tilt:P.tilt + 4*r, dev:{twist:tw, pelTwist:-8*r}, headTurn:-25*r, gaze:'floorAhead', gazeK:lerp(.7, .2, r), legs:P.legs, arms,
    world:{mat:{x:-.3}}, focus:['hipflex','obliques','upperback','hams'], phase: v < .44 ? 0 : v < .9 ? 2 : 3};
}
function vm_wgs(s){ const u = ((s % 1) + 1) % 1; return u < .5 ? wgsSide(u*2) : mirror(wgsSide(u*2 - 1)); }

/* ================================================================ 5. squat sumo profond : coude qui pousse le genou, bras opposé au-dessus de la tête */
const SU_W = .36, SU_OUT = 35;
function sumoSide(w){          // w = 0 centre, 1 = coude droit sur genou droit, bras gauche au-dessus
  const pc = [-.09, .50 - .02*w, 0], tilt = 22 + 6*w;
  const dev = {pel:4, lum:2, bend:-30*w, twist:8*w};
  const fo = side => { const sz = side === 'L' ? 1 : -1, a = SU_OUT*D2R;
    return lg([0, .075, SU_W*sz], [Math.cos(a), 0, Math.sin(a)*sz], [Math.cos(a), 0, Math.sin(a)*sz*1.7], [0, 1, 0]); };
  const lerp3 = (a, b) => mix(a, b, w);
  return {
    pc, tilt, dev, headTilt:-6*w, gaze:[2.6, lerp(.9, 1.6, w)], gazeK:.5,
    legs:{L:fo('L'), R:fo('R')},
    arms:{mode:'custom', curl:'loose',
      L:{hand:lerp3([.30, -.24, -.18], [-.02, .56, -.12]), pole:nrm(lerp3([-.2, -1, .8], [-.3, .4, 1])), rel:'sh', curl:'loose'},
      R:{hand:lerp3([.30, -.24, .18], [.07, -.52, -.07]), pole:nrm(lerp3([-.2, -1, -.8], [-.4, .2, -1])), rel:'sh', curl:'loose'}},
    focus:['adductors','obliques','glutes','lowback']
  };
}
const SUMO_F = [{u:0, w:0}, {u:.12, w:0}, {u:.3, w:1}, {u:.38, w:1}, {u:.5, w:0}];
function vm_sumoreach(s){
  const u = ((s % 1) + 1) % 1, v = u < .5 ? u : u - .5, w = kf(SUMO_F, v).w;
  const p = sumoSide(w);
  p.phase = v < .3 ? 2 : v < .45 ? 0 : 3;
  return u < .5 ? p : mirror(p);
}


/* ================================================================ assis au sol : essuie-glace et 90/90
   Pieds posés larges devant soi ; phi = -1 genoux couchés à droite … 0 genoux levés … +1 genoux couchés à gauche.
   Genoux couchés à gauche : jambe gauche en rotation externe (jambe « avant » du 90/90), jambe droite en rotation interne. */
const SIT_Y = .10, KNEE_Y = .075;
function seatLegs(phi, fx, fz, o = {}){
  const a = (o.amp || 86)*phi;
  const out = o.out != null ? o.out : 18;
  const foot = side => {
    const sz = side === 'L' ? 1 : -1;
    const roll = 62*phi*Math.min(1, Math.abs(phi)*1.2)/Math.max(.001, Math.abs(phi))*Math.abs(phi);
    const dir = [Math.cos(out*D2R), 0, Math.sin(out*D2R)*sz];
    const up = rotAx([0, 1, 0], dir, roll);
    const ank = [fx, lerp(.075, .085, Math.abs(phi)), fz*sz];
    if(o.feet && o.feet[side]) { ank[0] = o.feet[side][0]; ank[2] = o.feet[side][1]; }
    const pole = [0, Math.cos(a*D2R), Math.sin(a*D2R)];
    const lift = o.lift && o.lift[side] || 0;       // pied qui décolle (0…1)
    ank[1] += lift*.06;
    const l = lg(ank, [dir[0], 0, dir[2]], pole, up, 0);
    if(o.pc){ const hip = hipPos(o.pc, side, o.yaw || 0), kn = kneeIK(hip, ank, pole);
      l.knee = kn;
      if(kn[1] < KNEE_Y){ l.knee = [kn[0], KNEE_Y, kn[2]]; l.pole = poleOf(hip, l.knee, ank); } }
    return l;
  };
  return {L:foot('L'), R:foot('R')};
}
/** assis : bras (clasp = mains jointes devant la poitrine, back = mains au sol derrière, floor = mains au sol à côté) */
function seatArms(mode, pc, yaw){
  if(mode === 'back') return {mode:'custom', curl:'flat',
    L:{hand:add(pc, rotY([-.30, -.07, .24], yaw)), pole:[-1, 0, .3], rel:'world'},
    R:{hand:add(pc, rotY([-.30, -.07, -.24], yaw)), pole:[-1, 0, -.3], rel:'world'}};
  return {mode:'custom', curl:'loose',
    L:{t:[-.10, .30, .03], pole:rotY([-.3, -1, .7], yaw), rel:'torso'},
    R:{t:[-.10, .30, -.03], pole:rotY([-.3, -1, -.7], yaw), rel:'torso'}};
}

/* ================================================================ 9. essuie-glace des hanches (assis) */
const WIP_F = [{u:0, p:0}, {u:.2, p:-1, hold:true}, {u:.3, p:-1}, {u:.5, p:0}, {u:.7, p:1, hold:true}, {u:.8, p:1}, {u:1, p:0}];
function vm_wiper(s, o, t){
  const phi = kf(WIP_F, s).p, back = o.hands === 'back';
  const pc = [0, SIT_Y, 0], yaw = -12*phi;
  const legs = seatLegs(phi, .40, .33, {amp:phi > 0 ? 80 : 80});
  // la jambe en rotation interne descend moins
  const ir = phi > 0 ? 'R' : 'L', k = Math.abs(phi);
  const aIR = (phi > 0 ? 1 : -1)*52*k;
  legs[ir].pole = [0, Math.cos(aIR*D2R), Math.sin(aIR*D2R)];
  return {
    pc, tilt: back ? -24 : 2, yaw, dev:{twist:4*phi, pel: back ? -4 : 2}, gaze:[3, back ? .8 : .9], gazeK:.4,
    legs, arms:seatArms(back ? 'back' : 'clasp', pc, yaw),
    world:{mat:{x:.1}},
    focus:['glutes','adductors','hipflex'],
    phase: (s > .2 && s < .5) || s > .7 ? 3 : 0
  };
}

/* ================================================================ 8. 90/90 tenu (jambe gauche devant) */
const NN = {fx:.36, fz:.34, yaw:-40};
function vm_9090(s, o, t){
  const br = osc(s);
  const pc = [0, SIT_Y + .018, 0], yaw = NN.yaw;
  const legs = seatLegs(1, NN.fx, NN.fz, {amp:88, feet:{L:[.40, .26], R:[.02, -.50]}, pc, yaw});
  const tilt = 16 + 6*br;
  const hL = kneeIK(hipPos(pc, 'L', yaw), legs.L.ankle, legs.L.pole);
  return {
    pc, tilt, yaw, dev:{pel:2, lum:-2, thup:-2}, gaze:[3, .7], gazeK:.3,
    legs,
    arms:{mode:'custom', curl:'flat',
      L:{hand:add(hL, [.10, -.02, -.06]), pole:[-.6, 0, 1], rel:'world', curl:'loose'},
      R:{hand:add(pc, rotY([.05, -.07, -.30], yaw)), pole:[-1, 0, -.3], rel:'world'}},
    world:{mat:{x:.1}},
    focus:['glutes','adductors']
  };
}

/* ================================================================ 10. transition 90/90 avec montée de hanche */
function nnLift(k, pc0, yaw){
  const legs = seatLegs(1, NN.fx, NN.fz, {amp:88, pc:pc0, yaw});
  const kL = legs.L.knee, kR = legs.R.knee;
  const mid = mix(kL, kR, .5), fwd = rotY([1, 0, 0], yaw);
  const top = [mid[0] + .10*fwd[0], .44, mid[2] + .10*fwd[2]];
  const e = sm(k);
  const pc = [lerp(pc0[0], top[0], e), pc0[1] + (top[1] - pc0[1])*Math.sin(e*Math.PI/2), lerp(pc0[2], top[2], e)];
  for(const sd of ['L','R']){ const hip = hipPos(pc, sd, yaw), kn = legs[sd].knee, an = legs[sd].ankle;
    const d = len(sub(kn, hip)), q = d > TH ? kn : add(hip, scl(nrm(sub(kn, hip)), TH));
    legs[sd].pole = poleOf(hip, q, an); }
  return {pc, legs, kL, kR, e};
}
const NNL_F = [{u:0, k:0}, {u:.35, k:1, hold:true}, {u:.55, k:1}, {u:.9, k:0}, {u:1, k:0}];
function nnHalf(v){
  let pc, legs, yaw, tilt, e = 0;
  if(v < .5){
    const k = kf(NNL_F, v/.5).k;
    yaw = NN.yaw;
    const L = nnLift(k, [0, SIT_Y + .015, 0], yaw);
    pc = L.pc; legs = L.legs; e = L.e;
    tilt = lerp(12, -4, e);
  } else {
    const w = (v - .5)/.5, phi = 1 - 2*sm(w);
    yaw = NN.yaw*phi;
    pc = [0, SIT_Y + .015*Math.abs(phi), 0];
    legs = seatLegs(phi, NN.fx, NN.fz, {amp:88, pc, yaw});
    tilt = 12 - 6*Math.sin(Math.PI*w);
  }
  return {
    pc, tilt, yaw, dev:{pel:lerp(2, -8, e), lum:lerp(0, -3, e)}, gaze:[3, lerp(.8, 1.3, e)], gazeK:.4,
    legs, arms:{mode:'hips'},
    world:{mat:{x:.1}},
    focus:['hipflex','glutes','adductors'],
    phase: v < .18 ? 2 : v < .5 ? 0 : 3
  };
}
function vm_9090lift(s){ const u = ((s % 1) + 1) % 1; return u < .5 ? nnHalf(u*2) : mirror(nnHalf(u*2 - 1)); }


/* ================================================================ 7. papillon (adducteurs) */
function vm_butterfly(s, o, t){
  const pr = kf([{u:0, k:0}, {u:.3, k:1}, {u:.62, k:1}, {u:.9, k:0}, {u:1, k:0}], s).k;   // poussée légère des coudes
  const pc = [0, SIT_Y - .035, 0], tilt = 14 + 4*pr;
  const leg = sz => {
    const ank = [.36, .09, .065*sz];
    const a = (58 + 9*pr)*sz;
    return lg(ank, [1, -.05, .12*sz], [.15, Math.cos(a*D2R), Math.sin(a*D2R)], rotAx([0, 1, 0], [1, 0, 0], 72*sz), 0);
  };
  const legs = {L:leg(1), R:leg(-1)};
  const arm = sz => ({hand:[.43, .12, .045*sz], pole:[-.1, .15, sz], rel:'world', curl:'grip'});
  return {
    pc, tilt, dev:{pel:2, lum:2, thlow:2, thup:2}, gaze:[1.6, 0], gazeK:.3,
    legs, arms:{mode:'custom', curl:'grip', L:arm(1), R:arm(-1)},
    world:{mat:{x:.15}},
    focus:['adductors']
  };
}

/* ================================================================ 11. activation lombaires sur le ventre (genou droit sur le côté, bras gauche devant) */
const PR_Y = .145;
function vm_pronefrog(s, o, t){
  const br = osc(s);
  const pc = [0, PR_Y + .01, 0];
  const dev = {pel:2, lum:-6 - br, thlow:-11 - 2*br, thup:-17 - 3*br, bend:-3};
  // jambe gauche tendue derrière
  const b = 2*D2R, hl = hipPos(pc, 'L');
  const aL = [hl[0] - .895*Math.cos(b), .09, .10];
  const legL = lg(aL, [-.97, -.26, .02], [0, -1, .2], [0, -1, 0], 0);
  // jambe droite en grenouille : cuisse sur le côté, genou au sol, tibia vers les pieds
  const hr = hipPos(pc, 'R');
  const R = legFrom(hr, [-.30, -.20, -.93], [-.87, 0, .49]);
  const aR = [R.ankle[0], .075, R.ankle[2]];
  const legR = lg(aR, [-.86, -.1, .49], poleOf(hr, [R.knee[0], .08, R.knee[2]], aR), nrm([-.45, -.25, -.8]), 0);
  const reachF = .02*br;
  return {
    pc, tilt:90, dev, gaze:[1.5, .3], gazeK:.4, headTurn:0,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'fist',
      L:{hand:[.60 + reachF, .10, .03], pole:[0, 1, .6], rel:'sh', curl:'fist'},
      R:{hand:[.20, -.14, .02], pole:[-.3, .2, -1], rel:'sh', curl:'fist'}},
    world:{mat:{x:-.05}},
    focus:['lowback','glutes','upperback']
  };
}



/* ================================================================ nolio : cercles de genou à quatre pattes (jambe gauche) */
const QD = {py:.525, tilt:80};
const QD_S = shoulder([0, QD.py], QD.tilt, {}, 'L');
const quadKnee = z => ({ankle:[-.40, .15, z], toe:[-.36, .02, z], pole:[1, -.2, 0], toeFlex:65});
const HYD_F = [
  {u:0,   th:[-.02,-1,.02], w:0},
  {u:.12, th:[.2,-.9,.3],   w:1},
  {u:.3,  th:[.55,-.72,.42], w:1},
  {u:.5,  th:[.05,-.2,1],   w:1},
  {u:.7,  th:[-.72,-.12,.68], w:1},
  {u:.86, th:[-.35,-.9,.25], w:1},
  {u:1,   th:[-.02,-1,.02], w:0}
];
function vm_hydrant(s, o, t){
  const k = kf(HYD_F, s), pc = [0, QD.py + .01*k.w, -.02*k.w];
  const hip = hipPos(pc, 'L'), th = nrm(k.th);
  let sh = sub([-1, .35, 0], scl(th, dot([-1, .35, 0], th)));
  const L = legFrom(hip, th, sh);
  const rest = quadKnee(.10), w = sm(clamp(k.w, 0, 1));
  let an = mix(rest.ankle, L.ankle, w); an[1] = Math.max(an[1], .14);
  const toe = add(an, scl(nrm(mix(sub(rest.toe, rest.ankle), [-.05, -1, .1], w)), .2));
  return {
    pc, tilt:QD.tilt, dev:{bend:-2*k.w}, gaze:[pc[0] + 1.5, 0], gazeK:.45,
    legs:{L:{ankle:an, toe, pole:nrm(mix(rest.pole, L.pole, w)), toeFlex:65*(1 - w)}, R:quadKnee(-.10)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[QD_S[0] + .03, .03, SHZ - .02], pole:[-1, .2, .3], rel:'world'},
      R:{hand:[QD_S[0] + .03, .03, -SHZ + .02], pole:[-1, .2, -.3], rel:'world'}},
    world:{mat:{x:-.1}},
    focus:['glutes','hipflex','abs'],
    phase: s < .5 ? 0 : s < .9 ? 2 : 3
  };
}

/* ================================================================ couché sur le dos */
const SUP_Y = .09;
/** jambe dans le plan sagittal : cuisse à l'angle a (° depuis +X), genou fléchi de f */
function legAt(hip, a, f){
  const k = [hip[0] + TH*Math.cos(a*D2R), hip[1] + TH*Math.sin(a*D2R)];
  const b = (a - f)*D2R;
  return {knee:k, ankle:[k[0] + SHK*Math.cos(b), k[1] + SHK*Math.sin(b)], shin:a - f};
}
const behindHead = (yl) => ({mode:'custom', curl:'loose',
  L:{t:[.16, -.07, .075], pole:[0, .25, 1], rel:'torso'},
  R:{t:[.16, -.07, -.075], pole:[0, .25, -1], rel:'torso'}});

/* ================================================================ nolio : étirement du fessier sur le dos (figure 4, cheville gauche sur le genou droit) */
function vm_fig4(s, o, t){
  const br = osc(s);
  const pc = [0, SUP_Y, 0];
  const a = 104 + 7*br;
  const R = legAt(pc, a, 92);
  const kR = [R.knee[0], R.knee[1], -.08];
  const aRr = [R.ankle[0], R.ankle[1], -.09];
  const fa = (R.shin + 70)*D2R;
  const legR = {ankle:aRr, toe:[aRr[0] + .2*Math.cos(fa), aRr[1] + .2*Math.sin(fa), -.10], pole:[0, 1, -.1], toeFlex:0};
  // cheville gauche posée sur la cuisse droite, juste au-dessus du genou
  const d = nrm([Math.cos(a*D2R), Math.sin(a*D2R), 0]);
  const aL = add(add(kR, scl(d, -.07)), [.07, .05, .015]);
  const legL = lg(aL, [.35, .35, -.87], nrm([.35, .5, 1]), null, 0);
  const n = [d[1], -d[0], 0];                       // arrière de la cuisse (côté pieds)
  const grip = sz => add(add([pc[0], pc[1], -.10], scl(d, .30)), add(scl(n, .075), [0, 0, .06*sz]));
  return {
    pc, tilt:-90, dev:{pel:-3, thlow:3, thup:6}, gaze:'ceiling', gazeK:.4,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'grip',
      L:{hand:grip(1), pole:[-.2, .4, 1], rel:'world'},
      R:{hand:grip(-1), pole:[-.2, .4, -1], rel:'world'}},
    world:{mat:{x:-.3}},
    focus:['glutes']
  };
}

/* ================================================================ gainage : ciseaux jambes (dos au sol, bras vers le ciel) */
function vm_flutterkick(s, o, t){
  const pc = [0, SUP_Y, 0];
  const c = Math.sin(s*Math.PI*2);
  const leg = (a, z) => { const L = legAt(pc, a, 3), fa = (L.shin - 18)*D2R;
    return {ankle:[L.ankle[0], L.ankle[1], z], toe:[L.ankle[0] + .2*Math.cos(fa), L.ankle[1] + .2*Math.sin(fa), z], pole:[0, 1, z*.2], toeFlex:0}; };
  return {
    pc, tilt:-90, dev:{pel:-5, lum:2, thlow:4, thup:6}, gaze:'ceiling', gazeK:.4,
    legs:{L:leg(24 + 11*c, .08), R:leg(24 - 11*c, -.08)},
    arms:{mode:'custom', curl:'loose',
      L:{hand:[.01, .59, -.04], pole:[0, 0, 1], rel:'sh'},
      R:{hand:[.01, .59, .04], pole:[0, 0, -1], rel:'sh'}},
    world:{mat:{x:-.1}},
    focus:['abs','hipflex'],
    phase: (s > .25 && s < .5) || s > .75 ? 3 : 0
  };
}

/* ================================================================ gainage : crunch */
const CR_F = [{u:0, k:0}, {u:.35, k:1}, {u:.5, k:1, hold:true}, {u:.9, k:0}, {u:1, k:0}];
const crunchLeg = (pc, z, up = 0) => {
  const L = legAt(pc, lerp(60, 98, up), lerp(118, 104, up));
  const an = [L.ankle[0], lerp(.075, L.ankle[1], up), z];
  const fa = up > 0 ? lerp(0, (L.shin + 90)*D2R, up) : 0;
  return {ankle:an, toe:[an[0] + .2*Math.cos(fa), an[1] + .2*Math.sin(fa), z], pole:[0, 1, z*.3], toeFlex:0};
};
function vm_crunch(s, o, t){
  const k = kf(CR_F, s).k, pc = [0, SUP_Y, 0];
  return {
    pc, tilt:-90, dev:{pel:-3, lum:6*k, thlow:18*k, thup:34*k}, gaze:'ceiling', gazeK:lerp(.4, .15, k),
    legs:{L:crunchLeg(pc, .12), R:crunchLeg(pc, -.12)},
    arms:behindHead(),
    world:{mat:{x:-.2}},
    focus:['abs'],
    phase: s < .35 ? 2 : s < .9 ? 0 : 3
  };
}

/* ================================================================ gainage : crunch croisé (coude vers l'extérieur du genou opposé) */
function crossHalf(v){           // coude gauche vers l'extérieur du genou droit
  const k = kf(CR_F, v).k, pc = [0, SUP_Y, 0];
  return {
    pc, tilt:-90, dev:{pel:-3, lum:8*k, thlow:26*k, thup:44*k, twist:42*k}, gaze:'ceiling', gazeK:lerp(.4, .15, k),
    legs:{L:crunchLeg(pc, .12), R:crunchLeg(pc, lerp(-.12, -.02, k), k)},
    arms:{mode:'custom', curl:'loose',
      L:{t:[.16, -.07, .075], pole:nrm(mix([0, .25, 1], [1, .25, -.35], k)), rel:'torso'},
      R:{t:[.16, -.07, -.075], pole:[0, .25, -1], rel:'torso'}},
    world:{mat:{x:-.2}},
    focus:['obliques','abs','hipflex'],
    phase: v < .35 ? 2 : v < .9 ? 0 : 3
  };
}
function vm_crosscrunch(s){ const u = ((s % 1) + 1) % 1; return u < .5 ? crossHalf(u*2) : mirror(crossHalf(u*2 - 1)); }

/* ================================================================ gainage latéral, jambe du dessus levée (couché sur le côté droit) */
const PC_B = [0, .955, 0];
const SHR_B = [.018, .955 + .473, -SHZ];
function sideFrame(P, yP, ySh){
  const f = b => { const th = (-90 + b)*D2R, c = Math.cos(th), s = Math.sin(th);
    return (SHR_B[1]-P[1])*c - (SHR_B[2]-P[2])*s - (ySh - yP); };
  let lo = -40, hi = 40, flo = f(lo);
  for(let i=0; i<40; i++){ const m = (lo+hi)/2, fm = f(m); if((fm > 0) === (flo > 0)){ lo = m; flo = fm; } else hi = m; }
  const beta = (lo+hi)/2, th = (-90 + beta)*D2R, c = Math.cos(th), s = Math.sin(th);
  const rot = p => [p[0], p[1]*c - p[2]*s, p[1]*s + p[2]*c];
  const shW = rot(SHR_B);
  const T = [-shW[0], ySh - shW[1], -shW[2]];
  return {toB: w => { const x = w[0]-T[0], y = w[1]-T[1], z = w[2]-T[2]; return [x, y*c + z*s, -y*s + z*c]; },
    dirB: d => [d[0], d[1]*c + d[2]*s, -d[1]*s + d[2]*c],
    m: new THREE.Matrix4().makeRotationX(th).premultiply(new THREE.Matrix4().makeTranslation(T[0], T[1], T[2]))};
}
const EL_Y = .055, SH_Y = EL_Y + .262;
function vm_sideplanklift(s, o, t){
  const br = osc(s);
  const aR = [0, .075, -.06];
  const F = sideFrame(aR, .072, SH_Y);
  const ab = (30 + 4*br)*D2R, hl = [0, PC_B[1], HIPZ];
  const aL = [.02, hl[1] - .885*Math.cos(ab), hl[2] + .885*Math.sin(ab) - .05];
  return {
    pc:PC_B.slice(), tilt:0, dev:{thup:.5*br}, gaze:[3, 1.55], gazeK:.5,
    legs:{L:{ankle:aL, toe:[aL[0] + .2, aL[1] + .01, aL[2] + .03], pole:[1, 0, .15], toeFlex:0},
          R:{ankle:aR, toe:[aR[0] + .2, aR[1], aR[2] - .01], pole:[1, 0, -.1], toeFlex:0}},
    arms:{mode:'custom', curl:'loose',
      L:{hand:[.05, PC_B[1] + .11, HIPZ + .085], pole:[-.6, 0, 1], rel:'world', curl:'loose'},
      R:{hand:F.toB([.34, .045, -.01]), pole:F.dirB([-1, -1.2, 0]), rel:'world', curl:'fist'}},
    root:{m:F.m},
    world:{mat:{x:.05, z:.75, rot:90}},
    focus:['obliques','glutes','abs']
  };
}

/* ================================================================ 3. étirement dynamique du grand fessier (pigeon en appui sur les mains)
   Quadrupédie → genou gauche avancé, tibia en travers, jambe droite glissée derrière → le bassin descend → retour. */
const PG_H = [.30, .03, .19];
const PG_K = [.07, .075, .21];                         // genou avant (gauche) posé
const PG_T = {pc:[-.14, .52, 0], kL:[-.14, .075, .10], aL:[-.59, .08, .10], kR:[-.14, .075, -.10], aR:[-.59, .08, -.10]};
const PG_M = {pc:[-.12, .50, -.01], kL:[.02, .22, .16], aL:[-.26, .24, .02], kR:[-.24, .075, -.10], aR:[-.69, .08, -.10]};
/** pigeon : el = élévation de la hanche gauche vue du genou avant (° ; plus bas = fessier plus étiré) */
function pigeonAt(el){
  const az = 16*D2R, e = el*D2R;
  const hipL = add(PG_K, scl([-Math.cos(e)*Math.cos(az), Math.sin(e), -Math.cos(e)*Math.sin(az)], TH));
  const pc = [hipL[0], hipL[1], hipL[2] - HIPZ];
  const hipR = hipPos(pc, 'R');
  const dy = hipR[1] - .075, kx = hipR[0] - Math.sqrt(Math.max(0, TH*TH - dy*dy));
  const kR = [kx, .075, -.10];
  const shin = nrm([-.24, 0, -.97]);
  return {pc, kL:PG_K, aL:add(PG_K, add(scl(shin, SHK*.97), [0, .005, 0])), kR, aR:[kx - SHK*.99, .08, -.10]};
}
const PG_F = [{u:0, w:0, el:48}, {u:.3, w:1, el:48, hold:true}, {u:.5, w:1, el:22}, {u:.7, w:1, el:48, hold:true}, {u:1, w:0, el:48}];
const blendPose = (A, B, t) => { const o = {}; for(const k in A) o[k] = mix(A[k], B[k], t); return o; };
function pigeonHalf(v){
  const f = kf(PG_F, v), P = pigeonAt(f.el);
  const q = f.w < .5 ? blendPose(PG_T, PG_M, sm(f.w*2)) : blendPose(PG_M, P, sm(f.w*2 - 1));
  const dip = clamp((48 - f.el)/26, 0, 1);
  const pc = q.pc;
  const dev = {pel:0, lum:3*dip, thlow:5*dip, thup:5*dip};
  const S = [PG_H[0] - .04 - .06*dip, lerp(.60, .44, dip)];
  const tilt = tiltTo(S[0] - pc[0], S[1] - pc[1], dev);
  const w = sm(f.w);
  const hl = hipPos(pc, 'L'), hr = hipPos(pc, 'R');
  const toeL = nrm(mix([-1, -.12, 0], [-.25, -.1, -.96], w));
  const legL = lg(q.aL, toeL, poleOf(hl, q.kL, q.aL), nrm(mix([0, -1, 0], [.95, -.2, .25], w)), 0);
  const legR = lg(q.aR, [-1, -.12, 0], poleOf(hr, q.kR, q.aR), [0, -1, 0], 0);
  return {
    pc, tilt, dev, gaze:[pc[0] + 1.2, 0], gazeK:.4,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'flat',
      L:{hand:PG_H, pole:[-1, .1*dip, .6], rel:'world'},
      R:{hand:MZ(PG_H), pole:[-1, .1*dip, -.6], rel:'world'}},
    world:{mat:{x:-.3}},
    focus:['glutes','hipflex'],
    phase: v < .5 ? 0 : v < .8 ? 2 : 3
  };
}
function vm_glutedyn(s){ const u = ((s % 1) + 1) % 1; return u < .5 ? pigeonHalf(u*2) : mirror(pigeonHalf(u*2 - 1)); }

/* ================================================================ nolio : étirement du fléchisseur de hanche à genou */
function vm_hipflexor(s, o, t){
  const br = osc(s);                              // bascule douce du bassin vers l'avant
  const K = halfKneel(lerp(10, 18, br), -.32, .40);
  const hipL = hipPos(K.pc, 'L'), kneeL = kneeIK(hipL, K.legs.L.ankle, K.legs.L.pole);
  const top = add(kneeL, [-.01, .07, 0]);
  const dev = {pel:-6, lum:-2, thup:1};
  return {
    pc:K.pc, tilt:lerp(1, -1, br), dev, gaze:[3, 1.2], gazeK:.4,
    legs:K.legs,
    arms:{mode:'custom', curl:'loose',
      L:{hand:add(top, [.0, .03, .03]), pole:[-.3, -.2, 1], rel:'world'},
      R:{hand:add(top, [-.03, .0, -.02]), pole:[-.3, -.4, -1], rel:'world'}},
    world:{mat:{x:-.1}},
    focus:['hipflex','quads']
  };
}

/* ================================================================ nolio : flexion avant debout, genoux souples */
function vm_fold(s, o, t){
  const br = osc(s);
  const flex = 22, d = Math.sqrt(TH*TH + SHK*SHK + 2*TH*SHK*Math.cos(flex*D2R));
  const px = -.17;
  const pc = [px, .075 + Math.sqrt(d*d - px*px - (FZ - HIPZ)**2)];
  const tilt = 112 + 4*br;
  const dev = {pel:0, lum:10 + 2*br, thlow:14 + 2*br, thup:14};
  const arm = side => { const sz = side === 'L' ? 1 : -1, sh = shoulder(pc, tilt, dev, side);
    return {hand:reach(sh, [.10, .05, .10*sz], .60), pole:[-.3, 0, .6*sz], rel:'world', curl:'loose'}; };
  return {
    pc, tilt, dev, gaze:[-.2, -.5], gazeK:.2,
    legs:{L:flatFoot(0, FZ, 4), R:flatFoot(0, -FZ, 4)},
    arms:{mode:'custom', curl:'loose', L:arm('L'), R:arm('R')},
    focus:['hams','lowback','calves']
  };
}

/* ================================================================ nolio : cercles de hanche debout (hip CARs), jambe gauche */
const CAR_F = [
  {u:0,   th:[.02,-1,.05],   sh:[.02,-1,.05],  ft:[1,0,.08],   sy:0},
  {u:.1,  th:[.45,-.9,.04],  sh:[-.1,-1,.03],  ft:[1,-.2,.05], sy:.3},
  {u:.26, th:[1,-.02,.05],   sh:[.02,-1,0],    ft:[1,-.35,.05], sy:1},
  {u:.46, th:[.35,-.05,1],   sh:[.05,-1,.05],  ft:[.8,-.35,.45], sy:1},
  {u:.62, th:[-.12,-.35,.93], sh:[-.9,.22,.25],  ft:[-.1,-1,.2],  sy:1},
  {u:.8,  th:[-.32,-.93,.18], sh:[-.8,-.35,.06], ft:[-.3,-.95,.0], sy:.6},
  {u:.92, th:[-.02,-1,.05],  sh:[-.2,-.98,.05], ft:[.95,-.3,.08], sy:.2},
  {u:1,   th:[.02,-1,.05],   sh:[.02,-1,.05],  ft:[1,0,.08],   sy:0}
];
function vm_hipcars(s, o, t){
  const k = kf(CAR_F, s);
  const pc = [-.01, STAND - .004*k.sy, -.035*k.sy - .012];
  const hipL = hipPos(pc, 'L');
  let L = legFrom(hipL, k.th, k.sh);
  // posé au sol au départ / à l'arrivée
  const ground = L.ankle[1] < .075;
  let ankle = ground ? [L.ankle[0], .075, L.ankle[2]] : L.ankle;
  const knee = ground ? kneeIK(hipL, ankle, L.pole) : L.knee;
  const legL = lg(ankle, k.ft, poleOf(hipL, knee, ankle), null, 0);
  return {
    pc, tilt:2 + 3*k.sy, dev:{pelBend:-2*k.sy}, gaze:[3, 1.4], gazeK:.4,
    legs:{L:legL, R:flatFoot(0, -.10, 5)},
    arms:{mode:'hips'},
    focus:['glutes','hipflex','adductors']
  };
}

const LIB = {vm_butterfly, vm_pronefrog:sided(vm_pronefrog), vm_hydrant:sided(vm_hydrant), vm_fig4:sided(vm_fig4), flutterkick:vm_flutterkick, crunch:vm_crunch, crosscrunch:vm_crosscrunch, sideplanklift:vm_sideplanklift, vm_glutedyn, vm_wiper, vm_9090:sided(vm_9090), vm_9090lift, vm_spiderman, vm_wgs, vm_sumoreach, vm_hamdyn, vm_psoasrot:sided(vm_psoasrot), vm_hipflexor:sided(vm_hipflexor), vm_fold, vm_hipcars:sided(vm_hipcars)};
/** cadrage d'un mouvement unilatéral : miroir de la caméra pour le côté droit */
const sf = fr => o => (o && o.side === 'R') ? Object.assign({}, fr, {az:180 - fr.az, tz:-(fr.tz||0)}) : fr;
const META = {
  vm_butterfly:{family:'stretch', cycle:4, frame:{tx:0.18, ty:0.36, tz:0.02, H:1.33, W:1, el:16, az:70}},
  vm_pronefrog:{family:'stretch', cycle:4, frame:sf({tx:0.05, ty:0.06, tz:0.13, H:2.09, W:1.57, el:30, az:115})},
  vm_hydrant:{family:'mobility', cycle:3.2, frame:sf({tx:-0.08, ty:0.29, tz:0.1, H:1.99, W:1.49, el:22, az:60})},
  vm_fig4:{family:'stretch', cycle:4, frame:sf({tx:-0.11, ty:0.39, tz:-0.08, H:1.47, W:1.1, el:18, az:40})},
  vm_glutedyn:{family:'mobility', cycle:6, frame:{tx:-0.15, ty:0.22, tz:0.02, H:1.61, W:1.21, el:16, az:60}},
  flutterkick:{family:'core', cycle:.9, frame:{tx:0.01, ty:0.34, tz:-0.17, H:1.8, W:1.35, el:18, az:60}},
  crunch:{family:'core', cycle:2.2, frame:{tx:-0.02, ty:0.16, tz:0.06, H:1.75, W:1.31, el:18, az:55}},
  crosscrunch:{family:'core', cycle:3.2, frame:{tx:-0.03, ty:0.2, tz:0.05, H:1.75, W:1.31, el:18, az:55}},
  sideplanklift:{family:'core', cycle:4, frame:{tx:-0.01, ty:0.36, tz:0.66, H:1.98, W:1.48, el:16, az:45}},
  vm_wiper:{family:'mobility', cycle:4.5, frame:{tx:0.2, ty:0.37, tz:0.02, H:1.69, W:1.27, el:14, az:60}},
  vm_9090:{family:'stretch', cycle:4.5, frame:sf({tx:0.14, ty:0.35, tz:0.03, H:1.52, W:1.14, el:16, az:60})},
  vm_9090lift:{family:'mobility', cycle:7, frame:{tx:0.12, ty:0.54, tz:0.08, H:1.92, W:1.44, el:12, az:60}},
  vm_spiderman:{family:'mobility', cycle:3.4, frame:{tx:-0.34, ty:0.23, tz:-0.04, H:1.67, W:1.25, el:14, az:55}},
  vm_wgs:{family:'mobility', cycle:8, frame:{tx:-0.28, ty:0.58, tz:-0.17, H:2.02, W:1.52, el:12, az:50}},
  vm_sumoreach:{family:'mobility', cycle:5, frame:{tx:0, ty:0.76, tz:-0.01, H:1.8, W:1.35, el:10, az:70}},
  vm_hamdyn:{family:'mobility', cycle:2.6, frame:{tx:0.13, ty:0.67, tz:-0.06, H:1.53, W:1.15, el:10, az:30}},
  vm_psoasrot:{family:'mobility', cycle:3.2, frame:sf({tx:-0.06, ty:0.58, tz:0.08, H:1.57, W:1.18, el:12, az:40})},
  vm_hipflexor:{family:'stretch', cycle:4, frame:sf({tx:-0.12, ty:0.6, tz:0.05, H:1.97, W:1.48, el:10, az:20})},
  vm_fold:{family:'stretch', cycle:4.5, frame:{tx:0.08, ty:0.52, tz:-0.04, H:1.36, W:1.02, el:10, az:30}},
  vm_hipcars:{family:'mobility', cycle:5, frame:sf({tx:-0.11, ty:0.85, tz:0.19, H:1.94, W:1.46, el:10, az:40})}
};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
