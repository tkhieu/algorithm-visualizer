import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check} from '../../../problems/n-queens/checker';
import {generate} from '../../../problems/n-queens/generators';
describe('n-queens/backtracking', () => {
  it('đúng trên nhiều seed ngẫu nhiên và các cỡ', () => {
    for (let seed = 1; seed <= 40; seed++)
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size} n=${input.n}`).toBe(true);
      }
  });
  it('không có nghiệm với n=2 và n=3', () => {
    for (const n of [2, 3]) {
      const output = algorithm.run({n}, {rec: new MetricsRecorder(), signal: new AbortController().signal});
      expect(output.found).toBe(false);
    }
  });
  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {n: 6};
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map((l) => l.id)),
      algorithm.traceLimit,
    );
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(rec.steps.length);
    const placed = final.marks.filter((m) => m.role === 'queen').map((m) => m.col);
    expect(placed).toEqual(output.positions);
    expect(rec.steps.some((s) => s.explain.includes('Đặt quân hậu hợp lệ'))).toBe(true);
  });
});
