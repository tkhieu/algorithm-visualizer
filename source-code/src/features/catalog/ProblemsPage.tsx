import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {algorithms,problems} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import {techniques} from '../../catalog/techniques';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Button} from '../../components/ui/button';
import {Breadcrumbs} from '../nav/Breadcrumbs';

/** /problems — toàn bộ bài toán, lọc theo chương/kỹ thuật/trạng thái của cách giải. */
export function ProblemsPage(){
 const [search,setSearch]=useState('');
 const [status,setStatus]=useState<'all'|'ready'|'planned'>('all');
 const [chapter,setChapter]=useState('all');
 const [technique,setTechnique]=useState('all');
 const visible=useMemo(()=>problems.filter(p=>
  (status==='all'||p.status===status)&&
  `${p.title} ${p.id}`.toLowerCase().includes(search.toLowerCase())&&
  algorithms.some(a=>a.problemId===p.id&&
   (chapter==='all'||String(a.chapter)===chapter)&&
   (technique==='all'||a.technique===technique))
 ),[search,status,chapter,technique]);
 return <div className="space-y-5">
  <Breadcrumbs items={[{label:'Trang chủ',to:'/'},{label:'Bài toán'}]}/>
  <div><p className="eyebrow">Catalog</p><h1>Bài toán</h1><p className="muted">{problems.filter(p=>p.status==='ready').length}/{problems.length} bài toán đã triển khai đầy đủ.</p></div>
  <div className="flex gap-2 flex-wrap">
   <input aria-label="Tìm bài toán" placeholder="Tìm bài toán" value={search} onChange={e=>setSearch(e.target.value)}/>
   <select aria-label="Lọc chương bài toán" value={chapter} onChange={e=>setChapter(e.target.value)}>
    <option value="all">Mọi chương</option>{chapters.map(c=><option key={c.id} value={c.id}>Chương {c.id}</option>)}
   </select>
   <select aria-label="Lọc kỹ thuật bài toán" value={technique} onChange={e=>setTechnique(e.target.value)}>
    <option value="all">Mọi kỹ thuật</option>{techniques.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
   </select>
   <select aria-label="Lọc trạng thái bài toán" value={status} onChange={e=>setStatus(e.target.value as typeof status)}>
    <option value="all">Mọi trạng thái</option><option value="ready">Đã có</option><option value="planned">Sắp có</option>
   </select>
  </div>
  {visible.length===0?<p className="muted" data-testid="problems-empty">Không có bài toán nào khớp bộ lọc.</p>:
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" data-testid="problems-grid">{visible.map(p=>{
   const count=algorithms.filter(a=>a.problemId===p.id).length;
   const ready=algorithms.filter(a=>a.problemId===p.id&&a.status==='ready').length;
   return <Card key={p.id} data-testid={`problem-row-${p.id}`} className={p.status!=='ready'?'opacity-60':undefined}><CardHeader><CardTitle>{p.title}</CardTitle></CardHeader><CardContent>
    <p className="muted">{ready}/{count} cách giải sẵn sàng</p>
    {p.status==='ready'?<Button className="mt-2" variant="outline" asChild><Link to={`/problem/${p.id}`}>Xem bài toán</Link></Button>:<p className="muted mt-2">Sắp có</p>}
   </CardContent></Card>;
  })}</div>}
 </div>;
}
