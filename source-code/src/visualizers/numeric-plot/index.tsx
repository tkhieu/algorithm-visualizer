/** View "numeric-plot": đồ thị hàm số — chia đôi, dây cung, Newton, miền khả thi quy hoạch tuyến tính. */
export interface NumericPlotPoint{x:number;y:number;role?:string}
export interface NumericPlotVisualState{
 domain:[number,number];
 samples:{x:number;y:number}[];
 points?:NumericPlotPoint[];
 intervals?:{from:number;to:number}[];
 tangent?:{from:{x:number;y:number};to:{x:number;y:number}};
 secant?:{from:{x:number;y:number};to:{x:number;y:number}};
 iterates?:{x:number;y:number}[];
 feasibleRegion?:{x:number;y:number}[];
 note?:string;
}
export function NumericPlotView({state,compact=false}:{state:NumericPlotVisualState;compact?:boolean}){
 if(!state.samples.length)return <p className="muted">Đồ thị sẽ hiện khi bắt đầu chạy.</p>;
 const width=compact?240:420,height=compact?140:220,pad=24;
 const [lo,hi]=state.domain;
 const ys=state.samples.map(s=>s.y);
 const minY=Math.min(...ys,0),maxY=Math.max(...ys,0);
 const spanX=Math.max(1e-9,hi-lo),spanY=Math.max(1e-9,maxY-minY);
 const sx=(x:number)=>pad+((x-lo)/spanX)*(width-2*pad);
 const sy=(y:number)=>height-pad-((y-minY)/spanY)*(height-2*pad);
 const path=state.samples.map(s=>`${sx(s.x)},${sy(s.y)}`).join(' ');
 const segment=(line:{from:{x:number;y:number};to:{x:number;y:number}}|undefined,kind:string,dashed:boolean)=>line&&<line data-testid={kind} x1={sx(line.from.x)} y1={sy(line.from.y)} x2={sx(line.to.x)} y2={sy(line.to.y)} stroke="#333" strokeWidth={1.5} strokeDasharray={dashed?'4 3':undefined}/>;
 return <div data-testid="numeric-plot" className="overflow-auto max-h-[440px]">
  <svg role="img" aria-label="Đồ thị hàm số" width={width} height={height}>
   {state.feasibleRegion&&<polygon data-testid="feasible-region" points={state.feasibleRegion.map(p=>`${sx(p.x)},${sy(p.y)}`).join(' ')} fill="#eee" stroke="#999"/>}
   <line x1={pad} y1={sy(0)} x2={width-pad} y2={sy(0)} stroke="#ccc"/>
   <polyline points={path} fill="none" stroke="#111" strokeWidth={1.5}/>
   {state.intervals?.map((iv,i)=><rect key={i} data-testid={`interval-${i}`} x={sx(iv.from)} y={pad/2} width={Math.max(1,sx(iv.to)-sx(iv.from))} height={height-pad*1.5} fill="#000" opacity={0.08}/>)}
   {segment(state.tangent,'tangent',false)}
   {segment(state.secant,'secant',true)}
   {state.iterates?.map((p,i)=><circle key={i} data-testid={`iterate-${i}`} cx={sx(p.x)} cy={sy(p.y)} r="3" fill="#fff" stroke="#111"/>)}
   {state.points?.map((p,i)=><circle key={i} data-testid={`point-${i}`} data-role={p.role??''} cx={sx(p.x)} cy={sy(p.y)} r={4} fill={p.role==='root'?'#111':'#777'}/>)}
  </svg>
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
