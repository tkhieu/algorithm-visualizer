import {useEffect,useMemo,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {algorithms,problems} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import {techniques} from '../../catalog/techniques';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Button} from '../../components/ui/button';
import {Breadcrumbs} from '../nav/Breadcrumbs';

const exactnessLabel={exact:'Chính xác',approximate:'Xấp xỉ',heuristic:'Thực nghiệm'} as const;

/** Lưới thuật toán có lọc — dùng chung cho /chapter/:n, /technique/:t và (nhúng) trang chủ. */
export function CatalogPage({standalone=true}:{standalone?:boolean}={}){
 const {n,t}=useParams();
 const [search,setSearch]=useState('');
 const [chapter,setChapter]=useState(n||'all');
 const [technique,setTechnique]=useState(t||'all');
 const [status,setStatus]=useState<'all'|'ready'|'planned'>('all');
 useEffect(()=>{setChapter(n||'all');setTechnique(t||'all')},[n,t]);
 const problemTitle=useMemo(()=>new Map(problems.map(p=>[p.id,p.title])),[]);
 const visible=useMemo(()=>algorithms.filter(a=>
  (chapter==='all'||String(a.chapter)===chapter)&&
  (technique==='all'||a.technique===technique)&&
  (status==='all'||a.status===status)&&
  (`${a.title} ${problemTitle.get(a.problemId)??''}`.toLowerCase().includes(search.toLowerCase()))
 ),[search,chapter,technique,status,problemTitle]);
 const chapterName=chapters.find(c=>String(c.id)===n)?.name;
 const techniqueName=techniques.find(tq=>tq.id===t)?.name;
 return <div className="space-y-5">
  {standalone&&<Breadcrumbs items={[{label:'Trang chủ',to:'/'},{label:n?`Chương ${n}`:t?`Kỹ thuật · ${techniqueName??t}`:'Thuật toán'}]}/>}
  {standalone&&<h1>{n?`Chương ${n}${chapterName?` · ${chapterName}`:''}`:t?`Kỹ thuật · ${techniqueName??t}`:'Toàn bộ thuật toán'}</h1>}
  <div className="flex gap-2 flex-wrap">
   <input aria-label="Tìm kiếm" placeholder="Tìm thuật toán" value={search} onChange={e=>setSearch(e.target.value)}/>
   <select aria-label="Lọc chương" value={chapter} onChange={e=>setChapter(e.target.value)}>
    <option value="all">Mọi chương</option>
    {chapters.map(c=><option key={c.id} value={c.id}>Chương {c.id} · {c.name}</option>)}
   </select>
   <select aria-label="Lọc kỹ thuật" value={technique} onChange={e=>setTechnique(e.target.value)}>
    <option value="all">Mọi kỹ thuật</option>
    {techniques.map(tq=><option key={tq.id} value={tq.id}>{tq.name}</option>)}
   </select>
   <select aria-label="Lọc trạng thái" value={status} onChange={e=>setStatus(e.target.value as typeof status)}>
    <option value="all">Mọi trạng thái</option>
    <option value="ready">Đã có</option>
    <option value="planned">Sắp có</option>
   </select>
  </div>
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map(a=><Card key={a.id} className={a.status!=='ready'?'opacity-60':undefined}><CardHeader><CardTitle>{a.title}</CardTitle></CardHeader><CardContent>
   <p className="muted">{problemTitle.get(a.problemId)} · Chương {a.chapter} · §{a.section}{a.page?` · tr. ${a.page}`:''}</p>
   <p>{exactnessLabel[a.exactness]} · {a.complexity.time}</p>
   {a.status==='ready'
    ?<Button className="mt-3" variant="outline" asChild><Link to={`/play/${a.problemId}/${a.id.split('/')[1]}`}>Mở trình phát</Link></Button>
    :<p className="muted mt-3">Sắp có</p>}
  </CardContent></Card>)}</div>
  {visible.length===0&&<p className="muted">Không tìm thấy thuật toán phù hợp.</p>}
 </div>;
}
