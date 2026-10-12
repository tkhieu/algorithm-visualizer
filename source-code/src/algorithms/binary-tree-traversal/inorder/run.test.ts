import { describe, it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/binary-tree-traversal/generators';
import { check } from '../../../problems/binary-tree-traversal/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
import type { Input, Output } from '../../../problems/binary-tree-traversal/definition';
function solve(input: Input) {
  return algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
}
function reference(input: Input): Output {
  const byId = new Map(input.nodes.map(n => [n.id, n]));
  const order: number[] = [];
  const visit = (id: number | null): void => {
    if (id === null) return;
    const node = byId.get(id)!;
    visit(node.left);
    order.push(node.value);
    visit(node.right);
  };
  visit(input.root);
  const height = (id: number | null): number =>
    id === null ? -1 : 1 + Math.max(height(byId.get(id)!.left), height(byId.get(id)!.right));
  return { order, height: height(input.root) };
}
describe('duyệt giữa', () => {
  it('khớp chính xác tham chiếu trên 150 seed ngẫu nhiên', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output, `seed ${seed}`).toEqual(reference(input));
      expect(check(input, output)).toMatchObject({ ok: true });
    }
  });
  it('trace tua lại đúng trạng thái cuối — mọi đỉnh đã thăm', () => {
    const input = generate(5, 'small');
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(store.length);
    expect(final.nodes.every(n => n.role === 'best')).toBe(true);
  });
  it('bước "visit" giải thích bằng tiếng Việt', () => {
    const input = generate(1, 'tiny');
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const visit = rec.steps.find(s => s.lineId === 'visit');
    expect(visit?.explain).toContain('Thăm');
  });
});
