/** View "array-bars": mảng số dạng cột — sắp xếp, tìm kiếm, chọn phần tử thứ k... */
export type ArrayBarRole='compare'|'swap'|'pivot'|'sorted'|'current'|'found';
export interface ArrayBarsVisualState{
 values:number[];
 marks?:{index:number;role:ArrayBarRole}[];
 ranges?:{from:number;to:number;role:'sorted'|'active'}[];
 note?:string;
}
const roleClass:Record<ArrayBarRole,string>={
 compare:'border-2 border-neutral-500',
 swap:'bg-neutral-400',
 pivot:'bg-neutral-900 text-white',
 sorted:'bg-neutral-200',
 current:'outline outline-2 outline-neutral-900 outline-offset-1',
 found:'bg-neutral-900 text-white',
};
export function ArrayBarsView({state,compact=false}:{state:ArrayBarsVisualState;compact?:boolean}){
 if(!state.values.length)return <p className="muted">Mảng sẽ hiện khi bắt đầu chạy.</p>;
 const max=Math.max(1,...state.values);
 const height=compact?90:160;
 const barWidth=Math.max(14,320/state.values.length);
 const marks=new Map(state.marks?.map(m=>[m.index,m.role]));
 return <div data-testid="array-bars" className="space-y-2">
  <div className="flex items-end gap-1" style={{height}}>
   {state.values.map((v,i)=>{
    const role=marks.get(i);
    const inRange=state.ranges?.some(r=>i>=r.from&&i<=r.to);
    return <div key={i} className="flex flex-col items-center gap-1" style={{width:barWidth}}>
     <div data-testid={`bar-${i}`} data-role={role??''} className={`w-full bg-neutral-300 ${role?roleClass[role]:''} ${inRange?'opacity-100':'opacity-80'}`} style={{height:Math.max(4,(v/max)*height)}}/>
     {!compact&&<span className="text-[10px]">{v}</span>}
    </div>;
   })}
  </div>
  {!compact&&state.ranges?.map((range,i)=><div key={i} data-testid={`range-${i}`} data-role={range.role} className="border-t-2 border-x-2 border-neutral-900 text-[10px] text-center" style={{marginLeft:range.from*(barWidth+4),width:Math.max(barWidth,(range.to-range.from+1)*(barWidth+4)-4)}}>{range.role==='sorted'?'Đã sắp':'Mảng con đang xét'}</div>)}
  {state.note&&<p className="muted text-sm">{state.note}</p>}
 </div>;
}
