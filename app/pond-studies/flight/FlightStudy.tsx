'use client';
import {useEffect,useRef,useState} from 'react';
import {AnatomicalBird} from '../../components/AnatomicalBird';
import {flightDeployment,type FlightWingProfile} from '../../components/arrivalFlightRig';
import '../../styles/grebe-arrival.css';
const ease=(v:number)=>{const p=Math.max(0,Math.min(1,v));return p*p*p*(p*(p*6-15)+10);};
export function FlightStudy(){
  const [elapsed,setElapsed]=useState(2800),[playing,setPlaying]=useState(false),[view,setView]=useState({width:1440,height:900});
  const [profile,setProfile]=useState<FlightWingProfile>('current');
  const current=useRef(elapsed);current.current=elapsed;
  useEffect(()=>{const resize=()=>setView({width:innerWidth,height:innerHeight});resize();addEventListener('resize',resize);return()=>removeEventListener('resize',resize);},[]);
  useEffect(()=>{if(!playing)return;let frame=0,start:number|undefined,from=current.current;const draw=(t:number)=>{start??=t;const value=from+t-start;setElapsed(value);if(value<5200)frame=requestAnimationFrame(draw);else setPlaying(false);};frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);},[playing]);
  const deployment=profile==='current'?ease((elapsed-3100)/650):flightDeployment(elapsed),flight=ease((elapsed-3200)/950),size=Math.min(view.width*.82,view.height*.68,740);
  const lift=ease((elapsed-3960)/1050);
  return <main className="flight-anatomy-study" style={{position:'fixed',inset:0,overflow:'hidden',background:'#f7f2e8',zIndex:400,color:'#264e42'}}>
    <div style={{position:'absolute',top:24,left:24,font:'14px sans-serif'}}>Flight study · {Math.round(elapsed)} ms<br/><select aria-label="Wing variant" value={profile} onChange={e=>{setPlaying(false);setProfile(e.target.value as FlightWingProfile);}} style={{marginTop:12,padding:8}}><option value="current">Current wings</option><option value="fuller">Fuller feather area</option><option value="articulated">Fuller articulated fold</option><option value="sectioned">Revised feather sections</option></select></div>
    <div style={{position:'absolute',left:0,right:0,top:'64%',height:1,background:'#84b8b1'}}/>
    <AnatomicalBird elapsedMs={elapsed} x={view.width*.46+flight*view.width*.025} y={view.height*.64-lift*28} size={size} awake={1} wings={deployment} flight={flight} reflectionOpacity={0} rotate={-flight*4} wingProfile={profile}/>
    <div style={{position:'absolute',bottom:24,left:24,right:24,display:'flex',gap:20,alignItems:'center',font:'14px sans-serif'}}>
      <button type="button" onClick={()=>{setElapsed(2800);setPlaying(true);}} style={{padding:'12px 18px',background:'#264e42',color:'#f7f2e8',border:0}}>Play study</button>
      <button type="button" onClick={()=>setPlaying(false)} style={{padding:12,border:'1px solid #84b8b1'}}>Pause</button>
      <input aria-label="Study time" type="range" min="2800" max="5200" step="1" value={elapsed} onChange={e=>{setPlaying(false);setElapsed(Number(e.target.value));}} style={{flex:1}}/>
    </div>
  </main>;
}
