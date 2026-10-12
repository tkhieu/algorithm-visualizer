import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';

export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  // large=9 khớp giới hạn an toàn của tsp/exhaustive (SAFE_MAX=9, xem run.ts) — thuật toán
  // dùng làm chuẩn đối chiếu ở trang Ca kiểm thử (TestcasePage.tsx). Không dùng cỡ lớn hơn:
  // tsp/branch-and-bound (SAFE_MAX=10) có vẻ "nhanh hơn" nhưng thời gian chạy phụ thuộc dữ
  // liệu — một vài bố cục điểm khiến việc cắt nhánh kém hiệu quả và mất hàng chục giây, trong
  // khi vét cạn luôn mất ~20ms với n=9 bất kể seed vì không phụ thuộc dữ liệu.
  const n = {tiny: 4, small: 6, medium: 8, large: 9}[size];
  const points = Array.from({length: n}, () => ({
    x: Math.round((r() * 200 - 100) * 10) / 10,
    y: Math.round((r() * 200 - 100) * 10) / 10,
  }));
  return {points};
}
