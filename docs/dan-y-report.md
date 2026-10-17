# Dàn ý Report – Bài tập lớn CS112

> Bản nháp dàn ý. Chỗ ghi **[CHỜ XÁC MINH]** sẽ được điền sau khi đối chiếu với code, testcase và lịch sử PR.
> Đề bài gốc: `docs/de-bai-bai-tap-lon.md`. Phương án tổng thể: chốt sau cuộc tranh luận Claude/Codex/Grok ngày 18/10/2026.

## Nguyên tắc xuyên suốt

- **Một bài toán trọng tâm: Tô màu đồ thị (bài Sở thú).** Khoảng 80% nội dung chuyên môn dành cho bài này. 47 bài còn lại của app chỉ nằm trong mục "Phát triển mở rộng" và phụ lục.
- **Một ví dụ chung** (đồ thị khoảng 6–7 đỉnh) dùng cho mô hình, minh họa từng bước, ảnh chụp giao diện và video. Trạng thái trong report phải khớp đúng từng bước trên Player.
- **Trung thực về AI:** ghi thẳng toàn bộ code do AI viết; chỉ nhận những việc sinh viên thật sự làm; prompt không còn bản gốc thì ghi là "tái dựng", không đặt trong ngoặc kép.
- **Chỉ ghi thuật toán app thật sự có:** greedy, Welsh-Powell, DSATUR, quay lui, vét cạn. Không có nhánh cận cho bài này.
- **Domain trong tài liệu nộp:** chỉ dùng `https://algorithm-visualizer.hieutk.dev`.

## Bảng đối chiếu bằng chứng

Mỗi yêu cầu của đề phải trỏ được tới mục report, chức năng demo, testcase và cảnh video. Điền dần trong lúc viết.

| Yêu cầu của đề | Mục report | Chức năng demo | Testcase | Cảnh video |
|---|---|---|---|---|
| Nhập Input | Ch.2 Mô hình | Nhập tay / nạp file / sinh ngẫu nhiên | nhóm nhỏ, không hợp lệ | Cảnh 4 |
| Theo dõi từng bước | Ch.4 Ví dụ minh họa | Player: mã giả, trạng thái, tiến/lùi | ví dụ chung | Cảnh 5 |
| Xem Output | Ch.2, Ch.4 | Kết quả + kiểm tra hợp lệ/tối ưu | mọi nhóm | Cảnh 5–6 |
| Nhiều cách giải, so sánh | Ch.3, Ch.6 | Trang So sánh | đồ thị vương miện, ca lớn | Cảnh 6 |
| Testcase đa dạng, lớn | Ch.6 | Trang Testcase | 6 nhóm | Cảnh 7 |
| Tường thuật quá trình + AI | Ch.5 | — | — | — |
| Đánh giá, hạn chế | Ch.7 | — | kết quả chạy | Cảnh 9 |

## Cấu trúc report

### Trang bìa, mục lục

- Tên đề tài đặt theo bài trọng tâm, ví dụ: *"Bài toán Tô màu đồ thị: thiết kế, so sánh năm chiến lược giải và demo minh họa từng bước"*.
- Thông tin sinh viên, lớp CS112, giảng viên, link demo chính thức.

### Chương 1. Giới thiệu bài toán

- **Lý do thật sự chọn:** cô nhận xét phần thiết kế thuật toán trong bài thi còn yếu, nêu bài Sở thú là bài tô màu đồ thị; sinh viên chọn bài này để làm lại cho kỹ. Nêu thêm lý do kỹ thuật: bài có nhiều cách giải để so sánh (nhanh nhưng không chắc tối ưu, chắc tối ưu nhưng chậm).
- **Nguồn gốc:** bài toán bốn màu; Levitin §1.3 (giới thiệu) và §12.1 trang 425 (quay lui cho bài tô màu m màu, nguồn app đang ghi cho cả 5 thuật toán); Welsh–Powell (1967); Brélaz (1979) cho DSATUR.
- **Ứng dụng thực tế:** xếp lịch thi, phân chuồng thú (bài Sở thú), cấp phát thanh ghi trong trình biên dịch, phân tần số sóng.

### Chương 2. Mô tả và mô hình bài toán

- **Mô tả kiểu đề Wecode:** phát biểu bài Sở thú bằng lời (các loài không được nhốt chung chuồng → cần ít chuồng nhất), rồi quy về đồ thị.
- **Phiên bản bài toán app đang cài đặt (đã xác minh trong code):** *bài toán quyết định k màu*. Cho đồ thị và số màu k, tìm cách tô hợp lệ bằng k màu, hoặc chứng minh không có. App **chưa** tìm sắc số χ(G) (số màu ít nhất). Nguồn: `source-code/src/problems/graph-coloring/definition.ts`.
- **Input:** JSON `{nodes, edges, colors}`. `nodes` là danh sách tên đỉnh, tối đa 10, mỗi tên dài 1–20 ký tự. Thứ tự trong `nodes` chính là thứ tự duyệt của greedy, quay lui và vét cạn. `edges` gồm tối đa 100 cặp `{from, to}`. `colors` là k, từ 1 đến 10.
- **Output:** `{found, coloring, heuristic?}`. `found = false` nghĩa là "không tô được bằng k màu" nếu là thuật toán chính xác, hoặc "chưa tìm được" nếu là heuristic.
- **Ràng buộc:** 0 ≤ n ≤ 10, 1 ≤ k ≤ 10. Vét cạn chỉ nhận n ≤ 6 và kⁿ ≤ 200.000; vượt giới hạn thì báo lỗi kèm gợi ý dùng quay lui.
- **Bộ kiểm tra kết quả (checker):**
  - Khi `found = true`: kiểm tra mỗi đỉnh có đúng một màu trong [0, k) và hai đỉnh kề khác màu.
  - Khi thuật toán chính xác báo `found = false`: dùng oracle độc lập `existsColoring` (liệt kê phân hoạch đỉnh thành các tập độc lập) để xác nhận đúng là vô nghiệm.
- **Phân biệt ba khái niệm:** tô màu **hợp lệ**, **có tô được bằng k màu hay không**, và **sắc số χ(G)**. Nếu report muốn nói về χ(G), phải trình bày là chạy lặp k = 1, 2, … cho tới khi tô được, hoặc nâng cấp app (xem câu hỏi mở cuối file).
- **Ví dụ Input/Output:** 3 ví dụ:
  1. đồ thị nhỏ có lời giải dễ thấy;
  2. ví dụ chung của report;
  3. một trường hợp biên, ví dụ đồ thị rỗng hoặc đồ thị đầy đủ.

### Chương 3. Thiết kế cấu trúc dữ liệu và thuật toán

- **Cấu trúc dữ liệu:** danh sách kề, mảng màu, tập màu đã dùng của các đỉnh kề, độ bão hòa (saturation) cho DSATUR. Trace lưu `nodes`, `edges`, `treeNodes` (cây trạng thái) và `note` (`algorithms/graph-coloring/shared.ts`).
- **Phân tích đặc trưng (ý tưởng giải):** chặn dưới (clique lớn nhất), chặn trên (Δ+1), vì sao thứ tự duyệt đỉnh quyết định kết quả của greedy.
- **Năm thuật toán.** Mỗi thuật toán có mã giả, ý tưởng, vì sao đúng hoặc vì sao không bảo đảm tối ưu, và độ phức tạp:
  1. **Greedy:** duyệt theo thứ tự `nodes`, mỗi đỉnh nhận màu nhỏ nhất còn dùng được. Hết màu thì báo "chưa tìm được", không kết luận vô nghiệm.
  2. **Welsh-Powell:** sắp đỉnh theo bậc giảm dần; hai đỉnh cùng bậc giữ thứ tự ban đầu. Gán màu như greedy.
  3. **DSATUR** (ngoài sách, app ghi rõ): mỗi vòng chọn đỉnh chưa tô có độ bão hòa lớn nhất; hòa thì chọn đỉnh bậc cao hơn.
  4. **Quay lui:** theo thứ tự `nodes`, thử lần lượt màu 0..k−1, bỏ màu xung đột, quay lui khi nhánh bế tắc. Dừng ở nghiệm đầu tiên hoặc khi đã vét hết nhánh, tức là giải bài toán quyết định k màu.
  5. **Vét cạn:** sinh đủ kⁿ cách gán, kiểm tra khi gán xong mọi đỉnh. Dừng ở nghiệm đầu tiên.
  - App không có nhánh cận cho bài này.
- **Bảng tổng hợp:** thuật toán, có bảo đảm tối ưu không, độ phức tạp, giới hạn n trong app.
- **Trích nguồn:** Levitin, Welsh–Powell 1967, Brélaz 1979.

### Chương 4. Ví dụ minh họa các bước

- Chọn đồ thị chung khoảng 6–7 đỉnh mà greedy và DSATUR cho kết quả **khác nhau**, để phần so sánh có nội dung.
- Bảng trạng thái từng bước, mỗi bước gồm:
  - đỉnh đang xét;
  - các màu bị cấm;
  - màu được gán;
  - mảng màu sau bước đó;
  - dòng mã giả đang chạy.
- Ảnh chụp Player ở 3–4 bước then chốt, có đánh số bước khớp với bảng.
- Với quay lui: minh họa một lần quay lui thật, kèm cây trạng thái (app có view `state-space-tree`).
- Ảnh chạy tay trên giấy của sinh viên để đối chiếu.

### Chương 5. Tường thuật quá trình thiết kế và xây dựng ⭐ (quan trọng nhất)

- **5.1 Câu mở đầu:** toàn bộ mã nguồn được sinh bằng Claude Code và Codex qua 8 PR, có một agent điều phối giao việc. Sau đó liệt kê đúng những việc sinh viên làm, chỉ những việc có bằng chứng:
  - chọn đề tài và phạm vi (cả sách);
  - chọn công nghệ và giao diện;
  - chọn hosting và domain;
  - yêu cầu tổ chức tranh luận về kiến trúc;
  - tự merge PR #2 đến #8;
  - duyệt ngân sách, đăng nhập lại, mở khóa keyring khi agent bị chặn.
  Không ghi rằng sinh viên tự review code. Tư liệu chi tiết: `plans/reports/explore-261018-0006-ai-narrative-sources.md`.
- **5.2 Công cụ:** model và phiên bản, vai trò từng agent, quy trình review chéo giữa hai hãng.
- **5.3 Dòng thời gian:** bảng 8 PR, mỗi PR một dòng gồm mục tiêu, agent làm, số vòng review và kết quả.
  - Các giai đoạn: đọc sách → tranh luận kiến trúc → bản cái túi 0/1 → deploy → nền tảng catalog → 5 nhóm song song → tích hợp.
- **5.4 Thiết kế giao diện:** lý do chọn shadcn/ui tông trắng đen, phân biệt trạng thái bằng độ đậm, viền và hoa văn thay vì màu; bố cục Player và trang So sánh.
- **5.5 Từ 3 đến 5 sự cố tiêu biểu.** Ưu tiên sự cố của bài tô màu, sau đó là lỗi "test so với chính thuật toán" và lỗi nhánh cận bài cái túi. Mỗi sự cố gồm:
  1. mục tiêu;
  2. model;
  3. prompt, có nhãn nguyên văn hoặc tái dựng, kèm nguồn;
  4. kết quả nhận được;
  5. lỗi;
  6. ai phát hiện, phát hiện bằng cách nào;
  7. cách sửa;
  8. bằng chứng (PR, commit, test hồi quy fail trên code cũ);
  9. bài học.
  - **Sự cố đề xuất cho thân bài:**
    1. tô màu đồ thị (PR #7, commit 4b83502): lời giải tham chiếu tự tham chiếu, heuristic báo "không thể tô", đồ thị rỗng, quay lui không cập nhật hình;
    2. nhánh cận bài cái túi (PR #1, commit c0e1741, 8 test hồi quy fail trên code cũ);
    3. lời giải tham chiếu tự tham chiếu lặp lại ở nhiều nhóm;
    4. code viết dồn một dòng, dẫn tới quy tắc mới trong hướng dẫn;
    5. (tuỳ chọn) trang So sánh cần 6 vòng review.
  - **Prompt nguyên văn:** lấy trong `~/.claude/projects/*HomeWork*/*.jsonl`, ở tin nhắn đầu của mỗi file, và trong các file `plans/*/plan.md`. Bản review lượt đầu của B4 và B5 chỉ còn qua phần trích lại, nên phải ghi rõ điều này.
- **5.6 Phần sinh viên tự kiểm chứng:** chạy tay ví dụ, giải tay vài testcase nhỏ rồi đối chiếu với app, tự phân tích độ phức tạp.
- **5.7 Đánh giá phê phán việc dùng AI:** AI sai ở đâu, review chéo bắt được gì, cái gì vẫn phải do người kiểm; lời giải tham chiếu (oracle) kiểm được gì và còn bỏ sót gì.

### Chương 6. Thiết kế thực nghiệm

- **Cách tạo testcase:** viết tay, sinh ngẫu nhiên theo seed, dựng có chủ đích (đồ thị vương miện, đồ thị đầy đủ, đồ thị hai phía).
- **Phân nhóm:** thường, biên, nhỏ, lớn, đặc biệt, không hợp lệ, kèm kích thước từng nhóm.
- **Hiện trạng (đã xác minh):** `testcases/graph-coloring/` có 10 file, đủ 6 nhóm.
  - Ca "lớn" nhất chỉ có 7 đỉnh, 10 cạnh.
  - Mọi file đều có `expected: null`; tính đúng do checker xác nhận.
  - Chưa có testcase đồ thị vương miện, dù đã có unit test dựng đồ thị này (`review-regressions.test.ts`).
  - Bộ này hiện quá nhỏ so với yêu cầu "đủ lớn và đủ phức tạp". Xem câu hỏi mở cuối file.
- **Đo đạc:**
  - số màu, thời gian (đo nhiều lần, lấy trung vị) và số phép toán;
  - ghi rõ cấu hình máy và trình duyệt;
  - ca nào vượt giới hạn thì ghi "timeout" hoặc "không áp dụng".
- **Bảo đảm độ phủ:** đối chiếu từng nhóm với các nhánh của thuật toán và các trường hợp biên.

### Chương 7. Đánh giá

- Tính đúng: số testcase đạt trên tổng, cách kiểm (bộ kiểm tra hợp lệ, so với vét cạn trên đồ thị nhỏ).
- Bảng và biểu đồ so sánh 5 thuật toán: số màu, thời gian theo n, điểm mà quay lui bắt đầu chạy quá chậm.
- Tính trực quan và khả năng minh họa từng bước.
- Hạn chế: giới hạn n, heuristic không tối ưu, code do AI viết.
- Hướng phát triển.

### Chương 8. Phát triển mở rộng (1–2 trang)

- Nền tảng dùng lại cho 47 bài và 126 cách giải của sách Levitin: Player, So sánh, Testcase dùng chung.
- Một bảng tóm tắt; chi tiết để ở phụ lục.
- Câu chốt: phần mở rộng không thay thế chiều sâu của bài trọng tâm.

### Tài liệu tham khảo, phụ lục

- **Tài liệu tham khảo:** Levitin (bản 3), Welsh–Powell 1967, Brélaz 1979, tài liệu shadcn/ui và React.
- **Phụ lục A:** lịch sử đầy đủ 8 PR, các lượt review, diff.
- **Phụ lục B:** danh mục 47 bài toán.
- **Phụ lục C:** danh sách testcase.

## Kịch bản video (khoảng 7–8 phút, chú thích chữ)

1. Tên đề tài và domain chính thức (15 giây).
2. Bài toán Sở thú và ứng dụng (30 giây).
3. Dạo qua giao diện.
4. Nhập dữ liệu: nhập tay, nạp file, sinh ngẫu nhiên, và một input không hợp lệ.
5. Chạy từng bước **đúng ví dụ chung của Chương 4**, có tiến, lùi và dừng.
6. So sánh các cách giải, rồi tới đồ thị vương miện.
7. Trang Testcase: ca lớn và ca biên.
8. Lướt nhanh phần cả sách (khoảng 30 giây).
9. Hạn chế và hướng phát triển.

Nếu video vượt 9 phút thì cắt phần so sánh xuống còn 3 thuật toán.

## Câu hỏi mở cần chốt

1. **Có nâng cấp bài tô màu trong app không?** Hiện app chỉ giải bài toán quyết định k màu với n ≤ 10, và bộ testcase còn nhỏ. Hướng nâng cấp đề xuất:
   - thêm chế độ tìm sắc số χ(G);
   - nâng giới hạn n cho các heuristic để có ca lớn thật;
   - thêm testcase đồ thị vương miện và các ca lớn có kết quả kỳ vọng.
   Nếu không nâng cấp, report phải trình bày đúng phiên bản quyết định k màu.

## Thứ tự làm

1. Đăng câu hỏi công khai lên group lớp để hỏi cách đóng khung "một bài trọng tâm, cả sách là phần mở rộng". Không chờ trả lời mới bắt đầu làm.
2. Chạy tay đủ 5 thuật toán trên ví dụ chung.
3. Điền các chỗ [CHỜ XÁC MINH] và bảng đối chiếu bằng chứng.
4. Viết nháp Chương 3, 4 và 5.
5. Chạy thực nghiệm, viết Chương 6 và 7.
6. Quay video theo kịch bản trên.
7. Đối chiếu report, video và testcase cho khớp nhau, rồi xuất PDF và đóng gói 4 thư mục.
