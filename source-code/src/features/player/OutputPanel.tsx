import type {Verdict} from '../../core/contracts';

/** Hiển thị mặc định khi bài toán không khai báo OutputRenderer riêng: JSON đẹp + verdict. */
export function OutputPanel({output,verdict,truncated}:{output:unknown;verdict:Verdict;truncated:boolean}){
 return <>
  <pre className="text-xs overflow-auto max-h-40 bg-neutral-50 border border-neutral-200 rounded p-2">{JSON.stringify(output,null,2)}</pre>
  <p className="mt-2">{verdict.ok?(verdict.optimal===false?`Hợp lệ · ${((verdict.ratio??1)*100).toFixed(1)}% tối ưu`:'✓ Hợp lệ'):verdict.reason}</p>
  {truncated&&<p className="font-semibold">Trace đã rút gọn: một số bước đã bị bỏ qua do giới hạn trace; kết quả vẫn hoàn chỉnh.</p>}
 </>;
}
