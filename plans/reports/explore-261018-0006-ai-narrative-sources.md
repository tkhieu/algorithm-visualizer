# Tư liệu cho Chương 5: tường thuật quá trình xây dựng và dùng AI

Nguồn của báo cáo này:
- Claude Code điều tra ở chế độ chỉ đọc ngày 18/10/2026.
- Lịch sử điều phối của orchestrator: các lượt giao việc, các vòng review và các lần người dùng duyệt.

Phần tô màu đã được đối chiếu với kết quả điều tra code của Codex.

## Dòng thời gian 8 PR

Cả 8 PR được hoàn thành trong khoảng 22 giờ, từ 11/10 13:25 đến 12/10 11:26 (giờ UTC).

| PR | Nội dung | Merge commit | Ngày merge (UTC) | Review |
|---|---|---|---|---|
| #1 | Cái túi 0/1 + chạy dưới đường dẫn con cho GitHub Pages | 38d1641 | 11/10 13:25 | Codex làm, Claude review. Lượt đầu FAIL vì lỗi nhánh cận, sau đó PASS |
| #2 | Nền tảng catalog + navigation | 2bd17b8 | 12/10 03:08 | Claude bắt đầu làm nhưng hết phiên đăng nhập, Codex làm nốt, Claude review PASS |
| #3 | B3: đồ thị (10 bài, 20 cách giải) | 90596fd | 12/10 04:33 | Lượt đầu FAIL vì code viết dồn một dòng, sau đó PASS |
| #4 | B1: số học, tìm kiếm (14 bài, 35 cách giải) | 3ea6e71 | 12/10 07:13 | FAIL vì test so với chính thuật toán, sau đó PASS, rồi review thêm phần gỡ xung đột |
| #5 | B2: sắp xếp, heap, cây, băm | 2d48291 | 12/10 07:22 | Codex review, FAIL 5 lỗi, sau đó PASS, rồi review thêm phần gỡ xung đột |
| #6 | B4: chuỗi, hình học, quy hoạch động, quy hoạch tuyến tính | c97dd11 | 12/10 07:26 | FAIL 9 lỗi, Codex sửa (f0c941c), Claude review PASS |
| #7 | B5: TSP, phân công, n-hậu, Hamilton, tổng tập con, **tô màu**, nhân chuỗi ma trận, LCS | 423c849 | 12/10 07:48 | FAIL 8 lỗi, Codex sửa (4b83502), PASS, rồi review thêm phần gỡ xung đột |
| #8 | Tích hợp: kiểm tra độ phủ, e2e đi qua mọi trang, xuất testcase | 9bfb2dc | 12/10 11:26 | Codex review 6 vòng; lỗi của trang So sánh chỉ hết hẳn ở commit e3908f8 |

## Nơi còn lưu prompt gốc

- **`~/.claude/projects/-home-hieu-...-HomeWork/*.jsonl`:** có 15 file log phiên. Tin nhắn `user` đầu tiên của mỗi file là prompt giao việc, lấy lại được nguyên văn.
  - `428d94f9-…jsonl`: "/goal IMPLEMENT Phase F (Foundation) of the plan …/full-catalog/plan.md. Read the whole plan…"
  - `c6dcc10b-…jsonl`: "/goal IMPLEMENT group B5 (tsp, assignment, n-queens, hamiltonian-circuit, subset-sum, graph-coloring (bai So thu), matrix-chain, lcs…"
  - `04cbfb0d-…jsonl`: "REVIEW (cross-vendor; fixes by Codex, original by Claude Code) of catalog group B5… Previous review FAILED with 8 blocking issues…"
- **`plans/261011-1835-knapsack-visualizer/plan.md` và `plans/261011-2028-full-catalog/plan.md`:** chứa đặc tả gửi cho agent. Dòng 3 của file đầu tiên ghi vai trò "Owner: codex (implement) · Reviewer: claude_code (cross-review)".
- **Log của Codex trong `~/.codex/sessions`:** không tìm thấy phiên nào khớp với B4 và B5. Nội dung review lượt đầu bị FAIL của hai nhóm này chỉ còn qua phần trích lại trong prompt của lượt review sau.
- **Lịch sử phiên orchestrator trong Omnigent:** lưu đủ các tin nhắn người dùng gửi, ví dụ "Hãy chọn 1 đề tài…", "Tất cả các bài toán và cách giải…", "/debate…", cùng toàn bộ các prompt giao việc.

## Các sự cố có bằng chứng

1. **Tô màu đồ thị (PR #7).** Lượt review đầu kết luận FAIL. Sau khi sửa ở commit 4b83502, lượt sau PASS. Bằng chứng nằm ở log `04cbfb0d` và file `review-regressions.test.ts`.
   - **Lời giải tham chiếu tự tham chiếu:** bộ kiểm tra dùng chính kiểu quay lui của thuật toán đang được kiểm. Đã đổi sang `existsColoring`, liệt kê các cách chia đỉnh thành tập độc lập.
   - **Heuristic báo sai:** khi không tô được, heuristic báo "không thể tô", trong khi thực ra chỉ là chưa tìm được. Đã thêm cờ `heuristic`.
   - **Đồ thị rỗng:** quay lui và vét cạn chưa xử lý trường hợp n = 0.
   - **Quay lui không cập nhật hình:** khi quay lui, đồ thị trên màn hình không đổi màu lại.
2. **Nhánh cận bài cái túi (PR #1).** Nút vừa trở thành nghiệm tốt nhất lại bị đánh dấu là "cắt nhánh". Commit sửa là c0e1741; test hồi quy `bestNeverPruned` được thêm ở commit 7857a79. Có 8 test hồi quy, và cả 8 fail trên code cũ 5fde3ef.
3. **Boyer-Moore thiếu bảng hậu tố tốt, simplex giả (PR #6).** Đã cài bảng hậu tố tốt theo cách của Gusfield, và viết lại simplex hai pha thật theo quy tắc Bland.
4. **Lời giải tham chiếu tự tham chiếu lặp lại ở B1, B4 và B5.** Các bản thay thế độc lập gồm Held-Karp, quy hoạch động bitmask, monotone chain. Riêng bài cặp điểm gần nhất, reviewer vẫn ghi là "chưa độc lập hoàn toàn".
5. **Code viết dồn một dòng (PR #3, #4).** 136 trên 184 file bị viết dồn. Lần định dạng lại đầu tiên còn định dạng luôn cả `manifest.ts`, khoảng 1.650 dòng, nên phải trả file này về cách viết cũ. Sau đó quy tắc được ghi vào `adding-an-algorithm.md`.
6. **Trang So sánh (PR #8).** Kết quả của lượt chạy cũ ghi đè lên kết quả mới. Có 4 commit sửa liên tiếp: 8698427, 0069f32, aaab204, e3908f8. Đây là ví dụ về việc reviewer phát hiện dần từng trường hợp biên qua nhiều vòng.
7. **Testcase TSP chỉ đạt 8/10 (PR #8, commit fc6982b).** Ca lớn 12 điểm vượt giới hạn của thuật toán. Đã sửa bằng cách báo "không áp dụng" và hạ ca lớn xuống 9 điểm.

## Việc sinh viên đã làm (có bằng chứng)

- **Ra các quyết định chính** (theo lịch sử phiên orchestrator):
  - chọn làm cả sách;
  - chọn shadcn/ui tông trắng đen;
  - chọn repo private;
  - chọn Cloudflare Pages;
  - đặt domain `hieutk.dev`;
  - yêu cầu tổ chức tranh luận giữa các agent về kiến trúc.
- **Merge các PR #2 đến #8.** GitHub ghi `mergedBy: tkhieu` (tài khoản của sinh viên). Lịch sử phiên orchestrator có tin nhắn sinh viên báo đã merge từng PR, ví dụ "merged https://github.com/tkhieu/algorithm-visualizer/pull/6". Lưu ý: commit do agent tạo cũng mang danh tính git của máy, nên chỉ dựa vào tên tác giả commit là không đủ.
- **Xử lý các lần agent bị chặn:**
  - duyệt ngân sách khi agent chạm ngưỡng;
  - đăng nhập lại khi hết phiên;
  - mở khóa keyring để `gh` chạy được;
  - trả lời câu hỏi chữ ký commit của agent B5.
- **Những điểm còn thiếu bằng chứng:**
  - việc duyệt ngân sách và mở khóa keyring chỉ thấy qua lịch sử orchestrator, không có trong log của agent;
  - chưa có bằng chứng sinh viên tự chạy tay hay tự kiểm chứng thuật toán. Phần này phải làm thêm và chụp ảnh lại.

## Lưu ý để report trung thực

- **Không ghi rằng sinh viên tự review code.** Reviewer là agent; sinh viên chỉ đọc kết luận rồi quyết định merge.
- **Commit mang tên "Hieu Tran"** vì agent dùng cấu hình git của máy. Nội dung các commit do agent viết.
