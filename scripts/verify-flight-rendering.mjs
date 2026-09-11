import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(window, 'devicePixelRatio', { value: 3 });
const images = [], contexts = new WeakMap(), meshCalls = [], preparations = [], ownedTextures = [], coverageReads = [], compositions = [];
const sectionFixtures = [{ x: 70, width: 430 }, { x: 360, width: 670 }, { x: 900, width: 610 }];
let preparedSections;
class FakeImage {
  complete = false; naturalWidth = 0; onload = null;
  constructor() { images.push(this); }
  set src(value) { this.url = value; }
  finish() { this.complete = true; this.naturalWidth = 1536; this.onload?.(); }
}
globalThis.Image = FakeImage;
globalThis.Path2D = class {};
const canvasNodes=[];
window.HTMLCanvasElement.prototype.getContext = function () {
  if (!contexts.has(this)) { const stack = []; canvasNodes.push(this);contexts.set(this, {
    globalAlpha: 1,
    draws: [], drawEvents: [], clears: 0, setTransform() {}, clearRect() { this.clears++; },
    save() { stack.push(this.globalAlpha); }, restore() { this.globalAlpha = stack.pop(); }, beginPath() {}, rect() {}, clip() {}, translate() {}, scale() {},fillRect(){},createRadialGradient(){return {addColorStop(){}};},
    drawImage(...args) { this.draws.push(args); this.drawEvents.push({args,alpha:this.globalAlpha}); },
  });}
  return contexts.get(this);
};
function texture(width = 1536, height = 1024) { const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; ownedTextures.push(canvas); return canvas; }
const module = { exports: {} };
new Function('require', 'module', 'exports', ts.transpileModule(fs.readFileSync('app/components/AnatomicalBird.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText)(name => {
  if (name === './arrivalArtwork') return {
    createArrivalTextures() {
      preparations.push('body'); const body = texture(), covert = texture();
      return { body, compose: (...args) => { compositions.push(args); return body; }, coverts: { canvas: covert, x: 0, y: 0 }, dispose() { body.width = body.height = covert.width = covert.height = 1; } };
    },
    createArrivalWing() { preparations.push('wing'); return texture(); },
  };
  if(name==='./arrivalFlightArtwork')return {FLIGHT_WING_ASSET:'/assets/grebes/arrival/flight-wings-v2.webp',createFlightWingTextures(){preparations.push('wing');const blends=Array.from({length:5},()=>texture(1536,512));return {blends,dispose(){for(const t of blends)t.width=t.height=1;}};}};
  if(name==='./arrivalWingSections')return {SECTIONED_WING_ASSET:'/assets/grebes/arrival/flight-wings-v3.webp',createSectionedWingTextures(){
    preparations.push('sectioned-wing'); const sections=sectionFixtures.map(section=>({...section,blends:Array.from({length:5},()=>texture(section.width,512))}));preparedSections=sections;
    return {sections,dispose(){for(const section of sections)for(const canvas of section.blends)canvas.width=canvas.height=1;}};
  }};
  if(name==='./arrivalFlightRig')return {flightBodyPoint:p=>p,flightWingPoint:p=>p,flightWingFrame:()=>({underside:.5}),flightWingMaterial:state=>state.wings};
  if (name === './arrivalMesh') return {
    createMeshCoverage(image) { const coverage = { image }; coverageReads.push(coverage); return coverage; },
    makeGrid: (width,height,columns,rows,deform) => ({width,height,columns,rows,start:deform({x:0,y:0}),end:deform({x:width,y:height})}),
    drawTexturedMesh(ctx, image, mesh, coverage) { meshCalls.push({ ctx, image, mesh, coverage, alpha:ctx.globalAlpha }); ctx.drawImage(image, 0, 0); },
  };
  if (name === './arrivalTimeline') {
    const timeline={exports:{}};
    new Function('module','exports',ts.transpileModule(fs.readFileSync('app/components/arrivalTimeline.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(timeline,timeline.exports);
    return timeline.exports;
  }
  if (name === './arrivalRig') return { birdAnatomy: (_time,controls) => controls, bodyPoint: p => p, wingPoint: p => p };
  return require(name);
}, module, module.exports);
const { createRoot } = await import('react-dom/client');
const root = createRoot(document.getElementById('root'));
const defaults = { elapsedMs: 3300, size: 846, x: 720, y: 567, wings: 1, reflectionOpacity: .16, clipAtWaterline: true, wingProfile: 'current' };
const render = props => act(() => root.render(React.createElement(module.exports.AnatomicalBird, { ...defaults, ...props })));
try {
  await render({});
  await act(() => images.slice(0,3).forEach(image => image.finish()));
  assert.equal(preparations.length,0,'The new exposed-flank image participates in the preparation barrier');
  await act(() => images[3].finish());
  assert.equal(compositions.at(-1)[2],true,'Opening exposes the flank before the moving wing is visible');
  const main = document.querySelector('.arrival-bird:not(.arrival-bird-reflection) canvas');
  const reflected = document.querySelector('.arrival-bird-reflection canvas');
  assert.ok(main && reflected, 'One actor owns a visible body and a separate water reflection');
  assert.equal(images.length, 4, 'The reflection shares the four loaded source images');
  assert.deepEqual(preparations, ['body', 'wing'], 'The reflection shares one set of prepared artwork');
  assert.equal(meshCalls.length, 4, 'Body, two wings and coverts are rendered once for the complete frame');
  assert.equal(coverageReads.length, 7, 'Body, five wing surfaces and shoulder coverage is prepared once');
  assert.equal(canvasNodes.filter(canvas=>canvas!==main&&canvas!==reflected).length,1,'Legacy rendering prepares its shoulder without allocating a compositing surface');
  assert.ok(meshCalls.every(call => call.coverage?.image === call.image), 'Every body, wing and covert draw receives its corresponding cached coverage');
  assert.deepEqual(contexts.get(reflected).draws, [[main, 0, 0]], 'The reflection copies the completed actor frame without a second mesh pass');
  assert.ok(main.closest('.arrival-hero-air'), 'The main actor retains the fixed waterline clipping wrapper');
  assert.equal(reflected.closest('.arrival-hero-air'), null, 'The reflected actor remains below the waterline clip');
  assert.ok(reflected.parentElement.style.transform.endsWith('scaleY(-.32)'), 'Reflection retains the existing compressed mirror transform');
  assert.equal(reflected.parentElement.style.opacity, '.16'.replace(/^\./, '0.'));
  assert.equal(reflected.parentElement.style.left, main.parentElement.style.left);
  assert.equal(reflected.parentElement.style.top, main.parentElement.style.top);
  for (const surface of [main, reflected]) assert.ok(surface.width * surface.height <= 2_000_000, 'Both backing stores retain the two-million-pixel cap');

  let draws = meshCalls.length, copies = contexts.get(reflected).draws.length;
  await render({ elapsedMs: 4101, reflectionOpacity: 0 });
  assert.equal(meshCalls.length - draws, 4, 'The main actor continues after its reflection disappears');
  assert.equal(contexts.get(reflected).draws.length, copies, 'An invisible reflection performs no copy');
  draws = meshCalls.length;
  await render({ elapsedMs: 4200, opacity: 0, reflectionOpacity: 0 });
  assert.equal(meshCalls.length, draws, 'An invisible actor performs no mesh work');
  await render({ elapsedMs: 4200, opacity: 1, reflectionOpacity: .12, size: 429 });
  assert.equal(meshCalls.length - draws, 4, 'Restoring visibility at the same timestamp redraws the current pose');
  assert.equal(contexts.get(reflected).draws.length, copies + 1, 'A restored reflection copies the freshly resized frame');
  assert.equal(reflected.width, main.width);
  assert.equal(reflected.height, main.height);
  assert.equal(coverageReads.length, 7, 'Per-frame updates and resize do not reread source pixels');
  await render({elapsedMs:11000,wings:.2});
  assert.equal(compositions.at(-1)[2],false,'Returning flight keeps its longer material transition');
  const beforeRest=meshCalls.length;
  await render({elapsedMs:16649,wings:0,flight:0,reflectionOpacity:0});
  assert.equal(meshCalls.length,beforeRest,'The final resting image avoids triangle-by-triangle minification');
  assert.equal(contexts.get(main).draws.at(-1)[0],ownedTextures[0],'The handoff uses the exact original resident engraving');
  assert.equal(contexts.get(main).imageSmoothingQuality,'high');

  const previousMaterials=[...new Set([...ownedTextures,...canvasNodes])].filter(canvas=>canvas!==main&&canvas!==reflected);
  const previousCoverage=coverageReads.length;
  await render({elapsedMs:3300,wingProfile:'sectioned',opacity:0,wings:.4});
  assert.equal(images.length,8,'A changed source starts one new four-image preparation');
  assert.equal(images.at(-1).url,'/assets/grebes/arrival/flight-wings-v3.webp','The sectioned profile loads its matching artwork');
  assert.ok(previousMaterials.every(canvas=>canvas.width===1&&canvas.height===1),'Switching source releases the previous body, wing and shoulder buffers');
  assert.equal(document.querySelector('.arrival-bird:not(.arrival-bird-reflection) canvas'),main,'The actor keeps the same visible canvas across an isolated source switch');
  await act(()=>images.slice(4,7).forEach(image=>image.finish()));
  assert.deepEqual(preparations,['body','wing'],'Partial revised artwork cannot prepare early');
  await act(()=>images[7].finish());
  assert.deepEqual(preparations,['body','wing','body','sectioned-wing'],'Exactly one selected factory prepares the revised source');
  assert.equal(coverageReads.length-previousCoverage,17,'The revised actor caches body, fifteen cropped materials and shoulder once');
  assert.equal(preparedSections.flatMap(section=>section.blends).length,15);
  for(const section of preparedSections)for(const canvas of section.blends)assert.deepEqual([canvas.width,canvas.height],[section.width,512],'Section textures retain their cropped dimensions');
  draws=meshCalls.length;copies=contexts.get(reflected).draws.length;
  await render({elapsedMs:3350,wingProfile:'sectioned',opacity:1,wings:.4,size:429,reflectionOpacity:.12});
  const selected=meshCalls.slice(draws), ordered=[...preparedSections].reverse().map(section=>section.blends[2]);
  assert.equal(selected.length,8,'One pose renders two three-part wings, one body and one shoulder');
  assert.deepEqual(selected.slice(0,3).map(call=>call.image),ordered,'Far wing paints outer feathers, inner feathers, then root');
  assert.deepEqual(selected.slice(4,7).map(call=>call.image),ordered,'Near wing paints the same layered section order');
  for(const call of [...selected.slice(0,3),...selected.slice(4,7)]){
    const section=preparedSections.find(section=>section.blends.includes(call.image));
    assert.equal(call.mesh.width,section.width);
    assert.equal(call.mesh.height,512);
    assert.deepEqual(call.mesh.start,{x:section.x,y:0},'Cropped vertices preserve the original source offset');
    assert.deepEqual(call.mesh.end,{x:section.x+section.width,y:512});
    assert.equal(call.alpha,1,'All feather triangles paint opaquely before layer compositing');
    assert.equal(call.coverage?.image,call.image);
  }
  assert.equal(selected[3].alpha,1,'Wing opacity must not leak into the body draw');
  assert.equal(selected[7].alpha,1,'The shoulder paints inside the near-wing composition');
  const scratch=canvasNodes.find(canvas=>canvas!==main&&canvas!==reflected&&!previousMaterials.includes(canvas)&&canvas.width===main.width&&canvas.height===main.height);
  assert.ok(scratch,'Partial material owns one capped scratch surface');
  assert.ok([...selected.slice(0,3),...selected.slice(4,8)].every(call=>call.ctx===contexts.get(scratch)),'Both complete wings, including near shoulder, use that same scratch surface');
  const layerCopies=contexts.get(main).drawEvents.filter(event=>event.args[0]===scratch);
  assert.deepEqual(layerCopies.map(event=>event.alpha),[.4,.4],'Material opacity is applied once when each complete wing is copied');
  assert.ok(scratch.width*scratch.height<=2_000_000);
  assert.equal(contexts.get(scratch).clears,2,'The reusable surface is cleared between far and near wings');
  assert.equal(contexts.get(reflected).draws.length,copies+1,'The three-section reflection still copies one completed frame');
  assert.deepEqual(contexts.get(reflected).draws.at(-1),[main,0,0]);
  for(const surface of [main,reflected])assert.ok(surface.width*surface.height<=2_000_000);
  const preparedCount=preparations.length, coverageCount=coverageReads.length;
  const allocations=canvasNodes.length;
  await render({elapsedMs:3380,wingProfile:'sectioned',opacity:1,wings:.5,size:2000,reflectionOpacity:0});
  assert.equal(canvasNodes.length,allocations,'Another partial frame resizes the existing element without allocating');
  assert.ok(scratch.width*scratch.height<=2_000_000,'A large actor still caps the scratch surface');
  assert.equal(scratch.width,main.width);assert.equal(scratch.height,main.height);
  const clears=contexts.get(scratch).clears;
  draws=meshCalls.length;
  await render({elapsedMs:5300,wingProfile:'sectioned',opacity:0,wings:1,reflectionOpacity:0});
  assert.equal(meshCalls.length,draws,'The hidden sectioned actor performs no drawing');
  assert.equal(contexts.get(scratch).clears,clears,'Hidden playback does not clear or copy the scratch surface');
  await render({elapsedMs:9000,wingProfile:'sectioned',opacity:1,wings:1,reflectionOpacity:0});
  assert.equal(meshCalls.length-draws,8);
  assert.equal(preparations.length,preparedCount,'Resuming the actor does not reprepare sections');
  assert.equal(coverageReads.length,coverageCount,'Visible phase changes do not reread cropped artwork');
  assert.deepEqual([scratch.width,scratch.height],[1,1],'Full-opacity flight releases the unused scratch backing store');
  const copiesAtFull=contexts.get(main).drawEvents.filter(event=>event.args[0]===scratch).length;
  await render({elapsedMs:16410,wingProfile:'sectioned',opacity:1,wings:.2,reflectionOpacity:0});
  assert.equal(canvasNodes.length,allocations,'Closing reuses the retained canvas element');
  assert.equal(contexts.get(main).drawEvents.filter(event=>event.args[0]===scratch).length,copiesAtFull+2);
  await render({elapsedMs:16410,wingProfile:'current',opacity:0,wings:.2,reflectionOpacity:0});
  assert.deepEqual([scratch.width,scratch.height],[1,1],'Changing artwork source disposes the partial closing buffer');
  const beforeDefaultImages=images.length, beforeDefaultCoverage=coverageReads.length;
  await render({elapsedMs:0,wingProfile:undefined,opacity:0,wings:0,reflectionOpacity:0});
  assert.equal(images.length,beforeDefaultImages+4,'Omitting the renderer profile switches the legacy fixture to the production sectioned source');
  assert.equal(images.at(-1).url,'/assets/grebes/arrival/flight-wings-v3.webp');
  await act(()=>images.slice(beforeDefaultImages).forEach(image=>image.finish()));
  assert.deepEqual(preparations.slice(-2),['body','sectioned-wing'],'The public renderer prepares sectioned artwork without requiring an explicit caller override');
  assert.equal(coverageReads.length-beforeDefaultCoverage,17,'The selected default prepares exactly fifteen cropped wing materials plus body and shoulder coverage');
  await act(() => root.unmount());
  for (const surface of [...new Set([main, reflected, ...ownedTextures,...canvasNodes])]) assert.deepEqual([surface.width, surface.height], [1, 1], 'Unmount releases every owned backing store');
  console.log('Anatomical rendering passed: legacy and sectioned preparation, cropped source offsets and feather order, shared opacity/reflection, visibility guards, source-switch cleanup and bounded owned buffers.');
} finally { dom.window.close(); }
