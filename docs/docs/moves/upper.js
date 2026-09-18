/* Charge Utile — haut du corps, cardio, échauffement (famille « upper ») */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ---------- géométrie du buste (gabarit mesuré sur le squelette au repos) ----------
   Vecteurs bassin→S0→S1→S2→épaule, tournés chacun par (tilt − 1,78° + dev de l'étage). */
const TLINE = 1.78;
const SEG = [[-.023,.094,'pel'], [.001,.125,'lum'], [-.022,.143,'thlow'], [.069,.110,'thup']];
const rzv = (x, y, deg) => { const a = deg*D2R, c = Math.cos(a), s = Math.sin(a); return [x*c + y*s, -x*s + y*c]; };
/** décalage bassin → épaule (plan sagittal) pour un tilt et des dev donnés */
function shOff(tilt, dev){
  dev = dev || {}; let x = 0, y = 0;
  for(const [vx, vy, k] of SEG){ const r = rzv(vx, vy, tilt - TLINE + (dev[k]||0)); x += r[0]; y += r[1]; }
  return [x, y];
}
/** place le bassin pour que l'épaule soit en S et la cheville (ou le genou) en A, à la distance Lg du bassin.
    Renvoie {pc, tilt}. up = +1 : le bassin est du côté « haut » de la droite A→S. */
function trunk(A, S, Lg, dev, up = 1){
  const o0 = shOff(0, dev), l = Math.hypot(o0[0], o0[1]), a0 = Math.atan2(o0[0], o0[1]) / D2R;
  const dx = S[0]-A[0], dy = S[1]-A[1];
  let d = Math.hypot(dx, dy);
  const dd = clamp(d, Math.abs(Lg - l) + 1e-4, Lg + l - 1e-4);
  const ux = dx/d, uy = dy/d;
  const a = (dd*dd + Lg*Lg - l*l) / (2*dd), h = Math.sqrt(Math.max(0, Lg*Lg - a*a));
  const nx = -uy*up, ny = ux*up;
  const H = [A[0] + ux*a + nx*h, A[1] + uy*a + ny*h];
  const tilt = Math.atan2(S[0]-H[0], S[1]-H[1]) / D2R - a0;
  return {pc:H, tilt};
}
const add = (a, b) => a.map((x, i) => x + b[i]);

/* ---------- accessoires ---------- */
function beam(c, mat, p1, p2, t = .06, tz = t){
  const T = c.THREE, dx = p2[0]-p1[0], dy = p2[1]-p1[1], L = Math.hypot(dx, dy);
  const m = c.mk(new T.BoxGeometry(t, L, tz), mat);
  m.position.set((p1[0]+p2[0])/2, (p1[1]+p2[1])/2, p1[2]||0);
  m.rotation.z = -Math.atan2(dx, dy);
  return m;
}
/* vélo d'appartement à la taille du mannequin : pédalier en BIKE.C, selle, cintre */
const BIKE = {C:[.06,.30], r:.17, seat:[-.33,.97], bars:[.43,1.12]};
Rig.prop('upper_bike', {
  make(c){ const g = new c.THREE.Group(), T = c.THREE, m = c.mats;
    for(const x of [-.46,.66]){ const f = c.mk(new T.BoxGeometry(.09,.05,.56), m.mach); f.position.set(x,.025,0); g.add(f); }
    g.add(beam(c, m.mach, [-.46,.05], [-.08,.30], .07));        // pied arrière
    g.add(beam(c, m.mach, [-.10,.30], [.62,.30], .07));          // cadre bas
    g.add(beam(c, m.mach, [.66,.05], [.47,1.08], .07));          // potence
    g.add(beam(c, m.mach, [-.08,.28], [-.27,.90], .055));        // tige de selle
    g.add(beam(c, m.mach, [.06,.30], [.52,.62], .05));           // tube oblique
    const seat = c.mk(new T.BoxGeometry(.27,.055,.16), m.dark); seat.position.set(BIKE.seat[0], BIKE.seat[1]-.028, 0); g.add(seat);
    const nose = c.mk(new T.BoxGeometry(.1,.04,.07), m.dark); nose.position.set(BIKE.seat[0]+.17, BIKE.seat[1]-.024, 0); g.add(nose);
    const bars = c.mk(new T.CylinderGeometry(.017,.017,.58,12), m.dark); bars.rotation.x = Math.PI/2; bars.position.set(BIKE.bars[0], BIKE.bars[1], 0); g.add(bars);
    const stemTop = c.mk(new T.BoxGeometry(.08,.05,.06), m.mach); stemTop.position.set(.455, 1.10, 0); g.add(stemTop);
    const fly = c.mk(new T.CylinderGeometry(.21,.21,.06,36), m.steel); fly.rotation.x = Math.PI/2; fly.position.set(.44,.50,0); g.add(fly);
    const hub = c.mk(new T.CylinderGeometry(.05,.05,.12,16), m.dark); hub.rotation.x = Math.PI/2; hub.position.set(BIKE.C[0], BIKE.C[1], 0); g.add(hub);
    const cranks = [], pedals = [];
    for(const z of [.085,-.085]){
      const k = c.mk(new T.BoxGeometry(.035,BIKE.r,.02), m.steel); k.position.z = z; g.add(k); cranks.push(k);
      const p = c.mk(new T.BoxGeometry(.10,.022,.09), m.dark); p.position.z = z*1.65; g.add(p); pedals.push(p);
    }
    g.userData = {cranks, pedals};
    return g; },
  update(g, s){ const {cranks, pedals} = g.userData;
    [0, Math.PI].forEach((off, i) => { const a = (s.a||0) + off, px = BIKE.C[0] + BIKE.r*Math.sin(a), py = BIKE.C[1] + BIKE.r*Math.cos(a);
      cranks[i].position.x = BIKE.C[0] + BIKE.r/2*Math.sin(a); cranks[i].position.y = BIKE.C[1] + BIKE.r/2*Math.cos(a); cranks[i].rotation.z = -a;
      pedals[i].position.x = px; pedals[i].position.y = py; }); }
});
/* barre d'appui (échauffement) : along 'x' (sur le côté) ou 'z' (devant soi) */
Rig.prop('upper_rail', {
  make(c){ const g = new c.THREE.Group(), T = c.THREE;
    const bar = c.mk(new T.CylinderGeometry(.02,.02,1,12), c.mats.steel); g.add(bar);
    const posts = [0,1].map(() => { const p = c.mk(new T.BoxGeometry(.05,1,.05), c.mats.mach); g.add(p); return p; });
    const feet = [0,1].map(() => { const f = c.mk(new T.BoxGeometry(.3,.03,.3), c.mats.mach); g.add(f); return f; });
    g.userData = {bar, posts, feet}; return g; },
  update(g, s){ const {bar, posts, feet} = g.userData, L = s.len || 1.3, h = s.h || 1.05, alongX = s.along !== 'z';
    bar.scale.set(1, L, 1); bar.position.set(s.x||0, h, s.z||0); bar.rotation.set(alongX ? 0 : Math.PI/2, 0, alongX ? Math.PI/2 : 0);
    [-1,1].forEach((k, i) => { const x = (s.x||0) + (alongX ? k*L/2 : 0), z = (s.z||0) + (alongX ? 0 : k*L/2);
      posts[i].scale.set(1, h, 1); posts[i].position.set(x, h/2, z); feet[i].position.set(x, .015, z); }); }
});

/* ---------- mouvements ---------- */
const LIB = {
  /* ---- pompes : mains fixes au sol, corps gainé (o.knees : sur les genoux) ---- */
  pushup(s, o, t){
    const HX = .0, HZ = .30;
    let legs, T;
    if(o.knees){
      const K = [-.78, .06], e = lerp(37.6, 13.2, s) * D2R, R = .445 + .4727;
      const S = [K[0] + R*Math.cos(e), K[1] + R*Math.sin(e)];
      T = trunk(K, S, .445, {});
      const lg = z => ({ankle:[K[0]-.45, .075, z], toe:[K[0]-.63, .035, z], pole:[.25,-1,0], toeFlex:0});
      legs = {L:lg(.11), R:lg(-.11)};
    } else {
      const A = [-1.252, .16], e = lerp(19.9, 4.66, s) * D2R, R = .88 + .4727;
      const S = [A[0] + R*Math.cos(e), A[1] + R*Math.sin(e)];
      T = trunk(A, S, .88, {});
      const lg = z => ({ankle:[A[0], A[1], z], toe:[A[0]+.05, .02, z], pole:[0,-1,0], toeFlex:70});
      legs = {L:lg(.09), R:lg(-.09)};
    }
    return {
      pc:T.pc, tilt:T.tilt, dev:{}, gaze:'floorAhead', gazeK:.7,
      legs,
      arms:{mode:'custom', curl:'flat',
        L:{hand:[HX, .03, HZ], pole:[-1,.35,.55], rel:'world'},
        R:{hand:[HX, .03, -HZ], pole:[-1,.35,-.55], rel:'world'}},
      world:{mat:{x:-.55}},
      focus:['pecs','triceps','delts','abs']
    };
  },
  /* ---- rowing haltère un bras : main et genou gauches sur le banc (s = 1 : bras tendu) ---- */
  dbrow(s, o){
    const pc = [.04, .913], tilt = 78;
    const F = [
      {u:0,  h:[-.41,-.20,.01], p:[-1,.7,-.1]},
      {u:.5, h:[-.24,-.43,.00], p:[-1,.6,-.15]},
      {u:1,  h:[.02,-.585,-.02], p:[-1,.3,-.25]}
    ];
    const k = kf(F, s);
    return {
      pc, tilt, dev:{thup:-2}, gaze:'floorAhead', gazeK:.7,
      legs:{
        L:{ankle:[-.44,.49,.12], toe:[-.63,.45,.12], pole:[1,-1,0], toeFlex:0},
        R:{ankle:[-.12,.075,-.32], toe:[.08,.075,-.36], pole:[1,0,-.3], toeFlex:0}},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[.50,.45,.20], pole:[-.4,0,1], rel:'world', curl:'flat'},
        R:{hand:k.h, pole:k.p, rel:'sh'}},
      carry:[{type:'db', at:'gripR', axis:[1,0,0]}],
      world:{bench:{x0:-.60, x1:.68, h:.42, z:.09, w:.38}},
      focus:['lats','upperback','biceps']
    };
  },
  /* ---- tractions : mains fixes sur la barre (s = 0 menton au-dessus, s = 1 suspension bras tendus) ---- */
  pullup(s, o){
    const BY = 2.25, e = sm(s);
    const S = [lerp(-.13,-.03,e), lerp(2.13,1.665,s)];
    const tilt0 = lerp(-12, 2, e);
    const off = shOff(tilt0, {});
    const pc = [S[0]-off[0], S[1]-off[1]];
    const lg = z => ({ankle:[pc[0]+.20, pc[1]-.84, z], toe:[pc[0]+.36, pc[1]-.95, z*1.2], pole:[1,0,z*1.5], toeFlex:0});
    return {
      pc, tilt:tilt0, dev:{}, gaze:[2.5, lerp(2.9,2.1,e)], gazeK:.5,
      legs:{L:lg(.07), R:lg(-.07)},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[0, BY, .25], pole:[.5,-1,.7], rel:'world'},
        R:{hand:[0, BY, -.25], pole:[.5,-1,-.7], rel:'world'}},
      world:{pullbar:{x:0, y:BY}},
      focus:['lats','biceps','upperback','forearms']
    };
  },
  /* ---- développé militaire haltères debout (s = 1 haltères aux épaules, s = 0 bras tendus) ---- */
  ohpress(s, o, t){
    const e = s;
    const h = [lerp(.03,.07,e), lerp(.595,.13,e), lerp(-.01,.06,e)];
    const br = Math.sin((t||0)*2)*.002;
    return {
      pc:[-.01,.955+br], tilt:0, dev:{}, gaze:[3,1.6], gazeK:.5,
      legs:{L:foot(0,.075,.15), R:foot(0,.075,-.15)},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[h[0], h[1], h[2]], pole:[.5,-1,1], rel:'sh'},
        R:{hand:[h[0], h[1], -h[2]], pole:[.5,-1,-1], rel:'sh'}},
      carry:[{type:'db', at:'gripL', axis:'z'}, {type:'db', at:'gripR', axis:'z'}],
      focus:['delts','triceps','abs']
    };
  },
  /* ---- marche du fermier (sur place) ---- */
  farmer(s, o){
    const kL = bump(s, .25, .25), kR = bump(s, .75, .25);
    const lg = (k, z) => ({ankle:[lerp(0,.07,k), .075 + .12*k, z], toe:[lerp(.2,.26,k), .075 + .06*k, z + (z>0?.03:-.03)], pole:[1,0,z>0?.25:-.25], toeFlex:0});
    const pz = .025*(kR - kL);
    const hd = (sz) => ({hand:[.02, -.575, .075*sz], pole:[-1,0,.25*sz], rel:'sh'});
    return {
      pc:[-.01, .95 + .008*(kL+kR), pz], tilt:1, dev:{}, gaze:[3,1.5], gazeK:.4,
      legs:{L:lg(kL,.13), R:lg(kR,-.13)},
      arms:{mode:'custom', curl:'grip', L:hd(1), R:hd(-1)},
      carry:[{type:'kb', at:'gripL', axis:[1,0,0], up:[0,1,0]}, {type:'kb', at:'gripR', axis:[1,0,0], up:[0,1,0]}],
      focus:['forearms','upperback','abs','delts']
    };
  },
  /* ---- vélo d'appartement ---- */
  bike(s, o){
    const a = s * Math.PI * 2;
    const H = [-.293, 1.053], tilt = 35;
    const lg = (ang, z) => {
      const px = BIKE.C[0] + BIKE.r*Math.sin(ang), py = BIKE.C[1] + BIKE.r*Math.cos(ang);
      const b = (14 + 9*(1 - Math.cos(ang - .6))/2) * D2R;     // cheville : talon un peu plus bas en haut, pointe basse en bas/arrière
      const fx = Math.cos(b), fy = -Math.sin(b);
      const ball = [px, py + .045];
      const ank = [ball[0] - .14*fx, ball[1] - .14*fy];
      return {ankle:[ank[0], ank[1], z], toe:[ank[0] + .2*fx, ank[1] + .2*fy, z], pole:[1,.25,z>0?.08:-.08], toeFlex:0};
    };
    return {
      pc:[H[0], H[1]], tilt, dev:{lum:3, thup:4}, gaze:[3,1.1], gazeK:.6,
      legs:{L:lg(a, .13), R:lg(a + Math.PI, -.13)},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[BIKE.bars[0], BIKE.bars[1], .22], pole:[-.3,-1,.5], rel:'world'},
        R:{hand:[BIKE.bars[0], BIKE.bars[1], -.22], pole:[-.3,-1,-.5], rel:'world'}},
      world:{upper_bike:{a}},
      focus:['quads','glutes','calves']
    };
  },
  /* ---- montées de genoux (échauffement) ---- */
  highknees(s, o){
    const kL = bump(s, .25, .25), kR = bump(s, .75, .25);
    const lg = (k, z) => ({ankle:[lerp(0,.25,k), lerp(.10,.50,k), z], toe:[lerp(.19,.43,k), lerp(.03,.42,k), z], pole:[1,.3*k,z>0?.15:-.15], toeFlex:lerp(30,0,k)});
    const sw = kR - kL;
    const arm = (v, sz) => ({hand:[lerp(-.07,.22,(v+1)/2), lerp(-.38,-.25,(v+1)/2), .10*sz], pole:[-1,-.5,.2*sz], rel:'sh'});
    return {
      pc:[0, .975 + .012*Math.cos(s*Math.PI*4)], tilt:3, dev:{}, gaze:[3,1.4], gazeK:.5,
      legs:{L:lg(kL,.11), R:lg(kR,-.11)},
      arms:{mode:'custom', curl:'loose', L:arm(sw,1), R:arm(-sw,-1)},
      focus:['hipflex','quads','calves']
    };
  },
  /* ---- talons-fesses ---- */
  buttkicks(s, o){
    const kL = bump(s, .25, .25), kR = bump(s, .75, .25);
    const pc = [-.01, .975 + .012*Math.cos(s*Math.PI*4)];
    const fold = (e) => { // cuisse quasi verticale, la jambe se replie vers l'arrière
      const th = 8*e*D2R, ps = 150*e*D2R;
      const kn = [pc[0] + .445*Math.sin(th), pc[1] - .445*Math.cos(th)];
      return [kn[0] - .457*Math.sin(ps), kn[1] - .457*Math.cos(ps)];
    };
    const f0 = fold(0);
    const lg = (k, z) => {
      const e = sm(k), f = fold(e);
      const ank = [f[0] + (0 - f0[0])*(1-e), f[1] + (.10 - f0[1])*(1-e)];
      const fa = lerp(-20, -173, sm(clamp((e-.2)/.8, 0, 1)))*D2R;
      return {ankle:[ank[0], ank[1], z], toe:[ank[0] + .2*Math.cos(fa), ank[1] + .2*Math.sin(fa), z], pole:[lerp(1,.25,e), -e, z>0?.1:-.1], toeFlex:lerp(30,0,e)};
    };
    const sw = kR - kL;
    const arm = (v, sz) => ({hand:[lerp(-.07,.19,(v+1)/2), lerp(-.38,-.27,(v+1)/2), .10*sz], pole:[-1,-.5,.2*sz], rel:'sh'});
    return {
      pc, tilt:5, dev:{}, gaze:[3,1.4], gazeK:.5,
      legs:{L:lg(kL,.11), R:lg(kR,-.11)},
      arms:{mode:'custom', curl:'loose', L:arm(sw,1), R:arm(-sw,-1)},
      focus:['hams','calves']
    };
  },
  /* ---- balancier de jambe (droite) : avant-arrière, main gauche sur la barre ; o.side : latéral, face à la barre ---- */
  legswing(s, o){
    const c = Math.cos(s*Math.PI*2);
    const stand = {ankle:[0,.075,.12], toe:[.2,.075,.15], pole:[1,0,.3], toeFlex:0};
    if(o.side){
      const phi = (-2.5 + 32.5*c) * D2R;               // + = croise devant, − = s'écarte
      const pz = .035 - .03*c;
      const hip = [-.01, .955, pz - .113];
      const L = .86, fx = .30;
      const dy = Math.sqrt(Math.max(.1, L*L - fx*fx - (L*Math.sin(phi))**2));
      const an = [hip[0] + fx, hip[1] - dy, hip[2] + L*Math.sin(phi)];
      return {
        pc:[-.01, .955, pz], tilt:4, dev:{}, gaze:[3,1.2], gazeK:.4,
        legs:{L:stand, R:{ankle:an, toe:[an[0]+.19, an[1]-.02, an[2] + .06*Math.sin(phi)], pole:[1,.2,Math.sin(phi)*.3], toeFlex:0}},
        arms:{mode:'custom', curl:'grip',
          L:{hand:[.45,1.06,.24], pole:[-.2,-1,.8], rel:'world'},
          R:{hand:[.45,1.06,-.24], pole:[-.2,-1,-.8], rel:'world'}},
        world:{upper_rail:{along:'z', x:.45, z:0, h:1.06, len:1.2}},
        focus:['adductors','glutes','hipflex']
      };
    }
    const th = (15 + 45*c);
    const L = .845 + .03*Math.min(1, Math.abs(th)/28);
    const pcx = -.01 - .025*c;
    const hip = [pcx, .955];
    const tr = th*D2R, fa = th*.75*D2R;
    const an = [hip[0] + L*Math.sin(tr), hip[1] - L*Math.cos(tr), -.10];
    return {
      pc:[pcx, .955, .03], tilt:3 - 6*c, dev:{lum:2*c}, gaze:[3,1.2], gazeK:.4,
      legs:{L:stand, R:{ankle:an, toe:[an[0] + .2*Math.cos(fa), an[1] + .2*Math.sin(fa), -.11], pole:[Math.cos(tr), Math.sin(tr), -.05], toeFlex:0}},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[.02,1.06,.47], pole:[-.3,-1,1], rel:'world'},
        R:{hand:[.01,-.37,.015], pole:[-.6,0,-1], rel:'sh', curl:'loose'}},
      world:{upper_rail:{along:'x', x:0, z:.47, h:1.06, len:1.3}},
      focus:['hams','hipflex','glutes']
    };
  },
  /* ---- chenille ---- */
  inchworm(s, o){
    const HZ = .17, A0 = [0,.075], A1 = [.15,.16];
    const hx0 = .56, hx1 = 1.40;
    const devP = {pel:0, lum:8, thlow:10, thup:8};
    // pose « marche des mains » : p = 0 mains près des pieds, p = 1 planche
    const walk = p => {
      const n = 6, q = clamp(p, 0, 1)*n, i = Math.min(n-1, Math.floor(q)), f = sm(q - i);
      const D = (hx1 - hx0)/3;
      const stepsL = Math.floor((i+2)/2), stepsR = Math.floor((i+1)/2); // pas terminés avant le pas i
      let xL = hx0 + D*stepsL, xR = hx0 + D*stepsR, yL = .03, yR = .03;
      if(i % 2 === 0){ xL = hx0 + D*(stepsL - 1 + f); yL = .03 + .07*Math.sin(Math.PI*f); }
      else { xR = hx0 + D*(stepsR - 1 + f); yR = .03 + .07*Math.sin(Math.PI*f); }
      const ep = sm(p);
      const A = [lerp(A0[0],A1[0],ep), lerp(A0[1],A1[1],ep)];
      const hm = (xL + xR)/2;
      const S = [hm + lerp(-.10,.02,ep), lerp(.60,.62,ep)];
      const dev = {pel:0, lum:lerp(devP.lum,0,ep), thlow:lerp(devP.thlow,0,ep), thup:lerp(devP.thup,0,ep)};
      const T0 = trunk(A, S, lerp(.84,.88,ep), dev);
      // près de la planche : bassin sur la droite cheville→épaule (évite la singularité du bras de levier tendu)
      const o0 = shOff(0, dev), l = Math.hypot(o0[0], o0[1]), a0 = Math.atan2(o0[0], o0[1]) / D2R;
      const dx = S[0]-A[0], dy = S[1]-A[1], d = Math.hypot(dx, dy);
      const HL = [A[0] + dx/d*(d-l), A[1] + dy/d*(d-l)];
      const tL = Math.atan2(dx, dy) / D2R - a0;
      const w = sm((ep - .6)/.4);
      const T = {pc:[lerp(T0.pc[0], HL[0], w), lerp(T0.pc[1], HL[1], w)], tilt:lerp(T0.tilt, tL, w)};
      return {pc:T.pc, tilt:T.tilt, dev, A, ep, hL:[xL,yL,HZ], hR:[xR,yR,-HZ], flex:lerp(0,70,ep), toe:[lerp(.2,.20,ep), lerp(.075,.02,ep)], g:[hm + lerp(.3,.7,ep), 0], gk:.6};
    };
    const u = ((s % 1) + 1) % 1;
    let P;
    if(u < .18 || u >= .80){
      const q = u < .18 ? sm(u/.18) : 1 - sm((u-.80)/.20);
      const W = walk(0);
      const tilt = lerp(0, W.tilt, q);
      const dev = {pel:0, lum:W.dev.lum*q, thlow:W.dev.thlow*q, thup:W.dev.thup*q};
      const pc = [lerp(-.01, W.pc[0], q) , lerp(.955, W.pc[1], q) - .02*Math.sin(Math.PI*q)];
      const so = shOff(tilt, dev), sh = [pc[0]+so[0], pc[1]+so[1]];
      const hang = [sh[0] + .03 + .1*q, sh[1] - .57];
      const qq = sm(clamp((q - .35)/.65, 0, 1));
      const T = [lerp(hang[0], W.hL[0], qq), Math.max(.03, lerp(hang[1], W.hL[1], qq))];
      const vx = T[0]-sh[0], vy = T[1]-sh[1], vl = Math.hypot(vx, vy), k = Math.min(1, .585/vl); // bras relâché : jamais plus long que le bras
      const hL = [sh[0] + vx*k, sh[1] + vy*k, lerp(.23, HZ, qq)];
      P = {pc, tilt, dev, A:A0, hL, hR:[hL[0], hL[1], -hL[2]], flex:0, toe:[.2,.075], g:[lerp(3, W.hL[0]+.3, q), lerp(1.5, 0, q)], gk:lerp(.4,.6,q)};
    } else if(u < .44) P = walk((u-.18)/.26);
    else if(u < .52) P = walk(1);
    else P = walk(1 - (u-.52)/.28);
    const lg = z => ({ankle:[P.A[0], P.A[1], z], toe:[P.toe[0], P.toe[1], z + (z>0?.02:-.02)], pole:[1,0,z>0?.15:-.15], toeFlex:P.flex});
    return {
      pc:P.pc, tilt:P.tilt, dev:P.dev, gaze:P.g, gazeK:P.gk,
      legs:{L:lg(.12), R:lg(-.12)},
      arms:{mode:'custom', curl:'flat',
        L:{hand:P.hL, pole:[-1,.2,.3], rel:'world'},
        R:{hand:P.hR, pole:[-1,.2,-.3], rel:'world'}},
      world:{mat:{x:.55}},
      focus:['hams','abs','delts']
    };
  }
};

const META = {
  pushup:   {family:'upper', tempo:true, cycle:2.4, frame:{tx:-.55, ty:.40, H:1.05, W:2.0, el:18, az:36}},
  dbrow:    {family:'upper', tempo:true, cycle:2.6, frame:{tx:.05, ty:.68, H:1.5, W:1.75, el:14, az:150}},
  pullup:   {family:'upper', tempo:true, cycle:3.0, frame:{tx:0, ty:1.36, H:2.6, W:1.6, el:8, az:30}},
  ohpress:  {family:'upper', tempo:true, cycle:2.6, frame:{tx:0, ty:1.12, H:2.4, W:1.3, az:40}},
  farmer:   {family:'upper', cycle:1.1, frame:{tx:.03, ty:.97, H:2.05, W:1.3, az:40}},
  bike:     {family:'cardio', cycle:.9, frame:{tx:.08, ty:.78, H:1.75, W:1.75, el:10, az:24}},
  highknees:{family:'warmup', cycle:.7, frame:{tx:.08, ty:.97, H:2.05, W:1.3, az:38}},
  buttkicks:{family:'warmup', cycle:.7, frame:{tx:0, ty:.97, H:2.05, W:1.3, az:20}},
  legswing: {family:'warmup', cycle:1.4, frame:{tx:.15, ty:.95, H:2.0, W:1.9, az:125}},
  inchworm: {family:'warmup', cycle:5.5, frame:{tx:.66, ty:.97, H:2.05, W:2.15, el:12, az:22}}
};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
