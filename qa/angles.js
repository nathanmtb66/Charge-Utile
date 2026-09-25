// Preuve chiffrée du calcul d'angle au capteur : on teste le VRAI code de docs/js/app.js (upVec, angBetween)
// contre une géométrie simulée (membre qui tourne, téléphone fixé n'importe comment), avec bruit de capteur.
// Usage : node qa/angles.js   → tableau d'erreurs + échec (code 1) si une erreur dépasse la tolérance.
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'docs', 'js', 'app.js'), 'utf8');
const pick = name => { const m = src.match(new RegExp(`const ${name} = \\(.*?\\) => \\{[\\s\\S]*?\\};`)); if(!m) throw new Error('introuvable : ' + name); return m[0]; };
const D2R = Math.PI/180;
const { upVec, angBetween } = new Function('D2R', `${pick('upVec')}\n${pick('angBetween')}\nreturn {upVec, angBetween};`)(D2R);

/* ---------- petite algèbre 3×3 ---------- */
const mul = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k]*B[k][j], 0)));
const T = A => A[0].map((_, j) => A.map(r => r[j]));
const mv = (A, v) => A.map(r => r[0]*v[0] + r[1]*v[1] + r[2]*v[2]);
const Rx = a => [[1,0,0],[0,Math.cos(a),-Math.sin(a)],[0,Math.sin(a),Math.cos(a)]];
const Ry = a => [[Math.cos(a),0,Math.sin(a)],[0,1,0],[-Math.sin(a),0,Math.cos(a)]];
const Rz = a => [[Math.cos(a),-Math.sin(a),0],[Math.sin(a),Math.cos(a),0],[0,0,1]];
const axisAngle = (u, a) => { const [x,y,z] = u, c = Math.cos(a), s = Math.sin(a), C = 1 - c;
  return [[c + x*x*C, x*y*C - z*s, x*z*C + y*s],[y*x*C + z*s, c + y*y*C, y*z*C - x*s],[z*x*C - y*s, z*y*C + x*s, c + z*z*C]]; };
let seed = 12345; const rnd = () => (seed = (seed*1103515245 + 12345) % 2147483648)/2147483648;
const gauss = () => Math.sqrt(-2*Math.log(rnd() + 1e-12))*Math.cos(2*Math.PI*rnd());
const randRot = () => { // rotation uniforme (quaternion aléatoire)
  let q = [gauss(), gauss(), gauss(), gauss()]; const n = Math.hypot(...q); q = q.map(x => x/n); const [w,x,y,z] = q;
  return [[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)],[2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)],[2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]]; };
/** ce que le navigateur rapporte : beta ∈ [−180, 180), gamma ∈ [−90, 90) (norme W3C, repère Terre z en haut) */
function w3c(R){ const u = [R[2][0], R[2][1], R[2][2]];      // 3e ligne de R = le haut du monde vu par le téléphone
  const cb = (u[2] >= 0 ? 1 : -1)*Math.hypot(u[0], u[2]);
  return {beta: Math.atan2(u[1], cb)/D2R, gamma: Math.atan2(-u[0]/(cb || 1e-12), u[2]/(cb || 1e-12))/D2R}; }
const stats = a => { const s = a.slice().sort((x, y) => x - y); return {moy: a.reduce((x, y) => x + y, 0)/a.length, p95: s[Math.floor(s.length*.95)], max: s[s.length-1]}; };
const f2 = x => x.toFixed(x < .01 ? 4 : 2);
let fail = 0; const out = [];
const report = (nom, errs, tol) => { const st = stats(errs); const ok = st.max <= tol; if(!ok) fail++;
  out.push(`${ok ? 'OK ' : 'ÉCHEC'} ${nom.padEnd(62)} moy ${f2(st.moy)}°  p95 ${f2(st.p95)}°  max ${f2(st.max)}°  (tolérance ${tol}°)`); };

/* 1. la formule upVec est bien celle de la norme : R = Rz(alpha)·Rx(beta)·Ry(gamma), haut du monde dans le repère du téléphone = Rᵀ·z */
{ const e = []; for(let i = 0; i < 20000; i++){ const a = rnd()*360, b = rnd()*360 - 180, g = rnd()*180 - 90;
    const R = mul(mul(Rz(a*D2R), Rx(b*D2R)), Ry(g*D2R)); const ref = mv(T(R), [0,0,1]), u = upVec(b, g);
    e.push(angBetween(ref, u)); } report('1. upVec = norme W3C (20 000 orientations au hasard)', e, 1e-6); }

/* 2. angle mesuré = angle réel du membre, sans bruit, téléphone fixé n'importe comment, axe horizontal */
function scenario(nom, thetaMax, noise, tol, opts = {}){
  const e = [];
  for(let i = 0; i < 20000; i++){
    const az = rnd()*2*Math.PI, tilt = (opts.axisTilt || 0)*D2R;
    const A = [Math.cos(az)*Math.cos(tilt), Math.sin(az)*Math.cos(tilt), Math.sin(tilt)];   // axe de rotation du membre
    const L0 = randRot(), M = randRot(), th = (opts.thetaMin || 0) + rnd()*(thetaMax - (opts.thetaMin || 0));
    const R0 = mul(L0, M), R1 = mul(mul(axisAngle(A, th*D2R), L0), M);
    const o0 = w3c(R0), o1 = w3c(R1);
    const nz = () => noise*gauss();
    const m = angBetween(upVec(o0.beta + nz(), o0.gamma + nz()), upVec(o1.beta + nz(), o1.gamma + nz()));
    e.push(Math.abs(m - (opts.expect ? opts.expect(th) : th)));
  }
  report(nom, e, tol);
}
scenario('2. rotation 0-180°, axe horizontal, sans bruit', 180, 0, 1e-6);
scenario('3. rotation 0-180°, bruit capteur 0,5° (réaliste)', 180, .5, 3.5);
scenario('4. rotation 0-180°, bruit capteur 1° (téléphone médiocre)', 180, 1, 7);
/* 5. près de beta = ±90° (téléphone debout, gamma mal défini) : aucun trou de précision */
{ const e = []; for(let i = 0; i < 20000; i++){ const b = 90 + (rnd() - .5)*.2, g = rnd()*180 - 90, g2 = rnd()*180 - 90;
    e.push(angBetween(upVec(b, g), upVec(b, g2))); } report('5. beta ≈ 90° ± 0,1 : gamma quelconque ne change pas la mesure', e, .25); }
/* 6. limites du protocole (pas des erreurs de calcul) : un axe qui n'est pas horizontal fait sous-estimer l'angle */
{ const e = []; for(const tilt of [5, 10, 20]){ const th = 80*D2R, t = tilt*D2R;
    const u0 = [0, 0, 1], A = [Math.cos(t), 0, Math.sin(t)], u1 = mv(T(axisAngle(A, th)), u0); e.push([tilt, 80 - angBetween(u0, u1)]); }
  out.push('INFO 6. axe incliné de 5 / 10 / 20° (compensation) : sous-estimation à 80° de ' + e.map(([t, x]) => `${f2(x)}°`).join(' / ') + ' → d\'où « la cuisse ne bouge pas », « la fesse reste collée »'); }
/* 7. Thomas : zéro assis (fémur horizontal), puis la cuisse descend ou monte de el. Téléphone posé de travers jusqu'à ±45°,
      roulé n'importe comment autour de la cuisse, bruit 0,5°. Même formule que l'appli : angle depuis le zéro, signe par Δu_y. */
{ const e = [], signErr = [];
  for(let i = 0; i < 20000; i++){
    const el = (rnd()*50 - 25), yawOff = (rnd()*90 - 45)*D2R, roll = (rnd()*120 - 60)*D2R, dir = rnd()*2*Math.PI;
    const femur = th => mul(Rz(dir), Rx(-th*D2R));      // y du fémur vers le genou ; th > 0 = genou qui descend sous l'horizontale
    const mount = mul(Ry(roll), Rz(yawOff));
    const o0 = w3c(mul(femur(0), mount)), o1 = w3c(mul(femur(el), mount));
    const u0 = upVec(o0.beta + .5*gauss(), o0.gamma + .5*gauss()), u1 = upVec(o1.beta + .5*gauss(), o1.gamma + .5*gauss());
    const a = angBetween(u0, u1), mesure = (u1[1] - u0[1]) < 0 ? a : -a;
    e.push(Math.abs(mesure - el)); if(Math.abs(el) >= 3 && Math.sign(mesure) !== Math.sign(el)) signErr.push(1);
  }
  report('7. Thomas : valeur, téléphone de travers ±45°, roulé ±60°, bruit 0,5°', e, 3.5);
  const ok = signErr.length === 0; if(!ok) fail++;
  out.push(`${ok ? 'OK ' : 'ÉCHEC'} 7b. Thomas : signe juste dans 100 % des cas dès 3° (${signErr.length} erreur(s) sur 20 000)`); }
/* 8. téléphone qui inverserait beta : la vérification « téléphone debout » le détecte et corrige le signe */
{ const reported = -w3c(Rx(90*D2R)).beta;                // debout : +90 par la norme ; −90 si le téléphone inverse beta
  const sign = reported > 70 ? 1 : reported < -70 ? -1 : 0;
  const R0 = Rx(0), R1 = Rx(-12*D2R);                     // cuisse 12° sous l'horizontale
  const flip = o => ({beta: -o.beta, gamma: o.gamma});
  const u0 = upVec(flip(w3c(R0)).beta, flip(w3c(R0)).gamma), u1 = upVec(flip(w3c(R1)).beta, flip(w3c(R1)).gamma);
  const a = angBetween(u0, u1), mesure = (u1[1] - u0[1])*sign < 0 ? a : -a;
  const ok = sign === -1 && Math.abs(mesure - 12) < 1e-9; if(!ok) fail++;
  out.push(`${ok ? 'OK ' : 'ÉCHEC'} 8. beta inversé par un téléphone : détecté (signe ${sign}) et corrigé → ${mesure.toFixed(1)}° (attendu 12°)`); }

console.log(out.join('\n'));
console.log(fail ? `\n${fail} ÉCHEC(S)` : '\nTout est juste : le calcul ne dépend ni du sens du téléphone ni de sa position sur le membre.');
process.exit(fail ? 1 : 0);
