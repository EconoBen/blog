import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(await readFile('app/components/GrebeField.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const element = {dataset:{}}, listeners = new Map(), timers = new Map(), effects = [];
let time = 100, nextId = 0;
const surface = {addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
const context = {exports:{}, innerHeight:1000, performance:{now:()=>time},
  setTimeout:fn=>{timers.set(++nextId,fn);return nextId;},clearTimeout:id=>timers.delete(id),
  window:{...surface,matchMedia:()=>({matches:false})},document:{documentElement:surface},
  require:name=>name==='react'?{useState:()=>[[],()=>{}],useRef:()=>({current:element}),useEffect:fn=>effects.push(fn)}:
    name==='react/jsx-runtime'?{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}:{},
};
vm.runInNewContext(code,context);
const tree=context.exports.GrebeField({variant:'home'});
const peeker=tree.props.children[1];peeker.type();const cleanup=effects.pop()();
const move=(x,y,delta)=>{time+=delta;listeners.get('pointermove')({pointerType:'mouse',clientX:x,clientY:y});};
move(50,430,100);
assert.equal(element.dataset.mood,'curious');
move(150,430,10);
assert.equal(element.dataset.mood,'shy');
for(const fn of timers.values())fn();timers.clear();
assert.equal(element.dataset.mood,'curious','A stationary visitor should see the peeker return');
move(500,430,100);assert.equal(element.dataset.mood,'idle');
cleanup();assert.equal(listeners.size+timers.size,0);
console.log('Curious peeker passed: gentle approach, startle, stationary recovery, departure and cleanup.');
