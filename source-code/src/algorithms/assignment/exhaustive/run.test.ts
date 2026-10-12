import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalCost} from '../../../problems/assignment/checker';
import {generate} from '../../../problems/assignment/generators';

describe('assignment/exhaustive', () => {
  it('tìm đúng chi phí tối ưu trên nhiều seed và cỡ nhỏ/trung', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const size of ['tiny', 'small', 'medium'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.cost).toBe(optimalCost(input.cost));
      }
    }
  });

  it('từ chối n vượt giới hạn an toàn', () => {
    const big = {cost: Array.from({length: 10}, (_, i) => Array.from({length: 10}, (_, j) => i + j))};
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).toThrow();
  });

  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {
      cost: [
        [9, 2, 7, 8],
        [6, 4, 3, 7],
        [5, 8, 1, 8],
        [7, 6, 9, 4],
      ],
    };
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(rec.steps.length);
    const chosen = final.marks.filter((m) => m.role === 'chosen').length;
    expect(chosen).toBe(output.assignment.length);
    expect(rec.steps.some((s) => s.explain.includes('tốt nhất hiện tại'))).toBe(true);
  });
});
