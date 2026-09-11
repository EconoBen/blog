import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const source=ts.transpileModule(fs.readFileSync('app/components/arrivalFlightArtwork.ts','utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020},
}).outputText;
const asset='data:image/webp;base64,'+fs.readFileSync('public/assets/grebes/arrival/flight-wings-v2.webp').toString('base64');
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage();
  const result=await page.evaluate(async({source,asset,evidence})=>{
    const module={exports:{}};new Function('module','exports',source)(module,module.exports);
    const {createFlightWingTextures,FLIGHT_WING_SOURCE,FLIGHT_WING_BLEND_WEIGHTS}=module.exports;
    const image=new Image();image.src=asset;await image.decode();
    let allocations=0;
    const create=document.createElement.bind(document);
    document.createElement=function(name,...args){if(name==='canvas')allocations++;return create(name,...args);};
    const textures=createFlightWingTextures(image);
    document.createElement=create;
    const canvases=[textures.dorsal,textures.ventral,...textures.blends];
    const unique=[...new Set(canvases)];
    const pixel=(canvas,x,y)=>Array.from(canvas.getContext('2d').getImageData(x,y,1,1).data);
    const inside=[[120,150],[250,200],[500,130],[800,240],[1100,290],[1380,340]];
    const outside=[[0,0],[50,180],[100,450],[700,40],[900,450],[1450,430],[1510,270],[1450,280],[900,389]];
    const primaryTips=[[1430,260],[1450,320],[1430,365],[1370,395]];
    const raw=create('canvas');raw.width=1536;raw.height=1024;raw.getContext('2d').drawImage(image,0,0);
    const statistics=canvas=>{
      const data=canvas.getContext('2d').getImageData(0,0,1536,512).data;
      const solid=new Uint8Array(1536*512),visited=new Uint8Array(solid.length);
      let opaque=0;for(let i=0;i<solid.length;i++){solid[i]=data[i*4+3]>127?1:0;opaque+=solid[i];}
      const queue=new Int32Array(solid.length);let largest=0,components=0;
      for(let start=0;start<solid.length;start++){
        if(!solid[start]||visited[start])continue;
        let head=0,tail=1;queue[0]=start;visited[start]=1;
        while(head<tail){const i=queue[head++],x=i%1536;
          for(const n of [x>0?i-1:-1,x<1535?i+1:-1,i-1536,i+1536])if(n>=0&&n<solid.length&&solid[n]&&!visited[n]){visited[n]=1;queue[tail++]=n;}
        }
        largest=Math.max(largest,tail);if(tail>4)components++;
      }
      // Every transparent region larger than a few antialiased pixels must be
      // connected to the exterior, not a hole cut through a feather or white bar.
      visited.fill(0);let head=0,tail=1;queue[0]=0;visited[0]=1;
      while(head<tail){const i=queue[head++],x=i%1536;
        // Diagonally connected antialiased feather notches are still exterior.
        for(const n of [x>0?i-1:-1,x<1535?i+1:-1,i-1536,i+1536,x>0?i-1537:-1,x>0?i+1535:-1,x<1535?i-1535:-1,x<1535?i+1537:-1])if(n>=0&&n<solid.length&&!solid[n]&&!visited[n]){visited[n]=1;queue[tail++]=n;}
      }
      let enclosed=0;const holes=[];for(let i=0;i<solid.length;i++)if(!solid[i]&&!visited[i]){enclosed++;if(holes.length<20)holes.push([i%1536,Math.floor(i/1536)]);}
      return {opaque,largest,components,enclosed,holes};
    };
    const values={dimensions:unique.map(c=>[c.width,c.height]),allocations,
      endpointIdentity:[textures.blends[0]===textures.dorsal,textures.blends[4]===textures.ventral],
      source:FLIGHT_WING_SOURCE,weights:FLIGHT_WING_BLEND_WEIGHTS,
      exterior:unique.map(c=>outside.map(([x,y])=>pixel(c,x,y)[3])),
      primaryTips:unique.map(c=>primaryTips.map(([x,y])=>pixel(c,x,y)[3])),
      dorsal:inside.map(([x,y])=>pixel(textures.dorsal,x,y)),
      ventral:inside.map(([x,y])=>pixel(textures.ventral,x,y)),
      expectedDorsal:inside.map(([x,y])=>pixel(raw,x,y)),
      expectedVentral:inside.map(([x,y])=>pixel(raw,x,y+500)),
      blends:textures.blends.map(c=>inside.map(([x,y])=>pixel(c,x,y))),
      stats:[statistics(textures.dorsal),statistics(textures.ventral)],
      images:evidence?[textures.dorsal,textures.blends[2],textures.ventral].map(c=>c.toDataURL()):[],
    };
    textures.dispose();textures.dispose();values.disposed=unique.map(c=>[c.width,c.height]);
    values.failedAllocations=[];
    for(let failAt=1;failAt<=5;failAt++){
      const acquired=[];
      document.createElement=function(name,...args){const node=create(name,...args);if(name==='canvas'){acquired.push(node);if(acquired.length===failAt)node.getContext=()=>null;}return node;};
      let error;
      try{createFlightWingTextures(image);}catch(failure){error=String(failure);}
      finally{document.createElement=create;}
      values.failedAllocations.push({failAt,error,dimensions:acquired.map(c=>[c.width,c.height])});
    }
    return values;
  },{source,asset,evidence:Boolean(process.env.FLIGHT_ARTWORK_EVIDENCE)});
  assert.deepEqual(result.dimensions,Array.from({length:5},()=>[1536,512]),'There are five bounded source textures, with endpoints reused');
  assert.equal(result.allocations,5,'Preparing both views and all transitions allocates only five backing stores');
  assert.deepEqual(result.endpointIdentity,[true,true]);
  assert.deepEqual(result.weights,[0,.25,.5,.75,1]);
  assert.deepEqual(result.source,{width:1536,height:512,root:{x:120,y:150},length:1330});
  for(const exterior of result.exterior)assert.ok(exterior.every(alpha=>alpha===0),'Opaque checker pixels and inter-primary gaps must be outside the native silhouette');
  for(const tips of result.primaryTips)assert.ok(tips.every(alpha=>alpha>240),'The separated primary feather tips retain their original full extent and ink');
  assert.deepEqual(result.dorsal,result.expectedDorsal,'Dorsal feather ink remains the exact decoded plate, including its white flight bar');
  assert.deepEqual(result.ventral,result.expectedVentral,'The ventral view aligns by the measured 500px offset without resizing or repainting');
  assert.notDeepEqual(result.dorsal,result.ventral,'The paired wing views must retain their actual dorsal/ventral artwork differences');
  for(const [index,blend] of result.blends.entries())for(const [point,pixel] of blend.entries()){
    assert.equal(pixel[3],255,'Blending wing views must not make the shared interior translucent');
    const weight=result.weights[index];
    for(let channel=0;channel<3;channel++)assert.ok(Math.abs(pixel[channel]-(result.dorsal[point][channel]*(1-weight)+result.ventral[point][channel]*weight))<=2,'Cached view changes preserve weighted feather color');
  }
  for(const stats of result.stats){
    assert.ok(stats.opaque>230000&&stats.opaque<400000,'The mask retains a full-sized wing while discarding its exterior');
    assert.equal(stats.components,1,'Primary feathers and root stay joined as one silhouette');
    assert.ok(stats.enclosed<12,`No artificial holes are cut through the feather field: ${JSON.stringify(stats)}`);
    assert.ok(stats.largest/stats.opaque>.999,'No isolated wing pieces are introduced by masking');
  }
  assert.deepEqual(result.disposed,Array.from({length:5},()=>[1,1]),'Idempotent disposal releases every texture backing store');
  for(const failure of result.failedAllocations){
    assert.ok(failure.error,`A missing context at allocation ${failure.failAt} reports preparation failure`);
    assert.ok(failure.dimensions.every(([w,h])=>w===1&&h===1),`Failure at allocation ${failure.failAt} must release every earlier or partially created texture: ${JSON.stringify(failure.dimensions)}`);
  }
  if(process.env.FLIGHT_ARTWORK_EVIDENCE){
    const directory=process.env.FLIGHT_ARTWORK_EVIDENCE;fs.mkdirSync(directory,{recursive:true});
    result.images.forEach((data,index)=>fs.writeFileSync(`${directory}/flight-wing-${['dorsal','midpoint','ventral'][index]}.png`,Buffer.from(data.split(',')[1],'base64')));
    delete result.images;fs.writeFileSync(`${directory}/native-mask-check.json`,JSON.stringify(result,null,2)+'\n');
  }
  console.log('Flight artwork passed: actual paired views, transparent exterior, preserved feather ink and tips, solid cached transitions and five disposed buffers.');
}finally{await browser.close();}
