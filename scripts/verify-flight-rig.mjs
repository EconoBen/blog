import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name);const m={exports:{}};const src=ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;new Function('module','exports','require',src)(m,m.exports,p=>load(p.replace('./','')));cache.set(name,m.exports);return m.exports;}
const {flightBodyPoint,flightWingPoint,flightWingFrame}=load('arrivalFlightRig');
const {birdAnatomy}=load('arrivalRig');
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z??0)-(b.z??0));
const referenceLengths=new Map([true,false].map(near=>{
  const frame=flightWingFrame(birdAnatomy(3650,{awake:1,wings:1,flight:0}),near,'sectioned');
  return [near,frame.joints.slice(1).map((joint,i)=>distance(joint,frame.joints[i]))];
}));
for(const deployment of [0,.05,.25,.5,.8,1])for(let time=3000;time<=5000;time+=11)for(const near of [true,false]){
  const state=birdAnatomy(time,{awake:1,wings:deployment,flight:.7});
  const frame=flightWingFrame(state,near);
  assert.deepEqual(frame,flightWingFrame(state,near,'sectioned'),'Omitting the production profile selects the accepted sectioned geometry');
  frame.joints.slice(1).forEach((joint,i)=>assert.ok(Math.abs(distance(joint,frame.joints[i])-referenceLengths.get(near)[i])<1e-8,'Measured default-profile bones retain their fully opened lengths rather than changing their own reference values'));
  frame.joints.slice(1).forEach((p,i)=>assert.ok(Math.abs(distance(p,frame.joints[i])-frame.lengths[i])<1e-8,'Unfolding rotates full-size bones instead of growing miniature wings'));
  assert.ok(distance(flightWingPoint({x:120,y:150},state,near),flightBodyPoint(frame.attachment,state))<1e-8,'Each shoulder is embedded at its own torso attachment');
  for(const point of [{x:200,y:200},{x:700,y:300},{x:1450,y:260}]){
    const p=flightWingPoint(point,state,near);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
    assert.deepEqual(p,flightWingPoint(point,state,near,'sectioned'),'The default point projection uses the same selected geometry as the default frame');
    const next=flightWingPoint(point,birdAnatomy(time+.1,{awake:1,wings:deployment,flight:.7}),near);
    assert.ok(distance(p,next)<8,'Wing joints move continuously through the complete stroke');
  }
}
const rest=birdAnatomy(17000,{awake:1,wings:0,flight:0});
for(const p of [{x:1100,y:210},{x:300,y:880},{x:1000,y:650}])assert.ok(distance(p,flightBodyPoint(p,rest))<1e-8,'Resting anatomy exactly matches the resident engraving');
const airborne=birdAnatomy(4300,{awake:1,wings:1,flight:1});
const head=flightBodyPoint({x:1140,y:250},airborne),chest=flightBodyPoint({x:1110,y:650},airborne);
const uprightHead=flightBodyPoint({x:1140,y:250},{...airborne,flight:0});
assert.ok(head.x>chest.x+120&&head.x>uprightHead.x+140&&head.y>uprightHead.y+70,'Airborne neck leans forward while retaining the approved engraved proportions');
const near=flightWingFrame(airborne,true),far=flightWingFrame(airborne,false);
assert.notDeepEqual(near.attachment,far.attachment,'The far and near wings have distinct anatomical attachments');
assert.ok(near.joints.at(-1).z*far.joints.at(-1).z<0,'The wings occupy opposite sides of the body in depth');
console.log('Flight rig passed: full-size articulated bones, separate attached shoulders, opposite depth, continuous strokes, forward flight silhouette and exact resting identity.');
