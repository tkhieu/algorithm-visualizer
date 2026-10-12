import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check} from '../../../problems/tsp/checker';
import {generate} from '../../../problems/tsp/generators';

describe('tsp/nearest-neighbor', () => {
  it('luôn trả về hành trình hợp lệ trên nhiều seed và cỡ', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
      }
    }
  });

  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {
      points: [
        {x: 0, y: 0},
        {x: 0, y: 10},
        {x: 10, y: 10},
        {x: 10, y: 0},
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
    expect(rec.steps.some((s) => s.explain.includes('gần'))).toBe(true);
  });
});
