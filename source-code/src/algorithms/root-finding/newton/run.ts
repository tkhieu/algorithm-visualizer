import type { RunContext } from '../../../core/contracts';
import { f, type Input, type Output } from '../../../problems/root-finding/definition';
import { finish, type VisualState } from '../shared';
const MAX_ITERATIONS = 100;
export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  let x = (input.left + input.right) / 2;
  let converged = false;
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    if (signal.aborted) throw new Error('Đã huỷ');
    // Đạo hàm luôn dương vì c > 0, nên bước Newton xác định ở mọi lần lặp.
    const value = f(x, input.c, input.d),
      derivative = 3 * x * x + input.c,
      next = x - value / derivative;
    rec.count('assign');
    rec.step(
      'tangent',
      `Lần ${iteration + 1}: tiếp tuyến tại ${x} có đạo hàm ${derivative}, nghiệm mới ${next}.`,
      (d) => {
        d.tangent = { from: { x, y: value }, to: { x: next, y: 0 } };
        d.iterates?.push({ x: next, y: f(next, input.c, input.d) });
        d.note = `Newton: ${next}`;
      }
    );
    if (Math.abs(next - x) <= input.tolerance / 2) {
      x = next;
      converged = true;
      break;
    }
    x = next;
  }
  // Với c>0 (hàm tăng ngặt theo contract), Newton luôn hội tụ rất nhanh trên mọi tham số hợp lệ;
  // nhánh này chỉ là lưới an toàn nếu có ai gọi run() với input ngoài hợp đồng (ví dụ c≤0).
  if (!converged)
    rec.step(
      'no-converge',
      `Không hội tụ sau ${MAX_ITERATIONS} lần lặp (sai số yêu cầu ${input.tolerance}); ` +
        `dùng x ≈ ${x} làm xấp xỉ cuối.`,
      (d) => {
        d.note = `Không hội tụ, xấp xỉ cuối: ${x}`;
      }
    );
  return finish(rec, input, x);
}
