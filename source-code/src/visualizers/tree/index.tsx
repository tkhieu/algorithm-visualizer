import {hierarchy,tree as d3tree} from 'd3-hierarchy';

/** View "tree": cây tổng quát — BST/AVL/2-3/B-tree/heap/Huffman/cây đệ quy (không phải cây duyệt vét cạn). */
export interface TreeNode{id:string;parent:string|null;label:string;role?:string}
export interface TreeVisualState{nodes:TreeNode[];note?:string}

type DrawNode=TreeNode&{children:DrawNode[]};
export function TreeView({state,compact=false}:{state:TreeVisualState;compact?:boolean}){
 if(!state.nodes.length)return <p className="muted">Cây sẽ hiện khi bắt đầu chạy.</p>;
 const shown=state.nodes.slice(0,compact?40:200);
 const byId=new Map<string,DrawNode>(shown.map(n=>[n.id,{...n,children:[]}]));
 for(const n of shown)if(n.parent!==null&&byId.has(n.parent))byId.get(n.parent)!.children.push(byId.get(n.id)!);
 const roots=shown.filter(n=>n.parent===null||!byId.has(n.parent)).map(n=>byId.get(n.id)!);
 const root=hierarchy<DrawNode>({id:'__root__',parent:null,label:'',children:roots});
 const layout=d3tree<DrawNode>().nodeSize([60,70])(root);
 const descendants=layout.descendants().slice(1);
 const minX=Math.min(0,...descendants.map(n=>n.x)),maxX=Math.max(0,...descendants.map(n=>n.x)),maxY=Math.max(0,...descendants.map(n=>n.y));
 const width=Math.max(200,maxX-minX+80),height=maxY+60;
 return <div data-testid="tree-view" className="overflow-auto max-h-[440px]">
  <svg role="img" aria-label="Cây" width={width} height={height} viewBox={`${minX-40} 0 ${width} ${height}`}>
   <g transform="translate(0,25)">
    {layout.links().filter(l=>l.source.depth>0).map((l,i)=><line key={i} x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} stroke="#888"/>)}
    {descendants.map(n=><g key={n.data.id} data-testid={`tree-node-${n.data.id}`} data-role={n.data.role??''} style={{transform:`translate(${n.x}px,${n.y}px)`,transition:'transform 220ms ease'}}>
     <circle r="18" fill={n.data.role==='best'||n.data.role==='balanced'?'#111':n.data.role==='current'?'#aaa':'#fff'} stroke="#111"/>
     <text textAnchor="middle" dy="4" fontSize="11" fill={n.data.role==='best'||n.data.role==='balanced'?'white':'black'}>{n.data.label}</text>
    </g>)}
   </g>
  </svg>
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
