import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {algorithm as backtracking} from '../backtracking/index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, chromaticNumberOracle} from '../../../problems/graph-coloring/checker';
import {crownGraph, cycleGraph, generate} from '../../../problems/graph-coloring/generators';
import {execute} from '../../../core/worker-protocol/execute';
describe('graph-coloring/exhaustive', () => {
  it('đồ thị 10 đỉnh được phát lại bằng tiền tố và bước kết quả cuối', async () => {
    const input = {
      nodes: Array.from({length: 10}, (_, i) => `V${i}`),
      edges: [
        [0, 5], [0, 7], [1, 3], [1, 7], [2, 4], [2, 7], [2, 9], [3, 4],
        [3, 5], [3, 6], [3, 9], [4, 5], [5, 7], [5, 8], [6, 8], [7, 8],
      ].map(([from, to]) => ({from: `V${from}`, to: `V${to}`})),
      colors: 3,
      mode: 'k-coloring' as const,
    };
    const direct = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map((line) => line.id)),
      algorithm.traceLimit,
    );
    const output = algorithm.run(input, {rec: direct, signal: new AbortController().signal});
    expect(output.coloring).toEqual([0, 0, 1, 2, 0, 1, 1, 2, 0, 0]);
    expect(check(input, output).ok).toBe(true);
    expect(direct.steps.length).toBeGreaterThan(1);
    expect(direct.steps.length).toBeLessThanOrEqual(5000);
    expect(direct.truncated).toBe(true);
    expect(direct.steps.at(-1)?.lineId).toBe('done');
    const streamed: typeof direct.steps = [];
    const result = await execute(algorithm.id, input, true, (step) => streamed.push(step));
    expect(result.status).toBe('ok');
    expect(streamed.length).toBe(direct.steps.length);
    expect(streamed[0]?.lineId).toBe('init');
    expect(streamed.at(-1)?.lineId).toBe('done');
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of streamed) store.append(step);
    const final = store.seek(store.length);
    expect(final.treeNodes.length).toBeGreaterThan(0);
    expect(final.nodes.map((node) => Number(node.label))).toEqual(output.coloring);
  }, 20000);
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
    expect(algorithm.precondition?.(big)).toMatch(/^Vét cạn chỉ an toàn/);
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).not.toThrow();
  });
  it('kⁿ trong giới hạn an toàn: precondition không chặn', () => {
    const small = {nodes: Array.from({length: 4}, (_, i) => `V${i}`), edges: [], colors: 3};
    expect(algorithm.precondition?.(small)).toBeUndefined();
  });
  it('chế độ χ(G): precondition chặn khi n vượt ngưỡng Σkⁿ (k=1..n)', () => {
    const big = {nodes: Array.from({length: 7}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
    const small = {nodes: Array.from({length: 6}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
    expect(algorithm.precondition?.(big)).toMatch(/^Vét cạn tìm χ\(G\) chỉ an toàn/);
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
