# AGENTS.md

Ghi chú cho các agent làm việc trong repo này (bài tập lớn CS112 – app minh họa thuật toán).

## Demo đang chạy

- **Domain chính thức:** https://algorithm-visualizer.hieutk.dev
  Dùng domain này trong report, video demo và link nộp bài.
- Domain dự phòng do Cloudflare tự sinh: https://algorithm-visualizer-d5j.pages.dev
  (cùng một bản deploy; không đưa domain này vào tài liệu nộp bài).
- Hosting: Cloudflare Pages, project `algorithm-visualizer`, nhánh production `main`.
  App nằm ở gốc domain (`/`), nên build bằng `npm run build` thường, không dùng `build:pages`.

## Deploy lại

Chạy trong `source-code/`, từ `main` mới nhất:

```bash
npm ci
npm run build && wrangler pages deploy dist --project-name algorithm-visualizer --branch main
```

Sau khi deploy, kiểm tra trực tiếp trên `https://algorithm-visualizer.hieutk.dev`:
trang chủ, một link sâu (ví dụ `/play/graph-coloring/dsatur`) và một trang So sánh.

## Cấu trúc repo

- `source-code/` – app Vite + React + TypeScript (shadcn/ui, tông trắng đen).
- `testcases/` – bộ testcase nộp bài, mỗi bài toán một thư mục, mô tả trong `testcases/README.md`.
- `docs/` – đề bài, danh sách thuật toán Levitin, kiến trúc ứng dụng.
- `plans/` – kế hoạch và báo cáo theo từng giai đoạn.

## Quy ước khi sửa code

Xem `source-code/docs/adding-an-algorithm.md` và kiến trúc tại `docs/kien-truc-ung-dung-demo.md`. Tóm tắt:

- Code phải dễ đọc: mỗi lệnh một dòng, không viết dồn thành một dòng dài.
- Test thuật toán phải so với lời giải tham chiếu độc lập, không viết lại chính thuật toán đó.
- Không định dạng lại file dùng chung (ví dụ `manifest.ts`); chỉ sửa đúng các dòng cần thiết.
- Mọi thay đổi đi qua PR vào `main`; không force-push.
