import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const character=()=>null,assets={wing:'registered-perspective-art'};
const m={exports:{}};
new Function('require','module','exports',ts.transpileModule(fs.readFileSync('app/components/ArrivalBird.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText)(name=>{
  if(name==='./AnatomicalBird')return {AnatomicalBird:character,ANATOMICAL_ART:assets};
  if(name==='react/jsx-runtime')return {};
  throw new Error('Unexpected renderer dependency '+name);
},m,m.exports);
assert.equal(m.exports.ArrivalBird,character,'The opening uses the exact study character, with one maintained renderer');
assert.equal(m.exports.ARRIVAL_ART,assets,'The preparation barrier shares the actual character asset registry');
console.log('Opening renderer alias passed: the accepted study actor and its essential artwork registry are shared.');
