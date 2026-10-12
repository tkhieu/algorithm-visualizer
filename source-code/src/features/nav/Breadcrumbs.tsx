import {Link} from 'react-router-dom';

export interface Crumb{label:string;to?:string}
/** Chương › Bài toán › Cách giải — hiển thị trên mọi trang có ngữ cảnh thuật toán/bài toán. */
export function Breadcrumbs({items}:{items:Crumb[]}){
 return <nav aria-label="breadcrumb" className="flex gap-2 items-center flex-wrap">
  {items.map((it,i)=><span key={i} className="flex items-center gap-2">
   {i>0&&<span aria-hidden="true">›</span>}
   {it.to?<Link to={it.to}>{it.label}</Link>:<span>{it.label}</span>}
  </span>)}
 </nav>;
}
