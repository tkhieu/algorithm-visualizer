import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check, optimum } from '../../../problems/coin-collecting/checker';
import { generate } from '../../../problems/coin-collecting/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('đúng với công thức quy hoạch động tham chiếu trên 150 seed', () => {
  for (let seed = 1; seed <= 150; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.value).toBe(optimum(input.grid));
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
  }
});

it('lưới 1x1 trả về đúng', () => {
  const output = algorithm.run(
    { grid: [[true]] },
    { rec: new MetricsRecorder(), signal: new AbortController().signal },
  );
  expect(output).toEqual({ value: 1, path: [[0, 0]] });
});

it('trace tua lại đúng: đường đi cuối khớp output', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output } = traceRun(algorithm, input);
    expect(output.path[0]).toEqual([0, 0]);
    expect(output.path.at(-1)).toEqual([input.grid.length - 1, input.grid[0].length - 1]);
  }
});

it('bước điền bảng có giải thích công thức', () => {
  const { steps } = traceRun(algorithm, {
    grid: [
      [false, true],
      [true, false],
    ],
  });
  const fillStep = steps.find((s) => s.lineId === 'fill');
  expect(fillStep?.explain).toContain('max(');
});

it('mỗi trạng thái trung gian chỉ đánh dấu một ô đang tính', () => {
  const { steps, store } = traceRun(algorithm, {
    grid: [
      [true, false],
      [false, true],
    ],
  });
  for (let i = 1; i <= steps.length; i++) {
    const state = store.seek(i);
    expect(state.marks.filter((mark) => mark.role === 'current')).toHaveLength(i <= 4 ? 1 : 0);
  }
});
