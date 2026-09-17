/* Charge Utile — moteur d'animation v5
   Mannequin épuré (maillage de base MakeHuman, actifs CC0, stylisé : tête sans visage) piloté par cinématique.
   Repère : Y en haut, l'athlète regarde +X, sa gauche est +Z. Unités : mètres.

   Ajouter un mouvement :   Rig.define('nom', (s, o, t) => pose, {family, cycle, tempo})
   Ajouter un accessoire :  Rig.prop('nom', {make(ctx) → Object3D, update(obj, spec, ctx)})
   Accessoire tenu :        pose.carry = [{type:'kb', at:'gripMid', axis:'grip'|'forearmL'|[x,y,z], off:[x,y,z]}]
*/
const Rig = (function(){
  const V = (x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
  const D2R = Math.PI/180;
  const lerp = (a,b,t)=>a+(b-a)*t;
  const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
  const sm = t => { t = clamp(t,0,1); return t*t*(3-2*t); };
  const up = a=>V(Math.sin(a*D2R), Math.cos(a*D2R), 0);
  const fw = a=>V(Math.cos(a*D2R), -Math.sin(a*D2R), 0);
  const ZA = V(0,0,1);
  const rz = (v, deg) => v.clone().applyAxisAngle(ZA, -deg*D2R);
  const ang = v => Math.atan2(v.x, v.y)/D2R;
  /** cloche cyclique : 1 en u=c, 0 au-delà de ±w (u et c dans [0,1[) */
  const bump = (u, c, w) => { const d = Math.abs(((u - c + 1.5) % 1) - .5); return d >= w ? 0 : sm(1 - d/w); };
  /** oscillation douce 0→1→0 sur un cycle */
  const osc = u => .5 - .5*Math.cos(u*Math.PI*2);

  /* ---------- interpolation de clés : cubique monotone (vitesse continue, sans dépassement) ----------
     frames : [{u, clé: nombre | tableau | autre}, …] triés par u ∈ [0,1].
     Si la première et la dernière clé sont identiques, la courbe boucle sans à-coup. */
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  const kfCache = new WeakMap();
  function prepKF(F){
    let c = kfCache.get(F); if(c) return c;
    const n = F.length, keys = Object.keys(F[0]).filter(k=>k!=='u');
    const loop = n > 2 && keys.every(k=>same(F[0][k], F[n-1][k]));
    const slopes = {};
    for(const k of keys){
      const v0 = F[0][k];
      if(typeof v0 !== 'number' && !Array.isArray(v0)){ continue; }
      const dim = Array.isArray(v0) ? v0.length : 1;
      const val = (i,j) => { let q = i; while(q > 0 && F[q][k] === undefined) q--; const x = F[q][k]; return Array.isArray(x) ? x[j] : x; };
      const M = [];
      for(let j=0;j<dim;j++){
        const d = []; // pentes des segments
        for(let i=0;i<n-1;i++){ const h = (F[i+1].u - F[i].u) || 1e-6; d.push((val(i+1,j) - val(i,j))/h); }
        const m = new Array(n).fill(0);
        for(let i=0;i<n;i++){
          let dl, dr;
          if(i===0){ dr = d[0]; dl = loop ? d[n-2] : dr; }
          else if(i===n-1){ dl = d[n-2]; dr = loop ? d[0] : dl; }
          else { dl = d[i-1]; dr = d[i]; }
          if(F[i].hold || dl*dr <= 0) m[i] = 0;
          else { const hl = i>0 ? F[i].u-F[i-1].u : F[1].u-F[0].u, hr = i<n-1 ? F[i+1].u-F[i].u : hl;
                 const w1 = 2*hr + hl, w2 = hr + 2*hl; m[i] = (w1 + w2) / (w1/dl + w2/dr); }
          if(!loop && (i===0 || i===n-1)) m[i] = 0;
        }
        if(loop){ m[n-1] = m[0]; }
        M.push(m);
      }
      slopes[k] = M;
    }
    c = {keys, slopes, loop}; kfCache.set(F, c); return c;
  }
  function kf(F, u){
    const c = prepKF(F), n = F.length;
    u = c.loop ? ((u % 1) + 1) % 1 : clamp(u, F[0].u, F[n-1].u);
    let i = 0; while(i < n-2 && u > F[i+1].u) i++;
    const A = F[i], B = F[i+1], h = (B.u - A.u) || 1e-6;
    const t = clamp((u - A.u)/h, 0, 1), t2 = t*t, t3 = t2*t;
    const h00 = 2*t3 - 3*t2 + 1, h10 = t3 - 2*t2 + t, h01 = -2*t3 + 3*t2, h11 = t3 - t2;
    const out = {};
    for(const k of c.keys){
      const a = A[k], b = B[k] !== undefined ? B[k] : a;
      const S = c.slopes[k];
      if(!S){ out[k] = t < .5 ? a : b; continue; }
      if(Array.isArray(a)) out[k] = a.map((x,j)=> h00*x + h10*h*S[j][i] + h01*b[j] + h11*h*S[j][i+1]);
      else out[k] = h00*a + h10*h*S[0][i] + h01*b + h11*h*S[0][i+1];
    }
    return out;
  }

  let R = null;
  function initRest(J){
    const P = {}; for(const k in J) P[k] = V(...J[k]);
    const r = {P};
    r.a = {head: ang(P.HT.clone().sub(P.H0))};
    r.tLine = ang(P.S3.clone().sub(P.hipC));
    r.L = {thigh: P.kneeL.distanceTo(P.hipL), shank: P.ankleL.distanceTo(P.kneeL), uarm: P.elL.distanceTo(P.shL), farm: P.wrL.distanceTo(P.elL)};
    r.grip = .085;
    for(const s of ['L','R']){
      const d = P['wr'+s].clone().sub(P['sh'+s]).normalize();
      const e = P['el'+s].clone().sub(P['sh'+s]);
      r['armN'+s] = e.sub(d.multiplyScalar(e.dot(d))).normalize();
    }
    R = r;
  }
  function ik2(root, target, a, b, pole){
    const d0 = target.clone().sub(root);
    const dir = d0.clone().normalize();
    const d = clamp(d0.length(), Math.abs(a-b)+1e-3, a+b-1e-3);
    const cosA = (a*a + d*d - b*b)/(2*a*d);
    const sinA = Math.sqrt(Math.max(0,1-cosA*cosA));
    const p = pole.clone().normalize();
    let n = p.sub(dir.clone().multiplyScalar(p.dot(dir)));
    if(n.lengthSq() < 1e-6) n = V(1,0,0).sub(dir.clone().multiplyScalar(dir.x));
    n.normalize();
    return {joint: root.clone().add(dir.clone().multiplyScalar(a*cosA)).add(n.clone().multiplyScalar(a*sinA)),
            end: root.clone().add(dir.clone().multiplyScalar(d)), n};
  }

  /* ---------- aides de pose ---------- */
  const foot = (x,y,z,o={}) => ({ankle:[x,y,z], toe:[x+(o.dx??.2), y+(o.dy??0), z+(o.dz??(z>0?.04:-.04))], pole:o.pole||[1,0,z>0?.3:-.3], toeFlex:o.flex||0});
  const hand = (x,y,z,pole,rel='sh') => ({hand:[x,y,z], pole, rel});
  const LIB = {}, META = {};
  function define(name, fn, meta={}){ LIB[name] = fn; META[name] = meta; }

  /* ======================= SQUELETTE POSÉ ======================= */
  function skeleton(p){
    const J = R.P, dv = p.dev || {};
    const dT = p.tilt - R.tLine;
    const D = {pel: dT + (dv.pel||0), lum: dT + (dv.lum||0), thlow: dT + (dv.thlow||0), thup: dT + (dv.thup||0)};
    const sk = {D};
    // orientation de chaque étage : cap du corps (yaw) · inclinaison avant (tilt) · inclinaison latérale (bend) · rotation axiale (twist)
    const yaw = p.yaw || 0, TWt = dv.twist || 0, BDt = dv.bend || 0;
    const MR = (Dd, b, t, extra) => { const m = new THREE.Matrix4().makeRotationY(yaw*D2R).multiply(new THREE.Matrix4().makeRotationZ(-Dd*D2R));
      if(b) m.multiply(new THREE.Matrix4().makeRotationX(b*D2R)); if(t) m.multiply(new THREE.Matrix4().makeRotationY(t*D2R)); if(extra) m.multiply(extra); return m; };
    const RR = sk.R = {
      pel: MR(D.pel, dv.pelBend || 0, dv.pelTwist || 0),
      lum: MR(D.lum, BDt*.35, TWt*.3), thlow: MR(D.thlow, BDt*.7, TWt*.65), thup: MR(D.thup, BDt, TWt)
    };
    const rm = (M, v) => v.clone().applyMatrix4(M);
    sk.hipC = V(p.pc[0], p.pc[1], p.pc[2]||0);
    sk.S0 = sk.hipC.clone().add(rm(RR.pel, J.S0.clone().sub(J.hipC)));
    sk.S1 = sk.S0.clone().add(rm(RR.lum, J.S1.clone().sub(J.S0)));
    sk.S2 = sk.S1.clone().add(rm(RR.thlow, J.S2.clone().sub(J.S1)));
    sk.S3 = sk.S2.clone().add(rm(RR.thup, J.S3.clone().sub(J.S2)));
    for(const s of ['L','R']){
      const lg = p.legs[s];
      const hip = sk.hipC.clone().add(rm(RR.pel, J['hip'+s].clone().sub(J.hipC)));
      const r = ik2(hip, V(...lg.ankle), R.L.thigh, R.L.shank, V(...lg.pole));
      sk['hip'+s] = hip; sk['knee'+s] = r.joint; sk['ankle'+s] = r.end; sk['kn'+s] = r.n;
      const F = V(...lg.toe).sub(V(...lg.ankle)).normalize();
      const shin = r.joint.clone().sub(r.end).normalize();
      let Dn = shin.clone().sub(F.clone().multiplyScalar(shin.dot(F)));
      if(lg.sole) Dn = V(...lg.sole);
      if(Dn.lengthSq() < 1e-4) Dn = V(0,1,0);
      sk['fF'+s] = F; sk['fD'+s] = Dn.normalize(); sk['toeFlex'+s] = lg.toeFlex || 0;
    }
    const Rx = RR.thup.clone().multiply(new THREE.Matrix4().makeRotationZ(D.thup*D2R));   // part hors tilt (cap, rotation, inclinaison)
    const uT = up(p.tilt + (dv.thup||0)).applyMatrix4(Rx), fT = fw(p.tilt + (dv.thup||0)).applyMatrix4(Rx), sT = ZA.clone().applyMatrix4(Rx);
    const Ryaw = new THREE.Matrix4().makeRotationY(yaw*D2R), sP = ZA.clone().applyMatrix4(RR.pel.clone().multiply(new THREE.Matrix4().makeRotationZ(D.pel*D2R)));
    sk.uT = uT; sk.fT = fT; sk.sT = sT;
    // tête
    const H0n = sk.S3.clone().add(rm(RR.thup, J.H0.clone().sub(J.S3)));
    const eye = H0n.clone().add(rm(RR.thup, J.HT.clone().sub(J.H0).multiplyScalar(.35)));
    let G;
    if(p.gaze==='knees') G = sk.kneeL.clone().add(sk.kneeR).multiplyScalar(.5);
    else if(p.gaze==='floorAhead') G = V(sk.S3.x + .6, 0, 0);
    else if(p.gaze==='down') G = V(sk.S3.x + .05, 0, 0);
    else if(p.gaze==='up') G = eye.clone().add(fT.clone().multiplyScalar(2)).add(uT.clone().multiplyScalar(.4));
    else if(p.gaze==='ceiling') G = eye.clone().add(V(0,2,0)).add(V(.4,0,0));
    else G = V(p.gaze[0], p.gaze[1], 0);
    const want = Math.atan2(-(G.y - eye.y), G.x - eye.x)/D2R;
    let rel = want - D.thup - R.a.head; rel = ((rel + 540) % 360) - 180;
    const diff = clamp(rel * (p.gazeK==null?1:p.gazeK), -50, 70);
    D.neck = D.thup + diff*.45; D.head = D.thup + diff;
    const hT = p.headTurn || 0, hB = p.headTilt || 0;
    RR.neck = MR(D.neck, BDt + hB*.4, TWt + hT*.4);
    RR.head = MR(D.head, BDt + hB, TWt + hT);
    sk.H0 = sk.S3.clone().add(rm(RR.neck, J.H0.clone().sub(J.S3)));
    sk.HT = sk.H0.clone().add(rm(RR.head, J.HT.clone().sub(J.H0)));
    // bras
    const A = p.arms, mode = A.mode;
    const pelF = fw(D.pel).applyMatrix4(Ryaw);
    if(mode==='bar' || mode==='hipdb') sk.hipLoad = sk.hipC.clone().add(pelF.clone().multiplyScalar(mode==='bar'?.17:.15)).add(up(D.pel).multiplyScalar(.02));
    if(mode==='frontBar') sk.frontBar = sk.S3.clone().add(fT.clone().multiplyScalar(.13)).add(uT.clone().multiplyScalar(-.07));
    if(mode==='backBar') sk.backBar = sk.S3.clone().add(fT.clone().multiplyScalar(-.085)).add(uT.clone().multiplyScalar(-.03));
    if(mode==='goblet' || mode==='bag') sk.chestLoad = sk.S3.clone().add(fT.clone().multiplyScalar(mode==='bag'?.26:.235)).add(uT.clone().multiplyScalar(mode==='bag'?-.24:-.22));
    for(const s of ['L','R']){
      const sz = s==='L'?1:-1;
      const sh = sk.S2.clone().add(rm(RR.thup, J['sh'+s].clone().sub(J.S2)));
      const SZ = k => sT.clone().multiplyScalar(k*sz), PZ = k => sP.clone().multiplyScalar(k*sz);
      sk['sh'+s] = sh;
      let hnd, pole;
      switch(mode){
        case 'goblet': hnd = sk.chestLoad.clone().add(uT.clone().multiplyScalar(-.03)).add(SZ(.055)); pole = uT.clone().multiplyScalar(-1).add(SZ(.7)); break;
        case 'bag':    hnd = sk.chestLoad.clone().add(fT.clone().multiplyScalar(-.03)).add(SZ(.14)); pole = uT.clone().multiplyScalar(-1).add(SZ(.9)); break;
        case 'frontBar': hnd = sk.frontBar.clone().add(SZ(.2)); pole = uT.clone().multiplyScalar(.9).add(fT.clone().multiplyScalar(.5)).add(SZ(.25)); break;
        case 'backBar': hnd = sk.backBar.clone().add(SZ(.38)); pole = uT.clone().multiplyScalar(-1).add(fT.clone().multiplyScalar(-.6)).add(SZ(.3)); break;
        case 'none':   hnd = sh.clone().add(V(.58,-.05,-.04*sz)); pole = V(0,-1,.3*sz); break;
        case 'sides':  hnd = sh.clone().add(V(.02,-.62,.03*sz)); pole = V(-1,0,.2*sz); break;
        case 'hips':   hnd = sk['hip'+s].clone().add(up(D.pel).multiplyScalar(.1)).add(V(.03,0,.08*sz)); pole = V(-.6,0,1*sz); break;
        case 'bar':    hnd = sk.hipLoad.clone().add(PZ(.29)); pole = V(-.2,-.4,1*sz); break;
        case 'hipdb':  hnd = sk.hipLoad.clone().add(V(0,.03,0)).add(PZ(.1)); pole = V(-.2,-.4,1*sz); break;
        case 'floor':  hnd = V(sk.S2.x + .5, .03, .27*sz); pole = V(0,1,.6*sz); break;
        case 'plank':  hnd = V(sh.x + .28, .04, .07*sz); pole = V(-.3,-1,.15*sz); break;
        case 'plankHands': hnd = V(sh.x + .02, .03, .18*sz); pole = V(-1,0,.1*sz); break;
        case 'custom': {
          const c = A[s];
          if(c.rel==='torso'){ const t = c.t; hnd = sk.S3.clone().add(fT.clone().multiplyScalar(t[1])).add(uT.clone().multiplyScalar(t[0])).add(sT.clone().multiplyScalar(t[2])); }
          else if(c.rel==='world') hnd = V(...c.hand);
          else hnd = sh.clone().add(V(...c.hand));
          pole = V(...c.pole); break;
        }
      }
      sk['grip'+s] = hnd;
      const a = ik2(sh, hnd, R.L.uarm, R.L.farm + R.grip, pole);
      const dir = a.end.clone().sub(a.joint).normalize();
      sk['el'+s] = a.joint; sk['wr'+s] = a.joint.clone().add(dir.multiplyScalar(R.L.farm)); sk['an'+s] = a.n;
    }
    sk.gripMid = sk.gripL.clone().lerp(sk.gripR, .5);
    return sk;
  }

  /* ======================= MATRICES ======================= */
  const m3 = (x, y) => { const Y = y.clone().normalize(); const X = x.clone().sub(Y.clone().multiplyScalar(x.dot(Y))).normalize(); return new THREE.Matrix4().makeBasis(X, Y, new THREE.Vector3().crossVectors(X, Y)); };
  const m3x = (x, y) => { const X = x.clone().normalize(); const Y = y.clone().sub(X.clone().multiplyScalar(y.dot(X))).normalize(); return new THREE.Matrix4().makeBasis(X, Y, new THREE.Vector3().crossVectors(X, Y)); };
  const rot = (posed, rest) => posed.clone().multiply(rest.clone().transpose());
  const rotZ = deg => new THREE.Matrix4().makeRotationZ(-deg*D2R);
  const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
  /** rotation à mi-chemin entre deux orientations (os d'aide épaule / fessier) */
  function halfRot(A, B){ _qa.setFromRotationMatrix(A); _qb.setFromRotationMatrix(B); _qa.slerp(_qb, .5); return new THREE.Matrix4().makeRotationFromQuaternion(_qa); }
  function segMat(M, R3, po, ro){ M.copy(R3); M.setPosition(0,0,0); M.setPosition(ro.clone().applyMatrix4(R3).negate().add(po)); return M; }

  /* ======================= ACCESSOIRES ======================= */
  const PROPS = {};
  function prop(name, def){ PROPS[name] = def; }

  /* ======================= CONSTRUCTION ======================= */
  const b64 = s => { const bin = atob(s); const u = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i] = bin.charCodeAt(i); return u.buffer; };
  // mannequin épuré : gris clair mat, muscles orange, short et chaussures sombres
  const SKIN = [.40,.43,.48], HOT = [1.0,.17,.035], SHOE = [.02,.024,.03], CLOTH = [.026,.031,.04], CLOTHHOT = [.36,.065,.014]; // valeurs linéaires
  const ROLL = {backBar:-60};
  const CURL = {goblet:[75,85,35], bag:[70,80,30], frontBar:[70,85,30], backBar:[75,85,35], sides:[80,90,40], bar:[75,85,35], hipdb:[75,85,35],
                none:[12,18,5], hips:[15,20,5], floor:[5,8,0], plank:[35,45,15], plankHands:[0,4,0], grip:[78,88,38], loose:[25,35,10], flat:[2,6,0], fist:[85,95,45]};

  function build(scene, data){
    initRest(data.joints);
    const J = R.P, nv = data.nv;
    const pos = new Float32Array(b64(data.pos)), idx = new Uint16Array(b64(data.idx));
    const si = new Uint8Array(b64(data.si)), sw = new Uint8Array(b64(data.sw));
    const mask = new Uint8Array(b64(data.mask)), shoe = new Uint8Array(b64(data.shoe)), cloth = new Uint8Array(b64(data.cloth));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(Uint16Array.from(si), 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(Float32Array.from(sw, x=>x/255), 4));
    const col = new Float32Array(nv*3);
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const skinM = new THREE.MeshStandardMaterial({vertexColors:true, roughness:.55, metalness:0});
    // liseré de contour doux (fresnel) pour détacher la silhouette du fond sombre
    skinM.onBeforeCompile = sh => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>',
        `#include <dithering_fragment>
         float fr = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.2);
         gl_FragColor.rgb += vec3(0.20,0.24,0.30) * fr;`);
    };
    const bones = data.segs.map(()=>{ const b = new THREE.Bone(); b.matrixAutoUpdate = false; b.matrixWorldAutoUpdate = false; return b; });
    const skel = new THREE.Skeleton(bones, bones.map(()=>new THREE.Matrix4()));
    const mesh = new THREE.SkinnedMesh(geo, skinM);
    mesh.bind(skel, new THREE.Matrix4());
    mesh.castShadow = true; mesh.frustumCulled = false;
    scene.add(mesh);
    // tête de mannequin : oeuf lisse, sans visage, attaché à l'os de la tête
    if(data.egg){
      const eg = new THREE.SphereGeometry(1, 40, 28), ep = eg.attributes.position;
      for(let i=0;i<ep.count;i++){
        let x = ep.getX(i), y = ep.getY(i), z = ep.getZ(i);
        const tp = 1 - .18*Math.pow(Math.max(0,-y),1.5);      // mâchoire plus étroite
        x = x*tp + .06*Math.max(0,-y)*(x>0?1:.4); z *= tp;       // menton légèrement vers l'avant
        ep.setXYZ(i, data.egg.c[0] + x*data.egg.r[0], data.egg.c[1] + y*data.egg.r[1], data.egg.c[2] + z*data.egg.r[2]);
      }
      eg.computeVertexNormals();
      const hi = data.segs.indexOf('head');
      eg.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(ep.count*4).map((_,j)=> j%4===0 ? hi : 0), 4));
      eg.setAttribute('skinWeight', new THREE.Float32BufferAttribute(new Float32Array(ep.count*4).map((_,j)=> j%4===0 ? 1 : 0), 4));
      const egM = new THREE.MeshStandardMaterial({color:new THREE.Color().setRGB(SKIN[0],SKIN[1],SKIN[2]), roughness:.5});
      egM.onBeforeCompile = skinM.onBeforeCompile;
      var egg = new THREE.SkinnedMesh(eg, egM);
      egg.bind(skel, new THREE.Matrix4()); egg.castShadow = true; egg.frustumCulled = false; scene.add(egg);
    }
    const SI = {}; data.segs.forEach((n,i)=>SI[n]=i);
    const nm = data.masks.length;

    let focusKey = null, focusT = null;
    const target = new Float32Array(nv*3);
    function paint(ids, into){
      for(let v=0; v<nv; v++){
        let m = 0; for(const k of ids) m = Math.max(m, mask[v*nm+k]/255);
        m = Math.min(1, m*1.2);
        const sh = shoe[v]/255, cl = cloth[v]/255;
        for(let ch=0; ch<3; ch++){ const sk = lerp(SKIN[ch], HOT[ch], m), ct = lerp(CLOTH[ch], CLOTHHOT[ch], m); into[v*3+ch] = lerp(lerp(sk, ct, cl), SHOE[ch], sh); }
      }
    }
    // transition douce des couleurs musculaires
    function setFocus(list, instant){
      const key = (list||[]).join(); if(key === focusKey) return; const first = focusKey === null; focusKey = key;
      const ids = (list||[]).map(k=>data.masks.indexOf(k)).filter(i=>i>=0);
      paint(ids, target);
      if(first || instant){ col.set(target); geo.attributes.color.needsUpdate = true; return; }
      const from = col.slice(), t0 = performance.now();
      cancelAnimationFrame(focusT);
      const stepF = now => { const k = sm((now - t0)/450);
        for(let i=0;i<col.length;i++) col[i] = from[i] + (target[i]-from[i])*k;
        geo.attributes.color.needsUpdate = true; if(k < 1) focusT = requestAnimationFrame(stepF); };
      focusT = requestAnimationFrame(stepF);
    }

    const X = V(1,0,0), Yv = V(0,1,0);
    const REST = {};
    for(const s of ['L','R']){
      REST['thigh'+s] = m3(X, J['knee'+s].clone().sub(J['hip'+s]));
      REST['shank'+s] = m3(X, J['ankle'+s].clone().sub(J['knee'+s]));
      REST['uarm'+s] = m3(R['armN'+s].clone().negate(), J['el'+s].clone().sub(J['sh'+s]));
      REST['farm'+s] = m3(R['armN'+s].clone().negate(), J['wr'+s].clone().sub(J['el'+s]));
    }
    const footRest = m3x(X, Yv);
    const FAX = {}; for(const s of ['L','R']) FAX[s] = J['idx'+s].clone().sub(J['pnk'+s]).normalize().multiplyScalar(s==='L'?1:-1);

    /* ---- matériel ---- */
    const M = (color, rough=.7, metal=0) => new THREE.MeshStandardMaterial({color, roughness:rough, metalness:metal});
    const mats = {
      dark: M(0x252B31,.35,.3), steel: M(0xB9C0C6,.28,.85), plate: M(0x1C2025), bench: M(0x3A4149,.8), pad: M(0x6E2A26,.75),
      mat: M(0x2C475A,.95), bag: M(0x2F4F6E,.85), box: M(0x8A6A4A,.85), ball: M(0x3E6FB0,.45), bosuBase: M(0x2F343B,.6), bosuTop: M(0x3E6FB0,.5),
      mach: M(0x2B3138,.6,.2), accent: M(0xFF5A48,.6), cone: M(0xF08A24,.6), band: M(0x2FA36B,.6), wall: M(0x2A3037,.95), kb: M(0x1E2328,.45,.35), strap: M(0x2A2F36,.8)
    };
    const cast = m=>{ m.castShadow = true; m.receiveShadow = true; return m; };
    const mk = (g, mat) => cast(new THREE.Mesh(g, mat));
    const bodyProps = new THREE.Group(); bodyProps.matrixAutoUpdate = false; scene.add(bodyProps);
    const world = new THREE.Group(); scene.add(world);
    const grp = (parent=bodyProps)=>{ const g = new THREE.Group(); parent.add(g); return g; };
    const ctx = {THREE, V, M, mk, grp, mats, world, bodyProps, D2R};
    function dumbbell(){ const g = grp();
      const h = mk(new THREE.CylinderGeometry(.015,.015,.15,12), mats.steel); h.rotation.z = Math.PI/2; g.add(h);
      for(const x of [-.095,.095]){ const w = mk(new THREE.CylinderGeometry(.052,.052,.07,6), mats.dark); w.rotation.z = Math.PI/2; w.position.x = x; g.add(w); }
      return g; }
    const dbs = [dumbbell(), dumbbell(), dumbbell()];
    function barbell(){ const g = grp();
      const b = mk(new THREE.CylinderGeometry(.014,.014,1.7,12), mats.steel); b.rotation.x = Math.PI/2; g.add(b);
      for(const z of [-.64,.64]){ const pl = mk(new THREE.CylinderGeometry(.17,.17,.045,40), mats.plate); pl.rotation.x = Math.PI/2; pl.position.z = z; g.add(pl); }
      return g; }
    const hipBar = barbell(), frontBar = barbell(), backBar = barbell();
    { const pad = mk(new THREE.CylinderGeometry(.045,.045,.42,18), mats.pad); pad.rotation.x = Math.PI/2; hipBar.add(pad); }
    const plate = grp();
    { const d = mk(new THREE.CylinderGeometry(.12,.12,.03,32), mats.plate); plate.add(d); const hole = mk(new THREE.CylinderGeometry(.025,.025,.035,16), mats.steel); plate.add(hole); }
    const bag = grp();
    { bag.add(mk(new THREE.BoxGeometry(.14,.36,.3), mats.bag)); const pk = mk(new THREE.BoxGeometry(.04,.15,.22), mats.bag); pk.position.set(.08,-.07,0); bag.add(pk); }
    const handle = grp();
    { const h = mk(new THREE.CylinderGeometry(.016,.016,.36,12), mats.dark); h.rotation.x = Math.PI/2; handle.add(h); }

    /* accessoires tenus génériques (axe local X = axe de prise) */
    const CARRY = {
      db: ()=>dumbbell(),
      kb: ()=>{ const g = grp();
        const bell = mk(new THREE.SphereGeometry(.085,24,16), mats.kb); bell.position.y = -.13; g.add(bell);
        const hdl = mk(new THREE.TorusGeometry(.055,.011,8,24,Math.PI), mats.kb); hdl.position.y = -.05; g.add(hdl);
        for(const x of [-.055,.055]){ const leg = mk(new THREE.CylinderGeometry(.011,.011,.06,8), mats.kb); leg.position.set(x,-.075,0); g.add(leg); }
        return g; },
      plate: ()=>{ const g = grp(); const d = mk(new THREE.CylinderGeometry(.12,.12,.03,32), mats.plate); d.rotation.z = Math.PI/2; g.add(d); return g; },
      bar: ()=>{ const g = grp(); const b = mk(new THREE.CylinderGeometry(.014,.014,1.7,12), mats.steel); b.rotation.z = Math.PI/2; g.add(b);
        for(const x of [-.64,.64]){ const pl = mk(new THREE.CylinderGeometry(.17,.17,.045,40), mats.plate); pl.rotation.z = Math.PI/2; pl.position.x = x; g.add(pl); } return g; },
      emptybar: ()=>{ const g = grp(); const b = mk(new THREE.CylinderGeometry(.014,.014,1.7,12), mats.steel); b.rotation.z = Math.PI/2; g.add(b); return g; },
      handle: ()=>{ const g = grp(); const h = mk(new THREE.CylinderGeometry(.016,.016,.16,12), mats.dark); h.rotation.z = Math.PI/2; g.add(h); return g; },
      ball: ()=>{ const g = grp(); const b = mk(new THREE.SphereGeometry(.12,24,16), mats.ball); g.add(b); return g; }
    };
    const carryPool = {};
    function carryGet(type, i){ const pool = carryPool[type] = carryPool[type] || []; while(pool.length <= i) pool.push(CARRY[type]()); return pool[i]; }

    /* accessoires du décor (registre) */
    const propInst = {};
    function propGet(name){ if(!propInst[name]){ const d = PROPS[name]; if(!d) return null; const o = d.make(ctx); o.visible = false; world.add(o); propInst[name] = o; } return propInst[name]; }
    prop('bench', {make(c){ const g = new THREE.Group(); const top = c.mk(new THREE.BoxGeometry(1,.07,1), c.mats.pad); top.position.y = -.035; g.add(top); g.add(c.mk(new THREE.BoxGeometry(1,1,1), c.mats.bench)); return g; },
      update(g, b){ const L = b.x1-b.x0; g.position.set((b.x0+b.x1)/2, b.h, b.z||0);
        g.children[0].scale.set(L, 1, b.w||.34); const base = g.children[1]; base.scale.set(L*.6, b.h-.07, (b.w||.34)*.55); base.position.y = -(b.h-.07)/2 - .07; }});
    prop('mat', {make(c){ const m = new c.THREE.Mesh(new c.THREE.BoxGeometry(2.2,.012,.75), c.mats.mat); m.receiveShadow = true; return m; },
      update(m, s){ const o = typeof s === 'object' ? s : {}; m.position.set(o.x ?? -.35, .006, o.z ?? 0); m.rotation.y = (o.rot||0)*D2R; }});
    const boxDef = {make(c){ return c.mk(new c.THREE.BoxGeometry(1,1,1), c.mats.box); }, update(m, b){ m.scale.set(b.d||.5, b.h, b.w||.5); m.position.set(b.x, b.h/2, b.z||0); }};
    prop('box', boxDef); prop('box2', boxDef); prop('box3', boxDef);
    prop('ball', {make(c){ const b = c.mk(new c.THREE.SphereGeometry(1,48,32), c.mats.ball); b.add(c.mk(new c.THREE.TorusGeometry(1.001,.012,8,64), c.M(0x2C5590,.5))); return b; },
      update(b, s){ b.scale.setScalar(s.r); b.position.set(s.x, s.y ?? s.r, s.z||0); b.rotation.z = -(s.roll||0); }});
    const bosuDef = {make(c){ const g = new c.THREE.Group();
        const dome = c.mk(new c.THREE.SphereGeometry(1,40,16,0,Math.PI*2,0,Math.PI/2), c.mats.bosuTop); dome.scale.set(1,.55,1); g.add(dome);
        const base = c.mk(new c.THREE.CylinderGeometry(1,1,.12,40), c.mats.bosuBase); base.position.y = .06; g.add(base); return g; },
      update(g, s){ g.scale.set(s.r, s.r*.9, s.r); g.position.set(s.x, 0, s.z||0); g.children[0].position.y = .12/.9; g.rotation.set((s.tiltX||0)*D2R, 0, (s.tiltZ||0)*D2R); }};
    prop('bosu', bosuDef); prop('bosu2', bosuDef);
    prop('treadmill', {make(c){ const g = new c.THREE.Group(), T = c.THREE;
        const deck = c.mk(new T.BoxGeometry(1.7,.14,.72), c.mats.mach); deck.position.set(-.05,.07,0); g.add(deck);
        const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const g2 = cv.getContext('2d');
        g2.fillStyle = '#15191d'; g2.fillRect(0,0,64,256); g2.fillStyle = '#262c33'; for(let y=0;y<256;y+=32) g2.fillRect(0,y,64,6);
        const tex = new T.CanvasTexture(cv); tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(1,3); g.userData.tex = tex;
        const belt = new T.Mesh(new T.PlaneGeometry(1.5,.52), new T.MeshStandardMaterial({map:tex, roughness:.9}));
        belt.rotation.x = -Math.PI/2; belt.rotation.z = Math.PI/2; belt.position.set(-.05,.142,0); belt.receiveShadow = true; g.add(belt);
        for(const z of [-.34,.34]){ const post = c.mk(new T.BoxGeometry(.06,1.15,.05), c.mats.mach); post.position.set(.78,.62,z); g.add(post);
          const rail = c.mk(new T.CylinderGeometry(.02,.02,.5,10), c.mats.steel); rail.rotation.z = Math.PI/2; rail.position.set(.55,1.12,z); g.add(rail); }
        const con = c.mk(new T.BoxGeometry(.18,.3,.74), c.mats.mach); con.position.set(.82,1.28,0); con.rotation.z = .35; g.add(con);
        const scr = new T.Mesh(new T.PlaneGeometry(.2,.4), c.M(0x0f5f4a,.3)); scr.position.set(.73,1.31,0); scr.rotation.y = -Math.PI/2; g.add(scr);
        return g; },
      update(g, s){ g.userData.tex.offset.y = -(s.belt||0)*1.2; }});
    prop('rower', {make(c){ const g = new c.THREE.Group(), T = c.THREE;
        const rail = c.mk(new T.BoxGeometry(2.1,.06,.12), c.mats.steel); rail.position.set(-.1,.40,0); g.add(rail);
        const leg1 = c.mk(new T.BoxGeometry(.08,.4,.5), c.mats.mach); leg1.position.set(-1.1,.2,0); g.add(leg1);
        const fly = c.mk(new T.CylinderGeometry(.28,.28,.3,32), c.mats.mach); fly.rotation.x = Math.PI/2; fly.position.set(1.05,.45,0); g.add(fly);
        const base = c.mk(new T.BoxGeometry(.5,.14,.5), c.mats.mach); base.position.set(.95,.07,0); g.add(base);
        for(const z of [-.12,.12]){ const fp = c.mk(new T.BoxGeometry(.04,.26,.12), c.mats.dark); fp.position.set(.70,.40,z); fp.rotation.z = .75; g.add(fp); }
        const seat = c.mk(new T.BoxGeometry(.3,.06,.3), c.mats.pad); g.add(seat); g.userData.seat = seat; return g; },
      update(g, s){ g.userData.seat.position.set(s.seat, .46, 0); }});
    prop('skierg', {make(c){ const g = new c.THREE.Group(), T = c.THREE;
        const post = c.mk(new T.BoxGeometry(.24,2.1,.36), c.mats.mach); post.position.set(.66,1.05,0); g.add(post);
        const f2 = c.mk(new T.BoxGeometry(.9,.04,.7), c.mats.mach); f2.position.set(.35,.02,0); g.add(f2);
        const logo = c.mk(new T.BoxGeometry(.01,.3,.2), c.mats.accent); logo.position.set(.535,1.5,0); g.add(logo);
        g.userData.cords = [-.2,.2].map(z=>{ const l = new T.Line(new T.BufferGeometry().setFromPoints([c.V(.54,1.98,z), c.V(.3,1.5,z)]), new T.LineBasicMaterial({color:0x111418})); g.add(l); return l; });
        return g; },
      update(g, s, c){ ['L','R'].forEach((k,i)=>{ const p = c.sk['grip'+k]; const a = g.userData.cords[i].geometry.attributes.position; a.setXYZ(1, p.x, p.y, p.z); a.needsUpdate = true; }); }});
    prop('wall', {make(c){ const m = new c.THREE.Mesh(new c.THREE.BoxGeometry(.12,2.4,2.4), c.mats.wall); m.receiveShadow = true; return m; },
      update(m, s){ m.position.set(s.x - .06, 1.2, s.z||0); }});
    prop('cones', {make(c){ const g = new c.THREE.Group(); for(let i=0;i<5;i++){ const k = c.mk(new c.THREE.ConeGeometry(.045,.12,18), c.mats.cone); k.position.y = .06; g.add(k); } return g; },
      update(g, s){ g.children.forEach((k,i)=>{ const p = s.at[i]; k.visible = !!p; if(p) k.position.set(p[0], .06, p[1]); }); }});
    prop('step', {make(c){ return c.mk(new c.THREE.BoxGeometry(1,1,1), c.mats.bench); }, update(m, b){ m.scale.set(b.d||.36, b.h, b.w||.7); m.position.set(b.x, b.h/2, b.z||0); }});
    prop('pullbar', {make(c){ const g = new c.THREE.Group(), T = c.THREE; const b = c.mk(new T.CylinderGeometry(.016,.016,1.4,12), c.mats.steel); b.rotation.x = Math.PI/2; g.add(b);
        for(const z of [-.7,.7]){ const p = c.mk(new T.BoxGeometry(.06,2.6,.06), c.mats.mach); p.position.set(0,-1.3+.03,z); g.add(p); } return g; },
      update(g, s){ g.position.set(s.x, s.y, 0); }});
    prop('anchor', {make(c){ const g = new c.THREE.Group(), T = c.THREE; const p = c.mk(new T.BoxGeometry(.1,2.2,.1), c.mats.mach); p.position.y = 1.1; g.add(p);
        const l = new T.Line(new T.BufferGeometry().setFromPoints([c.V(), c.V()]), new T.LineBasicMaterial({color:0x2FA36B, linewidth:3})); g.add(l); g.userData.l = l; return g; },
      update(g, s, c){ g.position.set(s.x, 0, s.z); const a = g.userData.l.geometry.attributes.position; a.setXYZ(0, 0, s.h, 0);
        const p = c.sk.gripMid; a.setXYZ(1, p.x - s.x, p.y, p.z - s.z); a.needsUpdate = true; }});
    prop('bike', {make(c){ const g = new c.THREE.Group(), T = c.THREE;
        const frame = c.mk(new T.BoxGeometry(1.0,.08,.08), c.mats.mach); frame.position.set(.05,.30,0); g.add(frame);
        const post = c.mk(new T.BoxGeometry(.06,.62,.06), c.mats.mach); post.position.set(-.22,.55,0); post.rotation.z = .3; g.add(post);
        const seat = c.mk(new T.BoxGeometry(.26,.05,.14), c.mats.dark); seat.position.set(-.30,.88,0); g.add(seat);
        const stem = c.mk(new T.BoxGeometry(.06,.78,.06), c.mats.mach); stem.position.set(.40,.66,0); stem.rotation.z = .25; g.add(stem);
        const bars = c.mk(new T.CylinderGeometry(.016,.016,.46,10), c.mats.dark); bars.rotation.x = Math.PI/2; bars.position.set(.34,1.04,0); g.add(bars);
        const fly = c.mk(new T.CylinderGeometry(.24,.24,.05,32), c.mats.mach); fly.rotation.x = Math.PI/2; fly.position.set(.42,.30,0); g.add(fly);
        const base = c.mk(new T.BoxGeometry(1.1,.05,.5), c.mats.mach); base.position.set(.05,.025,0); g.add(base);
        const crank = c.mk(new T.BoxGeometry(.04,.34,.04), c.mats.steel); crank.position.set(.04,.36,0); g.add(crank); g.userData.crank = crank;
        return g; },
      update(g, s){ g.userData.crank.rotation.z = -(s.a||0); }});
    prop('strap', {make(c){ const T = c.THREE; const l = new T.Line(new T.BufferGeometry().setFromPoints([c.V(),c.V(),c.V(),c.V()]), new T.LineBasicMaterial({color:0x2FA36B})); return l; },
      update(l, s, c){ const a = l.geometry.attributes.position; const k1 = c.sk.kneeL, k2 = c.sk.kneeR;
        a.setXYZ(0, s.x, s.y, .3); a.setXYZ(1, k1.x - .05, k1.y, k1.z); a.setXYZ(2, k2.x - .05, k2.y, k2.z); a.setXYZ(3, s.x, s.y, -.3); a.needsUpdate = true; }});

    const Gm = new THREE.Matrix4();
    function fitRoot(p, sk){
      const r = p.root; if(!r) return null;
      if(r.m) return r.m;
      const f = r.fit;
      const yOf = (th, key) => sk[key].y*Math.cos(th*D2R) - sk[key].z*Math.sin(th*D2R);
      let lo = r.range[0], hi = r.range[1];
      const fn = th => yOf(th, f[0]) - yOf(th, f[1]);
      let flo = fn(lo);
      for(let i=0;i<30;i++){ const mid = (lo+hi)/2, fm = fn(mid); if((fm>0) === (flo>0)){ lo = mid; flo = fm; } else hi = mid; }
      const th = (lo+hi)/2;
      const G = new THREE.Matrix4().makeRotationX(th*D2R);
      const k = Object.keys(r.floor)[0];
      const y = sk[k].clone().applyMatrix4(G).y;
      const T = new THREE.Matrix4().makeTranslation(0, r.floor[k] - y, 0);
      return T.multiply(G);
    }

    const Mtmp = new THREE.Matrix4();
    function update(p){
      const sk = skeleton(p);
      const set = (name, R3, po, ro) => segMat(bones[SI[name]].matrixWorld, R3, po, ro);
      set('pelvis', sk.R.pel, sk.hipC, J.hipC);
      set('lumbar', sk.R.lum, sk.S0, J.S0);
      set('thlow', sk.R.thlow, sk.S1, J.S1);
      set('thup', sk.R.thup, sk.S2, J.S2);
      set('neck', sk.R.neck, sk.S3, J.S3);
      set('head', sk.R.head, sk.H0, J.H0);
      const A = p.arms;
      for(const s of ['L','R']){
        const kn = sk['kn'+s];
        const Rth = rot(m3(kn, sk['knee'+s].clone().sub(sk['hip'+s])), REST['thigh'+s]);
        set('thigh'+s, Rth, sk['hip'+s], J['hip'+s]);
        if(SI['but'+s] != null) set('but'+s, halfRot(sk.R.pel, Rth), sk['hip'+s], J['hip'+s]);
        set('shank'+s, rot(m3(kn, sk['ankle'+s].clone().sub(sk['knee'+s])), REST['shank'+s]), sk['knee'+s], J['knee'+s]);
        const Rf = rot(m3x(sk['fF'+s], sk['fD'+s]), footRest);
        set('foot'+s, Rf, sk['ankle'+s], J['ankle'+s]);
        const ball_ = J['ball'+s].clone().sub(J['ankle'+s]).applyMatrix4(Mtmp.copy(Rf)).add(sk['ankle'+s]);
        set('toes'+s, Rf.clone().multiply(new THREE.Matrix4().makeRotationZ(sk['toeFlex'+s]*D2R)), ball_, J['ball'+s]);
        const front = sk['an'+s].clone().negate();
        const Ru = rot(m3(front, sk['el'+s].clone().sub(sk['sh'+s])), REST['uarm'+s]);
        const Rfa = rot(m3(front, sk['wr'+s].clone().sub(sk['el'+s])), REST['farm'+s]);
        set('uarm'+s, Ru, sk['sh'+s], J['sh'+s]);
        if(SI['delt'+s] != null) set('delt'+s, halfRot(sk.R.thup, Ru), sk['sh'+s], J['sh'+s]);
        set('farm'+s, Rfa, sk['el'+s], J['el'+s]);
        // rotation de la main autour de l'avant-bras (pronation / supination), en degrés ; miroir automatique à droite
        const rollD = ((A.mode==='custom' && A[s] && A[s].roll != null) ? A[s].roll : A.roll != null ? A.roll : (ROLL[A.mode] || 0)) * (s==='L' ? 1 : -1);
        const Rh = rollD ? new THREE.Matrix4().makeRotationAxis(sk['wr'+s].clone().sub(sk['el'+s]).normalize(), rollD*D2R).multiply(Rfa) : Rfa;
        set('hand'+s, Rh, sk['wr'+s], J['wr'+s]);
        const ck = A.mode==='custom' ? ((A[s] && A[s].curl) || A.curl || 'loose') : A.mode;
        const [ca, cb, ct] = CURL[ck] || CURL.loose;
        const ax = FAX[s];
        const RA = Rh.clone().multiply(new THREE.Matrix4().makeRotationAxis(ax, ca*D2R));
        const RB = Rh.clone().multiply(new THREE.Matrix4().makeRotationAxis(ax, (ca+cb)*D2R));
        const RT = Rh.clone().multiply(new THREE.Matrix4().makeRotationAxis(ax, ct*D2R));
        const knu = J['knu'+s].clone().sub(J['wr'+s]).applyMatrix4(Rh).add(sk['wr'+s]);
        const mid = J['mid'+s].clone().sub(J['knu'+s]).applyMatrix4(RA).add(knu);
        const thb = J['thb'+s].clone().sub(J['wr'+s]).applyMatrix4(Rh).add(sk['wr'+s]);
        set('fingA'+s, RA, knu, J['knu'+s]);
        set('fingB'+s, RB, mid, J['mid'+s]);
        set('thumb'+s, RT, thb, J['thb'+s]);
      }
      // racine (exercices couchés sur le côté)
      const G = fitRoot(p, sk);
      if(G){ bones.forEach(b=>b.matrixWorld.premultiply(G)); bodyProps.matrix.copy(G); }
      else bodyProps.matrix.identity();
      bodyProps.matrixWorldNeedsUpdate = true;

      // matériel porté
      const mode = A.mode, hold = A.hold;
      const uT = sk.uT, fT = sk.fT, sT = sk.sT;
      dbs.forEach(d=>d.visible=false); plate.visible = bag.visible = handle.visible = false;
      for(const k in carryPool) carryPool[k].forEach(o=>o.visible = false);
      const gm = sk.gripMid;
      if(mode==='goblet'){ const d = dbs[0]; d.visible = true; d.position.copy(gm).add(uT.clone().multiplyScalar(.035)); d.quaternion.setFromUnitVectors(X, uT); }
      if(mode==='sides'){ ['L','R'].forEach((s,i)=>{ const d = dbs[i+1]; d.visible = true; d.position.copy(sk['grip'+s]); d.quaternion.identity(); }); }
      if(mode==='hipdb'){ const d = dbs[0]; d.visible = true; d.position.copy(sk.hipLoad); d.quaternion.setFromUnitVectors(X, ZA); }
      if(hold==='dbv'){ const d = dbs[0]; d.visible = true; d.position.copy(gm); d.quaternion.setFromUnitVectors(X, sk.gripL.clone().sub(sk.elL).normalize()); }
      if(hold==='plate'){ plate.visible = true; plate.position.copy(A.L && A.R && A.R.curl==='flat' ? sk.gripL : gm); plate.quaternion.setFromUnitVectors(Yv, sk.wrL.clone().sub(sk.elL).normalize()); }
      if(hold==='handle'){ handle.visible = true; handle.position.copy(gm); }
      hipBar.visible = mode==='bar'; if(mode==='bar') hipBar.position.copy(sk.hipLoad);
      frontBar.visible = mode==='frontBar'; if(mode==='frontBar') frontBar.position.copy(sk.frontBar);
      backBar.visible = mode==='backBar'; if(mode==='backBar') backBar.position.copy(sk.backBar);
      bag.visible = mode==='bag';
      if(mode==='bag'){ bag.position.copy(sk.chestLoad); bag.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(fT, uT, sT)); }
      // accessoires tenus génériques
      const used = {};
      for(const c of (p.carry||[])){
        const i = used[c.type] = (used[c.type]||0); used[c.type]++;
        const o = carryGet(c.type, i); o.visible = true;
        const at = Array.isArray(c.at) ? V(...c.at) : sk[c.at || 'gripMid'].clone();
        if(c.off) at.add(V(...c.off));
        o.position.copy(at);
        let axis = c.axis || 'grip';
        if(axis==='grip') axis = sk.gripL.clone().sub(sk.gripR);
        else if(axis==='forearmL') axis = sk.wrL.clone().sub(sk.elL);
        else if(axis==='forearmR') axis = sk.wrR.clone().sub(sk.elR);
        else if(axis==='z') axis = ZA.clone();
        else axis = V(...axis);
        if(axis.lengthSq() < 1e-8) axis = ZA.clone();
        o.quaternion.setFromUnitVectors(X, axis.normalize());
        if(c.up){ // oriente le haut local (Y) vers un vecteur donné autour de l'axe
          const upv = (c.up==='forearm') ? sk.elL.clone().sub(sk.wrL) : V(...c.up);
          const cur = Yv.clone().applyQuaternion(o.quaternion);
          const ax2 = axis.clone();
          const proj = upv.clone().sub(ax2.clone().multiplyScalar(upv.dot(ax2))).normalize();
          const angle = Math.atan2(cur.clone().cross(proj).dot(ax2), cur.dot(proj));
          o.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(ax2, angle));
        }
      }

      // monde
      const w = p.world || {};
      ctx.sk = sk;
      for(const name in PROPS){
        const spec = w[name];
        if(!spec){ if(propInst[name]) propInst[name].visible = false; continue; }
        const o = propGet(name); o.visible = true;
        PROPS[name].update && PROPS[name].update(o, spec, ctx);
      }

      // points pour l'overlay (avec la racine si besoin)
      sk.head = sk.H0.clone().lerp(sk.HT,.5);
      sk.handL = sk.wrL; sk.handR = sk.wrR;
      for(const s of ['L','R']) sk['toe'+s] = sk['ankle'+s].clone().add(sk['fF'+s].clone().multiplyScalar(.2));
      if(G) for(const k in sk){ if(sk[k] && sk[k].isVector3) sk[k] = sk[k].clone().applyMatrix4(G); }
      sk.phase = p.phase;
      return sk;
    }
    return {update, setFocus, mesh};
  }

  /* ======================= CHRONOLOGIES ======================= */
  const easeIO = x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  /** tempo [excentrique, pause basse, concentrique, pause haute] en secondes ('X' = explosif).
      La phase renvoyée est EXACTEMENT celle du mouvement affiché : même horloge, mêmes bornes. */
  function tempoTimeline(tempo){
    const n = v => v==='X' ? .6 : Math.max(+v, 0);
    const d = tempo.map(n);
    // une pause nulle reste un instant très court pour la lisibilité
    if(d[1] === 0) d[1] = .12; if(d[3] === 0) d[3] = .25;
    const [e,p1,c,p2] = d;
    const total = e+p1+c+p2;
    const bounds = [0, e, e+p1, e+p1+c, total];
    return {total, bounds, durations:d, at(t){
      t = ((t % total) + total) % total;
      if(t < e){ const u = t/e; return {s:easeIO(u), phase:0, left:e - t, u}; }
      if(t < e+p1) return {s:1, phase:1, left:e+p1 - t, u:(t-e)/p1};
      if(t < e+p1+c){ const u=(t-e-p1)/c; return {s: tempo[2]==='X' ? Math.pow(1-u,2.2) : 1-easeIO(u), phase:2, left:e+p1+c - t, u}; }
      return {s:0, phase:3, left:total - t, u:(t-e-p1-c)/p2};
    }};
  }
  function cycleTimeline(period){ return {total:period, cyclic:true, at(t){ return {s:((t % period)+period) % period / period, phase:-1}; }}; }

  const P = new Proxy(LIB, {get:(o,k)=>o[k]});
  return {P, META, define, prop, build, tempoTimeline, cycleTimeline, kf, util:{V, lerp, clamp, sm, bump, osc, foot, hand, D2R, up, fw}};
})();
