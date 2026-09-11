import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';
const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const module={exports:{}};
  const code=ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  new Function('module','exports','require',code)(module,module.exports,path=>load(path.replace('./','')));
  modules.set(name,module.exports);return module.exports;
}
const { bodyPoint, wingPoint, birdAnatomy, ARRIVAL_BODY_OUTLINE }=load('arrivalRig');
const eye={x:1150,y:220}, breast={x:1100,y:700}, tail={x:250,y:700};
const sleep=birdAnatomy(0,{awake:0,wings:0,flight:0});
const wake=birdAnatomy(2100,{awake:1,wings:0,flight:0});
assert.ok(bodyPoint(eye,sleep).y>bodyPoint(eye,wake).y+30,'Waking raises the head relative to the torso');
assert.ok(Math.abs(bodyPoint(tail,sleep).y-bodyPoint(tail,wake).y)<12,'Head movement must not move the entire body rigidly');
const flying=birdAnatomy(9000,{awake:1,wings:1,flight:1});
assert.ok(bodyPoint(eye,flying).x>bodyPoint(eye,wake).x+150,'Flight extends the neck forward');
assert.ok(bodyPoint(eye,flying).y>bodyPoint(eye,wake).y+100,'Flight lowers the head into a horizontal silhouette');
const flightEye=bodyPoint(eye,flying),flightBill=bodyPoint({x:1350,y:295},flying);
assert.ok(flightBill.x>flightEye.x+100&&Math.abs(flightBill.y-flightEye.y)<(flightBill.x-flightEye.x)*.65,'The head counter-rotates as the neck extends, keeping the bill pointed along the flight path');
// The rear cheek belongs to the same rigid head as the eye. Partial counter-
// rotation here previously sheared the posterior skull into a straight edge.
const rearCheek={x:935,y:294};
const flightCheek=bodyPoint(rearCheek,flying);
assert.ok(Math.abs((flightEye.x-flightCheek.x)-(eye.x-rearCheek.x)*1.1)<2,'The entire head retains its shape while counter-rotating');
assert.ok(Math.abs((flightEye.y-flightCheek.y)-(eye.y-rearCheek.y)*.88)<2,'The rear cheek remains level with the face');
for(const flight of [.25,.5,.75,1]) {
  const state=birdAnatomy(9000,{awake:1,wings:1,flight});
  for(let y=350;y<=680;y+=10)for(let x=940;x<=1240;x+=10) {
    const p=bodyPoint({x,y},state),px=bodyPoint({x:x+1,y},state),py=bodyPoint({x,y:y+1},state);
    const area=(px.x-p.x)*(py.y-p.y)-(px.y-p.y)*(py.x-p.x);
    assert.ok(area>.04,`The connected neck cannot reverse or crush its texture at ${x},${y}, flight ${flight} (area ${area})`);
  }
}
const {ARRIVAL_BEATS}=load('arrivalTimeline');
const settled=birdAnatomy(ARRIVAL_BEATS.landEnd,{awake:1,wings:0,flight:0});
for(const point of [eye,rearCheek,breast,tail,{x:1040,y:440},{x:820,y:560}]) {
  const target=bodyPoint(point,settled);
  assert.ok(Math.hypot(target.x-point.x,target.y-point.y)<1e-8,'The landing pose remains exactly the native resident silhouette');
}
for(const facing of [true,false]) {
  const root={x:230,y:800};
  for(const t of [0,2400,3250,3700,4100,8700,11380,11600]) {
    const state=birdAnatomy(t,{awake:1,wings:1,flight:t>8500?1:0});
    const a=wingPoint(root,state,facing),b=bodyPoint({x:820,y:560},state);
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<1e-8,'Wing shoulder stays attached to the deformed torso');
  }
}
for(let t=0;t<=12800;t+=10) {
  const controls={awake:1,wings:1,flight:.5};
  const state=birdAnatomy(t,controls),next=birdAnatomy(t+1,controls);
  for(const p of [eye,breast,tail,{x:1000,y:400},{x:400,y:900}]) {
    const a=bodyPoint(p,state),b=bodyPoint(p,next);
    assert.ok([a.x,a.y,b.x,b.y].every(Number.isFinite));
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<6,'Adjacent body frames must not jump at a phase boundary');
  }
}
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage();
  const silhouette=await page.evaluate(outline=>{
    const ctx=document.createElement('canvas').getContext('2d'),path=new Path2D(outline);
    return {
      gap:[{x:290,y:814},{x:320,y:823}].map(p=>ctx.isPointInPath(path,p.x,p.y)),
      anatomy:[{x:290,y:790},{x:290,y:850},{x:390,y:852}].map(p=>ctx.isPointInPath(path,p.x,p.y)),
    };
  },ARRIVAL_BODY_OUTLINE);
  assert.deepEqual(silhouette.gap,[false,false],'The tail-to-foot opening must not retain the generated plate background');
  assert.deepEqual(silhouette.anatomy,[true,true,true],'Removing the tail gap must preserve the feather and foot silhouettes');
} finally {await browser.close();}
console.log('Arrival rig passed: anatomical wake, rigid level head, connected neck texture, exact landing identity, clean tail opening, attached shoulders, and continuous joint motion.');
