import {describe, expect, it} from 'vitest';
import {MetricsRecorder, TraceRecorder} from '../../core/recorder';
import {TraceStore} from '../../core/trace/TraceStore';
import {check} from '../../problems/graph-coloring/checker';
import {algorithm as exhaustive} from './exhaustive';
import {algorithm as backtracking} from './backtracking';
import {algorithm as greedy} from './greedy';
import {algorithm as welshPowell} from './welsh-powell';
import {algorithm as dsatur} from './dsatur';

const algorithms = [exhaustive, backtracking, greedy, welshPowell, dsatur];
const signal = new AbortController().signal;

describe('graph-coloring review regressions', () => {
  it.each(algorithms)('%s tô đồ thị rỗng bằng cách tô rỗng', (algorithm) => {
    const input = {nodes: [], edges: [], colors: 2};
    const output = algorithm.run(input, {rec: new MetricsRecorder(), signal});
    expect(output.found).toBe(true);
    expect(output.coloring).toEqual([]);
    expect(check(input, output).ok).toBe(true);
  });

  it('tham lam và Welsh–Powell không tuyên bố vô nghiệm khi mắc kẹt trên đồ thị hai màu', () => {
    const nodes = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
    const edges = [1, 2, 3].flatMap((a) =>
      [1, 2, 3].filter((b) => b !== a).map((b) => ({from: 'A' + a, to: 'B' + b})),
    );
    const input = {nodes, edges, colors: 2};
    for (const algorithm of [greedy, welshPowell]) {
      const rec = new TraceRecorder(
        algorithm.initVisual(input),
        new Set(algorithm.pseudocode.map((line) => line.id)),
        algorithm.traceLimit,
      );
      const output = algorithm.run(input, {rec, signal});
      expect(output.found).toBe(false);
      expect(check(input, output)).toEqual({ok: true, optimal: false});
      expect(rec.steps.at(-1)?.explain).toContain('chưa tìm được');
    }
  });

  it('DSATUR thất bại được ghi là heuristic và chấm xấp xỉ', () => {
    const input = {
      nodes: ['A', 'B', 'C'],
      edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'C', to: 'A'}],
      colors: 2,
    };
    const output = dsatur.run(input, {rec: new MetricsRecorder(), signal});
    expect(output).toMatchObject({found: false, heuristic: true});
    expect(check(input, output)).toEqual({ok: true, optimal: false});
  });

  it('bước quay lui xoá màu khỏi đồ thị ngay tại bước đó', () => {
    const input = {
      nodes: ['A', 'B', 'C'],
      edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'C', to: 'A'}],
      colors: 2,
    };
    const rec = new TraceRecorder(
      backtracking.initVisual(input),
      new Set(backtracking.pseudocode.map((line) => line.id)),
      backtracking.traceLimit,
    );
    backtracking.run(input, {rec, signal});
    const store = new TraceStore(backtracking.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const backtrackIndex = rec.steps.findIndex((step) => step.lineId === 'backtrack');
    expect(backtrackIndex).toBeGreaterThan(0);
    const before = store.seek(backtrackIndex);
    const after = store.seek(backtrackIndex + 1);
    expect(before.nodes.filter((node) => node.label !== undefined).length)
      .toBeGreaterThan(after.nodes.filter((node) => node.label !== undefined).length);
  });

  // Ba việc sửa theo yêu cầu bổ sung của orchestrator (xem báo cáo cuối): (1) chữ "fail" của ba
  // heuristic không còn tuyên bố chắc chắn vô nghiệm; (2) mọi dòng mã giả khai báo đều được một
  // bước trace nào đó dùng tới (không còn dòng "chết" như 'try' cũ của quay lui hay 'leaf' cũ của
  // vét cạn); (3) vét cạn cập nhật đồ thị ngay ở bước 'assign' (tô tạm theo đường đi hiện tại),
  // không chỉ ở lá — khớp cách backtracking đã làm.
  describe('sửa theo yêu cầu bổ sung (fail/pseudocode chết/đồ thị tạm của vét cạn)', () => {
    it('chữ dòng "fail" của ba heuristic không tuyên bố chắc chắn vô nghiệm', () => {
      for (const algorithm of [greedy, welshPowell, dsatur]) {
        const failLine = algorithm.pseudocode.find((l) => l.id === 'fail')!;
        expect(failLine.text).not.toMatch(/báo không thể/);
        expect(failLine.text).toMatch(/chưa tìm được|không chứng minh vô nghiệm/);
      }
    });

    it.each(algorithms)('%s: mọi dòng mã giả khai báo đều được dùng trong trace (không có dòng chết)', (algorithm) => {
      const feasible = {nodes: ['A', 'B', 'C'], edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}], colors: 3};
      const infeasible = {
        nodes: ['A', 'B', 'C'],
        edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'C', to: 'A'}],
        colors: 1,
      };
      // backtracking/exhaustive có thêm các dòng chỉ dùng ở chế độ chromatic (lowerBound/upperBound/
      // tryK/foundChromatic) — cần một lượt chromatic (triangle, χ = 3) để không bị coi là "chết".
      const chromaticTriangle = {
        nodes: ['A', 'B', 'C'],
        edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'C', to: 'A'}],
        colors: 1,
        mode: 'chromatic' as const,
      };
      const scenarios =
        algorithm.id === 'graph-coloring/backtracking' || algorithm.id === 'graph-coloring/exhaustive'
          ? [feasible, infeasible, chromaticTriangle]
          : [feasible, infeasible];
      const used = new Set<string>();
      for (const input of scenarios) {
        const rec = new TraceRecorder(
          algorithm.initVisual(input),
          new Set(algorithm.pseudocode.map((l) => l.id)),
          algorithm.traceLimit,
        );
        algorithm.run(input, {rec, signal});
        for (const step of rec.steps) used.add(step.lineId);
      }
      expect(used).toEqual(new Set(algorithm.pseudocode.map((l) => l.id)));
    });

    it('vét cạn tô tạm trên đồ thị ngay ở bước "assign", không chỉ khi tới lá', () => {
      const input = {
        nodes: ['A', 'B', 'C'],
        edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'C', to: 'A'}],
        colors: 3,
      };
      const rec = new TraceRecorder(
        exhaustive.initVisual(input),
        new Set(exhaustive.pseudocode.map((l) => l.id)),
        exhaustive.traceLimit,
      );
      exhaustive.run(input, {rec, signal});
      const store = new TraceStore(exhaustive.initVisual(input));
      let sawTentativeBeforeFirstCheck = false;
      for (const step of rec.steps) {
        store.append(step);
        if (step.lineId === 'check') break;
        if (step.lineId === 'assign' && store.seek(store.length).nodes.some((n) => n.label !== undefined)) {
          sawTentativeBeforeFirstCheck = true;
        }
      }
      expect(sawTentativeBeforeFirstCheck).toBe(true);
    });
  });

  // Số bước của ví dụ đồ thị vương miện (báo cáo dùng làm ví dụ xuyên suốt) phải ổn định qua các
  // thay đổi ở trên — ba việc sửa chỉ đổi chữ mã giả/nội dung draft, không đổi lineId hay số bước.
  it('ví dụ vương miện trong báo cáo: số bước mỗi thuật toán không đổi qua các lần sửa', () => {
    const crownNodes = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
    const crownEdges = [1, 2, 3].flatMap((a) =>
      [1, 2, 3].filter((b) => b !== a).map((b) => ({from: 'A' + a, to: 'B' + b})),
    );
    const crownInput = {nodes: crownNodes, edges: crownEdges, colors: 2};
    const expectedSteps: Record<string, number> = {
      'graph-coloring/exhaustive': 69,
      'graph-coloring/backtracking': 20,
      'graph-coloring/greedy': 7,
      'graph-coloring/welsh-powell': 7,
      'graph-coloring/dsatur': 14,
    };
    for (const algorithm of algorithms) {
      const rec = new TraceRecorder(
        algorithm.initVisual(crownInput),
        new Set(algorithm.pseudocode.map((l) => l.id)),
        algorithm.traceLimit,
      );
      algorithm.run(crownInput, {rec, signal});
      expect(rec.steps.length, algorithm.id).toBe(expectedSteps[algorithm.id]);
    }
  });
});
