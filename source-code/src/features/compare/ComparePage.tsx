import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer} from 'recharts';
import {algorithms} from '../../catalog/manifest';
import {loadAlgorithm,loadProblem,type AnyProblem} from '../../catalog/registry';
import {loadComparisonAdapter,loadProblemUi} from '../../catalog/ui-registry';
import type {ComparisonAdapter,RunResult} from '../../core/contracts';
import {TraceStore} from '../../core/trace/TraceStore';
import {runWorker,benchWorker} from '../../core/worker-protocol/client';
import {Visualizer} from '../../visualizers';
import {InputEditor} from '../input-editor/InputEditor';
import {useCompareStore} from '../../state/compare.store';
import {Button} from '../../components/ui/button';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Breadcrumbs} from '../nav/Breadcrumbs';
import {estimateSize} from '../../lib/utils';

// running phân biệt 'đang chạy' (task đã dispatch, chưa có result) với 'idle' (làn tồn tại —
// đã chọn thuật toán — nhưng chưa bấm "Chạy tất cả" nên chưa có trace thật): trace=null khi
// chưa chạy, vì initVisual cần algorithm đã tải và input hợp lệ, cả hai chỉ có tại thời điểm
// dispatch, không có sẵn lúc tải trang.
type Lane={id:string;trace:TraceStore<object>|null;cursor:number;result:RunResult<unknown>|null;medianMs:number;running:boolean};

export function ComparePage({problemId}:{problemId:string}){
 const [problem,setProblem]=useState<AnyProblem|null>(null);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{let active=true;setLoaded(false);loadProblem(problemId).then(p=>{if(active){setProblem(p??null);setLoaded(true)}});return()=>{active=false}},[problemId]);
 if(!problem)return <p>{loaded?'Bài toán này chưa được triển khai.':'Đang tải bài toán…'}</p>;
 return <LoadedComparePage problemId={problemId} problem={problem}/>;
}

function LoadedComparePage({problemId,problem}:{problemId:string;problem:AnyProblem}){
 const [params,setParams]=useSearchParams();
 const [ui,setUi]=useState<Awaited<ReturnType<typeof loadProblemUi>>>({});
 useEffect(()=>{let active=true;loadProblemUi(problemId).then(m=>{if(active)setUi(m)});return()=>{active=false}},[problemId]);
 const [adapter,setAdapter]=useState<ComparisonAdapter<unknown,unknown>|null>(null);
 useEffect(()=>{let active=true;loadComparisonAdapter(problemId).then(a=>{if(active)setAdapter(a??null)});return()=>{active=false}},[problemId]);
 const [queryText,setQueryText]=useState('{}');
 const [input,setInput]=useState<unknown>(problem.cases[0]?.input??{});
 const [lanes,setLanes]=useState<Lane[]>([]);
 const [busy,setBusy]=useState(false);
 const [chart,setChart]=useState<Record<string,number>[]>([]);
 const sync=useCompareStore(s=>s.sync),setSync=useCompareStore(s=>s.setSync);
 const problemAlgos=algorithms.filter(a=>a.problemId===problemId&&a.status==='ready');
 const ids=(params.get('algos')||problemAlgos.map(a=>a.id.split('/')[1]).join(',')).split(',').filter(x=>problemAlgos.some(a=>a.id===`${problemId}/${x}`));
 const idsKey=ids.join(',');
 // Mã thế hệ (generation): mỗi lần đổi lựa chọn hoặc bấm "Chạy tất cả" tăng runGen lên một.
 // Mọi tiếp diễn bất đồng bộ của một lượt chạy (sau mỗi await trong runAll, và mỗi callback
 // worker) tự so runGen.current với giá trị đã chụp lúc lượt chạy đó bắt đầu — nếu khác thì bỏ
 // qua kết quả, vì lượt chạy đó đã bị một lượt mới hơn (đổi lựa chọn hoặc bấm chạy lại) thay
 // thế. Nhờ vậy không còn chuyện kết quả "muộn" của id đã bị bỏ chọn rồi chọn lại ghi đè lên
 // làn mới (idle) vừa tạo cho đúng id đó.
 const runGen=useRef(0);
 const activeCancels=useRef<(()=>void)[]>([]);
 // Khi rời trang (unmount) giữa lúc đang so sánh: tăng runGen để mọi tiếp diễn bất đồng bộ còn
 // treo tự bỏ qua, và cancel() mọi worker đang chạy để không lãng phí tính toán ngầm. KHÔNG gọi
 // setLanes/setBusy ở đây — component đã unmount, gọi setState sẽ gây warning "state update on
 // an unmounted component"; runGen+cancel là đủ, vì không còn gì để render nữa.
 // Khi rời trang (unmount) giữa lúc đang so sánh: tăng runGen để mọi tiếp diễn bất đồng bộ còn
 // treo tự bỏ qua, và cancel() mọi worker đang chạy để không lãng phí tính toán ngầm. KHÔNG gọi
 // setLanes/setBusy ở đây — component đã unmount, gọi setState sẽ gây warning "state update on
 // an unmounted component"; runGen+cancel là đủ, vì không còn gì để render nữa.
 useEffect(()=>()=>{
  runGen.current++;
  for(const cancel of activeCancels.current)cancel();
  activeCancels.current=[];
 },[]);
 // Làn xuất hiện ngay khi trang tải / khi chọn lại thuật toán, ở trạng thái idle (chưa dispatch
 // run nào) — giữ lại làn đã có kết quả nếu id vẫn còn được chọn, để đổi lựa chọn không xoá kết
 // quả của các làn khác. Tách idsKey (chuỗi, ổn định) ra làm dep duy nhất thay vì mảng ids (đổi
 // tham chiếu mỗi lần render) để effect chỉ chạy lại khi tập thuật toán được chọn thật sự đổi.
 useEffect(()=>{
  runGen.current++;
  for(const cancel of activeCancels.current)cancel();
  activeCancels.current=[];
  setBusy(false);
  const currentIds=idsKey?idsKey.split(','):[];
  setLanes(prev=>currentIds.map(id=>{
   const existing=prev.find(l=>l.id===id);
   // Làn vẫn đang running (chưa có result) vừa bị cancel() ở trên — lượt chạy của nó không
   // bao giờ hoàn tất nữa (kết quả, nếu tới muộn, sẽ bị runGen chặn), nên phải đưa về idle
   // ngay, không được để running:true mãi. Làn đã có result (xong, bất kể trạng thái nào) thì
   // giữ nguyên để đổi lựa chọn không xoá kết quả của làn chưa đổi.
   if(existing&&!existing.running)return existing;
   return {id,trace:null,cursor:0,result:null,medianMs:0,running:false};
  }));
 },[idsKey]);
 const parsed=problem.inputSchema.safeParse(input);
 const valid=parsed.success?parsed.data:null;
 const canCompare=problemAlgos.length<2||adapter?.problemId===problemId;
 let queryRaw:unknown;
 try{queryRaw=JSON.parse(queryText) as unknown}catch{queryRaw=undefined}
 const queryResult=adapter?.query?.safeParse(queryRaw);
 const queryValid=!adapter?.query||queryResult?.success===true;
 const query=queryResult?.success?queryResult.data:undefined;
 const updateLane=(id:string,patch:Partial<Lane>)=>setLanes(prev=>prev.map(l=>l.id===id?{...l,...patch}:l));
 const runAll=async()=>{
  if(!valid||!canCompare||!queryValid)return;
  const myGen=++runGen.current;
  activeCancels.current=[];
  setBusy(true);
  const algos=await Promise.all(ids.map(id=>loadAlgorithm(`${problemId}/${id}`)));
  if(runGen.current!==myGen)return; // lựa chọn đã đổi khi đang tải algorithm — bỏ lượt này
  const initial:Lane[]=ids.map((id,i)=>({id,trace:new TraceStore((algos[i]?.initVisual(valid)??{}) as object),cursor:0,result:null,medianMs:0,running:true}));
  setLanes(initial);
  await Promise.all(initial.map(async lane=>{
   const task=runWorker(`${problemId}/${lane.id}`,valid,steps=>{
    if(runGen.current!==myGen)return;
    for(const step of steps)lane.trace!.append(step);
    updateLane(lane.id,{trace:lane.trace});
   });
   activeCancels.current.push(task.cancel);
   const result=await task.promise;
   if(runGen.current!==myGen)return;
   const bench=result.status==='ok'?await benchWorker(`${problemId}/${lane.id}`,valid):null;
   if(runGen.current!==myGen)return;
   updateLane(lane.id,{result,medianMs:bench?.medianMs??0,running:false});
  }));
  if(runGen.current===myGen)setBusy(false);
 };
 const setCursor=(id:string,cursor:number)=>{
  const source=lanes.find(l=>l.id===id);
  if(!source)return;
  const sourceLength=source.trace?.length??0;
  const target=Math.max(0,Math.min(sourceLength,cursor));
  const sourcePhase=source.trace?.steps[Math.max(0,target-1)]?.phase;
  setLanes(prev=>prev.map(l=>{
   const laneLength=l.trace?.length??0;
   let next=l.cursor;
   if(l.id===id)next=target;
   else if(sync==='step')next=target;
   else if(sync==='progress')next=Math.round((sourceLength?target/sourceLength:0)*laneLength);
   else if(sync==='phase'&&sourcePhase){const i=l.trace?.steps.findIndex(s=>s.phase===sourcePhase)??-1;if(i>=0)next=i+1}
   return {...l,cursor:Math.max(0,Math.min(laneLength,next))};
  }));
 };
 const benchmark=async()=>{
  const rows:Record<string,number>[]=[];
  for(const size of ['tiny','small','medium'] as const){
   const data=problem.generate(42,size);
   const row:Record<string,number>={n:estimateSize(data)};
   await Promise.all(ids.map(async id=>{row[id]=(await benchWorker(`${problemId}/${id}`,data)).medianMs}));
   rows.push(row);
  }
  setChart(rows);
 };
 const selectAlgo=(id:string,checked:boolean)=>{
  const next=checked?[...new Set([...ids,id])]:ids.filter(x=>x!==id);
  setParams(p=>{p.set('algos',next.join(','));return p});
 };
 return <div className="space-y-4">
  <Breadcrumbs items={[{label:`Chương ${problemAlgos[0]?.chapter??'—'}`,to:problemAlgos[0]?`/chapter/${problemAlgos[0].chapter}`:undefined},{label:problem.title,to:`/problem/${problemId}`},{label:'So sánh'}]}/>
  <div><p className="eyebrow">Cùng dữ liệu · nhiều chiến lược</p><h1>So sánh thuật toán</h1><p className="muted">Mỗi làn có con trỏ riêng. Giá trị được chuẩn hoá theo cùng bài toán.</p></div>
  <Card><CardHeader><CardTitle>Dữ liệu chung</CardTitle></CardHeader><CardContent>
   <div className="max-w-xl">{ui.InputEditor?<ui.InputEditor input={input} onChange={setInput} disabled={busy}/>:<InputEditor problem={problem} input={input} onChange={setInput} disabled={busy}/>}</div>
   {adapter?.query&&<label className="field-label mt-3 block">Tham số so sánh (JSON)<textarea aria-label="Tham số so sánh" rows={3} value={queryText} onChange={e=>setQueryText(e.target.value)} disabled={busy}/><span role="status">{queryValid?'Tham số hợp lệ':'Tham số chưa hợp lệ'}</span></label>}
   <div className="flex gap-3 flex-wrap my-3">{problemAlgos.map(a=>{const id=a.id.split('/')[1];return <label key={id} className="text-sm"><input type="checkbox" checked={ids.includes(id)} onChange={e=>selectAlgo(id,e.target.checked)}/> {a.title}</label>})}</div>
   <div className="flex gap-2 items-center flex-wrap">
    <Button onClick={runAll} disabled={!valid||!canCompare||!queryValid||busy||ids.length===0}>{busy?'Đang chạy…':'Chạy tất cả'}</Button>
    <label>Đồng bộ <select aria-label="Chế độ đồng bộ" value={sync} onChange={e=>setSync(e.target.value as typeof sync)}><option value="independent">Độc lập</option><option value="progress">% tiến độ</option><option value="phase">Giai đoạn</option><option value="step">Số bước</option></select></label>
  </div>
   {!canCompare&&<p role="status" className="muted">Bài toán cần bộ chuyển đổi kết quả để so sánh các cách giải.</p>}
  </CardContent></Card>
  <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">{lanes.map(l=>{
   const a=problemAlgos.find(x=>x.id.endsWith(`/${l.id}`))!;
   const traceLength=l.trace?.length??0;
   const state=l.trace?l.trace.seek(Math.min(l.cursor,traceLength)):null;
   return <Card key={l.id}><CardHeader><CardTitle>{a.title}</CardTitle></CardHeader><CardContent>
    <p className="text-sm muted">{a.exactness==='exact'?'Chính xác':a.exactness==='approximate'?'Xấp xỉ':'Thực nghiệm'} · {a.complexity.time}</p>
    <div data-testid={`lane-${l.id}`} data-status={l.running?'running':l.result?l.result.status:'idle'} className="my-3 min-h-40">{valid&&state?<Visualizer kind={a.views[0]} state={state} input={valid} compact/>:<p className="muted">Chưa chạy.</p>}</div>
    <input aria-label={`Bước ${a.title}`} type="range" min="0" max={traceLength} value={l.cursor} disabled={!l.trace} onChange={e=>setCursor(l.id,Number(e.target.value))}/>
    <p className="text-sm">Bước {l.cursor}/{traceLength} · {l.trace?.steps[l.cursor-1]?.phase||'—'}</p>
    <p>{l.result?.status==='ok'?`Giá trị ${problem.objective?problem.objective.score(valid!,l.result.output):'—'}`:l.result?.status==='not-applicable'?`Không áp dụng: ${l.result.reason}`:l.result?.status==='timeout'?'Hết thời gian':l.result?.status==='error'?l.result.message:l.running?'Đang chạy…':'Đang chờ'}</p>
   </CardContent></Card>;
  })}</div>
  <Card><CardHeader><CardTitle>Bảng kết quả</CardTitle></CardHeader><CardContent><div className="overflow-auto"><table className="data-table" data-testid="results-table"><thead><tr><th>Thuật toán</th><th>Loại</th><th>Giá trị</th><th>Tối ưu?</th><th>Tỷ lệ</th><th>Bước</th><th>Phép toán</th><th>Trung vị ms</th><th>Kết quả chung</th></tr></thead><tbody>{lanes.map(l=>{
   const r=l.result;
   const a=problemAlgos.find(x=>x.id.endsWith(`/${l.id}`));
   const value=r?.status==='ok'&&valid&&problem.objective?problem.objective.score(valid,r.output):null;
   const projected=r?.status==='ok'&&valid&&adapter?adapter.project(valid,r.output,query):undefined;
   return <tr key={l.id} data-testid={`result-row-${l.id}`}><td>{a?.title}</td><td>{a?.exactness==='exact'?'Chính xác':a?.exactness==='approximate'?'Xấp xỉ':'Thực nghiệm'}</td><td>{value??'—'}</td><td>{r?.status==='ok'&&r.verdict.ok?(r.verdict.optimal?'Có':r.verdict.optimal===false?'Không':'—'):'—'}</td><td>{r?.status==='ok'&&r.verdict.ok&&r.verdict.ratio!==undefined?`${(r.verdict.ratio*100).toFixed(1)}%`:'—'}</td><td>{l.trace?.length??0}</td><td>{r?.status==='ok'?Object.values(r.counters).reduce((a,b)=>a+b,0):'—'}</td><td>{l.medianMs.toFixed(2)}</td><td><code>{projected===undefined?'—':JSON.stringify(projected)}</code></td></tr>;
  })}</tbody></table></div></CardContent></Card>
  <Card><CardHeader><CardTitle>Thời gian theo kích thước n</CardTitle></CardHeader><CardContent>
   <Button variant="outline" onClick={benchmark}>Đo hiệu năng theo n</Button>
   {chart.length>0&&<div className="h-72 mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="#bbb"/><XAxis dataKey="n"/><YAxis scale="log" domain={['auto','auto']}/><Tooltip/><Legend/>{ids.map((id,i)=><Line key={id} type="monotone" dataKey={id} stroke={['#111','#444','#777','#999','#bbb'][i%5]} strokeDasharray={i%2?'4 2':undefined}/>)}</LineChart></ResponsiveContainer></div>}
  </CardContent></Card>
 </div>;
}
