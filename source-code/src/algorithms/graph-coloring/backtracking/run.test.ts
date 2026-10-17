import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, chromaticNumberOracle, existsColoring} from '../../../problems/graph-coloring/checker';
import {crownGraph, completeGraph, generate} from '../../../problems/graph-coloring/generators';
describe('graph-coloring/backtracking', () => {
  it('đúng so với backtracking tham chiếu trên nhiều seed và cỡ', () => {
    for (let seed = 1; seed <= 60; seed++)
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.found).toBe(existsColoring(input));
      }
  });
  it('phát hiện vô nghiệm trên tam giác với 2 màu', () => {
    const input = {
      nodes: ['A', 'B', 'C'],
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'C', to: 'A'},
      ],
      colors: 2,
    };
    const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output.found).toBe(false);
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
    expect(rec.steps.some((s) => s.explain.includes('Gán màu'))).toBe(true);
  });

  describe('chế độ chromatic — tìm χ(G)', () => {
    it('χ(G) khớp oracle độc lập trên các đồ thị cấu trúc đã biết χ', () => {
      for (const graph of [crownGraph(3), completeGraph(5), generate(3, 'small')]) {
        const input = {...graph, mode: 'chromatic' as const};
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(output.found).toBe(true);
        expect(output.chromaticExact).toBe(true);
        expect(output.colorsUsed).toBe(chromaticNumberOracle(input));
        expect(check(input, output)).toEqual({ok: true, optimal: true});
      }
    });
    it('đồ thị rỗng (0 đỉnh): χ = 0, found=true, chromaticExact=true', () => {
      const input = {nodes: [], edges: [], colors: 1, mode: 'chromatic' as const};
      const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
      expect(output).toMatchObject({found: true, coloring: [], colorsUsed: 0, chromaticExact: true});
    });
    it('trace cho thấy chặn dưới (clique), chặn trên (DSATUR) và từng k đã thử', () => {
      const input = {...completeGraph(4), mode: 'chromatic' as const};
      const rec = new TraceRecorder(
        algorithm.initVisual(input),
        new Set(algorithm.pseudocode.map((l) => l.id)),
        algorithm.traceLimit,
      );
      algorithm.run(input, {rec, signal: new AbortController().signal});
      expect(rec.steps.some((s) => s.lineId === 'lowerBound' && s.explain.includes('clique'))).toBe(true);
      expect(rec.steps.some((s) => s.lineId === 'upperBound' && s.explain.includes('DSATUR'))).toBe(true);
      expect(rec.steps.some((s) => s.lineId === 'tryK' && s.explain.includes('k ='))).toBe(true);
      expect(rec.steps.some((s) => s.lineId === 'foundChromatic')).toBe(true);
    });
  });

  describe('precondition — giới hạn an toàn riêng cho quay lui', () => {
    it('k-coloring: không áp dụng khi n > 22', () => {
      const big = {nodes: Array.from({length: 23}, (_, i) => `V${i}`), edges: [], colors: 2};
      expect(algorithm.precondition?.(big)).toMatch(/Không áp dụng/);
      const ok = {nodes: Array.from({length: 22}, (_, i) => `V${i}`), edges: [], colors: 2};
      expect(algorithm.precondition?.(ok)).toBeUndefined();
    });
    it('chromatic: không áp dụng khi n > 12 (ngưỡng thấp hơn vì phải thử nhiều k)', () => {
      const big = {nodes: Array.from({length: 13}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
      expect(algorithm.precondition?.(big)).toMatch(/Không áp dụng/);
      const ok = {nodes: Array.from({length: 12}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
      expect(algorithm.precondition?.(ok)).toBeUndefined();
    });
  });
});
