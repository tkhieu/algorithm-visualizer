# Xuất báo cáo sang Word / PDF

`docs/bao-cao.md` vẫn là nguồn duy nhất của nội dung báo cáo. Thư mục này chỉ
chứa script để dựng lại `bao-cao.docx` và `bao-cao.pdf` từ file Markdown đó.

## Dựng lại (một lệnh)

```bash
report/build.sh
```

Lệnh này sẽ:

1. Tạo (nếu chưa có) một virtualenv cục bộ `report/.venv` và cài `python-docx`
   vào đó (không cài gì ra ngoài project).
2. Chạy `report/build_docx.py` để parse `docs/bao-cao.md` và dựng
   `report/bao-cao.docx`: trang bìa, mục lục (TOC field thật), heading đánh số
   theo đúng cấu trúc chương/mục trong md, toàn bộ bảng, khối mã giả, chú
   thích `[ẢNH: …]` (giữ nguyên văn, không viết lại chữ), và tô vàng toàn bộ
   các placeholder dạng `[...]` sinh viên cần điền — `[SV XÁC NHẬN …]`,
   `[SV ĐIỀN …]`, `[CHƯA LÀM …]`, `[ẢNH: …]`, `[Họ tên – MSSV]` — kể cả dấu
   ngoặc vuông, để sinh viên dễ tìm. Các dấu ngoặc vuông bình thường khác
   (chỉ số mảng trong code như `color[v]`, hay khoảng số như `[0, 1]`) không
   bị tô.
   - Đoạn mở đầu của bản nháp md (khối `>` bắt đầu bằng "Bản nháp Markdown để
     review trước khi dựng file .docx…", nằm giữa dòng tiêu đề `#` và heading
     `## Trang bìa`) là ghi chú cho người dựng file, không phải nội dung báo
     cáo — script bỏ qua hẳn đoạn này, không đưa vào `.docx`/`.pdf` dưới bất
     kỳ hình thức nào. Hai heading `## Trang bìa` và `## Mục lục` cũng không
     render như heading thường: chúng được thay bằng trang bìa thật và field
     Mục lục thật tương ứng (dòng "(Word tự sinh từ các heading.)" dưới
     `## Mục lục` bị bỏ qua vì đã được thay bằng field đó).
3. Dùng LibreOffice (`soffice`, chạy ẩn qua UNO) để cập nhật field Mục lục
   (để cả file .docx lẫn PDF xuất ra đều hiện mục lục đã điền sẵn — sinh viên
   vẫn có thể bấm F9 trong Word để cập nhật lại sau khi sửa nội dung), rồi
   xuất `report/bao-cao.pdf`.

Yêu cầu máy: `python3`, và một bản LibreOffice (`soffice`) có kèm module
Python `uno`/`unohelper` (thường nằm cạnh binary `soffice` của hệ thống, ví
dụ `/usr/bin/python3` trên Fedora). `build.sh` tự dò các đường dẫn Python đó.

## Khi sửa báo cáo

Luôn sửa `docs/bao-cao.md`, không sửa trực tiếp `.docx`/`.pdf`, rồi chạy lại
`report/build.sh`. Hai file đầu ra sẽ được ghi đè.

## Các file trong thư mục này

- `build_docx.py` — chuyển `docs/bao-cao.md` thành `bao-cao.docx` bằng
  `python-docx`. Đây là một script chuyển đổi viết riêng cho cấu trúc của
  đúng file báo cáo này (trang bìa, các chương, các dạng bảng/khối mã) —
  không phải một bộ chuyển Markdown tổng quát.
- `update_fields_and_export.py` — mở `bao-cao.docx` bằng LibreOffice chạy
  nền (UNO), cập nhật field Mục lục, lưu lại `.docx`, rồi xuất `.pdf`. Chạy
  bằng Python hệ thống (có module `uno`), không phải venv.
- `build.sh` — gói hai bước trên thành một lệnh.
- `requirements.txt` — phụ thuộc Python cho venv (`python-docx`).
- `bao-cao.docx`, `bao-cao.pdf` — sản phẩm cuối, sinh viên nộp hai file này.

## Việc sinh viên vẫn phải tự làm trong file .docx

Script chỉ dựng khung và giữ đúng nội dung từ bản nháp Markdown. Mọi placeholder
tô vàng (`[SV XÁC NHẬN …]`, `[SV ĐIỀN …]`, `[CHƯA LÀM …]`, `[Họ tên – MSSV]`)
vẫn cần sinh viên tự điền/xác nhận trước khi nộp — xem `docs/bao-cao.md` để
biết chi tiết từng chỗ cần sửa, rồi chèn các ảnh chụp màn hình vào các vị trí
`[ẢNH: …]` (cũng tô vàng).

## Về font Times New Roman

`bao-cao.docx` yêu cầu font "Times New Roman" (thân bài lẫn heading). Máy dựng
file này không cài Times New Roman (và không `sudo` cài font hệ thống), nên
khi xuất PDF, LibreOffice tự thay bằng **Liberation Serif** — một font có cùng
kích thước ký tự (metric-compatible) với Times New Roman, nên bố cục/số trang
không đổi, chỉ khác đôi chút về nét chữ. File `.docx` vẫn yêu cầu đúng "Times
New Roman"; mở trên máy có cài font đó (Word trên Windows/macOS gần như luôn
có sẵn) sẽ hiện đúng font. Nếu muốn một bản PDF dùng đúng Times New Roman thật
(không phải bản thay thế), sinh viên có thể mở `bao-cao.docx` trong Word rồi
"Save as PDF" / "Export to PDF" trên máy đó, thay vì dùng `report/build.sh`.
