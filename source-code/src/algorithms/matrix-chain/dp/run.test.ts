import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalCost} from '../../../problems/matrix-chain/checker';
import {generate} from '../../../problems/matrix-chain/generators';

describe('matrix-chain/dp', () => {
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

  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {dims: [10, 100, 5, 50]};
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(rec.steps.length);
    expect(final.matrix[1][3]).toBe(output.cost);
    expect(rec.steps.some((s) => s.explain.includes('điểm chia tốt nhất'))).toBe(true);
  });
  it('ghi dòng split, bảng s và hai đoạn phụ thuộc được chọn', () => {
    const input = {dims: [10, 100, 5, 50]};
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map((line) => line.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, {rec, signal: new AbortController().signal});
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const index = rec.steps.findIndex((step) => step.lineId === 'split' && step.explain.includes('s[1][3]'));
    expect(index).toBeGreaterThan(0);
    const state = store.seek(index + 1);
    expect(state.matrix[5][3]).toBe(2);
    expect(state.dependencies).toEqual([[1, 2], [3, 3]]);
    expect(state.dependencies).not.toContainEqual([1, 3]);
  });
});
