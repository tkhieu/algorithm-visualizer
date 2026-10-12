import {BrowserRouter,Link,Route,Routes,useParams} from 'react-router-dom';
import {lazy,Suspense} from 'react';
import {Sidebar} from '../features/nav/Sidebar';
import {CommandPalette} from '../features/nav/CommandPalette';
import {Breadcrumbs} from '../features/nav/Breadcrumbs';

const HomePage=lazy(()=>import('../features/catalog/HomePage').then(m=>({default:m.HomePage})));
const CatalogPage=lazy(()=>import('../features/catalog/CatalogPage').then(m=>({default:m.CatalogPage})));
const ProblemsPage=lazy(()=>import('../features/catalog/ProblemsPage').then(m=>({default:m.ProblemsPage})));
const AlgorithmsPage=lazy(()=>import('../features/catalog/AlgorithmsPage').then(m=>({default:m.AlgorithmsPage})));
const ProblemPage=lazy(()=>import('../features/catalog/ProblemPage').then(m=>({default:m.ProblemPage})));
const PlayerPage=lazy(()=>import('../features/player/PlayerPage').then(m=>({default:m.PlayerPage})));
const ComparePage=lazy(()=>import('../features/compare/ComparePage').then(m=>({default:m.ComparePage})));
const TestcasePage=lazy(()=>import('../features/testcase-runner/TestcasePage').then(m=>({default:m.TestcasePage})));

function Shell(){
 return <div className="app-shell">
  <Sidebar/>
  <main>
   <header className="topbar"><Link to="/">Trang chủ</Link><span className="muted text-xs ml-auto">Ctrl+K hoặc / để tìm kiếm</span></header>
   <div className="page">
    <Suspense fallback={<p>Đang tải trang…</p>}>
     <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/chapter/:n" element={<CatalogPage/>}/>
      <Route path="/technique/:t" element={<CatalogPage/>}/>
      <Route path="/problems" element={<ProblemsPage/>}/>
      <Route path="/algorithms" element={<AlgorithmsPage/>}/>
      <Route path="/problem/:problemId" element={<ProblemRoute/>}/>
      <Route path="/play/:problemId/:algoId" element={<PlayerRoute/>}/>
      <Route path="/compare/:problemId" element={<CompareRoute/>}/>
      <Route path="/testcases/:problemId" element={<TestcaseRoute/>}/>
      <Route path="/about" element={<AboutPage/>}/>
     </Routes>
    </Suspense>
   </div>
  </main>
  <CommandPalette/>
 </div>;
}

function ProblemRoute(){const {problemId}=useParams();return <ProblemPage key={problemId} problemId={problemId??''}/>}
function PlayerRoute(){const {problemId,algoId}=useParams();return <PlayerPage key={`${problemId}/${algoId}`} problemId={problemId??''} algoId={algoId??''}/>}
function CompareRoute(){const {problemId}=useParams();return <ComparePage key={problemId} problemId={problemId??''}/>}
function TestcaseRoute(){const {problemId}=useParams();return <TestcasePage key={problemId} problemId={problemId??''}/>}

function AboutPage(){
 return <div className="space-y-4">
  <Breadcrumbs items={[{label:'Trang chủ',to:'/'},{label:'Giới thiệu'}]}/>
  <h1>Giới thiệu</h1>
  <p>Ứng dụng minh họa toàn bộ catalog thuật toán trong môn Phân tích và thiết kế thuật toán (CS112), dựa trên Anany Levitin, <em>Introduction to the Design and Analysis of Algorithms</em>, bản 3.</p>
  <p>Mỗi bài toán có input → từng bước → output, chế độ so sánh nhiều cách giải và bộ ca kiểm thử. Thanh bên có ba cách xếp: theo chương, theo kỹ thuật, theo bài toán. Nhấn <kbd>Ctrl</kbd>+<kbd>K</kbd> hoặc <kbd>/</kbd> để tìm kiếm nhanh.</p>
  <p>Phím tắt ở trình phát: Space phát/dừng; ←/→ lùi/tiến; Shift+←/→ đổi giai đoạn; +/− đổi tốc độ.</p>
 </div>;
}

export function App(){return <BrowserRouter basename={import.meta.env.BASE_URL}><Shell/></BrowserRouter>}
