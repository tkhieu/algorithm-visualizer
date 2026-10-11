# Kiến trúc ứng dụng demo toàn bộ thuật toán sách Levitin

> Phạm vi: chỉ frontend, **TypeScript + React**, không có backend. Ứng dụng demo khoảng 60 thuật toán liệt kê trong [levitin-thuat-toan-co-the-demo.md](levitin-thuat-toan-co-the-demo.md).
> Nguồn: tranh luận chéo giữa hai agent (Claude Code: đề xuất A, Codex: đề xuất B), gồm 2 vòng: đề xuất độc lập rồi phản biện lẫn nhau. Bản này là phương án đã chốt. Bảng các quyết định ở mục 6.
> Lưu ý: đề bài chỉ yêu cầu **một** bài toán. Làm toàn bộ catalog là phần mở rộng. Vì vậy thứ tự xây dựng (mục 5) luôn ưu tiên hoàn thiện một bài toán thật sâu trước.

---

## 1. Nguyên tắc cốt lõi

1. **Lấy bài toán làm trung tâm, không lấy kỹ thuật làm trung tâm.** Bài toán (`Problem`) giữ phần Input/Output, kiểm tra hợp lệ, sinh dữ liệu và chấm kết quả. Các thuật toán (`Algorithm`) giải cùng một bài toán sẽ dùng chung những phần này. Nhờ đó, chế độ so sánh và bộ testcase dùng được ngay mà không phải viết thêm.
2. **Một hàm `run` chạy được ở hai chế độ.** Cùng một đoạn code vừa dùng để ghi lại từng bước cho phần minh họa, vừa dùng để đo thời gian mà không ghi bước nào. Không bao giờ phải viết hai bản của cùng một thuật toán.
3. **Trace chỉ lưu những gì cần vẽ, không lưu trạng thái nội bộ.** Thuật toán tự cập nhật một *visual state* có thể tuần tự hóa. Mỗi bước chỉ lưu *patch* (phần thay đổi) kèm patch ngược, và cứ cách một khoảng lại lưu một checkpoint đầy đủ.
4. **Khoảng 60 thuật toán dùng chung khoảng 10 visualizer.** Mỗi thuật toán chỉ khai báo dùng view nào. Phần tùy biến (chú thích màu, nhãn) nằm trong dữ liệu chứ không nằm trong code.
5. **So sánh phải có ý nghĩa.** Hai thuật toán chỉ được đặt cạnh nhau khi có *adapter* đưa kết quả của chúng về cùng một dạng. Kết quả chính xác và kết quả xấp xỉ được gắn nhãn riêng.

---

## 2. Cấu trúc thư mục

```text
levitin-visualizer/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ playwright.config.ts
├─ scripts/
│  └─ new-algorithm.ts          # Scaffold: sinh khung thư mục cho thuật toán/bài toán mới
├─ public/
│  └─ testcases/                # (tuỳ chọn) file .json testcase lớn để tải về/nạp
├─ e2e/                         # Playwright: luồng input → từng bước → output
│  ├─ player.spec.ts
│  ├─ compare.spec.ts
│  └─ testcases.spec.ts
└─ src/
   ├─ main.tsx                  # Điểm vào, mount <App/>
   ├─ app/                      # Khung ứng dụng
   │  ├─ App.tsx
   │  ├─ routes.tsx             # Khai báo route (mục 4)
   │  └─ layout/                # AppShell, Sidebar (cây chương / kỹ thuật), TopBar
   │
   ├─ core/                     # Engine, KHÔNG phụ thuộc thuật toán cụ thể
   │  ├─ contracts/             # Kiểu dùng chung: Problem, Algorithm, Step, Visualizer...
   │  ├─ recorder/              # TraceRecorder, MetricsRecorder (mục 3.3)
   │  ├─ trace/                 # TraceStore: patch, checkpoint, seek, step back
   │  ├─ compare/               # ComparisonAdapter, chấm điểm mục tiêu, nhãn exact/approx
   │  ├─ bench/                 # Benchmark không trace: warmup, median, timeout
   │  └─ worker-protocol/       # Kiểu message main ⇄ worker, batching, huỷ
   │
   ├─ catalog/                  # Nguồn sự thật duy nhất về "có gì trong app"
   │  ├─ registry.ts            # Map id → lazy import module
   │  ├─ manifest.ts            # Danh sách ĐẦY ĐỦ ~60 thuật toán theo sách (chương, §, trang)
   │  ├─ chapters.ts            # 12 chương + mô tả
   │  ├─ techniques.ts          # brute-force, decrease, divide, transform, space-time, dp, greedy, ...
   │  └─ manifest.test.ts       # Test độ phủ: manifest ⇔ registry khớp 100%
   │
   ├─ problems/                 # Mỗi bài toán, độc lập kỹ thuật
   │  ├─ knapsack-01/
   │  │  ├─ definition.ts       # Zod schema Input/Output, ràng buộc, mô tả kiểu Wecode
   │  │  ├─ generators.ts       # Sinh ngẫu nhiên có seed: tiny/small/medium/large/edge
   │  │  ├─ cases.ts            # Testcase có tên: normal, edge, small, large, special, invalid
   │  │  ├─ checker.ts          # Verdict + score (giá trị đạt được, tối ưu hay không)
   │  │  ├─ adapters.ts         # Đưa output các thuật toán về dạng so sánh được
   │  │  └─ definition.test.ts
   │  ├─ shortest-path/
   │  ├─ mst/
   │  ├─ sorting/
   │  ├─ string-matching/
   │  ├─ tsp/
   │  └─ ...                    # ~25–30 bài toán
   │
   ├─ algorithms/               # Mỗi cách giải một thư mục: algorithms/<problem>/<technique>/
   │  ├─ knapsack-01/
   │  │  ├─ exhaustive/         # §3.4
   │  │  ├─ dp-table/           # §8.2
   │  │  ├─ dp-memo/            # §8.2 memory function
   │  │  ├─ branch-and-bound/   # §12.2
   │  │  └─ greedy-approx/      # §12.3
   │  │     ├─ index.ts         # Metadata: id, chương, §, trang, technique, views, traceLimit
   │  │     ├─ run.ts           # Thuật toán + lời gọi rec.step(...)
   │  │     ├─ pseudocode.ts    # Mã giả với line ID ổn định (không dùng chỉ số dòng)
   │  │     ├─ legend.ts        # Ý nghĩa màu/đánh dấu cho visualizer
   │  │     └─ run.test.ts      # Đúng kết quả + bất biến của trace
   │  ├─ shortest-path/{dijkstra, floyd, bfs}/
   │  ├─ mst/{prim, kruskal}/
   │  └─ ...
   │
   ├─ visualizers/              # ~10 view dùng chung
   │  ├─ array-bars/            # Sắp xếp, tìm kiếm
   │  ├─ graph/                 # DFS/BFS, Dijkstra, Prim/Kruskal, luồng (SVG ≤ ~300 node, Canvas khi lớn hơn)
   │  ├─ tree/                  # BST, AVL, 2-3, heap, Huffman, B-tree
   │  ├─ matrix/                # Bảng DP, Warshall/Floyd, Gauss
   │  ├─ string-align/          # Brute force, Horspool, Boyer-Moore
   │  ├─ points-2d/             # Cặp điểm gần nhất, bao lồi, TSP Euclid (Canvas)
   │  ├─ state-space-tree/      # Backtracking, branch-and-bound
   │  ├─ numeric-plot/          # Chia đôi, dây cung, Newton
   │  ├─ hash-table/            # Băm mở/đóng
   │  ├─ sequence/              # Sinh hoán vị/tập con/mã Gray, Fibonacci, Euclid
   │  └─ index.ts               # VisualKind → component (lazy)
   │
   ├─ features/                 # Tính năng UI ghép từ core + visualizers
   │  ├─ player/                # PlayerPage, PlayerControls, PseudocodePane, StepExplanation, StateInspector
   │  ├─ input-editor/          # Tab: Nhập tay / Ngẫu nhiên có seed / Testcase mẫu, sinh form từ Zod
   │  ├─ compare/               # Nhiều làn, con trỏ độc lập, bảng/biểu đồ metrics
   │  ├─ testcase-runner/       # Chạy hàng loạt, pass/fail, thời gian, xuất CSV/JSON
   │  └─ catalog/               # CatalogPage, ProblemPage, thẻ thuật toán
   │
   ├─ workers/
   │  ├─ run.worker.ts          # Chạy 1 lần có trace cho player/compare (1 worker/làn)
   │  └─ bench.worker.ts        # Chạy không trace cho testcase runner (pool)
   │
   ├─ state/                    # Zustand stores
   │  ├─ player.store.ts        # cursor, playing, speed, viewMode
   │  ├─ compare.store.ts
   │  └─ testcase.store.ts
   │
   ├─ lib/                      # Tiện ích thuần: seeded RNG, format, đo thời gian
   └─ styles/                   # Tailwind config, design tokens, màu trạng thái chung
```

**Quy ước:**
- `problems/` **không bao giờ** import từ `algorithms/`. `algorithms/` chỉ import `problems/<p>/definition`. `core/` không import cả hai thư mục này.
- ID của thuật toán gồm hai phần `<problemId>/<techniqueId>` (ví dụ `knapsack-01/dp-table`), để không bị trùng giữa các bài toán.
- Thuật toán mới được tạo bằng `pnpm new:algo knapsack-01 greedy-approx`. Script sẽ sinh đủ 5 file mẫu và đăng ký vào registry.

---

## 3. Kiến trúc

### 3.1. Các lớp và luồng dữ liệu

```text
┌─────────────────────────── UI thread ────────────────────────────┐
│ pages (app/routes) → features (player / compare / testcases)     │
│        │                    │ đọc trace qua TraceStore (seek)    │
│        ▼                    ▼                                    │
│   catalog/registry     visualizers (render VisualState + marks)  │
│        │ lazy import                                             │
└────────┼─────────────────────────────────────────────────────────┘
         │ postMessage(input, algoId, mode)   ▲ batch steps / result
┌────────▼──────────────── Worker ─────────────────────────────────┐
│ problem.validate(input) → algorithm.run(input, ctx)              │
│        ctx.rec = TraceRecorder  (player/compare)                 │
│        ctx.rec = MetricsRecorder (bench, không lưu step)         │
│ → problem.check(input, output) → Result                          │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2. Các interface cốt lõi (`src/core/contracts`)

```ts
// ---------- Problem ----------
export type SizeClass = 'tiny' | 'small' | 'medium' | 'large';
export type CaseGroup = 'normal' | 'edge' | 'small' | 'large' | 'special' | 'invalid';

export interface TestCase<I> {
  id: string; name: string; group: CaseGroup;
  input: unknown;            // raw: nhóm 'invalid' cố tình không hợp lệ
  expected?: unknown;        // đáp án biết trước (nếu có)
  note?: string;
}

export type Verdict =
  | { ok: true; optimal?: boolean; score?: number }
  | { ok: false; reason: string };

export interface Problem<I, O> {
  id: string;                         // 'knapsack-01'
  title: string;
  statement: string;                  // Mô tả kiểu Wecode (markdown)
  inputSchema: z.ZodType<I>;          // 1 nguồn: validate runtime + kiểu TS + sinh form
  outputSchema: z.ZodType<O>;
  constraints: string[];
  generate(seed: number, size: SizeClass): I;
  cases: TestCase<I>[];
  check(input: I, output: O): Verdict;
  objective?: { sense: 'min' | 'max'; score(input: I, output: O): number };
}

// ---------- Visual state & step ----------
export type VisualKind =
  | 'array-bars' | 'graph' | 'tree' | 'matrix' | 'string-align'
  | 'points-2d' | 'state-space-tree' | 'numeric-plot' | 'hash-table' | 'sequence';

export type Patch = { op: 'replace' | 'add' | 'remove'; path: (string | number)[]; value?: unknown };

export interface Step {
  seq: number;
  lineId: string;                     // khớp pseudocode.ts, ổn định khi sửa mã giả
  explain: string;                    // Giải thích bước (tiếng Việt)
  marks: Mark[];                      // highlight: { target, role: 'compare'|'swap'|'pivot'|'visited'|... }
  patches: Patch[];                   // visual state trước → sau
  inverse: Patch[];                   // sau → trước (để lùi bước)
  counters?: Partial<Record<OpName, number>>; // delta số phép toán ở bước này
  phase?: string;                     // vd 'build-table', 'backtrack' — dùng để căn các làn so sánh
}

export type OpName = 'compare' | 'swap' | 'assign' | 'visit' | 'relax' | 'prune' | 'hash' | 'recurse';

// ---------- Recorder (một API, hai cách cài đặt) ----------
export interface Recorder<V> {
  readonly tracing: boolean;
  /** Cập nhật visual state bất biến; Recorder tự sinh patch + inverse (Immer). */
  step(lineId: string, explain: string, mutate: (draft: V) => void, marks?: Mark[], phase?: string): void;
  count(op: OpName, n?: number): void; // đếm phép toán — chạy ở cả 2 chế độ
}

export interface RunContext<V> {
  rec: Recorder<V>;
  signal: AbortSignal;                // huỷ khi người dùng dừng / quá thời gian
}

// ---------- Algorithm ----------
export interface Algorithm<I, O, V> {
  id: string;                         // 'knapsack-01/dp-table'
  problemId: string;
  title: string;
  chapter: number; section: string; page?: number;   // trích dẫn sách
  technique: TechniqueId;
  exactness: 'exact' | 'approximate' | 'heuristic';
  complexity: { time: string; space: string };
  views: VisualKind[];                // view đầu tiên là mặc định; có thể chuyển view
  pseudocode: { id: string; text: string; indent: number }[];
  legend?: Legend;
  traceLimit: { maxInputSize: number; maxSteps: number; maxBytes: number };
  initVisual(input: I): V;            // visual state ban đầu (checkpoint #0)
  run(input: I, ctx: RunContext<V>): O;
}

export type RunResult<O> =
  | { status: 'ok'; output: O; verdict: Verdict; counters: Record<OpName, number>; ms: number; truncated: boolean }
  | { status: 'invalid-input'; issues: string[] }
  | { status: 'timeout' | 'cancelled' }
  | { status: 'error'; message: string };

// ---------- Visualizer ----------
export interface VisualizerProps<V> {
  state: V; marks: Mark[]; legend?: Legend;
  mode: 'detail' | 'compact';         // compact dùng trong làn so sánh
}
export type Visualizer<V> = React.ComponentType<VisualizerProps<V>>;

// ---------- So sánh ----------
export interface ComparisonAdapter<I, O, Q = unknown> {
  problemId: string;
  query?: z.ZodType<Q>;               // vd Dijkstra vs Floyd: chọn cặp (s, t)
  project(input: I, output: O, query?: Q): unknown;     // đưa về dạng chung
  metrics: { id: string; label: string; better: 'lower' | 'higher' }[];
}
```

### 3.3. Ghi trace

- **`TraceRecorder`** (dùng cho player và compare): mỗi lần gọi `rec.step(...)` sẽ chạy `mutate` qua Immer `produceWithPatches` để lấy `patches` và `inverse`. Recorder tự đánh `seq` và kiểm tra `lineId` có trong `pseudocode` hay không. Vì visual state là dữ liệu bất biến, sẽ không xảy ra lỗi "bước cũ hiển thị trạng thái cuối".
- **`MetricsRecorder`** (dùng cho bench và testcase): `step()` không làm gì cả, chỉ còn `count()` hoạt động. Nhờ vậy thời gian đo được không bị cộng thêm chi phí ghi trace.
- **Checkpoint**: lưu một bản đầy đủ của visual state sau mỗi 100 bước, hoặc sớm hơn khi tổng kích thước patch vượt khoảng 256 KB. Cách này xử lý trường hợp một bước đổi cả mảng (patch phình to).
- **Giới hạn**: khi vượt `traceLimit.maxSteps` hoặc `maxBytes`, recorder ngừng lưu bước nhưng **thuật toán vẫn chạy tới khi ra kết quả**. Khi đó kết quả có `truncated: true`, và UI gợi ý chuyển sang chế độ chỉ xem kết quả/benchmark.
- **Tua (seek)**: `TraceStore.seek(k)` tìm checkpoint gần nhất ≤ k rồi áp các patch tiếp theo. Lùi một bước thì áp `inverse`.

### 3.4. Worker

- `run.worker.ts`: **mỗi làn một worker** (player có 1 làn, compare có N làn). Các bước được gửi về UI theo **lô 500 bước hoặc mỗi 16 ms**, tùy điều kiện nào đến trước. Nhờ đó UI có thể bắt đầu phát ngay khi trace chưa ghi xong. Bấm "Dừng" thì gọi `worker.terminate()`.
- `bench.worker.ts`: một pool gồm `navigator.hardwareConcurrency - 1` worker. Mỗi testcase được chạy warmup 2 lần, đo 5 lần rồi lấy median. Mỗi lần chạy có timeout riêng (mặc định 5 s, thuật toán vét cạn được 10 s).

### 3.5. So sánh và testcase dùng lại cùng các interface

| Tính năng | Dùng lại |
|---|---|
| **Player** | `problem.inputSchema` (sinh form), `algorithm.run` + `TraceRecorder`, `visualizers[views[0]]` |
| **Compare** | Cùng một input đã qua kiểm tra, N làn `run` + `TraceRecorder`, `ComparisonAdapter` để đặt các output cạnh nhau. Mỗi làn có **con trỏ riêng**, kèm thêm 3 kiểu đồng bộ: theo % tiến độ, theo `phase`, hoặc khóa theo số bước |
| **Testcase runner** | `problem.cases` + `problem.generate`, `run` + `MetricsRecorder`, `problem.check` và `objective.score`. Với thuật toán xấp xỉ thì báo thêm tỉ lệ so với nghiệm tối ưu |

**Metrics hiển thị:** số bước (chỉ khi có trace), số phép toán theo `OpName`, thời gian median (lấy từ lần chạy không trace), giá trị mục tiêu, và nhãn exact/approx.

### 3.6. Quản lý state

- **Zustand** quản lý trạng thái phiên làm việc: vị trí bước hiện tại, đang phát hay dừng, tốc độ, view đang chọn, các làn so sánh, kết quả chạy testcase.
- **URL** giữ những gì cần chia sẻ hoặc dẫn link được: `?seed=42&size=small&case=edge-3&algos=dp-table,branch-and-bound`. Link này có thể ghi vào report hoặc video để mở lại đúng trạng thái demo.
- Trace không được đưa vào store mà nằm trong `TraceStore`, một đối tượng ngoài React. Store chỉ lưu `cursor`, để mỗi lần re-render không phải xử lý một mảng lớn.

---

## 4. Các trang và route

### 4.1. Danh sách route

| Route | Trang | Nội dung |
|---|---|---|
| `/` | **Trang chủ / Catalog** | Ô tìm kiếm, bộ lọc chương/kỹ thuật/mức độ, lưới thẻ bài toán. Có lối tắt "So sánh nổi bật": cái túi, TSP, đường đi ngắn nhất, MST, so khớp chuỗi |
| `/chapter/:n` | Catalog lọc theo chương | **Dùng chung component `CatalogPage`**, chỉ khác bộ lọc. URL đẹp để trích dẫn trong report |
| `/technique/:t` | Catalog lọc theo kỹ thuật | Như trên (`brute-force`, `dp`, `greedy`, …) |
| `/problem/:problemId` | **Trang bài toán** | Mô tả kiểu Wecode, mô hình Input/Output/ràng buộc, ví dụ, danh sách thuật toán (chương, §, độ phức tạp, exact/approx), nút "So sánh tất cả" |
| `/play/:problemId/:algoId` | **Player** (trang chính) | Xem bố cục ở 4.2 |
| `/compare/:problemId?algos=a,b,c` | **So sánh** | Cùng một input, N làn chạy cạnh nhau, bảng và biểu đồ metrics |
| `/testcases/:problemId` | **Testcase runner** | Bộ testcase theo nhóm, nút chạy tất cả, pass/fail, thời gian, xuất CSV/JSON. Có thêm benchmark theo kích thước n (biểu đồ thời gian theo n, đối chiếu với độ phức tạp lý thuyết) |
| `/about` | Giới thiệu | Cách dùng, phím tắt, nguồn trích dẫn (sách Levitin), thông tin môn học |

Thanh bên luôn hiển thị một cây điều hướng đọc từ `catalog`, có nút chuyển giữa hai cách xếp: **Theo chương** và **Theo kỹ thuật**. Trong cả hai cách, các thuật toán đều được nhóm dưới bài toán mà chúng giải.

### 4.2. Bố cục trang Player

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ TopBar: Ch.8 › §8.2 › Knapsack 0/1 › DP (bảng)   [Đổi thuật toán ▾] [So sánh] │
├───────────────┬──────────────────────────────────────┬───────────────────┤
│ INPUT         │            VISUALIZER                 │ MÃ GIẢ            │
│ [Nhập tay]    │                                       │  1 for i ← 1..n   │
│ [Ngẫu nhiên]  │   (view chính: matrix / graph / ...)  │ ▶2   for w ← 1..W │
│ [Testcase]    │                                       │  3     if w_i ≤ w │
│  seed, size   │   [view: Bảng | Cây gọi | Chi tiết]   │ ───────────────── │
│ ✔ Hợp lệ      │                                       │ GIẢI THÍCH BƯỚC   │
│ [Chạy]        │                                       │ "Xét vật 3, w=5:  │
├───────────────┤                                       │  lấy = 7+6=13 >   │
│ OUTPUT        │                                       │  bỏ = 10 → 13"    │
│ Giá trị: 37   │                                       │ ───────────────── │
│ Chọn: {1,3,4} │                                       │ STATE INSPECTOR   │
│ ✔ Tối ưu      │                                       │ i=3, w=5, F[3][5] │
├───────────────┴──────────────────────────────────────┴───────────────────┤
│ ⏮ ◀ ▶/⏸ ▶ ⏭ │ ━━━━━━●━━━━━━━━ 142/560 │ Tốc độ 1x │ phase: build-table   │
│ Metrics: compare 312 · assign 140 · bước 560         [Chú thích màu]     │
└──────────────────────────────────────────────────────────────────────────┘
```

Phím tắt: `Space` để phát/dừng, `←`/`→` để lùi/tiến một bước, `Shift+←/→` để nhảy đến phase trước/sau, `+`/`-` để đổi tốc độ.

### 4.3. Bố cục trang So sánh

```text
┌ Input chung (1 form) ─ [Chạy tất cả] ─ Đồng bộ: (•) Độc lập ( ) % tiến độ ( ) Phase ┐
├──────────────┬──────────────┬──────────────┬──────────────┐
│ Vét cạn      │ DP bảng      │ Nhánh cận    │ Greedy (≈)   │  ← mỗi làn: visualizer compact
│ [mini view]  │ [mini view]  │ [mini view]  │ [mini view]  │     + thanh tiến độ riêng
├──────────────┴──────────────┴──────────────┴──────────────┤
│ Bảng: kết quả | tối ưu? | tỉ lệ so với tối ưu | bước | phép toán | ms (median) │
│ Biểu đồ: thời gian theo n (log scale), mỗi thuật toán một đường               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Tech stack

| Thành phần | Chọn | Lý do |
|---|---|---|
| Bundler | **Vite** | Build tĩnh, dev nhanh, hỗ trợ sẵn Web Worker (`?worker`) |
| Ngôn ngữ | **TypeScript strict** | Interface chung cho ~60 module, bắt lỗi khi biên dịch |
| Router | **React Router** (declarative) | Route lồng nhau đơn giản, chạy hoàn toàn phía client |
| State | **Zustand** | Gọn nhẹ, đủ cho trạng thái phiên làm việc |
| Patch bất biến | **Immer** (`produceWithPatches`) | Tự sinh patch và patch ngược, tránh phải tự viết hàm diff cho 60 thuật toán |
| Schema | **Zod** | Một nguồn duy nhất cho validate lúc chạy, kiểu TS và sinh form nhập liệu |
| Style | **Tailwind CSS** | Giao diện đồng nhất giữa các module, không phải viết CSS riêng cho từng thuật toán |
| Đồ họa | **SVG** + **Canvas** khi dữ liệu dày; **d3-scale / d3-hierarchy / d3-force** chỉ dùng để tính layout | Tự kiểm soát việc highlight và animation |
| Biểu đồ metrics | **Recharts** hoặc visx | Đường/cột đơn giản |
| Unit test | **Vitest** | Test `run`, `check`, `generate` và các bất biến của trace |
| E2E | **Playwright** | Kiểm tra luồng input → từng bước → output, so sánh, testcase runner |
| Deploy | Static build lên **GitHub Pages / Netlify** | Cô mở link là xem được, không cần cài đặt |

---

## 6. Biên bản tranh luận: các quyết định đã chốt

| # | Vấn đề | A (Claude Code) | B (Codex) | Chốt | Lý do quyết định |
|---|---|---|---|---|---|
| 1 | Định dạng mỗi bước | Lưu toàn bộ state, chỉ dùng diff khi trace lớn | Patch trên visual state, có checkpoint | **B** (A nhượng bộ) | Một code path cho mọi kích thước input. Visual state tách khỏi state nội bộ nên không phải tự viết hàm diff cho từng loại `Set`/node |
| 2 | API ghi bước | Đối tượng `Recorder` | Callback `emit?` tùy chọn | **Gộp:** dùng `Recorder` với 2 cách cài đặt (Trace/Metrics) | Recorder của A tập trung việc đánh `seq` và kiểm tra `lineId`. Ý của B là một hàm `run` dùng cho cả hai chế độ, để không có 2 bản thuật toán lệch kết quả |
| 3 | Thư mục | `algorithms/<technique>/<problem>/` | Tách `problems/` khỏi `algorithms/<problem>/<technique>/` | **B** (A nhượng bộ) | Cách của A đặt nhánh cận và greedy vào thư mục `dp/`, tức xếp sai kỹ thuật |
| 4 | Route | Lồng nhau `/play/:p/:a`; chương/kỹ thuật chỉ là tab ở thanh bên | Có `/chapter`, `/technique`; dùng `/algorithm/:id` | **Gộp:** giữ `/play/:p/:a`, thêm `/chapter/:n` và `/technique/:t` nhưng **dùng chung một CatalogPage** | ID thuật toán dạng phẳng sẽ trùng giữa các bài toán. Route theo chương cần có để dẫn link trong report |
| 5 | Đo thời gian | Tính từ trace | Chạy riêng không trace, có warmup và lấy median | **B** (A nhượng bộ) | Nếu đo khi đang ghi trace, Floyd (khoảng V³ bước) bị cộng chi phí ghi trace và kết quả so với Dijkstra bị lệch |
| 6 | Ngữ nghĩa so sánh | Đặt N thuật toán cạnh nhau, căn theo số thứ tự bước | Bắt buộc có adapter, gắn nhãn exact/approx | **B**, thêm **con trỏ độc lập + đồng bộ theo phase** | Dijkstra trả về một vector khoảng cách, Floyd trả về một ma trận. Hai thuật toán khác nhau thì bước thứ 50 không tương đương nhau |
| 7a | Style | Tailwind | CSS Modules | **Tailwind** | Không bên nào chỉ ra lỗi cụ thể. Chọn Tailwind để làm nhanh khi làm một mình |
| 7b | Schema | JSONSchema | Zod | **Zod** (A nhượng bộ) | Nếu dùng JSONSchema thì phải tự đồng bộ kiểu TS với schema, dễ lệch nhau |
| 7c | Đồ họa | Chỉ SVG | SVG + Canvas | **SVG + Canvas** | Testcase lớn với hàng nghìn node SVG sẽ làm DOM giật |
| 7d | E2E | Không có | Playwright | **Có** | Unit test không bắt được lỗi tích hợp giữa player, worker và UI |
| 8 | Kiểm soát độ phủ | Script sinh khung + lint interface | Test so manifest với registry | **Cả hai** | Hai cái bắt hai loại lỗi khác nhau: thiếu đăng ký và đăng ký sai cấu trúc |

**Các lỗi được phát hiện khi phản biện và đã sửa trong bản này:**
- Kiểu `line?: number` và `line: number` không khớp, và đánh dấu dòng mã giả bằng chỉ số sẽ hỏng khi sửa mã giả → đổi sang **`lineId` ổn định**.
- Chưa rõ có clone state ở mỗi bước hay không → dùng **Immer**, nên visual state luôn bất biến.
- `Result` thiếu đường xử lý lỗi → đổi thành **`RunResult` dạng union**: `ok | invalid-input | timeout | cancelled | error`.
- Worker chưa có cơ chế batching và timeout → **gửi theo lô 500 bước hoặc 16 ms**, có **timeout riêng cho mỗi lần chạy** và **AbortSignal**.
- Một bước đổi cả mảng làm patch phình to → **checkpoint theo cả số bước lẫn dung lượng**.
- Đề xuất B còn thiếu các phần mà A đã có → bổ sung lại **State inspector**, **xuất CSV** và nhóm testcase **invalid**.

---

## 7. Thứ tự xây dựng (phương án chống vỡ phạm vi)

| Giai đoạn | Việc cần làm | Điều kiện hoàn thành |
|---|---|---|
| **0. Nền** | Vite + TS + Router + Tailwind; `core/contracts`, `TraceRecorder`/`MetricsRecorder`, `TraceStore`, worker protocol; AppShell | Unit test cho TraceStore: tua tới, lùi lại và áp patch ngược đều đúng |
| **1. Lát dọc đầu tiên** | **Cái túi 0/1** đủ 5 cách giải + 2 view (matrix, state-space-tree) + player + compare + testcase runner + bộ testcase đủ 6 nhóm | **Riêng giai đoạn này đã đủ để nộp bài** theo đúng đề |
| **2. Hoàn thiện visualizer** | Các view còn lại: array-bars, graph, tree, string-align, points-2d, numeric-plot, hash-table, sequence | Mỗi view có ít nhất 1 thuật toán dùng |
| **3. Các nhóm so sánh** | Sắp xếp, đường đi ngắn nhất, MST, so khớp chuỗi, TSP, tô màu đồ thị (tự thiết kế) | Mỗi nhóm có adapter và testcase |
| **4. Phủ toàn bộ catalog** | Các thuật toán còn lại theo manifest | `manifest.test.ts` đạt 100% |
| **5. Đánh bóng** | Phím tắt, link chia sẻ trạng thái, benchmark theo n, deploy | Playwright chạy qua được các luồng chính |

---

## 8. Rủi ro chính

| Rủi ro | Biện pháp giảm thiểu |
|---|---|
| Ôm 60 thuật toán làm loãng chiều sâu mà đề yêu cầu | Lát dọc cái túi phải hoàn chỉnh trước tiên; report tập trung vào 1 bài toán, còn catalog đưa vào phần "phát triển mở rộng" |
| So sánh gây hiểu sai | Bắt buộc có `ComparisonAdapter`, gắn nhãn exact/approx, tính tỉ lệ so với nghiệm tối ưu |
| Trace chiếm quá nhiều bộ nhớ (vét cạn, nhánh cận) | `traceLimit` riêng cho từng thuật toán, giới hạn theo số bước và dung lượng, có checkpoint, có thể hủy worker |
| 10 view không đủ diễn tả các đặc thù (n-Hậu khác nhánh cận) | Tùy biến qua `legend` và `marks` trong dữ liệu. Chỉ tách view mới khi thật sự cần |
| Các module dần lệch khỏi interface chung | Script sinh khung, TS strict, test manifest, test bất biến trace cho từng thuật toán |

---

## Câu hỏi còn mở

- Hạn nộp thực tế là khi nào? Câu trả lời quyết định dừng ở giai đoạn 1, 3 hay đi hết giai đoạn 4.
- Bài toán chính để viết report sẽ là **cái túi 0/1** (nhiều cách giải nhất) hay **tô màu đồ thị** (đúng bài cô nhắc tới)? Tài liệu này đang lấy cái túi làm ví dụ, nhưng kiến trúc dùng được cho cả hai.
