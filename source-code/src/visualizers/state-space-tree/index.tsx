import {useRef,useState} from 'react';
import {hierarchy,tree} from 'd3-hierarchy';
import type {VisualState,TreeNode} from '../../algorithms/knapsack-01/shared';
import {Button} from '../../components/ui/button';

type DrawNode=TreeNode&{children:DrawNode[]};
export function StateSpaceTreeView({state,compact=false}:{state:VisualState;compact?:boolean}){
 const [zoom,setZoom]=useState(1);
 const frame=useRef<HTMLDivElement>(null);
 const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 if(!state.nodes.length)return <p className="muted">Cây sẽ hiện khi bắt đầu chạy.</p>;
 const shown=state.nodes.slice(0,compact?60:150);
 const byId=new Map<number,DrawNode>(shown.map(n=>[n.id,{...n,children:[]}]));
 for(const n of shown)if(n.parent!==null&&byId.has(n.parent))byId.get(n.parent)!.children.push(byId.get(n.id)!);
 const roots=shown.filter(n=>n.parent===null||!byId.has(n.parent)).map(n=>byId.get(n.id)!);
 const root=hierarchy({id:-1,label:'',status:'open',value:0,children:roots});
 const layout=tree<typeof root.data>().nodeSize([72,86])(root);
 const descendants=layout.descendants().slice(1);
 const minX=Math.min(0,...descendants.map(n=>n.x)),maxX=Math.max(0,...descendants.map(n=>n.x)),maxY=Math.max(0,...descendants.map(n=>n.y));
 const width=Math.max(320,maxX-minX+100),height=maxY+80;
 return <div><div className="flex gap-1 mb-2"><Button size="sm" variant="outline" aria-label="Phóng to cây" onClick={()=>setZoom(z=>Math.min(2,z+0.25))}>＋</Button><Button size="sm" variant="outline" aria-label="Thu nhỏ cây" onClick={()=>setZoom(z=>Math.max(0.5,z-0.25))}>－</Button><Button size="sm" variant="outline" onClick={()=>setZoom(1)}>Đặt lại</Button><span className="muted text-xs self-center">Kéo để di chuyển · {Math.round(zoom*100)}%</span></div><div ref={frame} className="overflow-auto max-h-[440px] border border-neutral-200 rounded cursor-grab active:cursor-grabbing" onMouseDown={e=>{if(!frame.current)return;drag.current={x:e.clientX,y:e.clientY,left:frame.current.scrollLeft,top:frame.current.scrollTop}}} onMouseMove={e=>{if(!drag.current||!frame.current)return;frame.current.scrollLeft=drag.current.left-(e.clientX-drag.current.x);frame.current.scrollTop=drag.current.top-(e.clientY-drag.current.y)}} onMouseUp={()=>{drag.current=null}} onMouseLeave={()=>{drag.current=null}}><svg role="img" aria-label="Cây không gian trạng thái" width={width*zoom} height={height*zoom} viewBox={`${minX-50} 0 ${width} ${height}`}><g transform="translate(0,30)">{layout.links().filter(l=>l.source.depth>0).map((l,i)=><line key={i} x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} stroke="#888" strokeDasharray={l.target.data.status==='pruned'?'4 3':undefined}/>)}{descendants.map(n=><g key={n.data.id} transform={`translate(${n.x},${n.y})`}><circle r="20" fill={n.data.status==='best'?'#111':n.data.status==='current'?'#aaa':'#fff'} stroke="#111" strokeWidth={n.data.status==='current'?3:1} strokeDasharray={n.data.status==='pruned'?'3 2':undefined}/><text textAnchor="middle" dy="4" fontSize="11" fill={n.data.status==='best'?'white':'black'}>{n.data.id}</text><text textAnchor="middle" y="34" fontSize="10">{n.data.label}</text></g>)}</g></svg>{state.nodes.length>shown.length&&<p className="muted p-2">Cây lớn: chỉ vẽ {shown.length} nút đầu / {state.nodes.length}; kết quả vẫn được tính đầy đủ.</p>}</div></div>
}
