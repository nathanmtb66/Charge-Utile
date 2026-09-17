/* Charge Utile — mouvements de base (séance Pliométrie) */
(function(){
const {V, lerp, clamp, sm, bump, osc, foot, hand, D2R} = Rig.util;
const kf = Rig.kf;
const LIB = {
    /* ---- squats ---- */
    squat(s, o){
      const hold = o.hold || 'goblet';
      const deep = hold==='backBar' ? 42 : hold==='frontBar' ? 24 : 40;
      return {
        pc:[lerp(-.01, hold==='backBar'?-.24: hold==='frontBar'?-.15:-.21, s), lerp(.955,.49,s)], tilt: lerp(1, deep, s), dev:{pel:lerp(0,4,s)},
        gaze:[2.6,.55], gazeK:.65,
        legs:{L:foot(0,.075,.16,{dz:.05,pole:[1,0,.5]}), R:foot(0,.075,-.16,{dz:-.05,pole:[1,0,-.5]})},
        arms:{mode: hold}, focus:['quads','glutes']
      };
    },
    /* ---- fente bulgare ---- */
    split(s, o){
      const floor = !!o.rearFloor;
      return {
        pc:[lerp(-.07,-.10,s), lerp(.82,.53,s)], tilt: lerp(8,17,s), dev:{},
        gaze:[2.6,.45], gazeK:.7,
        legs:{
          L:foot(.32,.075,.11,{dz:.02,pole:[1,0,.15]}),
          R: floor ? {ankle:[-.62,.16,-.11], toe:[-.49,.02,-.11], pole:[.4,-1,0], toeFlex:55}
                   : {ankle:[-.55,.545,-.11], toe:[-.74,.52,-.11], pole:[.4,-1,0]}},
        arms:{mode: o.noLoad ? 'hips' : 'sides'},
        world:{bench: floor ? null : {x0:-.98,x1:-.46,h:.5,z:-.11,w:.34}},
        focus:['quadsL','glutes']
      };
    },
    /* ---- hip thrust / pont ---- */
    thrust(s, o, t){
      const floor = !!o.floor, load = o.load || (floor ? 'none' : 'bar');
      const Q = floor ? [-.47,.13] : [-.44,.535];
      const L = .36;
      let side = null, s2 = s;
      if(o.single){ side = s < .5 ? 'L' : 'R'; s2 = 1 - bump(s < .5 ? s*2 : s*2-1, .5, .5); }
      const a = (floor ? lerp(30,4,s2) : lerp(0,-40,s2)) * D2R;
      const pc = [Q[0] + L*Math.cos(a), Q[1] + L*Math.sin(a)];
      const tilt = Math.atan2(Q[0]-pc[0], Q[1]-pc[1]) / D2R;
      const ax = floor ? .30 : .40;
      const legs = {L:foot(ax,.075,.16,{pole:[.2,1,.35]}), R:foot(ax,.075,-.16,{pole:[.2,1,-.35]})};
      if(side){ // jambe libre tendue dans le prolongement de la cuisse
        const other = side==='L' ? 'R' : 'L', sz = other==='L' ? 1 : -1;
        const hy = pc[1];
        legs[other] = {ankle:[pc[0]+.86, hy + lerp(.28,.08,s2), .12*sz], toe:[pc[0]+1.0, hy + lerp(.36,.2,s2), .12*sz], pole:[0,1,.2*sz], toeFlex:0};
      }
      return {
        pc, tilt, dev:{lum:-4, thup:6}, gaze:'knees', gazeK:.9,
        legs, arms:{mode: load==='bar' ? 'bar' : load==='db' ? 'hipdb' : floor ? 'floor' : 'hips'},
        world:{bench: floor ? null : {x0:-1.02,x1:-.42,h:.42,z:0,w:.44}, mat: floor},
        focus:['glutes','hams'], phase: o.single ? (s2 > .5 ? 0 : 3) : undefined
      };
    },
    /* ---- gainages ---- */
    plank(s, o, t){
      const br = Math.sin((t||0)*2.2)*.004;
      if(o.hands) return {
        pc:[-.30,.505+br], tilt:71, dev:{}, gaze:'floorAhead', gazeK:.8,
        legs:{L:{ankle:[-1.10,.16,.09], toe:[-1.05,.02,.09], pole:[0,-1,0], toeFlex:70}, R:{ankle:[-1.10,.16,-.09], toe:[-1.05,.02,-.09], pole:[0,-1,0], toeFlex:70}},
        arms:{mode:'plankHands'}, world:{mat:true}, focus:['abs','obliques']
      };
      return {
        pc:[-.26,.365+br], tilt:87, dev:{}, gaze:'floorAhead', gazeK:.8,
        legs:{L:{ankle:[-1.13,.16,.09], toe:[-1.08,.02,.09], pole:[0,-1,0], toeFlex:70}, R:{ankle:[-1.13,.16,-.09], toe:[-1.08,.02,-.09], pole:[0,-1,0], toeFlex:70}},
        arms:{mode:'plank'}, world:{mat:true}, focus:['abs','obliques']
      };
    },
    sideplank(s, o, t){ // gainage latéral sur l'avant-bras droit, bras gauche qui passe sous le buste
      const u = s, reach = sm(bump(u, .5, .5));
      return {
        pc:[0,.955], tilt:0, dev:{}, gaze:[3,1.5], gazeK:.4,
        legs:{L:{ankle:[.01,.075,.075], toe:[.2,.075,.075], pole:[1,0,.1]}, R:{ankle:[-.01,.075,-.07], toe:[.18,.075,-.07], pole:[1,0,-.1]}},
        arms:{mode:'custom', hold:'plate', curl:'grip',
          L: hand(lerp(.04,.36,reach), lerp(.22,-.32,reach), lerp(.58,-.30,reach), [-.3,-.2,.6]),
          R: {hand:[.27,-.12,-.29], pole:[0,-.34,-.94], rel:'sh', curl:'flat'}},
        root:{axis:'x', fit:['elR','ankleR'], range:[-89,-50], floor:{elR:.05}},
        world:{mat:{x:.1, z:-.85, rot:90}}, focus:['obliques','abs']
      };
    },
    /* ---- ballon suisse ---- */
    ballkneel(s, o, t){
      const sway = Math.sin((t||0)*1.3)*.012, rotA = Math.sin(s*Math.PI*2) * 38 * D2R;
      const r = .5;
      return {
        pc:[.0+sway,1.12], tilt:3, dev:{}, gaze:[3,1.2], gazeK:.6,
        legs:{L:{ankle:[-.40,.53,.12], toe:[-.55,.48,.12], pole:[1,.1,.1]}, R:{ankle:[-.40,.53,-.12], toe:[-.55,.48,-.12], pole:[1,.1,-.1]}},
        arms:{mode:'custom', hold:'plate', curl:'grip',
          L: hand(r*Math.cos(rotA), -.12, r*Math.sin(rotA) - .17 + .06, [-.2,-1,.4]),
          R: hand(r*Math.cos(rotA), -.12, r*Math.sin(rotA) + .17 - .06, [-.2,-1,-.4])},
        world:{ball:{x:.02,z:0,r:.33, roll: sway*3}},
        focus:['abs','obliques']
      };
    },
    pullover(s, o){
      const Q = [-.46,.735], L = .36;
      const pc = [Q[0]+L, Q[1]-.02];
      const tilt = Math.atan2(Q[0]-pc[0], Q[1]-pc[1]) / D2R;
      return {
        pc, tilt, dev:{lum:-3, thup:4}, gaze:'up', gazeK:.9,
        legs:{L:foot(.40,.075,.17,{pole:[.2,1,.3]}), R:foot(.40,.075,-.17,{pole:[.2,1,-.3]})},
        arms:{mode:'custom', hold:'dbv', curl:'grip', frame:'torso',
          L: {t:[lerp(.02,.52,s), lerp(.58,.12,s), .06], pole:[-.6,.5,1], rel:'torso'},
          R: {t:[lerp(.02,.52,s), lerp(.58,.12,s), -.06], pole:[-.6,.5,-1], rel:'torso'}},
        world:{ball:{x:-.46,z:0,r:.33}},
        focus:['lats','pecs']
      };
    },
    /* ---- plio ---- */
    boxjump(s, o){
      const H = o.h || .5, bx = .62, top = H + .075;
      const F = [
        {u:0,   pc:[-.01,.955], tilt:2,  aL:[0,.075,.14], aR:[0,.075,-.14], dy:0,   flex:0, h:[.0,-.6,.05], hp:[-1,0,.2]},
        {u:.2,  pc:[-.15,.66],  tilt:36, aL:[0,.075,.14], aR:[0,.075,-.14], dy:0,   flex:0, h:[-.36,-.42,.05], hp:[-1,-.2,.2]},
        {u:.3,  pc:[.02,1.03],  tilt:6,  aL:[.03,.14,.14], aR:[.03,.14,-.14], dy:-.12, flex:25, h:[.32,.42,.05], hp:[-.3,-1,.2]},
        {u:.42, pc:[.30,1.28],  tilt:26, aL:[.40,.82,.14], aR:[.40,.82,-.14], dy:-.08, flex:10, h:[.48,.05,.05], hp:[0,-1,.3]},
        {u:.52, pc:[.47,1.10],  tilt:34, aL:[bx,top,.14], aR:[bx,top,-.14], dy:0, flex:0, h:[.5,-.1,.05], hp:[0,-1,.3]},
        {u:.68, pc:[bx-.01,top+.88], tilt:3, aL:[bx,top,.14], aR:[bx,top,-.14], dy:0, flex:0, h:[0,-.6,.05], hp:[-1,0,.2]},
        {u:.8,  pc:[bx-.12,top+.84], tilt:5, aL:[bx,top,.14], aR:[bx-.3,top-.1,-.14], dy:0, flex:0, h:[0,-.6,.05], hp:[-1,0,.2]},
        {u:.9,  pc:[.2,.97], tilt:4, aL:[bx-.05,top,.14], aR:[0,.075,-.14], dy:0, flex:0, h:[0,-.6,.05], hp:[-1,0,.2]},
        {u:1,   pc:[-.01,.955], tilt:2,  aL:[0,.075,.14], aR:[0,.075,-.14], dy:0, flex:0, h:[.0,-.6,.05], hp:[-1,0,.2]}
      ];
      const k = kf(F, s);
      const ft = (a) => ({ankle:a, toe:[a[0]+.2, a[1]+k.dy, a[2]+(a[2]>0?.03:-.03)], pole:[1,0,a[2]>0?.35:-.35], toeFlex:k.flex});
      return {
        pc:k.pc, tilt:k.tilt, dev:{}, gaze:[2.6,.6], gazeK:.6,
        legs:{L:ft(k.aL), R:ft(k.aR)},
        arms:{mode:'custom', curl:'loose', L:hand(k.h[0],k.h[1],k.h[2],k.hp), R:hand(k.h[0],k.h[1],-k.h[2],[k.hp[0],k.hp[1],-k.hp[2]])},
        world:{box:{x:bx+.03, z:0, h:H, w:.5, d:.5}},
        focus:['quads','glutes','calves'], phase: s < .3 ? 0 : s < .52 ? 2 : 3
      };
    },
    deathjump(s, o){ // triple death jump : pas dans le vide → contact bref → box → pas dans le vide → réception unipodale tenue sur demi-swissball
      const B1 = .40, B2 = .50, x1 = -.62, x2 = .72, xb = 1.62;
      const F = [
        {u:0,    pc:[x1,B1+.95],      tilt:2,  aL:[x1+.02,B1+.075,.13], aR:[x1+.02,B1+.075,-.13], dy:0,    flex:0,  h:[0,-.6,.05]},
        {u:.07,  pc:[x1+.22,B1+.93],  tilt:4,  aL:[x1+.35,B1+.12,.13],  aR:[x1+.1,B1+.075,-.13],  dy:-.05, flex:0,  h:[-.1,-.55,.1]},
        {u:.135, pc:[-.02,.99],       tilt:6,  aL:[.0,.15,.14],        aR:[.0,.15,-.14],         dy:-.1,  flex:30, h:[-.25,-.45,.08]},
        {u:.155, pc:[-.05,.86],       tilt:14, aL:[0,.09,.14],         aR:[0,.09,-.14],          dy:-.06, flex:35, h:[-.30,-.42,.08], hold:false},
        {u:.175, pc:[.02,1.03],       tilt:6,  aL:[.04,.16,.14],       aR:[.04,.16,-.14],        dy:-.12, flex:25, h:[.32,.42,.05]},
        {u:.26,  pc:[.38,1.30],       tilt:24, aL:[.48,.86,.14],       aR:[.48,.86,-.14],        dy:-.08, flex:10, h:[.48,.05,.05]},
        {u:.33,  pc:[x2-.14,B2+.64],  tilt:34, aL:[x2,B2+.075,.14],    aR:[x2,B2+.075,-.14],     dy:0,    flex:0,  h:[.5,-.1,.05]},
        {u:.42,  pc:[x2,B2+.95],      tilt:3,  aL:[x2,B2+.075,.14],    aR:[x2,B2+.075,-.14],     dy:0,    flex:0,  h:[0,-.6,.05]},
        {u:.48,  pc:[x2+.25,B2+.93],  tilt:5,  aL:[x2+.12,B2+.075,.13], aR:[x2+.42,B2+.12,-.13],  dy:-.05, flex:0,  h:[-.1,-.5,.15]},
        {u:.56,  pc:[xb-.14,1.05],    tilt:12, aL:[xb-.12,.28,.08],    aR:[xb-.40,.55,-.14],     dy:-.08, flex:10, h:[.15,-.35,.3]},
        {u:.60,  pc:[xb-.14,.95],     tilt:30, aL:[xb-.12,.30,.08],    aR:[xb-.42,.52,-.14],     dy:0,    flex:0,  h:[.25,-.25,.32]},
        {u:.66,  pc:[xb-.10,1.00],    tilt:24, aL:[xb-.10,.30,.08],    aR:[xb-.36,.50,-.14],     dy:0,    flex:0,  h:[.22,-.2,.34]},
        {u:1,    pc:[xb-.10,1.00],    tilt:24, aL:[xb-.10,.30,.08],    aR:[xb-.36,.50,-.14],     dy:0,    flex:0,  h:[.22,-.2,.34]}
      ];
      const k = kf(F, s);
      const ft = (a, lifted) => ({ankle:a, toe:[a[0]+.2, a[1]+k.dy + (lifted ? -.05 : 0), a[2]+(a[2]>0?.03:-.03)], pole:[1,0,a[2]>0?.35:-.35], toeFlex:k.flex});
      const wob = s > .66 ? Math.sin(s*60)*.004 : 0;   // micro-rééquilibrages pendant la tenue
      return {
        pc:[k.pc[0]+wob, k.pc[1]], tilt:k.tilt, dev:{}, gaze:[k.pc[0]+2.2,.4], gazeK:.6,
        legs:{L:ft(k.aL), R:ft(k.aR, s>.45)},
        arms:{mode:'custom', curl:'loose', L:hand(k.h[0],k.h[1],k.h[2],[-.5,-1,.3]), R:hand(k.h[0],k.h[1],-k.h[2],[-.5,-1,-.3])},
        world:{box:{x:x1, z:0, h:B1, w:.5, d:.5}, box2:{x:x2+.02, z:0, h:B2, w:.5, d:.5}, bosu:{x:xb-.1, z:.05, r:.3}},
        focus:['quads','glutes','calves'],
        phase: s < .155 ? 0 : s < .18 ? 1 : s < .6 ? 2 : 3,
        label: s >= .13 && s < .18 ? 'Contact court !' : s >= .6 ? 'Tiens 2 s' : null
      };
    },
    /* ---- cardio ---- */
    sprint(s, o){ // sprint sur place : buste penché, talon qui remonte sous la fesse, genou qui pousse devant, appui avant-pied
      const LEG = [
        {u:0,   a:[.06,.105], t:[.25,.02], f:35},
        {u:.28, a:[-.06,.15], t:[.13,.02], f:55},
        {u:.42, a:[-.24,.36], t:[-.08,.30], f:10},
        {u:.58, a:[-.06,.52], t:[.10,.40], f:5},
        {u:.74, a:[.20,.40],  t:[.38,.33], f:5},
        {u:.88, a:[.14,.17],  t:[.33,.09], f:20},
        {u:1,   a:[.06,.105], t:[.25,.02], f:35}
      ];
      const leg = (ph, z) => { const k = kf(LEG, ph); return {ankle:[k.a[0], k.a[1], z], toe:[k.t[0], k.t[1], z + (z>0?.02:-.02)], pole:[1,0,z>0?.12:-.12], toeFlex:k.f}; };
      // bras : coude à 90°, main du menton à la hanche, en opposition avec les jambes
      const ARM = [{u:0, h:[.27,-.02], p:[-1,-.6]}, {u:.5, h:[-.20,-.46], p:[-.2,-1]}, {u:1, h:[.27,-.02], p:[-1,-.6]}];
      const arm = (ph, z) => { const k = kf(ARM, ph); return hand(k.h[0], k.h[1], z, [k.p[0], k.p[1], z>0?.06:-.06]); };
      const phL = s % 1, phR = (s + .5) % 1;
      const bounce = .018*Math.cos(s*Math.PI*4);
      return {
        pc:[.02, .965 + bounce], tilt:13, dev:{thup:2}, gaze:[3,1.1], gazeK:.5,
        legs:{L:leg(phL,.1), R:leg(phR,-.1)},
        arms:{mode:'custom', curl:'fist', L:arm(phR, -.02), R:arm(phL, .02)},
        focus:['quads','hams','calves','glutes']
      };
    },
    treadmill(s, o){
      const deck = .16;
      const g = (ph, z) => { // phase de foulée
        const st = ph < .55; // appui
        const x = st ? lerp(.26,-.30, ph/.55) : lerp(-.30,.26, sm((ph-.55)/.45));
        const y = st ? deck+.075 : deck + .075 + Math.sin((ph-.55)/.45*Math.PI)*.26;
        return {ankle:[x, y, z], toe:[x+.2, y - (st ? 0 : .06), z], pole:[1,0,z>0?.15:-.15], toeFlex:0};
      };
      const sw = Math.sin(s*Math.PI*2);
      return {
        pc:[-.02, deck + .93 + .02*Math.cos(s*Math.PI*4)], tilt:6, dev:{}, gaze:[3,1.3], gazeK:.5,
        legs:{L:g(s%1, .1), R:g((s+.5)%1, -.1)},
        arms:{mode:'custom', curl:'loose', L:hand(lerp(-.1,.2,(sw+1)/2), -.36, .08, [-1,-.3,.1]), R:hand(lerp(-.1,.2,(1-sw)/2), -.36, -.08, [-1,-.3,-.1])},
        world:{treadmill:{belt: s}},
        focus:['quads','calves']
      };
    },
    rower(s, o){
      const F = [
        {u:0,   seat:.02, tilt:24, hx:.64, hy:.80},
        {u:.18, seat:-.30, tilt:14, hx:.40, hy:.80},
        {u:.34, seat:-.56, tilt:-20, hx:-.20, hy:.95},
        {u:.5,  seat:-.56, tilt:-18, hx:.05, hy:.86},
        {u:.66, seat:-.52, tilt:18, hx:.52, hy:.80},
        {u:1,   seat:.02, tilt:24, hx:.64, hy:.80}
      ];
      const k = kf(F, s);
      const hx = k.hx + (k.hx < .1 ? k.seat + .45 : 0);
      return {
        pc:[k.seat, .50], tilt:k.tilt, dev:{}, gaze:[3,1.1], gazeK:.6,
        legs:{L:{ankle:[.64,.36,.12], toe:[.76,.50,.13], pole:[0,1,.3], toeFlex:0}, R:{ankle:[.64,.36,-.12], toe:[.76,.50,-.13], pole:[0,1,-.3], toeFlex:0}},
        arms:{mode:'custom', curl:'grip', hold:'handle', L:hand(hx, k.hy, .1, [-.3,.2,1], 'world'), R:hand(hx, k.hy, -.1, [-.3,.2,-1], 'world')},
        world:{rower:{seat:k.seat}},
        focus:['quads','glutes','lats']
      };
    },
    skierg(s, o){
      const F = [
        {u:0,   pc:[-.02,.95], tilt:0,  h:[.36,1.92]},
        {u:.38, pc:[-.13,.84], tilt:38, h:[.24,.70]},
        {u:.5,  pc:[-.12,.85], tilt:36, h:[.14,.66]},
        {u:1,   pc:[-.02,.95], tilt:0,  h:[.36,1.92]}
      ];
      const k = kf(F, s);
      return {
        pc:k.pc, tilt:k.tilt, dev:{}, gaze:[3,1.0], gazeK:.5,
        legs:{L:foot(0,.075,.16), R:foot(0,.075,-.16)},
        arms:{mode:'custom', curl:'grip', hold:'cords', L:hand(k.h[0], k.h[1], .2, [-1,-.2,.5], 'world'), R:hand(k.h[0], k.h[1], -.2, [-1,-.2,-.5], 'world')},
        world:{skierg:true},
        focus:['lats','abs','triceps']
      };
    },
    jack(s, o){ // jumping jack : bras qui montent sur le côté jusqu'à presque se toucher au-dessus de la tête
      const k = sm(bump(s, .5, .5)), hop = Math.max(0, Math.sin(s*Math.PI*4)) * .035;
      const zf = lerp(.12, .42, k);
      const yf = .075 + hop;
      const L = .60, a = lerp(12, 196, k) * D2R;                  // angle d'abduction dans le plan frontal
      const arm = sz => hand(.04 + .03*Math.sin(a), -L*Math.cos(a), L*Math.sin(a)*sz, [.6, -.2*Math.cos(a), -.3*sz]);
      return {
        pc:[-.01, lerp(.955, .905, k) + hop], tilt:1, dev:{}, gaze:[3,1.5], gazeK:.4,
        legs:{L:{ankle:[0,yf,zf], toe:[.19,yf-hop*.6,zf+.06], pole:[1,0,.4], toeFlex:0}, R:{ankle:[0,yf,-zf], toe:[.19,yf-hop*.6,-zf-.06], pole:[1,0,-.4], toeFlex:0}},
        arms:{mode:'custom', curl:'flat', roll:lerp(0, 70, k), L: arm(1), R: arm(-1)},
        focus:['calves','delts']
      };
    },
    crossbody(s, o){ // montée de genou croisée en gainage sur les mains
      const kL = bump(s, .25, .45), kR = bump(s, .75, .45);
      const leg = (k, z, side) => ({ankle:[lerp(-1.10,-.52,k), lerp(.16,.30,k), lerp(z, -z*.9, k)], toe:[lerp(-1.05,-.40,k), lerp(.02,.24,k), lerp(z, -z*.9, k)], pole:[lerp(0,.8,k),-1,lerp(0,-z*4,k)], toeFlex:lerp(70,10,k)});
      return {
        pc:[-.30,.505 + .03*(kL+kR)], tilt:71, dev:{}, gaze:'floorAhead', gazeK:.8,
        legs:{L:leg(kL,.09), R:leg(kR,-.09)},
        arms:{mode:'plankHands'}, world:{mat:true}, focus:['abs','obliques']
      };
    }
  
};
const META = {
  squat:{family:'squat', tempo:true, cycle:3, frame:o => ({tx:-.04,ty:.88,H:2.05,W:1.5,az: o.hold==='backBar' ? -38 : 36})},
  split:{family:'lunge', tempo:true, cycle:3, frame:{tx:-.2,ty:.72,H:1.9,W:1.95,az:36}},
  thrust:{family:'hinge', tempo:o => !o.single, cycle:2.8, frame:o => o.single ? {tx:-.05,ty:.45,H:1.3,W:2.7,el:20,az:22} : {tx:-.25,ty:.42,H:1.25,W:2.2,el:20,az:24}},
  plank:{family:'core', cycle:4, frame:{tx:-.42,ty:.34,H:1.05,W:2.4,el:16,az:36}},
  sideplank:{family:'core', cycle:3.2, frame:{tx:0,ty:.4,tz:-.85,H:1.0,W:2.3,el:14,az:84}},
  ballkneel:{family:'balance', cycle:6, frame:{tx:-.05,ty:.95,H:2.0,W:1.4,az:40}},
  pullover:{family:'core', tempo:true, cycle:4, frame:{tx:-.15,ty:.62,H:1.35,W:2.0,el:16,az:26}},
  boxjump:{family:'plyo', cycle:2.6, frame:{tx:.32,ty:1.12,H:2.75,W:2.0,az:12}},
  deathjump:{family:'plyo', cycle:6.2, frame:{tx:.5,ty:.95,H:2.3,W:3.3,az:8}},
  sprint:{family:'cardio', cycle:.38, frame:{tx:.08,ty:.95,H:2.05,W:1.3,az:38}},
  treadmill:{family:'cardio', cycle:.78, frame:{tx:.1,ty:1.05,H:2.15,W:2.1,az:34}},
  rower:{family:'cardio', cycle:2.4, frame:{tx:.1,ty:.62,H:1.45,W:2.5,az:24,el:14}},
  skierg:{family:'cardio', cycle:1.3, frame:{tx:.22,ty:1.06,H:2.3,W:1.8,az:14}},
  jack:{family:'warmup', cycle:.9, frame:{tx:0,ty:.98,H:2.25,W:1.6,az:70}},
  crossbody:{family:'core', cycle:1.1, frame:{tx:-.4,ty:.38,H:1.05,W:2.2,az:30,el:14}}
};
for(const k in LIB) Rig.define(k, LIB[k], META[k]);
})();
