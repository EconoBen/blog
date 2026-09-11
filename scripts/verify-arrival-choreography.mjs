import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file);
  const module={exports:{}};
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
  new Function('require','module','exports',code)(name=>name.startsWith('./')?load(`app/components/${name.slice(2)}.ts`):require(name),module,module.exports);
  cache.set(file,module.exports);return module.exports;
}
const {arrivalPose}=load('app/components/arrivalChoreography.ts');
const {birdAnatomy,bodyPoint}=load('app/components/arrivalRig.ts');
const {flightDeployment,flightWingPoint}=load('app/components/arrivalFlightRig.ts');
const {ARRIVAL_BEATS:B}=load('app/components/arrivalTimeline.ts');
const {ArrivalSurface}=load('app/components/ArrivalSurface.tsx');
assert.ok(B.duration>=16000&&B.duration<=18000,'The complete two-pass film stays within the requested duration');
assert.ok(B.firstPassEnd<B.bookSettled&&B.bookSettled<B.secondPassStart,'Book settling follows the first traversal and precedes the second');
assert.ok(B.secondPassStart-B.bookSettled>=3000&&B.secondPassStart-B.bookSettled<=4000,'Reserve three to four seconds for reading the stationary book');
assert.ok(B.bookDepart>B.secondPassStart&&B.bookDepart<B.secondPassEnd,'The second bird approaches before collecting the book');
assert.ok(B.revealEnd>=B.secondPassEnd&&B.revealEnd<B.waterContact,'The departure completes the reveal before touchdown');
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const landmarks=[{x:1010,y:85},{x:1240,y:240},{x:1345,y:290},{x:220,y:700},{x:740,y:455},{x:1230,y:780}];
function world(p,bird,facing=1){
  const scale=bird.size/1536,angle=bird.rotate*Math.PI/180;
  const x=(p.x-760)*scale*facing,y=(p.y-850)*scale;
  return {x:bird.x+x*Math.cos(angle)-y*Math.sin(angle),y:bird.y+x*Math.sin(angle)+y*Math.cos(angle)};
}
// The SVG pivots at its quill tip (48,169). Project its conservative source
// bounds through the same scale, yaw and rotation used by the feather element.
function featherBounds(pose,view){
  const scale=Math.min(78,Math.max(46,view.width*.055))/90*pose.scale;
  const angle=pose.rotate*Math.PI/180,tilt=pose.tilt*Math.PI/180;
  const points=[[0,0],[90,0],[90,170],[0,170]].map(([x,y])=>{
    const dx=(x-48)*scale,dy=(y-169)*scale,z=-dx*Math.sin(tilt);
    const projectedX=dx*Math.cos(tilt),perspective=1-z/500;
    return {x:pose.x+(projectedX*Math.cos(angle)-dy*Math.sin(angle))/perspective,
      y:pose.y+(projectedX*Math.sin(angle)+dy*Math.cos(angle))/perspective};
  });
  return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),
    top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
}
for(const view of [{width:1440,height:900},{width:390,height:844},{width:844,height:390},{width:320,height:568},{width:2560,height:1080}]){
  const target={x:view.width*.65,y:view.height*.67,width:Math.min(view.width*.38,270)};
  for(const [start,end,name] of [[B.firstPassStart,B.firstPassEnd,'crossing'],[B.secondPassStart,B.secondPassEnd,'secondCrossing']]){
    const entry=arrivalPose(start,view,target)[name],exit=arrivalPose(end,view,target)[name];
    assert.ok(entry.x+entry.size<0&&exit.x-exit.size>view.width,'Both traversals begin and end with the whole bird beyond the viewport');
    let previousX=entry.x;
    for(let t=start+1;t<end;t+=25){
      const pass=arrivalPose(t,view,target)[name];
      assert.equal(pass.opacity,1,'A visible traversal stays opaque');
      assert.ok(pass.x>previousX,'Each traversal moves continuously left to right');
      previousX=pass.x;
    }
  }
  const first=arrivalPose((B.firstPassStart+B.firstPassEnd)/2,view,target).crossing;
  const second=arrivalPose((B.secondPassStart+B.secondPassEnd)/2,view,target).secondCrossing;
  assert.ok(second.size<first.size&&second.y<first.y,'The second traversal has a distinct depth and path');
  const held=arrivalPose(B.bookSettled,view,target).book;
  assert.equal(held.opacity,1);assert.equal(held.rotate,0);
  assert.ok(held.x-held.width/2>=24&&held.x+held.width/2<=view.width-24,'The settled card has readable phone margins');
  for(let t=B.bookSettled;t<B.secondPassStart;t+=100){
    const frame=arrivalPose(t,view,target);
    assert.deepEqual(frame.book,held,'The full reading pause has a stationary, opaque card');
    assert.equal(frame.crossing.opacity,0,'The first bird remains offscreen during the reading pause');
    assert.equal(frame.secondCrossing.opacity,0,'The second traversal waits until the reading pause ends');
    assert.equal(frame.reveal,0,'The pond remains intact throughout the book presentation');
  }
  assert.equal(arrivalPose(B.firstPassEnd,view,target).reveal,0,'The first pass introduces the publication without revealing the website');
  assert.equal(arrivalPose(B.revealEnd,view,target).reveal,1,'The second pass completes the website reveal');
  const collected=arrivalPose(B.secondPassEnd,view,target).book;
  assert.ok(collected.x-collected.width/2>view.width,'The same book leaves fully through the right edge');
  assert.equal(collected.opacity,0);
  const joinBefore=arrivalPose(B.secondPassEnd,view,target).secondCrossing;
  const joinAfter=arrivalPose(B.secondPassEnd,view,target).returning;
  assert.ok(distance(joinBefore,joinAfter)<.001,'The return starts exactly where the second traversal exits');
  assert.equal(joinBefore.size,joinAfter.size,'Banking does not replace the bird with a different scale');
  const joinDelta=.1;
  const passPrevious=arrivalPose(B.secondPassEnd-joinDelta,view,target).secondCrossing;
  const bankNext=arrivalPose(B.secondPassEnd+joinDelta,view,target).returning;
  const passVelocity={x:(joinBefore.x-passPrevious.x)/joinDelta,y:(joinBefore.y-passPrevious.y)/joinDelta};
  const bankVelocity={x:(bankNext.x-joinAfter.x)/joinDelta,y:(bankNext.y-joinAfter.y)/joinDelta};
  assert.ok(distance(passVelocity,bankVelocity)<.01,'The second flight enters the bank without stopping or changing velocity abruptly');
  assert.ok(Math.abs((joinBefore.rotate-passPrevious.rotate)-(bankNext.rotate-joinAfter.rotate))/joinDelta<.001,'The banking angle inherits the pass rotation velocity');
  const early=arrivalPose(B.featherStart+250,view,target).feather;
  const earlyBounds=featherBounds(early,view);
  assert.equal(early.opacity,1,'The falling feather is opaque promptly after the bird exits');
  assert.ok(earlyBounds.top>=8&&earlyBounds.bottom<view.height*.5&&earlyBounds.left>=8&&earlyBounds.right<=view.width-8,
    `The complete feather enters the visible upper pond promptly in ${view.width}×${view.height}`);
  for(const time of [0,500,1100,1900,2350,2850,3200]){
    const hero=arrivalPose(time,view,target).hero,state=birdAnatomy(time,hero);
    for(const landmark of landmarks){
      const p=world(bodyPoint(landmark,state),hero);
      assert.ok(p.x>=-1&&p.x<=view.width+1&&p.y>=-1&&p.y<=view.height*.63+1,`Resting landmark is clipped at${time}ms in${view.width}×${view.height}`);
    }
  }
  for(const boundary of [...Object.values(B),3190,3560,3588,3680,4080,4900,B.featherStart-220,B.waterContact-1050,B.waterContact-720,B.waterContact-280,B.waterContact-160]){
    const before=arrivalPose(boundary-.1,view,target),after=arrivalPose(boundary+.1,view,target);
    for(const name of ['hero','feather','crossing','secondCrossing','returning','book']){
      assert.ok(distance(before[name],after[name])<Math.max(view.width,view.height)*.002,`${name} jumps at${boundary}ms`);
      assert.ok(Object.values(after[name]).every(Number.isFinite));
    }
  }
  const touch=arrivalPose(B.waterContact,view,target).returning;
  assert.ok(distance(touch,target)<.001,'Touchdown reaches the measured pond waterline');
  const settled=arrivalPose(B.landEnd,view,target).returning;
  assert.equal(settled.size,target.width,'Final canvas uses the resident texture scale');
  assert.equal(settled.upright,1);assert.equal(settled.wings,0);assert.equal(settled.opacity,0);
  assert.equal(arrivalPose(B.landEnd-1,view,target).returning.opacity,1,'Bird remains opaque until the atomic handoff');
  assert.equal(arrivalPose(B.landEnd-1,view,target).resident,0);
  assert.equal(arrivalPose(B.landEnd,view,target).resident,1);
  const finalState=birdAnatomy(B.landEnd,{awake:1,wings:0,flight:0});
  for(const landmark of landmarks)assert.ok(distance(landmark,bodyPoint(landmark,finalState))<1e-8,'Final anatomy is the resident’s undeformed engraving');
  for(const boundary of [B.secondPassEnd+1,B.waterContact-1050,B.waterContact-720,B.waterContact-280,B.waterContact-160,B.waterContact,B.landEnd-1]){
    const points=[boundary-.1,boundary+.1].map(t=>{
      const pose=arrivalPose(t,view,target).returning,state=birdAnatomy(t,{awake:1,wings:pose.wings,flight:1-pose.upright});
      return [true,false].flatMap(near=>[{x:230,y:200},{x:1200,y:70},{x:1400,y:400}].map(p=>world(flightWingPoint(p,state,near),pose,-1)));
    });
    assert.ok(points[0].every((p,i)=>distance(p,points[1][i])<2),'Rendered wing landmarks remain continuous through return and folding');
  }
  const feather=arrivalPose(B.featherContact,view,target).feather;
  assert.equal(feather.y,view.height*.63);
  assert.ok(Math.abs(feather.x-view.width*.54)<1e-8,'Feather settles at the pond ripple origin');
  const almost=arrivalPose(B.featherContact-10,view,target).feather;
  assert.ok((feather.y-almost.y)/10<.02,'The quill slows gently before contact');
  const floating=arrivalPose(B.featherContact+100,view,target).feather;
  assert.equal(floating.x,feather.x);assert.equal(floating.y,feather.y);assert.equal(floating.opacity,1,'The contact remains readable before the feather fades');
  assert.equal(arrivalPose(B.rippleEnd,view,target).feather.opacity,0,'The quiet ripple beat clears the feather before the forward pass');
}
assert.ok(ArrivalSurface({elapsedMs:B.launchEnd-1,x:100,y:200,size:500}).props.style.opacity<.001);
assert.equal(ArrivalSurface({elapsedMs:B.launchEnd,x:100,y:200,size:500}),null);
for(const invalid of [0,-1,NaN,Infinity])assert.equal(ArrivalSurface({elapsedMs:2000,x:100,y:200,size:invalid}),null);
console.log('Arrival choreography passed: two complete traversals, stationary readable book hold, departure reveal, continuous bank position/velocity, visible resting landmarks, feather contact, exact resident pose and atomic handoff.');

// Unfold through the complete isolated-study motion before the powered stroke.
{
  const view={width:1440,height:900},target={x:1060,y:390,width:200};
  const early=arrivalPose(3100,view,target).hero,open=arrivalPose(3750,view,target).hero;
  assert.equal(early.wings,0);
  for(let time=3000;time<=3800;time+=5){
    assert.equal(arrivalPose(time,view,target).hero.wings,flightDeployment(time),'The production hero uses the selected study’s linear deployment control; joints provide its only easing');
  }
  assert.equal(open.wings,1);
  assert.equal(arrivalPose(4150,view,target).hero.flight,1,'Takeoff uses the accepted moderate flight pose');
  assert.ok(open.x>early.x+10,'Takeoff includes bounded forward acceleration across the water');
}
