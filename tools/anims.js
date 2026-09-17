// Liste les animations définies et vérifie que chaque pose se calcule sans erreur (sans rendu).
// Usage : node tools/anims.js  → écrit qa/anims.json
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), SITE = path.join(ROOT, 'docs');
const ctx = {console, Math, JSON, Object, Array, Proxy, WeakMap, performance:{now:()=>0}, requestAnimationFrame:()=>0, cancelAnimationFrame:()=>0};
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(SITE,'js/three.min.js'),'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(SITE,'js/engine.js'),'utf8') + ';this.Rig=Rig;', ctx);
const MOVES = JSON.parse(fs.readFileSync(path.join(SITE,'moves/index.json'),'utf8'));
for(const m of MOVES) vm.runInContext(fs.readFileSync(path.join(SITE,'moves',m+'.js'),'utf8'), ctx);
const names = Object.keys(ctx.Rig.META);
const ex = JSON.parse(fs.readFileSync(path.join(SITE,'data/exercises.json'),'utf8'));
let bad = 0;
for(const x of ex){
  const f = ctx.Rig.P[x.anim];
  if(!f){ console.log('ANIM MANQUANTE', x.id, x.anim); bad++; continue; }
  for(const s of [0,.25,.5,.75,1]){
    try{ const p = f(s, x.opts||{}, s*3); if(!p || !p.pc || !p.legs || !p.arms) throw new Error('pose incomplète'); }
    catch(e){ console.log('ERREUR', x.id, s, e.message); bad++; break; }
  }
}
const meta = {}; for(const n of names){ const m = ctx.Rig.META[n]; meta[n] = {family:m.family, cycle:m.cycle, tempo: typeof m.tempo === 'function' ? m.tempo({}) : !!m.tempo, frame: typeof m.frame === 'function' ? m.frame({}) : m.frame}; }
fs.writeFileSync(path.join(ROOT,'qa/anims.json'), JSON.stringify(names));
fs.writeFileSync(path.join(SITE,'data/anims-meta.json'), JSON.stringify(meta));
const noFrame = names.filter(n=>!meta[n].frame);
console.log(names.length+' animations', bad ? bad+' erreurs' : 'OK', noFrame.length ? 'sans cadrage: '+noFrame : '');
process.exit(bad ? 1 : 0);
