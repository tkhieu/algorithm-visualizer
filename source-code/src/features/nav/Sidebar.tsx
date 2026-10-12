import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {algorithms,problems} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import {techniques} from '../../catalog/techniques';

type Mode='chapter'|'technique'|'problem';
const MODE_KEY='sidebar:mode';

function readMode():Mode{
 try{const v=localStorage.getItem(MODE_KEY);if(v==='chapter'||v==='technique'||v==='problem')return v}catch{/* localStorage không khả dụng */}
 return 'chapter';
}
function useGroupOpen(storageKey:string,defaultOpen:boolean){
 const wasActive=useRef(defaultOpen);
 const [open,setOpen]=useState(()=>{
  try{const v=localStorage.getItem(storageKey);if(v!==null)return v==='1'}catch{/* ignore */}
  return defaultOpen;
 });
 useEffect(()=>{if(defaultOpen&&!wasActive.current)setOpen(true);wasActive.current=defaultOpen},[defaultOpen]);
 const toggle=()=>{const next=!open;setOpen(next);try{localStorage.setItem(storageKey,next?'1':'0')}catch{/* ignore */}};
 return [open,toggle] as const;
}

function AlgoLink({a}:{a:typeof algorithms[number]}){
 if(a.status!=='ready')return <span className="nav-sub muted" aria-disabled="true">{a.title} <span className="status-badge">Sắp có</span></span>;
 return <NavLink className="nav-sub" to={`/play/${a.problemId}/${a.id.split('/')[1]}`}>{a.title}</NavLink>;
}

function Group({id,label,count,defaultOpen,children}:{id:string;label:string;count:number;defaultOpen:boolean;children:ReactNode}){
 const [open,toggle]=useGroupOpen(`sidebar:group:${id}`,defaultOpen);
 return <div className="nav-group">
  <button className="nav-group-toggle" aria-expanded={open} onClick={toggle}>{open?'▾':'▸'} {label} <span className="muted text-xs">({count})</span></button>
  {open&&<div className="nav-group-body">{children}</div>}
 </div>;
}

export function Sidebar(){
 const location=useLocation();
 const [mode,setModeState]=useState<Mode>(readMode());
 const setMode=(m:Mode)=>{setModeState(m);try{localStorage.setItem(MODE_KEY,m)}catch{/* ignore */}};
 const problemTitle=new Map(problems.map(p=>[p.id,p.title]));

 const isActiveAlgo=(a:typeof algorithms[number])=>location.pathname===`/play/${a.problemId}/${a.id.split('/')[1]}`;

 return <aside className="sidebar">
  <Link to="/" className="brand">LEVITIN <span>CATALOG</span></Link>
  <p className="muted text-xs mt-1">TRỰC QUAN HÓA THUẬT TOÁN</p>
  <div className="flex gap-1 my-5 flex-wrap">
   <button className={mode==='chapter'?'selected':''} onClick={()=>setMode('chapter')}>Theo chương</button>
   <button className={mode==='technique'?'selected':''} onClick={()=>setMode('technique')}>Theo kỹ thuật</button>
   <button className={mode==='problem'?'selected':''} onClick={()=>setMode('problem')}>Theo bài toán</button>
  </div>

  {mode==='chapter'&&chapters.map(c=>{
   const inChapter=algorithms.filter(a=>a.chapter===c.id);
   if(!inChapter.length)return null;
   const byProblem=new Map<string,typeof algorithms>();
   for(const a of inChapter)byProblem.set(a.problemId,[...(byProblem.get(a.problemId)??[]),a]);
   const active=inChapter.some(isActiveAlgo)||inChapter.some(a=>location.pathname===`/problem/${a.problemId}`);
   return <Group key={c.id} id={`chapter-${c.id}`} label={`Ch.${c.id} · ${c.name}`} count={inChapter.length} defaultOpen={active}>
    {[...byProblem.entries()].map(([pid,algos])=><div key={pid} className="nav-subgroup">
     <NavLink to={`/problem/${pid}`} className="nav-problem">{problemTitle.get(pid)??pid}</NavLink>
     {algos.map(a=><AlgoLink key={a.id} a={a}/>)}
    </div>)}
   </Group>;
  })}

  {mode==='technique'&&techniques.map(t=>{
   const inTechnique=algorithms.filter(a=>a.technique===t.id);
   if(!inTechnique.length)return null;
   const byProblem=new Map<string,typeof algorithms>();
   for(const a of inTechnique)byProblem.set(a.problemId,[...(byProblem.get(a.problemId)??[]),a]);
   const active=inTechnique.some(isActiveAlgo)||inTechnique.some(a=>location.pathname===`/problem/${a.problemId}`);
   return <Group key={t.id} id={`technique-${t.id}`} label={t.name} count={inTechnique.length} defaultOpen={active}>
    {[...byProblem.entries()].map(([pid,algos])=><div key={pid} className="nav-subgroup">
     <NavLink to={`/problem/${pid}`} className="nav-problem">{problemTitle.get(pid)??pid}</NavLink>
     {algos.map(a=><AlgoLink key={a.id} a={a}/>)}
    </div>)}
   </Group>;
  })}

  {mode==='problem'&&problems.map(p=>{
   const algos=algorithms.filter(a=>a.problemId===p.id);
   const active=algos.some(isActiveAlgo)||location.pathname===`/problem/${p.id}`;
   return <Group key={p.id} id={`problem-${p.id}`} label={p.title} count={algos.length} defaultOpen={active}>
    {algos.map(a=><AlgoLink key={a.id} a={a}/>)}
   </Group>;
  })}

  <div className="nav-group mt-5">
   <NavLink to="/problems">Bài toán</NavLink>
   <NavLink to="/algorithms">Toàn bộ thuật toán</NavLink>
   <NavLink to="/about">Giới thiệu</NavLink>
  </div>
 </aside>;
}
