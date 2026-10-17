# Kịch bản dựng video demo – Tô màu đồ thị (bài Sở thú)

> Bản nháp để review. Tổng thời lượng mục tiêu là **7–8 phút**, tối đa 9 phút. Video **có thu âm lời đọc** (mục 4), kèm chú thích chữ ngắn trên màn hình để nhấn các ý chính.
> Ví dụ chung của video và Chương 4 report: **đồ thị vương miện 6 đỉnh** (xem mục "Dữ liệu dùng trong video").
> Ký hiệu **[SAU NÂNG CẤP]** đánh dấu cảnh chỉ quay được khi PR nâng cấp bài tô màu (chế độ χ(G), đồ thị lớn, testcase mới) đã được merge và deploy.

## 1. Chuẩn bị trước khi quay

- **Bản demo:** quay trên `https://algorithm-visualizer.hieutk.dev`. Không dùng domain `.pages.dev`.
  - Trước khi quay, deploy bản mới nhất từ `main`. Kiểm tra trang chủ, `/play/graph-coloring/backtracking` và `/compare/graph-coloring`.
- **Màn hình:**
  - Độ phân giải 1920×1080 và zoom trình duyệt 110–125% để chữ trên Player đọc được khi xem trên điện thoại.
  - Ẩn bookmark bar và extension.
  - Dùng cửa sổ ẩn danh để không lộ tài khoản.
- **Công cụ:**
  - Quay bằng OBS Studio, 30 fps. Quay hình trước, thu âm riêng sau (xem mục 4.1).
  - Dựng bằng CapCut, DaVinci Resolve hoặc Shotcut.
  - Chú thích chữ dùng font không chân (Inter hoặc Be Vietnam Pro), cỡ 36–44 px, chữ đen trên nền trắng mờ 85%, đặt ở mép dưới. Cách này hợp với tông trắng đen của app.
- **Quay thành nhiều clip ngắn theo từng cảnh** rồi ghép, đừng quay một mạch. Cảnh nào lỗi thì chỉ quay lại cảnh đó.
- **Chuẩn bị sẵn để dán, tránh gõ trên hình:**
  - các đoạn JSON ở mục 5;
  - một file ghi chú các URL.

## 2. Cấu trúc tổng quát

| # | Cảnh | Thời lượng | Mục report tương ứng |
|---|---|---|---|
| 1 | Mở đầu | 0:15 | Bìa |
| 2 | Bài toán Sở thú và mô hình | 0:40 | Ch.1, Ch.2 |
| 3 | Dạo qua giao diện | 0:50 | Ch.5.4 |
| 4 | Nhập dữ liệu | 0:50 | Ch.2 |
| 5 | Chạy từng bước: quay lui trên ví dụ chung | 1:30 | Ch.4 |
| 6 | So sánh 5 thuật toán | 1:10 | Ch.3, Ch.7 |
| 7 | Testcase và dữ liệu lớn | 0:50 | Ch.6, Ch.7 |
| 8 | Phần mở rộng: cả sách | 0:30 | Ch.8 |
| 9 | Hạn chế và kết | 0:25 | Ch.7 |
| | **Tổng** | **khoảng 7:00** | |

## 3. Kịch bản chi tiết từng cảnh

### Cảnh 1 – Mở đầu (0:15)

- **Hình:** trang chủ của demo, đứng yên 2 giây, rồi zoom nhẹ vào thanh tiêu đề.
- **Chữ:**
  - "CS112 – Bài tập lớn"
  - "Tô màu đồ thị (bài Sở thú): năm chiến lược giải và minh họa từng bước"
  - "Demo: algorithm-visualizer.hieutk.dev"
  - "[Họ tên – MSSV]"

### Cảnh 2 – Bài toán và mô hình (0:40)

- **Hình:** mở trang bài toán `/problem/graph-coloring` (phần mô tả và ràng buộc). Cuộn chậm.
- **Chữ:**
  1. "Sở thú: một số loài không được nhốt chung chuồng. Cần xếp chuồng sao cho không có hai loài 'kỵ nhau' ở chung."
  2. "Mô hình: mỗi loài là một đỉnh, mỗi cặp kỵ nhau là một cạnh, mỗi chuồng là một màu."
  3. "Bài toán k màu: có tô được bằng k màu không? Nếu có thì tô thế nào?"
  4. **[SAU NÂNG CẤP]** "Bài toán sắc số: cần ít nhất bao nhiêu chuồng, tức χ(G)?"
- **Lưu ý:** dừng ở dòng ràng buộc (n, k) khoảng 3 giây.

### Cảnh 3 – Dạo qua giao diện (0:50)

- **Hình:** mở `/play/graph-coloring/backtracking`. Mỗi vùng được khoanh bằng khung chữ nhật đen (thêm lúc dựng), theo thứ tự:
  1. **Thanh bên:** chọn bài theo chương, theo kỹ thuật hoặc theo bài toán. Chữ: "Điều hướng theo chương / kỹ thuật / bài toán".
  2. **Nút chuyển nhanh giữa 5 cách giải.** Chữ: "Cùng một bài toán, 5 cách giải".
  3. **Trình nhập liệu.** Chữ: "Nhập dữ liệu: JSON, sinh ngẫu nhiên, ca mẫu".
  4. **Khung đồ thị.** Chữ: "Trạng thái đồ thị: màu của từng đỉnh, đỉnh đang xét".
  5. **Khung mã giả.** Chữ: "Dòng mã giả đang chạy được tô đậm".
  6. **Lời giải thích tiếng Việt.** Chữ: "Giải thích từng bước".
  7. **Thanh điều khiển:** tiến, lùi, tua, tốc độ. Chữ: "Điều khiển bước, có phím tắt".
  8. **Nút chuyển view** "Đồ thị" / "Cây trạng thái". Chữ: "Hai cách xem: đồ thị và cây tìm kiếm".
- **Lưu ý:** cảnh này chỉ giới thiệu, chưa bấm chạy.

### Cảnh 4 – Nhập dữ liệu (0:50)

- **Hình 1, nhập ví dụ chung:** mở tab "Chỉnh JSON", dán JSON đồ thị vương miện (mục 5.1). Dữ liệu được cập nhật ngay khi dán, không cần bấm nút áp dụng.
  - Chữ: "Ví dụ chung: 6 loài A1, B1, A2, B2, A3, B3; Ai kỵ Bj khi i ≠ j; k = 2 chuồng".
- **Hình 2, input không hợp lệ:** dán JSON có `colors: 0` (mục 5.3). App hiện thông báo lỗi.
  - Chữ: "Dữ liệu không hợp lệ bị từ chối ngay khi nhập".
- **Hình 3, sinh ngẫu nhiên:** dùng bộ sinh ngẫu nhiên theo seed, chỉ lướt nhanh.
  - Chữ: "Sinh đồ thị ngẫu nhiên theo seed – lặp lại được".
- **Hình 4 [SAU NÂNG CẤP]:** mở danh sách ca mẫu (Petersen, Grötzsch…), chỉ lướt.
- **Cuối cảnh:** dán lại JSON ví dụ chung để sang cảnh 5.

### Cảnh 5 – Chạy từng bước: quay lui trên ví dụ chung (1:30)

Đây là cảnh quan trọng nhất. Mỗi bước phải khớp đúng bảng ở Chương 4 report.

- **Hình:** bấm "Chạy", rồi dùng nút "Tiến bước" bấm từng bước, mỗi bước dừng khoảng 3 giây. Có tổng cộng 20 bước, khớp bảng ở mục 4.2 report.
- **Chữ đặt theo các mốc:**
  1. **Bước 2–3:** "A1 nhận màu 0; B1 không kề A1 nên cũng nhận màu 0".
  2. **Bước 4–7:** "Màu bị trùng với đỉnh kề → loại; A2 và B2 nhận màu 1".
  3. **Bước 8–9:** "A3 kề B1 (0) và B2 (1): cả 2 màu đều bị loại → bế tắc". Dừng 5 giây. **Bấm chuyển sang view "Cây trạng thái"** (Player mặc định đang ở view đồ thị) và zoom vào hai nhánh bị loại. Sau đó chuyển lại view đồ thị.
  4. **Bước 10–12:** "**Quay lui** qua B2, A2 về tới B1 – gốc của bế tắc là B1 = 0".
  5. **Bước 13:** "B1 đổi sang màu 1".
  6. **Bước 14–19:** "Nhóm A màu 0, nhóm B màu 1".
  7. **Bước 20:** "Tô thành công: 20 bước, 6 lần cắt nhánh".
- **Lùi lại:** bấm "Lùi bước" về bước 12 (quay lui về B1). Chữ: "Có thể lùi lại bất kỳ bước nào".
- **Kết quả:** chỉ vào vùng kết quả và nhận xét đúng/sai của checker. Chữ: "Checker xác nhận: cách tô hợp lệ".

### Cảnh 6 – So sánh 5 thuật toán (1:10)

- **Hình 1:** mở `/compare/graph-coloring`. Trang So sánh **không** mang theo dữ liệu từ Player mà tự nạp testcase đầu tiên, nên phải **dán lại JSON ví dụ chung** (mục 5.1) vào trình nhập của trang. Thấy các cột ở trạng thái "chờ", rồi bấm "Chạy tất cả".
- **Chữ:**
  - "Cùng một input, 5 thuật toán".
  - "Greedy và Welsh–Powell: **chưa tìm được** cách tô 2 màu, do thứ tự đỉnh xấu".
  - "DSATUR: tô thành công trong 14 bước – ưu tiên đỉnh bị ép nhiều nhất; với đồ thị hai phía, DSATUR luôn tô đúng".
  - "Quay lui 20 bước, vét cạn 69 bước: cắt nhánh sớm giúp quay lui duyệt ít hơn".
- **Hình 2:** zoom vào cột số bước, số phép toán và thời gian (trung vị). Chữ: "Đánh đổi: nhanh nhưng không chắc chắn, hay chắc chắn nhưng chậm".
- **Hình 3 [SAU NÂNG CẤP]:** chuyển sang chế độ χ(G). Chữ: "Greedy dùng 3 màu, trong khi χ = 2. Thứ tự đỉnh quyết định chất lượng của tham lam".
- **Hình 4:** biểu đồ thời gian theo n. Chữ: "Vét cạn tăng theo kⁿ".

### Cảnh 7 – Testcase và dữ liệu lớn (0:50)

- **Hình 1:** mở `/testcases/graph-coloring`, bấm chạy toàn bộ. Dừng ở bảng kết quả "Đạt N/N".
  - Chữ: "Bộ testcase chia 6 nhóm: thường, biên, nhỏ, lớn, đặc biệt, không hợp lệ".
- **Hình 2:** cuộn qua từng nhóm, mỗi nhóm khoảng 3 giây.
- **Hình 3 [SAU NÂNG CẤP]:** mở một ca lớn khoảng 300 đỉnh trên Player bằng DSATUR (hiển thị bằng Canvas).
  - Chữ: "Heuristic chạy được trên đồ thị 300 đỉnh".
- **Hình 4:** mở quay lui với ca lớn để thấy thông báo "Không áp dụng".
  - Chữ: "Thuật toán chính xác có giới hạn an toàn – báo rõ thay vì treo máy".
- **Hình 5:** bấm xuất CSV/JSON. Chữ: "Xuất kết quả để đưa vào report".

### Cảnh 8 – Phần mở rộng: cả sách (0:30)

- **Hình:** mở `/algorithms`, bấm `Ctrl+K` gõ "Dijkstra", mở nhanh một Player khác (ví dụ Dijkstra hoặc LCS), cho chạy 3–4 bước.
- **Chữ:**
  - "Mở rộng: cùng một nền tảng cho 47 bài toán, 126 cách giải trong sách Levitin".
  - "Phần chấm điểm chính vẫn là bài Tô màu đồ thị".

### Cảnh 9 – Hạn chế và kết (0:25)

- **Hình:** quay lại Player tô màu với kết quả cuối của ví dụ chung, đứng yên.
- **Chữ:**
  - "Hạn chế: thuật toán chính xác chỉ chạy được với đồ thị nhỏ; heuristic không bảo đảm".
  - "Mã nguồn được sinh bằng AI (Claude Code, Codex) và kiểm chứng bằng review chéo, test độc lập – chi tiết trong report".
  - "Cảm ơn cô đã xem."

## 4. Lời đọc (thu âm)

### 4.1. Cách thu

- **Thu riêng từng cảnh,** sau khi đã quay hình. Vừa xem lại clip vừa đọc, để lời khớp với thao tác trên màn hình.
- **Thiết bị:**
  - Dùng micro tai nghe hoặc micro USB. Nếu chỉ có điện thoại thì đặt cách miệng khoảng 20 cm.
  - Thu trong phòng kín, tắt quạt và điều hoà.
- **Phần mềm:**
  - Thu bằng Audacity: mono, 48 kHz.
  - Sau khi thu, chạy lần lượt *Noise Reduction*, *Normalize* về −1 dB, và *Compressor* nhẹ.
- **Nhịp đọc:** khoảng 130–150 từ mỗi phút. Ngắt nghỉ ở mỗi dấu chấm. Đọc sai thì dừng 2 giây rồi đọc lại cả câu, để dễ cắt khi dựng.
- **Khớp với chú thích chữ:** chú thích trên màn hình chỉ giữ từ khoá. Phần lời đọc là bản đầy đủ.
- Ước tính tổng lời đọc khoảng 1.000 từ, tương ứng khoảng 7 phút.

### 4.2. Lời đọc từng cảnh

**Cảnh 1 – Mở đầu (0:15)**
> Xin chào cô. Em là [họ tên], mã số sinh viên [MSSV]. Đây là video demo bài tập lớn môn Phân tích và thiết kế thuật toán. Đề tài của em là bài toán tô màu đồ thị, hay bài toán Sở thú, với năm chiến lược giải và phần minh họa từng bước. Demo chạy trực tuyến tại địa chỉ algorithm-visualizer chấm hieutk chấm dev.

**Cảnh 2 – Bài toán và mô hình (0:40)**
> Bài toán bắt đầu từ một sở thú. Có những loài không thể nhốt chung chuồng với nhau. Câu hỏi là: với k chuồng, có xếp được tất cả các loài sao cho không chuồng nào có hai loài kỵ nhau hay không.
> Em mô hình hoá bài toán bằng đồ thị. Mỗi loài là một đỉnh, mỗi cặp kỵ nhau là một cạnh, và mỗi chuồng là một màu. Như vậy câu hỏi trở thành: có tô được các đỉnh bằng k màu, sao cho hai đỉnh kề nhau luôn khác màu hay không.
> Trên màn hình là phần mô tả và ràng buộc của bài toán trong app: số đỉnh, số cạnh và số màu k.
> [SAU NÂNG CẤP, thêm câu:] Ngoài ra app còn có chế độ tìm sắc số, tức số chuồng ít nhất cần dùng.

**Cảnh 3 – Dạo qua giao diện (0:50)**
> Đây là trang Player, nơi chạy từng bước một thuật toán.
> Bên trái là thanh điều hướng. Có thể tìm bài toán theo chương của sách, theo kỹ thuật thiết kế, hoặc theo tên bài toán.
> Phía trên là nút chuyển nhanh giữa năm cách giải của cùng bài toán: tham lam, Welsh–Powell, DSATUR, quay lui và vét cạn.
> Đây là trình nhập dữ liệu. Ở giữa là khung đồ thị, cho thấy màu của từng đỉnh và đỉnh đang được xét. Bên cạnh là mã giả, dòng đang chạy được tô đậm, và dưới đó là lời giải thích bằng tiếng Việt cho từng bước.
> Thanh điều khiển cho phép tiến, lùi, tua và chỉnh tốc độ. Giao diện chỉ dùng trắng đen. Màu của mỗi đỉnh được ghi bằng số trên nhãn, và đỉnh đang xét được làm nổi bật. Nút này dùng để chuyển giữa view đồ thị và view cây trạng thái.

**Cảnh 4 – Nhập dữ liệu (0:50)**
> Bây giờ em nhập ví dụ chung, cũng là ví dụ được phân tích trong report. Đồ thị có sáu loài: A1, B1, A2, B2, A3, B3. Loài Ai kỵ loài Bj khi i khác j. Số chuồng k bằng 2.
> Đây là một đồ thị hai phía, nên thực ra tô được bằng hai màu. Em cố ý nhập các đỉnh theo thứ tự xen kẽ A, B, A, B để thử thách các thuật toán.
> Nếu nhập sai, ví dụ số màu bằng 0, app từ chối ngay và báo lỗi.
> App cũng có bộ sinh đồ thị ngẫu nhiên theo seed, nên mỗi lần sinh lại sẽ ra cùng một đồ thị.

**Cảnh 5 – Chạy từng bước bằng quay lui (1:30)**
> Em chạy thuật toán quay lui. Thuật toán tô các đỉnh theo thứ tự đã nhập, mỗi đỉnh thử lần lượt màu 0 rồi màu 1.
> Ở bước 2 và 3, A1 nhận màu 0. B1 không kề A1, nên cũng nhận màu 0.
> Từ bước 4 đến bước 7, màu nào trùng với một đỉnh kề đã tô thì bị loại. Vì vậy A2 và B2 đều nhận màu 1.
> Đến bước 8 và 9 thì A3 kề cả B1 màu 0 lẫn B2 màu 1. Cả hai màu đều bị loại, thuật toán rơi vào bế tắc. Em chuyển sang view cây trạng thái: hai nhánh này được đánh dấu là bị cắt.
> Từ bước 10 đến 12, thuật toán quay lui qua B2, qua A2, và dừng lại ở B1. Gốc của bế tắc là quyết định cho B1 cùng màu với A1.
> Ở bước 13, B1 đổi sang màu 1. Từ đó nhóm A nhận màu 0, nhóm B nhận màu 1, và đến bước 20 thì tô xong. Tổng cộng có hai mươi bước và sáu lần cắt nhánh.
> Em cũng có thể lùi về bất kỳ bước nào, ví dụ bước 12, để xem lại lúc quay lui. Cuối cùng, bộ kiểm tra của app xác nhận đây là một cách tô hợp lệ.

**Cảnh 6 – So sánh năm thuật toán (1:10)**
> Đây là trang So sánh. Em dán lại đồ thị vương miện, rồi cho cả năm thuật toán chạy trên cùng một đồ thị.
> Tham lam và Welsh–Powell đều báo chưa tìm được cách tô hai màu. Lý do là thứ tự đỉnh xen kẽ khiến B1 nhận cùng màu với A1 ngay từ đầu. Với Welsh–Powell, mọi đỉnh đều có bậc 2 nên việc sắp theo bậc không giúp được gì. Cần lưu ý là heuristic chỉ báo "chưa tìm được", chứ không khẳng định là không thể tô.
> DSATUR thì tô thành công trong mười bốn bước. Thuật toán luôn chọn đỉnh bị ràng buộc nhiều nhất, tức đỉnh có nhiều màu khác nhau ở các đỉnh kề nhất, nên không mắc lỗi như tham lam. Với đồ thị hai phía, DSATUR luôn tô đúng.
> Quay lui và vét cạn đều kết luận chắc chắn. Nhưng quay lui chỉ cần hai mươi bước, còn vét cạn cần sáu mươi chín bước, vì quay lui cắt bỏ nhánh sai ngay khi phát hiện xung đột. Đây chính là sự đánh đổi giữa nhanh mà không chắc chắn, và chắc chắn mà tốn chi phí.
> [SAU NÂNG CẤP, thêm câu:] Ở chế độ tìm sắc số, tham lam dùng ba màu, trong khi chỉ cần hai.

**Cảnh 7 – Testcase và dữ liệu lớn (0:50)**
> Trang Testcase chạy toàn bộ bộ dữ liệu thử nghiệm, chia thành sáu nhóm: thông thường, biên, nhỏ, lớn, đặc biệt và không hợp lệ. Kết quả là đạt [N] trên [N] ca.
> [SAU NÂNG CẤP:] Với đồ thị lớn khoảng ba trăm đỉnh, các heuristic vẫn chạy được. Còn thuật toán chính xác thì báo rõ là không áp dụng, thay vì làm treo trình duyệt.
> Kết quả có thể xuất ra file CSV hoặc JSON để đưa vào report.

**Cảnh 8 – Phần mở rộng (0:30)**
> Ngoài bài trọng tâm, em xây app trên một nền tảng chung. Nền tảng này dùng lại được cho bốn mươi bảy bài toán với một trăm hai mươi sáu cách giải trong sách Levitin, ví dụ Dijkstra hay LCS. Tuy vậy, phần em phân tích sâu và nộp để chấm vẫn là bài tô màu đồ thị.

**Cảnh 9 – Hạn chế và kết (0:25)**
> Hệ thống vẫn còn hạn chế. Thuật toán chính xác chỉ chạy được với đồ thị nhỏ, còn heuristic thì không bảo đảm tìm ra nghiệm.
> Toàn bộ mã nguồn được sinh bằng công cụ AI là Claude Code và Codex, và được kiểm chứng bằng review chéo cùng các test độc lập. Quá trình này em trình bày chi tiết trong report.
> Em cảm ơn cô đã xem video.

## 5. Dữ liệu dùng trong video

### 5.1. Ví dụ chung: đồ thị vương miện 6 đỉnh, k = 2

```json
{
  "nodes": ["A1", "B1", "A2", "B2", "A3", "B3"],
  "edges": [
    {"from": "A1", "to": "B2"},
    {"from": "A1", "to": "B3"},
    {"from": "A2", "to": "B1"},
    {"from": "A2", "to": "B3"},
    {"from": "A3", "to": "B1"},
    {"from": "A3", "to": "B2"}
  ],
  "colors": 2
}
```

Thứ tự đỉnh xen kẽ A1, B1, A2, B2… là cố ý, để greedy gặp thứ tự xấu. Đã chạy thử trên code của app: JSON hợp lệ. Số bước: greedy 7, Welsh–Powell 7, DSATUR 14, quay lui 20, vét cạn 69.

### 5.2. Cùng đồ thị nhưng k = 3

Giữ nguyên JSON 4.1, đổi `"colors": 3`. Dùng để cho thấy greedy tô được khi có đủ màu, nhưng tốn 3 màu.

### 5.3. Input không hợp lệ

```json
{"nodes": ["A"], "edges": [], "colors": 0}
```

## 6. Hậu kỳ

- **Cắt bỏ:** thời gian chờ tải trang và các lần di chuột thừa.
- **Hiệu ứng zoom 120–150%:** dùng ở ba chỗ:
  - bước quay lui (cảnh 5);
  - bảng so sánh (cảnh 6);
  - bảng "Đạt N/N" (cảnh 7).
- **Chú thích chữ:** mỗi dòng hiển thị ít nhất 3 giây; câu dài chia làm hai dòng.
- **Âm thanh:**
  - Ghép lời đọc theo từng cảnh, căn cho lời bắt đầu ngay khi thao tác tương ứng xuất hiện.
  - Nhạc nền không bắt buộc. Nếu dùng thì chọn nhạc không lời, có giấy phép miễn phí, và để âm lượng thấp hơn lời đọc khoảng 20 dB.
- **Phụ đề:** nên xuất thêm phụ đề `.srt` từ lời đọc (CapCut tự nhận giọng tiếng Việt), rồi tự sửa lỗi chính tả.
- **Xuất file:** MP4 H.264, 1080p. Tên file `video-demo-to-mau-do-thi.mp4`, đặt trong thư mục "2. Video demo" của bài nộp.
- **Nếu file quá lớn:** upload lên Google Drive, mở quyền "Bất kỳ ai có đường liên kết", và tự mở thử bằng cửa sổ ẩn danh trước khi nộp.

## 7. Checklist đối chiếu với đề

- [ ] Chạy thử hệ thống (cảnh 1–3).
- [ ] Nhập dữ liệu và giải (cảnh 4–5).
- [ ] Giới thiệu đầy đủ các chức năng: Player, So sánh, Testcase, xuất kết quả, điều hướng (cảnh 3, 6, 7, 8).
- [ ] Giới thiệu các thành phần và thông tin hiển thị trên giao diện (cảnh 3).
- [ ] Minh họa quá trình thực hiện thuật toán và trả về kết quả (cảnh 5).
- [ ] Ví dụ trong video **trùng** với ví dụ Chương 4 report, số bước khớp nhau.
- [ ] Không xuất hiện domain `.pages.dev` hay thông tin tài khoản.
- [ ] Lời đọc khớp với số liệu trong report (số bước, số testcase đạt).
