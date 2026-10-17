import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {algorithm as backtracking} from '../backtracking/index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, chromaticNumberOracle} from '../../../problems/graph-coloring/checker';
import {crownGraph, cycleGraph, generate} from '../../../problems/graph-coloring/generators';
describe('graph-coloring/exhaustive', () => {
  it('khớp với quay lui trên nhiều seed cỡ nhỏ/trung', () => {
    for (let seed = 1; seed <= 40; seed++)
      for (const size of ['tiny', 'small'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        const reference = backtracking.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.found).toBe(reference.found);
      }
  });
  it('kⁿ vượt giới hạn an toàn: báo "Không áp dụng" bằng tiếng Việt qua precondition, không throw', () => {
    const big = {nodes: Array.from({length: 10}, (_, i) => `V${i}`), edges: [], colors: 10};
    expect(algorithm.precondition?.(big)).toMatch(/Không áp dụng/);
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).not.toThrow();
  });
  it('kⁿ trong giới hạn an toàn: precondition không chặn', () => {
    const small = {nodes: Array.from({length: 4}, (_, i) => `V${i}`), edges: [], colors: 3};
    expect(algorithm.precondition?.(small)).toBeUndefined();
  });
  it('chế độ χ(G): precondition chặn khi n vượt ngưỡng Σkⁿ (k=1..n)', () => {
    const big = {nodes: Array.from({length: 7}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
    const small = {nodes: Array.from({length: 6}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
    expect(algorithm.precondition?.(big)).toMatch(/Không áp dụng/);
    expect(algorithm.precondition?.(small)).toBeUndefined();
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
    expect(rec.steps.some((s) => s.explain.includes('nghiệm'))).toBe(true);
  });

  describe('chế độ chromatic — tìm χ(G)', () => {
    it('χ(G) khớp oracle độc lập trên đồ thị nhỏ (crown, chu trình)', () => {
      for (const graph of [crownGraph(3), cycleGraph(5), cycleGraph(6)]) {
        const input = {...graph, mode: 'chromatic' as const};
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(output.found).toBe(true);
        expect(output.chromaticExact).toBe(true);
        expect(output.colorsUsed).toBe(chromaticNumberOracle(input));
        expect(check(input, output)).toEqual({ok: true, optimal: true});
      }
    });
    it('đồ thị rỗng (0 đỉnh): χ = 0', () => {
      const input = {nodes: [], edges: [], colors: 1, mode: 'chromatic' as const};
      const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
      expect(output).toMatchObject({found: true, coloring: [], colorsUsed: 0, chromaticExact: true});
    });
    it('trace cho thấy từng k đã thử và k nhỏ nhất khả thi', () => {
      const input = {...cycleGraph(5), mode: 'chromatic' as const};
      const rec = new TraceRecorder(
        algorithm.initVisual(input),
        new Set(algorithm.pseudocode.map((l) => l.id)),
        algorithm.traceLimit,
      );
      algorithm.run(input, {rec, signal: new AbortController().signal});
      expect(rec.steps.filter((s) => s.lineId === 'tryK').length).toBeGreaterThanOrEqual(3); // k=1,2 thất bại, k=3 thành công
      expect(rec.steps.some((s) => s.lineId === 'foundChromatic')).toBe(true);
    });
  });
});
