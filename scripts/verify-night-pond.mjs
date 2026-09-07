import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';
const code = ts.transpileModule(await readFile('app/components/nightPondGraph.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context={exports:{}};vm.runInNewContext(code,context);
const {sharedTopics,pondPositions}=context.exports;
assert.deepEqual(Array.from(sharedTopics(['AI','Memory','AI'],['ai','Writing'])),['AI']);
assert.equal(sharedTopics(['Personal'],['Code']).length,0,'Connections must never be invented');
assert.equal(pondPositions(0).length,0);
for(const count of [1,20,50]){
 const positions=pondPositions(count);
 assert.equal(positions.length,count);
 assert.ok(positions.every(p=>p.x>=12&&p.x<=88&&p.y>=13&&p.y<=84));
 assert.equal(new Set(positions.map(p=>`${p.x},${p.y}`)).size,count);
}
console.log('Night pond passed: genuine topic connections, deterministic bounded layout and empty collection.');
const { pondMobileLayout } = context.exports;
assert.equal(typeof pondMobileLayout, 'function', 'Narrow screens need a layout that preserves touch-target spacing');
for (const count of [1, 19, 20, 50]) {
 const { positions, height } = pondMobileLayout(count);
 assert.equal(positions.length, count);
 for (const width of [264, 334]) {
  for (const [index, point] of positions.entries()) {
   assert.ok(point.x * width / 100 >= 22 && point.x * width / 100 <= width - 22, 'Targets remain inside the map');
   assert.ok(point.y >= 22 && point.y <= height - 22);
   for (const other of positions.slice(index + 1)) {
    assert.ok(Math.hypot((point.x - other.x) * width / 100, point.y - other.y) >= 48, 'Every narrow-screen target has at least 48px center spacing');
   }
  }
 }
}

const {createRequire} = await import('node:module');
const React = await import('react');
const {act} = React;
const {createRoot} = await import('react-dom/client');
const {JSDOM} = await import('jsdom');
const require = createRequire(import.meta.url);
const dom = new JSDOM('<div id="root"></div>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const component = {exports:{}};
const componentCode = ts.transpileModule(await readFile('app/components/NightPond.tsx','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
new Function('require','module','exports',componentCode)(id => {
 if (id.endsWith('.css')) return {};
 if (id === './nightPondGraph') return context.exports;
 if (id === 'next/link') return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
 return require(id);
},component,component.exports);
const root = createRoot(document.getElementById('root'));
try {
 await act(async()=>root.render(React.createElement(component.exports.NightPond,{essays:['A','B','C'].map(slug=>({slug,title:slug,summary:slug,tags:['Memory'],date:'2026-01-01'}))})));
 const related = document.querySelector('.night-pond-related button');
 related.focus();
 await act(async()=>related.click());
 assert.equal(document.activeElement.getAttribute('aria-label'),'B','Following a related essay keeps keyboard focus on its selected light');
 assert.equal(document.activeElement.getAttribute('aria-pressed'),'true');
 const target = document.activeElement;
 await act(async()=>target.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));
 assert.equal(document.activeElement.getAttribute('aria-label'),'C','Arrow keys continue from the newly selected essay');
 assert.equal(document.querySelectorAll('.night-pond-light[tabindex="0"]').length,1,'The map remains a single keyboard tab stop');
 console.log('Night pond interaction passed: separated mobile targets, related-essay focus and arrow navigation.');
} finally {
 await act(async()=>root.unmount());
 dom.window.close();
}
