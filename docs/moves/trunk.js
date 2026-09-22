/* Charge Utile — famille « trunk » : gainage (planches latérales, Copenhague, dead bug, bird dog,
   Pallof press, mountain climbers, hollow, superman, planche touche d'épaule).
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ aides */
const TLINE = 1.78;
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
/** décalage bassin → épaule (plan sagittal) */
function shOff(tilt, dev){
  dev = dev || {}; let x = 0, y = 0;
  for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - TLINE + (dev[k]||0)); x += r[0]; y += r[1]; }
  return [x, y];
}
const SHZ = .208, HIPZ = .113, TH = .445, SHK = .456;
/** jambe dans le plan sagittal : cuisse à l'angle a (° depuis +X, sens trigo), genou fléchi de f (°) */
function legAt(hip, a, f){
  const k = [hip[0] + TH*Math.cos(a*D2R), hip[1] + TH*Math.sin(a*D2R)];
  const b = (a - f)*D2R;
  return {knee:k, ankle:[k[0] + SHK*Math.cos(b), k[1] + SHK*Math.sin(b)], shin:a - f};
}
/** symétrie droite/gauche */
const MZ = a => Array.isArray(a) ? [a[0], a[1], -(a[2]||0)] : a;
function mirror(p){
  const leg = l => l && Object.assign({}, l, {ankle:MZ(l.ankle), toe:MZ(l.toe), pole:MZ(l.pole)}, l.sole ? {sole:MZ(l.sole)} : {});
  const q = Object.assign({}, p, {pc:MZ(p.pc), legs:{L:leg(p.legs.R), R:leg(p.legs.L)}});
  if(p.arms && p.arms.mode === 'custom'){
    const arm = a => a && Object.assign({}, a, a.hand ? {hand:MZ(a.hand)} : {}, a.t ? {t:[a.t[0], a.t[1], -a.t[2]]} : {}, {pole:MZ(a.pole)});
    q.arms = Object.assign({}, p.arms, {L:arm(p.arms.R), R:arm(p.arms.L)});
  }
  return q;
}

/* ---------- position couchée sur le côté droit (racine tournée autour de X) ----------
   Le corps est décrit « debout » dans son repère B (bassin en [0, .955, 0]), puis basculé :
   W = T + Rx(θ)·B, θ = −90° + β (β = inclinaison de l'axe du corps, tête plus haute si β > 0).
   On choisit β pour que l'épaule droite soit à la hauteur ySh (coude au sol dessous) et qu'un
   point d'appui P (cheville, genou…) soit à la hauteur yP ; l'épaule droite est placée en (0, ySh, 0). */
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
  const F = {beta, c, s, T,
    toW: p => { const r = rot(p); return [r[0] + T[0], r[1] + T[1], r[2] + T[2]]; },
    dirW: rot,
    toB: w => { const x = w[0]-T[0], y = w[1]-T[1], z = w[2]-T[2]; return [x, y*c + z*s, -y*s + z*c]; },
    dirB: d => [d[0], d[1]*c + d[2]*s, -d[1]*s + d[2]*c]};
  F.m = new THREE.Matrix4().makeRotationX(th).premultiply(new THREE.Matrix4().makeTranslation(T[0], T[1], T[2]));
  return F;
}
/** avant-bras droit posé au sol (coude sous l'épaule, main devant) */
function forearmR(F, curl){
  return {hand:F.toB([.34, .045, -.01]), pole:F.dirB([-1, -1.2, 0]), rel:'world', curl: curl || 'fist'};
}
const EL_Y = .055, SH_Y = EL_Y + .262;

/* ================================================================ 1. gainage latéral statique */
function sideplankstatic(s, o, t){
  const br = Math.sin((t||0)*2.2);
  let legs, F;
  if(o.knees){
    const kR = [0, PC_B[1] - TH, -.065], kL = [0, PC_B[1] - TH, .065];
    F = sideFrame(kR, .068, SH_Y);
    const lg = k => ({ankle:[k[0] - SHK, k[1], k[2]], toe:[k[0] - SHK - .19, k[1] - .03, k[2]], pole:[1,0,0], toeFlex:0, sole:[0,-1,0]});
    legs = {L:lg(kL), R:lg(kR)};
  } else {
    const aR = [0, .075, -.06], aL = [.0, .075, .05];
    F = sideFrame(aR, .072, SH_Y);
    legs = {L:{ankle:aL, toe:[aL[0] + .2, aL[1], aL[2] + .01], pole:[1,0,.1], toeFlex:0},
            R:{ankle:aR, toe:[aR[0] + .2, aR[1], aR[2] - .01], pole:[1,0,-.1], toeFlex:0}};
  }
  return {
    pc:PC_B.slice(), tilt:0, dev:{thup:.6*br}, gaze:[3, 1.55], gazeK:.5,
    legs,
    arms:{mode:'custom', curl:'loose',
      L:{hand:[.05, PC_B[1] + .11, HIPZ + .085], pole:[-.6, 0, 1], rel:'world', curl:'loose'},
      R:forearmR(F)},
    root:{m:F.m},
    world:{mat:{x:.05, z:.75, rot:90}},
    focus:['obliques','abs','glutes']
  };
}

/* ================================================================ 2. gainage Copenhague
   Couché sur le côté droit, avant-bras droit au sol, cheville gauche (o.short : genou gauche) posée
   sur le banc par l'intérieur ; la jambe droite monte sous le banc. o.dyn : la jambe du dessous monte et descend. */
const CB = {h:.42, w:.30};
function copenhagen(s, o, t){
  const br = Math.sin((t||0)*2.2);
  const short = !!o.short;
  let F, legL, zb;
  if(short){
    const kL = [0, PC_B[1] - TH, .07];
    F = sideFrame(kL, CB.h + .058, SH_Y);
    legL = {ankle:[kL[0] - SHK, kL[1], kL[2]], toe:[kL[0] - SHK - .19, kL[1] - .03, kL[2]], pole:[1,0,0], toeFlex:0, sole:[0,-1,0]};
    zb = F.toW(kL)[2] + .02;
  } else {
    const aL = [0, .075, .07];
    F = sideFrame(aL, CB.h + .038, SH_Y);
    legL = {ankle:aL, toe:[aL[0] + .2, aL[1], aL[2] + .01], pole:[1,0,.1], toeFlex:0};
    zb = F.toW(aL)[2] - .07;
  }
  // jambe du dessous : lift 0 = pied au sol, 1 = collée sous le banc
  const lift = o.dyn ? sm(osc(s)) : 1;
  const aW = F.toW(short ? [0, .075, -.10] : [0, .075, -.08]);
  const yLow = .07, yHigh = short ? .16 : CB.h - .07 - .05;
  const aRw = [aW[0], lerp(yLow, yHigh, lift), aW[2]];
  const aR = F.toB(aRw);
  const legR = {ankle:aR, toe:[aR[0] + .2, aR[1], aR[2] - .01], pole:[1,0,-.1], toeFlex:0};
  return {
    pc:PC_B.slice(), tilt:0, dev:{thup:.6*br}, gaze:[3, 1.55], gazeK:.5,
    legs:{L:legL, R:legR},
    arms:{mode:'custom', curl:'loose',
      L:{hand:[.05, PC_B[1] + .11, HIPZ + .085], pole:[-.6, 0, 1], rel:'world', curl:'loose'},
      R:forearmR(F)},
    root:{m:F.m},
    world:{bench:{x0:-1.1, x1:.02, h:CB.h, z:zb, w:CB.w}, mat:{x:.05, z:.45, rot:90}},
    focus:['adductors','obliques','abs'],
    phase: o.dyn ? (s < .5 ? 2 : s < .95 ? 0 : 3) : undefined
  };
}

/* ================================================================ couché sur le dos */
const SUP_Y = .09;          // hauteur du bassin couché sur le dos
const SUP_TILT = -90;

/* ================================================================ 3. dead bug */
const DB_EXT = [{u:0, e:0}, {u:.38, e:1}, {u:.52, e:1}, {u:.92, e:0}, {u:1, e:0}];
function deadbugSide(v){ return kf(DB_EXT, v).e; }
function deadbug(s, o, t){
  const u = ((s % 1) + 1) % 1;
  const A = u < .5 ? deadbugSide(u*2) : 0;          // bras gauche + jambe droite
  const B = u >= .5 ? deadbugSide(u*2 - 1) : 0;     // bras droit + jambe gauche
  const pc = [0, SUP_Y];
  const leg = (e, z) => {
    const L = legAt([pc[0], pc[1]], lerp(90, 4, e), lerp(90, 2, e));
    const fa = (L.shin + lerp(80, 75, e))*D2R;
    const an = [L.ankle[0], L.ankle[1], z];
    return {ankle:an, toe:[an[0] + .2*Math.cos(fa), an[1] + .2*Math.sin(fa), z*1.1], pole:[0, 1, z*.3], toeFlex:0};
  };
  const arm = (e, sz) => { const ph = lerp(0, 88, sm(e))*D2R;
    return {hand:[-.60*Math.sin(ph), .60*Math.cos(ph), .0*sz], pole:[lerp(.3,0,e), lerp(0,1,e), 1*sz], rel:'sh', curl:'loose'}; };
  const v = u < .5 ? u*2 : u*2 - 1;
  return {
    pc, tilt:SUP_TILT, dev:{pel:-4, thlow:3, thup:5}, gaze:'ceiling', gazeK:.5,
    legs:{L:leg(B, .10), R:leg(A, -.10)},
    arms:{mode:'custom', curl:'loose', L:arm(A, 1), R:arm(B, -1)},
    world:{mat:{x:.05}},
    focus:['abs','obliques','hipflex'],
    phase: v < .52 ? 0 : v < .92 ? 2 : 3
  };
}

/* ================================================================ 7. hollow body hold */
function hollow(s, o, t){
  const br = Math.sin((t||0)*2.4);
  const easy = !!o.easy;
  const pc = [0, SUP_Y];
  const dev = {pel:-7, lum:2, thlow:14 + .5*br, thup:26 + .8*br};
  let legs, arms;
  if(easy){
    const leg = z => { const L = legAt(pc, 72, 95); const fa = (L.shin + 70)*D2R;
      return {ankle:[L.ankle[0], L.ankle[1], z], toe:[L.ankle[0] + .2*Math.cos(fa), L.ankle[1] + .2*Math.sin(fa), z], pole:[0,1,z*.3], toeFlex:0}; };
    legs = {L:leg(.09), R:leg(-.09)};
    const a = -2*D2R;
    arms = {mode:'custom', curl:'loose',
      L:{hand:[.60*Math.cos(a), .60*Math.sin(a), .03], pole:[0,-.2,1], rel:'sh'},
      R:{hand:[.60*Math.cos(a), .60*Math.sin(a), -.03], pole:[0,-.2,-1], rel:'sh'}};
  } else {
    const leg = z => { const L = legAt(pc, 15, 1); const fa = (L.shin + 25)*D2R;
      return {ankle:[L.ankle[0], L.ankle[1], z], toe:[L.ankle[0] + .2*Math.cos(fa), L.ankle[1] + .2*Math.sin(fa), z], pole:[0,1,z*.2], toeFlex:0}; };
    legs = {L:leg(.07), R:leg(-.07)};
    const a = 16*D2R;
    arms = {mode:'custom', curl:'loose',
      L:{hand:[-.60*Math.cos(a), .60*Math.sin(a), -.06], pole:[0,1,.4], rel:'sh'},
      R:{hand:[-.60*Math.cos(a), .60*Math.sin(a), .06], pole:[0,1,-.4], rel:'sh'}};
  }
  return {
    pc, tilt:SUP_TILT, dev, gaze:'ceiling', gazeK:.3,
    legs, arms,
    world:{mat:{x:.05}},
    focus:['abs','hipflex','obliques']
  };
}

/* ================================================================ 8. superman (sur le ventre) */
const PR_Y = .145;
const SUP_F = [{u:0, k:0}, {u:.08, k:0}, {u:.32, k:1}, {u:.6, k:1}, {u:.88, k:0}, {u:1, k:0}];
// option brasse : poitrine et jambes restent décollées, les bras passent de devant (tendus) à l'arrière le long du corps, puis reviennent
const SUP_B = [{u:0, p:0}, {u:.08, p:0}, {u:.46, p:1}, {u:.56, p:1}, {u:.94, p:0}, {u:1, p:0}];
function superman(s, o, t){
  if(o && o.brasse) return supermanBrasse(s, o, t);
  const k = kf(SUP_F, s).k;
  const pc = [0, PR_Y + .005*k];
  const dev = {pel:lerp(0, 2, k), lum:lerp(0, -6, k), thlow:lerp(0, -12, k), thup:lerp(0, -20, k)};
  const b = lerp(1.5, 11, k);
  const leg = z => { const hp = [pc[0], pc[1]];
    const an = [hp[0] - .897*Math.cos(b*D2R), hp[1] + .897*Math.sin(b*D2R) - .06, z];
    const fa = (180 + b + lerp(38, 20, k))*D2R;
    return {ankle:an, toe:[an[0] + .2*Math.cos(fa), an[1] + .2*Math.sin(fa), z], pole:[0,-1,z*.2], toeFlex:0, sole:[0,-1,0]}; };
  const g = lerp(-3, 14, k)*D2R;
  const arm = sz => ({hand:[.60*Math.cos(g), .60*Math.sin(g), .02*sz], pole:[0,1,.5*sz], rel:'sh', curl:'flat'});
  return {
    pc, tilt:90, dev, gaze:[1.4, 0], gazeK:.35,
    legs:{L:leg(.10), R:leg(-.10)},
    arms:{mode:'custom', curl:'flat', L:arm(1), R:arm(-1)},
    world:{mat:{x:-.1}},
    focus:['lowback','glutes','hams','upperback'],
    phase: s < .32 ? 2 : s < .88 ? 0 : 3
  };
}

function supermanBrasse(s, o, t){
  const k = 1, pc = [0, PR_Y + .005*k];
  const dev = {pel:2, lum:-6, thlow:-12, thup:-20};
  const b = 11;
  const leg = z => { const hp = [pc[0], pc[1]];
    const an = [hp[0] - .897*Math.cos(b*D2R), hp[1] + .897*Math.sin(b*D2R) - .06, z];
    const fa = (180 + b + 20)*D2R;
    return {ankle:an, toe:[an[0] + .2*Math.cos(fa), an[1] + .2*Math.sin(fa), z], pole:[0,-1,z*.2], toeFlex:0, sole:[0,-1,0]}; };
  const p = kf(SUP_B, s).p, ph = p*Math.PI;            // 0 = bras devant, 1 = bras le long du corps
  const R = .60;
  const arm = sz => ({hand:[R*Math.cos(ph), lerp(.145, -.03, p) + .04*Math.sin(ph), sz*(R*Math.sin(ph)*.95 + lerp(.02, .07, p))],
    pole:[lerp(0, -.2, p), lerp(1, .3, p), lerp(.5, 1, p)*sz], rel:'sh', curl:'flat'});
  const u = ((s % 1) + 1) % 1;
  return {
    pc, tilt:90, dev, gaze:[1.4, 0], gazeK:.35,
    legs:{L:leg(.10), R:leg(-.10)},
    arms:{mode:'custom', curl:'flat', L:arm(1), R:arm(-1)},
    world:{mat:{x:-.1}},
    focus:['lowback','glutes','hams','upperback','delts'],
    phase: u < .5 ? 2 : u < .94 ? 0 : 3
  };
}

/* ================================================================ 4. bird dog (quadrupédie) */
const BD = {py:.525, tilt:80};
function birddogSide(e){       // bras droit devant + jambe gauche derrière (e = 0 → 1)
  const pc = [0, BD.py];
  const so = shOff(BD.tilt, {});
  const sh = [pc[0] + so[0], pc[1] + so[1]];
  const hx = sh[0] + .03;
  // bras : arc de l'appui au sol vers l'horizontale
  const r0 = Math.hypot(hx - sh[0], sh[1] - .03);
  const a0 = Math.atan2(.03 - sh[1], hx - sh[0]);
  const ph = lerp(a0, 0, sm(e)), r = lerp(r0, .605, e);
  const lift = sm(clamp(e*4, 0, 1));
  const hR = [sh[0] + r*Math.cos(ph), Math.max(.03 + .03*lift, sh[1] + r*Math.sin(ph)), -SHZ + lerp(.02, .05, e)];
  // jambe gauche : cuisse de la verticale vers l'arrière, tibia horizontal
  const ta = lerp(-90, -180, sm(e)), fl = lerp(90, 0, sm(e));
  const L = legAt([pc[0], pc[1]], ta, fl);
  return {pc, sh, hR, aL:L.ankle};
}
function birddog(s, o, t){
  const u = ((s % 1) + 1) % 1;
  const v = u < .5 ? u*2 : u*2 - 1;
  const e = kf(DB_EXT, v).e;
  const P = birddogSide(e);
  const pc = P.pc, sh = P.sh, hx = sh[0] + .03;
  const kneel = z => ({ankle:[pc[0] - .40, .15, z], toe:[pc[0] - .36, .02, z], pole:[1,-.2,0], toeFlex:65});
  const free = z => { const a = P.aL, k = kneel(z), w = sm(clamp(e*1.4, 0, 1));
    const an = [lerp(k.ankle[0], a[0], w), Math.max(k.ankle[1], a[1]), z];
    const tk = [k.toe[0] - k.ankle[0], k.toe[1] - k.ankle[1]], tf = [-.01, -.2];
    const td = [lerp(tk[0], tf[0], w), lerp(tk[1], tf[1], w)];
    return {ankle:an, toe:[an[0] + td[0], an[1] + td[1], z], pole:[lerp(1, 0, w), -1, 0], toeFlex:65*(1 - sm((an[1] - .15)/.12))}; };
  const p = {
    pc, tilt:BD.tilt, dev:{}, gaze:[pc[0] + 1.5, 0], gazeK:.45,
    legs:{L:free(.10), R:kneel(-.10)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[hx, .03, SHZ - .02], pole:[-1,.2,.3], rel:'world'},
      R:{hand:P.hR, pole:[-1, lerp(.2, -1, e), -.3], rel:'world', curl: e > .3 ? 'loose' : 'flat'}},
    world:{mat:{x:-.1}},
    focus:['lowback','glutes','abs','delts'],
    phase: v < .52 ? 0 : v < .92 ? 2 : 3
  };
  return u < .5 ? p : mirror(p);
}

/* ================================================================ 5. Pallof press */
const PAL = {ax:.25, az:1.05, ah:1.22};
function pallof(s, o, t){
  const e = sm(s)*.4 + s*.6;
  const pc = [-.03, .925];
  const hL = [lerp(.20, .56, e), lerp(-.16, -.14, e), lerp(-.17, -.20, e)];
  return {
    pc, tilt:3, dev:{}, gaze:[3, 1.5], gazeK:.4,
    legs:{L:foot(0,.075,.20,{dz:.05,pole:[1,0,.45]}), R:foot(0,.075,-.20,{dz:-.05,pole:[1,0,-.45]})},
    arms:{mode:'custom', curl:'grip',
      L:{hand:[hL[0], hL[1] + .04, hL[2] - .012], pole:[-.2,-1,.6], rel:'sh'},
      R:{hand:[hL[0], hL[1] - .04, -hL[2] + .012], pole:[-.2,-1,-.6], rel:'sh'}},
    carry:[{type:'handle', at:'gripMid', axis:'grip'}],
    world:{anchor:{x:PAL.ax, z:PAL.az, h:PAL.ah}},
    focus:['obliques','abs']
  };
}

/* ================================================================ planche mains : base commune */
const PH = {hx:.17, hz:.17, py:.49};
function plankBase(tilt){
  const T0 = 71;
  const so0 = shOff(T0, {});
  const pc0 = [-.30, PH.py];
  const S = [pc0[0] + so0[0], pc0[1] + so0[1]];
  const so = shOff(tilt, {});
  return {S, pc:[S[0] - so[0], S[1] - so[1]]};
}
const PLANK_FOOT = (z, ax) => ({ankle:[ax, .16, z], toe:[ax + .05, .02, z], pole:[0,-1,0], toeFlex:70});

/* ================================================================ 6. mountain climbers */
function mountain(s, o, t){
  const kL = bump(s, .25, .25), kR = bump(s, .75, .25);
  const km = Math.max(kL, kR), tilt = 71 + 13*km + 6*Math.sin(Math.PI*km);
  const B = plankBase(tilt);
  const pc = B.pc, ax = -1.10;
  const leg = (k, z) => {
    const P0 = PLANK_FOOT(z, ax);
    if(k < 1e-4) return P0;
    // cuisse qui passe de l'arrière vers la poitrine, genou qui se plie tôt pour que le pied quitte le sol
    const a = lerp(-158, -40, sm(k)), f = lerp(4, 132, sm(Math.min(1, k*1.35)));
    const L = legAt(pc, a, f);
    const w = sm(Math.min(1, k*6));                      // départ : pied qui décolle
    const an = [lerp(ax, L.ankle[0], w), Math.max(.13, lerp(.16, L.ankle[1], w)), z*lerp(1, .85, k)];
    const fa = (L.shin + lerp(90, 58, k))*D2R;
    // direction du genou : perpendiculaire à la ligne hanche → cheville, mélangée avec « genou vers le sol »
    const dx = an[0] - pc[0], dy = an[1] - pc[1], dl = Math.hypot(dx, dy);
    const kx = L.knee[0] - pc[0], ky = L.knee[1] - pc[1], pr = (kx*dx + ky*dy)/(dl*dl);
    const nx = kx - pr*dx, ny = ky - pr*dy, nl = Math.hypot(nx, ny) || 1;
    const pole = [lerp(0, nx/nl, w), lerp(-1, ny/nl, w), 0];
    const toe = [an[0] + .2*Math.cos(fa), an[1] + .2*Math.sin(fa), an[2]];
    return {ankle:an, toe:[lerp(P0.toe[0], toe[0], w), lerp(P0.toe[1], toe[1], w), an[2]], pole, toeFlex:70*(1 - sm((an[1] - .16)/.1))};
  };
  return {
    pc, tilt, dev:{}, gaze:'floorAhead', gazeK:.8,
    legs:{L:leg(kL, .09), R:leg(kR, -.09)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[B.S[0] + .02, .03, PH.hz], pole:[-1,.3,.4], rel:'world'},
      R:{hand:[B.S[0] + .02, .03, -PH.hz], pole:[-1,.3,-.4], rel:'world'}},
    world:{mat:true},
    focus:['abs','hipflex','quads','delts'],
    phase: (s > .2 && s < .5) || s > .7 ? 3 : 0
  };
}

/* ================================================================ 9. planche touche d'épaule */
function plankreach(s, o, t){
  const kR = bump(s, .25, .22), kL = bump(s, .75, .22);
  const B = plankBase(71);
  const shift = .035*(kR - kL);
  const pc = [B.pc[0], B.pc[1], shift];
  const hx = B.S[0] + .02;
  const handPath = (k, side) => {
    const sz = side === 'L' ? 1 : -1;
    const base = [hx, .03, PH.hz*sz];
    // touche : devant l'épaule opposée
    const oppo = [B.S[0] + .06, B.S[1] - .10, -SHZ*sz*.85 + shift];
    const w = sm(k);
    const lift = Math.sin(Math.PI*w)*.06;
    return [lerp(base[0], oppo[0], w), lerp(base[1], oppo[1], w) + lift, lerp(base[2], oppo[2], w)];
  };
  const hL = handPath(kL, 'L'), hR = handPath(kR, 'R');
  return {
    pc, tilt:71, dev:{}, gaze:'floorAhead', gazeK:.8,
    legs:{L:PLANK_FOOT(.15, -1.10), R:PLANK_FOOT(-.15, -1.10)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:hL, pole:[-1, lerp(.3, -1, kL), lerp(.4, 1, kL)], rel:'world', curl: kL > .2 ? 'loose' : 'flat'},
      R:{hand:hR, pole:[-1, lerp(.3, -1, kR), lerp(-.4, -1, kR)], rel:'world', curl: kR > .2 ? 'loose' : 'flat'}},
    world:{mat:true},
    focus:['abs','obliques','delts'],
    phase: (s > .2 && s < .5) || s > .7 ? 3 : 0
  };
}

const META = {
  sideplankstatic:{family:'core', cycle:4, frame:{tx:0, ty:.42, tz:.6, H:1.2, W:1.8, el:16, az:55}},
  copenhagen:     {family:'core', cycle:4, frame:{tx:-.2, ty:.44, tz:.65, H:1.15, W:2.0, el:16, az:55}},
  deadbug:        {family:'core', cycle:3.2, frame:{tx:-.07, ty:.37, tz:0, H:1.22, W:2.0, el:20, az:42}},
  birddog:        {family:'core', cycle:3.4, frame:{tx:.08, ty:.31, tz:0, H:1.06, W:2.0, el:16, az:40}},
  pallof:         {family:'core', tempo:true, cycle:3, frame:{tx:.23, ty:.91, tz:.34, H:2.05, W:1.6, el:10, az:100}},
  mountain:       {family:'core', cycle:.8, frame:{tx:-.38, ty:.3, tz:0, H:1.0, W:1.75, el:14, az:30}},
  hollow:         {family:'core', cycle:4, frame:{tx:-.03, ty:.3, tz:0, H:.75, W:1.9, el:18, az:45}},
  superman:       {family:'core', cycle:3, frame:o => o.brasse ? {tx:.02, ty:.18, tz:0, H:1.0, W:2.3, el:30, az:40} : {tx:.08, ty:.15, tz:0, H:.95, W:2.15, el:18, az:45}},
  plankreach:     {family:'core', cycle:2.6, frame:{tx:-.37, ty:.28, tz:.03, H:1.0, W:1.6, el:16, az:40}}
};
const LIB = {sideplankstatic, copenhagen, deadbug, birddog, pallof, mountain, hollow, superman, plankreach};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
