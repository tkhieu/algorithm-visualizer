import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as dp } from '../../algorithms/coin-collecting/dp';
import { algorithm as exhaustive } from '../../algorithms/coin-collecting/exhaustive-paths';
import { check } from './checker';

it('liệt kê đường đi phải/xuống kiểm chứng hai thuật toán', () => {
  const grid = [
    [true, false, true],
    [false, true, false],
    [true, false, true],
  ];
  function paths(row: number, col: number): number[] {
    const coin = grid[row][col] ? 1 : 0;
    if (row === 2 && col === 2) return [coin];
    return [...(row < 2 ? paths(row + 1, col) : []), ...(col < 2 ? paths(row, col + 1) : [])].map((v) => v + coin);
  }
  const best = Math.max(...paths(0, 0));
  for (const algo of [dp, exhaustive]) {
    const output = algo.run({ grid }, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.value).toBe(best);
    expect(check({ grid }, output)).toMatchObject({ ok: true, optimal: true });
  }
});
