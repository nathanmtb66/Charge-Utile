/* Charge Utile — chaîne postérieure : charnières de hanche, ischios, mollets, tibial antérieur */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;

/* ---------- rack à squat (option bar de calfraise) : deux montants et crochets en J, derrière l'athlète ---------- */
Rig.prop('post_rack', {
  make(c){ const T = c.THREE, g = new T.Group();
    for(const z of [-1, 1]){
      const add = (m, k) => { m.userData.z = z; m.userData.k = k; g.add(m); };
      add(c.mk(new T.BoxGeometry(.07, 1, .07), c.mats.mach), 'post');
      add(c.mk(new T.BoxGeometry(.10, .025, .05), c.mats.steel), 'hook');
      add(c.mk(new T.BoxGeometry(.02, .05, .05), c.mats.steel), 'lip');
      add(c.mk(new T.BoxGeometry(.6, .04, .09), c.mats.mach), 'foot');
    }
    return g; },
  update(g, s){ const zz = s.zw || .55, H = s.h, top = H + .55;
    g.position.set(s.x, 0, 0);
    for(const m of g.children){ const z = m.userData.z * zz, k = m.userData.k;
      if(k === 'hook') m.position.set(.075, H - .0125, z);
      else if(k === 'lip') m.position.set(.12, H + .01, z);
      else if(k === 'foot') m.position.set(0, .02, z);
      else { m.scale.y = top; m.position.set(0, top/2, z); } } }
});

/* ---------- aides ---------- */
const T_LINE = 1.78;                       // angle de repos de la ligne bassin → haut du dos
const SH_REST = [.025, .472, .208];        // épaule par rapport au centre du bassin (debout)
/** position de l'épaule (dos neutre, dev = 0) */
function shAt(pc, tilt, side){
  const d = (tilt - T_LINE) * D2R, x = SH_REST[0], y = SH_REST[1];
  return [pc[0] + x*Math.cos(d) + y*Math.sin(d), pc[1] - x*Math.sin(d) + y*Math.cos(d), (pc[2]||0) + (side==='L' ? SH_REST[2] : -SH_REST[2])];
}
/** hauteur du bassin pour une jambe de portée r (hanche → cheville) */
const hipY = (hx, ax, ay, r) => ay + Math.sqrt(Math.max(0, r*r - (hx-ax)*(hx-ax)));
/** pied en appui sur l'avant-pied : pivot sous la tête des métatarsiens (mx, gy),
    th = inclinaison du pied (° ; + = talon levé, − = talon qui descend sous l'appui) */
function ballFoot(mx, gy, z, th, o={}){
  const a = th*D2R, c = Math.cos(a), s = Math.sin(a);
  const px = .14, py = -.074;                       // tête des métatarsiens sous la cheville (repos)
  const ax = mx - (px*c + py*s), ay = gy - (-px*s + py*c);
  const tf = o.flex != null ? o.flex : (th > 0 ? th*.55 : th*.6);
  const out = (o.out != null ? o.out : .04) * (z > 0 ? 1 : -1);
  return {ankle:[ax, ay, z], toe:[ax + .2*c, ay - .2*s, z + out], pole:o.pole || [1,0,z>0?.25:-.25], toeFlex:tf};
}
/** genou (plan sagittal) par IK deux segments, genou vers l'avant */
function kneeAt(h, a){
  const A = .445, B = .456, dx = a[0]-h[0], dy = a[1]-h[1], d = clamp(Math.hypot(dx,dy), .02, .899);
  const ca = (A*A + d*d - B*B)/(2*A*d), sa = Math.sqrt(Math.max(0, 1-ca*ca));
  const ux = dx/Math.hypot(dx,dy), uy = dy/Math.hypot(dx,dy);
  let nx = -uy, ny = ux; if(nx < 0){ nx = -nx; ny = -ny; }
  return [h[0] + A*(ca*ux + sa*nx), h[1] + A*(ca*uy + sa*ny)];
}
/** abscisse de l'avant de la jambe à la hauteur y (surface de la cuisse / du tibia) */
function legFront(h, a, y){
  const k = kneeAt(h, a);
  if(y >= k[1]){ const f = clamp((y - k[1])/(h[1]-k[1]), 0, 1); return lerp(k[0], h[0], f) + lerp(.055, .09, f); }
  const f = clamp((k[1] - y)/(k[1]-a[1]), 0, 1); return lerp(k[0], a[0], f) + lerp(.055, .045, f);
}
/** main qui pend sous l'épaule, décalée en x de dx (bras presque tendu) */
function hang(sh, dx, L=.60){ dx = clamp(dx, -.4, .4); return [sh[0] + dx, sh[1] - Math.sqrt(L*L - dx*dx)]; }
/** symétrie droite/gauche d'une pose */
function mirror(p){
  const mz = a => Array.isArray(a) ? [a[0], a[1], -(a[2]||0)] : a;
  const leg = l => l && ({...l, ankle:mz(l.ankle), toe:mz(l.toe), pole:mz(l.pole), sole: l.sole ? mz(l.sole) : undefined});
  const q = {...p, pc:mz(p.pc), legs:{L:leg(p.legs.R), R:leg(p.legs.L)}};
  if(p.arms && p.arms.mode==='custom'){
    const arm = a => a && ({...a, hand: a.hand ? (a.rel==='sh' || a.rel==='world' ? mz(a.hand) : a.hand) : undefined, t: a.t ? [a.t[0], a.t[1], -a.t[2]] : undefined, pole:mz(a.pole)});
    q.arms = {...p.arms, L:arm(p.arms.R), R:arm(p.arms.L)};
  }
  if(p.carry) q.carry = p.carry.map(c => ({...c, at: c.at==='gripL' ? 'gripR' : c.at==='gripR' ? 'gripL' : Array.isArray(c.at) ? mz(c.at) : c.at, off: c.off ? mz(c.off) : undefined}));
  if(p.focus) q.focus = p.focus.map(f => f);
  return q;
}

/* ---------- accessoires ---------- */
// barre olympique posée au sol (disques Ø 45 cm) qui suit les mains
Rig.prop('posterior_dlbar', {
  make(c){ const T = c.THREE, g = new T.Group();
    const b = c.mk(new T.CylinderGeometry(.014,.014,2.0,12), c.mats.steel); b.rotation.x = Math.PI/2; g.add(b);
    for(const z of [-.66,.66]){
      const pl = c.mk(new T.CylinderGeometry(.225,.225,.05,48), c.mats.plate); pl.rotation.x = Math.PI/2; pl.position.z = z; g.add(pl);
      const sl = c.mk(new T.CylinderGeometry(.026,.026,.2,12), c.mats.steel); sl.rotation.x = Math.PI/2; sl.position.z = z + (z>0?.06:-.06); g.add(sl);
      const cl = c.mk(new T.CylinderGeometry(.04,.04,.03,16), c.mats.dark); cl.rotation.x = Math.PI/2; cl.position.z = z + (z>0?.045:-.045); g.add(cl);
    }
    return g; },
  update(g, s, c){ const p = c.sk.gripMid; g.position.set(s.x != null ? s.x : p.x, s.y != null ? s.y : p.y, 0); }
});
// rouleau bas qui bloque les chevilles (nordic) : deux montants + boudin en mousse
Rig.prop('posterior_anklepad', {
  make(c){ const T = c.THREE, g = new T.Group();
    for(const z of [-.29,.29]){ const up = c.mk(new T.BoxGeometry(.06,1,.04), c.mats.mach); g.add(up);
      const ft = c.mk(new T.BoxGeometry(.22,.03,.06), c.mats.mach); ft.position.set(0,.015,z); g.add(ft); up.userData.z = z; }
    const pad = c.mk(new T.CylinderGeometry(.05,.05,.52,20), c.mats.pad); pad.rotation.x = Math.PI/2; g.add(pad);
    const axl = c.mk(new T.CylinderGeometry(.012,.012,.6,10), c.mats.steel); axl.rotation.x = Math.PI/2; g.add(axl);
    return g; },
  update(g, s){ const y = s.y || .19; g.position.set(s.x, 0, s.z || 0);
    g.children.forEach(m=>{ if(m.userData.z != null){ m.scale.y = y + .03; m.position.set(0, (y+.03)/2, m.userData.z); } });
    g.children[4].position.set(0, y, 0); g.children[5].position.set(0, y, 0); }
});
// pan de mur vertical parallèle à l'athlète (appui d'une main sur le côté)
Rig.prop('posterior_sidewall', {
  make(c){ const m = new c.THREE.Mesh(new c.THREE.BoxGeometry(1,1,1), c.mats.wall); m.receiveShadow = true; m.castShadow = true; return m; },
  update(m, s){ const L = s.len || 1.2, H = s.h || 2.1, T = .1; m.scale.set(L, H, T); m.position.set(s.x || 0, H/2, s.z + (s.z > 0 ? T/2 : -T/2)); }
});

/* ======================= MOUVEMENTS ======================= */
const LIB = {

  /* ---- soulevé de terre jambes tendues (RDL) ---- */
  rdl(s, o, t){
    const load = o.load || 'bar';
    const u = sm(s)*.35 + s*.65;
    const tilt = lerp(3, 82, u);
    const hx = lerp(-.02, -.30, u);
    const r = lerp(.888, .874, u);
    const pc = [hx, hipY(hx, 0, .075, r)];
    const sh = shAt(pc, tilt, 'L');
    // charge qui glisse le long des cuisses puis des tibias (bras presque verticaux)
    const est = hang(sh, 0);
    const front = legFront(pc, [0,.075], est[1]) + (load==='bar' ? .03 : .06);
    const g = hang(sh, Math.min(front - sh[0], .08));
    const gz = load === 'bar' ? .235 : .17;
    const grip = side => ({hand:[g[0], g[1], side==='L' ? gz : -gz], pole: load==='bar' ? [-.3,0,side==='L'?1:-1] : [-1,0,side==='L'?.4:-.4], rel:'world'});
    return {
      pc, tilt, dev:{}, gaze:[pc[0] + 1.6, 0], gazeK:.12,
      legs:{L:foot(0,.075,.13,{dz:.03,pole:[1,0,.2]}), R:foot(0,.075,-.13,{dz:-.03,pole:[1,0,-.2]})},
      arms:{mode:'custom', curl:'grip', L:grip('L'), R:grip('R')},
      carry: load==='bar' ? [{type:'bar', at:'gripMid', axis:'z'}] : [{type:'db', at:'gripL', axis:'z'}, {type:'db', at:'gripR', axis:'z'}],
      focus:['hams','glutes','lowback']
    };
  },

  /* ---- RDL une jambe (appui gauche ; o.side:'R' = appui droit) ---- */
  slrdl(s, o, t){
    const load = o.load || 'db';
    const u = sm(s)*.3 + s*.7;
    const tilt = lerp(4, 84, u);
    const pz = .05, az = .115;                       // bassin décalé au-dessus du pied d'appui
    const hx = lerp(-.02, -.09, u);
    const pc = [hx, hipY(hx, 0, .075, lerp(.886, .872, u)), pz];
    const sway = Math.sin((t||0)*1.7)*.004;
    pc[0] += sway;
    // jambe libre : dans le prolongement du buste en bas
    const a = lerp(9, tilt + 2, sm(u)) * D2R, lr = lerp(.80, .885, u);
    const hipR = [pc[0], pc[1], pz - .113];
    const ank = [hipR[0] - lr*Math.sin(a), hipR[1] - lr*Math.cos(a), -.065];
    const fa = a + lerp(25, 8, u)*D2R;                // pied relâché, pointe vers le sol
    const legR = {ankle:ank, toe:[ank[0] + .2*Math.cos(fa), ank[1] - .2*Math.sin(fa), -.08], pole:[Math.cos(a)*.3, -Math.sin(a), 0].map((v,i)=> i===0 ? v + .05 : v), toeFlex:0};
    const sh = shAt(pc, tilt, 'L');
    const g = hang(sh, lerp(.05, .03, u), load==='none' ? .615 : .60);
    const reach = load==='none' ? lerp(0, .06, u) : 0;
    const armL = {hand:[g[0] + reach, g[1], sh[2] + lerp(.05, .0, u)], pole:[-1,0,.3], rel:'world'};
    const armR = {hand:[g[0] + reach, g[1], -sh[2] + (load==='db' ? .05 : -lerp(.05,0,u)) + pz*2 - pz*2], pole:[-1,.1,-.2], rel:'world', curl: load==='db' ? 'grip' : 'loose'};
    armR.hand[2] = pz - .208 + (load==='db' ? .06 : -lerp(.05, 0, u));
    armL.hand[2] = pz + .208 + lerp(.05, .0, u);
    const p = {
      pc, tilt, dev:{}, gaze:[pc[0] + 1.5, 0], gazeK:.15,
      legs:{L:foot(0,.075,az,{dz:.03,pole:[1,0,.15]}), R:legR},
      arms:{mode:'custom', curl:'loose', L:armL, R:armR},
      carry: load==='db' ? [{type:'db', at:'gripR', axis:[1,0,0]}] : [],
      focus:['hams','glutes','lowback']
    };
    return o.side === 'R' ? mirror(p) : p;
  },

  /* ---- soulevé de terre depuis le sol (s = 1 : barre au sol) ---- */
  deadlift(s, o, t){
    // clés : buste, abscisse du bassin, hauteur de barre (le bassin se déduit de la longueur des bras)
    const F = [
      {u:0,   tilt:0,  hx:-.035, by:.85},
      {u:.45, tilt:52, hx:-.30,  by:.50},
      {u:1,   tilt:62, hx:-.335, by:.225}
    ];
    const k = kf(F, s);
    const A = [-.08, .075], d = (k.tilt - T_LINE)*D2R;
    const offx = SH_REST[0]*Math.cos(d) + SH_REST[1]*Math.sin(d), offy = -SH_REST[0]*Math.sin(d) + SH_REST[1]*Math.cos(d);
    const shx = k.hx + offx;
    let bx = .045, pc = [k.hx, .9];
    for(let i=0; i<3; i++){
      const dx = clamp(shx - bx, -.3, .3);
      pc = [k.hx, k.by + Math.sqrt(.36 - dx*dx) - offy];
      if(Math.hypot(pc[0]-A[0], pc[1]-A[1]) > .893) pc[1] = hipY(pc[0], A[0], A[1], .893);
      bx = Math.max(.045, legFront(pc, A, k.by) + .03);
    }
    const by = Math.max(k.by, .225);
    return {
      pc, tilt:k.tilt, dev:{thlow:-3*s, thup:-5*s}, gaze:[pc[0] + 1.7, 0], gazeK:.12,
      legs:{L:foot(A[0],.075,.14,{dz:.04,pole:[1,0,.35]}), R:foot(A[0],.075,-.14,{dz:-.04,pole:[1,0,-.35]})},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[bx, by, .235], pole:[-.3,0,1], rel:'world'},
        R:{hand:[bx, by, -.235], pole:[-.3,0,-1], rel:'world'}},
      world:{posterior_dlbar:{}},
      focus:['glutes','hams','lowback','quads']
    };
  },

  /* ---- kettlebell swing (russe) ---- */
  kbswing(s, o, t){
    const F = [
      {u:0,   tilt:-3, hx:-.02, r:.892, phi:84},
      {u:.14, tilt:-2, hx:-.02, r:.892, phi:58},
      {u:.29, tilt:4,  hx:-.03, r:.888, phi:14},
      {u:.41, tilt:44, hx:-.20, r:.868, phi:-12},
      {u:.51, tilt:64, hx:-.29, r:.858, phi:-30, hold:true},
      {u:.62, tilt:40, hx:-.18, r:.866, phi:-8},
      {u:.76, tilt:-1, hx:-.02, r:.892, phi:48},
      {u:1,   tilt:-3, hx:-.02, r:.892, phi:84}
    ];
    const k = kf(F, s);
    const pc = [k.hx, hipY(k.hx, 0, .075, k.r)];
    const sh = shAt(pc, k.tilt, 'L');
    const Lp = .574, ph = k.phi*D2R;
    const gx = sh[0] + Lp*Math.sin(ph), gy = sh[1] - Lp*Math.cos(ph);
    return {
      pc, tilt:k.tilt, dev:{}, gaze:[pc[0] + 2.4, lerp(.9, 0, clamp(k.tilt/60,0,1))], gazeK:.3,
      legs:{L:foot(0,.075,.19,{dz:.07,pole:[1,0,.45]}), R:foot(0,.075,-.19,{dz:-.07,pole:[1,0,-.45]})},
      arms:{mode:'custom', curl:'grip',
        L:{hand:[gx, gy, .035], pole:[-.4,0,1], rel:'world'},
        R:{hand:[gx, gy, -.035], pole:[-.4,0,-1], rel:'world'}},
      carry:[{type:'kb', at:'gripMid', axis:'grip', up:[-Math.sin(ph), Math.cos(ph), 0]}],
      focus:['glutes','hams','lowback'],
      phase: s < .51 ? 0 : s < .76 ? 2 : 3
    };
  },

  /* ---- nordic hamstring curl ---- */
  nordic(s, o, t){
    const K = [0, .085], ank = [-.452, .09];
    const catchK = sm((s - .7)/.3);
    const a = lerp(0, 64, sm(s)*.25 + s*.75) + 10*catchK;
    const hip = [K[0] + .445*Math.sin(a*D2R), K[1] + .445*Math.cos(a*D2R)];
    const tilt = a + 2;
    const uT = [Math.sin(tilt*D2R), Math.cos(tilt*D2R)], fT = [Math.cos(tilt*D2R), -Math.sin(tilt*D2R)];
    const S3 = [hip[0] + .018*uT[1] + .579*uT[0], hip[1] - .018*uT[0] + .579*uT[1]];
    const sh = shAt(hip, tilt, 'L');
    const arm = side => {
      const sz = side==='L' ? 1 : -1;
      const chest = [S3[0] - .16*uT[0] + .30*fT[0], S3[1] - .16*uT[1] + .30*fT[1], .15*sz];
      const floor = [sh[0] + .16, .03, .24*sz];
      const p = [0,1,2].map(i => lerp(chest[i], floor[i], catchK));
      return {hand:p, pole:[lerp(-.3,-.2,catchK), -1, .6*sz], rel:'world', curl: catchK > .5 ? 'flat' : 'loose'};
    };
    const lg = z => ({ankle:[ank[0], ank[1], z], toe:[ank[0] - .19, .035, z], pole:[1,-1,0], toeFlex:-10});
    return {
      pc:hip, tilt, dev:{lum:-2}, gaze:[hip[0] + 1.6, 0], gazeK:.35,
      legs:{L:lg(.1), R:lg(-.1)},
      arms:{mode:'custom', curl:'loose', L:arm('L'), R:arm('R')},
      world:{mat:{x:.25}, posterior_anklepad:{x:-.40, y:.19}},
      focus:['hams','glutes'],
      phase: s > .95 ? 1 : undefined
    };
  },

  /* ---- montées sur pointes deux pieds (s = 0 : sur pointes ; s = 1 : talons en bas) ---- */
  calfraise(s, o, t){
    const step = !!o.step, H = step ? .15 : 0;
    const th = lerp(30, step ? -30 : 0, s);
    const mx = .14;
    const L = ballFoot(mx, H, .12, th), R = ballFoot(mx, H, -.12, th);
    const ay = L.ankle[1];
    const pc = [L.ankle[0] - .02 + lerp(.02, 0, s)*0, ay + .882];
    return {
      pc, tilt:1, dev:{}, gaze:[3, 1.4 + H], gazeK:.4,
      legs:{L, R},
      arms:{mode: o.bar ? 'backBar' : o.load==='db' ? 'sides' : 'hips'},
      world: step ? {step:{x:mx - .03 + .2, h:H, d:.4, w:.9}} : o.bar ? {post_rack:{x:-.50, h:1.30, zw:.55}} : {},
      focus:['calves']
    };
  },

  /* ---- montée sur pointe une jambe sur une marche (appui gauche, main droite au mur) ---- */
  slcalf(s, o, t){
    const H = .15, mx = .14, pz = .05;
    const th = lerp(30, -30, s);
    const L = ballFoot(mx, H, .105, th);
    const pc = [L.ankle[0] - .03, L.ankle[1] + .882, pz];
    const sh = shAt(pc, 1, 'L');
    const hipR = [pc[0], pc[1], pz - .113];
    const ankR = [hipR[0] - .30, hipR[1] - .50, -.06];
    const wallZ = -.60;
    const p = {
      pc, tilt:1, dev:{}, gaze:[3, 1.5 + H], gazeK:.4,
      legs:{L, R:{ankle:ankR, toe:[ankR[0] - .09, ankR[1] - .18, -.07], pole:[1,0,-.1], toeFlex:0}},
      arms:{mode:'custom', curl:'loose',
        L:{hand:[pc[0] + .04, pc[1] + .09, pz + .20], pole:[-.6,0,1], rel:'world', curl:'loose'},
        R:{hand:[sh[0] + .13, sh[1] - .03, wallZ + .025], pole:[0,-1,0], rel:'world', curl:'flat'}},
      world:{step:{x:mx - .03 + .2, h:H, d:.4, w:.7}, posterior_sidewall:{x:.1, z:wallZ, len:1.3}},
      focus:['calves']
    };
    return o.side === 'R' ? mirror({...p, world:{...p.world, posterior_sidewall:{x:.1, z:-wallZ, len:1.3}}}) : p;
  },

  /* ---- relevés de pointes dos au mur ---- */
  tibraise(s, o, t){
    const k = sm(osc(s));
    const W = -.36;
    const phi = 32*k*D2R;
    const ay = .075 + .02*k, ax = -.012*k;
    const hx = -.225, hy = hipY(hx, ax, ay, .886);
    const pc = [hx, hy];
    const lg = z => ({ankle:[ax, ay, z], toe:[ax + .2*Math.cos(phi), ay + .2*Math.sin(phi), z + (z>0?.03:-.03)], pole:[1,0,z>0?.2:-.2], toeFlex:6*k});
    return {
      pc, tilt:-1.5, dev:{thup:1.5}, gaze:[1.5, 0], gazeK:.35,
      legs:{L:lg(.12), R:lg(-.12)},
      arms:{mode:'custom', curl:'loose',
        L:{hand:[.03, -.60, .05], pole:[-1,0,.2], rel:'sh'},
        R:{hand:[.03, -.60, -.05], pole:[-1,0,-.2], rel:'sh'}},
      world:{wall:{x:W}},
      focus:['shins'],
      phase: s < .5 ? 2 : 3
    };
  },

  /* ---- good morning (barre sur le dos) ---- */
  goodmorning(s, o, t){
    const u = sm(s)*.35 + s*.65;
    const tilt = lerp(2, 76, u);
    const hx = lerp(-.02, -.27, u);
    const pc = [hx, hipY(hx, 0, .075, lerp(.888, .872, u))];
    return {
      pc, tilt, dev:{}, gaze:[pc[0] + 1.8, 0], gazeK:.15,
      legs:{L:foot(0,.075,.14,{dz:.03,pole:[1,0,.2]}), R:foot(0,.075,-.14,{dz:-.03,pole:[1,0,-.2]})},
      arms:{mode:'backBar'},
      focus:['hams','glutes','lowback']
    };
  },
};

const META = {
  rdl:{family:'hinge', tempo:true, cycle:3.2, frame:{tx:.02,ty:.85,H:1.95,W:1.7,el:10,az:28}},
  slrdl:{family:'hinge', tempo:true, cycle:3.6, frame:{tx:-.2,ty:.85,H:1.95,W:1.9,el:10,az:24}},
  deadlift:{family:'hinge', tempo:true, cycle:3.2, frame:{tx:0,ty:.85,H:1.95,W:1.9,el:10,az:30}},
  kbswing:{family:'hinge', cycle:1.3, frame:{tx:.05,ty:.88,H:2.0,W:1.8,el:10,az:24}},
  nordic:{family:'hinge', tempo:true, cycle:4.5, frame:{tx:.2,ty:.5,H:1.3,W:2.1,el:14,az:22}},
  calfraise:{family:'calf', tempo:true, cycle:2.4, frame:o => o.bar ? {tx:-.12,ty:1.0,H:2.2,W:1.75,el:10,az:32} : {tx:.02,ty:.95,H:2.1,W:1.3,el:8,az:38}},
  slcalf:{family:'calf', tempo:true, cycle:2.6, frame:{tx:.02,ty:1.05,H:2.2,W:1.5,el:8,az:62}},
  tibraise:{family:'calf', cycle:1.6, frame:{tx:-.12,ty:.9,H:2.05,W:1.4,el:8,az:48}},
  goodmorning:{family:'hinge', tempo:true, cycle:3.2, frame:{tx:.0,ty:.9,H:1.95,W:1.8,el:12,az:45}},
};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
