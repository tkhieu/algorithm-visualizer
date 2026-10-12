import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as brute } from '../../algorithms/closest-pair/brute-force';
import { algorithm as divide } from '../../algorithms/closest-pair/divide-and-conquer';
import { check } from './checker';
import { generate } from './generators';

// bruteForceClosest trong checker.ts dùng đúng cấu trúc hai vòng lặp lồng + Math.hypot như
// algorithms/closest-pair/brute-force/run.ts — nên check() không phải một oracle độc lập với
// thuật toán vét cạn: một lỗi chung (ví dụ sai dấu so sánh, sai công thức khoảng cách) sẽ lọt qua
// cả hai. flatMap/Math.min dưới đây tính khoảng cách nhỏ nhất bằng một cách biểu diễn khác hẳn
// (không vòng lặp lồng tay, không biến tích luỹ best/bi/bj) để thực sự độc lập.
function flatMapMinOracle(points: { x: number; y: number }[]): number {
  return Math.min(
    ...points.flatMap((a, i) => points.slice(i + 1).map((b) => Math.hypot(a.x - b.x, a.y - b.y))),
  );
}

it('quét mọi cặp độc lập xác nhận hai thuật toán kể cả điểm trùng', () => {
  const points = [
    { x: 9, y: 9 },
    { x: 0, y: 0 },
    { x: 3, y: 4 },
    { x: 9, y: 9 },
  ];
  const expected = flatMapMinOracle(points);
  for (const algo of [brute, divide]) {
    const output = algo.run({ points }, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.distance).toBe(expected);
    expect(check({ points }, output)).toMatchObject({ ok: true, optimal: true });
  }
});

it('vét cạn khớp oracle flatMap/Math.min độc lập trên 150 seed, mọi cỡ', () => {
  for (let seed = 1; seed <= 150; seed++) {
    for (const size of ['tiny', 'small', 'medium'] as const) {
      const input = generate(seed, size);
      const expected = flatMapMinOracle(input.points);
      const output = brute.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
      expect(output.distance, `seed ${seed} size ${size}`).toBeCloseTo(expected, 9);
    }
  }
});
