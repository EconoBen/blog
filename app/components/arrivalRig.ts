import { ARRIVAL_BEATS as B } from './arrivalTimeline';
import type { Point } from './arrivalMesh';

const unit = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const p=unit(x); return p*p*p*(p*(p*6-15)+10); };
const radians = (degrees: number) => degrees*Math.PI/180;
export type BirdControls = { awake: number; wings: number; flight: number };

/** Anatomical channels share time, while delayed responses carry the shake through the bird. */
export function birdAnatomy(time: number, controls: BirdControls) {
  const shakeProgress=unit((time-B.wakeEnd)/(B.shakeEnd-B.wakeEnd));
  const envelope=Math.sin(Math.PI*shakeProgress)**2;
  const shake=(lag=0)=>Math.sin((time-B.wakeEnd-lag)*.044)*envelope;
  const crouch=Math.sin(Math.PI*unit((time-3200)/570))**2;
  return {
    time, ...controls,
    sleep:1-ease(controls.awake),
    breath:Math.sin(time*.0021)*.004*(1-controls.flight)*(1-ease((time-B.waterContact)/(B.landEnd-B.waterContact))),
    headShake:shake(0)*8.5,
    neckShake:shake(32)*5.5,
    bodyShake:shake(63)*5,
    tuftShake:shake(85)*9,
    crouch:crouch*(1-controls.flight),
    beat:Math.sin((time-3560)*Math.PI*2/410),
  };
}
export type BirdAnatomy = ReturnType<typeof birdAnatomy>;

function turn(point:Point,origin:Point,angle:number):Point {
  const x=point.x-origin.x,y=point.y-origin.y,c=Math.cos(angle),s=Math.sin(angle);
  return {x:origin.x+x*c-y*s,y:origin.y+x*s+y*c};
}

// Integrating a velocity with short eased ends gives the neck a long, even
// bend. Its bounded slope avoids the fold produced by overlapping rotations.
function neckTravel(value:number):number {
  const t=unit(value),ramp=.2;
  if(t>1-ramp)return 1-neckTravel(1-t);
  if(t>=ramp)return (t-ramp/2)/(1-ramp);
  const u=t/ramp;
  return ramp*(u*u*u-u*u*u*u/2)/(1-ramp);
}

/** The cervical bend translates a level head while preserving connected skin. */
export function bodyPoint(point:Point, state:BirdAnatomy):Point {
  const {flight,sleep,breath,crouch}=state;
  const torso={x:760,y:700};
  let p={x:torso.x+(point.x-torso.x)*(1+flight*.1+crouch*.018+breath),y:torso.y+(point.y-torso.y)*(1-flight*.12-crouch*.035+breath)};
  const neckWeight=ease((650-point.y)/290)*ease((point.x-620)/330);
  const angle=radians(sleep*9+state.headShake);
  const neck=turn(p,{x:1080,y:620},angle);
  neck.y+=sleep*58+state.neckShake;
  p={x:p.x+(neck.x-p.x)*neckWeight,y:p.y+(neck.y-p.y)*neckWeight};
  const headPivot={x:760+(1120-760)*(1+flight*.1+crouch*.018+breath),y:700+(255-700)*(1-flight*.12-crouch*.035+breath)};
  const extended=turn(headPivot,{x:1080,y:620},radians(flight*61));
  const cervical=unit((735-point.y)/370),forward=neckTravel(cervical);
  const side=ease((point.x-775)/145);
  // Every point of the skull shares the same translation, equivalent to full
  // counter-rotation. The bill stays level and the rear cheek cannot shear.
  p.x+=(extended.x-headPivot.x)*forward*side;
  p.y+=(extended.y-headPivot.y)*.72*neckTravel(cervical)*side;
  const upperTuft=ease((190-point.y)/110)*ease((1120-point.x)/190);
  p.x+=upperTuft*state.tuftShake;
  p.y+=upperTuft*state.tuftShake*.3;
  const bodyWeight=1-ease((640-point.y)/220);
  p.x+=state.bodyShake*bodyWeight;
  p.y+=Math.sin((point.x-300)/900*Math.PI)*breath*400+state.bodyShake*.24*bodyWeight;
  return p;
}

/** The wrist lags the elbow, and the primary feathers change pitch through each stroke. */
export function wingPoint(point:Point,state:BirdAnatomy,near:boolean):Point {
  const root=bodyPoint({x:820,y:560},state);
  // The engraving runs diagonally from the shoulder to the primaries. Work in
  // that anatomical axis so projection never shears away the feather breadth.
  const axis=radians(-25),cos=Math.cos(axis),sin=Math.sin(axis);
  const dx=point.x-230,dy=point.y-800;
  const span=dx*cos+dy*sin,chord=(-dx*sin+dy*cos)*(near?1:-1);
  const folded=1-ease(state.wings);
  // Unfold into the first raised pose before starting the powered stroke.
  // A running clock here used to flap the still-compressed wing into a spike.
  const opening=state.time<B.launchEnd;
  const elapsed=state.time-3560-(near?0:28);
  const strokeTime=opening?Math.max(0,elapsed)*ease(elapsed/40):elapsed;
  const phase=strokeTime*Math.PI*2/410;
  const clock=phase+.28*(1-Math.cos(phase));
  const stroke=Math.cos(clock);
  const recovery=ease(Math.max(0,-Math.sin(clock)));
  const elbowAngle=radians((5+recovery*13+Math.sin(clock-.2)*5)*(1-folded)+folded*15);
  const wristLag=Math.sin(clock-.48)-Math.sin(clock);
  const wristAngle=radians((-3-recovery*16+wristLag*14)*(1-folded)-folded*18);
  const elbow={x:410,y:0},wrist={x:760,y:0};
  const elbowWeight=ease((span-150)/600),wristWeight=ease((span-560)/700);
  const bent=turn({x:span,y:chord},elbow,elbowAngle);
  let p={x:span+(bent.x-span)*elbowWeight,y:chord+(bent.y-chord)*elbowWeight};
  const hand=turn(p,turn(wrist,elbow,elbowAngle),wristAngle);
  p={x:p.x+(hand.x-p.x)*wristWeight,y:p.y+(hand.y-p.y)*wristWeight};
  const primary=ease((span-550)/650);
  const fan=1+primary*.17*(.5+.5*Math.sin(clock-.65));
  // Recovery folds at the joints and narrows modestly; it never becomes an
  // edge-on sliver. The far wing is foreshortened and follows slightly later.
  // Tuck the elbow and wrist along the flank, retaining full-sized shoulder
  // feathers. A monotone projection foreshortens only the distal span, so the
  // opening reads as an unfolding wing rather than a tiny bird-sized panel.
  const distal=Math.max(0,p.x-120),u=unit(distal/180);
  const tucked=distal>=180?distal-90:180*(u*u*u-u*u*u*u/2);
  p.y*=1-folded*.86*ease((p.x-100)/600);
  p.x-=folded*.6*tucked;
  p.x*=(near?.74:.56)*(1-recovery*.12);
  p.y*=(near?.65:.52)*(1-recovery*.14)*fan;
  const activeAngle=near?-2.6+stroke*1.02:-.86-stroke*.86;
  const extension=opening?ease(state.wings):ease(state.wings/.48);
  const angle=-3.16+(activeAngle+3.16)*extension;
  const c=Math.cos(angle),s=Math.sin(angle);
  return {x:root.x+p.x*c-p.y*s,y:root.y+p.x*s+p.y*c};
}

/** Native composition isolates the generated engraving plate before it is textured onto the rig. */
export const ARRIVAL_BODY_OUTLINE = `M212 698
 C330 629 417 565 535 504 C639 463 737 448 831 455 C911 460 980 485 1039 497
 C1041 474 1036 452 1027 439 C1018 420 999 406 977 388 C953 368 936 344 930 320 L924 294 924 265 934 258
 L912 237 928 239 912 223 930 226 913 208 931 211 918 194 935 199
 L909 175 931 178 912 160 936 166 912 145 939 153 918 130 944 141
 L920 116 949 129 930 102 957 117 942 87 967 105 953 77 978 96
 L979 85 997 94 1006 68 1024 89 1035 71 1049 95 1066 94
 C1084 105 1107 113 1128 120 C1155 130 1172 135 1188 145 C1212 167 1227 186 1236 216 L1258 241
 L1353 294 1261 278 1232 272 C1225 290 1214 310 1195 323 C1173 336 1140 347 1133 365
 C1138 401 1163 431 1192 459 C1220 488 1239 514 1250 546 C1267 589 1277 633 1270 683
 C1268 734 1248 779 1210 817 C1177 851 1135 877 1085 892
 C1007 920 922 935 821 930 C694 925 579 901 445 846
 C434 867 421 879 398 888 L333 913 244 932 214 928 255 908 309 890
 L229 900 213 892 240 881 310 866 245 872 200 875 189 867 215 855 261 839
 L261 835 267 829 C300 820 354 829 390 839 L403 842
 C362 831 300 806 253 783 L236 774 250 775 231 760 244 764 227 749 240 752
 L205 737 229 739 212 722 235 720 208 711 228 705 Z`;
