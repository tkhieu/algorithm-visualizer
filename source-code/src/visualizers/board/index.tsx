/** View "board": lưới n×n — n quân hậu, ma trận chi phí phân công, gom đồng xu trên lưới. */
export interface BoardMark{row:number;col:number;role:string;label?:string}
export interface BoardVisualState{rows:number;cols?:number;marks:BoardMark[];note?:string}

export function BoardView({state,compact=false}:{state:BoardVisualState;compact?:boolean}){
 const cols=state.cols??state.rows;
 if(!state.rows||!cols)return <p className="muted">Lưới sẽ hiện khi bắt đầu chạy.</p>;
 const size=compact?18:28;
 const byCell=new Map(state.marks.map(m=>[`${m.row}-${m.col}`,m]));
 return <div data-testid="board-view" className="overflow-auto max-h-[440px]">
  <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},${size}px)`}}>
   {Array.from({length:state.rows*cols},(_,idx)=>{
    const row=Math.floor(idx/cols),col=idx%cols;
    const mark=byCell.get(`${row}-${col}`);
    const dark=(row+col)%2===1;
    return <div key={idx} data-testid={`cell-${row}-${col}`} data-role={mark?.role??''} className={`flex items-center justify-center border border-neutral-300 text-[10px] ${dark?'bg-neutral-100':'bg-white'} ${mark?.role==='queen'||mark?.role==='chosen'?'bg-neutral-900 text-white':mark?.role==='attacked'?'bg-neutral-300':mark?.role==='rejected'?'opacity-40':''}`} style={{width:size,height:size}}>{mark?.label??''}</div>;
   })}
  </div>
  {state.note&&<p className="muted mt-2">{state.note}</p>}
 </div>;
}
