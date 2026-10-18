# Algorithm Visualizer — Bài tập lớn CS112

Ứng dụng web minh họa **từng bước** các thuật toán trong sách *Introduction to the Design and Analysis of Algorithms* (Levitin, 3rd Ed.). Đây là bài tập lớn môn **CS112 – Phân tích và Thiết kế Thuật toán**, UIT.

**Demo đang chạy:** https://algorithm-visualizer.hieutk.dev

Người dùng nhập Input, theo dõi thuật toán chạy qua từng step (pseudocode được highlight, kèm lời giải thích bằng tiếng Việt), rồi xem Output và kết quả chấm đúng/sai.

## Bài toán trọng tâm: Graph Coloring (bài Sở thú)

Report, video và slide tập trung vào bài **Graph Coloring**, với 5 cách giải:

| Thuật toán | Loại | Ghi chú |
|---|---|---|
| Greedy | heuristic | Tô theo thứ tự vertex đã cho |
| Welsh–Powell | heuristic | Sắp vertex theo degree giảm dần rồi tô greedy |
| DSATUR | heuristic | Chọn vertex có saturation lớn nhất (không có trong sách Levitin) |
| Backtracking | exact | Có state-space tree, pruning khi xung đột màu |
| Exhaustive search | exact | Duyệt các cách gán màu theo thứ tự, dừng ở nghiệm hợp lệ đầu tiên; worst case là kⁿ cách gán |

Hai chế độ:
- **k-coloring:** có tô được graph bằng k màu hay không. Thuật toán exact trả lời chắc chắn có hoặc không; heuristic nếu không tô được thì chỉ báo "chưa tìm được", không chứng minh là vô nghiệm.
- **Chromatic number χ(G):** tìm số màu ít nhất. Backtracking và exhaustive search cho χ(G) chính xác; backtracking dùng lower bound từ một clique và upper bound từ DSATUR để thu hẹp khoảng thử. Heuristic chỉ cho một upper bound, ví dụ greedy dùng 3 màu trên crown graph có χ = 2.

Phần mở rộng: app còn có catalog **47 bài toán / 126 cách giải**, phần lớn theo sách Levitin, dùng chung cùng một Player, trang So sánh và trang Testcase.

## Tính năng chính

- **Player:** chạy từng step, tua tới/lui, đổi tốc độ, phím tắt; highlight pseudocode, panel giải thích và panel trạng thái; các view Graph và State-space tree.
- **Input:** chỉnh JSON trực tiếp, chọn testcase có sẵn, chọn graph mẫu (crown, Kₙ, cycle, bipartite, Petersen, Grötzsch) hoặc sinh graph ngẫu nhiên theo seed.
- **So sánh (Compare):** chạy nhiều thuật toán trên cùng input, so số step, số phép toán, số màu và thời gian chạy; có biểu đồ benchmark theo n.
- **Testcase:** chạy toàn bộ bộ testcase của một bài toán, báo đạt/không đạt/không áp dụng, xuất CSV/JSON.
- Giao diện tiếng Việt, tông trắng đen (shadcn/ui).

## Chạy local

Yêu cầu: Node.js (đã kiểm tra với Node 24) và npm.

```bash
cd source-code
npm ci
npm run dev
```

Mở http://127.0.0.1:5173.

Các lệnh kiểm tra, chạy trong `source-code/`:

| Lệnh | Việc |
|---|---|
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm run lint` | ESLint, không cho phép warning |
| `npm run test` | Unit test (Vitest) |
| `npm run e2e` | E2E test (Playwright) |
| `npm run build` | Build production vào `dist/` |
| `npm run export:testcases` | Xuất lại bộ testcase ra `testcases/` |

## Deploy

App được host trên **Cloudflare Pages** (project `algorithm-visualizer`, nhánh production `main`). Chạy trong `source-code/`, từ `main` mới nhất:

```bash
npm ci
npm run build && wrangler pages deploy dist --project-name algorithm-visualizer --branch main
```

App nằm ở gốc domain nên dùng `npm run build` thường, không dùng `build:pages`. Sau khi deploy, kiểm tra trang chủ, một link sâu (ví dụ `/play/graph-coloring/dsatur`) và một trang So sánh trên domain chính thức.

## Cấu trúc repo

```
.
├── source-code/     # App Vite + React + TypeScript
├── testcases/       # Bộ testcase nộp bài, mỗi bài toán một thư mục (xem testcases/README.md)
├── docs/            # Đề bài, report, kịch bản video, kiến trúc
├── presentation/    # Bộ slide dùng khi quay video (pptx, pdf và script sinh slide)
├── plans/           # Kế hoạch và báo cáo theo từng giai đoạn
└── AGENTS.md        # Ghi chú cho agent: domain, deploy, quy ước sửa code
```

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/de-bai-bai-tap-lon.md](docs/de-bai-bai-tap-lon.md) | Đề bài, yêu cầu nộp bài, tiêu chí chấm |
| [docs/bao-cao.md](docs/bao-cao.md) | Bản nháp report (Markdown) |
| [docs/kich-ban-video.md](docs/kich-ban-video.md) | Kịch bản quay video demo |
| [docs/kich-ban-thuyet-trinh.md](docs/kich-ban-thuyet-trinh.md) | Lời đọc và thao tác cho từng slide |
| [docs/kien-truc-ung-dung-demo.md](docs/kien-truc-ung-dung-demo.md) | Kiến trúc ứng dụng |
| [docs/levitin-thuat-toan-co-the-demo.md](docs/levitin-thuat-toan-co-the-demo.md) | Danh sách thuật toán trong sách có thể demo |
| [source-code/docs/adding-an-algorithm.md](source-code/docs/adding-an-algorithm.md) | Cách thêm bài toán hoặc thuật toán mới |

Bộ slide: mở `presentation/algorithm-visualizer-video.pptx`. Nếu sửa nội dung slide, sửa trong `presentation/generate.mjs` rồi chạy `npm ci && node generate.mjs` trong `presentation/`.

## Kiểm thử

- Mỗi thuật toán có unit test. Mức kiểm tra khác nhau theo từng thuật toán: có test chỉ dùng bộ chấm (`checker`) để xác nhận output hợp lệ và so với các ví dụ cố định; có test so kết quả với một lời giải tham chiếu độc lập. Ví dụ với Graph Coloring, backtracking được so với oracle `existsColoring`, còn greedy và DSATUR được kiểm bằng bộ chấm và ví dụ cố định.
- E2E test tự mở mọi trang Player và Testcase trong catalog, cùng trang So sánh của mọi bài toán có từ hai cách giải trở lên. Trang Player và So sánh chạy với input mặc định; trang Testcase chạy toàn bộ bộ testcase của bài toán. Mọi trang đều được kiểm tra có kết quả và không có lỗi console.
- Bộ testcase chia 6 nhóm dùng chung: `normal`, `edge`, `small`, `large`, `special`, `invalid`. Chi tiết trong [testcases/README.md](testcases/README.md).

## Quá trình phát triển

Code được viết bằng AI coding agent (Claude Code và Codex). Mỗi thay đổi đi qua một pull request vào `main`, được agent của hãng còn lại review chéo trước khi merge. Quá trình này, cùng những lỗi AI gây ra và cách phát hiện, được kể chi tiết trong chương 5 của [report](docs/bao-cao.md).
