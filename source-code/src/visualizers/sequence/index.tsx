/** View "sequence": dãy đối tượng sinh dần — hoán vị/tập con/mã Gray, Fibonacci, Euclid, Josephus... */
export interface SequenceItem{label:string;role?:string}
export interface SequenceVisualState{items:SequenceItem[];current?:number;changedPositions?:number[];table?:Record<string,string|number>[];note?:string}

export function SequenceView({state,compact=false}:{state:SequenceVisualState;compact?:boolean}){
 if(!state.items.length)return <p className="muted">Dãy sẽ hiện khi bắt đầu chạy.</p>;
 const shown=compact?state.items.slice(-12):state.items;
 const offset=state.items.length-shown.length;
 const columns=state.table?.length?Object.keys(state.table[0]):[];
 return <div data-testid="sequence-view" className="space-y-2">
  <div className="flex gap-1 flex-wrap">
   {shown.map((it,i)=>{const current=it.role==='current'||state.current===i+offset;const changed=state.changedPositions?.includes(i+offset);return <span key={i} data-testid={`seq-${i}`} data-role={it.role??(current?'current':changed?'changed':'')} className={`px-2 py-1 border border-neutral-400 text-sm font-mono ${current?'bg-neutral-900 text-white':changed?'border-2 border-dashed border-neutral-900':it.role==='done'?'bg-neutral-200':''}`}>{it.label}</span>})}
  </div>
  {!compact&&columns.length>0&&<table className="data-table"><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{state.table!.map((row,i)=><tr key={i}>{columns.map(c=><td key={c}>{row[c]}</td>)}</tr>)}</tbody></table>}
  {state.note&&<p className="muted">{state.note}</p>}
 </div>;
}
