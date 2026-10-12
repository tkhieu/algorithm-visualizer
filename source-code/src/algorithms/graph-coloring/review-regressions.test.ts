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
});
