/** View "hash-table": bảng băm — danh sách liên kết hoặc dò tuyến tính. */
export interface HashEntry{key:string|number;role?:string}
export interface HashBucket{index:number;entries:HashEntry[];role?:string}
export interface HashTableVisualState{buckets:HashBucket[];note?:string}

export function HashTableView({state,compact=false}:{state:HashTableVisualState;compact?:boolean}){
 if(!state.buckets.length)return <p className="muted">Bảng băm sẽ hiện khi bắt đầu chạy.</p>;
 const shown=compact?state.buckets.slice(0,6):state.buckets;
 return <div data-testid="hash-table" className="overflow-auto max-h-[440px] space-y-1">
  {shown.map(b=><div key={b.index} data-testid={`bucket-${b.index}`} data-role={b.role??''} className={`flex items-center gap-2 text-sm ${b.role==='probed'?'border border-dashed border-neutral-900':b.role==='current'?'border-2 border-neutral-900':''}`}>
   <span className="w-8 text-right muted">{b.index}</span>
   <div className="flex gap-1 flex-wrap">
    {b.entries.length===0&&<span className="muted">∅</span>}
    {b.entries.map((e,i)=><span key={i} data-testid={`entry-${b.index}-${i}`} data-role={e.role??''} className={`px-2 py-0.5 border border-neutral-400 ${e.role==='probed'?'border-dashed':''} ${e.role==='current'?'bg-neutral-900 text-white':''}`}>{e.key}</span>)}
   </div>
  </div>)}
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
