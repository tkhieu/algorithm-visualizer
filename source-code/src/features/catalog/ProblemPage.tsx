import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {algorithms,problems} from '../../catalog/manifest';
import {loadProblem,type AnyProblem} from '../../catalog/registry';
import {Button} from '../../components/ui/button';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Breadcrumbs} from '../nav/Breadcrumbs';

export function ProblemPage({problemId}:{problemId:string}){
 const [problem,setProblem]=useState<AnyProblem|null>(null);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{let active=true;setLoaded(false);loadProblem(problemId).then(p=>{if(active){setProblem(p??null);setLoaded(true)}});return()=>{active=false}},[problemId]);
 const summary=problems.find(p=>p.id===problemId);
 const problemAlgos=algorithms.filter(a=>a.problemId===problemId);
 const readyAlgos=problemAlgos.filter(a=>a.status==='ready');
 const chapter=readyAlgos[0]?.chapter??problemAlgos[0]?.chapter;
 const crumbs=[...(chapter?[{label:`Chương ${chapter}`,to:`/chapter/${chapter}`}]:[]),{label:summary?.title??problemId}];

 if(!problem){
  return <div className="space-y-5">
   <Breadcrumbs items={crumbs}/>
   <h1>{summary?.title??problemId}</h1>
   <p className="muted">{loaded?'Bài toán này chưa được triển khai. Theo dõi tiến độ ở trang /problems.':'Đang tải bài toán…'}</p>
  </div>;
 }

 return <div className="space-y-5">
  <Breadcrumbs items={crumbs}/>
  <div><p className="eyebrow">Bài toán · {problemId}</p><h1>{problem.title}</h1><p>{problem.statement}</p></div>
  <Card><CardHeader><CardTitle>Ràng buộc</CardTitle></CardHeader><CardContent>
   <ul className="list-disc pl-5 mt-2">{problem.constraints.map(c=><li key={c}>{c}</li>)}</ul>
  </CardContent></Card>
  <div className="flex gap-2">
   {readyAlgos.length>1&&<Button asChild><Link to={`/compare/${problemId}?algos=${readyAlgos.map(a=>a.id.split('/')[1]).join(',')}`}>So sánh tất cả</Link></Button>}
   <Button variant="outline" asChild><Link to={`/testcases/${problemId}`}>Bộ ca kiểm thử</Link></Button>
  </div>
  <div className="grid gap-3 md:grid-cols-2">{problemAlgos.map(a=><Card key={a.id}><CardHeader><CardTitle>{a.title}</CardTitle></CardHeader><CardContent>
   <p>Chương {a.chapter} · §{a.section}{a.page?` · tr. ${a.page}`:''}</p>
   <p>{a.exactness==='exact'?'Nghiệm chính xác':a.exactness==='approximate'?'Nghiệm xấp xỉ':'Nghiệm thực nghiệm'} · Thời gian {a.complexity.time} · Bộ nhớ {a.complexity.space}</p>
   {a.status==='ready'?<Button variant="outline" className="mt-2" asChild><Link to={`/play/${problemId}/${a.id.split('/')[1]}`}>Xem từng bước</Link></Button>:<p className="muted mt-2">Sắp có</p>}
  </CardContent></Card>)}</div>
 </div>;
}
