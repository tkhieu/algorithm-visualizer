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
  it('xoay kép (trái-phải) hiển thị trạng thái sau lần xoay đơn đầu tiên như một bước riêng', () => {
    // Chèn 3,1,2 là ví dụ kinh điển của trường hợp kép trái-phải: mất cân bằng tại gốc (3), con
    // trái (1) lại lệch phải. Ngay sau lần xoay trái đơn đầu tiên (tại con trái), con trái của
    // gốc phải đổi từ khóa 1 sang khóa 2 — bước "rebalance-inner" phải tự vẽ lại cây để thể hiện
    // đúng trạng thái này, không chỉ thông báo rồi để trạng thái cũ nguyên vẹn.
    const input = { keys: [3, 1, 2] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const innerIdx = rec.steps.findIndex(s => s.lineId === 'rebalance-inner');
    expect(innerIdx).toBeGreaterThanOrEqual(0);
    const afterInner = store.seek(innerIdx + 1);
    const root = afterInner.nodes.find(n => n.parent === null)!;
    expect(root.label).toBe('3');
    const rootLeft = afterInner.nodes.find(n => n.parent === root.id)!;
    expect(rootLeft.label).toBe('2');
  });
  it('xoay kép (phải-trái) hiển thị trạng thái sau lần xoay đơn đầu tiên như một bước riêng', () => {
    // Đối xứng gương của trường hợp kép trái-phải ở trên: chèn 1,3,2 gây mất cân bằng tại gốc
    // (1), con phải (3) lại lệch trái. Ngay sau lần xoay phải đơn đầu tiên (tại con phải), con
    // phải của gốc phải đổi từ khóa 3 sang khóa 2 — bước "rebalance-inner" phải tự vẽ lại cây để
    // thể hiện đúng trạng thái này, không chỉ thông báo rồi để trạng thái cũ nguyên vẹn.
    const input = { keys: [1, 3, 2] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const innerIdx = rec.steps.findIndex(s => s.lineId === 'rebalance-inner');
    expect(innerIdx).toBeGreaterThanOrEqual(0);
    const afterInner = store.seek(innerIdx + 1);
    const root = afterInner.nodes.find(n => n.parent === null)!;
    expect(root.label).toBe('1');
    const rootRight = afterInner.nodes.find(n => n.parent === root.id)!;
    expect(rootRight.label).toBe('2');
  });
  it('hiển thị đúng hệ số cân bằng (cao trái − cao phải) trên mỗi đỉnh', () => {
    const balanced = traceFinal({ keys: [1, 2, 3] });
    // Cây cân bằng hoàn chỉnh [1,2,3]: mọi đỉnh có bf = 0.
    expect(balanced.nodes.every(n => n.sub === '0')).toBe(true);
    // 5,3,8,1 không cần xoay (chênh cao vẫn ≤ 1): gốc 5 và con 3 có bf = +1, lá 1 và 8 có bf = 0.
    const skewed = traceFinal({ keys: [5, 3, 8, 1] });
    const byLabel = new Map(skewed.nodes.map(n => [n.label, n.sub]));
    expect(byLabel.get('5')).toBe('+1');
    expect(byLabel.get('3')).toBe('+1');
    expect(byLabel.get('8')).toBe('0');
    expect(byLabel.get('1')).toBe('0');
  });
});
