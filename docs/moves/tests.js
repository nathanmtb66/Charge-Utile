/* Charge Utile — famille « tests » : les positions de la batterie de tests (athlète seul, téléphone fixé sur le membre).
   Jambe ou bras testé = gauche par défaut (opts.side = 'R' → miroir).
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. Sur le dos : tête vers −X, pieds vers +X. */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ------------------------------------------------------------------ aides (mêmes conventions que trailmob.js) */
const add = (a, b) => [a[0]+b[0], a[1]+b[1], (a[2]||0)+(b[2]||0)];
const sub = (a, b) => [a[0]-b[0], a[1]-b[1], (a[2]||0)-(b[2]||0)];
const scl = (a, k) => [a[0]*k, a[1]*k, (a[2]||0)*k];
const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + (a[2]||0)*(b[2]||0);
const len = a => Math.hypot(a[0], a[1], a[2]||0);
const nrm = a => { const l = len(a) || 1; return [a[0]/l, a[1]/l, (a[2]||0)/l]; };
const TLINE = 1.78, TH = .445, SHK = .456, HIPZ = .113, SHZ = .208;
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
function shOff(tilt, dev){ dev = dev || {}; let x = 0, y = 0; for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - TLINE + (dev[k]||0)); x += r[0]; y += r[1]; } return [x, y]; }
/** tilt tel que la direction bassin → épaule vise (dx, dy) */
function tiltTo(dx, dy, dev){ const o = shOff(0, dev); return Math.atan2(dx, dy)/D2R - Math.atan2(o[0], o[1])/D2R; }
/** épaule (plan sagittal, sans rotation) */
const shPos = (pc, tilt, dev, side) => { const o = shOff(tilt, dev); return [pc[0] + o[0], pc[1] + o[1], (side === 'L' ? SHZ : -SHZ) + (pc[2]||0)]; };
const hipPos = (pc, side) => [pc[0], pc[1], (pc[2]||0) + (side === 'L' ? HIPZ : -HIPZ)];
/** jambe dans le plan sagittal : cuisse à l'angle a (° depuis +X), genou fléchi de f */
function legAt(hip, a, f){
  const k = [hip[0] + TH*Math.cos(a*D2R), hip[1] + TH*Math.sin(a*D2R), hip[2]||0];
  const b = (a - f)*D2R;
  return {knee:k, ankle:[k[0] + SHK*Math.cos(b), k[1] + SHK*Math.sin(b), hip[2]||0], shin:a - f};
}
const poleOf = (hip, knee, ank) => { const dir = nrm(sub(ank, hip)), k = sub(knee, hip); return nrm(sub(k, scl(dir, dot(k, dir)))); };
const lg = (ankle, dir, pole, up, flex) => { const o = {ankle, toe:add(ankle, scl(nrm(dir), .2)), pole, toeFlex:flex||0}; if(up) o.sole = up; return o; };
function ballFoot(mx, gy, z, th, pole){
  const a = th*D2R, c = Math.cos(a), s = Math.sin(a), px = .14, py = -.074;
  const ax = mx - (px*c + py*s), ay = gy - (-px*s + py*c);
  return {ankle:[ax, ay, z], toe:[ax + .2*c, ay - .2*s, z + (z > 0 ? .02 : -.02)], pole:pole || [1, 0, z > 0 ? .2 : -.2], toeFlex:th > 0 ? th*.55 : 0};
}
const flatFoot = (x, z, pole) => lg([x, .075, z], [1, 0, 0], pole || [1, 0, z > 0 ? .25 : -.25], [0, 1, 0]);
/** bras croisés sur la poitrine (repère du buste) */
const CROSS = {mode:'custom', curl:'loose',
  L:{t:[-.13, .15, -.12], pole:[-.4, -1, .9], rel:'torso'},
  R:{t:[-.17, .19, .13], pole:[-.4, -1, -.9], rel:'torso'}};

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
      w[k] = (v && typeof v === 'object') ? Object.assign({}, v, {z:-(v.z||0)}, v.n ? {n:MZ(v.n)} : {}, v.side ? {side:v.side === 'L' ? 'R' : 'L'} : {}) : v; }
    q.world = w; }
  if(p.focus) q.focus = p.focus.map(f => f === 'quadsL' ? 'quads' : f);
  return q;
}
const sided = fn => (s, o, t) => { o = o || {}; const p = fn(s, o, t || 0); return o.side === 'R' ? mirror(p) : p; };
const sf = fr => o => (o && o.side === 'R') ? Object.assign({}, fr, {az:180 - fr.az, tz:-(fr.tz||0)}) : fr;
const sfz = fr => o => (o && o.side === 'R') ? Object.assign({}, fr, {az:-fr.az, tz:-(fr.tz||0)}) : fr;   // vue de face : on garde le côté

/* ------------------------------------------------------------------ accessoires */
/* téléphone fixé sur un segment : seg = thigh | shin | forearm | chest, n = face extérieure visée */
Rig.prop('tests_phone', {
  make(c){ const T = c.THREE, g = new T.Group();
    g.add(c.mk(new T.BoxGeometry(.075, .15, .009), c.M(0x1B1F24, .5, .2)));
    const scr = new T.Mesh(new T.BoxGeometry(.066, .138, .002), new T.MeshStandardMaterial({color:0x3E86F5, emissive:0x2256B8, emissiveIntensity:.8, roughness:.3}));
    scr.position.z = .0055; g.add(scr);
    const strap = c.mk(new T.BoxGeometry(.088, .03, .008), c.M(0x2A2F35, .9)); strap.position.z = -.005; g.add(strap);
    return g; },
  update(g, s, c){
    const T = c.THREE, sk = c.sk, sd = s.side || 'L';
    let a, b, r;
    if(s.seg === 'thigh'){ a = sk['hip'+sd]; b = sk['knee'+sd]; r = .078; }
    else if(s.seg === 'shin'){ a = sk['knee'+sd]; b = sk['ankle'+sd]; r = .052; }
    else if(s.seg === 'forearm'){ a = sk['el'+sd]; b = sk['wr'+sd]; r = .038; }
    else { a = sk.gripL; b = sk.gripR; r = .03; }
    const d = b.clone().sub(a).normalize();
    let n = new T.Vector3(...(s.n || [0, 1, 0])); n.sub(d.clone().multiplyScalar(n.dot(d))).normalize();
    const at = s.at ?? .5;
    const p = a.clone().lerp(b, at).add(n.clone().multiplyScalar(r));
    const up = s.seg === 'chest' ? new T.Vector3(0, 1, 0) : d.clone();
    const x = new T.Vector3().crossVectors(up, n).normalize(), y = new T.Vector3().crossVectors(n, x).normalize();
    g.position.copy(p); g.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(x, y, n));
  }
});
/* ruban mètre au sol (le long de x, ou de z si axis:'z') */
Rig.prop('tests_tape', {
  make(c){ const T = c.THREE, g = new T.Group();
    const m = new T.Mesh(new T.BoxGeometry(1, .004, .026), c.M(0xE9C23C, .7)); m.receiveShadow = true; g.add(m);
    const ticks = []; for(let i = 0; i < 40; i++){ const k = new T.Mesh(new T.BoxGeometry(.004, .005, .014), c.M(0x222222, .9)); g.add(k); ticks.push(k); }
    g.userData.ticks = ticks; return g; },
  update(g, s){ const L = s.len || 1.2, m = g.children[0];
    m.scale.x = L; m.position.set(L/2, .002, 0);
    g.userData.ticks.forEach((k, i) => { const x = i*.1; k.visible = x <= L; k.position.set(x, .004, -.004); });
    g.position.set(s.x || 0, 0, s.z || 0); g.rotation.y = s.axis === 'z' ? -Math.PI/2 : 0; }
});
/* table (plateau épais sur 4 pieds) */
Rig.prop('tests_table', {
  make(c){ const T = c.THREE, g = new T.Group();
    g.add(c.mk(new T.BoxGeometry(1, 1, 1), c.M(0x8A6E52, .8)));
    for(let i = 0; i < 4; i++) g.add(c.mk(new T.BoxGeometry(.05, 1, .05), c.M(0x5B4636, .8)));
    return g; },
  update(g, s){ const L = s.x1 - s.x0, W = s.w || .8, H = s.h || .75, top = g.children[0];
    top.scale.set(L, .04, W); top.position.set(0, H - .02, 0);
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([i, j], k) => { const l = g.children[k+1]; l.scale.y = H - .04; l.position.set(i*(L/2 - .05), (H - .04)/2, j*(W/2 - .05)); });
    g.position.set((s.x0 + s.x1)/2, 0, s.z || 0); }
});

/* ================================================================ 1. genou au mur (cheville gauche testée)
   Face au mur, pied gauche devant sur le mètre, talon au sol ; le genou avance jusqu'au mur puis recule. */
const KW = {XA:0, ZA:.10, WALL:.42};           // WALL = axe du mur (face avant à WALL − .12)
const KW_F = [{u:0, k:0}, {u:.35, k:1, hold:true}, {u:.7, k:1}, {u:1, k:0}];
function t_kneewall(s, o, t){
  const k = kf(KW_F, s).k;
  const th = lerp(16, 33, k)*D2R;                                       // inclinaison du tibia vers l'avant
  const A = [KW.XA, .075, KW.ZA];
  const knee = [A[0] + SHK*Math.sin(th), A[1] + SHK*Math.cos(th), KW.ZA];
  const hx = knee[0] - .31, hy = knee[1] + Math.sqrt(TH*TH - .31*.31);
  const pc = [hx, hy, 0];
  const tilt = 12;
  const P = shPos(pc, tilt, {}, 'L');
  const hy2 = P[1] - .18;
  return {
    pc, tilt, dev:{}, gaze:[KW.WALL, .6], gazeK:.5,
    legs:{L:lg(A, [1, 0, .05], [1, 0, .08], [0, 1, 0]),
          R:ballFoot(KW.XA - .55, 0, -.11, 38, [1, -.1, -.15])},
    arms:{mode:'custom', curl:'flat',
      L:{hand:[KW.WALL - .135, hy2, .22], pole:[-.3, -1, .6], rel:'world'},
      R:{hand:[KW.WALL - .135, hy2, -.20], pole:[-.3, -1, -.6], rel:'world'}},
    world:{wall:{x:KW.WALL, z:0}, tests_tape:{x:KW.XA - .35, len:.68, z:KW.ZA + .05}},
    focus:['calves', 'shins'],
    phase: s < .35 ? 0 : s < .7 ? 1 : 2
  };
}

/* ================================================================ 2. test de Thomas (cuisse gauche qui pend au bord de la table) */
const TT = {H:.76, EDGE:.05};
const TT_F = [{u:0, a:-4}, {u:.45, a:-13, hold:true}, {u:.85, a:-13}, {u:1, a:-4}];
function t_thomas(s, o, t){
  const a = kf(TT_F, s).a;
  const pc = [TT.EDGE - .06, TT.H + .09, 0];
  const hipL = hipPos(pc, 'L'), hipR = hipPos(pc, 'R');
  const Lg = legAt(hipL, a, lerp(80, 78, (a + 4)/-9));
  const Rg = legAt(hipR, 118, 142);
  const tilt = -90, dev = {pel:-4, lum:2};
  return {
    pc, tilt, dev, gaze:[Rg.knee[0], Rg.knee[1] + .2], gazeK:.4,
    legs:{L:lg(Lg.ankle, [Math.cos((Lg.shin + 90)*D2R), Math.sin((Lg.shin + 90)*D2R), 0], poleOf(hipL, Lg.knee, Lg.ankle), null, 0),
          R:lg(Rg.ankle, [Math.cos((Rg.shin + 95)*D2R), Math.sin((Rg.shin + 95)*D2R), 0], poleOf(hipR, Rg.knee, Rg.ankle), null, 0)},
    arms:{mode:'custom', curl:'grip',
      L:{hand:[Rg.knee[0] - .03, Rg.knee[1] + .02, .03], pole:[.2, -.4, 1], rel:'world'},
      R:{hand:[Rg.knee[0] + .02, Rg.knee[1] - .04, -.16], pole:[.2, -.4, -1], rel:'world'}},
    world:{tests_table:{x0:-1.55, x1:TT.EDGE, h:TT.H, w:.75}, tests_phone:{seg:'thigh', side:'L', n:[0, 1, .2], at:.5}},
    focus:['hipflex']
  };
}

/* ================================================================ 3. rotation interne de hanche, assis au bord de la table (jambe gauche) */
const HR = {H:.76, EDGE:.40};
const HR_F = [{u:0, r:0}, {u:.4, r:1, hold:true}, {u:.75, r:1}, {u:1, r:0}];
function t_hipir(s, o, t){
  const r = kf(HR_F, s).r, rot = 38*r*D2R;
  const pc = [-.05, HR.H + .10, 0];
  const legs = {};
  for(const sd of ['L', 'R']){
    const sz = sd === 'L' ? 1 : -1, hip = hipPos(pc, sd);
    const knee = [hip[0] + .43, HR.H + .06, hip[2] + .03*sz];
    const phi = sd === 'L' ? rot : 0;                                     // pied vers l'extérieur = rotation interne
    const ank = [knee[0] + .02, knee[1] - SHK*Math.cos(phi), knee[2] + SHK*Math.sin(phi)*sz];
    const shin = nrm(sub(ank, knee));
    legs[sd] = lg(ank, nrm(add([.9, .05, 0], scl(shin, -.1))), poleOf(hip, knee, ank), null, 0);
  }
  return {
    pc, tilt:3, dev:{pel:4}, gaze:[2.5, .6], gazeK:.4,
    legs,
    arms:{mode:'custom', curl:'flat',
      L:{hand:[pc[0] - .02, HR.H + .03, .30], pole:[-.4, -.2, 1], rel:'world'},
      R:{hand:[pc[0] - .02, HR.H + .03, -.30], pole:[-.4, -.2, -1], rel:'world'}},
    world:{tests_table:{x0:-.75, x1:HR.EDGE, h:HR.H, w:.9}, tests_phone:{seg:'shin', side:'L', n:[1, 0, 0], at:.45}},
    focus:['glutes', 'adductors']
  };
}

/* ================================================================ 4. jambe tendue levée, sur le dos (jambe gauche) */
const AS_F = [{u:0, a:0}, {u:.4, a:80, hold:true}, {u:.72, a:80}, {u:1, a:0}];
function t_aslr(s, o, t){
  const a = kf(AS_F, s).a;
  const pc = [0, .09, 0];
  const hipL = hipPos(pc, 'L'), L = legAt(hipL, a, 2);
  const shinDir = [Math.cos(L.shin*D2R), Math.sin(L.shin*D2R)];
  const up = [-shinDir[1], shinDir[0], 0];                                // devant du tibia
  const toe = nrm([up[0]*.95 + shinDir[0]*.3, up[1]*.95 + shinDir[1]*.3, 0]);   // pointe de pied tirée vers soi
  return {
    pc, tilt:-90, dev:{pel:-2}, gaze:[.4, 1], gazeK:.3,
    legs:{L:{ankle:L.ankle, toe:add(L.ankle, scl(toe, .2)), pole:[-shinDir[1]*-1 < 0 ? 0 : 0, 1, .05], toeFlex:0},
          R:{ankle:[.89, .08, -.11], toe:[.89 + .06, .08 + .19, -.12], pole:[0, 1, -.1], toeFlex:0}},
    arms:{mode:'floor'},
    world:{mat:{x:-.1}, tests_phone:{seg:'shin', side:'L', n:up, at:.45}},
    focus:['hams']
  };
}

/* ================================================================ 5. bras levé au-dessus de la tête, sur le dos, genoux pliés (bras gauche) */
const SF_F = [{u:0, b:0}, {u:.45, b:172, hold:true}, {u:.75, b:172}, {u:1, b:0}];
function hookLegs(pc){
  const legs = {};
  for(const sd of ['L', 'R']){ const sz = sd === 'L' ? 1 : -1;
    legs[sd] = lg([pc[0] + .52, .075, .15*sz], [1, 0, .05*sz], [.2, 1, .1*sz], [0, 1, 0]); }
  return legs;
}
function t_shflex(s, o, t){
  const b = kf(SF_F, s).b*D2R;
  const pc = [0, .10, 0], tilt = -90, dev = {pel:-6, lum:3};
  const sh = shPos(pc, tilt, dev, 'L');
  const R = .56;
  const hand = [sh[0] + R*Math.cos(b), Math.max(.05, sh[1] + R*Math.sin(b) - .03), sh[2] + .05];
  const shR = shPos(pc, tilt, dev, 'R');
  const up = [-Math.sin(b), Math.cos(b), 0];
  return {
    pc, tilt, dev, gaze:[-.2, 1], gazeK:.3,
    legs:hookLegs(pc),
    arms:{mode:'custom', curl:'loose',
      L:{hand, pole:[0, 0, 1], rel:'world'},
      R:{hand:[shR[0] + .52, .05, shR[2] - .06], pole:[0, 0, -1], rel:'world'}},
    world:{mat:{x:-.2}, tests_phone:{seg:'forearm', side:'L', n:up, at:.5}},
    focus:['delts', 'lats']
  };
}

/* ================================================================ 6. rotation externe d'épaule, coude au corps, sur le dos (bras gauche) */
const SE_F = [{u:0, p:0}, {u:.45, p:78, hold:true}, {u:.75, p:78}, {u:1, p:0}];
function t_sher(s, o, t){
  const p = kf(SE_F, s).p*D2R;
  const pc = [0, .10, 0], tilt = -90, dev = {pel:-6, lum:3};
  const sh = shPos(pc, tilt, dev, 'L'), shR = shPos(pc, tilt, dev, 'R');
  const elbow = [sh[0] + .26, .06, sh[2] + .04];
  const fa = .31;
  const hand = [elbow[0] + .02, elbow[1] + fa*Math.cos(p), elbow[2] + fa*Math.sin(p)];
  const handR = [shR[0] + .47, .05, shR[2] - .08];
  return {
    pc, tilt, dev, gaze:[-.1, 1], gazeK:.3,
    legs:hookLegs(pc),
    arms:{mode:'custom', curl:'loose',
      L:{hand, pole:poleOf(sh, elbow, hand), rel:'world'},
      R:{hand:handR, pole:[0, 0, -1], rel:'world'}},
    world:{mat:{x:-.2}, tests_phone:{seg:'forearm', side:'L', n:[1, 0, 0], at:.5}},
    focus:['delts']
  };
}

/* ================================================================ 7. sur une jambe, yeux fermés, bras croisés (appui gauche) */
function t_slseyes(s, o, t){
  const sway = .010*Math.sin((t||0)*1.3) + .006*Math.sin((t||0)*2.9);
  const pc = [-.005 + sway*.4, .95, .055 + sway];
  const A = [0, .075, .105];
  const hipR = hipPos(pc, 'R');
  const kneeR = [hipR[0] + .12, hipR[1] - .40, -.06];
  const ankR = [kneeR[0] - .16, .16, -.06];
  return {
    pc, tilt:1, dev:{bend:-1.5}, gaze:[3, 1.66], gazeK:.95,
    legs:{L:lg(A, [1, 0, .08], [1, 0, .15], [0, 1, 0]),
          R:lg(ankR, [.95, -.25, 0], poleOf(hipR, kneeR, ankR), null, 0)},
    arms:CROSS,
    world:{tests_phone:{seg:'chest', n:[1, 0, 0]}},
    focus:['calves', 'glutes', 'abs']
  };
}

/* ================================================================ 8. montées sur pointe, une jambe, doigts au mur (appui gauche)
   s = 0 talon au sol, s = .5 en haut, s = 1 en bas : même rythme que le métronome (1 s monte, 1 s descend) */
function t_heelraise(s, o, t){
  const u = s < .5 ? sm(s*2) : 1 - sm((s - .5)*2);
  const th = 38*u;
  const L = ballFoot(.14, 0, .10, th, [1, 0, .12]);
  const lift = L.ankle[1] - .075;
  const pc = [-.01 + (L.ankle[0] - 0)*.6, .955 + lift, .06];
  const hipR = hipPos(pc, 'R');
  const kneeR = [hipR[0] + .06, hipR[1] - .43, -.07];
  const ankR = [kneeR[0] - .30, kneeR[1] + .12, -.07];
  const WZ = -.56;
  return {
    pc, tilt:2, dev:{}, gaze:[3, 1.5], gazeK:.4,
    legs:{L, R:lg(ankR, [-.2, -1, 0], poleOf(hipR, kneeR, ankR), null, 0)},
    arms:{mode:'custom', curl:'loose',
      L:{hand:[.16, .98 + lift, .14], pole:[-.4, -1, .4], rel:'world', curl:'grip'},
      R:{hand:[.12, 1.18 + lift*.6, WZ + .035], pole:[-.4, -1, -.3], rel:'world', curl:'flat'}},
    world:{ankle_wall:{x:.1, z:WZ, len:1.2}, tests_phone:{seg:'chest', n:[1, 0, .3]}},
    focus:['calves'],
    phase: s < .5 ? 2 : 0
  };
}

/* ================================================================ 9. pont une jambe, talon gauche sur une box de 60 cm
   s = 0 fesses au sol, s = .5 en haut (épaule-hanche-genou alignés), s = 1 en bas */
const BR = {HX:.72, BOX:.60, PC0:[0, .11]};
const BR_S = (() => { const o = shOff(-90, {pel:-2}); return [BR.PC0[0] + o[0], BR.PC0[1] + o[1]]; })();   // épaules posées au sol
const BR_R = Math.hypot(BR.PC0[0] - BR_S[0], BR.PC0[1] - BR_S[1]), BR_A0 = Math.atan2(BR.PC0[1] - BR_S[1], BR.PC0[0] - BR_S[0]);
function t_slbridge(s, o, t){
  const u = s < .5 ? sm(s*2) : 1 - sm((s - .5)*2);
  const al = BR_A0 + lerp(0, 30, u)*D2R;
  const pc = [BR_S[0] + BR_R*Math.cos(al), BR_S[1] + BR_R*Math.sin(al), 0];
  const dev = {pel:-2 + 2*u, lum:u*2};
  const tilt = tiltTo(BR_S[0] - pc[0], BR_S[1] - pc[1], dev);
  const A = [BR.HX, BR.BOX + .065, .10];
  const hipR = hipPos(pc, 'R');
  const kneeR = [hipR[0], hipR[1] + TH, -.12];
  const ankR = [kneeR[0] + SHK*.95, kneeR[1] - .05, -.12];
  return {
    pc, tilt, dev, gaze:[.5, 1.2], gazeK:.4,
    legs:{L:lg(A, [.25, 1, 0], [0, 1, .05], null, 0),
          R:lg(ankR, [.35, .9, 0], [0, 1, -.1], null, 0)},
    arms:CROSS,
    world:{mat:{x:-.3}, box:{x:BR.HX + .05, h:BR.BOX, z:.08, w:.45, d:.40}},
    focus:['glutes', 'hams'],
    phase: s < .5 ? 2 : 0
  };
}

/* ================================================================ 10. assis-debout sur une jambe (appui gauche, jambe droite tendue devant)
   s = 0 assis, s = .5 debout, s = 1 assis */
const ST = {BENCH:.44, AX:.30};
const ST_F = [{u:0, k:0}, {u:.15, k:.25}, {u:.5, k:1}, {u:.85, k:.25}, {u:1, k:0}];
function t_slsts(s, o, t){
  const k = kf(ST_F, s).k;
  const sit = [-.10, ST.BENCH + .10], stand = [ST.AX - .02, .955];
  const lean = Math.sin(k*Math.PI)*28;
  const pc = [lerp(sit[0], stand[0], sm(k)), lerp(sit[1], stand[1], k < .3 ? k*.4 : .12 + (k - .3)/.7*.88), 0];
  const tilt = lerp(8, 2, k) + lean;
  const A = [ST.AX, .075, .11];
  const hipR = hipPos(pc, 'R'), ra = lerp(-15, -34, k)*D2R;
  const ankR = [hipR[0] + .87*Math.cos(ra), Math.max(.12, hipR[1] + .87*Math.sin(ra)), -.13];
  return {
    pc, tilt, dev:{}, gaze:[2.5, .6], gazeK:.5,
    legs:{L:lg(A, [1, 0, .06], [1, 0, .12], [0, 1, 0]),
          R:lg(ankR, [.3, .95, -.05], [0, 1, -.1], null, 0)},
    arms:CROSS,
    world:{bench:{x0:-.62, x1:.05, h:ST.BENCH, z:0, w:.38}},
    focus:['quadsL', 'glutes'],
    phase: s < .5 ? 2 : 0
  };
}

/* ================================================================ 11. saut sur une jambe en distance, réception tenue (jambe gauche) */
const HP = {X0:-.62, X1:.52};
const HP_F = [
  {u:0,   x:0,   y:.955, tilt:3,  ax:0,  ay:0,   th:0,  arm:0},
  {u:.10, x:0,   y:.955, tilt:3,  ax:0,  ay:0,   th:0,  arm:0},
  {u:.24, x:-.06,y:.80,  tilt:32, ax:0,  ay:0,   th:0,  arm:-1},
  {u:.33, x:.20, y:1.00, tilt:18, ax:.05,ay:.10, th:50, arm:1},
  {u:.44, x:.58, y:1.12, tilt:10, ax:.52,ay:.30, th:20, arm:1},
  {u:.54, x:1.00,y:.92,  tilt:14, ax:1.14,ay:.03,th:0,  arm:.6},
  {u:.60, x:1.07,y:.78,  tilt:30, ax:1.14,ay:0,  th:0,  arm:.9, hold:true},
  {u:.88, x:1.10,y:.86,  tilt:18, ax:1.14,ay:0,  th:0,  arm:.7},
  {u:.94, x:1.10,y:.86,  tilt:18, ax:1.14,ay:0,  th:0,  arm:.7},
  {u:.95, x:0,   y:.955, tilt:3,  ax:0,  ay:0,   th:0,  arm:0},
  {u:1,   x:0,   y:.955, tilt:3,  ax:0,  ay:0,   th:0,  arm:0}
];
function t_hop(s, o, t){
  const k = kf(HP_F, s);
  const X = HP.X0;
  const pc = [X + k.x, k.y, .05];
  let L;
  if(k.th > 1 && k.ay < .05) L = ballFoot(X + k.ax + .14, 0, .10, k.th, [1, 0, .12]);
  else L = lg([X + k.ax, .075 + k.ay, .10], [1, -k.th*.01, .05], [1, 0, .12], k.ay < .01 ? [0, 1, 0] : null, 0);
  const hipR = hipPos(pc, 'R');
  const kneeR = [hipR[0] + .10, hipR[1] - .36, -.09];
  const ankR = [kneeR[0] - .28, kneeR[1] - .15, -.09];
  const a = k.arm;
  const armP = sz => a < 0
    ? {t:[-.34, lerp(0, -.22, -a), .20*sz], pole:[-1, .2, .3*sz], rel:'torso'}
    : {t:[lerp(-.34, -.08, a), lerp(0, .32, a), lerp(.20, .24, a)*sz], pole:[-.3, -1, .6*sz], rel:'torso'};
  return {
    pc, tilt:k.tilt, dev:{}, gaze:[pc[0] + 2, .3], gazeK:.5,
    legs:{L, R:lg(ankR, [.2, -1, 0], poleOf(hipR, kneeR, ankR), null, 0)},
    arms:{mode:'custom', curl:'loose', L:armP(1), R:armP(-1)},
    world:{tests_tape:{x:X + .1, len:1.5, z:.20}},
    focus:['quadsL', 'glutes', 'calves'],
    phase: s < .33 ? 0 : s < .6 ? 2 : 3
  };
}

/* ================================================================ 12. squat barre, fesses touchent la box à la parallèle */
function t_boxsquat(s, o, t){
  const p = Rig.P.squat(s, {hold:'backBar'}, t);
  return Object.assign({}, p, {world:Object.assign({}, p.world || {}, {box:{x:-.42, h:.40, z:0, w:.42, d:.36}})});
}

/* ================================================================ 13. squat bras levés (overhead squat), bâton au-dessus de la tête */
Rig.prop('tests_stick', {
  make(c){ const m = c.mk(new c.THREE.CylinderGeometry(.013, .013, 1, 10), c.M(0xB08A5A, .7)); return m; },
  update(m, s, c){ const a = c.sk.gripL, b = c.sk.gripR, d = a.clone().sub(b), L = d.length() + .34;
    m.position.copy(a.clone().lerp(b, .5)); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(new c.THREE.Vector3(0, 1, 0), d.normalize()); }
});
function t_ohsquat(s, o, t){
  const tilt = lerp(2, 34, s);
  const pc = [lerp(-.01, -.23, s), lerp(.955, .50, s), 0];
  const sh = shPos(pc, tilt, {pel:lerp(0, 4, s)}, 'L');
  const tu = tilt*D2R;                                   // bras dans le prolongement du buste, un peu en arrière
  const dir = [Math.sin(tu - .12) , Math.cos(tu - .12)];
  const hand = sd => [sh[0] + .60*dir[0], sh[1] + .60*dir[1] - .02, sd*.43];
  return {
    pc, tilt, dev:{pel:lerp(0, 4, s)}, gaze:[2.6, .9], gazeK:.5,
    legs:{L:lg([0, .075, .16], [1, 0, .08], [1, 0, .45], [0, 1, 0]), R:lg([0, .075, -.16], [1, 0, -.08], [1, 0, -.45], [0, 1, 0])},
    arms:{mode:'custom', curl:'grip',
      L:{hand:hand(1), pole:[-.3, -.2, 1], rel:'world'},
      R:{hand:hand(-1), pole:[-.3, -.2, -1], rel:'world'}},
    world:{tests_stick:{}},
    focus:['quads', 'glutes', 'delts', 'calves']
  };
}

/* ------------------------------------------------------------------ déclarations */
const DEFS = {
  t_kneewall:  [sided(t_kneewall),  {family:'tests', cycle:4,   frame:sf({tx:-.12, ty:.86, tz:0, H:1.95, W:1.25, el:10, az:-14})}],
  t_thomas:    [sided(t_thomas),    {family:'tests', cycle:6,   frame:sf({tx:-.35, ty:.78, tz:0, H:1.45, W:2.1, el:14, az:20})}],
  t_hipir:     [sided(t_hipir),     {family:'tests', cycle:5,   frame:sfz({tx:.2, ty:.72, tz:0, H:1.55, W:1.3, el:12, az:62})}],
  t_aslr:      [sided(t_aslr),      {family:'tests', cycle:5,   frame:sf({tx:.1, ty:.45, tz:0, H:1.1, W:2.0, el:14, az:25})}],
  t_shflex:    [sided(t_shflex),    {family:'tests', cycle:6,   frame:sf({tx:-.2, ty:.35, tz:0, H:1.0, W:2.0, el:22, az:25})}],
  t_sher:      [sided(t_sher),      {family:'tests', cycle:5,   frame:sfz({tx:-.42, ty:.2, tz:.12, H:.8, W:1.1, el:62, az:70})}],
  t_slseyes:   [sided(t_slseyes),   {family:'tests', cycle:6,   frame:sf({tx:.05, ty:.95, tz:0, H:2.0, W:1.1, el:10, az:40})}],
  t_heelraise: [sided(t_heelraise), {family:'tests', cycle:2,   frame:sf({tx:.05, ty:.98, tz:.1, H:2.1, W:1.3, el:10, az:30})}],
  t_slbridge:  [sided(t_slbridge),  {family:'tests', cycle:2,   frame:sf({tx:.05, ty:.42, tz:0, H:1.15, W:2.0, el:14, az:22})}],
  t_slsts:     [sided(t_slsts),     {family:'tests', cycle:2,   frame:sf({tx:.0, ty:.82, tz:0, H:1.85, W:1.5, el:10, az:30})}],
  t_hop:       [sided(t_hop),       {family:'tests', cycle:3.2, frame:sf({tx:-.05, ty:.8, tz:0, H:1.8, W:2.3, el:10, az:12})}],
  t_ohsquat:   [t_ohsquat,          {family:'tests', tempo:true, cycle:4, frame:{tx:-.1, ty:1.0, tz:0, H:2.35, W:1.4, el:8, az:14}}],
  t_boxsquat:  [t_boxsquat,         {family:'tests', tempo:true, cycle:3, frame:{tx:-.15, ty:.9, tz:0, H:2.0, W:1.5, el:10, az:30}}]
};
for(const k in DEFS) Rig.define(k, DEFS[k][0], DEFS[k][1]);
})();
