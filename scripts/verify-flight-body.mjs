import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const source={};
for(const name of ['arrivalTimeline','arrivalMesh','arrivalRig','arrivalFlightRig'])source[name]=ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const cache={};
function load(name){if(cache[name])return cache[name];const m={exports:{}};new Function('module','exports','require',source[name])(m,m.exports,p=>load(p.replace('./','')));return cache[name]=m.exports;}
const {flightBodyPoint}=load('arrivalFlightRig');
const {birdAnatomy,bodyPoint}=load('arrivalRig');
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const sections=[{y:400,left:1030,right:1120},{y:440,left:1050,right:1150},{y:480,left:1060,right:1180}];
for(let flight=0;flight<=1.001;flight+=.05){
  const state=birdAnatomy(4380,{awake:1,wings:1,flight});
  for(const {y,left,right} of sections){
    const center=(left+right)/2;
    const a=flightBodyPoint({x:left,y},state),b=flightBodyPoint({x:right,y},state);
    const lo=flightBodyPoint({x:center,y:y-5},state),hi=flightBodyPoint({x:center,y:y+5},state);
    const tangent={x:hi.x-lo.x,y:hi.y-lo.y},length=Math.hypot(tangent.x,tangent.y);
    const width=Math.abs((b.x-a.x)*tangent.y-(b.y-a.y)*tangent.x)/length;
    assert.ok(width>(right-left)*.6,`Neck at y=${y}, flight=${flight.toFixed(2)} retains transverse volume (${width.toFixed(2)} px)`);
  }
}
for(const time of [900,2450,4380,17000]){
  const state=birdAnatomy(time,{awake:1,wings:0,flight:0});
  for(const p of [{x:1100,y:200},{x:1100,y:430},{x:1050,y:650},{x:400,y:860}])assert.deepEqual(flightBodyPoint(p,state),bodyPoint(p,state),'Zero flight preserves the approved resting/waking skin exactly');
}
const flying=birdAnatomy(4380,{awake:1,wings:1,flight:1});
const bill=[{x:1230,y:240},{x:1350,y:290}];
const billRatio=distance(...bill.map(p=>flightBodyPoint(p,flying)))/distance(...bill);
assert.ok(billRatio>.9&&billRatio<1.1,'Neck extension preserves recognizable bill proportions');
const first={...flying,time:3875},second={...flying,time:4085};
let strokeShift;
for(const point of [{x:1100,y:250},{x:1080,y:430},{x:700,y:650}]){
  const a=flightBodyPoint(point,first),b=flightBodyPoint(point,second);
  const delta={x:b.x-a.x,y:b.y-a.y};
  assert.ok(Math.abs(delta.y)>6&&Math.abs(delta.y)<12,'Powered strokes create a subtle bounded body response');
  if(strokeShift)assert.ok(distance(delta,strokeShift)<1e-8,'The torso and head share the stroke response without stretching the neck');
  strokeShift=delta;
}

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  const result=await page.evaluate(({source})=>{
    const cache={};const load=name=>{if(cache[name])return cache[name];const m={exports:{}};new Function('module','exports','require',source[name])(m,m.exports,p=>load(p.replace('./','')));return cache[name]=m.exports;};
    const {flightBodyPoint}=load('arrivalFlightRig'),{birdAnatomy,ARRIVAL_BODY_OUTLINE}=load('arrivalRig'),{makeGrid}=load('arrivalMesh');
    const context=document.createElement('canvas').getContext('2d'),outline=new Path2D(ARRIVAL_BODY_OUTLINE);
    const inside=p=>context.isPointInPath(outline,p.x,p.y);
    const area=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
    let minimum=Infinity,checked=0,worst;
    for(let step=0;step<=20;step++){
      const state=birdAnatomy(4380,{awake:1,wings:1,flight:step/20}),mesh=makeGrid(1536,1024,16,12,p=>flightBodyPoint(p,state));
      for(const ids of mesh.triangles){
        const v=ids.map(i=>mesh.vertices[i]),s=v.map(v=>v.source);
        let occupied=false;
        for(let i=0;i<=4&&!occupied;i++)for(let j=0;j<=4-i&&!occupied;j++)occupied=inside({x:(s[0].x*i+s[1].x*j+s[2].x*(4-i-j))/4,y:(s[0].y*i+s[1].y*j+s[2].y*(4-i-j))/4});
        if(!occupied)continue;
        const ratio=area(...v.map(v=>v.target))/area(...s);checked++;
        if(ratio<minimum){minimum=ratio;worst={flight:step/20,ids,source:s};}
      }
    }
    return {minimum,checked,worst};
  },{source});
  assert.ok(result.checked>1000,'The native outline must exercise occupied body triangles throughout extension');
  assert.ok(result.minimum>.08,`Occupied skin triangles retain positive area: ${JSON.stringify(result)}`);
  console.log(`Flight body passed: transverse neck volume, preserved bill proportions, exact resting identity and ${result.checked} occupied triangles (minimum area ratio ${result.minimum.toFixed(3)}).`);
}finally{await browser.close();}
