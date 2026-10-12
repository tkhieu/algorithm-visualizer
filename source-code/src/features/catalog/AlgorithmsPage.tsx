import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {algorithms,problems} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import {techniques} from '../../catalog/techniques';
import {Breadcrumbs} from '../nav/Breadcrumbs';

const exactnessLabel={exact:'Chính xác',approximate:'Xấp xỉ',heuristic:'Thực nghiệm'} as const;
type SortKey='title'|'problem'|'chapter'|'technique'|'exactness'|'status';
const columns:{key:SortKey;label:string}[]=[
 {key:'title',label:'Tên'},{key:'problem',label:'Bài toán'},{key:'chapter',label:'Chương/§'},
 {key:'technique',label:'Kỹ thuật'},{key:'exactness',label:'Loại'},{key:'status',label:'Trạng thái'},
];

/** /algorithms — bảng toàn bộ thuật toán, lọc + sắp xếp theo từng cột. */
export function AlgorithmsPage(){
 const [search,setSearch]=useState('');
 const [chapter,setChapter]=useState('all');
 const [technique,setTechnique]=useState('all');
 const [status,setStatus]=useState<'all'|'ready'|'planned'>('all');
 const [sort,setSort]=useState<{key:SortKey;dir:1|-1}>({key:'chapter',dir:1});
 const problemTitle=useMemo(()=>new Map(problems.map(p=>[p.id,p.title])),[]);

 const toggleSort=(key:SortKey)=>setSort(prev=>prev.key===key?{key,dir:prev.dir===1?-1:1}:{key,dir:1});
 const filtered=useMemo(()=>algorithms.filter(a=>
  (chapter==='all'||String(a.chapter)===chapter)&&
  (technique==='all'||a.technique===technique)&&
  (status==='all'||a.status===status)&&
  (`${a.title} ${problemTitle.get(a.problemId)??''}`.toLowerCase().includes(search.toLowerCase()))
 ),[chapter,technique,status,search,problemTitle]);
 const sorted=useMemo(()=>{
  const sortValue=(a:typeof algorithms[number],key:SortKey)=>{
   if(key==='problem')return problemTitle.get(a.problemId)??'';
   if(key==='chapter')return a.chapter*100+Number(a.section.split('.')[1]??0);
   return a[key];
  };
  return [...filtered].sort((x,y)=>{
   const vx=sortValue(x,sort.key),vy=sortValue(y,sort.key);
   return vx<vy?-sort.dir:vx>vy?sort.dir:0;
  });
 },[filtered,sort,problemTitle]);

 return <div className="space-y-5">
  <Breadcrumbs items={[{label:'Trang chủ',to:'/'},{label:'Thuật toán'}]}/>
  <div><p className="eyebrow">Catalog</p><h1>Toàn bộ thuật toán</h1><p className="muted">{algorithms.filter(a=>a.status==='ready').length}/{algorithms.length} thuật toán đã triển khai.</p></div>
  <div className="flex gap-2 flex-wrap">
   <input aria-label="Tìm trong bảng thuật toán" placeholder="Tìm thuật toán" value={search} onChange={e=>setSearch(e.target.value)}/>
   <select aria-label="Lọc chương (bảng)" value={chapter} onChange={e=>setChapter(e.target.value)}>
    <option value="all">Mọi chương</option>{chapters.map(c=><option key={c.id} value={c.id}>Chương {c.id}</option>)}
   </select>
   <select aria-label="Lọc kỹ thuật (bảng)" value={technique} onChange={e=>setTechnique(e.target.value)}>
    <option value="all">Mọi kỹ thuật</option>{techniques.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
   </select>
   <select aria-label="Lọc trạng thái (bảng)" value={status} onChange={e=>setStatus(e.target.value as typeof status)}>
    <option value="all">Mọi trạng thái</option><option value="ready">Đã có</option><option value="planned">Sắp có</option>
   </select>
  </div>
  <div className="overflow-auto">
   <table className="data-table" data-testid="algorithms-table">
    <thead><tr>{columns.map(c=><th key={c.key}><button onClick={()=>toggleSort(c.key)}>{c.label}{sort.key===c.key?(sort.dir===1?' ▲':' ▼'):''}</button></th>)}<th>Độ phức tạp</th></tr></thead>
    <tbody>{sorted.map(a=><tr key={a.id} data-testid={`algo-row-${a.id}`}>
     <td>{a.status==='ready'?<Link to={`/play/${a.problemId}/${a.id.split('/')[1]}`}>{a.title}</Link>:a.title}</td>
     <td><Link to={`/problem/${a.problemId}`}>{problemTitle.get(a.problemId)??a.problemId}</Link></td>
     <td>{a.chapter} · §{a.section}{a.page?` · tr.${a.page}`:''}</td>
     <td>{techniques.find(t=>t.id===a.technique)?.name??a.technique}</td>
     <td>{exactnessLabel[a.exactness]}</td>
     <td>{a.status==='ready'?'Đã có':'Sắp có'}</td>
     <td>{a.complexity.time}</td>
    </tr>)}</tbody>
   </table>
   {sorted.length===0&&<p className="muted mt-3">Không có thuật toán phù hợp bộ lọc.</p>}
  </div>
 </div>;
}
