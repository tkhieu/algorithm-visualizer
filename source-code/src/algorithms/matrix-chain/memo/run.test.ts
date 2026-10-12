import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalCost} from '../../../problems/matrix-chain/checker';
import {generate} from '../../../problems/matrix-chain/generators';

describe('matrix-chain/memo', () => {
  it('tìm đúng chi phí tối ưu trên nhiều seed và cỡ', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.cost).toBe(optimalCost(input.dims));
      }
    }
  });

  it('khớp ví dụ kinh điển (7500)', () => {
    const output = algorithm.run({dims: [10, 100, 5, 50]}, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output.cost).toBe(7500);
  });

  it('không giải lại một đoạn [i,j] đã nhớ (số lần bước memoize bằng số đoạn khác nhau)', () => {
    const input = {dims: [30, 35, 15, 5, 10, 20, 25]};
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    algorithm.run(input, {rec, signal: new AbortController().signal});
    const memoizeSteps = rec.steps.filter((s) => s.lineId === 'memoize');
    const n = input.dims.length - 1;
    const segments = (n * (n - 1)) / 2;
    expect(memoizeSteps.length).toBe(segments);
  });

  it('trace tua lại đúng, có xuất hiện lượt lấy từ bảng nhớ, và khớp output cuối', () => {
    const input = {dims: [30, 35, 15, 5, 10, 20, 25]};
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(rec.steps.length);
    expect(final.matrix[1][6]).toBe(output.cost);
    expect(rec.steps.some((s) => s.explain.includes('đã có trong bảng nhớ'))).toBe(true);
  });
});
