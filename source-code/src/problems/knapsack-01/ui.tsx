import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '../../components/ui/tabs';
import {Button} from '../../components/ui/button';
import type {InputEditorProps,OutputRendererProps,StateInspectorProps} from '../../catalog/ui-registry';
import {inputSchema} from './definition';
import {cases} from './cases';
import {generate} from './generators';
import type {Input,Output} from './definition';
import type {SizeClass} from '../../core/contracts';
import type {VisualState} from '../../algorithms/knapsack-01/shared';

const groupLabel={normal:'Thông thường',edge:'Biên',small:'Nhỏ',large:'Lớn',special:'Đặc biệt',invalid:'Không hợp lệ'};

export function InputEditor({input,onChange,disabled=false}:InputEditorProps){
 const [params,setParams]=useSearchParams();
 const [seed,setSeed]=useState(Number(params.get('seed')||42));
 const [size,setSize]=useState<SizeClass>((['tiny','small','medium','large'].includes(params.get('size')||'')?params.get('size'):'small') as SizeClass);
 const [tab,setTab]=useState('manual');
 const initialized=useRef(false);
 const parsed=inputSchema.safeParse(input);
 const data=parsed.success?parsed.data:null;
 const [raw,setRaw]=useState(JSON.stringify(input,null,2));
 const editingJson=useRef(false);
 useEffect(()=>{if(!editingJson.current)setRaw(JSON.stringify(input,null,2));editingJson.current=false},[input]);
 useEffect(()=>{
  if(initialized.current)return;
  initialized.current=true;
  const caseId=params.get('case');
  if(caseId){const c=cases.find(x=>x.id===caseId);if(c){onChange(c.input);setTab('case');return}}
  if(params.has('seed')){onChange(generate(Number(params.get('seed')),size));setTab('random')}
 },[onChange,params,size]);
 const update=(next:Input)=>onChange(next);
 const editItem=(i:number,key:'name'|'weight'|'value',value:string)=>{
  if(!data)return;
  const items=data.items.map((x,j)=>j===i?{...x,[key]:key==='name'?value:Number(value)}:x);
  update({...data,items});
 };
 return <div>
  <Tabs value={tab} onValueChange={setTab}>
   <TabsList className="w-full"><TabsTrigger value="manual">Nhập tay</TabsTrigger><TabsTrigger value="random">Ngẫu nhiên</TabsTrigger><TabsTrigger value="case">Ca kiểm thử</TabsTrigger></TabsList>
   <TabsContent value="manual">
    <label className="field-label">Sức chứa W<input aria-label="Sức chứa W" type="number" value={data?.capacity??''} disabled={disabled} onChange={e=>update({capacity:Number(e.target.value),items:data?.items??[]})}/></label>
    <div className="flex justify-between items-center mt-3"><strong>Đồ vật</strong><Button variant="outline" size="sm" disabled={disabled||!data} onClick={()=>data&&update({...data,items:[...data.items,{name:`Vật ${data.items.length+1}`,weight:1,value:1}]})}>Thêm vật</Button></div>
    <div className="max-h-56 overflow-auto">{data?.items.map((item,i)=><div key={i} className="grid grid-cols-[1fr_55px_55px_30px] gap-1 my-1"><input aria-label={`Tên vật ${i+1}`} value={item.name} disabled={disabled} onChange={e=>editItem(i,'name',e.target.value)}/><input aria-label={`Khối lượng vật ${i+1}`} type="number" value={item.weight} disabled={disabled} onChange={e=>editItem(i,'weight',e.target.value)}/><input aria-label={`Giá trị vật ${i+1}`} type="number" value={item.value} disabled={disabled} onChange={e=>editItem(i,'value',e.target.value)}/><button aria-label={`Xóa vật ${i+1}`} disabled={disabled} onClick={()=>data&&update({...data,items:data.items.filter((_,j)=>j!==i)})}>×</button></div>)}</div>
    <details className="mt-2"><summary>Nhập JSON</summary><textarea aria-label="Dữ liệu JSON" rows={6} value={raw} onChange={e=>{editingJson.current=true;setRaw(e.target.value);try{onChange(JSON.parse(e.target.value) as unknown)}catch{onChange(null)}}}/></details>
   </TabsContent>
   <TabsContent value="random">
    <label className="field-label">Hạt giống<input aria-label="Hạt giống" type="number" value={seed} onChange={e=>setSeed(Number(e.target.value))}/></label>
    <label className="field-label">Kích thước<select aria-label="Kích thước" value={size} onChange={e=>setSize(e.target.value as SizeClass)}><option value="tiny">Rất nhỏ</option><option value="small">Nhỏ</option><option value="medium">Vừa</option><option value="large">Lớn</option></select></label>
    <Button onClick={()=>{onChange(generate(seed,size));setParams(prev=>{prev.set('seed',String(seed));prev.set('size',size);prev.delete('case');return prev})}}>Sinh dữ liệu</Button>
   </TabsContent>
   <TabsContent value="case">
    <label className="field-label">Ca kiểm thử<select aria-label="Ca kiểm thử" value={params.get('case')||''} onChange={e=>{const c=cases.find(x=>x.id===e.target.value);if(c){onChange(c.input);setParams(prev=>{prev.set('case',c.id);prev.delete('seed');prev.delete('size');return prev})}}}><option value="">Chọn testcase</option>{cases.map(c=><option key={c.id} value={c.id}>{c.name} ({groupLabel[c.group]})</option>)}</select></label>
   </TabsContent>
  </Tabs>
  <div role="status" className={`mt-3 text-sm ${parsed.success?'':'font-semibold'}`}>{parsed.success?'✓ Dữ liệu hợp lệ':`Dữ liệu không hợp lệ: ${parsed.error.issues.map(x=>`${x.path.join('.')}: ${x.message}`).join('; ')}`}</div>
 </div>;
}

export function OutputRenderer({input,output,verdict,truncated}:OutputRendererProps){
 const typedInput=input as Input|null;
 const typedOutput=output as Output;
 return <>
  <p>Giá trị: <strong>{typedOutput.value}</strong></p>
  <p>Khối lượng: {typedOutput.weight} / {typedInput?.capacity}</p>
  <p>Vật chọn: {typedOutput.selected.length?typedOutput.selected.map(i=>i+1).join(', '):'Không có'}</p>
  <p>{verdict.ok?(verdict.optimal?'✓ Tối ưu':`Xấp xỉ · ${((verdict.ratio??0)*100).toFixed(1)}% tối ưu`):verdict.reason}</p>
  {truncated&&<p className="font-semibold">Trace đã rút gọn; kết quả vẫn hoàn chỉnh.</p>}
 </>;
}

export function StateInspector({state,step}:StateInspectorProps){
 const current=state as VisualState|null;
 return <>
  <p>Giai đoạn: {step?.phase||'—'}</p>
  <p>Ô hiện tại: {current?.current?`i=${current.current.i}, w=${current.current.w}`:'—'}</p>
  <p>Nút đang xét: {current?.focusNode??'—'}</p>
  <p>Đã tính: {current?.computed.flat().filter(Boolean).length??0} ô</p>
 </>;
}
