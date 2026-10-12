# Thêm một bài toán / thuật toán mới

Tài liệu này dành cho người thêm nội dung vào catalog sau Phase F (nền tảng). Đọc trước
`../../docs/kien-truc-ung-dung-demo.md` để hiểu kiến trúc tổng thể.

## 0. Quy ước đăng ký (không cần sửa file chung)

`src/catalog/registry.ts` dùng `import.meta.glob` để tự tìm:

- `src/problems/*/index.ts` → phải export `problem: Problem<Input,Output>`.
- `src/algorithms/*/*/index.ts` → phải export `algorithm: Algorithm<Input,Output,VisualState>`.

Chỉ cần tạo đúng thư mục/tên file là module được đăng ký tự động — **không** phải sửa
`registry.ts`. File chung duy nhất bạn cần sửa là `src/catalog/manifest.ts` (đổi dòng của
đúng bài toán/thuật toán bạn làm từ `status:'planned'` sang `status:'ready'`, và điền đúng
`page` nếu biết). Không sửa dòng của người khác.

## 1. Scaffold bằng script

```bash
npm run new:problem <problemId>
npm run new:algo <problemId> <techniqueId>
```

(`--` cũng được chấp nhận nhưng không bắt buộc.) Lệnh sinh đủ khung file rỗng đã qua
`typecheck`/`lint`; bạn điền phần TODO.

## 2. Một bài toán (`src/problems/<id>/`)

| File | Nội dung |
|---|---|
| `definition.ts` | Zod `inputSchema`/`outputSchema`, `statement` (mô tả kiểu Wecode, tiếng Việt), `constraints` |
| `generators.ts` | `generate(seed, size)` — sinh dữ liệu có seed cho 4 cỡ `tiny/small/medium/large` |
| `cases.ts` | `TestCase[]` có tên, phủ đủ nhóm `normal/edge/small/large/special` và `invalid` nếu input có ràng buộc hợp lệ |
| `checker.ts` | `check(input, output): Verdict` — chấm đúng/sai, và `optimal`/`score` nếu có khái niệm tối ưu |
| `index.ts` | Lắp `problem: Problem<Input,Output>`; thêm `objective: {sense, score}` nếu bài toán có mục tiêu số (để trang So sánh hiện cột "Giá trị" không cần code riêng) |
| `definition.test.ts` | Test schema + ít nhất một case tay |
| `ui.tsx` *(tuỳ chọn)* | Xem mục 4 |
| `adapters.ts` *(bắt buộc khi có ≥ 2 thuật toán)* | `ComparisonAdapter` đưa các output về cùng dạng. Có thể khai báo `query` bằng Zod để chọn tham số chung (ví dụ cặp (s,t) cho Dijkstra vs Floyd) |

Quy tắc: **`problems/` không bao giờ import từ `algorithms/`**.

## 3. Một thuật toán (`src/algorithms/<problemId>/<techniqueId>/`)

| File | Nội dung |
|---|---|
| `run.ts` | `initVisual(input): VisualState` + `run(input, ctx): Output`. Một hàm `run` duy nhất dùng cả khi có trace (`TraceRecorder`) và khi đo hiệu năng (`MetricsRecorder`) — không viết hai bản. Mọi thay đổi trạng thái hiển thị đi qua `rec.step(lineId, explainTiếngViệt, mutate, marks?, phase?)`; mọi phép toán đáng đếm gọi `rec.count(opName)` |
| `pseudocode.ts` | Mảng `{id, text, indent}` — `id` **ổn định**, không phải số dòng (để sửa mã giả không làm hỏng test tham chiếu `lineId`) |
| `legend.ts` | `Legend` (map vai trò đánh dấu → chú thích) — có thể để `{}` nếu không cần |
| `index.ts` | Lắp `algorithm: Algorithm<Input,Output,VisualState>` — `id` **phải** là `"<problemId>/<techniqueId>"` |
| `run.test.ts` | Bắt buộc: (a) đúng kết quả trên seed ngẫu nhiên, đối chiếu vét cạn hoặc thuật toán đã tin cậy; (b) trace tua lại đúng bằng `TraceStore` (`seek` tới cuối phải khớp `output`); (c) ít nhất một test kiểm nội dung `explain` của một bước |

`VisualState` của riêng thuật toán này — không cần khớp với thuật toán khác cùng bài toán.
Nó chỉ cần khớp cấu trúc với *props* mà các `views` đã khai báo yêu cầu (xem mục 5).

## 4. Input editor / output renderer tuỳ biến (tuỳ chọn)

Mặc định Player/Compare dùng JSON editor (`src/features/input-editor/InputEditor.tsx`) và
JSON + verdict (`src/features/player/OutputPanel.tsx`). Nếu bài toán cần giao diện riêng
(bảng nhập điểm, đồ thị, hai chuỗi…), tạo `src/problems/<id>/ui.tsx` export một hoặc nhiều:

```ts
export function InputEditor({input, onChange, disabled}: InputEditorProps) { ... }
export function OutputRenderer({input, output, verdict, truncated}: OutputRendererProps) { ... }
export function StateInspector({state, step}: StateInspectorProps) { ... } // panel "Trạng thái" ở Player
```

(Kiểu import từ `src/catalog/ui-registry.ts`.) File này **không được import bởi worker** —
chỉ Player/Compare (UI thread) tải nó qua `loadProblemUi`. Không khai báo các component này
trực tiếp trên object `Problem` trong `definition.ts`/`index.ts`, vì `problem` còn được chạy
trong Web Worker (không có DOM) — xem `src/problems/knapsack-01/ui.tsx` làm ví dụ.

## 5. Chọn `views` (visualizer)

Khai báo trong `algorithm.views: VisualKind[]` (phần tử đầu là view mặc định). Mỗi kind có
props riêng — đọc file tương ứng trong `src/visualizers/<kind>/index.tsx` (mỗi file có
TSDoc mô tả state tối thiểu) và `fixture.ts` cùng thư mục để xem ví dụ dữ liệu hợp lệ:

| kind | Dùng cho |
|---|---|
| `array-bars` | mảng số — sắp xếp, tìm kiếm, chọn phần tử thứ k |
| `graph` | đồ thị có/không hướng — DFS/BFS, Dijkstra, Prim/Kruskal, luồng |
| `tree` | cây tổng quát — BST/AVL/2-3/B-tree/heap/Huffman/cây đệ quy |
| `state-space-tree` | cây duyệt vét cạn/nhánh cận/quay lui |
| `matrix` | bảng DP, Warshall/Floyd, khử Gauss |
| `string-align` | so khớp chuỗi (vét cạn, Horspool, Boyer–Moore) |
| `points-2d` | điểm 2D — cặp gần nhất, bao lồi, TSP Euclid |
| `numeric-plot` | đồ thị hàm số — chia đôi, dây cung, Newton |
| `hash-table` | bảng băm (danh sách liên kết / dò tuyến tính) |
| `sequence` | dãy sinh dần — hoán vị, Fibonacci, Euclid, Josephus |
| `board` | lưới n×n — n quân hậu, ma trận phân công, gom đồng xu |
| `items` | danh sách đối tượng rời rạc có trạng thái (hiện chỉ dùng cho cái túi) |

Registry xoá kiểu (`unknown`) ở biên nên `Visualizer` (`src/visualizers/index.tsx`) ép kiểu
state của bạn sang đúng kiểu của `kind` đã chọn — nghĩa vụ của bạn là đảm bảo `VisualState`
thật sự có các trường mà component đó đọc (đọc kỹ phần props ở đầu file component).

## 6. Gate trước khi coi là "ready"

Từ `source-code/`:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Sau đó đổi dòng tương ứng trong `src/catalog/manifest.ts` sang `status:'ready'` và thêm một
test coverage sẽ tự xác nhận (chạy `npm run test`, xem `src/catalog/manifest.test.ts`).
Không bao giờ làm yếu, bỏ qua, hoặc xoá test đã có — kể cả test của người khác.

Nếu bạn thêm e2e riêng, đặt ở `e2e/catalog-<nhóm>.spec.ts` và giữ các spec hiện có nguyên vẹn.
