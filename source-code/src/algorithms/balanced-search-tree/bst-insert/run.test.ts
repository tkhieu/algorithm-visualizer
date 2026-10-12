import { describe, it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/balanced-search-tree/generators';
import { check } from '../../../problems/balanced-search-tree/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
import type { Input } from '../../../problems/balanced-search-tree/definition';
import type { VisualState } from './run';
function solve(input: Input) {
  return algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
}
function traceFinal(input: Input): VisualState {
  const rec = new TraceRecorder(
    algorithm.initVisual(input),
    new Set(algorithm.pseudocode.map(l => l.id)),
    algorithm.traceLimit,
  );
  algorithm.run(input, { rec, signal: new AbortController().signal });
  const store = new TraceStore(algorithm.initVisual(input));
  for (const step of rec.steps) store.append(step);
  return store.seek(store.length);
}
function checkBstInvariant(state: VisualState): { ok: boolean; height: number } {
  const byId = new Map(state.nodes.map(n => [n.id, n]));
  const childrenOf = (id: string) => state.nodes.filter(n => n.parent === id);
  const root = state.nodes.find(n => n.parent === null);
  if (!root) return { ok: true, height: -1 };
  let ok = true;
  const height = (id: string, lo: number, hi: number): number => {
    const node = byId.get(id)!;
    const value = Number(node.label);
    if (!(value > lo && value < hi)) ok = false;
    const kids = childrenOf(id);
    if (kids.length === 0) return 0;
    const left = kids.find(k => Number(k.label) < value);
    const right = kids.find(k => Number(k.label) > value);
    if (kids.length !== [left, right].filter(Boolean).length) ok = false;
    const leftH = left ? height(left.id, lo, value) : -1;
    const rightH = right ? height(right.id, value, hi) : -1;
    return 1 + Math.max(leftH, rightH);
  };
  return { ok, height: height(root.id, -Infinity, Infinity) };
}
describe('chèn cây tìm kiếm nhị phân', () => {
  it('đúng tập khóa và thoả bất biến BST trên 150 seed ngẫu nhiên', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(check(input, output), `seed ${seed}`).toMatchObject({ ok: true });
      const final = traceFinal(input);
      const inv = checkBstInvariant(final);
      expect(inv.ok, `seed ${seed}`).toBe(true);
      expect(inv.height, `seed ${seed}`).toBe(output.height);
    }
  });
  it('dãy tăng dần tạo thành một chuỗi lệch phải, độ cao n-1', () => {
    const input = { keys: [1, 2, 3, 4, 5] };
    const output = solve(input);
    expect(output.height).toBe(4);
  });
  it('trace tua lại đúng trạng thái cuối', () => {
    const input = generate(5, 'small');
    const output = solve(input);
    const final = traceFinal(input);
    expect(final.nodes.map(n => Number(n.label)).sort((a, b) => a - b)).toEqual(output.values);
  });
  it('bước "insert" giải thích bằng tiếng Việt', () => {
    const rec = new TraceRecorder(
      algorithm.initVisual({ keys: [5, 2] }),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run({ keys: [5, 2] }, { rec, signal: new AbortController().signal });
    const insert = rec.steps.find(s => s.lineId === 'insert' && s.explain.includes('2'));
    expect(insert?.explain).toContain('con của');
  });
});
