import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React,{act} from 'react';
import {JSDOM} from 'jsdom';
import {chromium} from 'playwright';

const require=createRequire(import.meta.url);
const compile=file=>ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
const rendererSource=compile('app/components/AnatomicalBird.tsx');
const evidence={renderer:[],bodyFactory:[]};

async function fixture(stage,wingProfile='current') {
  const dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
  globalThis.Path2D=class{};
  const images=[],acquired=[],attempts=[],errors=[];
  class FakeImage {
    complete=false;naturalWidth=0;onload=null;onerror=null;
    constructor(){images.push(this);}set src(url){this.url=url;}
    finish(){this.complete=true;this.naturalWidth=1536;this.onload?.();}
    fail(){this.onerror?.(new Error('missing image'));}
  }
  globalThis.Image=FakeImage;
  window.HTMLCanvasElement.prototype.getContext=function(){
    if(!acquired.includes(this))acquired.push(this);
    if(stage==='shoulder'&&this.width===260)return null;
    if(stage==='surface'&&this.classList.contains('arrival-character'))return null;
    if(stage.startsWith('scratch')&&this.width>260&&!this.classList.contains('arrival-character')){
      attempts.push('scratch-context');
      if(stage==='scratch-throw')throw Error('Scratch context allocation failed');
      return null;
    }
    return{save(){},restore(){},translate(){},scale(){},clip(){},drawImage(){},fillRect(){},setTransform(){},clearRect(){},beginPath(){},rect(){},createRadialGradient(){return{addColorStop(){}};}};
  };
  const texture=(width=1536,height=1024)=>{const c=document.createElement('canvas');c.width=width;c.height=height;acquired.push(c);return c;};
  const module={exports:{}};
  new Function('require','module','exports',rendererSource)(name=>{
    if(name==='./arrivalArtwork')return{createArrivalTextures(){attempts.push('body');if(stage==='body')throw Error('body failed');const body=texture();return{body,compose:()=>body,dispose(){body.width=body.height=1;}};}};
    if(name==='./arrivalFlightArtwork')return{FLIGHT_WING_ASSET:'/assets/grebes/arrival/flight-wings-v2.webp',createFlightWingTextures(){attempts.push('wing');if(stage==='wing')throw Error('wing failed');const blends=Array.from({length:5},()=>texture(1536,512));return{blends,dispose(){for(const c of blends)c.width=c.height=1;}};}};
    if(name==='./arrivalWingSections')return{SECTIONED_WING_ASSET:'/assets/grebes/arrival/flight-wings-v3.webp',createSectionedWingTextures(){
      attempts.push('sectioned-wing');if(stage==='wing')throw Error('sectioned wing failed');
      const sections=[{x:70,width:430},{x:360,width:670},{x:900,width:610}].map(section=>({...section,blends:Array.from({length:5},()=>texture(section.width,512))}));
      return {sections,dispose(){for(const section of sections)for(const canvas of section.blends)canvas.width=canvas.height=1;}};
    }};
    if(name==='./arrivalRig')return{birdAnatomy:()=>({}),ARRIVAL_BODY_OUTLINE:''};
    if(name==='./arrivalTimeline')return{ARRIVAL_BEATS:{launchEnd:5300}};
    if(name==='./arrivalFlightRig')return{flightBodyPoint:p=>p,flightWingPoint:p=>p,flightWingFrame:()=>({underside:0}),flightWingMaterial:()=>.4};
    if(name==='./arrivalMesh')return{createMeshCoverage:()=>null,makeGrid:()=>({}),drawTexturedMesh(){}};
    return require(name);
  },module,module.exports);
  const {createRoot}=await import('react-dom/client');const root=createRoot(document.getElementById('root'));
  const props={elapsedMs:0,size:600,x:300,y:300,wings:stage.startsWith('scratch')?.06:0,opacity:stage==='surface'||stage.startsWith('scratch')?1:0,wingProfile,onError:()=>errors.push('initial')};
  const render=extras=>act(()=>root.render(React.createElement(module.exports.AnatomicalBird,{...props,...extras})));
  await render();return{dom,root,images,acquired,attempts,errors,render};
}

for(const wingProfile of ['current','sectioned'])for(const stage of ['body','wing','shoulder','surface',...(wingProfile==='sectioned'?['scratch','scratch-throw']:[])]){
  const h=await fixture(stage,wingProfile);
  try{
    await act(()=>h.images.forEach(image=>image.finish()));
    assert.equal(h.errors.length,1,`${wingProfile} ${stage} failure reports once to the opening's fallback`);
    if(stage.startsWith('scratch')){
      const failedSurface=h.acquired.at(-1);
      assert.deepEqual([failedSurface.width,failedSurface.height],[1,1],'A missing or throwing scratch context immediately releases its attempted backing store');
      const contextAttempts=h.attempts.length;
      await h.render({elapsedMs:20});
      assert.equal(h.errors.length,1,'Subsequent frames cannot report the failed attempt again');
      assert.equal(h.attempts.length,contextAttempts,'A failed drawing surface must not be reacquired on later frames while fallback is pending');
    }
    const attempts=h.attempts.length;
    await act(()=>h.images.forEach(image=>{image.fail();image.finish();}));
    assert.equal(h.errors.length,1,'Further image events cannot report the same failed attempt again');
    assert.equal(h.attempts.length,attempts,'A failed attempt cannot resume preparation on a late load');
    await act(()=>h.root.unmount());
    const dimensions=h.acquired.map(c=>[c.width,c.height]);
    assert.ok(dimensions.every(([w,h])=>w===1&&h===1),`${stage} failure releases all acquired canvases on unmount`);
    assert.ok(h.images.every(image=>image.onload===null&&image.onerror===null),'Unmount clears success and error handlers');
    evidence.renderer.push({wingProfile,stage,errors:h.errors.length,attempts:h.attempts,dimensions});
  }finally{h.dom.window.close();}
}

for(const wingProfile of ['current','sectioned']){
  const h=await fixture('image',wingProfile);
  try{
    await h.render({onError:()=>h.errors.push('current')});
    assert.equal(h.images.length,4,'Updating the error callback does not reload the artwork');
    await act(()=>{h.images[3].fail();h.images[0].fail();});
    assert.deepEqual(h.errors,['current'],'Image failure calls the current fallback once without a stale callback');
    await act(()=>h.images.forEach(image=>image.finish()));
    assert.deepEqual(h.attempts,[],'Late successful loads do not prepare after an image failure');
    await act(()=>h.root.unmount());evidence.renderer.push({wingProfile,stage:'image-error-current-callback',passed:true});
  }finally{h.dom.window.close();}
}

for(const wingProfile of ['current','sectioned']){
  const h=await fixture('late',wingProfile);
  try{
    await act(()=>h.images.slice(0,3).forEach(image=>image.finish()));
    const lateLoad=h.images[3].onload,lateError=h.images[3].onerror;
    await act(()=>h.root.unmount());
    for(const image of h.images){image.complete=true;image.naturalWidth=1536;}
    await act(()=>{lateLoad();lateError();});
    assert.deepEqual(h.attempts,[],'Captured stale callbacks cannot acquire artwork after unmount');
    assert.deepEqual(h.errors,[],'Captured stale failure cannot interrupt a newer route after unmount');
    evidence.renderer.push({wingProfile,stage:'unmount-before-last-load',passed:true});
  }finally{h.dom.window.close();}
}

{
  const h=await fixture('late');
  try{
    await act(()=>h.images.slice(0,3).forEach(image=>image.finish()));
    const previous=h.images.slice(),lateLoad=previous[3].onload,lateError=previous[3].onerror;
    await h.render({wingProfile:'sectioned'});
    assert.equal(h.images.length,8,'Selecting a different source installs a fresh four-image barrier');
    assert.ok(previous.every(image=>image.onload===null&&image.onerror===null),'Changing source detaches the prior image handlers');
    for(const image of previous){image.complete=true;image.naturalWidth=1536;}
    await act(()=>{lateLoad();lateError();});
    assert.deepEqual(h.attempts,[],'Captured previous-source callbacks cannot prepare or interrupt the new source');
    assert.deepEqual(h.errors,[]);
    await act(()=>h.images.slice(4).forEach(image=>image.finish()));
    assert.deepEqual(h.attempts,['body','sectioned-wing'],'Only the selected sectioned source prepares');
    assert.equal(h.acquired.filter(canvas=>canvas.height===512).length,15,'The revised factory returns fifteen cropped material buffers');
    await act(()=>h.root.unmount());
    assert.ok(h.acquired.every(canvas=>canvas.width===1&&canvas.height===1),'Unmount releases all selected-source materials');
    evidence.renderer.push({stage:'source-switch-before-last-load',passed:true});
  }finally{h.dom.window.close();}
}

// Exercise the actual body factory in a real canvas engine. Renderer leaf
// injections above establish ownership; these failures check its internal work.
const source=Object.fromEntries(['arrivalTimeline','arrivalRig','arrivalArtwork'].map(name=>[name,compile(`app/components/${name}.ts`)]));
const assets=['engraving-plate-v2','anatomy-detail-v2','anatomy-flank-v3'].map(name=>'data:image/webp;base64,'+fs.readFileSync(`public/assets/grebes/arrival/${name}.webp`).toString('base64'));
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  evidence.bodyFactory=await page.evaluate(async({source,assets})=>{
    const cache={};const load=name=>{if(cache[name])return cache[name];const m={exports:{}};new Function('module','exports','require',source[name])(m,m.exports,p=>load(p.replace('./','')));return cache[name]=m.exports;};
    const {createArrivalTextures}=load('arrivalArtwork');
    const images=await Promise.all(assets.map(async src=>{const image=new Image();image.src=src;await image.decode();return image;}));
    const create=document.createElement.bind(document),results=[];
    for(let failAt=1;failAt<=5;failAt++){
      const acquired=[];document.createElement=function(name,...args){const c=create(name,...args);if(name==='canvas'){acquired.push(c);if(acquired.length===failAt)c.getContext=()=>null;}return c;};
      let error;try{createArrivalTextures(...images);}catch(e){error=String(e);}finally{document.createElement=create;}
      results.push({failAt,error,dimensions:acquired.map(c=>[c.width,c.height])});
    }
    return results;
  },{source,assets});
}finally{await browser.close();}
for(const result of evidence.bodyFactory){
  assert.ok(result.error,`Missing context at body allocation${result.failAt} reports failure`);
  assert.ok(result.dimensions.every(([w,h])=>w===1&&h===1),`Body allocation${result.failAt} releases earlier and partial buffers`);
}
if(process.env.FLIGHT_PREPARATION_EVIDENCE)fs.writeFileSync(process.env.FLIGHT_PREPARATION_EVIDENCE,JSON.stringify(evidence,null,2)+'\n');
console.log('Flight preparation passed: legacy/sectioned partial cleanup, once-only fallback, missing-image suppression, stale source-switch callbacks and disposed buffers.');
