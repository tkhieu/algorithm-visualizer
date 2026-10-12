import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {algorithms,problems} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import {Card,CardContent,CardHeader,CardTitle} from '../../components/ui/card';
import {Button} from '../../components/ui/button';
import {CatalogPage} from './CatalogPage';
import {Breadcrumbs} from '../nav/Breadcrumbs';

/** Trang chủ: tổng quan tiến độ catalog, lối tắt vào bài toán đã có, lưới chương, rồi lưới thuật toán. */
export function HomePage(){
 const readyProblems=useMemo(()=>problems.filter(p=>p.status==='ready'),[]);
 const readyAlgos=algorithms.filter(a=>a.status==='ready').length;
 return <div className="space-y-6">
  <Breadcrumbs items={[{label:'Trang chủ'}]}/>
  <div><p className="eyebrow">CS112 · Minh họa thuật toán</p><h1>Toàn bộ catalog thuật toán Levitin</h1><p className="muted">Mỗi bài toán có input → từng bước → output, so sánh và bộ ca kiểm thử.</p></div>
  <div className="grid gap-3 sm:grid-cols-3">
   <Card><CardContent className="pt-4"><p className="muted text-sm">Bài toán sẵn sàng</p><p className="text-3xl font-bold">{readyProblems.length}/{problems.length}</p></CardContent></Card>
   <Card><CardContent className="pt-4"><p className="muted text-sm">Thuật toán sẵn sàng</p><p className="text-3xl font-bold">{readyAlgos}/{algorithms.length}</p></CardContent></Card>
   <Card><CardContent className="pt-4"><p className="muted text-sm">Chương sách</p><p className="text-3xl font-bold">{chapters.length}</p></CardContent></Card>
  </div>
  <div>
   <h2 className="text-lg font-semibold mb-2">Bài toán đã có thể chạy</h2>
   <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{readyProblems.map(p=><Card key={p.id}><CardHeader><CardTitle>{p.title}</CardTitle></CardHeader><CardContent>
    <p className="muted">{algorithms.filter(a=>a.problemId===p.id).length} cách giải</p>
    <div className="flex gap-2 mt-3"><Button asChild><Link to={`/problem/${p.id}`}>Xem bài toán</Link></Button><Button variant="outline" asChild><Link to={`/compare/${p.id}`}>So sánh nổi bật</Link></Button></div>
   </CardContent></Card>)}</div>
  </div>
  <div>
   <h2 className="text-lg font-semibold mb-2">Theo chương</h2>
   <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{chapters.map(c=>{
    const count=algorithms.filter(a=>a.chapter===c.id).length;
    const ready=algorithms.filter(a=>a.chapter===c.id&&a.status==='ready').length;
    return <Link key={c.id} to={`/chapter/${c.id}`} className="border border-neutral-300 rounded-md p-3 hover:bg-neutral-100">
     <p className="font-semibold">Chương {c.id}</p><p className="text-sm muted">{c.name}</p><p className="text-xs muted mt-1">{ready}/{count} thuật toán</p>
    </Link>;
   })}</div>
  </div>
  <div>
   <h2 className="text-lg font-semibold mb-2">Toàn bộ thuật toán</h2>
   <CatalogPage standalone={false}/>
  </div>
 </div>;
}
