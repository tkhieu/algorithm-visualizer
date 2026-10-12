# Catalog thuật toán Levitin

Ứng dụng frontend Vite + React + TypeScript cho môn CS112. Giao diện tiếng Việt, tông đen trắng.
Nền tảng (Phase F) hỗ trợ đăng ký bài toán/thuật toán theo quy ước (không sửa file chung khi
thêm mới — xem `docs/adding-an-algorithm.md`); hiện bài toán cái túi 0/1 đã triển khai đầy đủ
năm cách giải, các bài toán còn lại trong catalog ở trạng thái "sắp có" (`/problems`, `/algorithms`).

## Chạy

```bash
npm ci
npm run dev
```

Mở http://127.0.0.1:5173. Kiểm tra bằng `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `npm run e2e`. Xuất dữ liệu bằng `npm run export:testcases`. Thêm bài toán/thuật toán mới bằng `npm run new:problem <id>` / `npm run new:algo <problemId> <techniqueId>` (xem `docs/adding-an-algorithm.md`).

## Deploy GitHub Pages

Thay `ten-repo` bằng tên repository GitHub rồi chạy trong `source-code/`:

```bash
VITE_BASE=/ten-repo/ npm run build:pages
npm run preview:pages
```

`build:pages` tạo `dist/404.html` để mở trực tiếp các URL con và `dist/.nojekyll`. Đẩy **nội dung** của `dist/` lên thư mục gốc của nhánh `gh-pages` (không commit `dist/` vào nhánh mã nguồn). Trong cài đặt GitHub Pages, chọn nguồn **Deploy from a branch**, nhánh `gh-pages`, thư mục `/ (root)`. Trang sẽ ở `https://<user>.github.io/ten-repo/`; các URL chia sẻ giữ tiền tố `/ten-repo/`. Không cần GitHub Actions.

## Kiến trúc

`src/catalog/registry.ts` dùng `import.meta.glob` để tự phát hiện mọi `src/problems/*/index.ts` và
`src/algorithms/*/*/index.ts` — thêm thư mục đúng quy ước là đủ, không sửa registry. `src/catalog/manifest.ts`
là danh sách đầy đủ theo sách (mỗi dòng có `status: 'ready' | 'planned'`). `src/problems/knapsack-01` định
nghĩa input, output, bộ sinh, testcase và bộ chấm; `src/algorithms/knapsack-01` có năm cách giải cùng
interface `Recorder` (`MetricsRecorder` chỉ đếm phép toán, `TraceRecorder` tạo patch Immer). `TraceStore`
lưu checkpoint và tua bước. Worker chạy trace theo lô và benchmark riêng với warmup, trung vị. `src/visualizers`
chứa ~12 view dùng chung (bảng, cây, đồ thị, mảng cột, so khớp chuỗi, điểm 2D, đồ thị hàm số, bảng băm, dãy,
lưới, danh sách vật, cây trạng thái); `src/features` ghép các trang Player/Compare/Testcase/Problem dùng
chung cho mọi bài toán đã đăng ký, với input editor và output renderer có thể tuỳ biến theo bài toán
(`src/problems/<id>/ui.tsx`, tuỳ chọn) hoặc rơi về JSON mặc định. URL chứa seed/size/case/algos để chia sẻ
phiên. Thanh bên có ba cách xếp (theo chương/kỹ thuật/bài toán) và bảng lệnh `Ctrl+K`/`/`. Xem
`docs/adding-an-algorithm.md` để thêm nội dung mới.

Giới hạn: vét cạn tăng theo 2ⁿ; worker tự dừng sau 10 giây, các thuật toán khác sau 5 giây. Trace có thể bị rút gọn nhưng kết quả vẫn được tính. Cây chỉ vẽ một phần khi số nút lớn; bảng hiển thị cửa sổ cột gần ô hiện tại.
