# Bộ testcase toàn bộ catalog

Mỗi bài toán `ready` trong `src/catalog/manifest.ts` có một thư mục `testcases/<problemId>/`
chứa các file JSON, mỗi file một ca: `{id, name, group, input, expected, note}`. `expected` là
kết quả tham chiếu tính từ `checker.ts` của bài toán đó (null khi không áp dụng, ví dụ ca
`invalid`); `group` là một trong sáu nhóm dùng chung toàn catalog:

- `normal` — dữ liệu điển hình
- `edge` — trường hợp biên (rỗng, 0, một phần tử, …)
- `small` — dữ liệu nhỏ kiểm tra tay được
- `large` — dữ liệu lớn, dùng đo hiệu năng
- `special` — trường hợp đặc biệt (ví dụ tham lam cho kết quả sai, nhiều nghiệm tối ưu)
- `invalid` — đầu vào phải bị bộ parse từ chối (`expected` luôn là `null`)

knapsack-01 có thêm 8 ca `generated-large-201..208.json` (seed cố định) để đo hiệu năng ngoài
trang `/testcases/knapsack-01`.

Chạy lại từ `source-code` bằng `npm run export:testcases` (script đọc `cases.ts` của từng bài
toán trong manifest nên không cần sửa file này khi thêm bài toán mới — cứ thêm bài toán và chuyển
trạng thái `ready`).

## Theo bài toán (425 ca, 47 bài toán)

- **knapsack-01** (Bài toán cái túi 0/1) — 13 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 2, không hợp lệ 2
- **n-queens** (Bài toán n quân hậu) — 12 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 2
- **hamiltonian-circuit** (Chu trình Hamilton) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **subset-sum** (Bài toán tổng tập con) — 11 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **graph-coloring** (Tô màu đồ thị (bài toán Sở thú)) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **tsp** (Người du lịch (TSP)) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **assignment** (Bài toán phân công) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **matrix-chain** (Nhân chuỗi ma trận) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **lcs** (Dãy con chung dài nhất) — 11 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **string-matching** (So khớp chuỗi) — 13 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 2, không hợp lệ 2
- **closest-pair** (Cặp điểm gần nhất) — 11 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 2
- **convex-hull** (Bao lồi) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **coin-row** (Dãy đồng xu) — 12 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 2
- **change-making** (Đổi tiền tối thiểu đồng xu) — 11 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 2
- **coin-collecting** (Gom đồng xu trên lưới) — 11 ca: thông thường 2, biên 3, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **optimal-bst** (Cây tìm kiếm nhị phân tối ưu) — 10 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 1, không hợp lệ 1
- **linear-programming-2d** (Quy hoạch tuyến tính 2 chiều) — 12 ca: thông thường 2, biên 2, nhỏ 2, lớn 2, đặc biệt 3, không hợp lệ 1
- **gcd** (Ước chung lớn nhất (GCD)) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **fibonacci** (Số Fibonacci) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **search-sorted** (Tìm kiếm trên dãy đã sắp xếp) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **fake-coin** (Đồng xu giả) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **multiplication** (Nhân hai số lớn) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **josephus** (Bài toán Josephus) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **combinatorial-generation** (Sinh đối tượng tổ hợp) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **kth-smallest** (Phần tử nhỏ thứ k) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **polynomial-eval** (Tính giá trị đa thức) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **exponentiation** (Lũy thừa nhanh) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **matrix-multiplication** (Nhân ma trận) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **linear-system** (Giải hệ phương trình tuyến tính) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **root-finding** (Tìm nghiệm phương trình phi tuyến) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **nim** (Trò chơi Nim) — 7 ca: thông thường 2, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **sorting** (Sắp xếp) — 13 ca: thông thường 2, biên 5, nhỏ 1, lớn 1, đặc biệt 2, không hợp lệ 2
- **heap-construction** (Xây dựng đống (heap)) — 11 ca: thông thường 2, biên 3, nhỏ 1, lớn 1, đặc biệt 2, không hợp lệ 2
- **binary-tree-traversal** (Duyệt cây nhị phân) — 12 ca: thông thường 2, biên 4, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 3
- **balanced-search-tree** (Cây tìm kiếm cân bằng) — 11 ca: thông thường 2, biên 3, nhỏ 1, lớn 1, đặc biệt 2, không hợp lệ 2
- **dictionary-hashing** (Từ điển bằng bảng băm) — 11 ca: thông thường 2, biên 4, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 2
- **element-uniqueness** (Kiểm tra phần tử duy nhất) — 14 ca: thông thường 2, biên 4, nhỏ 2, lớn 2, đặc biệt 2, không hợp lệ 2
- **graph-traversal** (Duyệt đồ thị) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **topological-sort** (Sắp xếp tô pô) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **transitive-closure** (Bao đóng bắc cầu) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **all-pairs-shortest-path** (Đường đi ngắn nhất mọi cặp) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **single-source-shortest-path** (Đường đi ngắn nhất một nguồn) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **minimum-spanning-tree** (Cây khung nhỏ nhất) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **huffman-coding** (Mã hoá Huffman) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **maximum-flow** (Luồng cực đại) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **bipartite-matching** (Ghép cặp trên đồ thị hai phía) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
- **stable-marriage** (Hôn nhân bền vững) — 6 ca: thông thường 1, biên 1, nhỏ 1, lớn 1, đặc biệt 1, không hợp lệ 1
