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
function checkAvlInvariant(state: VisualState): {
  bstOk: boolean;
  balanced: boolean;
  height: number;
} {
  const byId = new Map(state.nodes.map(n => [n.id, n]));
  const childrenOf = (id: string) => state.nodes.filter(n => n.parent === id);
  const root = state.nodes.find(n => n.parent === null);
  if (!root) return { bstOk: true, balanced: true, height: -1 };
  let bstOk = true,
    balanced = true;
  const visit = (id: string, lo: number, hi: number): number => {
    const node = byId.get(id)!;
    const value = Number(node.label);
    if (!(value > lo && value < hi)) bstOk = false;
    const kids = childrenOf(id);
    const left = kids.find(k => Number(k.label) < value);
    const right = kids.find(k => Number(k.label) > value);
    if (kids.length !== [left, right].filter(Boolean).length) bstOk = false;
    const leftH = left ? visit(left.id, lo, value) : -1;
    const rightH = right ? visit(right.id, value, hi) : -1;
    if (Math.abs(leftH - rightH) > 1) balanced = false;
    return 1 + Math.max(leftH, rightH);
  };
  const height = visit(root.id, -Infinity, Infinity);
  return { bstOk, balanced, height };
}
describe('chèn cây AVL', () => {
  it('thoả BST + cân bằng AVL trên 150 seed ngẫu nhiên, đúng tập khóa', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(check(input, output), `seed ${seed}`).toMatchObject({ ok: true });
      const inv = checkAvlInvariant(traceFinal(input));
      expect(inv.bstOk, `seed ${seed}`).toBe(true);
      expect(inv.balanced, `seed ${seed}`).toBe(true);
      expect(inv.height, `seed ${seed}`).toBe(output.height);
    }
  });
  it('dãy tăng dần vẫn giữ cây cân bằng (độ cao thấp hơn BST thường)', () => {
    const input = { keys: [1, 2, 3, 4, 5, 6, 7] };
    const output = solve(input);
    expect(output.height).toBeLessThanOrEqual(3);
  });
  it('bước "rebalance" giải thích bằng tiếng Việt khi có xoay', () => {
    const rec = new TraceRecorder(
      algorithm.initVisual({ keys: [1, 2, 3] }),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run({ keys: [1, 2, 3] }, { rec, signal: new AbortController().signal });
    const rebalance = rec.steps.find(s => s.lineId === 'rebalance');
    expect(rebalance?.explain).toContain('xoay');
  });
});
