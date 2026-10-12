import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, existsSubset} from '../../../problems/subset-sum/checker';
import {generate} from '../../../problems/subset-sum/generators';
describe('subset-sum/exhaustive', () => {
  it('đúng so với tham chiếu trên nhiều seed cỡ nhỏ/trung', () => {
    for (let seed = 1; seed <= 40; seed++)
      for (const size of ['tiny', 'small', 'medium'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.found).toBe(existsSubset(input));
      }
  });
  it('từ chối n vượt giới hạn an toàn', () => {
    const big = {values: Array.from({length: 23}, () => 1), target: 10};
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).toThrow();
  });
  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {values: [3, 34, 4, 12, 5, 2], target: 9};
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
    const best = final.nodes.filter((n) => n.status === 'best');
    expect(best).toHaveLength(1);
    expect(best[0].value).toBe(9);
    expect(output.found).toBe(true);
    expect(rec.steps.some((s) => s.explain.includes('nghiệm'))).toBe(true);
  });
});
