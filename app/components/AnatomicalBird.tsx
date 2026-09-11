'use client';

import {useEffect,useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {createArrivalTextures} from './arrivalArtwork';
import {createFlightWingTextures,FLIGHT_WING_ASSET} from './arrivalFlightArtwork';
import {createSectionedWingTextures,SECTIONED_WING_ASSET} from './arrivalWingSections';
import {birdAnatomy,ARRIVAL_BODY_OUTLINE} from './arrivalRig';
import {ARRIVAL_BEATS} from './arrivalTimeline';
import {flightBodyPoint,flightWingFrame,flightWingPoint,flightWingMaterial,type FlightWingProfile} from './arrivalFlightRig';
import {createMeshCoverage,drawTexturedMesh,makeGrid,type MeshCoverage} from './arrivalMesh';

export const ANATOMICAL_ART={
  body:'/assets/grebes/arrival/engraving-plate-v2.webp',
  detail:'/assets/grebes/arrival/anatomy-detail-v2.webp',
  flank:'/assets/grebes/arrival/anatomy-flank-v3.webp',
  wing:SECTIONED_WING_ASSET,
  pond:'/assets/grebes/atlas-dusk-shoreline.webp',
};
export type AnatomicalBirdProps={elapsedMs:number;size:number;x:number;y:number;rotate?:number;facing?:1|-1;awake?:number;wings?:number;flight?:number;immersion?:number;opacity?:number;reflectionOpacity?:number;clipAtWaterline?:boolean;onError?:()=>void;wingProfile?:FlightWingProfile};
function shoulderTexture(image:HTMLImageElement) {
  const canvas=document.createElement('canvas');canvas.width=260;canvas.height=230;
  try {
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Arrival canvas is unavailable');
  ctx.save();ctx.translate(-870,-460);ctx.clip(new Path2D(ARRIVAL_BODY_OUTLINE));ctx.drawImage(image,0,0);ctx.restore();
  ctx.globalCompositeOperation='destination-in';ctx.translate(130,115);ctx.scale(130,115);
  const gradient=ctx.createRadialGradient(0,0,0,0,0,1);gradient.addColorStop(0,'#000');gradient.addColorStop(.2,'#000');gradient.addColorStop(1,'#0000');ctx.fillStyle=gradient;ctx.fillRect(-1,-1,2,2);
  return canvas;
  }catch(error){canvas.width=canvas.height=1;throw error;}
}
type WingSection={x:number;width:number;blends:HTMLCanvasElement[]};
type PreparedBird={textures:ReturnType<typeof createArrivalTextures>;wings:{dispose:()=>void};sections:WingSection[];shoulder:HTMLCanvasElement;coverage:{body:MeshCoverage|null;wings:(MeshCoverage|null)[][];shoulder:MeshCoverage|null}};

/** The isolated study and final opening share this one prepared character. */
export function AnatomicalBird({elapsedMs,size,x,y,rotate=0,facing=1,awake=1,wings=0,flight=0,immersion=1,opacity=1,reflectionOpacity,clipAtWaterline=false,onError,wingProfile='sectioned'}:AnatomicalBirdProps) {
  const canvas=useRef<HTMLCanvasElement>(null),reflected=useRef<HTMLCanvasElement>(null);
  const wingLayer=useRef<HTMLCanvasElement|null>(null);
  const art=useRef<PreparedBird|null>(null);const [ready,setReady]=useState(false);
  const wingSource=wingProfile==='sectioned'?SECTIONED_WING_ASSET:FLIGHT_WING_ASSET;
  const hasReflection=reflectionOpacity!==undefined;
  const failureCallback=useRef(onError);failureCallback.current=onError;
  const failRendering=useRef<()=>void>(()=>{});
  useEffect(()=>{
    setReady(false);
    let disposed=false,failed=false;const images=[new Image(),new Image(),new Image(),new Image()];
    const fail=()=>{if(disposed||failed)return;failed=true;setReady(false);failureCallback.current?.();};
    failRendering.current=fail;
    const prepare=()=>{
      if(disposed||failed||art.current||images.some(image=>!image.complete||!image.naturalWidth))return;
      const [body,detail,flank,wing]=images;
      let textures:PreparedBird['textures']|undefined,wingTextures:PreparedBird['wings']|undefined,shoulder:HTMLCanvasElement|undefined;
      try {
        textures=createArrivalTextures(body,detail,flank);
        const prepared=wingSource===SECTIONED_WING_ASSET?createSectionedWingTextures(wing):createFlightWingTextures(wing);
        wingTextures=prepared;
        const sections:WingSection[]='sections' in prepared?prepared.sections:[{x:0,width:1536,blends:prepared.blends}];
        shoulder=shoulderTexture(flank);
        art.current={textures,wings:wingTextures,sections,shoulder,coverage:{body:createMeshCoverage(textures.body),wings:sections.map(section=>section.blends.map(createMeshCoverage)),shoulder:createMeshCoverage(shoulder)}};setReady(true);
      } catch {
        textures?.dispose();wingTextures?.dispose();if(shoulder)shoulder.width=shoulder.height=1;
        fail();
      }
    };
    for(const image of images){image.onload=prepare;image.onerror=fail;}
    [ANATOMICAL_ART.body,ANATOMICAL_ART.detail,ANATOMICAL_ART.flank,wingSource].forEach((url,i)=>images[i].src=url);prepare();
    return()=>{disposed=true;for(const image of images){image.onload=null;image.onerror=null;}if(art.current){art.current.textures.dispose();art.current.wings.dispose();art.current.shoulder.width=art.current.shoulder.height=1;}art.current=null;if(wingLayer.current)wingLayer.current.width=wingLayer.current.height=1;wingLayer.current=null;};
  },[wingSource]);
  useLayoutEffect(()=>{
    const surface=canvas.current,a=art.current;if(!surface||!a||!ready||opacity<=0)return;
    const cssWidth=size*2.15,cssHeight=size*1.7;
    const dpr=Math.min(window.devicePixelRatio||1,1.5,Math.sqrt(2_000_000/(cssWidth*cssHeight)));
    const width=Math.max(1,Math.floor(cssWidth*dpr)),height=Math.max(1,Math.floor(cssHeight*dpr));
    if(surface.width!==width||surface.height!==height){surface.height=1;surface.width=width;surface.height=height;}
    const ctx=surface.getContext('2d');if(!ctx){failRendering.current();return;}ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
    const scale=size/1536*dpr;ctx.setTransform(scale,0,0,scale,1536*.575*scale,1536*.7*scale);
    const state=birdAnatomy(elapsedMs,{awake,wings,flight});
    const material=wingProfile==='current'?undefined:flightWingMaterial(state);
    const partial=wings>.005&&material!==undefined&&material>0&&material<1;
    let layerContext:CanvasRenderingContext2D|null=null;
    if(partial){
      try{
        const layer=wingLayer.current??(wingLayer.current=document.createElement('canvas'));
        if(layer.width!==width||layer.height!==height){layer.height=1;layer.width=width;layer.height=height;}
        layerContext=layer.getContext('2d');
        if(!layerContext)throw new Error('Arrival wing canvas is unavailable');
      }catch{
        if(wingLayer.current)wingLayer.current.width=wingLayer.current.height=1;
        failRendering.current();return;
      }
    }else if(wingLayer.current&&(wingLayer.current.width!==1||wingLayer.current.height!==1)){
      // Keep the element for the closing fold, but release its backing store
      // while full-opacity flight draws straight to the main surface.
      wingLayer.current.width=wingLayer.current.height=1;
    }
    const drawWing=(near:boolean)=>{
      if(material===0)return;
      const frame=flightWingFrame(state,near,wingProfile),index=Math.round(frame.underside*4);
      const target=layerContext??ctx;
      target.save();target.globalAlpha=1;
      if(layerContext){
        target.setTransform(1,0,0,1,0,0);target.clearRect(0,0,width,height);
        target.setTransform(scale,0,0,scale,1536*.575*scale,1536*.7*scale);
      }
      // Primaries lie under overlapping inner feathers and shoulder coverts.
      // Each group owns a cropped material, rather than folding one opaque sheet.
      for(let group=a.sections.length-1;group>=0;group--){
        const section=a.sections[group],texture=section.blends[index];
        drawTexturedMesh(target,texture,makeGrid(section.width,512,Math.ceil(section.width/85.34),6,p=>flightWingPoint({x:p.x+section.x,y:p.y},state,near,wingProfile)),a.coverage.wings[group][index]);
      }
      if(near)drawTexturedMesh(target,a.shoulder,makeGrid(260,230,4,4,p=>flightBodyPoint({x:p.x+870,y:p.y+460},state)),a.coverage.shoulder);
      target.restore();
      if(layerContext&&wingLayer.current){
        // The mesh deliberately overlaps triangle edges. Fade the completed
        // wing once so those overlaps cannot accumulate opacity into facets.
        ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=material!;
        ctx.drawImage(wingLayer.current,0,0);ctx.restore();
      }
    };
    if(wings>.005)drawWing(false);
    ctx.save();if(immersion<1){ctx.beginPath();ctx.rect(-1600,-2000,5000,2000+1024*immersion);ctx.clip();}
    if(elapsedMs>=ARRIVAL_BEATS.waterContact&&flight===0&&wings<.005){
      // At rest, sample the original engraving as one image, like the resident
      // SVG. Minifying hundreds of triangles separately changes feather detail.
      ctx.imageSmoothingQuality='high';ctx.drawImage(a.textures.body,0,0);
    }else{
      drawTexturedMesh(ctx,a.textures.compose(awake,wings,elapsedMs<ARRIVAL_BEATS.launchEnd,material),makeGrid(1536,1024,16,12,p=>flightBodyPoint(p,state)),a.coverage.body);
    }
    if(wings>.005)drawWing(true);
    ctx.restore();
    const mirror=reflected.current;
    if(mirror&&(reflectionOpacity??0)>0){
      if(mirror.width!==width||mirror.height!==height){mirror.height=1;mirror.width=width;mirror.height=height;}
      const reflectionContext=mirror.getContext('2d');if(reflectionContext){reflectionContext.setTransform(1,0,0,1,0,0);reflectionContext.clearRect(0,0,width,height);reflectionContext.drawImage(surface,0,0);}
    }
  },[elapsedMs,size,awake,wings,flight,immersion,opacity,reflectionOpacity,ready,wingProfile]);
  useLayoutEffect(()=>{const owned=[canvas.current,reflected.current];return()=>{for(const node of owned)if(node)node.width=node.height=1;};},[hasReflection]);
  const style:CSSProperties={left:x,top:y,width:size,height:size*2/3,opacity,transform:`translate(-${760/1536*100}%,-${850/1024*100}%) rotate(${rotate}deg) scaleX(${facing})`,transformOrigin:`${760/1536*100}% ${850/1024*100}%`};
  const surfaceStyle:CSSProperties={position:'absolute',left:'-57.5%',top:'-105%',width:'215%',height:'255%'};
  const actor=<div className="arrival-bird" style={style}><canvas className="arrival-character" aria-hidden="true" ref={canvas} style={surfaceStyle}/></div>;
  return <>{hasReflection&&<div className="arrival-bird arrival-bird-reflection" style={{...style,opacity:opacity*(reflectionOpacity??0),transform:`${style.transform} scaleY(-.32)`}}><canvas className="arrival-character" aria-hidden="true" ref={reflected} style={surfaceStyle}/></div>}<div className={clipAtWaterline?'arrival-hero-air':undefined}>{actor}</div></>;
}
