import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {Pause,Play,SkipBack,SkipForward,StepBack,StepForward,Square} from 'lucide-react';
import {loadAlgorithm,loadProblem,type AnyAlgorithm,type AnyProblem} from '../../catalog/registry';
import {loadProblemUi} from '../../catalog/ui-registry';
import {algorithms} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import type {RunResult} from '../../core/contracts';
import {TraceStore} from '../../core/trace/TraceStore';
import {runWorker} from '../../core/worker-protocol/client';
import {InputEditor} from '../input-editor/InputEditor';
import {OutputPanel} from './OutputPanel';
import {Visualizer} from '../../visualizers';
import {Button} from '../../components/ui/button';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Breadcrumbs} from '../nav/Breadcrumbs';
import {usePlayerStore} from '../../state/player.store';

export function PlayerPage({problemId,algoId}:{problemId:string;algoId:string}){
 const [problem,setProblem]=useState<AnyProblem|null>(null);
 const [algo,setAlgo]=useState<AnyAlgorithm|null>(null);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  let active=true;
  setLoaded(false);
  Promise.all([loadProblem(problemId),loadAlgorithm(`${problemId}/${algoId}`)]).then(([p,a])=>{
   if(active){setProblem(p??null);setAlgo(a??null);setLoaded(true)}
  });
  return()=>{active=false};
 },[problemId,algoId]);
 if(!problem||!algo)return <p>{loaded?'Không tìm thấy thuật toán.':'Đang tải thuật toán…'}</p>;
 return <LoadedPlayerPage key={`${problemId}/${algoId}`} problemId={problemId} algoId={algoId} problem={problem} algo={algo}/>;
}

function LoadedPlayerPage({problemId,algoId,problem,algo}:{problemId:string;algoId:string;problem:AnyProblem;algo:AnyAlgorithm}){
 const navigate=useNavigate();
 const [ui,setUi]=useState<Awaited<ReturnType<typeof loadProblemUi>>>({});
 useEffect(()=>{let active=true;loadProblemUi(problemId).then(m=>{if(active)setUi(m)});return()=>{active=false}},[problemId]);
 const [input,setInput]=useState<unknown>(problem.cases[0]?.input??{});
 const [trace,setTrace]=useState<TraceStore<object>|null>(null);
 const [tick,setTick]=useState(0);
 const [result,setResult]=useState<RunResult<unknown>|null>(null);
 const [running,setRunning]=useState(false);
 const cancel=useRef<null|(()=>void)>(null);
 const cursor=usePlayerStore(s=>s.cursor),playing=usePlayerStore(s=>s.playing),speed=usePlayerStore(s=>s.speed),view=usePlayerStore(s=>s.view),setCursor=usePlayerStore(s=>s.setCursor),setPlaying=usePlayerStore(s=>s.setPlaying),setSpeed=usePlayerStore(s=>s.setSpeed),setView=usePlayerStore(s=>s.setView),reset=usePlayerStore(s=>s.reset);
 // view trong store toàn cục có thể còn mang giá trị của thuật toán trước đó ngay ở lần render đầu
 // (useEffect dưới đây chỉ chạy SAU render) — dùng effectiveView để không bao giờ truyền kind không
 // khớp views của algo hiện tại cho Visualizer, tránh các view component (đọc state.matrix/.../length
 // không có optional chaining) crash khi state thực tế không có trường đó.
 const effectiveView=algo.views.includes(view)?view:algo.views[0];
 useEffect(()=>{reset(algo.views[0]);return()=>cancel.current?.()},[algo,reset]);
 const parsed=problem.inputSchema.safeParse(input);
 const valid=parsed.success?parsed.data:null;
 const length=trace?.length??0;
 const current=trace?.seek(Math.min(cursor,length))??(valid?algo.initVisual(valid):null);
 const step=cursor>0?trace?.steps[cursor-1]:undefined;
 const run=async()=>{
  if(!valid)return;
  cancel.current?.();
  const store=new TraceStore(algo.initVisual(valid) as object);
  setTrace(store);
  setResult(null);
  setCursor(0);
  setPlaying(false);
  setRunning(true);
  setTick(x=>x+1);
  const task=runWorker(algo.id,valid,steps=>{for(const s of steps)store.append(s);setTick(x=>x+1)});
  cancel.current=task.cancel;
  const value=await task.promise;
  setResult(value);
  setRunning(false);
  cancel.current=null;
  setTick(x=>x+1);
 };
 useEffect(()=>{
  if(!playing)return;
  const timer=setInterval(()=>{
   const s=usePlayerStore.getState();
   if(s.cursor>=length){s.setPlaying(false);return}
   s.setCursor(s.cursor+1);
  },Math.max(50,600/speed));
  return()=>clearInterval(timer);
 },[playing,speed,length]);
 const move=useCallback((next:number)=>setCursor(Math.max(0,Math.min(length,next))),[length,setCursor]);
 const phaseJump=useCallback((dir:-1|1)=>{
  if(!trace)return;
  const phase=trace.steps[Math.max(0,cursor-1)]?.phase;
  let i=cursor+dir;
  while(i>=1&&i<=length){if(trace.steps[i-1].phase!==phase){move(dir===1?i:i-1);return}i+=dir}
  move(dir===1?length:0);
 },[trace,cursor,length,move]);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if(['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName))return;
   if(e.code==='Space'){e.preventDefault();setPlaying(!usePlayerStore.getState().playing)}
   else if(e.key==='ArrowRight'){e.preventDefault();if(e.shiftKey)phaseJump(1);else move(usePlayerStore.getState().cursor+1)}
   else if(e.key==='ArrowLeft'){e.preventDefault();if(e.shiftKey)phaseJump(-1);else move(usePlayerStore.getState().cursor-1)}
   else if(e.key==='+'||e.key==='=')setSpeed(Math.min(8,speed*2));
   else if(e.key==='-')setSpeed(Math.max(0.25,speed/2));
  };
  window.addEventListener('keydown',key);
  return()=>window.removeEventListener('keydown',key);
 },[trace,length,speed,move,phaseJump,setPlaying,setSpeed]);
 const counters=useMemo(()=>result?.status==='ok'?Object.entries(result.counters).filter(([,v])=>v>0):[],[result]);
 void tick;

 const siblings=useMemo(()=>algorithms.filter(a=>a.problemId===problemId),[problemId]);
 const chapterSiblings=useMemo(()=>algorithms.filter(a=>a.chapter===algo.chapter&&a.status==='ready'),[algo.chapter]);
 const chapterIndex=chapterSiblings.findIndex(a=>a.id===algo.id);
 const prevInChapter=chapterIndex>0?chapterSiblings[chapterIndex-1]:undefined;
 const nextInChapter=chapterIndex>=0&&chapterIndex<chapterSiblings.length-1?chapterSiblings[chapterIndex+1]:undefined;
 const chapterName=chapters.find(c=>c.id===algo.chapter)?.name;
 const viewLabel:Record<string,string>={matrix:'Bảng','state-space-tree':'Cây trạng thái',items:'Đồ vật','array-bars':'Mảng','graph':'Đồ thị','tree':'Cây','string-align':'So khớp chuỗi','points-2d':'Điểm 2D','numeric-plot':'Đồ thị hàm số','hash-table':'Bảng băm','sequence':'Dãy',board:'Lưới'};

 return <div className="space-y-4">
  <Breadcrumbs items={[{label:`Chương ${algo.chapter}${chapterName?` · ${chapterName}`:''}`,to:`/chapter/${algo.chapter}`},{label:problem.title,to:`/problem/${problemId}`},{label:algo.title}]}/>
  <div className="flex justify-between items-center flex-wrap gap-2">
   <div>
    <p className="eyebrow">Chương {algo.chapter} · §{algo.section}{algo.page?` · tr. ${algo.page}`:''}</p>
    <h1>{algo.title}</h1>
    <p className="muted">{algo.exactness==='exact'?'Lời giải chính xác':algo.exactness==='approximate'?'Lời giải xấp xỉ':'Lời giải thực nghiệm'} · {algo.complexity.time}</p>
   </div>
   <div className="flex gap-2">
    {prevInChapter&&<Button variant="outline" asChild><Link to={`/play/${prevInChapter.problemId}/${prevInChapter.id.split('/')[1]}`}>← {prevInChapter.title}</Link></Button>}
    <select aria-label="Đổi thuật toán" value={algoId} onChange={e=>navigate({pathname:`/play/${problemId}/${e.target.value}`,search:window.location.search})}>
     {siblings.map(a=><option key={a.id} value={a.id.split('/')[1]} disabled={a.status!=='ready'}>{a.title}{a.status!=='ready'?' (sắp có)':''}</option>)}
    </select>
    {nextInChapter&&<Button variant="outline" asChild><Link to={`/play/${nextInChapter.problemId}/${nextInChapter.id.split('/')[1]}`}>{nextInChapter.title} →</Link></Button>}
    <Button variant="outline" asChild><Link to={`/compare/${problemId}`}>So sánh</Link></Button>
   </div>
  </div>
  <div className="player-grid">
   <div className="space-y-3">
    <Card><CardHeader><CardTitle>Dữ liệu vào</CardTitle></CardHeader><CardContent>
     {ui.InputEditor?<ui.InputEditor input={input} onChange={setInput} disabled={running}/>:<InputEditor problem={problem} input={input} onChange={setInput} disabled={running}/>}
     <div className="flex gap-2 mt-3"><Button onClick={run} disabled={!valid||running}>Chạy</Button>{running&&<Button variant="outline" onClick={()=>cancel.current?.()}><Square size={14}/> Dừng</Button>}</div>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Kết quả</CardTitle></CardHeader><CardContent data-testid="output" data-status={running?'running':result?result.status:'idle'}>
     {result?.status==='ok'?(ui.OutputRenderer?<ui.OutputRenderer input={valid} output={result.output} verdict={result.verdict} truncated={result.truncated}/>:<OutputPanel output={result.output} verdict={result.verdict} truncated={result.truncated}/>)
      :result?<p>{result.status==='invalid-input'?result.issues.join('; '):result.status==='not-applicable'?`Không áp dụng: ${result.reason}`:result.status==='timeout'?'Hết thời gian chạy':result.status==='cancelled'?'Đã dừng':result.status==='error'?result.message:'Không thể chạy'}</p>
      :<p className="muted">Chạy thuật toán để xem kết quả.</p>}
    </CardContent></Card>
   </div>
   <Card className="min-w-0"><CardHeader><CardTitle>Trực quan hóa</CardTitle></CardHeader><CardContent>
    <div className="flex gap-2 mb-3 flex-wrap">{algo.views.map(v=><Button key={v} size="sm" variant={effectiveView===v?'default':'outline'} onClick={()=>setView(v)}>{viewLabel[v]??v}</Button>)}</div>
    <div data-testid="visual-state" data-step={cursor}>{effectiveView==='state-space-tree'&&length===0&&result?.status==='ok'&&result.truncated
     ?<p className="muted">Không có bước trace cho đầu vào này vì giới hạn ghi trace. Không có cây trạng thái để hiển thị.</p>
     :current&&valid?<Visualizer kind={effectiveView} state={current} input={valid}/>:<p>Đầu vào chưa hợp lệ</p>}</div>
   </CardContent></Card>
   <div className="space-y-3">
    <Card><CardHeader><CardTitle>Mã giả</CardTitle></CardHeader><CardContent><ol className="pseudo">{algo.pseudocode.map(line=><li key={line.id} data-testid={step?.lineId===line.id?'active-line':undefined} className={step?.lineId===line.id?'active':''} style={{paddingLeft:8+line.indent*16}}>{line.text}</li>)}</ol></CardContent></Card>
    <Card><CardHeader><CardTitle>Giải thích bước</CardTitle></CardHeader><CardContent data-testid="step-explanation">{step?.explain||'Chọn một bước để xem giải thích.'}</CardContent></Card>
    <Card><CardHeader><CardTitle>Trạng thái</CardTitle></CardHeader><CardContent className="text-sm">
     {ui.StateInspector?<ui.StateInspector state={current} step={step}/>:<p>Giai đoạn: {step?.phase||'—'}</p>}
    </CardContent></Card>
   </div>
  </div>
  <Card><CardContent className="pt-4">
   <div className="flex items-center gap-2 flex-wrap">
    <Button aria-label="Về đầu" size="icon" variant="outline" onClick={()=>move(0)}><SkipBack size={16}/></Button>
    <Button aria-label="Lùi bước" size="icon" variant="outline" onClick={()=>move(cursor-1)}><StepBack size={16}/></Button>
    <Button aria-label={playing?'Tạm dừng':'Phát'} size="icon" disabled={length===0} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={16}/>:<Play size={16}/>}</Button>
    <Button aria-label="Tiến bước" size="icon" variant="outline" onClick={()=>move(cursor+1)}><StepForward size={16}/></Button>
    <Button aria-label="Về cuối" size="icon" variant="outline" onClick={()=>move(length)}><SkipForward size={16}/></Button>
    <input className="flex-1 min-w-32" aria-label="Thanh tiến độ" type="range" min="0" max={length} value={Math.min(cursor,length)} onChange={e=>move(Number(e.target.value))}/>
    <span data-testid="step-count">{cursor}/{length}</span>
    <select aria-label="Tốc độ" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[0.25,0.5,1,2,4,8].map(x=><option key={x} value={x}>{x}×</option>)}</select>
   </div>
   <p className="text-sm muted mt-2">Phép toán: {counters.map(([k,v])=>`${k} ${v}`).join(' · ')||'—'} · Giai đoạn: {step?.phase||'—'}</p>
   {length===0&&result?.status==='ok'&&result.truncated&&<p className="text-sm muted mt-2">Không có bước trace vì giới hạn ghi trace; không thể phát.</p>}
  </CardContent></Card>
 </div>;
}
