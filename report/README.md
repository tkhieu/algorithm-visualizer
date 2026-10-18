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
   thích `[ẢNH: …]`, và tô vàng mọi placeholder `[SV XÁC NHẬN]` /
   `SV ĐIỀN` / `CHƯA LÀM` để sinh viên dễ tìm.
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

Script chỉ dựng khung và giữ đúng nội dung từ bản nháp Markdown. Mọi chỗ
`[SV XÁC NHẬN]` (được tô vàng) vẫn cần sinh viên tự điền/xác nhận trước khi
nộp — xem `docs/bao-cao.md` để biết chi tiết từng chỗ cần sửa, rồi chèn các
ảnh chụp màn hình vào các vị trí `[Chèn ảnh: …]`.
