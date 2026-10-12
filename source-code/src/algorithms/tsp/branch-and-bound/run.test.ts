import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalLength} from '../../../problems/tsp/checker';
import {generate} from '../../../problems/tsp/generators';

describe('tsp/branch-and-bound', () => {
  it('tìm đúng hành trình tối ưu trên nhiều seed và cỡ nhỏ/trung', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const size of ['tiny', 'small', 'medium'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        const optimal = optimalLength(input.points);
        if (optimal !== null) expect(output.length).toBeCloseTo(optimal, 5);
      }
    }
  });

  it('từ chối n vượt giới hạn an toàn', () => {
    const big = {points: Array.from({length: 11}, (_, i) => ({x: i, y: 0}))};
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).toThrow();
  });

  it('trace tua lại đúng, cắt nhánh được ghi nhận và khớp output cuối', () => {
    const input = {
      points: [
        {x: 0, y: 0},
        {x: 0, y: 10},
        {x: 10, y: 10},
        {x: 10, y: 0},
        {x: 5, y: 5},
      ],
    };
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
    expect(final.tour).toEqual(output.tour);
    expect(rec.steps.some((s) => s.lineId === 'bound')).toBe(true);
  });
});
