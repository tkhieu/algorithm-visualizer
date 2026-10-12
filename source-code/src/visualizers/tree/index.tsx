import {hierarchy,tree as d3tree} from 'd3-hierarchy';

/** View "tree": cây tổng quát — BST/AVL/2-3/B-tree/heap/Huffman/cây đệ quy (không phải cây duyệt vét cạn). */
export interface TreeNode{
 id:string;parent:string|null;label:string;role?:string;
 /** Chú thích phụ vẽ dưới nhãn chính (ví dụ hệ số cân bằng AVL). */
 sub?:string;
 /** Con trái/phải của cây nhị phân — dùng để một con duy nhất vẫn vẽ lệch đúng hướng. */
 side?:'L'|'R';
}
export interface TreeVisualState{nodes:TreeNode[];note?:string}

type DrawNode=TreeNode&{children:DrawNode[];phantom?:boolean};
export function TreeView({state,compact=false}:{state:TreeVisualState;compact?:boolean}){
 if(!state.nodes.length)return <p className="muted">Cây sẽ hiện khi bắt đầu chạy.</p>;
 const shown=state.nodes.slice(0,compact?40:200);
 const byId=new Map<string,DrawNode>(shown.map(n=>[n.id,{...n,children:[]}]));
 for(const n of shown)if(n.parent!==null&&byId.has(n.parent))byId.get(n.parent)!.children.push(byId.get(n.id)!);
 // Giữ đúng vị trí trái/phải khi có `side`: hai con thì sắp L trước R; một con duy nhất thì chèn
 // một "con ma" vô hình ở phía còn lại để d3 đặt con thật lệch đúng hướng thay vì luôn căn giữa
 // (căn giữa khiến một con phải duy nhất và một con trái duy nhất trông giống nhau).
 for(const node of byId.values()){
  if(node.children.length===2&&node.children.every(c=>c.side)){
   node.children.sort((a,b)=>(a.side==='L'?0:1)-(b.side==='L'?0:1));
  }else if(node.children.length===1&&node.children[0].side){
   const real=node.children[0];
   const phantom:DrawNode={id:`${node.id}-phantom`,parent:node.id,label:'',children:[],phantom:true};
   node.children=real.side==='L'?[real,phantom]:[phantom,real];
  }
 }
 const roots=shown.filter(n=>n.parent===null||!byId.has(n.parent)).map(n=>byId.get(n.id)!);
 const root=hierarchy<DrawNode>({id:'__root__',parent:null,label:'',children:roots});
 const layout=d3tree<DrawNode>().nodeSize([60,70])(root);
 const descendants=layout.descendants().slice(1).filter(n=>!n.data.phantom);
 const minX=Math.min(0,...descendants.map(n=>n.x)),maxX=Math.max(0,...descendants.map(n=>n.x)),maxY=Math.max(0,...descendants.map(n=>n.y));
 const width=Math.max(200,maxX-minX+80),height=maxY+60;
 return <div data-testid="tree-view" className="overflow-auto max-h-[440px]">
  <svg role="img" aria-label="Cây" width={width} height={height} viewBox={`${minX-40} 0 ${width} ${height}`}>
   <g transform="translate(0,25)">
    {layout.links().filter(l=>l.source.depth>0&&!l.target.data.phantom).map((l,i)=><line key={i} x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} stroke="#888"/>)}
    {descendants.map(n=><g key={n.data.id} data-testid={`tree-node-${n.data.id}`} data-role={n.data.role??''} style={{transform:`translate(${n.x}px,${n.y}px)`,transition:'transform 220ms ease'}}>
     <circle r="18" fill={n.data.role==='best'||n.data.role==='balanced'?'#111':n.data.role==='current'?'#aaa':'#fff'} stroke="#111"/>
     <text textAnchor="middle" dy="4" fontSize="11" fill={n.data.role==='best'||n.data.role==='balanced'?'white':'black'}>{n.data.label}</text>
     {n.data.sub&&<text data-testid={`tree-node-${n.data.id}-sub`} textAnchor="middle" dy="30" fontSize="9" fill="#555">{n.data.sub}</text>}
    </g>)}
   </g>
  </svg>
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
