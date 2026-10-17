import {useEffect,useState} from 'react';
import {LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts';
import {algorithms} from '../../catalog/manifest';
import {loadProblem,type AnyProblem} from '../../catalog/registry';
import {benchPool} from '../../core/bench';
import {benchWorker} from '../../core/worker-protocol/client';
import {download,estimateSize} from '../../lib/utils';
import {useTestcaseStore} from '../../state/testcase.store';
import {Button} from '../../components/ui/button';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Breadcrumbs} from '../nav/Breadcrumbs';

type Row={id:string;pass:boolean;ms:number;message:string;notApplicable?:boolean};
const groupNames:Record<string,string>={normal:'Thông thường',edge:'Biên',small:'Dữ liệu nhỏ',large:'Dữ liệu lớn',special:'Đặc biệt',invalid:'Không hợp lệ'};

export function TestcasePage({problemId}:{problemId:string}){
 const [problem,setProblem]=useState<AnyProblem|null>(null);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{let active=true;setLoaded(false);loadProblem(problemId).then(p=>{if(active){setProblem(p??null);setLoaded(true)}});return()=>{active=false}},[problemId]);
 if(!problem)return <p>{loaded?'Bài toán này chưa được triển khai.':'Đang tải bài toán…'}</p>;
 return <LoadedTestcasePage problemId={problemId} problem={problem}/>;
}

function LoadedTestcasePage({problemId,problem}:{problemId:string;problem:AnyProblem}){
 const [rows,setRows]=useState<Row[]>([]);
 const [chart,setChart]=useState<{n:number;ms:number}[]>([]);
 const running=useTestcaseStore(s=>s.running),setRunning=useTestcaseStore(s=>s.setRunning);
 const readyAlgos=algorithms.filter(a=>a.problemId===problemId&&a.status==='ready');
 // Ưu tiên một thuật toán chính xác KHÔNG phải vét cạn/quay lui/nhánh cận làm chuẩn đối chiếu,
 // vì các kỹ thuật đó có thể quá chậm trên ca dữ liệu lớn (ví dụ vét cạn 2ⁿ trên cỡ 'large').
 // Khi mọi lựa chọn chính xác đều "chậm" (ví dụ TSP: chỉ vét cạn/nhánh cận là chính xác), các
 // problem đó phải tự calibrate cỡ 'large' trong generators.ts để thuật toán được chọn (phần tử
 // đầu theo thứ tự khai báo) chạy xong trong vài chục ms — không dựa vào nhánh cận vì thời gian
 // của nó phụ thuộc dữ liệu (worst-case vẫn O(2ⁿ)), không đoán trước được cho mọi seed.
 const slowTechniques=new Set(['brute-force','backtracking','branch-and-bound']);
 const referenceAlgo=
  readyAlgos.find(a=>a.exactness==='exact'&&!slowTechniques.has(a.technique))??
  readyAlgos.find(a=>a.exactness==='exact')??
  readyAlgos[0];
 const cases=problem.cases;

 const runAll=async()=>{
  setRows([]);
  setRunning(true);
  const invalid=cases.filter(c=>c.group==='invalid').map(c=>({id:c.id,pass:!problem.inputSchema.safeParse(c.input).success,ms:0,message:'Đầu vào phải bị từ chối'}));
  setRows(invalid);
  if(!referenceAlgo){setRunning(false);return}
  const applicable=cases.filter(c=>c.group!=='invalid');
  const toRow=(c:(typeof applicable)[number],r:Awaited<ReturnType<typeof benchWorker>>['result'],ms:number):Row=>{
   const score=r.status==='ok'&&problem.objective?problem.objective.score(c.input,r.output):undefined;
   const actual=typeof c.expected==='number'&&score!==undefined?score:r.status==='ok'?r.output:undefined;
   const matches=c.expected===undefined||JSON.stringify(actual)===JSON.stringify(c.expected);
   const pass=r.status==='ok'&&r.verdict.ok&&matches;
   const message=r.status==='ok'?(c.expected!==undefined?`Kết quả ${JSON.stringify(actual)}; kỳ vọng ${JSON.stringify(c.expected)}`:'Kết quả hợp lệ'):r.status==='not-applicable'?`Không áp dụng: ${r.reason}`:r.status;
   return {id:c.id,pass,ms,message,notApplicable:r.status==='not-applicable'};
  };
  const notApplicableIds=new Set<string>();
  const jobs=applicable.map(c=>({id:c.id,algoId:referenceAlgo.id,input:c.input}));
  await benchPool(jobs,(id,response)=>{
   if(response.result.status==='not-applicable')notApplicableIds.add(id);
   setRows(prev=>[...prev,toRow(cases.find(x=>x.id===id)!,response.result,response.medianMs)]);
  });
  // Thuật toán tham chiếu tự khai "Không áp dụng" cho ca này (ví dụ đồ thị lớn vượt ngưỡng an toàn
  // của quay lui) — thử lại bằng từng thuật toán ready còn lại theo đúng thứ tự khai báo, để ca đó
  // vẫn được một thuật toán áp dụng được kiểm chứng thay vì chỉ hiện "Không áp dụng" suông. Cơ chế
  // này chung cho mọi bài toán có nhiều thuật toán ready, không riêng gì graph-coloring.
  for(const algo of readyAlgos){
   if(algo.id===referenceAlgo.id||notApplicableIds.size===0)continue;
   const retryJobs=[...notApplicableIds].map(id=>({id,algoId:algo.id,input:cases.find(c=>c.id===id)!.input}));
   await benchPool(retryJobs,(id,response)=>{
    if(response.result.status==='not-applicable')return;
    notApplicableIds.delete(id);
    setRows(prev=>prev.map(row=>row.id===id?toRow(cases.find(c=>c.id===id)!,response.result,response.medianMs):row));
   });
  }
  setRunning(false);
 };
 const benchmark=async()=>{
  if(!referenceAlgo)return;
  const values=[];
  for(const size of ['tiny','small','medium','large'] as const){
   const input=problem.generate(77,size);
   const r=await benchWorker(referenceAlgo.id,input);
   values.push({n:estimateSize(input),ms:r.medianMs});
  }
  setChart(values);
 };
 // "Không áp dụng" không phải là "đạt" (chưa hề so với expected) lẫn "không đạt" (không phải kết
 // quả sai) — đếm riêng để không lẫn với tổng đạt, tránh che giấu lỗi thật ở các bài toán khác.
 const pass=rows.filter(r=>r.pass&&!r.notApplicable).length;
 const notApplicableCount=rows.filter(r=>r.notApplicable).length;
 const exportRows=rows.map(r=>({...r,group:cases.find(c=>c.id===r.id)?.group}));

 return <div className="space-y-4">
  <Breadcrumbs items={[{label:`Chương ${referenceAlgo?.chapter??'—'}`,to:referenceAlgo?`/chapter/${referenceAlgo.chapter}`:undefined},{label:problem.title,to:`/problem/${problemId}`},{label:'Ca kiểm thử'}]}/>
  <div><p className="eyebrow">Thực nghiệm</p><h1>Bộ ca kiểm thử</h1><p className="muted">{cases.length} ca dữ liệu, kiểm tra bằng {referenceAlgo?.title??'—'} và bộ chấm độc lập. Ca không hợp lệ phải bị từ chối.</p></div>
  <div className="flex gap-2 flex-wrap">
   <Button onClick={runAll} disabled={running}>{running?'Đang chạy…':'Chạy tất cả'}</Button>
   <Button variant="outline" disabled={!rows.length} onClick={()=>download('ket-qua-testcase.json',JSON.stringify(exportRows,null,2),'application/json')}>Xuất JSON</Button>
   <Button variant="outline" disabled={!rows.length} onClick={()=>download('ket-qua-testcase.csv',['id,nhom,dat,ms,ghi_chu',...exportRows.map(r=>`${r.id},${r.group},${r.pass},${r.ms},"${r.message}"`)].join('\n'),'text/csv')}>Xuất CSV</Button>
   <span data-testid="pass-count" data-status={running?'running':rows.length?'done':'idle'} className="self-center font-semibold">Đạt {pass}/{rows.length}{notApplicableCount>0?` · Không áp dụng ${notApplicableCount}`:''}</span>
  </div>
  {(Object.keys(groupNames)).map(group=><Card key={group}><CardHeader><CardTitle>{groupNames[group]}</CardTitle></CardHeader><CardContent><div className="overflow-auto"><table className="data-table"><thead><tr><th>Ca kiểm thử</th><th>Kỳ vọng</th><th>Kết quả</th><th>Trung vị ms</th><th>Chi tiết</th></tr></thead><tbody>{cases.filter(c=>c.group===group).map(c=>{
   const row=rows.find(r=>r.id===c.id);
   return <tr key={c.id}><td>{c.name}</td><td>{c.expected!==undefined?String(c.expected):'Từ chối'}</td><td>{row?(row.notApplicable?'Không áp dụng':row.pass?'Đạt':'Không đạt'):'Chưa chạy'}</td><td>{row?.ms.toFixed(2)??'—'}</td><td>{row?.message??c.note??'—'}</td></tr>;
  })}</tbody></table></div></CardContent></Card>)}
  <Card><CardHeader><CardTitle>Hiệu năng theo n</CardTitle></CardHeader><CardContent>
   <Button variant="outline" onClick={benchmark}>Đo thời gian</Button>
   {chart.length>0&&<div className="h-64 mt-3"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="#bbb"/><XAxis dataKey="n"/><YAxis/><Tooltip/><Line dataKey="ms" stroke="#111"/></LineChart></ResponsiveContainer></div>}
  </CardContent></Card>
 </div>;
}
