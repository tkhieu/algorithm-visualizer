import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalCost} from '../../../problems/assignment/checker';
import {generate} from '../../../problems/assignment/generators';

describe('assignment/hungarian', () => {
  it('tìm đúng chi phí tối ưu trên nhiều seed và mọi cỡ (bao gồm cỡ lớn ngoài vét cạn)', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        const optimal = optimalCost(input.cost);
        if (optimal !== null) expect(output.cost).toBe(optimal);
      }
    }
  });

  it('khớp chi phí tối ưu trên ví dụ kinh điển (13)', () => {
    const input = {
      cost: [
        [9, 2, 7, 8],
        [6, 4, 3, 7],
        [5, 8, 1, 8],
        [7, 6, 9, 4],
      ],
    };
    const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output.cost).toBe(13);
  });

  it('xử lý đúng trường hợp một người một việc', () => {
    const output = algorithm.run({cost: [[5]]}, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output).toEqual({assignment: [0], cost: 5});
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
    expect(rec.steps.some((s) => s.lineId === 'augment')).toBe(true);
  });
});
