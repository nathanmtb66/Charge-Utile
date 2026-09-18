/* Charge Utile — famille « stretch » : étirements statiques de retour au calme (séance Nolio « cyclisme : exercices d'étirement »).
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z.
   Tenues : cycle ~5 s, une respiration discrète (l'étirement s'approfondit très légèrement à l'expiration).
   Les versions « chaque côté » montrent un côté ; opts.side = 'R' donne le miroir. */
(function(){
const {lerp, clamp, sm, osc, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ vecteurs */
const add = (a, b) => [a[0]+b[0], a[1]+b[1], (a[2]||0)+(b[2]||0)];
const sub = (a, b) => [a[0]-b[0], a[1]-b[1], (a[2]||0)-(b[2]||0)];
const scl = (a, k) => [a[0]*k, a[1]*k, (a[2]||0)*k];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + (a[2]||0)*(b[2]||0);
const len = a => Math.hypot(a[0], a[1], a[2]||0);
const nrm = a => { const l = len(a) || 1; return [a[0]/l, a[1]/l, (a[2]||0)/l]; };
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const mix = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
/* rotations (mêmes conventions que THREE.Matrix4.makeRotationX/Y/Z) */
const rX = (v, d) => { const c = Math.cos(d*D2R), s = Math.sin(d*D2R); return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c]; };
const rY = (v, d) => { const c = Math.cos(d*D2R), s = Math.sin(d*D2R); return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c]; };
const rZ = (v, d) => { const c = Math.cos(d*D2R), s = Math.sin(d*D2R); return [v[0]*c - v[1]*s, v[0]*s + v[1]*c, v[2]]; };
/** rotation d'un étage du moteur : cap · inclinaison avant · inclinaison latérale · rotation axiale */
const MRv = (v, yaw, Dd, b, t) => rY(rZ(rX(rY(v, t), b), -Dd), yaw);
/** rotation autour d'un axe quelconque (Rodrigues) */
const rotAx = (v, ax, deg) => { const k = nrm(ax), c = Math.cos(deg*D2R), s = Math.sin(deg*D2R), kv = cross(k, v), d = dot(k, v);
  return [0,1,2].map(i => v[i]*c + kv[i]*s + k[i]*d*(1-c)); };

/* ------------------------------------------------------------------ gabarit (repos du mannequin) */
const TH = .445, SHK = .456, HIPZ = .113, SHZ = .208;
const J = {hipC:[-.00342,.96954,0], S0:[-.02551,1.06384,0], S1:[-.02467,1.18947,0], S2:[-.04704,1.33171,0], S3:[.01548,1.54909,0],
           H0:[.04839,1.64837,0], HT:[.04787,1.8068,0], shL:[.0222,1.44206,.20835]};
const TLINE = Math.atan2(J.S3[0]-J.hipC[0], J.S3[1]-J.hipC[1])/D2R;       // 1,87°
const HEAD0 = Math.atan2(J.HT[0]-J.H0[0], J.HT[1]-J.H0[1])/D2R;           // -0,19°

/** squelette du haut du corps recalculé comme le moteur : épaules, tête, points du crâne */
function upper(P, diff = 0){
  const dv = P.dev || {}, yaw = P.yaw || 0, dT = P.tilt - TLINE;
  const D = k => dT + (dv[k]||0);
  const TW = dv.twist || 0, BD = dv.bend || 0;
  const pc = [P.pc[0], P.pc[1], P.pc[2]||0];
  let S = add(pc, MRv(sub(J.S0, J.hipC), yaw, D('pel'), dv.pelBend||0, dv.pelTwist||0));
  S = add(S, MRv(sub(J.S1, J.S0), yaw, D('lum'), BD*.35, TW*.3));
  const S2 = S = add(S, MRv(sub(J.S2, J.S1), yaw, D('thlow'), BD*.7, TW*.65));
  const S3 = add(S, MRv(sub(J.S3, J.S2), yaw, D('thup'), BD, TW));
  const hB = P.headTilt || 0, hT = P.headTurn || 0;
  const H0 = add(S3, MRv(sub(J.H0, J.S3), yaw, D('thup') + diff*.45, BD + hB*.4, TW + hT*.4));
  const eye = add(add(S3, MRv(sub(J.H0, J.S3), yaw, D('thup'), BD, TW)), MRv(scl(sub(J.HT, J.H0), .35), yaw, D('thup'), BD, TW));
  const want = D('thup') + HEAD0 + diff;
  return {
    S3, eye,
    sh: side => add(S2, MRv(sub(J.shL, J.S2).map((x, i) => i === 2 && side === 'R' ? -x : x), yaw, D('thup'), BD, TW)),
    head: p => add(H0, MRv(p, yaw, D('thup') + diff, BD + hB, TW + hT)),
    headDir: p => MRv(p, yaw, D('thup') + diff, BD + hB, TW + hT),
    /** point de regard qui donne exactement la flexion de tête « diff » (gazeK = 1) */
    gaze: [eye[0] + 20*Math.cos(want*D2R), eye[1] - 20*Math.sin(want*D2R)]
  };
}
/** point à la surface du crâne (repère tête au repos, origine H0) + décalage vers l'extérieur pour la paume */
const onHead = (U, p, n, off = .035) => add(U.head(p), scl(nrm(U.headDir(n)), off));

/** genou calculé comme le moteur (IK deux segments) */
function kneeIK(hip, ank, pole){
  const d0 = sub(ank, hip), dir = nrm(d0);
  const d = clamp(len(d0), Math.abs(TH-SHK)+1e-3, TH+SHK-1e-3);
  const ca = (TH*TH + d*d - SHK*SHK)/(2*TH*d), sa = Math.sqrt(Math.max(0, 1-ca*ca));
  let n = sub(pole, scl(dir, dot(pole, dir))); n = nrm(n);
  return add(add(hip, scl(dir, TH*ca)), scl(n, TH*sa));
}
const poleOf = (hip, knee, ank) => { const dir = nrm(sub(ank, hip)), k = sub(knee, hip); return nrm(sub(k, scl(dir, dot(k, dir)))); };
const lg = (ankle, dir, pole, up, flex) => { const o = {ankle, toe:add(ankle, scl(nrm(dir), .2)), pole, toeFlex:flex||0}; if(up) o.sole = up; return o; };
const hipPos = (pc, side, yaw = 0) => add([pc[0], pc[1], pc[2]||0], rY([0, 0, side === 'L' ? HIPZ : -HIPZ], yaw));
const flatFoot = (x, z, out = 0) => lg([x, .075, z], [Math.cos(out*D2R), 0, Math.sin(out*D2R)*(z > 0 ? 1 : -1)], [1, 0, z > 0 ? .25 : -.25], [0, 1, 0]);
/** main posée sur un point en restant à portée du bras */
const reach = (sh, target, max = .585) => { const d = sub(target, sh), l = len(d); return l <= max ? target : add(sh, scl(d, max/l)); };
const relaxed = side => { const sz = side === 'L' ? 1 : -1; return {hand:[.0, -.57, .075*sz], pole:[-1, 0, .3*sz], rel:'sh', curl:'loose'}; };

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
/** respiration : 0 → 1 (expiration, l'étirement s'approfondit) → 0 */
const breath = s => osc(s);

/* ------------------------------------------------------------------ décor : pilier / pan de mur étroit (face avant en x) */
Rig.prop('st_pillar', {
  make(c){ const m = c.mk(new c.THREE.BoxGeometry(1, 1, 1), c.mats.wall); m.receiveShadow = true; return m; },
  update(m, s){ const d = s.d || .3, h = s.h || 2.1; m.scale.set(d, h, s.w || .6); m.position.set(s.x + d/2, h/2, s.z || 0); }
});
/** box pour poser le pied */
const STAND = .955;

/* ================================================================ 1. cou : inclinaison latérale (tête penchée vers la gauche, main gauche sur la tempe droite) */
function st_neckside(s){
  const br = breath(s);
  const P = {pc:[-.01, STAND, 0], tilt:0, dev:{thup:-1}, headTilt:36 + 6*br};
  const U = upper(P, 3);
  const palm = onHead(U, [.02, .035, -.08], [0, .2, -1], .045);
  return Object.assign(P, {
    gaze:U.gaze, gazeK:1,
    legs:{L:flatFoot(0, .13, 6), R:flatFoot(0, -.13, 6)},
    arms:{mode:'custom', curl:'loose',
      L:{hand:palm, pole:[-.1, 1, .45], rel:'world', curl:'loose'},
      R:Object.assign(relaxed('R'), {hand:[.03, -.585 - .01*br, -.05]})},
    focus:['upperback']
  });
}

/* ================================================================ 2. cou : flexion avant, mains derrière la tête */
function st_neckflex(s){
  const br = breath(s);
  const P = {pc:[-.01, STAND, 0], tilt:1, dev:{thlow:1, thup:4 + 2*br}};
  const diff = 50 + 6*br;
  const U = upper(P, diff);
  const hand = sz => ({hand:onHead(U, [-.055, .085, .035*sz], [-1, .5, .3*sz], .04), pole:[.7, -1, .45*sz], rel:'world', curl:'loose'});
  return Object.assign(P, {
    gaze:U.gaze, gazeK:1,
    legs:{L:flatFoot(0, .13, 6), R:flatFoot(0, -.13, 6)},
    arms:{mode:'custom', curl:'loose', L:hand(1), R:hand(-1)},
    focus:['upperback']
  });
}

/* ================================================================ 3. cou : extension (regard vers le haut), main sur le front */
function st_neckext(s){
  const br = breath(s);
  const P = {pc:[-.01, STAND, 0], tilt:-1, dev:{thup:-2}};
  const diff = -38 - 6*br;
  const U = upper(P, diff);
  return Object.assign(P, {
    gaze:U.gaze, gazeK:1,
    legs:{L:flatFoot(0, .13, 6), R:flatFoot(0, -.13, 6)},
    arms:{mode:'custom', curl:'loose',
      L:relaxed('L'),
      R:{hand:onHead(U, [.115, .07, -.01], [1, .3, 0], .04), pole:[.2, .5, -1], rel:'world', curl:'loose'}},
    focus:[]
  });
}

/* ================================================================ 4. mollet contre un mur (jambe gauche tendue derrière, talon au sol) */
const CW = {ax:-.66, fx:.02, wall:.33};
function st_calfwall(s){
  const br = breath(s);
  const a = (29 + 2*br)*D2R;                                // inclinaison de la jambe arrière (le bassin avance vers le mur)
  const aL = [CW.ax, .075, .12];
  const hipL = [aL[0] + .885*Math.sin(a), .075 + .885*Math.cos(a), HIPZ];
  const pc = [hipL[0], hipL[1], 0];
  const tilt = 27 + 2*br, dev = {pel:-3, thup:-2};
  const U = upper({pc, tilt, dev}, 0);
  // avant-bras posés à plat sur le mur, mains au-dessus des coudes
  const hand = sz => { const sh = U.sh(sz > 0 ? 'L' : 'R'); return {hand:[CW.wall - .035, sh[1] + .23, .15*sz], pole:[1, -.35, .35*sz], rel:'world', curl:'flat'}; };
  return {
    pc, tilt, dev, gaze:[CW.wall + 1, 1.2], gazeK:.4,
    legs:{L:lg(aL, [1, 0, .02], [1, 0, .1], [0, 1, 0]), R:lg([CW.fx, .075, -.12], [1, 0, -.06], [1, .05, -.1], [0, 1, 0])},
    arms:{mode:'custom', curl:'flat', L:hand(1), R:hand(-1)},
    world:{st_pillar:{x:CW.wall, z:0, w:.75, d:.3, h:2.1}},
    focus:['calves']
  };
}

/* ================================================================ 5. quadriceps debout (talon gauche vers la fesse, bras droit devant) */
function st_quadstand(s){
  const br = breath(s);
  const pc = [-.01, STAND - .005, -.045];
  const hipL = hipPos(pc, 'L');
  const e = (6 + 5*br)*D2R;                                    // cuisse légèrement en arrière
  const knee = add(hipL, [-TH*Math.sin(e), -TH*Math.cos(e), -.01]);
  const f = (152 + 3*br)*D2R;                                  // flexion du genou
  const sh = [Math.sin(-e + Math.PI - f), -Math.cos(-e + Math.PI - f)];   // direction du tibia depuis le genou
  const ank = add(knee, [SHK*sh[0]*-1, SHK*sh[1]*-1, 0]);
  const aL = [ank[0], ank[1], .09];
  const legL = lg(aL, [-.75, .6, 0], [-.15, -1, .02], null, 0);
  const tilt = 3, dev = {thup:-1};
  return {
    pc, tilt, dev, gaze:[3, 1.5], gazeK:.4,
    legs:{L:legL, R:lg([0, .075, -.08], [1, 0, -.05], [1, 0, -.15], [0, 1, 0])},
    arms:{mode:'custom', curl:'loose',
      L:{hand:add(aL, [-.03, .045, .045]), pole:[-.3, -.3, 1], rel:'world', curl:'grip'},
      R:{hand:[.56, .02, .06], pole:[0, -1, -.4], rel:'sh', curl:'loose'}},
    focus:['quadsL','hipflex']
  };
}

/* ================================================================ 6. fléchisseur de hanche, pied avant sur une box (jambe arrière droite tendue) */
const HB = {bx:.30, h:.34, ax:-.62};
function st_hipflexbox(s){
  const br = breath(s);
  const a = (29 + 3*br)*D2R;                                // jambe arrière tendue, le bassin avance
  const aR = [HB.ax, .12, -.12];
  const hipR = [aR[0] + .87*Math.sin(a), aR[1] + .87*Math.cos(a), -HIPZ];
  const pc = [hipR[0], hipR[1], 0];
  const aL = [HB.bx - .07, HB.h + .075, .11];
  const hipL = hipPos(pc, 'L'), kneeL = kneeIK(hipL, aL, [1, .2, .1]);
  const tilt = 8 - 2*br, dev = {pel:-6 - 2*br, lum:-2, thup:1};
  const top = add(kneeL, [-.02, .06, 0]);
  return {
    pc, tilt, dev, gaze:[3, 1.3], gazeK:.4,
    legs:{L:lg(aL, [1, 0, .04], [1, .2, .1], [0, 1, 0]), R:{ankle:aR, toe:[aR[0] + .17, .02, aR[2] - .02], pole:[1, 0, -.1], toeFlex:45}},
    arms:{mode:'custom', curl:'loose',
      L:{hand:add(top, [-.01, .02, .04]), pole:[-.3, -.3, 1], rel:'world'},
      R:{hand:add(top, [-.04, .01, -.03]), pole:[-.3, -.5, -1], rel:'world'}},
    world:{box:{x:HB.bx, h:HB.h, z:.08, w:.45, d:.42}},
    focus:['hipflex','quads']
  };
}

/* ================================================================ 7. dos et épaules : mains au mur, buste à l'horizontale */
const WB = {wall:.84};
function st_wallback(s){
  const br = breath(s);
  const flex = 8, d = Math.sqrt(TH*TH + SHK*SHK + 2*TH*SHK*Math.cos(flex*D2R));
  const px = -.20;
  const pc = [px, .075 + Math.sqrt(d*d - px*px - (.13 - HIPZ)**2), 0];
  const tilt = 88 + 2*br, dev = {pel:-4, lum:-2, thlow:-3 - 3*br, thup:-4 - 5*br};
  const U = upper({pc, tilt, dev}, 0);
  const hand = sz => { const sh = U.sh(sz > 0 ? 'L' : 'R'); return {hand:reach(sh, [WB.wall - .075, sh[1] + .05, .14*sz], .59), pole:[0, -1, .5*sz], rel:'world', curl:'flat'}; };
  return {
    pc, tilt, dev, gaze:[.2, -1], gazeK:.4,
    legs:{L:flatFoot(0, .13, 5), R:flatFoot(0, -.13, 5)},
    arms:{mode:'custom', curl:'flat', L:hand(1), R:hand(-1)},
    world:{st_pillar:{x:WB.wall, z:0, w:.75, d:.3, h:2.1}},
    focus:['lats','upperback','hams']
  };
}

/* ================================================================ 9. squat profond tenu, talons au sol, coudes à l'intérieur des genoux */
function st_deepsquat(s){
  const br = breath(s);
  const W = .19, OUT = 24;
  const pc = [-.13, .37 - .012*br, 0];
  const tilt = 30 + 2*br, dev = {pel:6, lum:4, thlow:2, thup:0};
  const fo = sz => lg([.02, .075, W*sz], [Math.cos(OUT*D2R), 0, Math.sin(OUT*D2R)*sz], [Math.cos(OUT*D2R), .2, Math.sin(OUT*D2R)*sz*1.5], [0, 1, 0]);
  const legs = {L:fo(1), R:fo(-1)};
  const kL = kneeIK(hipPos(pc, 'L'), legs.L.ankle, legs.L.pole), kR = kneeIK(hipPos(pc, 'R'), legs.R.ankle, legs.R.pole);
  const mid = [Math.max(kL[0], kR[0]) - .02, (kL[1] + kR[1])/2 - .12, 0];
  return {
    pc, tilt, dev, gaze:[2, .3], gazeK:.4,
    legs,
    arms:{mode:'custom', curl:'loose',
      L:{hand:add(mid, [0, 0, .025]), pole:[-.1, -1, .25], rel:'world'},
      R:{hand:add(mid, [0, 0, -.025]), pole:[-.1, -1, -.25], rel:'world'}},
    focus:['adductors','glutes','calves','lowback']
  };
}

/* ================================================================ 10. papillon, buste penché en avant */
function st_butterfly(s){
  const br = breath(s);
  const pc = [0, .075, 0], tilt = 36 + 5*br;
  const leg = sz => {
    const ank = [.36, .09, .065*sz];
    const a = 64*sz;
    return lg(ank, [1, -.05, .12*sz], [.15, Math.cos(a*D2R), Math.sin(a*D2R)], rotAx([0, 1, 0], [1, 0, 0], 72*sz), 0);
  };
  const legs = {L:leg(1), R:leg(-1)};
  const arm = sz => ({hand:[.44, .12, .05*sz], pole:[.2, -.3, sz], rel:'world', curl:'grip'});
  return {
    pc, tilt, dev:{pel:-14, lum:4, thlow:6, thup:8 + 2*br}, gaze:[.8, 0], gazeK:.35,
    legs, arms:{mode:'custom', curl:'grip', L:arm(1), R:arm(-1)},
    world:{mat:{x:.15}},
    focus:['adductors','lowback']
  };
}

/* ================================================================ 11. à genoux, buste en arrière, mains au sol derrière (quadriceps) */
function st_kneelback(s){
  const br = breath(s);
  const KY = .05;
  const phi = (58 - 6*br)*D2R;                     // cuisse : 90° = assis sur les talons ; plus petit = hanches poussées vers l'avant
  const kL = [0, KY, .11], kR = [0, KY, -.11];
  const hip = [-TH*Math.sin(phi), KY + TH*Math.cos(phi)];
  const pc = [hip[0], hip[1], 0];
  const shin = sz => lg([-SHK + .005, KY - .005, .11*sz], [-.97, -.24, 0], poleOf([hip[0], hip[1], HIPZ*sz], [0, KY, .11*sz], [-SHK, KY, .11*sz]), [0, -1, 0], 0);
  const tilt = -44 - 4*br, dev = {pel:-10, lum:-4, thlow:-2, thup:2};
  const U = upper({pc, tilt, dev}, 0);
  const hand = sz => ({hand:reach(U.sh(sz > 0 ? 'L' : 'R'), [-.66, .03, .24*sz], .59), pole:[-1, 0, .2*sz], rel:'world', curl:'flat'});
  return {
    pc, tilt, dev, gaze:[2.5, 1.9], gazeK:.4,
    legs:{L:shin(1), R:shin(-1)},
    arms:{mode:'custom', curl:'flat', L:hand(1), R:hand(-1)},
    world:{mat:{x:-.2}},
    focus:['quads','hipflex']
  };
}

/* ================================================================ couché sur le dos : repères */
const SUP_Y = .09;
function legAt(hip, a, f){
  const k = [hip[0] + TH*Math.cos(a*D2R), hip[1] + TH*Math.sin(a*D2R)];
  const b = (a - f)*D2R;
  return {knee:k, ankle:[k[0] + SHK*Math.cos(b), k[1] + SHK*Math.sin(b)], shin:a - f};
}
const behindHead = (open = 0) => ({mode:'custom', curl:'loose',
  L:{t:[.16, -.07, .075], pole:[0, .25 - open, 1], rel:'torso'},
  R:{t:[.16, -.07, -.075], pole:[0, .25 - open, -1], rel:'torso'}});
const supLeg = (pc, z) => {
  const L = legAt(pc, 58, 116);
  const an = [L.ankle[0], .075, z];
  return {ankle:an, toe:[an[0] + .2, .075, z*1.1], pole:[0, 1, z*.3], toeFlex:0, sole:[0, 1, 0]};
};

/* ================================================================ 12. sur le dos : bas du dos plaqué au sol + tête enroulée (tenue 5 s) */
const PT_F = [{u:0, k:0}, {u:.14, k:1}, {u:.86, k:1}, {u:1, k:0}];
function st_pelvictilt(s){
  const k = kf(PT_F, s).k, pc = [0, SUP_Y, 0];
  return {
    pc, tilt:-90, dev:{pel:-3 + 10*k, lum:4*k, thlow:8*k, thup:18*k}, gaze:'ceiling', gazeK:lerp(.4, .1, k),
    legs:{L:supLeg(pc, .12), R:supLeg(pc, -.12)},
    arms:behindHead(),
    world:{mat:{x:-.2}},
    focus:['lowback','upperback','abs'],
    phase: s < .14 ? 2 : s < .86 ? 1 : 3
  };
}

/* ================================================================ assis au sol : repères */
const SIT_Y = .10;
/** jambe gauche tendue au sol */
const straightL = (pc, yaw = 0, z = .13) => { const h = hipPos(pc, 'L', yaw), fwd = rY([1, 0, 0], yaw);
  const an = [h[0] + .86*fwd[0], .085, h[2] + .86*fwd[2] + (z - HIPZ)];
  return lg(an, [fwd[0]*.55, .83, fwd[2]*.55], [0, 1, 0], null, 0); };

/* ================================================================ 13-16. torsions assises : jambe gauche tendue, pied droit croisé à l'extérieur du genou gauche
   mode 'hug'   : le bras gauche enlace le genou droit (case 13)
   mode 'lever' : le coude gauche pousse l'extérieur du genou droit, bras droit loin derrière (cases 14 et 16) */
function seatedTwist(s, lever){
  const br = breath(s);
  const pc = [0, SIT_Y, 0];
  const legL = straightL(pc);
  const aR = [.40, .075, .21];
  const hipR = hipPos(pc, 'R');
  const poleR = [.35, 1, .15];
  const legR = lg(aR, [1, 0, .15], poleR, [0, 1, 0], 0);
  const kR = kneeIK(hipR, aR, poleR);
  const tw = (lever ? 50 : 40) + 6*br;
  const tilt = lever ? -2 : 2;
  const dev = {pel:4, lum:-2, twist:tw, pelTwist:6};
  const U = upper({pc, tilt, dev}, 0);
  let L, R;
  if(lever){
    const elb = add(kR, [.02, -.02, -.07]);
    L = {hand:add(elb, [.13, .21, .02]), pole:nrm(sub(elb, U.sh('L'))), rel:'world', curl:'loose'};
    R = {hand:reach(U.sh('R'), [-.42, .03, -.22], .59), pole:[.2, 1, -.4], rel:'world', curl:'flat'};
  } else {
    L = {hand:add(kR, [.03, -.02, -.085]), pole:[.6, -.6, .5], rel:'world', curl:'loose'};
    R = {hand:reach(U.sh('R'), [-.30, .03, -.13], .59), pole:[.3, 1, -.3], rel:'world', curl:'flat'};
  }
  return {
    pc, tilt, dev, headTurn:(lever ? 32 : 22) + 4*br, gaze:[3, .9], gazeK:.4,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'loose', L, R},
    world:{mat:{x:.2}},
    focus:['obliques','glutes','lowback']
  };
}
const st_seatedtwist = s => seatedTwist(s, false);
const st_seatedtwist2 = s => seatedTwist(s, true);

/* ================================================================ 15. cercles de cheville assis (cheville droite posée sur la cuisse gauche) */
function st_anklecircles(s, o){
  const u = ((s % 1) + 1) % 1, th = (o.rev ? -1 : 1)*u*Math.PI*2;
  const pc = [0, SIT_Y, 0], tilt = 14, dev = {pel:2, lum:2, thlow:3, thup:4};
  const legL = straightL(pc);
  const hipR = hipPos(pc, 'R');
  const aR = [.34, .235, .10];
  const poleR = [.25, .35, -1];
  const kR = kneeIK(hipR, aR, poleR);
  const ax = nrm(sub(aR, kR));                                    // axe du tibia
  const f0 = nrm(sub([.25, .35, .9], scl(ax, dot([.25, .35, .9], ax))));   // pied au repos : pointe vers le haut / l'avant
  const v = nrm(cross(ax, f0));
  const r = 32*D2R;
  const dir = nrm(add(scl(f0, Math.cos(r)), scl(add(scl(ax, Math.cos(th)), scl(v, Math.sin(th))), Math.sin(r))));
  const legR = {ankle:aR, toe:add(aR, scl(dir, .2)), pole:poleR, toeFlex:0};
  const grip = add(kR, scl(sub(aR, kR), .78));
  return {
    pc, tilt, dev, gaze:[aR[0] + .1, aR[1]], gazeK:.45,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'grip',
      L:{hand:add(grip, [.01, .045, .03]), pole:[-.2, -.5, 1], rel:'world'},
      R:{hand:add(grip, [-.08, .05, -.05]), pole:[-.2, -.6, -1], rel:'world'}},
    world:{mat:{x:.2}},
    focus:['shins','calves'],
    phase: u > .9 ? 3 : 0
  };
}

/* ================================================================ 17. ischios assis : jambe gauche tendue, pied droit contre la cuisse gauche */
function st_seatedham(s){
  const br = breath(s);
  const pc = [0, SIT_Y, 0], yaw = -10;
  const tilt = 48 + 5*br, dev = {pel:-8, lum:6, thlow:8, thup:8 + 2*br};
  const legL = straightL(pc, 0, .14);
  const hipR = hipPos(pc, 'R', yaw);
  const kR = [.22, .10, -.48];
  const aR = [.32, .08, -.05];
  const legR = lg(aR, [.55, .05, .83], poleOf(hipR, kR, aR), nrm([-.2, .3, -1]), 0);
  const U = upper({pc, tilt, dev, yaw}, 0);
  const tgt = add(legL.ankle, [-.10, .07, 0]);
  const hand = side => ({hand:reach(U.sh(side), add(tgt, [0, 0, side === 'L' ? .05 : -.05]), .585), pole:[-.3, .2, side === 'L' ? 1 : -1], rel:'world', curl:'loose'});
  return {
    pc, tilt, yaw, dev, gaze:[1.4, 0], gazeK:.3,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'loose', L:hand('L'), R:hand('R')},
    world:{mat:{x:.25}},
    focus:['hams','lowback','calves']
  };
}

/* ================================================================ 18. sur le dos, jambes croisées, genoux basculés sur le côté (épaules au sol) */
function st_supinetwist(s){
  const br = breath(s);
  const pc = [0, SUP_Y, 0];
  const rho = 52 + 6*br;                                           // bascule des genoux vers la gauche (+Z)
  const piv = [0, SUP_Y + .02, 0];
  const R = p => add(piv, rX(sub(p, piv), -rho));                  // rotation autour de l'axe du corps
  const LL = legAt(pc, 70, 112);
  const kL = [LL.knee[0], LL.knee[1], .06], aLk = [LL.ankle[0], .075, .11];
  const kRr = [LL.knee[0] + .03, LL.knee[1] + .02, -.07], aRk = [LL.ankle[0] + .03, .15, .07];
  const hipL = hipPos(pc, 'L'), hipR = hipPos(pc, 'R');
  const pel = rho*.75;
  const hL = add(piv, rX(sub(hipL, piv), -pel)), hR = add(piv, rX(sub(hipR, piv), -pel));
  const leg = (h, k, a, z) => { const K = R(k), A = R(a); if(A[1] < .07) A[1] = .07;
    return {ankle:A, toe:add(A, scl(nrm(R([.35, -.1, z])), .2)), pole:poleOf(h, K, A), toeFlex:0}; };
  return {
    pc, tilt:-90, dev:{pel:-2, pelTwist:-pel, lum:0, thup:3}, headTurn:-18, gaze:'ceiling', gazeK:.4,
    legs:{L:leg(hL, kL, aLk, .05), R:leg(hR, kRr, aRk, .05)},
    arms:behindHead(.6),
    world:{mat:{x:-.2}},
    focus:['glutes','lowback','obliques']
  };
}

const LIB = {
  st_neckside:sided(st_neckside), st_neckflex, st_neckext,
  st_calfwall:sided(st_calfwall), st_quadstand:sided(st_quadstand), st_hipflexbox:sided(st_hipflexbox),
  st_wallback, st_deepsquat, st_butterfly, st_kneelback, st_pelvictilt,
  st_seatedtwist:sided(st_seatedtwist), st_seatedtwist2:sided(st_seatedtwist2),
  st_anklecircles:sided(st_anklecircles), st_seatedham:sided(st_seatedham), st_supinetwist:sided(st_supinetwist)
};
/** cadrage d'un mouvement unilatéral : miroir de la caméra pour le côté droit */
const sf = fr => o => (o && o.side === 'R') ? Object.assign({}, fr, {az:180 - fr.az, tz:-(fr.tz||0)}) : fr;
const META = {
  st_neckside:{family:'stretch', cycle:5, frame:sf({tx:.02, ty:1.38, tz:0, H:1.42, W:1.0, el:8, az:70})},
  st_neckflex:{family:'stretch', cycle:5, frame:{tx:.02, ty:1.38, tz:0, H:1.42, W:1.0, el:8, az:40}},
  st_neckext:{family:'stretch', cycle:5, frame:{tx:.02, ty:1.38, tz:0, H:1.42, W:1.0, el:8, az:40}},
  st_calfwall:{family:'stretch', cycle:5, frame:sf({tx:-.05, ty:.9, tz:0, H:2.0, W:1.5, el:10, az:20})},
  st_quadstand:{family:'stretch', cycle:5, frame:sf({tx:.05, ty:.9, tz:0, H:2.0, W:1.5, el:8, az:35})},
  st_hipflexbox:{family:'stretch', cycle:5, frame:sf({tx:-.05, ty:.85, tz:0, H:1.95, W:1.46, el:10, az:30})},
  st_wallback:{family:'stretch', cycle:5, frame:{tx:.27, ty:.72, tz:0, H:1.7, W:1.55, el:10, az:20}},
  st_deepsquat:{family:'stretch', cycle:5, frame:{tx:0, ty:.55, tz:0, H:1.3, W:1.0, el:10, az:40}},
  st_butterfly:{family:'stretch', cycle:5, frame:{tx:.18, ty:.36, tz:0, H:1.3, W:1.0, el:16, az:60}},
  st_kneelback:{family:'stretch', cycle:5, frame:{tx:-.36, ty:.45, tz:0, H:1.45, W:1.2, el:14, az:30}},
  st_pelvictilt:{family:'stretch', cycle:7, frame:{tx:.05, ty:.2, tz:.05, H:1.75, W:1.31, el:18, az:55}},
  st_seatedtwist:{family:'stretch', cycle:5, frame:sf({tx:.3, ty:.4, tz:0, H:1.45, W:1.1, el:14, az:60})},
  st_seatedtwist2:{family:'stretch', cycle:5, frame:sf({tx:.25, ty:.4, tz:0, H:1.5, W:1.13, el:14, az:60})},
  st_anklecircles:{family:'stretch', cycle:2.4, frame:sf({tx:.3, ty:.4, tz:0, H:1.45, W:1.1, el:14, az:60})},
  st_seatedham:{family:'stretch', cycle:5, frame:sf({tx:.35, ty:.35, tz:0, H:1.3, W:1.2, el:14, az:30})},
  st_supinetwist:{family:'stretch', cycle:5, frame:sf({tx:0, ty:.2, tz:0, H:1.75, W:1.31, el:22, az:40})}
};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
