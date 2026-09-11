import {bodyPoint,type BirdAnatomy} from './arrivalRig';
import type {Point} from './arrivalMesh';

const unit=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const p=unit(v);return p*p*p*(p*(p*6-15)+10);};
const rad=(v:number)=>v*Math.PI/180;
export type FlightPoint={x:number;y:number;z:number};
export type FlightWingProfile='current'|'fuller'|'articulated'|'sectioned';
export const flightDeployment=(time:number)=>unit((time-3100)/550);
export const flightWingMaterial=(state:BirdAnatomy)=>ease(state.wings/.12);
const add=(a:FlightPoint,b:FlightPoint):FlightPoint=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
const interpolate=(a:FlightPoint,b:FlightPoint,t:number):FlightPoint=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});

/** Retain the engraved identity while the cervical line extends into flight. */
export function flightBodyPoint(point:Point,state:BirdAnatomy):Point {
  // A moderate version of the established cervical motion retains the neck's
  // cross-section. Forcing the head down with row translations collapsed it.
  const p=bodyPoint(point,{...state,flight:state.flight*.6});
  const elapsed=state.time-3750;
  p.y-=state.flight*state.wings*ease(elapsed/100)*Math.sin(elapsed*Math.PI*2/420-.3)*5;
  return p;
}

/** Full-length bones fold in depth; no span/chord growth scales are applied. */
export function flightWingFrame(state:BirdAnatomy,near:boolean,profile:FlightWingProfile='sectioned') {
  const side=near?1:-1,deploy=unit(state.wings);
  const elapsed=Math.max(0,state.time-3750-(near?0:15));
  const onset=elapsed*ease(elapsed/45);
  const phase=onset*Math.PI*2/420;
  const clock=phase+.25*(1-Math.cos(phase));
  const recovery=ease(Math.max(0,-Math.sin(clock)));
  const revised=profile!=='current',articulated=profile==='articulated';
  const opening=[ease(deploy/.7),ease((deploy-.02)/.88),ease((deploy-.08)/.92)];
  const originalOpening=[ease(deploy/.6),ease((deploy-.06)/.78),ease((deploy-.2)/.8)];
  const folded=articulated?[85,40,105]:profile==='sectioned'?[85,50,105]:[85,70,110];
  const extended=revised?[35,20,5]:[12,-12,-20];
  const lengths=revised?[240,280,440]:[180,210,320];
  const recoveryFold=articulated?[8,-25,45]:profile==='sectioned'?[20,-15,65]:[12,42,72];
  const angles=lengths.map((_,i)=>rad(folded[i]+(extended[i]-folded[i])*(revised?opening:originalOpening)[i]+recoveryFold[i]*recovery*deploy));
  // Joint deployment stays single-eased. The surface pitch has its own smooth
  // endpoint so clamping the deployment channel does not stop it abruptly.
  const pitchDeployment=revised?ease(deploy):deploy;
  const flap=lengths.map((_,i)=>pitchDeployment*(.1+1.04*Math.cos(clock-i*.18))+(1-pitchDeployment)*(revised?1.05:-.12));
  const joints:FlightPoint[]=[{x:0,y:0,z:0}];
  const chords:FlightPoint[]=[];
  const normals:FlightPoint[]=[];
  for(let i=0;i<lengths.length;i++) {
    const fold=angles[i],stroke=flap[i],length=lengths[i];
    joints.push(add(joints[i],{x:-Math.sin(fold)*length,y:-Math.cos(fold)*Math.sin(stroke)*length,z:side*Math.cos(fold)*Math.cos(stroke)*length}));
    chords.push({x:-Math.cos(fold),y:Math.sin(fold)*Math.sin(stroke),z:-side*Math.sin(fold)*Math.cos(stroke)});
    normals.push({x:0,y:-Math.cos(stroke),z:-side*Math.sin(stroke)});
  }
  const attachment=revised?(near?{x:900,y:560}:{x:870,y:495}):(near?{x:1000,y:540}:{x:980,y:495});
  const underside=near?ease((flap[1]-.12)/.65)*ease(deploy/.6):(1-ease((flap[1]+.05)/.65))*ease(deploy/.6);
  return {joints,chords,normals,lengths,attachment,underside,recovery,flap:flap[1]};
}

export function flightWingPoint(point:Point,state:BirdAnatomy,near:boolean,profile:FlightWingProfile='sectioned'):Point {
  const frame=flightWingFrame(state,near,profile),root=flightBodyPoint(frame.attachment,state);
  const sourceSpan=point.x-120;
  const boundaries=[0,frame.lengths[0],frame.lengths[0]+frame.lengths[1],frame.lengths.reduce((a,b)=>a+b,0)];
  const along=sourceSpan/1330*boundaries[3];
  const segment=along<boundaries[1]?0:along<boundaries[2]?1:2;
  const t=(along-boundaries[segment])/frame.lengths[segment];
  let center=interpolate(frame.joints[segment],frame.joints[segment+1],t);
  let chordDirection=frame.chords[segment];
  let surfaceNormal=frame.normals[segment];
  if(profile==='sectioned')for(let joint=1;joint<3;joint++){
    // Overlapping secondary feathers bridge the hard skeletal corner. Their
    // envelope follows a curved fold while the underlying bones retain length.
    const radius=110,delta=along-boundaries[joint];
    if(Math.abs(delta)<radius){
      const before=interpolate(frame.joints[joint-1],frame.joints[joint],1-radius/frame.lengths[joint-1]);
      const after=interpolate(frame.joints[joint],frame.joints[joint+1],radius/frame.lengths[joint]);
      const u=(delta+radius)/(radius*2);
      center=interpolate(interpolate(before,frame.joints[joint],u),interpolate(frame.joints[joint],after,u),u);
    }
  }
  // A small feathered joint region turns continuously around each elbow/wrist.
  for(let joint=1;joint<3;joint++)if(Math.abs(along-boundaries[joint])<45) {
    const blend=ease((along-boundaries[joint]+45)/90);
    chordDirection=interpolate(frame.chords[joint-1],frame.chords[joint],blend);
    surfaceNormal=interpolate(frame.normals[joint-1],frame.normals[joint],blend);
  }
  const chord=(point.y-150-sourceSpan*.06)*(profile==='current'?.56:profile==='sectioned'?.9:1.08);
  // Feather stacks have a curved cross-section, not an infinitely thin plane.
  // Keep that curvature as the surface turns edge-on during the return stroke.
  const camber=profile==='sectioned'?Math.sin(unit((chord+90)/390)*Math.PI)*65*ease(sourceSpan/180):0;
  const p=add(center,{x:chordDirection.x*chord+surfaceNormal.x*camber,y:chordDirection.y*chord+surfaceNormal.y*camber,z:chordDirection.z*chord+surfaceNormal.z*camber});
  // A shallow three-quarter view gives the wings distinct projected silhouettes.
  const perspective=1+p.z/5000;
  return {x:root.x+(p.x-p.z*.48)*perspective,y:root.y+(p.y+p.z*.16)*perspective};
}
