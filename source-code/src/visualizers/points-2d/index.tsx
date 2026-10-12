import {useEffect,useRef,useState} from 'react';

/** View "points-2d": điểm, đoạn, bao lồi, dải chia để trị, hành trình TSP; kéo để pan. */
export interface Point2D{id?:string;x:number;y:number;role?:string}
export interface PointsSegment{from:number;to:number;role?:string}
export interface Points2DVisualState{points:Point2D[];segments?:PointsSegment[];hull?:number[];strip?:{minX:number;maxX:number};tour?:number[];note?:string}

export function Points2DView({state,compact=false}:{state:Points2DVisualState;compact?:boolean}){
 const [zoom,setZoom]=useState(1);
 const [pan,setPan]=useState({x:0,y:0});
 const drag=useRef<{x:number;y:number}|null>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const size=compact?220:380;
 const many=state.points.length>300;
 let minX=0,maxX=1,minY=0,maxY=1;
 for(const p of state.points){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y)}
 const spanX=Math.max(1,maxX-minX),spanY=Math.max(1,maxY-minY);
 const pad=20;
 const sx=(x:number)=>pan.x+size/2+zoom*(pad+((x-minX)/spanX)*(size-2*pad)-size/2);
 const sy=(y:number)=>pan.y+size/2+zoom*(pad+((y-minY)/spanY)*(size-2*pad)-size/2);
 const hullPath=state.hull?.map(i=>state.points[i]).filter(Boolean).map(p=>`${sx(p.x)},${sy(p.y)}`).join(' ');
 const tourPath=state.tour?.map(i=>state.points[i]).filter(Boolean).map(p=>`${sx(p.x)},${sy(p.y)}`).join(' ');
 useEffect(()=>{
  if(!many)return;
  const ctx=canvas.current?.getContext('2d');if(!ctx)return;
  ctx.clearRect(0,0,size,size);ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);
  if(state.strip){ctx.fillStyle='#eee';ctx.fillRect(sx(state.strip.minX),0,sx(state.strip.maxX)-sx(state.strip.minX),size)}
  for(const indices of [state.hull,state.tour])if(indices&&indices.length){
   ctx.beginPath();indices.forEach((i,j)=>{const p=state.points[i];if(p){if(j===0)ctx.moveTo(sx(p.x),sy(p.y));else ctx.lineTo(sx(p.x),sy(p.y))}});
   if(indices===state.hull)ctx.closePath();ctx.strokeStyle='#111';ctx.lineWidth=2;ctx.stroke();
  }
  for(const seg of state.segments??[]){const a=state.points[seg.from],b=state.points[seg.to];if(!a||!b)continue;ctx.beginPath();ctx.moveTo(sx(a.x),sy(a.y));ctx.lineTo(sx(b.x),sy(b.y));ctx.strokeStyle=seg.role==='closest'?'#111':'#999';ctx.lineWidth=seg.role==='closest'?2:1;ctx.stroke()}
  for(const p of state.points){ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),p.role?4:2,0,Math.PI*2);ctx.fillStyle=p.role?'#111':'#555';ctx.fill()}
 });
 if(!state.points.length)return <p className="muted">Các điểm sẽ hiện khi bắt đầu chạy.</p>;
 return <div data-testid="points-2d" className="overflow-auto max-h-[440px]">
  {!compact&&<div className="flex gap-2 mb-2"><button aria-label="Phóng to" onClick={()=>setZoom(z=>Math.min(8,z*1.5))}>＋</button><button aria-label="Thu nhỏ" onClick={()=>setZoom(z=>Math.max(0.25,z/1.5))}>－</button><button onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>Đặt lại</button></div>}
  <div onPointerDown={e=>{drag.current={x:e.clientX-pan.x,y:e.clientY-pan.y};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current)setPan({x:e.clientX-drag.current.x,y:e.clientY-drag.current.y})}} onPointerUp={()=>{drag.current=null}}>
  {many?<canvas ref={canvas} role="img" aria-label="Điểm 2D" width={size} height={size}/>:<svg role="img" aria-label="Điểm 2D" width={size} height={size}>
   {state.strip&&<rect data-testid="strip" x={sx(state.strip.minX)} y={0} width={Math.max(0,sx(state.strip.maxX)-sx(state.strip.minX))} height={size} fill="#eee"/>}
   {hullPath&&<polygon points={hullPath} fill="none" stroke="#111" strokeDasharray="4 2"/>}
   {tourPath&&<polyline data-testid="tour" points={tourPath} fill="none" stroke="#555" strokeWidth="2"/>}
   {state.segments?.map((s,i)=>{
    const a=state.points[s.from],b=state.points[s.to];
    if(!a||!b)return null;
    return <line key={i} data-testid={`segment-${s.from}-${s.to}`} x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke={s.role==='closest'?'#111':'#999'} strokeWidth={s.role==='closest'?2.5:1}/>;
   })}
   {state.points.map((p,i)=><circle key={p.id??i} data-testid={`point-${i}`} data-role={p.role??''} cx={sx(p.x)} cy={sy(p.y)} r={p.role?5:3.5} fill={p.role?'#111':'#555'}/>)}
  </svg>}
  </div>
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
