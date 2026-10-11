# Đề bài Bài tập lớn — CS112 (Phân tích & Thiết kế Thuật toán)

> Đây là bản phân rã lại đề bài mà giảng viên đã giao, để dễ đọc và dễ theo dõi tiến độ.
> Nội dung gốc được giữ đầy đủ. Các phần ghi **[Gợi ý]** là phần diễn giải thêm cho rõ, không phải yêu cầu của cô.

---

## 0. Quy định bắt buộc (đọc trước)

| Quy định | Chi tiết |
|---|---|
| Hạn nộp | **Không nhận bài nộp trễ.** **Không gia hạn.** |
| Điểm | **Không giải quyết xin điểm qua môn**, với bất kỳ lý do gì. |
| Thái độ | Không đổ lỗi cho đề, không than thở, không dùng hoàn cảnh để gây áp lực hay xin thông cảm. |
| Liên hệ | Cô **không trả lời tin nhắn riêng**. Có câu hỏi thì **post công khai trên group lớp**. |
| Link nộp bài | Nếu dùng link (Drive, …): link phải **hoạt động** và cô phải **có quyền truy cập toàn bộ** ngay khi nộp. Không chấp nhận chuyện cô phải xin quyền truy cập sau hạn nộp. |

---

## 1. Tóm tắt một câu

Chọn **một bài toán** thuộc nội dung môn học, xây dựng **một demo có giao diện** cho phép người dùng **nhập Input → xem từng bước thuật toán chạy → xem Output**, kèm **bộ testcase**, **video demo** và **report** trình bày đầy đủ.

---

## 2. Yêu cầu về bài toán

### 2.1. Nguồn chọn bài toán (chọn 1)

- Một ví dụ đã trình bày trong các buổi học.
- Một problem trên **Wecode**.
- Một ví dụ/bài toán trong **tài liệu tham khảo trên e-learning**.
- Hoặc một bài toán **tương đương, phù hợp với nội dung môn học**.

> **[Gợi ý]** Cô có nhắc tới các dạng đã ôn tập: **tô màu đồ thị** (bài Sở thú), **nhân chuỗi ma trận**, **LCS**… Đây là các dạng phù hợp với môn.

### 2.2. Demo phải có giao diện và cho phép

1. **Nhập dữ liệu đầu vào (Input).**
2. **Theo dõi từng bước thực hiện của thuật toán.** ← yêu cầu cốt lõi
3. **Xem kết quả đầu ra (Output).**

> Demo **không chỉ** cho thấy kết quả cuối cùng, mà phải cho người dùng **quan sát được quá trình giải qua từng bước**.

---

## 3. Sản phẩm cần nộp

Nộp **một thư mục** gồm **4 thư mục con**. Nếu dung lượng lớn thì upload lên dịch vụ lưu trữ và nộp link (xem quy định về link ở mục 0).

```
<Thư mục nộp bài>/
├── 1-Source-code/      # Toàn bộ mã nguồn hệ thống
├── 2-Video-demo/       # Video demo
├── 3-Testcase/         # Bộ dữ liệu thử nghiệm
└── 4-Report/           # File nguồn (Word hoặc LaTeX) + file PDF
```

> **[Gợi ý]** Tên thư mục con ở trên chỉ là ví dụ; quan trọng là đủ 4 phần theo đúng thứ tự cô liệt kê.

### 3.1. Source code
- **Toàn bộ** mã nguồn của hệ thống.

### 3.2. Video demo
Video phải ghi lại:
- [ ] Chạy thử hệ thống.
- [ ] Nhập dữ liệu và giải.
- [ ] Giới thiệu **đầy đủ các chức năng**.
- [ ] Giới thiệu **các thành phần / thông tin hiển thị trên giao diện**.
- [ ] Minh họa **quá trình hệ thống thực hiện thuật toán** và trả về kết quả.

Không bắt buộc thuyết minh bằng giọng nói: có thể dùng **text trên màn hình** hoặc **video không lời**.

### 3.3. Bộ testcase
- Dùng để kiểm thử hệ thống.
- Phải **đủ đa dạng, đủ lớn, đủ phức tạp** để kiểm tra các trường hợp khác nhau của bài toán.

### 3.4. Report
Nộp **2 loại file**:
- File nguồn: **Word** hoặc **LaTeX**.
- File **PDF**.

---

## 4. Nội dung Report (theo thứ tự)

Chương mục do SV tự chia, nhưng phải có đủ các nội dung sau.

| # | Phần | Phải trình bày |
|---|---|---|
| 1 | **Trang bìa** | — |
| 2 | **Mục lục** | Tự phân chương mục. |
| 3 | **Giới thiệu bài toán** | Lý do **thực sự** chọn bài (vd: nghe cô giảng, AI đề xuất…); nguồn gốc bài toán (nếu có); ứng dụng thực tế (nếu có). |
| 4 | **Mô tả bài toán** | Viết giống cách cô mô tả problem trên Wecode / câu hỏi trong đề thi / ví dụ trên lớp. |
| 5 | **Mô hình bài toán** | **Input**, **Output**, **điều kiện / ràng buộc**, **một số ví dụ Input/Output**. |
| 6 | **Thiết kế CTDL & Thuật toán** | Xem mục 4.1. |
| 7 | **Ví dụ minh họa từng bước** | Xem mục 4.2. |
| 8 | **Tường thuật quá trình thiết kế & xây dựng** ⭐ **QUAN TRỌNG NHẤT** | Xem mục 4.3. |
| 9 | **Thiết kế thực nghiệm** | Xem mục 4.4. |
| 10 | **Đánh giá** | Xem mục 4.5. |

### 4.1. Thiết kế Cấu trúc dữ liệu và Thuật toán
- [ ] **Cấu trúc dữ liệu** được dùng: các thành phần dữ liệu và cách tổ chức.
- [ ] **Phân tích đặc trưng** của bài toán (lên ý tưởng giải).
- [ ] **Thuật toán / chiến lược giải.**
- [ ] **Phân tích độ phức tạp.**
- [ ] Tham khảo hoặc copy từ đâu thì phải **trích dẫn rõ ràng**.

> **[Gợi ý]** Cô nhận xét phần thiết kế thuật toán trong bài thi của nhiều bạn rất yếu, có bài gần như bỏ trắng. Đây là phần nên đầu tư kỹ nhất về mặt chuyên môn.

### 4.2. Ví dụ minh họa các bước thực hiện thuật toán
Chọn **một ví dụ đủ phức tạp**, trình bày chi tiết:
- [ ] **Trạng thái dữ liệu** ở từng bước.
- [ ] **Các thao tác** được thực hiện.
- [ ] **Sự thay đổi dữ liệu** sau mỗi bước.
- [ ] **Kết quả cuối cùng.**
- [ ] Nội dung này phải **khớp với phần minh họa từng bước trên demo**.

### 4.3. Tường thuật quá trình thiết kế và xây dựng ⭐ QUAN TRỌNG NHẤT
- [ ] Quá trình **thiết kế chức năng** và **thiết kế giao diện**.
- [ ] Quá trình **xây dựng và hoàn thiện từng chức năng** (đặc biệt phần xử lý giải bài toán).

**Nếu có dùng AI**, phải tường thuật rõ:
- [ ] Dùng **công cụ / framework / thư viện / model** nào.
- [ ] Dùng AI ở **công đoạn** nào.
- [ ] **Prompt** đã dùng.
- [ ] **Kết quả** nhận được.
- [ ] **Vấn đề gặp phải** và **cách giải quyết**.
- [ ] SV đã **kiểm tra, chỉnh sửa, phát triển tiếp** kết quả như thế nào.

> ❌ Không được chỉ ghi kiểu *"sử dụng ChatGPT để viết code"*. Phải thể hiện được **quá trình dùng công cụ** và **quá trình kiểm chứng / chỉnh sửa kết quả**.

> **[Gợi ý]** Nên ghi nhật ký (log prompt, ảnh chụp màn hình, các phiên bản code) **ngay trong lúc làm**, đừng để cuối kỳ mới nhớ lại.

### 4.4. Thiết kế thực nghiệm
Trình bày cách xây dựng bộ testcase:
- [ ] **Cách tạo** testcase.
- [ ] **Kích thước** dữ liệu.
- [ ] **Mức độ phức tạp.**
- [ ] **Các trường hợp cần kiểm thử.**
- [ ] **Trường hợp đặc biệt / biên.**
- [ ] Cách đảm bảo testcase **cover** được các trường hợp có thể xảy ra.

Có thể phân nhóm testcase, ví dụ:

| Nhóm | Mô tả |
|---|---|
| Thông thường | Dữ liệu điển hình |
| Biên | Giá trị min/max, rỗng, 1 phần tử… |
| Dữ liệu nhỏ | Kiểm tra tay được |
| Dữ liệu lớn | Kiểm tra hiệu năng |
| Đặc biệt | Các cấu hình đặc thù của bài toán |
| Không hợp lệ | Nếu hệ thống có xử lý input sai |

### 4.5. Đánh giá
Trình bày cách đánh giá hệ thống, ví dụ:
- [ ] Hệ thống có trả về **kết quả đúng** không.
- [ ] Các testcase **đạt / không đạt**.
- [ ] **Thời gian thực hiện.**
- [ ] **Tính chính xác.**
- [ ] **Tính trực quan** của giao diện.
- [ ] **Khả năng minh họa từng bước** của thuật toán.
- [ ] **Hạn chế** của hệ thống.
- [ ] **Hướng phát triển** (nếu có).

---

## 5. Yêu cầu chung: tính thống nhất

Toàn bộ sản phẩm phải liên kết chặt chẽ theo chuỗi:

```
Bài toán → Mô hình → Cấu trúc dữ liệu → Thuật toán → Demo → Testcase → Thực nghiệm → Đánh giá
```

Ví dụ: mô hình trong report phải đúng với Input/Output trên demo; ví dụ minh họa trong report phải khớp với bước chạy trên demo; testcase phải dùng được trên chính hệ thống đã demo.

---

## 6. Tiêu chí chấm điểm

| # | Tiêu chí | Được thể hiện qua |
|---|---|---|
| 1 | **Mức độ đáp ứng yêu cầu** | Nộp đủ các sản phẩm; report có đủ các nội dung bắt buộc. |
| 2 | **Mức độ đầu tư** | Độ hoàn thiện của demo; chất lượng giao diện; độ chi tiết của phần minh họa thuật toán; chất lượng và quy mô bộ testcase; độ sâu phân tích trong report; khả năng xử lý các trường hợp khác nhau. |
| 3 | **Tính sáng tạo & mức độ phát triển bài toán** | Không dừng ở phiên bản cơ bản (xem bên dưới). |

### Gợi ý phát triển để đạt điểm sáng tạo (do cô đề xuất)
- Mở rộng bài toán với **nhiều trường hợp / nhiều tham số** hơn.
- Bổ sung chức năng cho phép **người dùng tương tác**.
- Phát triển **các biến thể** của bài toán.
- **Giải bằng nhiều cách** (kết hợp nhiều thuật toán/CTDL) rồi **so sánh**.
- Xây dựng các **chế độ minh họa / trực quan hóa** quá trình giải.
- Bổ sung chức năng **so sánh các thuật toán**.
- Các ý tưởng khác giúp demo **có chiều sâu và khác biệt**.

> Không bắt buộc bài toán phải thật phức tạp, nhưng bài chỉ dừng ở **mức tối thiểu** sẽ khó thể hiện được mức đầu tư và sáng tạo cao.

---

## 7. Lời nhắn của cô

- Phần thiết kế thuật toán trong bài thi của khá nhiều bạn chưa tốt, có bài gần như bỏ trắng, dù các dạng bài (tô màu đồ thị, nhân chuỗi ma trận, LCS…) **không mới** và đã được ôn tập kỹ.
- Bài tập lớn này là **cơ hội cuối cùng** để cải thiện kết quả học phần, đặc biệt với các bạn **có nguy cơ không qua môn** hoặc muốn lên **Khá / Giỏi**.
- Hãy làm **nghiêm túc**, đừng xem đây là một bài demo làm cho có.

---

## 8. Checklist nộp bài tổng hợp

**Sản phẩm**
- [ ] `Source code`: đầy đủ, chạy được.
- [ ] `Video demo`: đủ 5 nội dung ở mục 3.2.
- [ ] `Testcase`: đa dạng, có phân nhóm, có dữ liệu lớn và trường hợp biên.
- [ ] `Report`: có file nguồn (Word/LaTeX) **và** PDF.
- [ ] Link (nếu có) đã mở quyền truy cập và đã thử bằng một tài khoản khác.

**Demo**
- [ ] Có giao diện.
- [ ] Nhập được Input.
- [ ] Xem được **từng bước** thuật toán.
- [ ] Xem được Output.
- [ ] Có ít nhất một tính năng mở rộng (biến thể, so sánh thuật toán, chế độ trực quan hóa…).

**Report**
- [ ] Trang bìa, Mục lục.
- [ ] Giới thiệu bài toán (lý do thật, nguồn gốc, ứng dụng).
- [ ] Mô tả bài toán (kiểu Wecode).
- [ ] Mô hình: Input / Output / Ràng buộc / Ví dụ.
- [ ] Thiết kế CTDL & thuật toán, độ phức tạp, trích dẫn nguồn.
- [ ] Ví dụ minh họa từng bước, **khớp với demo**.
- [ ] ⭐ Tường thuật quá trình thiết kế & xây dựng, kể cả chi tiết việc dùng AI.
- [ ] Thiết kế thực nghiệm.
- [ ] Đánh giá: đúng/sai, thời gian, trực quan, hạn chế, hướng phát triển.

**Nộp đúng hạn — không có ngoại lệ.**
