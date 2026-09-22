/* Charge Utile — famille « shoulder » : coiffe des rotateurs, stabilité scapulaire et contrôle d'épaule.
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z.
   Tous les noms (animations et accessoires) sont préfixés sh_. */
(function(){
const {lerp, clamp, sm, osc, bump, foot, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ vecteurs */
const add = (a, b) => [a[0]+b[0], a[1]+b[1], (a[2]||0)+(b[2]||0)];
const sub = (a, b) => [a[0]-b[0], a[1]-b[1], (a[2]||0)-(b[2]||0)];
const scl = (a, k) => [a[0]*k, a[1]*k, (a[2]||0)*k];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + (a[2]||0)*(b[2]||0);
const len = a => Math.hypot(a[0], a[1], a[2]||0);
const nrm = a => { const l = len(a) || 1; return [a[0]/l, a[1]/l, (a[2]||0)/l]; };
const mix = (a, b, t) => [lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2]||0,b[2]||0,t)];
const rX = (v, d) => { const c = Math.cos(d*D2R), s = Math.sin(d*D2R); return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c]; };
const rY = (v, d) => { const c = Math.cos(d*D2R), s = Math.sin(d*D2R); return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c]; };
const rZ = (v, d) => { const c = Math.cos(d*D2R), s = Math.sin(d*D2R); return [v[0]*c - v[1]*s, v[0]*s + v[1]*c, v[2]]; };
/** rotation d'un étage du moteur : cap · inclinaison avant · inclinaison latérale · rotation axiale */
const MRv = (v, yaw, Dd, b, t) => rY(rZ(rX(rY(v, t), b), -Dd), yaw);

/* ------------------------------------------------------------------ gabarit */
const TH = .445, SHK = .456, HIPZ = .113, SHZ = .208;
const UARM = .263, FARM = .355;                 // épaule → coude, coude → creux de la main
const J = {hipC:[-.00342,.96954,0], S0:[-.02551,1.06384,0], S1:[-.02467,1.18947,0], S2:[-.04704,1.33171,0], S3:[.01548,1.54909,0],
           H0:[.04839,1.64837,0], HT:[.04787,1.8068,0], shL:[.0222,1.44206,.20835]};
const TLINE = Math.atan2(J.S3[0]-J.hipC[0], J.S3[1]-J.hipC[1])/D2R;
const HEAD0 = Math.atan2(J.HT[0]-J.H0[0], J.HT[1]-J.H0[1])/D2R;

/** squelette du haut du corps recalculé comme le moteur (épaules, tête, regard) */
function upper(P, diff = 0){
  const dv = P.dev || {}, yaw = P.yaw || 0, dT = P.tilt - TLINE;
  const D = k => dT + (dv[k]||0);
  const TW = dv.twist || 0, BD = dv.bend || 0;
  const pc = [P.pc[0], P.pc[1], P.pc[2]||0];
  let S = add(pc, MRv(sub(J.S0, J.hipC), yaw, D('pel'), dv.pelBend||0, dv.pelTwist||0));
  S = add(S, MRv(sub(J.S1, J.S0), yaw, D('lum'), BD*.35, TW*.3));
  const S2 = S = add(S, MRv(sub(J.S2, J.S1), yaw, D('thlow'), BD*.7, TW*.65));
  const S3 = add(S, MRv(sub(J.S3, J.S2), yaw, D('thup'), BD, TW));
  const H0 = add(S3, MRv(sub(J.H0, J.S3), yaw, D('thup'), BD, TW));
  const eye = add(H0, MRv(scl(sub(J.HT, J.H0), .35), yaw, D('thup'), BD, TW));
  const want = D('thup') + HEAD0 + diff;
  return {
    S3, eye,
    sh: side => add(S2, MRv(sub(J.shL, J.S2).map((x, i) => i === 2 && side === 'R' ? -x : x), yaw, D('thup'), BD, TW)),
    gaze: [eye[0] + 20*Math.cos(want*D2R), eye[1] - 20*Math.sin(want*D2R)]
  };
}
/** coude calculé comme le moteur (IK deux segments, pole = direction du coude) */
function elbowIK(sh, hand, pole){
  const d0 = sub(hand, sh), dir = nrm(d0);
  const d = clamp(len(d0), Math.abs(UARM-FARM)+1e-3, UARM+FARM-1e-3);
  const ca = (UARM*UARM + d*d - FARM*FARM)/(2*UARM*d), sa = Math.sqrt(Math.max(0, 1-ca*ca));
  let n = sub(pole, scl(dir, dot(pole, dir))); n = nrm(n);
  return add(add(sh, scl(dir, UARM*ca)), scl(n, UARM*sa));
}

/* ---------- géométrie du buste (comme upper.js) : place le bassin sous une épaule donnée ---------- */
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
function shOff(tilt, dev){
  dev = dev || {}; let x = 0, y = 0;
  for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - 1.78 + (dev[k]||0)); x += r[0]; y += r[1]; }
  return [x, y];
}
/** bassin tel que l'épaule soit en S et le point d'appui A à la distance Lg du bassin */
function trunkFit(A, S, Lg, dev, up = 1){
  const o0 = shOff(0, dev), l = Math.hypot(o0[0], o0[1]), a0 = Math.atan2(o0[0], o0[1]) / D2R;
  const dx = S[0]-A[0], dy = S[1]-A[1];
  const d = Math.hypot(dx, dy);
  const dd = clamp(d, Math.abs(Lg - l) + 1e-4, Lg + l - 1e-4);
  const ux = dx/d, uy = dy/d;
  const a = (dd*dd + Lg*Lg - l*l) / (2*dd), h = Math.sqrt(Math.max(0, Lg*Lg - a*a));
  const nx = -uy*up, ny = ux*up;
  const H = [A[0] + ux*a + nx*h, A[1] + uy*a + ny*h];
  const tilt = Math.atan2(S[0]-H[0], S[1]-H[1]) / D2R - a0;
  return {pc:H, tilt};
}

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
  if(p.carry) q.carry = p.carry.map(c => Object.assign({}, c, Array.isArray(c.at) ? {at:MZ(c.at)} : {},
    c.at === 'gripL' ? {at:'gripR'} : c.at === 'gripR' ? {at:'gripL'} : {},
    c.off ? {off:MZ(c.off)} : {}, Array.isArray(c.axis) ? {axis:MZ(c.axis)} : {}));
  if(p.world){ const w = {};
    for(const k in p.world){ const v = p.world[k];
      if(k === 'sh_band') w[k] = Object.assign({}, v, {anchor:MZ(v.anchor), segs:v.segs.map(sg => [MZ(sg[0]), MZ(sg[1])])});
      else w[k] = (v && typeof v === 'object') ? Object.assign({}, v, {z:-(v.z||0)}, v.rot ? {rot:-v.rot} : {}) : v; }
    q.world = w; }
  return q;
}
const sided = fn => (s, o, t) => { o = o || {}; const p = fn(s, o, t || 0); return o.side === 'R' ? mirror(p) : p; };
const sidedFrame = F => o => { const f = typeof F === 'function' ? F(o || {}) : F; return (o && o.side === 'R') ? Object.assign({}, f, {tz: -(f.tz||0)}) : f; };

/* ------------------------------------------------------------------ accessoires */
/* élastique : brins libres + poteau d'ancrage facultatif
   spec : {anchor:[x,y,z], post:bool, segs:[[p, q], …]} (jusqu'à 6 brins) */
Rig.prop('sh_band', {
  make(c){ const T = c.THREE, g = new T.Group();
    const post = c.mk(new T.BoxGeometry(.07, 1, .07), c.mats.mach); g.add(post);
    const base = c.mk(new T.BoxGeometry(.30, .03, .30), c.mats.mach); g.add(base);
    const band = []; for(let i=0;i<6;i++){ const m = c.mk(new T.CylinderGeometry(.010, .010, 1, 8), c.mats.band); g.add(m); band.push(m); }
    g.userData = {post, base, band};
    return g; },
  update(g, s){ const {post, base, band} = g.userData, A = s.anchor;
    post.visible = base.visible = !!s.post;
    if(s.post){ const ph = A[1] + .06; post.scale.y = ph; post.position.set(A[0] + .06, ph/2, A[2]); base.position.set(A[0] + .06, .015, A[2]); }
    band.forEach((m, i) => { const sg = s.segs[i]; m.visible = !!sg; if(sg){
      const a = sg[0], b = sg[1], d = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], L = Math.hypot(d[0], d[1], d[2]) || 1e-4;
      m.position.set((a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
      m.scale.set(1, L, 1);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(d[0]/L, d[1]/L, d[2]/L));
    } }); }
});
/* pan de mur (face avant tournée vers +X, occupe x ≤ x0) */
Rig.prop('sh_wall', {
  make(c){ const m = c.mk(new c.THREE.BoxGeometry(1, 1, 1), c.mats.wall); m.receiveShadow = true; return m; },
  update(m, s){ const d = s.d || .22, h = s.h || 2.3, w = s.w || 1.5; m.scale.set(d, h, w); m.position.set(s.x - d/2, h/2, s.z || 0); }
});

const STANDY = .955;
const stand = (x, br) => [x, STANDY + (br||0)];
const feetStand = (z, ox) => ({L:foot(ox||0, .075, z), R:foot(ox||0, .075, -z)});
const bandSeg = (a, b, dy) => [[a[0], a[1] + dy, a[2]], [b[0], b[1] + dy, b[2]]];

/* ================================================================ 1. rotation externe à l'élastique
   o.abd : bras à 90° d'abduction (élastique ancré devant) ; sinon coudes au corps (élastique tendu entre les deux mains).
   s = 0 : fin du mouvement (rotation externe maximale) · s = 1 : position de départ. */
function sh_exrot(s, o, t){
  const br = Math.sin((t||0)*2)*.004;
  const P = {pc:stand(-.01, br), tilt:2, dev:{thup: o.abd ? -3 : -1}};
  const U = upper(P);
  const SL = U.sh('L'), SR = U.sh('R');
  if(o.abd){
    const uL = [.500, 0, .866], uR = [.500, 0, -.866];            // bras à 90°, 30° vers l'avant (plan de l'omoplate)
    const w0L = [.866, 0, -.500], w0R = [.866, 0, .500];          // avant-bras horizontal vers l'avant
    const th = lerp(80, -8, s)*D2R;
    const dL = nrm(add(scl(w0L, Math.cos(th)), [0, Math.sin(th), 0]));
    const dR = nrm(add(scl(w0R, Math.cos(th)), [0, Math.sin(th), 0]));
    const EL = add(SL, scl(uL, UARM)), ER = add(SR, scl(uR, UARM));
    const HL = add(EL, scl(dL, FARM)), HR = add(ER, scl(dR, FARM));
    const AN = [1.24, 1.40, 0];
    return Object.assign(P, {
      gaze:[3, 1.55], gazeK:.45,
      legs:feetStand(.14),
      arms:{mode:'custom', curl:'grip',
        L:{hand:HL, pole:sub(EL, SL), rel:'world'},
        R:{hand:HR, pole:sub(ER, SR), rel:'world'}},
      world:{sh_band:{anchor:AN, post:true, segs:[
        bandSeg([AN[0], AN[1], AN[2] + .015], HL, .012), bandSeg([AN[0], AN[1], AN[2] + .015], HL, -.012),
        bandSeg([AN[0], AN[1], AN[2] - .015], HR, .012), bandSeg([AN[0], AN[1], AN[2] - .015], HR, -.012)]}},
      focus:['delts','upperback','forearms']
    });
  }
  const EL = [SL[0] - .015, SL[1] - UARM, SL[2] - .035];
  const ER = [SR[0] - .015, SR[1] - UARM, SR[2] + .035];
  const phi = lerp(48, -6, s)*D2R;
  const dL = nrm([Math.cos(phi), .05, Math.sin(phi)]);
  const dR = [dL[0], dL[1], -dL[2]];
  const HL = add(EL, scl(dL, FARM)), HR = add(ER, scl(dR, FARM));
  return Object.assign(P, {
    gaze:[3, 1.55], gazeK:.45,
    legs:feetStand(.14),
    arms:{mode:'custom', curl:'grip',
      L:{hand:HL, pole:sub(EL, SL), rel:'world'},
      R:{hand:HR, pole:sub(ER, SR), rel:'world'}},
    world:{sh_band:{anchor:[0,0,0], post:false, segs:[bandSeg(HL, HR, .012), bandSeg(HL, HR, -.012)]}},
    focus:['delts','upperback','forearms']
  });
}

/* ================================================================ 2. rotation interne à l'élastique (bras gauche)
   Poteau d'ancrage du côté du bras qui travaille ; l'avant-bras revient vers le ventre.
   s = 0 : main devant le ventre (fin) · s = 1 : position de départ, avant-bras ouvert. */
function sh_introt(s, o, t){
  const br = Math.sin((t||0)*2)*.004;
  const P = {pc:stand(-.01, br), tilt:2, dev:{thup:-1}};
  const U = upper(P);
  const SL = U.sh('L'), SR = U.sh('R');
  const EL = [SL[0] - .015, SL[1] - UARM, SL[2] - .035];
  const phi = lerp(-12, 46, s)*D2R;
  const dL = nrm([Math.cos(phi), .05, Math.sin(phi)]);
  const HL = add(EL, scl(dL, FARM));
  const AN = [EL[0] + .11, EL[1] + .02, .92];
  const HR = [SR[0] + .03, SR[1] - .575, SR[2] - .05];
  return Object.assign(P, {
    gaze:[3, 1.55], gazeK:.45,
    legs:feetStand(.15),
    arms:{mode:'custom', curl:'grip',
      L:{hand:HL, pole:sub(EL, SL), rel:'world'},
      R:{hand:HR, pole:[-1, 0, -.3], rel:'world', curl:'loose'}},
    world:{sh_band:{anchor:AN, post:true, segs:[bandSeg(AN, HL, .012), bandSeg(AN, HL, -.012)]}},
    focus:['pecs','lats','forearms']
  });
}

/* ================================================================ 3. tirage visage à l'élastique (face pull)
   Élastique ancré haut devant ; on tire vers le visage, coudes hauts et larges.
   s = 0 : mains près du visage (fin) · s = 1 : bras tendus. */
function sh_facepull(s, o, t){
  const br = Math.sin((t||0)*2)*.004;
  const e = sm(s);
  const P = {pc:stand(-.02, br), tilt:lerp(-2, 2, e), dev:{thup:lerp(-7, 2, e), thlow:lerp(-2, 1, e)}};
  const U = upper(P);
  const SL = U.sh('L'), SR = U.sh('R');
  const AN = [1.38, 1.82, 0];
  const near = sz => { const S = sz > 0 ? SL : SR; return [S[0] + .17, S[1] + .245, S[2] + .145*sz]; };
  const far = sz => { const S = sz > 0 ? SL : SR; return add(S, scl(nrm(sub([AN[0], AN[1], AN[2] + .11*sz], S)), .585)); };
  const poleNear = sz => [-.10, .12, .95*sz];
  const poleFar = sz => [-.35, -.85, .45*sz];
  const HL = mix(near(1), far(1), e), HR = mix(near(-1), far(-1), e);
  const pL = mix(poleNear(1), poleFar(1), e), pR = mix(poleNear(-1), poleFar(-1), e);
  return Object.assign(P, {
    gaze:[3, 1.62], gazeK:.4,
    legs:feetStand(.15),
    arms:{mode:'custom', curl:'grip',
      L:{hand:HL, pole:pL, rel:'world'},
      R:{hand:HR, pole:pR, rel:'world'}},
    world:{sh_band:{anchor:AN, post:true, segs:[
      bandSeg([AN[0], AN[1], AN[2] + .02], HL, .012), bandSeg([AN[0], AN[1], AN[2] + .02], HL, -.012),
      bandSeg([AN[0], AN[1], AN[2] - .02], HR, .012), bandSeg([AN[0], AN[1], AN[2] - .02], HR, -.012)]}},
    focus:['upperback','delts','lats']
  });
}

/* ================================================================ 4. Y - T - W à plat ventre
   Cycle : Y → T → W → Y. Poitrine à peine décollée, bras qui se lèvent du sol. */
const PR_Y = .145;
const YTW = {
  Y:{h:[.487, .155, .281], p:[.05, 1, .45]},
  T:{h:[.022, .113, .573], p:[-.10, 1, .35]},
  W:{h:[.155, .269, .443], p:[-.25, .28, .93]}
};
const YTW_K = (() => {
  const seq = [['Y',0],['Y',.10],['T',.28],['T',.38],['W',.56],['W',.66],['Y',.88],['Y',1]];
  return seq.map(([k, u]) => ({u, hx:YTW[k].h[0], hy:YTW[k].h[1], hz:YTW[k].h[2], px:YTW[k].p[0], py:YTW[k].p[1], pz:YTW[k].p[2]}));
})();
function sh_ytw(s, o, t){
  const k = kf(YTW_K, s);
  const P = {pc:[0, PR_Y], tilt:90, dev:{lum:-3, thlow:-6, thup:-13}};
  const leg = z => { const an = [-.895, .105, z];
    return {ankle:an, toe:[an[0] - .186, .032, z], pole:[0,-1,z*.2], toeFlex:0, sole:[0,-1,0]}; };
  const arm = sz => ({hand:[k.hx, k.hy, k.hz*sz], pole:[k.px, k.py, k.pz*sz], rel:'sh', curl:'loose'});
  return Object.assign(P, {
    gaze:[1.5, .30], gazeK:.4,
    legs:{L:leg(.105), R:leg(-.105)},
    arms:{mode:'custom', curl:'loose', L:arm(1), R:arm(-1)},
    world:{mat:{x:-.15}},
    focus:['upperback','delts','lowback'],
    phase: s < .66 ? 2 : 3
  });
}

/* ================================================================ 5. pompe plus (protraction scapulaire)
   Bras tendus tout du long : on pousse le sol pour écarter les omoplates (s = 0) puis on les laisse se rapprocher (s = 1).
   o.knees : version à quatre pattes. */
function sh_pushplus(s, o, t){
  const e = sm(s);
  const dev = {lum:lerp(1,-1,e), thlow:lerp(5,-2,e), thup:lerp(11,-5,e)};
  if(o.knees){
    // quatre pattes : bassin fixe, cuisses verticales, genoux au sol ; le buste monte quand les omoplates s'écartent
    const PX = -.50, PY = .535, HZ = .19;
    const tilt = lerp(82, 85.5, e);
    const HX = PX + shOff(83.75, {lum:0, thlow:1.5, thup:3})[0] + .012;
    const leg = z => ({ankle:[PX - .455, .075, z], toe:[PX - .455 - .185, .030, z], pole:[1, 0, z > 0 ? .1 : -.1], toeFlex:0, sole:[0,-1,0]});
    return {
      pc:[PX, PY], tilt, dev, gaze:[HX + 1.3, .05], gazeK:.45,
      legs:{L:leg(.105), R:leg(-.105)},
      arms:{mode:'custom', curl:'flat',
        L:{hand:[HX, .03, HZ], pole:[-1, .1, .25], rel:'world'},
        R:{hand:[HX, .03, -HZ], pole:[-1, .1, -.25], rel:'world'}},
      world:{mat:{x:PX - .05}},
      focus:['delts','abs','triceps'],
      phase: s < .5 ? 0 : s < .95 ? 2 : 3
    };
  }
  // planche mains : le corps reste droit, seule l'épaule s'éloigne du sol
  const A = [-1.252, .16], R = .88 + .4727, HZ = .285, HX = 0;
  const ang = lerp(20.8, 19.6, e)*D2R;
  const S = [A[0] + R*Math.cos(ang), A[1] + R*Math.sin(ang)];
  const T = trunkFit(A, S, .88, dev, 1);
  const leg = z => ({ankle:[A[0], A[1], z], toe:[A[0] + .05, .02, z], pole:[0,-1,0], toeFlex:70});
  return {
    pc:T.pc, tilt:T.tilt, dev, gaze:'floorAhead', gazeK:.55,
    legs:{L:leg(.095), R:leg(-.095)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[HX, .03, HZ], pole:[-1, .2, .45], rel:'world'},
      R:{hand:[HX, .03, -HZ], pole:[-1, .2, -.45], rel:'world'}},
    world:{mat:{x:-.55}},
    focus:['delts','abs','triceps','pecs'],
    phase: s < .5 ? 0 : s < .95 ? 2 : 3
  };
}

/* ================================================================ 6. glissé au mur (dos au mur)
   Dos, tête et bras contre le mur : les bras glissent du W au Y et redescendent.
   s = 0 : bras hauts (Y) · s = 1 : bras bas (W). */
const WS = {wall:-.135, hx:-.105};
function sh_wallslide(s, o, t){
  const e = sm(s);
  const P = {pc:[.035, .945], tilt:0, dev:{lum:3, thlow:1, thup:-1}};
  const U = upper(P);
  const hi = sz => [WS.hx, 1.935, .495*sz];
  const lo = sz => [WS.hx, 1.575, .445*sz];
  const pHi = sz => [-1, -.30, .55*sz];
  const pLo = sz => [-.75, -1, .80*sz];
  const HL = mix(hi(1), lo(1), e), HR = mix(hi(-1), lo(-1), e);
  const pL = mix(pHi(1), pLo(1), e), pR = mix(pHi(-1), pLo(-1), e);
  return Object.assign(P, {
    gaze:[3, 1.60], gazeK:.4,
    legs:{L:foot(.175, .075, .145), R:foot(.175, .075, -.145)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:HL, pole:pL, rel:'world'},
      R:{hand:HR, pole:pR, rel:'world'}},
    world:{sh_wall:{x:WS.wall, z:0, w:1.45, h:2.25}},
    focus:['upperback','delts','lats']
  });
}

/* ================================================================ 7. élévation dans le plan de l'omoplate (scaption)
   Haltères légers, pouces vers le haut, bras montés à 35° en avant du plan frontal.
   s = 0 : bras à hauteur d'épaule (haut) · s = 1 : bras le long du corps. */
const SCP = 35;
function sh_scaption(s, o, t){
  const br = Math.sin((t||0)*2)*.004;
  const e = sm(s);
  const P = {pc:stand(-.01, br), tilt:lerp(3, 1, e), dev:{thup:lerp(-3, 0, e)}};
  const U = upper(P);
  const uL = [Math.sin(SCP*D2R), 0, Math.cos(SCP*D2R)];
  const uR = [uL[0], 0, -uL[2]];
  const nL = [Math.cos(SCP*D2R), 0, -Math.sin(SCP*D2R)];
  const nR = [nL[0], 0, -nL[2]];
  const th = lerp(90, 11, e)*D2R;
  const dL = nrm(add(scl(uL, Math.sin(th)), [0, -Math.cos(th), 0]));
  const dR = [dL[0], dL[1], -dL[2]];
  const SL = U.sh('L'), SR = U.sh('R');
  const HL = add(SL, scl(dL, .578)), HR = add(SR, scl(dR, .578));
  return Object.assign(P, {
    gaze:[3, 1.55], gazeK:.4,
    legs:feetStand(.14),
    arms:{mode:'custom', curl:'grip',
      L:{hand:HL, pole:[-.55, -1, .1], rel:'world'},
      R:{hand:HR, pole:[-.55, -1, -.1], rel:'world'}},
    carry:[{type:'db', at:'gripL', axis:nL}, {type:'db', at:'gripR', axis:nR}],
    focus:['delts','upperback']
  });
}

/* ================================================================ 8. planche mains : transfert de poids latéral
   Mains et pieds fixes, le corps glisse d'un appui à l'autre. Cycle complet = un aller-retour. */
function sh_plankshift(s, o, t){
  const u = ((s % 1) + 1) % 1;
  const w = Math.sin(u*Math.PI*2);                               // −1 … +1 (+ = vers sa gauche)
  const A = [-1.252, .16], R = .88 + .4727, HZ = .215, HX = -.02;
  const dev = {thup:1.5};
  const S = [A[0] + R*Math.cos(20.2*D2R), A[1] + R*Math.sin(20.2*D2R)];
  const T = trunkFit(A, S, .88, dev, 1);
  const shift = .105*w;
  const pc = [T.pc[0], T.pc[1] - .004*Math.abs(w), shift];
  const leg = z => ({ankle:[A[0], A[1], z], toe:[A[0] + .05, .02, z], pole:[0,-1,0], toeFlex:70});
  return {
    pc, tilt:T.tilt, dev:Object.assign({bend: 3.5*w}, dev), gaze:'floorAhead', gazeK:.7,
    legs:{L:leg(.165), R:leg(-.165)},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[HX, .03, HZ], pole:[-1, .2, .4], rel:'world'},
      R:{hand:[HX, .03, -HZ], pole:[-1, .2, -.4], rel:'world'}},
    world:{mat:true},
    focus:['delts','abs','obliques','triceps'],
    phase: (u > .2 && u < .5) || u > .7 ? 3 : 0
  };
}

/* ================================================================ 9. étirement de l'arrière d'épaule (bras en travers)
   Bras gauche en travers de la poitrine, main droite qui accompagne au-dessus du coude. */
function sh_crossarm(s, o, t){
  const br = osc(s);
  const P = {pc:stand(-.01, .003*Math.sin((t||0)*2)), tilt:2, dev:{thup:-1, twist:-3*br}};
  const U = upper(P);
  const SL = U.sh('L'), SR = U.sh('R');
  const HL = [SL[0] + .215, SL[1] - .045 - .01*br, SL[2] - .515 - .035*br];
  const poleL = [1, -.42, -.15];
  const EL = elbowIK(SL, HL, poleL);
  const dir = nrm(sub(HL, EL));
  const HR = add(add(EL, scl(dir, .075)), [.055, -.015, 0]);
  return Object.assign(P, {
    gaze:[3, 1.56], gazeK:.4,
    legs:feetStand(.14),
    arms:{mode:'custom', curl:'loose',
      L:{hand:HL, pole:poleL, rel:'world', curl:'loose'},
      R:{hand:HR, pole:[.2, -1, -.55], rel:'world', curl:'loose'}},
    focus:['delts','upperback']
  });
}

/* ------------------------------------------------------------------ déclaration */
const DEFS = {
  sh_exrot:     [sh_exrot,          {family:'shoulder', tempo:true, cycle:2.6,
                 frame:o => (o && o.abd) ? {tx:.40, ty:1.00, tz:0, H:2.10, W:1.75, el:10, az:52} : {tx:.10, ty:.98, tz:0, H:2.00, W:1.45, el:10, az:58}}],
  sh_introt:    [sided(sh_introt),  {family:'shoulder', tempo:true, cycle:2.6, frame:sidedFrame({tx:.16, ty:.98, tz:.26, H:2.05, W:1.50, el:10, az:70})}],
  sh_facepull:  [sh_facepull,       {family:'shoulder', tempo:true, cycle:2.8, frame:{tx:.47, ty:1.03, tz:0, H:2.15, W:1.60, el:10, az:48}}],
  sh_ytw:       [sh_ytw,            {family:'shoulder', cycle:6.0, frame:{tx:-.12, ty:.27, tz:0, H:.85, W:2.20, el:30, az:45}}],
  sh_pushplus:  [sh_pushplus,       {family:'shoulder', tempo:true, cycle:2.6,
                 frame:o => (o && o.knees) ? {tx:-.46, ty:.36, tz:0, H:1.00, W:1.55, el:16, az:32} : {tx:-.56, ty:.38, tz:0, H:1.05, W:1.90, el:16, az:34}}],
  sh_wallslide: [sh_wallslide,      {family:'mobility', tempo:true, cycle:3.4, frame:{tx:.02, ty:1.02, tz:0, H:2.10, W:1.35, el:8, az:55}}],
  sh_scaption:  [sh_scaption,       {family:'shoulder', tempo:true, cycle:2.8, frame:{tx:.10, ty:.98, tz:0, H:2.05, W:1.65, el:10, az:55}}],
  sh_plankshift:[sh_plankshift,     {family:'shoulder', cycle:3.2, frame:{tx:-.56, ty:.36, tz:0, H:1.05, W:1.85, el:22, az:44}}],
  sh_crossarm:  [sided(sh_crossarm),{family:'stretch', cycle:5.0, frame:sidedFrame({tx:.05, ty:.98, tz:0, H:2.05, W:1.35, el:8, az:62})}]
};
for(const k in DEFS) Rig.define(k, DEFS[k][0], DEFS[k][1]);
})();
