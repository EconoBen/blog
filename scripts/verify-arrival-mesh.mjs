import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const module = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('app/components/arrivalMesh.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
new Function('module', 'exports', code)(module, module.exports);
const { makeGrid, triangleAffine, drawTexturedMesh, createMeshCoverage } = module.exports;
assert.equal(typeof createMeshCoverage, 'function', 'Static artwork needs reusable conservative alpha coverage');
const apply = (matrix, p) => ({x:matrix.a*p.x+matrix.c*p.y+matrix.e,y:matrix.b*p.x+matrix.d*p.y+matrix.f});
const near = (a,b,message) => assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<1e-8,message);
const source = [{x:4,y:7},{x:46,y:12},{x:11,y:53}];
for (const warp of [p=>({...p}),p=>({x:100-p.y*2,y:20+p.x*2}),p=>({x:13+p.x*.7+p.y*.4,y:-8-p.x*.2+p.y*1.6}),p=>({x:-p.x,y:p.y})]) {
  const target = source.map(warp), matrix = triangleAffine(source,target);
  assert.ok(matrix,'Valid rotations, shear and reflection all have a mapping');
  source.forEach((point,index)=>near(apply(matrix,point),target[index],'Every triangle landmark must map to its target'));
  const interior = {x:source[0].x*.2+source[1].x*.3+source[2].x*.5,y:source[0].y*.2+source[1].y*.3+source[2].y*.5};
  near(apply(matrix,interior),warp(interior),'The mapping must interpolate interior texture continuously');
}
const collinear = [{x:0,y:0},{x:10,y:10},{x:20,y:20}];
assert.equal(triangleAffine(collinear,source),null);
assert.equal(triangleAffine(source,collinear),null);
assert.equal(triangleAffine([{x:NaN,y:0},...source.slice(1)],source),null);
assert.equal(triangleAffine(source,[{x:0,y:Infinity},...source.slice(1)]),null);
assert.equal(triangleAffine([{x:0,y:0},{x:1e9,y:0},{x:1e9,y:1e-7}],source),null,'Numerically collapsed triangles must not generate explosive transforms');

let calls=0;
const grid = makeGrid(80,60,4,3,p=>{calls++;return {x:p.x+Math.sin(p.y/60*Math.PI)*8,y:p.y+Math.sin(p.x/80*Math.PI)*6};});
assert.equal(grid.vertices.length,20); assert.equal(grid.triangles.length,24); assert.equal(calls,20,'Shared vertices are deformed once');
assert.deepEqual(grid.vertices[0].source,{x:0,y:0}); assert.deepEqual(grid.vertices.at(-1).source,{x:80,y:60});
const sourceArea = grid.triangles.reduce((sum,indices)=>{
  const [a,b,c] = indices.map(index=>grid.vertices[index].source);
  const area=((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))/2;
  assert.ok(area>0,'Grid triangles retain consistent winding'); return sum+area;
},0);
assert.equal(sourceArea,80*60,'Triangles cover the artwork exactly once');
const edges = new Map();
for (const indices of grid.triangles) {
  const vertices=indices.map(index=>grid.vertices[index]), matrix=triangleAffine(vertices.map(v=>v.source),vertices.map(v=>v.target));
  for (const [a,b] of [[indices[0],indices[1]],[indices[1],indices[2]],[indices[2],indices[0]]]) {
    const key=[a,b].sort((x,y)=>x-y).join(',');
    if (edges.has(key)) for (const fraction of [.1,.4,.7,.9]) {
      const start=grid.vertices[a].source,end=grid.vertices[b].source,point={x:start.x+(end.x-start.x)*fraction,y:start.y+(end.y-start.y)*fraction};
      near(apply(matrix,point),apply(edges.get(key),point),'Adjacent triangles must agree along their entire shared texture edge');
    }
    else edges.set(key,matrix);
  }
}
const mutated = makeGrid(10,10,1,1,p=>{p.x+=9;return p;});
assert.deepEqual(mutated.vertices[0],{source:{x:0,y:0},target:{x:9,y:0}},'An in-place deformation cannot overwrite source texture coordinates');
const huge=makeGrid(1e308,10,2,1,p=>p);
assert.ok(huge.vertices.every(vertex=>Number.isFinite(vertex.source.x)&&Number.isFinite(vertex.source.y)),'Finite dimensions must not overflow while computing subdivision points');
for (const args of [[0,20,2,2],[20,-1,2,2],[Infinity,20,2,2],[20,20,0,2],[20,20,2.5,2]]) assert.throws(()=>makeGrid(...args,p=>p),RangeError);

function canvas(throwOnDraw=false,currentTransform=null) {
  let path=[], depth=0;
  const clips=[], transforms=[], draws=[];
  return {
    clips,transforms,draws,get depth(){return depth;},
    ...(currentTransform ? {getTransform:()=>currentTransform} : {}),
    save(){depth++;},restore(){depth--;},beginPath(){path=[];},moveTo(x,y){path.push({x,y});},lineTo(x,y){path.push({x,y});},closePath(){},
    clip(){clips.push(path);},transform(...values){transforms.push(values);},
    drawImage(...args){if(throwOnDraw)throw new Error('Image unavailable');draws.push(args);},
  };
}
const image={width:80,height:60}, ctx=canvas();
drawTexturedMesh(ctx,image,grid);
assert.equal(ctx.draws.length,24); assert.equal(ctx.depth,0,'Canvas save/restore stays balanced');
assert.ok(ctx.draws.every(args=>args[0]===image&&args[1]===0&&args[2]===0),'The mapping uses original artwork coordinates');
assert.ok(ctx.transforms.flat().every(Number.isFinite));
function inside(point,polygon) {
  const signs=polygon.map((a,index)=>{const b=polygon[(index+1)%polygon.length];return (b.x-a.x)*(point.y-a.y)-(b.y-a.y)*(point.x-a.x);});
  return signs.every(value=>value>=-1e-8)||signs.every(value=>value<=1e-8);
}
for (let index=0;index<grid.triangles.length;index++) {
  const points=grid.triangles[index].map(vertex=>grid.vertices[vertex].target);
  assert.ok(points.every(point=>inside(point,ctx.clips[index])),'Seam expansion must retain every mapped landmark');
  for (let edge=0;edge<3;edge++) {
    const a=points[edge],b=points[(edge+1)%3],length=Math.hypot(b.x-a.x,b.y-a.y);
    const justOutside={x:(a.x+b.x)/2+(b.y-a.y)/length*.25,y:(a.y+b.y)/2-(b.x-a.x)/length*.25};
    assert.ok(inside(justOutside,ctx.clips[index]),'Clipped artwork overlaps each shared edge enough to prevent antialias gaps');
  }
}
const invalid={vertices:[...grid.vertices,{source:{x:0,y:0},target:{x:Infinity,y:0}}],triangles:[[0,0,1],[0,1,20],[0,1,900],grid.triangles[0]]};
const safe=canvas();drawTexturedMesh(safe,image,invalid);assert.equal(safe.draws.length,1,'Invalid or collapsed triangles are skipped without discarding valid neighbors');assert.equal(safe.depth,0);
const failed=canvas(true);assert.throws(()=>drawTexturedMesh(failed,image,grid),/Image unavailable/);assert.equal(failed.depth,0,'Drawing failures restore the caller canvas state');
for (const transform of [{a:0,b:0,c:0,d:0,e:0,f:0},{a:NaN,b:0,c:0,d:1,e:0,f:0}]) {
  const invalidContext=canvas(false,transform);drawTexturedMesh(invalidContext,image,grid);
  assert.equal(invalidContext.draws.length,0,'Collapsed or nonfinite camera transforms do not paint invalid geometry');assert.equal(invalidContext.depth,0);
}
for (const transform of [{a:.25,b:0,c:0,d:.25,e:0,f:0},{a:.35,b:.12,c:.2,d:.6,e:5,f:9},{a:-.4,b:0,c:0,d:.4,e:40,f:10}]) {
  const scaled=canvas(false,transform);drawTexturedMesh(scaled,image,grid);
  for (let index=0;index<grid.triangles.length;index++) {
    const points=grid.triangles[index].map(vertex=>apply(transform,grid.vertices[vertex].target));
    const polygon=scaled.clips[index].map(point=>apply(transform,point));
    const [a,b,c]=points, direction=Math.sign((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x));
    for (let edge=0;edge<3;edge++) {
      const from=points[edge],to=points[(edge+1)%3],length=Math.hypot(to.x-from.x,to.y-from.y);
      const outside={x:(from.x+to.x)/2+direction*(to.y-from.y)/length*.25,y:(from.y+to.y)/2-direction*(to.x-from.x)/length*.25};
      assert.ok(inside(outside,polygon),'Seam coverage must remain effective in backing pixels after downscaling, shear or reflection');
    }
  }
}

// A real, offline Canvas2D raster check catches antialias cracks that coordinate
// assertions alone cannot detect. Each downscale resembles the source-sized rig.
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage();
  const raster=await page.evaluate(code=>{
    const module={exports:{}};new Function('module','exports',code)(module,module.exports);
    const {makeGrid,drawTexturedMesh}=module.exports;
    const image=document.createElement('canvas');image.width=960;image.height=720;
    const source=image.getContext('2d');source.fillStyle='#294e43';source.fillRect(0,0,960,720);
    const results=[];
    for(const scale of [.15,.25,.4,.8]) {
      const target=document.createElement('canvas');target.width=1000;target.height=760;
      const ctx=target.getContext('2d');ctx.setTransform(scale,0,0,scale,13,17);ctx.fillStyle='#aabbcc';
      const before=ctx.getTransform().toString();
      drawTexturedMesh(ctx,image,makeGrid(960,720,12,9,p=>p));
      const pixels=ctx.getImageData(0,0,1000,760).data;let minimumAlpha=255;
      for(let y=19;y<720*scale+15;y++)for(let x=15;x<960*scale+11;x++)minimumAlpha=Math.min(minimumAlpha,pixels[(y*1000+x)*4+3]);
      results.push({scale,minimumAlpha,before,after:ctx.getTransform().toString(),fillStyle:ctx.fillStyle,outsideAlpha:pixels[3]});
    }
    return results;
  },code);
  const coverageResults=await page.evaluate(code=>{
    const module={exports:{}};new Function('module','exports',code)(module,module.exports);
    const {makeGrid,drawTexturedMesh,createMeshCoverage}=module.exports;
    const image=document.createElement('canvas');image.width=192;image.height=128;
    const ink=image.getContext('2d');
    ink.fillStyle='#294e43';ink.beginPath();ink.ellipse(137,93,35,19,-.3,0,Math.PI*2);ink.fill();
    ink.strokeStyle='#b78642';ink.lineWidth=.6;ink.beginPath();ink.moveTo(124.4,55.2);ink.bezierCurveTo(150.7,40.3,160.1,66.8,177.2,83.4);ink.stroke();
    // Isolated opaque and nearly transparent pixels sit exactly against cell
    // boundaries, outside the large silhouette and at the image perimeter.
    const marks=ink.createImageData(192,128);
    for(const [x,y,alpha] of [[31,31,255],[64,16,1],[191,127,150],[0,126,255]]) {
      const i=(y*192+x)*4;marks.data.set([230,80,50,alpha],i);
    }
    const marksCanvas=document.createElement('canvas');marksCanvas.width=192;marksCanvas.height=128;
    marksCanvas.getContext('2d').putImageData(marks,0,0);ink.drawImage(marksCanvas,0,0);
    let reads=0;const read=ink.getImageData.bind(ink);ink.getImageData=(...args)=>{reads++;return read(...args);};
    const coverage=createMeshCoverage(image),results=[];
    for(const quality of ['low','medium','high'])for(const transform of [[.15,0,0,.15,25,25],[.4,.1,-.08,.5,50,20],[1.5,0,0,1.5,20,20],[-.8,0,0,.8,220,30],[.025,.01,0,.7,55,15]]) {
      const outputs=[];
      for(const mask of [undefined,coverage]) {
        const surface=document.createElement('canvas');surface.width=400;surface.height=280;
        const ctx=surface.getContext('2d');ctx.setTransform(...transform);ctx.imageSmoothingQuality=quality;
        let draws=0;const draw=ctx.drawImage.bind(ctx);ctx.drawImage=(...args)=>{draws++;return draw(...args);};
        const mesh=makeGrid(192,128,12,8,p=>({x:p.x+Math.sin(p.y/128*Math.PI)*17,y:p.y+Math.sin(p.x/192*Math.PI)*9}));
        drawTexturedMesh(ctx,image,mesh,mask);
        outputs.push({pixels:ctx.getImageData(0,0,400,280).data,draws});
      }
      let changed=0,maxDelta=0;
      for(let i=0;i<outputs[0].pixels.length;i++)if(outputs[0].pixels[i]!==outputs[1].pixels[i]) {
        changed++;maxDelta=Math.max(maxDelta,Math.abs(outputs[0].pixels[i]-outputs[1].pixels[i]));
      }
      results.push({quality,transform,changed,maxDelta,fullDraws:outputs[0].draws,maskedDraws:outputs[1].draws});
    }
    const failed=document.createElement('canvas');failed.width=8;failed.height=8;
    failed.getContext('2d').getImageData=()=>{throw new DOMException('Unreadable','SecurityError');};
    const empty=document.createElement('canvas');empty.width=192;empty.height=128;
    const emptyMask=createMeshCoverage(empty),target=document.createElement('canvas');target.width=200;target.height=160;
    const ctx=target.getContext('2d');let emptyDraws=0;const draw=ctx.drawImage.bind(ctx);ctx.drawImage=(...args)=>{emptyDraws++;return draw(...args);};
    drawTexturedMesh(ctx,empty,makeGrid(192,128,12,8,p=>p),emptyMask);
    const emptyCount=emptyDraws;
    // A resized texture cannot accidentally reuse coverage for another size.
    empty.width=193;
    drawTexturedMesh(ctx,empty,makeGrid(193,128,12,8,p=>p),emptyMask);
    return {results,reads,unreadable:createMeshCoverage(failed),coverageBytes:coverage?.sums.byteLength,emptyDraws:emptyCount,mismatchDraws:emptyDraws-emptyCount};
  },code);
  assert.equal(coverageResults.reads,1,'Static alpha is read once, never during animation frames');
  assert.equal(coverageResults.unreadable,null,'Unreadable artwork falls back to complete rendering');
  assert.equal(coverageResults.emptyDraws,0,'Completely transparent artwork needs no drawing operations');
  assert.equal(coverageResults.mismatchDraws,192,'Resized artwork falls back to complete rendering');
  assert.ok(coverageResults.coverageBytes<3000,'Coverage stores coarse occupancy rather than a full-resolution integral image');
  for(const result of coverageResults.results) {
    assert.equal(result.changed,0,`Culling changed artwork pixels (${result.quality}, transform ${result.transform}, maximum channel delta ${result.maxDelta})`);
    if(result.transform[0]===1.5)assert.ok(result.maskedDraws<result.fullDraws*.6,'A sparse silhouette must meaningfully reduce empty draw calls');
  }
  const realArtwork=await page.evaluate(async ({sources,bodyUrl})=>{
    const modules={};function load(name){if(modules[name])return modules[name];const m={exports:{}};new Function('module','exports','require',sources[name])(m,m.exports,p=>load(p.slice(2)));return modules[name]=m.exports;}
    const {makeGrid,drawTexturedMesh,createMeshCoverage}=load('arrivalMesh');
    const {ARRIVAL_BODY_OUTLINE,bodyPoint,birdAnatomy}=load('arrivalRig');
    const plate=new Image();plate.src=bodyUrl;await plate.decode();
    const image=document.createElement('canvas');image.width=1536;image.height=1024;
    const ink=image.getContext('2d');ink.clip(new Path2D(ARRIVAL_BODY_OUTLINE));ink.drawImage(plate,0,0);
    const mask=createMeshCoverage(image),results=[];
    for(const flight of [0,.4,1])for(const scale of [.2,.6]) {
      const state=birdAnatomy(9000,{awake:1,wings:1,flight}),mesh=makeGrid(1536,1024,16,12,p=>bodyPoint(p,state)),renders=[];
      for(const coverage of [undefined,mask]) {
        const target=document.createElement('canvas');target.width=1100;target.height=750;const ctx=target.getContext('2d');ctx.setTransform(scale,0,0,scale,25,25);
        let calls=0;const draw=ctx.drawImage.bind(ctx);ctx.drawImage=(...args)=>{calls++;return draw(...args);};
        drawTexturedMesh(ctx,image,mesh,coverage);renders.push({calls,pixels:ctx.getImageData(0,0,1100,750).data});
      }
      let changed=0;for(let i=0;i<renders[0].pixels.length;i++)if(renders[0].pixels[i]!==renders[1].pixels[i])changed++;
      results.push({flight,scale,changed,fullDraws:renders[0].calls,maskedDraws:renders[1].calls});
    }
    // The mask cannot optimize away destructive transparent paint or filtered
    // pixels. Those uncommon contexts retain the existing full renderer.
    const effects=[];
    for(const effect of ['copy','destination-in','filter','shadow']) {
      const renders=[];
      for(const coverage of [undefined,mask]) {
        const target=document.createElement('canvas');target.width=200;target.height=160;const ctx=target.getContext('2d');ctx.fillStyle='#b78642';ctx.fillRect(0,0,200,160);ctx.scale(.1,.1);
        if(effect==='filter')ctx.filter='blur(12px)';else if(effect==='shadow'){ctx.shadowColor='#103a2f';ctx.shadowOffsetX=15;ctx.shadowBlur=10;}else ctx.globalCompositeOperation=effect;
        let calls=0;const draw=ctx.drawImage.bind(ctx);ctx.drawImage=(...args)=>{calls++;return draw(...args);};
        drawTexturedMesh(ctx,image,makeGrid(1536,1024,4,3,p=>p),coverage);renders.push({calls,pixels:ctx.getImageData(0,0,200,160).data});
      }
      effects.push({effect,same:renders[0].pixels.every((value,i)=>value===renders[1].pixels[i]),full:renders[0].calls,masked:renders[1].calls});
    }
    return {results,effects,coverageBytes:mask.sums.byteLength};
  },{sources:Object.fromEntries(['arrivalMesh','arrivalRig','arrivalTimeline'].map(name=>[name,ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText])),bodyUrl:'data:image/webp;base64,'+fs.readFileSync('public/assets/grebes/arrival/engraving-plate-v2.webp').toString('base64')});
  for(const result of realArtwork.results) {
    assert.equal(result.changed,0,`Coverage must preserve the real bird raster in flight ${result.flight} at ${result.scale}×`);
    assert.ok(result.maskedDraws<result.fullDraws*.7,'The real bird should skip at least 30% of empty drawing operations');
  }
  for(const result of realArtwork.effects) {
    assert.equal(result.same,true,`${result.effect} effects retain their complete raster behavior`);
    assert.equal(result.masked,result.full,'Unusual paint effects bypass alpha culling');
  }
  assert.ok(realArtwork.coverageBytes<110000,'A full-size engraved plate needs only a small occupancy table');
  console.log('Artwork coverage:',JSON.stringify(realArtwork.results),'cached bytes:',realArtwork.coverageBytes);
  for(const result of raster) {
    assert.ok(result.minimumAlpha>=250,`Opaque downscaled artwork has raster seams at ${result.scale}× (minimum alpha ${result.minimumAlpha})`);
    assert.equal(result.before,result.after);assert.equal(result.fillStyle,'#aabbcc');assert.equal(result.outsideAlpha,0);
  }
} finally {await browser.close();}
console.log('Arrival mesh passed: affine landmarks, continuous shared edges, invalid-triangle isolation, transformed seam overlap, real Canvas2D downscales, lossless cached alpha culling, and preserved canvas state.');
