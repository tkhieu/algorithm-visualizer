import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalCost} from '../../../problems/matrix-chain/checker';
import {generate} from '../../../problems/matrix-chain/generators';

describe('matrix-chain/exhaustive', () => {
  it('tìm đúng chi phí tối ưu trên nhiều seed cỡ nhỏ/trung', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const size of ['tiny', 'small', 'medium'] as const) {
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
    expect(output.parenthesization).toBe('((A1A2)A3)');
  });
  it('sinh đủ năm cách đặt ngoặc đầy đủ cho bốn ma trận', () => {
    const input = {dims: [10, 20, 30, 40, 50]};
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map((line) => line.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, {rec, signal: new AbortController().signal});
    const candidates = rec.steps.filter((step) => step.lineId === 'try');
    expect(candidates).toHaveLength(5);
    expect(new Set(candidates.map((step) => step.explain))).toHaveProperty('size', 5);
  });

  it('từ chối n vượt giới hạn an toàn', () => {
    const big = {dims: Array.from({length: 12}, () => 5)};
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).toThrow();
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
    expect(rec.steps.some((s) => s.lineId === 'compare')).toBe(true);
  });
});
