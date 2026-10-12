import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
// Breadth-first search by number of coins is independent of the table-filling algorithm.
export function optimum(amount: number, coins: number[]): number {
  const visited = new Set<number>([0]);
  let frontier = [0],
    depth = 0;
  while (frontier.length > 0) {
    if (frontier.includes(amount)) return depth;
    const next: number[] = [];
    for (const sum of frontier)
      for (const coin of coins) {
        const value = sum + coin;
        if (value <= amount && !visited.has(value)) {
          visited.add(value);
          next.push(value);
        }
      }
    frontier = next;
    depth++;
  }
  return Infinity;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const coinSet = new Set(input.coins);
  if (output.coins.some((c) => !coinSet.has(c))) return { ok: false, reason: 'Dùng mệnh giá không có trong danh sách' };
  if (output.coins.length !== output.count) return { ok: false, reason: 'Số lượng không khớp danh sách đồng xu' };
  const sum = output.coins.reduce((s, c) => s + c, 0);
  if (sum !== input.amount) return { ok: false, reason: 'Tổng không bằng số tiền cần đổi' };
  const best = optimum(input.amount, input.coins);
  return { ok: true, optimal: output.count === best, score: output.count, ratio: best === 0 ? 1 : best / output.count };
}
