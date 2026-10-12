import {useRef,useState,useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '../../components/ui/tabs';
import {Button} from '../../components/ui/button';
import type {AnyProblem} from '../../catalog/registry';
import type {SizeClass} from '../../core/contracts';

const groupLabel:Record<string,string>={normal:'Thông thường',edge:'Biên',small:'Nhỏ',large:'Lớn',special:'Đặc biệt',invalid:'Không hợp lệ'};

/**
 * Trình nhập liệu JSON mặc định — dùng khi bài toán không khai báo InputEditor riêng
 * (src/problems/<id>/ui.tsx). Hợp lệ hoá bằng problem.inputSchema, có tạo dữ liệu ngẫu nhiên
 * có seed và chọn testcase mẫu.
 */
export function InputEditor({problem,input,onChange,disabled=false}:{problem:AnyProblem;input:unknown;onChange:(v:unknown)=>void;disabled?:boolean}){
 const [params,setParams]=useSearchParams();
 const [seed,setSeed]=useState(Number(params.get('seed')||42));
 const [size,setSize]=useState<SizeClass>((['tiny','small','medium','large'].includes(params.get('size')||'')?params.get('size'):'small') as SizeClass);
 const [tab,setTab]=useState('json');
 const [raw,setRaw]=useState(JSON.stringify(input,null,2));
 const editingJson=useRef(false);
 const parsed=problem.inputSchema.safeParse(input);
 useEffect(()=>{if(!editingJson.current)setRaw(JSON.stringify(input,null,2));editingJson.current=false},[input]);
 return <div>
  <Tabs value={tab} onValueChange={setTab}>
   <TabsList className="w-full"><TabsTrigger value="json">Chỉnh JSON</TabsTrigger><TabsTrigger value="random">Ngẫu nhiên</TabsTrigger><TabsTrigger value="case">Ca kiểm thử</TabsTrigger></TabsList>
   <TabsContent value="json">
    <textarea aria-label="Dữ liệu JSON" rows={10} disabled={disabled} value={raw} onChange={e=>{editingJson.current=true;setRaw(e.target.value);try{onChange(JSON.parse(e.target.value) as unknown)}catch{onChange(undefined)}}}/>
   </TabsContent>
   <TabsContent value="random">
    <label className="field-label">Hạt giống<input aria-label="Hạt giống" type="number" value={seed} onChange={e=>setSeed(Number(e.target.value))}/></label>
    <label className="field-label">Kích thước<select aria-label="Kích thước" value={size} onChange={e=>setSize(e.target.value as SizeClass)}><option value="tiny">Rất nhỏ</option><option value="small">Nhỏ</option><option value="medium">Vừa</option><option value="large">Lớn</option></select></label>
    <Button disabled={disabled} onClick={()=>{onChange(problem.generate(seed,size));setParams(prev=>{prev.set('seed',String(seed));prev.set('size',size);prev.delete('case');return prev})}}>Sinh dữ liệu</Button>
   </TabsContent>
   <TabsContent value="case">
    <label className="field-label">Ca kiểm thử<select aria-label="Ca kiểm thử" value={params.get('case')||''} onChange={e=>{const c=problem.cases.find(x=>x.id===e.target.value);if(c){onChange(c.input);setParams(prev=>{prev.set('case',c.id);prev.delete('seed');prev.delete('size');return prev})}}}><option value="">Chọn testcase</option>{problem.cases.map(c=><option key={c.id} value={c.id}>{c.name} ({groupLabel[c.group]??c.group})</option>)}</select></label>
   </TabsContent>
  </Tabs>
  <div role="status" className={`mt-3 text-sm ${parsed.success?'':'font-semibold'}`}>{parsed.success?'✓ Dữ liệu hợp lệ':`Dữ liệu không hợp lệ: ${parsed.error.issues.map(x=>`${x.path.join('.')}: ${x.message}`).join('; ')}`}</div>
 </div>;
}
