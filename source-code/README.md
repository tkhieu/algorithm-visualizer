# Trực quan hóa cái túi 0/1

Ứng dụng frontend Vite + React + TypeScript cho môn CS112. Giao diện tiếng Việt, tông đen trắng, năm thuật toán theo Levitin.

## Chạy

```bash
npm ci
npm run dev
```

Mở http://127.0.0.1:5173. Kiểm tra bằng `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `npm run e2e`. Xuất dữ liệu bằng `npm run export:testcases`.

## Kiến trúc

`src/problems/knapsack-01` định nghĩa input, output, bộ sinh, testcase và bộ chấm. `src/algorithms/knapsack-01` có năm cách giải cùng interface `Recorder`; `MetricsRecorder` chỉ đếm phép toán, `TraceRecorder` tạo patch Immer. `TraceStore` lưu checkpoint và tua bước. Worker chạy trace theo lô và benchmark riêng với warmup, trung vị. `src/visualizers` chứa bảng, cây trạng thái và danh sách vật; `src/features` ghép các route player, compare và testcase. URL chứa seed/size/case/algos để chia sẻ phiên.

Giới hạn: vét cạn tăng theo 2ⁿ; worker tự dừng sau 10 giây, các thuật toán khác sau 5 giây. Trace có thể bị rút gọn nhưng kết quả vẫn được tính. Cây chỉ vẽ một phần khi số nút lớn; bảng hiển thị cửa sổ cột gần ô hiện tại.
