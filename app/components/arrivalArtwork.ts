import { ARRIVAL_BODY_OUTLINE } from './arrivalRig';

type TexturePatch = { canvas: HTMLCanvasElement; x: number; y: number };

export function createArrivalWing(image: HTMLImageElement) {
  const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;
  const ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0);
  ctx.globalCompositeOperation='destination-in';
  const shoulder=ctx.createLinearGradient(180,824,360,740);
  shoulder.addColorStop(0,'#0000');shoulder.addColorStop(.35,'#0000001a');shoulder.addColorStop(1,'#000');
  ctx.fillStyle=shoulder;ctx.fillRect(0,0,1536,1024);
  return canvas;
}

function patch(image: HTMLImageElement, x: number, y: number, width: number, height: number, solid: number, make:()=>HTMLCanvasElement=()=>document.createElement('canvas')): TexturePatch {
  const canvas=make();canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d')!;
  ctx.save();ctx.translate(-x,-y);ctx.clip(new Path2D(ARRIVAL_BODY_OUTLINE));ctx.translate(x,y);
  ctx.drawImage(image,x,y,width,height,0,0,width,height);
  ctx.restore();
  ctx.globalCompositeOperation='destination-in';
  ctx.translate(width/2,height/2);ctx.scale(width/2,height/2);
  const edge=ctx.createRadialGradient(0,0,0,0,0,1);
  edge.addColorStop(0,'#000');edge.addColorStop(solid,'#000');edge.addColorStop(1,'#0000');
  ctx.fillStyle=edge;ctx.fillRect(-1,-1,2,2);
  return {canvas,x,y};
}

function exposedFlank(image:HTMLImageElement,make:()=>HTMLCanvasElement):TexturePatch {
  const x=150,y=420,width=1120,height=450;
  const canvas=make();canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d')!;
  ctx.save();ctx.translate(-x,-y);ctx.clip(new Path2D(ARRIVAL_BODY_OUTLINE));
  ctx.drawImage(image,0,0,1536,1024);ctx.restore();
  // Cover the entire painted wing, up to the back silhouette. A radial mask
  // retained long flight feathers around its top edge and read as a second wing.
  ctx.globalCompositeOperation='destination-in';
  const lower=ctx.createLinearGradient(0,720-y,0,850-y);
  lower.addColorStop(0,'#000');lower.addColorStop(1,'#0000');
  ctx.fillStyle=lower;ctx.fillRect(0,0,width,height);
  const front=ctx.createLinearGradient(1080-x,0,1260-x,0);
  front.addColorStop(0,'#000');front.addColorStop(1,'#0000');
  ctx.fillStyle=front;ctx.fillRect(0,0,width,height);
  return {canvas,x,y};
}

/** Keep the approved eyelid while exposing short body feathers beneath the moving wing. */
export function createArrivalTextures(bodyImage: HTMLImageElement, detailImage: HTMLImageElement, flankImage:HTMLImageElement) {
  const owned:HTMLCanvasElement[]=[];
  const make=()=>{const canvas=document.createElement('canvas');owned.push(canvas);return canvas;};
  const dispose=()=>{for(const canvas of owned)canvas.width=canvas.height=1;};
  try {
  const base=make(),skin=make();
  base.width=skin.width=1536;base.height=skin.height=1024;
  const baseContext=base.getContext('2d')!;
  baseContext.clip(new Path2D(ARRIVAL_BODY_OUTLINE));baseContext.drawImage(bodyImage,0,0,1536,1024);
  const eye=patch(detailImage,1050,150,200,140,.57,make);
  const flank=exposedFlank(flankImage,make);
  const coverts=patch(flankImage,670,440,310,260,.55,make);
  const ctx=skin.getContext('2d');if(!ctx)throw new Error('Arrival canvas is unavailable');
  let previousEye=-1,previousFlank=-1;
  return {
    body:base,
    coverts,
    compose(awake:number,wings:number,unfolding=false,replacementCoverage?:number) {
      if(awake>=1&&wings<=0)return base;
      // The painted resting wing must be gone at the first visible opening
      // mesh (> .005). Returning flight retains its longer material transition.
      const spread=Math.max(0,Math.min(1,wings/(unfolding?.005:.22)));
      const flankAlpha=replacementCoverage??spread*spread*(3-2*spread),eyeAlpha=1-Math.max(0,Math.min(1,awake));
      if(flankAlpha===previousFlank&&eyeAlpha===previousEye)return skin;
      ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1536,1024);ctx.drawImage(base,0,0);
      ctx.save();ctx.clip(new Path2D(ARRIVAL_BODY_OUTLINE));
      ctx.globalAlpha=flankAlpha;ctx.drawImage(flank.canvas,flank.x,flank.y);
      ctx.globalAlpha=eyeAlpha;ctx.drawImage(eye.canvas,eye.x,eye.y);
      ctx.restore();previousFlank=flankAlpha;previousEye=eyeAlpha;return skin;
    },
    dispose,
  };
  }catch(error){dispose();throw error;}
}
