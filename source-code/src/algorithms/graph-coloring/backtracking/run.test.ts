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
    it('k-coloring: không áp dụng khi n > 9', () => {
      const big = {nodes: Array.from({length: 10}, (_, i) => `V${i}`), edges: [], colors: 2};
      expect(algorithm.precondition?.(big)).toMatch(/Không áp dụng/);
      const ok = {nodes: Array.from({length: 9}, (_, i) => `V${i}`), edges: [], colors: 2};
      expect(algorithm.precondition?.(ok)).toBeUndefined();
    });
    it('chromatic: không áp dụng khi n > 12 (ngưỡng riêng, xem giải thích trong index.ts)', () => {
      const big = {nodes: Array.from({length: 13}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
      expect(algorithm.precondition?.(big)).toMatch(/Không áp dụng/);
      const ok = {nodes: Array.from({length: 12}, (_, i) => `V${i}`), edges: [], colors: 1, mode: 'chromatic' as const};
      expect(algorithm.precondition?.(ok)).toBeUndefined();
    });
    it('k-coloring: thứ tự đỉnh xấu (18 đỉnh cô lập TRƯỚC một K4) ở n=22 vẫn phải bị chặn — đây là ca mà ngưỡng n ≤ 22 cũ (từ lần review trước) vẫn lọt qua', () => {
      const isolated = Array.from({length: 18}, (_, i) => `I${i}`);
      const clique = Array.from({length: 4}, (_, i) => `C${i}`);
      const edges = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push({from: clique[i], to: clique[j]});
      const input = {nodes: [...isolated, ...clique], edges, colors: 3};
      expect(algorithm.precondition?.(input)).toMatch(/Không áp dụng/);
    });
  });

  describe('benchmark tại ngưỡng mới n ≤ 9 — đồ thị xấu nhất đo được (xem index.ts) phải chạy nhanh với MỌI thứ tự đỉnh', () => {
    // Trường hợp xấu nhất đo được ở n=9: K9 (clique đầy, k=8 — không tô được) không có đỉnh cô
    // lập đệm thêm (pad=0, vì core đã bằng n). Thử cả hai cách đặt lõi để chắc cả hai thứ tự đều
    // nhanh, dù pad=0 khiến "trước/sau" không còn khác biệt về cấu trúc — vẫn là cùng một kịch bản
    // đo trong index.ts.
    const BUDGET_MS = 2000; // 2 s, còn dư nhiều so với 5 s timeout worker và an toàn trên máy chậm hơn máy benchmark
    it('K9 (k=8, không tô được, n=9): quay lui và oracle của checker đều chạy xong nhanh', () => {
      const nodes = Array.from({length: 9}, (_, i) => `V${i}`);
      const edges = [];
      for (let i = 0; i < 9; i++) for (let j = i + 1; j < 9; j++) edges.push({from: nodes[i], to: nodes[j]});
      const input = {nodes, edges, colors: 8};
      const t0 = performance.now();
      const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
      const t1 = performance.now();
      expect(output.found).toBe(false);
      expect(t1 - t0).toBeLessThan(BUDGET_MS);
      const t2 = performance.now();
      expect(existsColoring(input)).toBe(false);
      expect(performance.now() - t2).toBeLessThan(BUDGET_MS);
    });
    it('18 đỉnh cô lập trước K4 (k=3, n=22 — vượt ngưỡng nên chỉ kiểm oracle của checker, không gọi run() trực tiếp)', () => {
      const isolated = Array.from({length: 18}, (_, i) => `I${i}`);
      const clique = Array.from({length: 4}, (_, i) => `C${i}`);
      const edges = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push({from: clique[i], to: clique[j]});
      const input = {nodes: [...isolated, ...clique], edges, colors: 3};
      const t0 = performance.now();
      expect(existsColoring(input)).toBe(false);
      expect(performance.now() - t0).toBeLessThan(BUDGET_MS);
    });
  });
});
