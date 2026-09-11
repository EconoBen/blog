import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const source={};
for(const name of ['arrivalTimeline','arrivalRig','arrivalArtwork']){
  source[name]=ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
}
const assets=['engraving-plate-v2','anatomy-detail-v2','wing-v1','anatomy-flank-v3'].map(name=>'data:image/webp;base64,'+fs.readFileSync(`public/assets/grebes/arrival/${name}.webp`).toString('base64'));
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  const result=await page.evaluate(async({source,assets})=>{
    const modules={};
    const load=name=>{if(modules[name])return modules[name];const m={exports:{}};new Function('module','exports','require',source[name])(m,m.exports,p=>load(p.replace('./','')));return modules[name]=m.exports;};
    const {createArrivalTextures,createArrivalWing}=load('arrivalArtwork');
    const images=await Promise.all(assets.map(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;})));
    const textures=createArrivalTextures(images[0],images[1],images[3]);
    const pixel=(canvas,x,y)=>Array.from(canvas.getContext('2d').getImageData(x,y,1,1).data);
    const baseEye=pixel(textures.body,1146,218),baseFlank=pixel(textures.body,520,706);
    const sleeping=textures.compose(0,0),sleepEye=pixel(sleeping,1146,218),sleepFlank=pixel(sleeping,520,706);
    const flying=textures.compose(1,1),flightEye=pixel(flying,1146,218),flightFlank=pixel(flying,520,706);
    const rawFlank=document.createElement('canvas');rawFlank.width=1536;rawFlank.height=1024;rawFlank.getContext('2d').drawImage(images[3],0,0);
    const exposed=[{x:600,y:485},{x:760,y:570},{x:520,y:706}];
    const expectedFlank=exposed.map(p=>pixel(rawFlank,p.x,p.y));
    const upperFlank=exposed.map(p=>pixel(flying,p.x,p.y));
    const opening=textures.compose(1,.0051,true),earlyFlank=exposed.map(p=>pixel(opening,p.x,p.y));
    let repeatedDraws=0;
    const draw=CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage=function(...args){repeatedDraws++;return draw.apply(this,args);};
    textures.compose(1,.65);textures.compose(1,1);
    CanvasRenderingContext2D.prototype.drawImage=draw;
    const finalIsBase=textures.compose(1,0)===textures.body;
    const outside=pixel(flying,100,100);
    const wing=createArrivalWing(images[2]);
    const wingRoot=pixel(wing,220,800)[3],wingPrimary=pixel(wing,1080,280)[3];
    const widths=[];const saved=textures.body;textures.dispose();widths.push(saved.width,sleeping.width,flying.width);
    return {expectedFlank,upperFlank,earlyFlank,repeatedDraws,baseEye,baseFlank,sleepEye,sleepFlank,flightEye,flightFlank,finalIsBase,outside,wingRoot,wingPrimary,widths};
  },{source,assets});
  assert.notDeepEqual(result.sleepEye,result.baseEye,'Sleeping replaces the exposed iris with the painted closed eyelid');
  assert.deepEqual(result.sleepFlank,result.baseFlank,'Closing the eye must preserve the folded wing');
  assert.deepEqual(result.flightEye,result.baseEye,'Exposing the flank must preserve the open eye');
  assert.notDeepEqual(result.flightFlank,result.baseFlank,'The lifted wing exposes painted flank feathers instead of a second folded wing');
  assert.deepEqual(result.upperFlank,result.expectedFlank,'The full folded-wing panel, including long upper-back feathers, is replaced by short contour feathers');
  assert.deepEqual(result.earlyFlank,result.expectedFlank,'The closed painted wing is gone before the articulated wing lifts clear of the flank');
  assert.equal(result.repeatedDraws,0,'Fully exposed flank and open eye must reuse the composed texture while the wings move');
  assert.ok(result.finalIsBase,'The handoff returns the exact unmodified resident body texture');
  assert.equal(result.outside[3],0,'Detail patches must not reintroduce the opaque plate background');
  assert.ok(result.wingRoot<70&&result.wingPrimary>240,'Shoulder feathers blend into the body while primary feathers retain their ink');
  assert.deepEqual(result.widths,[1,1,1],'Disposal releases compositing and body backing stores');
  console.log('Arrival artwork passed: painted eyelid and flank isolation, exact resident texture, transparent exterior, shoulder blend and disposed buffers.');
}finally{await browser.close();}
