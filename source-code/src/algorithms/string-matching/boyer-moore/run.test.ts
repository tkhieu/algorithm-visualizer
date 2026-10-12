import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check } from '../../../problems/string-matching/checker';
import { generate } from '../../../problems/string-matching/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('Boyer–Moore đúng với vét cạn tham chiếu trên 150 seed', () => {
  for (let seed = 1; seed <= 150; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(check(input, output)).toMatchObject({ ok: true });
  }
});

it('tìm đúng các lần khớp chồng lấp (không bỏ sót)', () => {
  const input = { text: 'AAAAA', pattern: 'AA' };
  const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  expect(check(input, output)).toMatchObject({ ok: true });
  expect([...output.positions].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
});

it('trace tua lại đúng: số bước "match" khớp số vị trí trả về', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output, steps } = traceRun(algorithm, input);
    const matchSteps = steps.filter((s) => s.lineId === 'match');
    expect(matchSteps.length).toBe(output.positions.length);
  }
});

it('bước dịch giải thích quy tắc ký tự xấu', () => {
  const { steps } = traceRun(algorithm, { text: 'ABCABCDABABCD', pattern: 'ABCD' });
  const shiftStep = steps.find((s) => s.lineId === 'shift-by' && s.explain.includes('xấu'));
  expect(shiftStep).toBeDefined();
});

it('dùng cả bảng hậu tố tốt và chọn bước dịch lớn hơn', () => {
  const { steps, store } = traceRun(algorithm, { text: 'ABAAABCDABCD', pattern: 'ABCD' });
  const first = store.seek(1);
  expect(first.shiftTable).toMatchObject({ A: 0, B: 1, C: 2, D: 3 });
  expect(first.goodSuffixTable).toHaveLength(5);
  expect(steps[0].explain).toContain('bảng hậu tố tốt:');
  expect(steps.some((step) => step.lineId === 'shift-by' && step.explain.includes('hậu tố tốt'))).toBe(true);
  expect(store.seek(store.length).chosenShift).toBeGreaterThan(0);
});

it('hậu tố tốt thắng ký tự xấu và dịch đúng hai ô', () => {
  const { output, steps } = traceRun(algorithm, { text: 'CBABABAB', pattern: 'ABAB' });
  expect(output.positions).toEqual([2, 4]);
  const shift = steps.find((step) => step.lineId === 'shift-by');
  expect(shift?.explain).toContain('Bảng ký tự xấu: 1');
  expect(shift?.explain).toContain('bảng hậu tố tốt: 2');
  expect(shift?.explain).toContain('max = 2');
});
