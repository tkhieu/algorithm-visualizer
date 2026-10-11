# Bộ testcase cái túi 0/1

Mỗi JSON gồm input và expectedOptimum. Nhóm normal: dữ liệu điển hình; edge: rỗng, sức chứa 0, một vật; small: kiểm tra tay; large: hiệu năng; special: tham lam sai hoặc nhiều nghiệm; invalid: đầu vào phải bị từ chối, expectedOptimum là null.

Các ca generated-large dùng seed 201–208, sinh xác định. Chạy lại từ source-code bằng `npm run export:testcases`.
