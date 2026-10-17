# Kế hoạch: nâng cấp bài Tô màu đồ thị

Status: ready · Owner: claude_code (implement) · Reviewer: codex (cross-review)
Worktree: `HomeWork-worktrees/graph-coloring-upgrade`, nhánh `feat/graph-coloring-upgrade` (tách từ `main` 9bfb2dc)

## Bối cảnh

Tô màu đồ thị (bài Sở thú) là bài trọng tâm của report. Hiện trạng đã xác minh trong code:
- **Phiên bản bài toán:** app chỉ giải bài toán quyết định k màu, `{nodes ≤ 10, edges ≤ 100, colors k}` (`src/problems/graph-coloring/definition.ts`).
- **Thuật toán chính xác:**
  - Quay lui và vét cạn chỉ trả lời câu hỏi "có tô được bằng k màu không".
  - Vét cạn giới hạn n ≤ 6 và kⁿ ≤ 200.000; vượt giới hạn thì báo lỗi `error`, không phải "Không áp dụng".
- **Testcase:** `testcases/graph-coloring/` có 10 file, ca lớn nhất 7 đỉnh, tất cả đều `expected: null`.
- **Đồ thị vương miện:** đã có trong unit test (`review-regressions.test.ts`), nhưng chưa có trong testcase.

Năm thuật toán đang có: greedy, welsh-powell, dsatur, backtracking, exhaustive. Không thêm thuật toán mới.

## Yêu cầu

### 1. Chế độ tìm sắc số χ(G)

- Thêm vào input một tham số chế độ: `"k-coloring"` (mặc định, giữ nguyên hành vi hiện tại) hoặc `"chromatic"`.
  - Mọi testcase cũ và link cũ phải chạy y như trước.
- **Ở chế độ `chromatic`:**
  - **Ba heuristic:** chạy không giới hạn số màu và báo số màu đã dùng. Đây là chặn trên của χ, không tuyên bố tối ưu.
  - **Quay lui:** tìm χ(G) bằng cách thử k tăng dần, hoặc tìm kiếm có chặn dưới/chặn trên. Trace phải cho thấy:
    - chặn dưới, ví dụ một clique tìm được;
    - chặn trên, ví dụ kết quả của DSATUR;
    - từng giá trị k đang thử, kèm kết quả.
  - **Vét cạn:** tìm χ(G) cho đồ thị nhỏ, trong giới hạn an toàn.
  - **Output:** có thêm số màu đã dùng, và với thuật toán chính xác thì có cờ cho biết đó là χ(G).
- **Checker ở chế độ `chromatic`:**
  - kiểm tra cách tô có hợp lệ không;
  - với thuật toán chính xác, xác nhận số màu đúng bằng χ(G) bằng oracle độc lập. Có thể dùng lại `existsColoring` (liệt kê phân hoạch), nhưng không được dùng chính thuật toán đang kiểm.
  - với heuristic, ghi "tối ưu" khi số màu bằng χ(G) đã biết (đồ thị nhỏ), ngược lại ghi "không bảo đảm".
- **Trang So sánh:** ở chế độ `chromatic` có thêm chỉ số "Số màu" (càng thấp càng tốt).
- **Player:** có lời giải thích bằng tiếng Việt cho chặn dưới, chặn trên và từng giá trị k.

### 2. Đồ thị lớn cho heuristic

- Nâng giới hạn input để ba heuristic chạy được trên đồ thị khoảng 300 đỉnh, với số cạnh tương ứng.
  - Đồ thị lớn hiển thị bằng Canvas qua cơ chế sẵn có khi có hơn 300 phần tử. Kiểm tra cơ chế này vẫn chạy đúng.
  - Trace dài phải bị cắt theo cơ chế giới hạn trace sẵn có, không làm treo trình duyệt.
- **Quay lui và vét cạn:**
  - Mỗi thuật toán có giới hạn kích thước an toàn riêng, do người làm chọn và ghi rõ trong báo cáo.
  - Vượt giới hạn thì phải hiện **"Không áp dụng"** bằng tiếng Việt, khai báo qua `precondition`, không được báo `error`. Ví dụ: "Vét cạn chỉ chạy được tới n ≤ … đỉnh".
- **Bộ sinh đồ thị ngẫu nhiên** trong trình nhập liệu:
  - theo seed, với tham số n và xác suất cạnh p;
  - có sẵn các mẫu đồ thị: vương miện, đầy đủ Kₙ, chu trình chẵn/lẻ, hai phía, Petersen, Grötzsch/Mycielski.

### 3. Bộ testcase

- Giữ nguyên 10 file cũ.
- **Thêm testcase có kết quả kỳ vọng thật** (`expected` khác `null`) cho các đồ thị đã biết χ:
  - đồ thị vương miện, với thứ tự đỉnh xen kẽ để greedy dùng n/2 màu trong khi χ = 2;
  - đồ thị đầy đủ Kₙ (χ = n);
  - chu trình lẻ (χ = 3) và chu trình chẵn (χ = 2);
  - đồ thị hai phía;
  - đồ thị Petersen (χ = 3);
  - đồ thị Grötzsch (χ = 4, không có tam giác);
  - đồ thị rỗng.
- **Thêm ca lớn sinh theo seed** (ví dụ 100, 200, 300 đỉnh) cho heuristic. Ca nào không biết trước χ thì để checker xác nhận tính hợp lệ.
- **Đủ 6 nhóm:** thường, biên, nhỏ, lớn, đặc biệt, không hợp lệ. Có thêm ca không hợp lệ cho chế độ mới.
- Xuất bằng lệnh export sẵn có ra `testcases/graph-coloring/`, và cập nhật README nếu bảng đếm thay đổi.

## Ràng buộc

- Code dễ đọc, mỗi lệnh một dòng. Tuân theo `source-code/docs/adding-an-algorithm.md`.
- Không định dạng lại file dùng chung, ví dụ `manifest.ts`. Chỉ sửa đúng các dòng cần thiết.
- Test so với lời giải tham chiếu độc lập. Có test hồi quy cho từng phần mới. Không xoá, bỏ qua hay nới lỏng test có sẵn.
- Giao diện vẫn shadcn/ui, nền sáng, chỉ trắng đen và xám. Toàn bộ chữ bằng tiếng Việt.
- Không sửa `docs/dan-y-report.md`. File này thuộc PR khác.
- **Commit:** không ký, dùng `git -c commit.gpgsign=false commit …`, vì chữ ký qua 1Password làm agent bị treo. Không thêm trailer Co-authored-by hay ghi công AI.
- **E2e:** chạy trên cổng riêng `PLAYWRIGHT_PORT=5276`. Phải chạy trực tiếp và chờ tới khi xong, không cho chạy nền.

## Các bước kiểm tra phải pass (trong `source-code/`)

`npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run e2e` (gồm cả e2e đi qua mọi trang).

Báo cáo đúng các lệnh đã chạy, số test case thu được và kết quả.

## Khi xong

Push nhánh, không force-push, rồi mở PR vào `main` bằng `gh pr create`. Mô tả PR ghi rõ:
- đã thay đổi gì;
- các giới hạn kích thước đã chọn và lý do;
- đã kiểm chứng thế nào.
