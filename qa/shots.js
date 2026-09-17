// usage: node qa/shots.js <moves,csv> <out-prefix> '<JSON array of [name,s,opts,az,tx,ty,dist,el?,tz?,t?,label?]>' [cols]
const { chromium } = require('playwright');
const {execFileSync} = require('child_process');
(async()=>{
  const [moves, prefix, json, cols='4'] = process.argv.slice(2);
  const C = (new Function('return ('+json+')'))();
  const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
  const p = await b.newPage({viewport:{width:640,height:560}});
  const errs = []; p.on('pageerror', e=>errs.push(e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('file://'+__dirname+'/pose.html?m='+moves); await p.waitForFunction(()=>window.ready===true);
  const files = [];
  for(let i=0;i<C.length;i++){
    const c = C[i];
    await p.evaluate(c=>shot(...c.slice(0,10)), c);
    const f = `${prefix}_${String(i).padStart(2,'0')}.png`;
    await p.screenshot({path:f}); files.push([f, c[10] || `${c[0]} s=${c[1]}`]);
  }
  await b.close();
  if(errs.length) console.log('ERRORS', errs);
  execFileSync('python3', [__dirname+'/grid.py', prefix+'_grid.png', cols, ...files.flat()]);
  console.log(prefix+'_grid.png');
})();
