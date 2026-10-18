import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, chromaticNumberOracle} from '../../../problems/graph-coloring/checker';
import {crownGraph, generate} from '../../../problems/graph-coloring/generators';
describe('graph-coloring/dsatur', () => {
  it('luôn trả về cách tô hợp lệ (đúng đắn) trên nhiều seed và cỡ', () => {
    for (let seed = 1; seed <= 60; seed++)
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
      }
  });
  it('tô được đồ thị với k = n màu (luôn khả thi)', () => {
    const input = {
      nodes: ['A', 'B', 'C'],
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'C', to: 'A'},
      ],
      colors: 3,
    };
    const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output.found).toBe(true);
  });
  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {
      nodes: ['A', 'B', 'C'],
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'C', to: 'A'},
      ],
      colors: 3,
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
    const colored = final.nodes.map((n) => (n.label === undefined ? null : Number(n.label)));
    expect(colored).toEqual(output.coloring);
    expect(rec.steps.some((s) => s.explain.includes('độ bão hoà'))).toBe(true);
  });

  describe('chế độ chromatic — không giới hạn số màu', () => {
    it('luôn found=true, hợp lệ, colorsUsed ≤ n trên nhiều seed và cỡ', () => {
      for (let seed = 1; seed <= 30; seed++)
        for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
          const input = {...generate(seed, size), mode: 'chromatic' as const};
          const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
          expect(output.found, `seed ${seed} ${size}`).toBe(true);
          expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
          expect(output.colorsUsed!).toBeLessThanOrEqual(input.nodes.length);
        }
    });
    it('đồ thị vương miện: DSATUR chọn đỉnh theo độ bão hoà nên tìm ngay χ(G)=2 (tối ưu), khác tham lam/Welsh–Powell', () => {
      const input = {...crownGraph(3), mode: 'chromatic' as const};
      const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
      expect(output.colorsUsed).toBe(2);
      expect(chromaticNumberOracle(input)).toBe(2);
      expect(check(input, output)).toEqual({ok: true, optimal: true});
    });
  });
});
