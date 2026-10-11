# Các thuật toán có thể demo trong sách Levitin (bản 3)

> Sách: *Introduction to the Design and Analysis of Algorithms*, 3rd Ed., Anany Levitin.
> File gốc: `~/Downloads/introduction-to-the-design-and-analysis-of-algorithms-3rd-edition-by-anany-levitin.pdf`
> Số trang ghi theo **trang in trong sách**, không phải số trang của file PDF.
> Đánh giá dựa trên yêu cầu của đề bài ([de-bai-bai-tap-lon.md](de-bai-bai-tap-lon.md)): demo phải cho **nhập Input → xem từng bước → xem Output**, và có thêm điểm cho việc **so sánh nhiều cách giải** hoặc **phát triển biến thể**.

**Mức phù hợp**

- **Cao**: trạng thái dữ liệu thay đổi rõ ràng sau từng bước, dễ vẽ, và có thuật toán khác để so sánh.
- **TB** (trung bình): demo được, nhưng hoặc khó trình bày, hoặc chỉ chạy được với dữ liệu nhỏ.
- **Thấp**: chủ yếu là lý thuyết, không có trạng thái gì để minh họa.

---

## 1. Lưu ý về ba dạng bài cô nhắc trên lớp

Mình đã đối chiếu trực tiếp với nội dung sách:

| Dạng bài | Có trong sách không | Vị trí |
|---|---|---|
| **Tô màu đồ thị** (bài Sở thú) | Chỉ được **giới thiệu** và giao làm **bài tập**, sách **không có mã giả** | §1.3 (giới thiệu bài toán), bài tập ở chương 9 và §12.1 (backtracking), §12.3 (tự thiết kế thuật toán greedy) |
| **Nhân chuỗi ma trận** | Chỉ là **bài tập** | §8.3, Bài tập 11, tr. 303 |
| **LCS** | Chỉ là bài tập **viết báo cáo tìm hiểu** | §8.2, Bài tập 9 |

→ Nếu chọn một trong ba bài này, bạn phải **tự thiết kế thuật toán**. Đổi lại, đây đúng là phần cô chê trong bài thi, nên làm tốt sẽ được đánh giá cao. Mô hình bài toán và nguồn tham khảo phải ghi rõ trong report.

---

## 2. Danh sách theo chương

### Chương 1 — Mở đầu

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 1.1, tr. 3–7 | Tìm ƯCLN: Euclid, thử lần lượt các số nguyên liên tiếp, phương pháp "phổ thông" (phân tích thừa số nguyên tố) | Số dư hoặc ước ứng viên giảm dần | So sánh 3 cách với nhau | Cao (nhưng đơn giản) |

### Chương 2 — Cơ sở phân tích thuật toán

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 2.1, tr. 47–50 | Tìm kiếm tuần tự | Chỉ số đang xét, số lần so sánh | Tìm kiếm nhị phân (4.4) | Cao |
| 2.5, tr. 80–83 | Fibonacci: đệ quy và lặp | Cây lời gọi đệ quy, bảng giá trị | So sánh 2 cách | Cao |

### Chương 3 — Brute Force và vét cạn

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 3.1, tr. 98–101 | Selection sort, Bubble sort | Mảng, phép so sánh, phép đổi chỗ | Các thuật toán sắp xếp ở chương 4, 5, 6, 7 | Cao |
| 3.2, tr. 104–106 | So khớp chuỗi brute force | Vị trí đặt mẫu, so khớp từng ký tự | Horspool, Boyer-Moore (7.2) | Cao |
| 3.3, tr. 108–113 | Cặp điểm gần nhất, bao lồi (brute force) | Các cặp điểm, đường bao đang dựng | Bản chia để trị (5.5) | Cao |
| 3.4, tr. 115–120 | Vét cạn: TSP, cái túi, phân công | Hoán vị/tập con đang xét, phương án tốt nhất hiện tại | DP (8.2), nhánh cận (12.2), xấp xỉ (12.3) | TB (chỉ chạy được với dữ liệu nhỏ) |
| 3.5, tr. 122–127 | DFS, BFS | Đồ thị, ngăn xếp/hàng đợi, cây duyệt | DFS và BFS với nhau | Cao |

### Chương 4 — Giảm để trị

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 4.1, tr. 134–136 | Insertion sort | Đoạn đầu đã sắp, phần tử đang chèn | Các thuật toán sắp xếp khác | Cao |
| 4.2, tr. 138–142 | Sắp xếp topo (bản dùng DFS và bản xóa dần đỉnh nguồn) | DAG, đỉnh có bậc vào 0, thứ tự đầu ra | So sánh 2 cách | Cao |
| 4.3, tr. 144–149 | Sinh hoán vị (Johnson–Trotter, thứ tự từ điển), sinh tập con, mã Gray | Hoán vị/chuỗi bit hiện tại | Các cách sinh với nhau | Cao |
| 4.4, tr. 150–156 | Tìm kiếm nhị phân, đồng xu giả, nhân kiểu nông dân Nga, bài toán Josephus | Đoạn tìm kiếm, các tích riêng | Tìm kiếm tuần tự | Cao / TB |
| 4.5, tr. 158–166 | Tìm phần tử thứ k (Lomuto/quickselect), tìm kiếm nội suy, BST, trò Nim | Mảng sau phân hoạch, vị trí dò, đường đi trên cây | Tìm kiếm nhị phân, tìm kiếm nội suy, tìm kiếm tuần tự | Cao / TB |

### Chương 5 — Chia để trị

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 5.1–5.2, tr. 172–181 | Mergesort, Quicksort | Mảng con trong đệ quy, pivot, bước trộn | Các thuật toán sắp xếp khác | Cao |
| 5.3, tr. 182–185 | Duyệt cây nhị phân | Nút đang thăm, ngăn xếp đệ quy | Pre/in/post-order, BFS | Cao |
| 5.4, tr. 186–191 | Nhân số nguyên lớn (Karatsuba), Strassen | Cách tách toán hạng, các tích con | Nhân thông thường | TB |
| 5.5, tr. 192–197 | Cặp điểm gần nhất, QuickHull | Tập điểm được chia đệ quy, dải giữa | Bản brute force (3.3) | Cao |

### Chương 6 — Biến đổi để trị

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 6.1, tr. 202–205 | Sắp xếp trước (presorting): kiểm tra phần tử trùng, tìm mode | Bước sắp xếp rồi bước quét | Bản brute force | Cao |
| 6.2, tr. 208–216 | Khử Gauss, phân rã LU | Ma trận mở rộng, các phép biến đổi dòng | Các biến thể khử | TB |
| 6.3, tr. 218–225 | Cây AVL, cây 2-3 | Các phép xoay, tách nút | AVL và 2-3 với nhau | Cao |
| 6.4, tr. 226–233 | Dựng heap, Heapsort | Heap ở dạng mảng và dạng cây, thao tác sift | Các thuật toán sắp xếp khác | Cao |
| 6.5, tr. 234–239 | Quy tắc Horner, lũy thừa nhị phân | Biến tích lũy, các bit của số mũ | Tính trực tiếp | Cao |

### Chương 7 — Đánh đổi không gian và thời gian

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 7.1, tr. 254 | Sắp xếp đếm (counting sort) | Mảng đếm, mảng phân phối | Các thuật toán sắp xếp so sánh | TB |
| 7.2, tr. 259–263 | **Horspool**, **Boyer-Moore** | Bảng dịch, mẫu trượt trên văn bản | Brute force (3.2) | Cao |
| 7.3, tr. 270–272 | Băm mở (dây chuyền), băm đóng (dò tuyến tính) | Các ô trong bảng băm, cách xử lý đụng độ | Hai cách với nhau, BST | Cao |
| 7.4, tr. 276 | Chèn vào B-tree | Tách nút | Cây 2-3 | TB–Cao |

### Chương 8 — Quy hoạch động

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 8.1, tr. 285 | Coin-row (dãy đồng xu, không lấy 2 đồng kề nhau) | Bảng 1 chiều, truy vết lời giải | Vét cạn, đệ quy có nhớ | Cao |
| 8.1 | Đổi tiền (change-making) | Bảng 1 chiều | Greedy (thấy rõ trường hợp greedy cho kết quả sai) | Cao |
| 8.1 | Robot nhặt xu (coin-collecting) | Bảng 2 chiều, đường đi | Vét cạn | Cao |
| 8.2, tr. 292 | **Cái túi 0/1** (bảng DP và memory function) | Bảng 2 chiều, cây lời gọi | Vét cạn (3.4), nhánh cận (12.2), xấp xỉ (12.3) | **Rất cao** |
| 8.3, tr. 297 | Cây BST tối ưu | Bảng DP, dựng lại cây | Vét cạn | Cao |
| 8.4, tr. 304–308 | **Warshall**, **Floyd** | Ma trận cập nhật theo từng k | DFS/BFS; chạy Dijkstra n lần | Cao |

### Chương 9 — Tham lam (Greedy)

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 9.1, tr. 318 | **Prim** | Cây khung lớn dần, các đỉnh biên | Kruskal | Cao |
| 9.2, tr. 325 | **Kruskal** (union-find) | Danh sách cạnh đã sắp, các tập hợp được gộp | Prim | Cao |
| 9.3, tr. 333 | **Dijkstra** | Nhãn khoảng cách, tập đỉnh đã chốt | Floyd (8.4), BFS (3.5) cho đồ thị không trọng số | Cao |
| 9.4, tr. 338 | Cây/mã **Huffman** | Hàng đợi ưu tiên, cây được ghép dần | Mã độ dài cố định | Cao |

### Chương 10 — Cải tiến lặp

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 10.1, tr. 346 | Simplex | Miền khả thi 2D, đỉnh đang xét | — | TB (nên giới hạn ở 2 biến) |
| 10.2, tr. 361 | Luồng cực đại (Ford-Fulkerson, đường tăng ngắn nhất) | Đồ thị thặng dư, đường tăng luồng | Ghép cặp hai phía | Cao |
| 10.3, tr. 372 | Ghép cặp cực đại trên đồ thị hai phía | Các đường tăng | Quy về bài toán luồng cực đại | Cao |
| 10.4, tr. 380 | Hôn nhân bền vững (Gale-Shapley) | Các vòng cầu hôn/từ chối | Đổi phía bên cầu hôn | Cao |

### Chương 11 — Giới hạn của thuật toán
Chủ yếu là lý thuyết (cận dưới, P/NP). Chỉ có **cây quyết định cho sắp xếp/tìm kiếm** (§11.2) là minh họa được, ở mức TB. Các phần còn lại không phù hợp để làm demo.

### Chương 12 — Đối phó với giới hạn

| § / trang | Thuật toán | Nội dung minh họa | So sánh với | Phù hợp |
|---|---|---|---|---|
| 12.1, tr. 425 | Backtracking: **n-Hậu** | Cây không gian trạng thái, các nhánh bị cắt | Vét cạn | Cao |
| 12.1, tr. 426 | Backtracking: Chu trình Hamilton | Cây các đường đi một phần | Vét cạn | Cao |
| 12.1, tr. 427 | Backtracking: Tổng tập con | Cây không gian trạng thái | Vét cạn, DP | Cao |
| 12.2, tr. 433 | Nhánh cận: Phân công | Cây có cận dưới, các nút bị cắt | Vét cạn (3.4) | Cao |
| 12.2, tr. 436 | Nhánh cận: Cái túi | Cây có cận trên | DP (8.2), vét cạn | Cao |
| 12.2, tr. 438 | Nhánh cận: TSP | Cây có cận dưới | Vét cạn, xấp xỉ | Cao |
| 12.3, tr. 443 | Xấp xỉ TSP: láng giềng gần nhất, twice-around-the-tree, Christofides | Hành trình được dựng dần | Nghiệm chính xác (nhánh cận) | Cao |
| 12.3, tr. 453 | Xấp xỉ cái túi (greedy theo tỉ lệ giá trị/khối lượng) | Thứ tự chọn đồ vật | DP, nhánh cận | TB–Cao |
| 12.4, tr. 460–464 | Chia đôi, dây cung (false position), Newton | Khoảng nghiệm co lại, tiếp tuyến trên đồ thị | So sánh 3 cách | Cao |

---

## 3. Đề xuất: các đề tài dễ ghi điểm theo tiêu chí chấm

Tiêu chí 3 của đề cộng điểm cho việc **giải một bài toán bằng nhiều cách rồi so sánh**. Các nhóm sau có sẵn nhiều thuật toán ngay trong sách:

| Đề tài | Các thuật toán để so sánh (đều có trong sách) | Nhận xét |
|---|---|---|
| **Cái túi 0/1** | Vét cạn (3.4), DP và memory function (8.2), nhánh cận (12.2), greedy xấp xỉ (12.3) | Nhiều cách giải nhất, có đủ cả nghiệm chính xác và nghiệm xấp xỉ |
| **TSP** | Vét cạn (3.4), nhánh cận (12.2), láng giềng gần nhất, twice-around-the-tree (12.3) | So sánh được nghiệm chính xác với nghiệm xấp xỉ, rất trực quan trên bản đồ |
| **Đường đi ngắn nhất** | Dijkstra (9.3), Floyd (8.4), BFS (3.5) | Một nguồn so với mọi cặp đỉnh |
| **Cây khung nhỏ nhất** | Prim (9.1), Kruskal (9.2) | Cặp so sánh kinh điển, dễ làm |
| **So khớp chuỗi** | Brute force (3.2), Horspool, Boyer-Moore (7.2) | Dễ minh họa bảng dịch |
| **Sắp xếp** | Selection/Bubble (3.1), Insertion (4.1), Merge/Quick (5.1–5.2), Heap (6.4), Counting (7.1) | Phổ biến, nên dễ trùng đề tài với các bạn khác |
| **Phân công** | Vét cạn (3.4), nhánh cận (12.2) | Có thể tự làm thêm thuật toán Hungarian để mở rộng |
| **Tìm nghiệm phương trình** | Chia đôi, dây cung, Newton (12.4) | Có đồ thị đẹp, nhưng ít liên quan đến cấu trúc dữ liệu |
| **Tô màu đồ thị** *(bài cô nhắc)* | Tự cài: backtracking (theo khung 12.1), greedy/Welsh-Powell (theo gợi ý ở 12.3), vét cạn | Sách không có mã giả nên phải tự thiết kế; đúng dạng bài trong đề thi |
| **Nhân chuỗi ma trận / LCS** *(bài cô nhắc)* | Tự cài: DP (bảng), đệ quy có nhớ, vét cạn | Sách chỉ có ở dạng bài tập; bảng DP rất hợp để minh họa từng bước |

---

## 4. Những phần không nên chọn làm demo

- Chương 1–2: quy trình thiết kế thuật toán, ký hiệu tiệm cận, các bảng tốc độ tăng. Đây là khái niệm, không có quá trình từ Input đến Output để minh họa.
- §6.6: lý thuyết quy dẫn (reduction) và quy hoạch tuyến tính tổng quát.
- Chương 11: cận dưới, P/NP/NP-đầy đủ (trừ cây quyết định ở §11.2).
- §11.4: các vấn đề về sai số tính toán. Đây là ví dụ cảnh báo, không phải thuật toán.

---

*Nguồn: phân tích trực tiếp từ file PDF sách. Việc ba dạng bài (tô màu đồ thị, nhân chuỗi ma trận, LCS) chỉ có ở dạng bài tập đã được kiểm chứng bằng cách tìm kiếm trong toàn văn bản sách.*
