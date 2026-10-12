/**
 * View "matrix": bảng 2D cho các bảng quy hoạch động, Warshall/Floyd, khử Gauss...
 * Props chung cho mọi algorithm dùng view này — algorithm chỉ cần tạo VisualState có các trường dưới.
 */
export interface MatrixVisualState{
 matrix:(number|string|null)[][];
 computed?:boolean[][];
 current?:{i:number;w:number}|null;
 dependencies?:[number,number][];
 backtrack?:[number,number][];
 note?:string;
}
export type MatrixInput=unknown;
export function MatrixView({state,compact=false}:{state:MatrixVisualState;input?:MatrixInput;compact?:boolean}){
 if(!state.matrix.length)return <p className="muted">Bảng sẽ hiện khi bắt đầu chạy.</p>;
 const W=Math.max(0,...state.matrix.map(row=>row.length))-1;
 const focus=state.current?.w??0;
 const from=W<=18?0:Math.max(0,Math.min(W-17,focus-8));
 const cols=Array.from({length:Math.min(W+1,18)},(_,i)=>from+i);
 const rows=compact?Math.min(state.matrix.length,8):Math.min(state.matrix.length,30);
 return <div className="overflow-auto max-h-[440px]"><table className="matrix-table"><thead><tr><th>Hàng / Cột</th>{cols.map(w=><th key={w}>{w}</th>)}</tr></thead><tbody>{Array.from({length:rows},(_,i)=><tr key={i}><th>{i}</th>{cols.map(w=>{const current=state.current?.i===i&&state.current.w===w;const dep=state.dependencies?.some(x=>x[0]===i&&x[1]===w);const back=state.backtrack?.some(x=>x[0]===i&&x[1]===w);return <td key={w} data-testid={current?'current-cell':undefined} className={`${current?'current-cell ':''}${dep?'dependency-cell ':''}${back?'backtrack-cell ':''}${state.computed?.[i]?.[w]===false?'uncomputed':''}`}>{state.matrix[i]?.[w]??'·'}</td>})}</tr>)}</tbody></table>{W>17&&<p className="muted mt-2">Đang xem cột {from}–{from+cols.length-1} / {W}. Bảng tự cuộn theo bước.</p>}{state.matrix.length>rows&&<p className="muted">Hiển thị {rows} hàng đầu; kết quả đầy đủ được tính ở nền.</p>}</div>;
}
