/** View "string-align": so khớp chuỗi — vét cạn, Horspool, Boyer–Moore. */
export interface StringAlignVisualState{
 text:string;
 pattern:string;
 shift:number;
 comparisons?:{patternIndex:number;match:boolean}[];
 shiftTable?:Record<string,number>;
 note?:string;
}
export function StringAlignView({state,compact=false}:{state:StringAlignVisualState;compact?:boolean}){
 const cellClass="inline-flex items-center justify-center w-6 h-6 border border-neutral-300 text-xs font-mono";
 const cmp=new Map(state.comparisons?.map(c=>[c.patternIndex,c.match]));
 return <div data-testid="string-align" className="space-y-2 font-mono text-xs">
  <div className="flex">{state.text.split('').map((ch,i)=><span key={i} className={cellClass}>{ch}</span>)}</div>
  <div className="flex" style={{paddingLeft:state.shift*24}}>
   {state.pattern.split('').map((ch,i)=>{
    const match=cmp.get(i);
    return <span key={i} data-testid={`pattern-${i}`} data-match={match===undefined?'':String(match)} className={`${cellClass} ${match===true?'bg-neutral-900 text-white':match===false?'border-2 border-neutral-900':''}`}>{ch}</span>;
   })}
  </div>
  {!compact&&state.shiftTable&&<div><p className="muted mt-1">Bảng dịch (shift table)</p><div className="flex gap-2 flex-wrap">{Object.entries(state.shiftTable).map(([k,v])=><span key={k} className="border border-neutral-300 px-1">{k}: {v}</span>)}</div></div>}
  {state.note&&<p className="muted">{state.note}</p>}
 </div>;
}
