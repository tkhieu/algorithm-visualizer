import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm } from '../../algorithms/change-making/dp';
import { check } from './checker';

it('BFS theo số đồng xu kiểm chứng DP ở hệ tiền không chuẩn', () => {
  const input = { amount: 12, coins: [1, 5, 7] };
  let frontier = new Set([0]),
    depth = 0;
  while (!frontier.has(input.amount)) {
    frontier = new Set(
      [...frontier].flatMap((sum) => input.coins.map((coin) => sum + coin).filter((sum) => sum <= input.amount)),
    );
    depth++;
  }
  const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  expect(output.count).toBe(depth);
  expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
});
