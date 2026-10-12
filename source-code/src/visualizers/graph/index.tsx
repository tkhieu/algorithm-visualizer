import {useEffect,useId,useMemo,useRef} from 'react';

/** Stable node IDs; optional layer and partition select DAG and bipartite layouts. */
export interface GraphNode{id:string;label?:string;role?:string;x?:number;y?:number;layer?:number;partition?:'left'|'right';distance?:string|number}
export interface GraphEdge{from:string;to:string;weight?:number;directed?:boolean;role?:string;flow?:number;capacity?:number}
export interface GraphVisualState{nodes:GraphNode[];edges:GraphEdge[];note?:string}
type Position={x:number;y:number};

function layout(nodes:GraphNode[],width:number,height:number):Map<string,Position>{
 const positioned=new Map<string,Position>();
 const groups=new Map<number,GraphNode[]>();
 const layered=nodes.some(n=>n.layer!==undefined);
 const bipartite=!layered&&nodes.some(n=>n.partition!==undefined);
 if(layered||bipartite){
  for(const n of nodes){
   const key=layered?(n.layer??0):(n.partition==='right'?1:0);
   const group=groups.get(key)??[];group.push(n);groups.set(key,group);
  }
  const keys=[...groups.keys()].sort((a,b)=>a-b);
  keys.forEach((key,column)=>groups.get(key)!.forEach((n,row)=>{
   const count=groups.get(key)!.length;
   positioned.set(n.id,{x:40+(column+0.5)*(width-80)/keys.length,y:24+(row+0.5)*(height-48)/count});
  }));
 }else{
  const cx=width/2,cy=height/2,r=Math.max(20,Math.min(cx,cy)-40);
  nodes.forEach((n,i)=>{
   const angle=2*Math.PI*i/Math.max(1,nodes.length)-Math.PI/2;
   positioned.set(n.id,{x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)});
  });
 }
 for(const n of nodes)if(n.x!==undefined&&n.y!==undefined)positioned.set(n.id,{x:n.x,y:n.y});
 return positioned;
}
function edgeLabel(edge:GraphEdge):string{
 if(edge.flow!==undefined||edge.capacity!==undefined)return `${edge.flow??0}/${edge.capacity??'∞'}`;
 return edge.weight===undefined?'':String(edge.weight);
}
function marked(role?:string){return role==='tree'||role==='path'||role==='best'||role==='visited'||role==='current'}

/** SVG through 300 vertices; Canvas above that threshold. */
export function GraphView({state,compact=false}:{state:GraphVisualState;compact?:boolean}){
 const width=compact?260:520,height=compact?200:390;
 const pos=useMemo(()=>layout(state.nodes,width,height),[state.nodes,width,height]);
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const markerId=useId().replaceAll(':','');
 const large=state.nodes.length>300;
 useEffect(()=>{
  if(!large)return;
  const ctx=canvasRef.current?.getContext('2d');
  if(!ctx)return;
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
  for(const e of state.edges){
   const a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)continue;
   ctx.strokeStyle=marked(e.role)?'#111':'#aaa';ctx.lineWidth=marked(e.role)?2:1;
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
   if(e.directed){const angle=Math.atan2(b.y-a.y,b.x-a.x);const x=b.x-12*Math.cos(angle),y=b.y-12*Math.sin(angle);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7*Math.cos(angle-.5),y-7*Math.sin(angle-.5));ctx.moveTo(x,y);ctx.lineTo(x-7*Math.cos(angle+.5),y-7*Math.sin(angle+.5));ctx.stroke()}
   const label=edgeLabel(e);if(label){ctx.fillStyle='#111';ctx.font='10px sans-serif';ctx.fillText(label,(a.x+b.x)/2,(a.y+b.y)/2)}
  }
  for(const n of state.nodes){
   const p=pos.get(n.id)!;const dark=marked(n.role);
   ctx.beginPath();ctx.arc(p.x,p.y,compact?3:4,0,Math.PI*2);ctx.fillStyle=dark?'#111':'#fff';ctx.fill();ctx.strokeStyle='#111';ctx.stroke();
   if(n.distance!==undefined){ctx.fillStyle='#333';ctx.font='9px sans-serif';ctx.fillText(String(n.distance),p.x+5,p.y-5)}
   if(n.label||marked(n.role)){ctx.fillStyle='#111';ctx.font='9px sans-serif';ctx.fillText(n.label??n.id,p.x+5,p.y+8)}
  }
 },[large,state,width,height,pos,compact]);
 if(!state.nodes.length)return <p className="muted">Đồ thị sẽ hiện khi bắt đầu chạy.</p>;
 return <div data-testid="graph-view" data-renderer={large?'canvas':'svg'} className="overflow-auto max-h-[440px]">
  {large?<canvas ref={canvasRef} width={width} height={height} role="img" aria-label={`Đồ thị ${state.nodes.length} đỉnh`}/>:<svg role="img" aria-label="Đồ thị" width={width} height={height}>
   <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#888"/></marker></defs>
   {state.edges.map((e,i)=>{
    const a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)return null;
    const label=edgeLabel(e);
    return <g key={i} data-testid={`edge-${e.from}-${e.to}`} data-role={e.role??''}>
     <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={marked(e.role)?'#111':'#aaa'} strokeWidth={marked(e.role)?2.5:1} markerEnd={e.directed?`url(#${markerId})`:undefined}/>
     {label&&<text x={(a.x+b.x)/2} y={(a.y+b.y)/2} fontSize="10" textAnchor="middle">{label}</text>}
    </g>;
   })}
   {state.nodes.map(n=>{
    const p=pos.get(n.id)!;const dark=n.role==='best'||n.role==='visited';
    return <g key={n.id} data-testid={`node-${n.id}`} data-role={n.role??''} transform={`translate(${p.x},${p.y})`}>
     <circle r="16" fill={dark?'#111':n.role==='current'?'#999':'#fff'} stroke="#111" strokeWidth={n.role==='current'?3:1}/>
     <text textAnchor="middle" dy="4" fontSize="11" fill={dark?'white':'black'}>{n.label??n.id}</text>
     {n.distance!==undefined&&<text x="18" y="-12" fontSize="10">{n.distance}</text>}
    </g>;
   })}
  </svg>}
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
