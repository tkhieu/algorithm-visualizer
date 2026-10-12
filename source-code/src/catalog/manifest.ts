import type {Algorithm,VisualKind} from '../core/contracts';

export type Status='ready'|'planned';
export interface ProblemSummary{id:string;title:string;status:Status}
export type AlgorithmSummary=Pick<Algorithm<unknown,unknown,unknown>,'id'|'problemId'|'title'|'chapter'|'section'|'page'|'technique'|'exactness'|'complexity'|'views'>&{status:Status};

// --- Bài toán cái túi 0/1: đã triển khai (status ready), khớp 1:1 với src/algorithms/knapsack-01/*.
// Các trường ở đây được manifest.test.ts so khớp nguyên văn với metadata thật của từng algorithm.
const knapsackAlgorithms:AlgorithmSummary[]=[
 {id:'knapsack-01/exhaustive',problemId:'knapsack-01',title:'Vét cạn',chapter:3,section:'3.4',page:118,technique:'brute-force',exactness:'exact',complexity:{time:'O(2ⁿ)',space:'O(n)'},views:['state-space-tree','items'],status:'ready'},
 {id:'knapsack-01/dp-table',problemId:'knapsack-01',title:'Quy hoạch động — bảng',chapter:8,section:'8.2',page:292,technique:'dp',exactness:'exact',complexity:{time:'O(nW)',space:'O(nW)'},views:['matrix','items'],status:'ready'},
 {id:'knapsack-01/dp-memo',problemId:'knapsack-01',title:'Quy hoạch động — nhớ',chapter:8,section:'8.2',page:292,technique:'dp',exactness:'exact',complexity:{time:'O(nW)',space:'O(nW)'},views:['matrix','state-space-tree','items'],status:'ready'},
 {id:'knapsack-01/branch-and-bound',problemId:'knapsack-01',title:'Nhánh cận — ưu tiên cận trên',chapter:12,section:'12.2',page:436,technique:'branch-and-bound',exactness:'exact',complexity:{time:'O(2ⁿ) xấu nhất',space:'O(2ⁿ)'},views:['state-space-tree','items'],status:'ready'},
 {id:'knapsack-01/greedy-approx',problemId:'knapsack-01',title:'Tham lam theo tỷ lệ — xấp xỉ',chapter:12,section:'12.3',page:453,technique:'greedy',exactness:'approximate',complexity:{time:'O(n log n)',space:'O(n)'},views:['items'],status:'ready'},
];
const knapsackProblem:ProblemSummary={id:'knapsack-01',title:'Bài toán cái túi 0/1',status:'ready'};

// --- B5: n-queens (đã triển khai, status ready) — khớp 1:1 với src/algorithms/n-queens/*.
const nQueensAlgorithms:AlgorithmSummary[]=[
 {id:'n-queens/backtracking',problemId:'n-queens',title:'Quay lui',chapter:12,section:'12.1',page:425,technique:'backtracking',exactness:'exact',complexity:{time:'O(n!) xấu nhất',space:'O(n)'},views:['board','state-space-tree'],status:'ready'},
 {id:'n-queens/exhaustive',problemId:'n-queens',title:'Vét cạn mọi cách đặt',chapter:12,section:'12.1',page:425,technique:'brute-force',exactness:'exact',complexity:{time:'O(nⁿ) xấu nhất',space:'O(n)'},views:['board','state-space-tree'],status:'ready'},
];
const nQueensProblem:ProblemSummary={id:'n-queens',title:'Bài toán n quân hậu',status:'ready'};

// --- B5: hamiltonian-circuit (đã triển khai, status ready) — khớp 1:1 với src/algorithms/hamiltonian-circuit/*.
const hamiltonianAlgorithms:AlgorithmSummary[]=[
 {id:'hamiltonian-circuit/backtracking',problemId:'hamiltonian-circuit',title:'Quay lui',chapter:12,section:'12.1',page:426,technique:'backtracking',exactness:'exact',complexity:{time:'O(n!) xấu nhất',space:'O(n)'},views:['graph','state-space-tree'],status:'ready'},
 {id:'hamiltonian-circuit/exhaustive',problemId:'hamiltonian-circuit',title:'Vét cạn mọi hoán vị',chapter:12,section:'12.1',page:426,technique:'brute-force',exactness:'exact',complexity:{time:'O(n!)',space:'O(n)'},views:['graph','state-space-tree'],status:'ready'},
];
const hamiltonianProblem:ProblemSummary={id:'hamiltonian-circuit',title:'Chu trình Hamilton',status:'ready'};

// --- B5: subset-sum (đã triển khai, status ready) — khớp 1:1 với src/algorithms/subset-sum/*.
const subsetSumAlgorithms:AlgorithmSummary[]=[
 {id:'subset-sum/backtracking',problemId:'subset-sum',title:'Quay lui',chapter:12,section:'12.1',page:427,technique:'backtracking',exactness:'exact',complexity:{time:'O(2ⁿ) xấu nhất',space:'O(n)'},views:['state-space-tree','matrix'],status:'ready'},
 {id:'subset-sum/dp',problemId:'subset-sum',title:'Quy hoạch động',chapter:12,section:'12.1',page:427,technique:'dp',exactness:'exact',complexity:{time:'O(n·S)',space:'O(n·S)'},views:['state-space-tree','matrix'],status:'ready'},
 {id:'subset-sum/exhaustive',problemId:'subset-sum',title:'Vét cạn mọi tập con',chapter:12,section:'12.1',page:427,technique:'brute-force',exactness:'exact',complexity:{time:'O(2ⁿ)',space:'O(n)'},views:['state-space-tree','matrix'],status:'ready'},
];
const subsetSumProblem:ProblemSummary={id:'subset-sum',title:'Bài toán tổng tập con',status:'ready'};

// --- B5: graph-coloring (đã triển khai, status ready) — khớp 1:1 với src/algorithms/graph-coloring/*.
const graphColoringAlgorithms:AlgorithmSummary[]=[
 {id:'graph-coloring/greedy',problemId:'graph-coloring',title:'Tham lam theo thứ tự đỉnh',chapter:12,section:'12.1',page:425,technique:'greedy',exactness:'approximate',complexity:{time:'O(V²)',space:'O(V)'},views:['graph','state-space-tree'],status:'ready'},
 {id:'graph-coloring/welsh-powell',problemId:'graph-coloring',title:'Welsh–Powell',chapter:12,section:'12.1',page:425,technique:'greedy',exactness:'approximate',complexity:{time:'O(V²)',space:'O(V)'},views:['graph','state-space-tree'],status:'ready'},
 {id:'graph-coloring/dsatur',problemId:'graph-coloring',title:'DSATUR (mở rộng, không có trong giáo trình)',chapter:12,section:'12.1',page:425,technique:'greedy',exactness:'approximate',complexity:{time:'O(V²)',space:'O(V)'},views:['graph','state-space-tree'],status:'ready'},
 {id:'graph-coloring/backtracking',problemId:'graph-coloring',title:'Quay lui',chapter:12,section:'12.1',page:425,technique:'backtracking',exactness:'exact',complexity:{time:'O(kⁿ) xấu nhất',space:'O(V)'},views:['graph','state-space-tree'],status:'ready'},
 {id:'graph-coloring/exhaustive',problemId:'graph-coloring',title:'Vét cạn mọi cách tô',chapter:12,section:'12.1',page:425,technique:'brute-force',exactness:'exact',complexity:{time:'O(kⁿ)',space:'O(V)'},views:['graph','state-space-tree'],status:'ready'},
];
const graphColoringProblem:ProblemSummary={id:'graph-coloring',title:'Tô màu đồ thị (bài toán Sở thú)',status:'ready'};

// --- B5: tsp (đã triển khai, status ready) — khớp 1:1 với src/algorithms/tsp/*.
const tspAlgorithms:AlgorithmSummary[]=[
 {id:'tsp/exhaustive',problemId:'tsp',title:'Vét cạn mọi hoán vị',chapter:3,section:'3.4',page:115,technique:'brute-force',exactness:'exact',complexity:{time:'O(n!)',space:'O(n)'},views:['points-2d','state-space-tree'],status:'ready'},
 {id:'tsp/branch-and-bound',problemId:'tsp',title:'Nhánh cận',chapter:12,section:'12.2',page:438,technique:'branch-and-bound',exactness:'exact',complexity:{time:'O(n!) xấu nhất',space:'O(n·2ⁿ)'},views:['points-2d','state-space-tree'],status:'ready'},
 {id:'tsp/nearest-neighbor',problemId:'tsp',title:'Láng giềng gần nhất (xấp xỉ)',chapter:12,section:'12.3',page:443,technique:'approximation',exactness:'approximate',complexity:{time:'O(n²)',space:'O(n)'},views:['points-2d','state-space-tree'],status:'ready'},
 {id:'tsp/twice-around-tree',problemId:'tsp',title:'Hai lần cây khung (xấp xỉ)',chapter:12,section:'12.3',page:443,technique:'approximation',exactness:'approximate',complexity:{time:'O(n² log n)',space:'O(n)'},views:['points-2d','state-space-tree'],status:'ready'},
 {id:'tsp/christofides',problemId:'tsp',title:'Christofides (xấp xỉ)',chapter:12,section:'12.3',page:443,technique:'approximation',exactness:'approximate',complexity:{time:'O(n³)',space:'O(n²)'},views:['points-2d','state-space-tree'],status:'ready'},
];
const tspProblem:ProblemSummary={id:'tsp',title:'Người du lịch (TSP)',status:'ready'};

// --- B5: assignment (đã triển khai, status ready) — khớp 1:1 với src/algorithms/assignment/*.
const assignmentAlgorithms:AlgorithmSummary[]=[
 {id:'assignment/exhaustive',problemId:'assignment',title:'Vét cạn mọi phân công',chapter:3,section:'3.4',page:115,technique:'brute-force',exactness:'exact',complexity:{time:'O(n!)',space:'O(n)'},views:['board','state-space-tree'],status:'ready'},
 {id:'assignment/branch-and-bound',problemId:'assignment',title:'Nhánh cận',chapter:12,section:'12.2',page:433,technique:'branch-and-bound',exactness:'exact',complexity:{time:'O(n!) xấu nhất',space:'O(n²)'},views:['board','state-space-tree'],status:'ready'},
 {id:'assignment/hungarian',problemId:'assignment',title:'Thuật toán Hungary (mở rộng, không có trong giáo trình)',chapter:12,section:'12.2',page:433,technique:'iterative-improvement',exactness:'exact',complexity:{time:'O(n³)',space:'O(n²)'},views:['board','state-space-tree'],status:'ready'},
];
const assignmentProblem:ProblemSummary={id:'assignment',title:'Bài toán phân công',status:'ready'};

// --- Toàn bộ catalog còn lại (Phase B sẽ lần lượt chuyển từng dòng sang status 'ready').
// Số mục/trang tham chiếu từ docs/levitin-thuat-toan-co-the-demo.md. Với biến thể mở rộng,
// trang chỉ tới chủ đề gần nhất; Phase B sẽ ghi rõ nguồn riêng trong phần mô tả thuật toán.
interface AlgoDef{id:string;title:string;technique:string;exactness?:'exact'|'approximate'|'heuristic';time:string;space:string}
interface ProblemDef{id:string;title:string;views:VisualKind[];algos:AlgoDef[]}

type Citation={section:string;page:number};
const citationByProblem:Record<string,Citation>={
 gcd:{section:'1.1',page:3},fibonacci:{section:'2.5',page:80},'search-sorted':{section:'4.4',page:150},
 'fake-coin':{section:'4.4',page:150},multiplication:{section:'5.4',page:186},josephus:{section:'4.4',page:150},
 'combinatorial-generation':{section:'4.3',page:144},'kth-smallest':{section:'4.5',page:158},
 'polynomial-eval':{section:'6.5',page:234},exponentiation:{section:'6.5',page:234},
 'matrix-multiplication':{section:'5.4',page:186},'linear-system':{section:'6.2',page:208},
 'root-finding':{section:'12.4',page:460},nim:{section:'4.5',page:158},sorting:{section:'3.1',page:98},
 'heap-construction':{section:'6.4',page:226},'binary-tree-traversal':{section:'5.3',page:182},
 'balanced-search-tree':{section:'6.3',page:218},'dictionary-hashing':{section:'7.3',page:270},
 'element-uniqueness':{section:'6.1',page:202},'graph-traversal':{section:'3.5',page:122},
 'topological-sort':{section:'4.2',page:138},'transitive-closure':{section:'8.4',page:304},
 'all-pairs-shortest-path':{section:'8.4',page:304},'single-source-shortest-path':{section:'9.3',page:333},
 'minimum-spanning-tree':{section:'9.1',page:318},'huffman-coding':{section:'9.4',page:338},
 'maximum-flow':{section:'10.2',page:361},'bipartite-matching':{section:'10.3',page:372},
 'stable-marriage':{section:'10.4',page:380},'string-matching':{section:'7.2',page:259},
 'closest-pair':{section:'5.5',page:192},'convex-hull':{section:'5.5',page:192},
 'coin-row':{section:'8.1',page:285},'change-making':{section:'8.1',page:285},
 'coin-collecting':{section:'8.1',page:285},'optimal-bst':{section:'8.3',page:297},
 'linear-programming-2d':{section:'10.1',page:346},tsp:{section:'12.3',page:443},
 assignment:{section:'12.2',page:433},'n-queens':{section:'12.1',page:425},
 'hamiltonian-circuit':{section:'12.1',page:426},'subset-sum':{section:'12.1',page:427},
 'graph-coloring':{section:'12.1',page:425},'matrix-chain':{section:'8.3',page:303},
 lcs:{section:'8.2',page:292},
};
const citationByAlgorithm:Record<string,Citation>={
 'search-sorted/sequential':{section:'2.1',page:47},'search-sorted/interpolation':{section:'4.5',page:158},
 'multiplication/russian-peasant':{section:'4.4',page:150},
 'kth-smallest/sort-then-pick':{section:'6.1',page:202},
 'sorting/insertion':{section:'4.1',page:134},'sorting/mergesort':{section:'5.1',page:172},
 'sorting/quicksort':{section:'5.2',page:177},'sorting/heapsort':{section:'6.4',page:226},
 'sorting/counting':{section:'7.1',page:254},
 'balanced-search-tree/bst-insert':{section:'4.5',page:158},
 'balanced-search-tree/b-tree-insert':{section:'7.4',page:276},
 'element-uniqueness/brute-force':{section:'3.1',page:98},
 'single-source-shortest-path/bfs-unweighted':{section:'3.5',page:122},
 'minimum-spanning-tree/kruskal':{section:'9.2',page:325},
 'string-matching/brute-force':{section:'3.2',page:104},
 'closest-pair/brute-force':{section:'3.3',page:108},'convex-hull/brute-force':{section:'3.3',page:108},
 'tsp/exhaustive':{section:'3.4',page:115},'tsp/branch-and-bound':{section:'12.2',page:438},
 'assignment/exhaustive':{section:'3.4',page:115},
 'coin-row/exhaustive':{section:'3.4',page:115},
};

const plannedDefs:ProblemDef[]=[
 // B1 — Chương 1, 2, 4, 5.4, 6.2, 6.5, 12.4
 {id:'gcd',title:'Ước chung lớn nhất (GCD)',views:['sequence'],algos:[
  {id:'euclid',title:'Thuật toán Euclid',technique:'decrease-and-conquer',time:'O(log min(m,n))',space:'O(1)'},
  {id:'consecutive-integer',title:'Kiểm tra số nguyên giảm dần',technique:'brute-force',time:'O(min(m,n))',space:'O(1)'},
  {id:'middle-school',title:'Phân tích thừa số nguyên tố',technique:'brute-force',time:'O(√n)',space:'O(1)'},
 ]},
 {id:'fibonacci',title:'Số Fibonacci',views:['tree','sequence'],algos:[
  {id:'recursive',title:'Đệ quy thuần',technique:'brute-force',time:'O(φⁿ)',space:'O(n)'},
  {id:'iterative',title:'Lặp từ dưới lên',technique:'decrease-and-conquer',time:'O(n)',space:'O(1)'},
  {id:'memo',title:'Có nhớ (đối chiếu quy hoạch động)',technique:'dp',time:'O(n)',space:'O(n)'},
 ]},
 {id:'search-sorted',title:'Tìm kiếm trên dãy đã sắp xếp',views:['array-bars'],algos:[
  {id:'sequential',title:'Tìm kiếm tuần tự',technique:'brute-force',time:'O(n)',space:'O(1)'},
  {id:'binary',title:'Tìm kiếm nhị phân',technique:'decrease-and-conquer',time:'O(log n)',space:'O(1)'},
  {id:'interpolation',title:'Tìm kiếm nội suy',technique:'decrease-and-conquer',time:'O(log log n) TB',space:'O(1)'},
 ]},
 {id:'fake-coin',title:'Đồng xu giả',views:['sequence'],algos:[
  {id:'divide-by-two',title:'Chia đôi mỗi lần cân',technique:'divide-and-conquer',time:'O(log n)',space:'O(log n)'},
  {id:'divide-by-three',title:'Chia ba mỗi lần cân',technique:'divide-and-conquer',time:'O(log₃ n)',space:'O(log n)'},
 ]},
 {id:'multiplication',title:'Nhân hai số lớn',views:['sequence'],algos:[
  {id:'russian-peasant',title:'Nhân kiểu nông dân Nga',technique:'decrease-and-conquer',time:'O(log n)',space:'O(1)'},
  {id:'karatsuba',title:'Nhân Karatsuba',technique:'divide-and-conquer',time:'O(n^1.585)',space:'O(n)'},
  {id:'schoolbook',title:'Nhân theo cách thông thường',technique:'brute-force',time:'O(n²)',space:'O(1)'},
 ]},
 {id:'josephus',title:'Bài toán Josephus',views:['sequence'],algos:[
  {id:'simulation',title:'Mô phỏng vòng tròn',technique:'brute-force',time:'O(n)',space:'O(n)'},
  {id:'recurrence',title:'Công thức truy hồi',technique:'decrease-and-conquer',time:'O(n)',space:'O(1)'},
 ]},
 {id:'combinatorial-generation',title:'Sinh đối tượng tổ hợp',views:['sequence'],algos:[
  {id:'johnson-trotter',title:'Johnson–Trotter (hoán vị)',technique:'decrease-and-conquer',time:'O(n!)',space:'O(n)'},
  {id:'lexicographic-permutations',title:'Hoán vị theo thứ tự từ điển',technique:'brute-force',time:'O(n!)',space:'O(n)'},
  {id:'subsets-bitstring',title:'Tập con theo chuỗi bit',technique:'brute-force',time:'O(2ⁿ)',space:'O(n)'},
  {id:'gray-code',title:'Mã Gray nhị phân',technique:'decrease-and-conquer',time:'O(2ⁿ)',space:'O(n)'},
 ]},
 {id:'kth-smallest',title:'Phần tử nhỏ thứ k',views:['array-bars'],algos:[
  {id:'quickselect-lomuto',title:'Quickselect (phân hoạch Lomuto)',technique:'divide-and-conquer',time:'O(n) TB',space:'O(log n)'},
  {id:'sort-then-pick',title:'Sắp xếp rồi chọn',technique:'brute-force',time:'O(n log n)',space:'O(n)'},
 ]},
 {id:'polynomial-eval',title:'Tính giá trị đa thức',views:['sequence'],algos:[
  {id:'horner',title:'Quy tắc Horner',technique:'transform-and-conquer',time:'O(n)',space:'O(1)'},
  {id:'naive',title:'Tính trực tiếp từng lũy thừa',technique:'brute-force',time:'O(n²)',space:'O(1)'},
 ]},
 {id:'exponentiation',title:'Lũy thừa nhanh',views:['sequence'],algos:[
  {id:'left-right-binary',title:'Nhị phân trái sang phải',technique:'divide-and-conquer',time:'O(log n)',space:'O(1)'},
  {id:'right-left-binary',title:'Nhị phân phải sang trái',technique:'decrease-and-conquer',time:'O(log n)',space:'O(1)'},
  {id:'naive',title:'Nhân lặp n lần',technique:'brute-force',time:'O(n)',space:'O(1)'},
 ]},
 {id:'matrix-multiplication',title:'Nhân ma trận',views:['matrix'],algos:[
  {id:'strassen',title:'Thuật toán Strassen',technique:'divide-and-conquer',time:'O(n^2.807)',space:'O(n²)'},
  {id:'standard',title:'Nhân ma trận thông thường',technique:'brute-force',time:'O(n³)',space:'O(n²)'},
 ]},
 {id:'linear-system',title:'Giải hệ phương trình tuyến tính',views:['matrix'],algos:[
  {id:'gaussian-elimination',title:'Khử Gauss',technique:'transform-and-conquer',time:'O(n³)',space:'O(n²)'},
  {id:'lu-decomposition',title:'Phân rã LU',technique:'transform-and-conquer',time:'O(n³)',space:'O(n²)'},
 ]},
 {id:'root-finding',title:'Tìm nghiệm phương trình phi tuyến',views:['numeric-plot'],algos:[
  {id:'bisection',title:'Chia đôi',technique:'decrease-and-conquer',time:'O(log(1/ε))',space:'O(1)'},
  {id:'false-position',title:'Dây cung (false position)',technique:'decrease-and-conquer',time:'O(log(1/ε))',space:'O(1)'},
  {id:'newton',title:'Newton',technique:'numerical',time:'O(log log(1/ε))',space:'O(1)'},
 ]},
 {id:'nim',title:'Trò chơi Nim',views:['sequence'],algos:[
  {id:'winning-strategy',title:'Chiến lược thắng bằng XOR',technique:'transform-and-conquer',time:'O(n log m)',space:'O(1)'},
 ]},

 // B2 — Chương 3.1, 4.1, 5.1–5.3, 6.1, 6.3, 6.4, 7.1, 7.3, 7.4
 {id:'sorting',title:'Sắp xếp',views:['array-bars','tree'],algos:[
  {id:'selection',title:'Sắp xếp chọn',technique:'brute-force',time:'O(n²)',space:'O(1)'},
  {id:'bubble',title:'Sắp xếp nổi bọt',technique:'brute-force',time:'O(n²)',space:'O(1)'},
  {id:'insertion',title:'Sắp xếp chèn',technique:'decrease-and-conquer',time:'O(n²)',space:'O(1)'},
  {id:'mergesort',title:'Sắp xếp trộn',technique:'divide-and-conquer',time:'O(n log n)',space:'O(n)'},
  {id:'quicksort',title:'Sắp xếp nhanh',technique:'divide-and-conquer',time:'O(n log n) TB',space:'O(log n)'},
  {id:'heapsort',title:'Sắp xếp vun đống',technique:'transform-and-conquer',time:'O(n log n)',space:'O(1)'},
  {id:'counting',title:'Sắp xếp đếm phân phối',technique:'space-time-tradeoff',time:'O(n+k)',space:'O(n+k)'},
 ]},
 {id:'heap-construction',title:'Xây dựng đống (heap)',views:['tree','array-bars'],algos:[
  {id:'bottom-up',title:'Xây đống từ dưới lên',technique:'transform-and-conquer',time:'O(n)',space:'O(1)'},
  {id:'top-down',title:'Xây đống từ trên xuống',technique:'transform-and-conquer',time:'O(n log n)',space:'O(1)'},
 ]},
 {id:'binary-tree-traversal',title:'Duyệt cây nhị phân',views:['tree'],algos:[
  {id:'preorder',title:'Duyệt trước',technique:'divide-and-conquer',time:'O(n)',space:'O(h)'},
  {id:'inorder',title:'Duyệt giữa',technique:'divide-and-conquer',time:'O(n)',space:'O(h)'},
  {id:'postorder',title:'Duyệt sau',technique:'divide-and-conquer',time:'O(n)',space:'O(h)'},
  {id:'level-order',title:'Duyệt theo mức',technique:'decrease-and-conquer',time:'O(n)',space:'O(n)'},
 ]},
 {id:'balanced-search-tree',title:'Cây tìm kiếm cân bằng',views:['tree'],algos:[
  {id:'bst-insert',title:'Chèn cây tìm kiếm nhị phân',technique:'decrease-and-conquer',time:'O(h)',space:'O(1)'},
  {id:'avl-insert',title:'Chèn cây AVL',technique:'transform-and-conquer',time:'O(log n)',space:'O(1)'},
  {id:'two-three-insert',title:'Chèn cây 2-3',technique:'transform-and-conquer',time:'O(log n)',space:'O(1)'},
  {id:'b-tree-insert',title:'Chèn cây B',technique:'space-time-tradeoff',time:'O(log n)',space:'O(1)'},
 ]},
 {id:'dictionary-hashing',title:'Từ điển bằng bảng băm',views:['hash-table'],algos:[
  {id:'separate-chaining',title:'Băm với danh sách liên kết',technique:'space-time-tradeoff',time:'O(1) TB',space:'O(n)'},
  {id:'linear-probing',title:'Băm với dò tuyến tính',technique:'space-time-tradeoff',time:'O(1) TB',space:'O(n)'},
 ]},
 {id:'element-uniqueness',title:'Kiểm tra phần tử duy nhất',views:['array-bars'],algos:[
  {id:'brute-force',title:'So từng cặp',technique:'brute-force',time:'O(n²)',space:'O(1)'},
  {id:'presort',title:'Sắp xếp trước rồi quét',technique:'transform-and-conquer',time:'O(n log n)',space:'O(n)'},
  {id:'mode',title:'Tìm mode bằng sắp xếp trước',technique:'transform-and-conquer',time:'O(n log n)',space:'O(n)'},
 ]},

 // B3 — Chương 3.5, 4.2, 8.4, 9.1–9.4, 10.2–10.4
 {id:'graph-traversal',title:'Duyệt đồ thị',views:['graph'],algos:[
  {id:'dfs',title:'Duyệt theo chiều sâu (DFS)',technique:'decrease-and-conquer',time:'O(V+E)',space:'O(V)'},
  {id:'bfs',title:'Duyệt theo chiều rộng (BFS)',technique:'decrease-and-conquer',time:'O(V+E)',space:'O(V)'},
 ]},
 {id:'topological-sort',title:'Sắp xếp tô pô',views:['graph'],algos:[
  {id:'dfs-based',title:'Dựa trên DFS',technique:'decrease-and-conquer',time:'O(V+E)',space:'O(V)'},
  {id:'source-removal',title:'Xoá dần đỉnh vào-0',technique:'decrease-and-conquer',time:'O(V+E)',space:'O(V)'},
 ]},
 {id:'transitive-closure',title:'Bao đóng bắc cầu',views:['matrix','graph'],algos:[
  {id:'warshall',title:'Thuật toán Warshall',technique:'dp',time:'O(V³)',space:'O(V²)'},
  {id:'dfs-each-vertex',title:'DFS từ mỗi đỉnh',technique:'brute-force',time:'O(V(V+E))',space:'O(V²)'},
 ]},
 {id:'all-pairs-shortest-path',title:'Đường đi ngắn nhất mọi cặp',views:['matrix','graph'],algos:[
  {id:'floyd',title:'Thuật toán Floyd',technique:'dp',time:'O(V³)',space:'O(V²)'},
  {id:'dijkstra-all-sources',title:'Dijkstra từ mọi đỉnh',technique:'greedy',time:'O(VE log V)',space:'O(V²)'},
 ]},
 {id:'single-source-shortest-path',title:'Đường đi ngắn nhất một nguồn',views:['graph'],algos:[
  {id:'dijkstra',title:'Thuật toán Dijkstra',technique:'greedy',time:'O(E log V)',space:'O(V)'},
  {id:'bfs-unweighted',title:'BFS trên đồ thị không trọng số',technique:'decrease-and-conquer',time:'O(V+E)',space:'O(V)'},
 ]},
 {id:'minimum-spanning-tree',title:'Cây khung nhỏ nhất',views:['graph'],algos:[
  {id:'prim',title:'Thuật toán Prim',technique:'greedy',time:'O(E log V)',space:'O(V)'},
  {id:'kruskal',title:'Thuật toán Kruskal',technique:'greedy',time:'O(E log E)',space:'O(V)'},
 ]},
 {id:'huffman-coding',title:'Mã hoá Huffman',views:['tree'],algos:[
  {id:'huffman',title:'Cây Huffman',technique:'greedy',time:'O(n log n)',space:'O(n)'},
  {id:'fixed-length',title:'Mã hoá độ dài cố định (đối chiếu)',technique:'brute-force',time:'O(n)',space:'O(n)'},
 ]},
 {id:'maximum-flow',title:'Luồng cực đại',views:['graph'],algos:[
  {id:'shortest-augmenting-path',title:'Đường tăng luồng ngắn nhất (Edmonds–Karp)',technique:'iterative-improvement',time:'O(VE²)',space:'O(V+E)'},
  {id:'ford-fulkerson-dfs',title:'Ford–Fulkerson theo DFS',technique:'iterative-improvement',time:'O(E·f*)',space:'O(V+E)'},
 ]},
 {id:'bipartite-matching',title:'Ghép cặp trên đồ thị hai phía',views:['graph'],algos:[
  {id:'augmenting-path',title:'Đường tăng cường',technique:'iterative-improvement',time:'O(VE)',space:'O(V+E)'},
  {id:'via-max-flow',title:'Quy về luồng cực đại',technique:'iterative-improvement',time:'O(VE)',space:'O(V+E)'},
 ]},
 {id:'stable-marriage',title:'Hôn nhân bền vững',views:['sequence','board'],algos:[
  {id:'gale-shapley-men-propose',title:'Gale–Shapley (nam đề xuất)',technique:'iterative-improvement',time:'O(n²)',space:'O(n²)'},
  {id:'gale-shapley-women-propose',title:'Gale–Shapley (nữ đề xuất)',technique:'iterative-improvement',time:'O(n²)',space:'O(n²)'},
 ]},

 // B4 — Chương 3.2, 3.3, 5.5, 7.2, 8.1, 8.3, 10.1
 {id:'string-matching',title:'So khớp chuỗi',views:['string-align'],algos:[
  {id:'brute-force',title:'So khớp vét cạn',technique:'brute-force',time:'O(nm)',space:'O(1)'},
  {id:'horspool',title:'Thuật toán Horspool',technique:'space-time-tradeoff',time:'O(nm) xấu nhất, O(n) TB',space:'O(k)'},
  {id:'boyer-moore',title:'Thuật toán Boyer–Moore',technique:'space-time-tradeoff',time:'O(nm) xấu nhất, O(n) TB',space:'O(k)'},
 ]},
 {id:'closest-pair',title:'Cặp điểm gần nhất',views:['points-2d'],algos:[
  {id:'brute-force',title:'So từng cặp điểm',technique:'brute-force',time:'O(n²)',space:'O(1)'},
  {id:'divide-and-conquer',title:'Chia để trị theo trục x',technique:'divide-and-conquer',time:'O(n log n)',space:'O(n)'},
 ]},
 {id:'convex-hull',title:'Bao lồi',views:['points-2d'],algos:[
  {id:'brute-force',title:'Kiểm tra từng cạnh',technique:'brute-force',time:'O(n³)',space:'O(n)'},
  {id:'quickhull',title:'QuickHull',technique:'divide-and-conquer',time:'O(n log n) TB',space:'O(n)'},
 ]},
 {id:'coin-row',title:'Dãy đồng xu',views:['sequence'],algos:[
  {id:'dp',title:'Quy hoạch động — bảng',technique:'dp',time:'O(n)',space:'O(n)'},
  {id:'memo',title:'Quy hoạch động — có nhớ',technique:'dp',time:'O(n)',space:'O(n)'},
  {id:'exhaustive',title:'Vét cạn đệ quy',technique:'brute-force',time:'O(2ⁿ)',space:'O(n)'},
 ]},
 {id:'change-making',title:'Đổi tiền tối thiểu đồng xu',views:['matrix'],algos:[
  {id:'dp',title:'Quy hoạch động',technique:'dp',time:'O(n·A)',space:'O(A)'},
  {id:'greedy',title:'Tham lam (có thể sai)',technique:'greedy',exactness:'approximate',time:'O(n)',space:'O(1)'},
 ]},
 {id:'coin-collecting',title:'Gom đồng xu trên lưới',views:['board'],algos:[
  {id:'dp',title:'Quy hoạch động trên lưới',technique:'dp',time:'O(nm)',space:'O(nm)'},
  {id:'exhaustive-paths',title:'Vét cạn mọi đường đi',technique:'brute-force',time:'O(C(n+m,n))',space:'O(n+m)'},
 ]},
 {id:'optimal-bst',title:'Cây tìm kiếm nhị phân tối ưu',views:['matrix','tree'],algos:[
  {id:'dp',title:'Quy hoạch động',technique:'dp',time:'O(n³)',space:'O(n²)'},
  {id:'exhaustive',title:'Vét cạn mọi cây',technique:'brute-force',time:'O(4ⁿ/n^1.5)',space:'O(n)'},
 ]},
 {id:'linear-programming-2d',title:'Quy hoạch tuyến tính 2 chiều',views:['numeric-plot','matrix'],algos:[
  {id:'simplex',title:'Thuật toán Simplex',technique:'iterative-improvement',time:'O(2ⁿ) xấu nhất',space:'O(n²)'},
  {id:'vertex-enumeration',title:'Liệt kê đỉnh miền khả thi',technique:'brute-force',time:'O(C(m,n))',space:'O(n)'},
 ]},

 // B5 — Chương 3.4, 12.1–12.3 + bài tập mở rộng
 {id:'matrix-chain',title:'Nhân chuỗi ma trận',views:['matrix','tree'],algos:[
  {id:'dp',title:'Quy hoạch động — bảng',technique:'dp',time:'O(n³)',space:'O(n²)'},
  {id:'memo',title:'Quy hoạch động — có nhớ',technique:'dp',time:'O(n³)',space:'O(n²)'},
  {id:'exhaustive',title:'Vét cạn mọi cách đặt ngoặc',technique:'brute-force',time:'O(4ⁿ/n^1.5)',space:'O(n)'},
 ]},
 {id:'lcs',title:'Dãy con chung dài nhất',views:['matrix','string-align'],algos:[
  {id:'dp',title:'Quy hoạch động — bảng',technique:'dp',time:'O(nm)',space:'O(nm)'},
  {id:'memo',title:'Quy hoạch động — có nhớ',technique:'dp',time:'O(nm)',space:'O(nm)'},
  {id:'brute-force',title:'Vét cạn mọi dãy con',technique:'brute-force',time:'O(2^(n+m))',space:'O(n+m)'},
 ]},
];

const plannedAlgorithms:AlgorithmSummary[]=plannedDefs.flatMap(p=>p.algos.map(a=>{
 const citation=citationByAlgorithm[`${p.id}/${a.id}`]??citationByProblem[p.id];
 if(!citation)throw new Error(`Thiếu mục/trang cho ${p.id}/${a.id}`);
 const chapter=Number(citation.section.split('.')[0]);
 return {
  id:`${p.id}/${a.id}`,problemId:p.id,title:a.title,chapter,section:citation.section,page:citation.page,
  technique:a.technique,exactness:a.exactness??'exact',
  complexity:{time:a.time,space:a.space},views:p.views,status:'planned',
 } satisfies AlgorithmSummary;
}));
const plannedProblems:ProblemSummary[]=plannedDefs.map(p=>({id:p.id,title:p.title,status:'planned'}));

export const problems:ProblemSummary[]=[knapsackProblem,nQueensProblem,hamiltonianProblem,subsetSumProblem,graphColoringProblem,tspProblem,assignmentProblem,...plannedProblems];
export const algorithms:AlgorithmSummary[]=[...knapsackAlgorithms,...nQueensAlgorithms,...hamiltonianAlgorithms,...subsetSumAlgorithms,...graphColoringAlgorithms,...tspAlgorithms,...assignmentAlgorithms,...plannedAlgorithms];
