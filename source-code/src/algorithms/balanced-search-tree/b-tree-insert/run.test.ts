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
function checkMultiwayInvariant(
  state: VisualState,
  maxKeys: number,
): { ordered: boolean; keyCountOk: boolean; sameLeafDepth: boolean; height: number } {
  const byId = new Map(state.nodes.map(n => [n.id, n]));
  const childrenOf = (id: string) => state.nodes.filter(n => n.parent === id);
  const root = state.nodes.find(n => n.parent === null);
  let ordered = true,
    keyCountOk = true;
  const leafDepths = new Set<number>();
  if (!root) return { ordered, keyCountOk, sameLeafDepth: true, height: -1 };
  const visit = (id: string, lo: number, hi: number, depth: number): number => {
    const node = byId.get(id)!;
    const keys = node.label.split(',').map(Number);
    if (keys.length < 1 || keys.length > maxKeys) keyCountOk = false;
    for (let i = 0; i < keys.length; i++) {
      if (!(keys[i] > lo && keys[i] < hi)) ordered = false;
      if (i > 0 && keys[i] <= keys[i - 1]) ordered = false;
    }
    const kids = childrenOf(id);
    if (kids.length === 0) {
      leafDepths.add(depth);
      return 0;
    }
    if (kids.length !== keys.length + 1) ordered = false;
    const heights = kids.map((kid, i) => {
      const childLo = i === 0 ? lo : keys[i - 1];
      const childHi = i === kids.length - 1 ? hi : keys[i];
      return visit(kid.id, childLo, childHi, depth + 1);
    });
    return 1 + Math.max(...heights);
  };
  const height = visit(root.id, -Infinity, Infinity, 0);
  return { ordered, keyCountOk, sameLeafDepth: leafDepths.size <= 1, height };
}
describe('chèn cây B (bậc 4)', () => {
  it('thoả bất biến cây B trên 150 seed ngẫu nhiên, đúng tập khóa', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(check(input, output), `seed ${seed}`).toMatchObject({ ok: true });
      const inv = checkMultiwayInvariant(traceFinal(input), 3);
      expect(inv.ordered, `seed ${seed}`).toBe(true);
      expect(inv.keyCountOk, `seed ${seed}`).toBe(true);
      expect(inv.sameLeafDepth, `seed ${seed}`).toBe(true);
      expect(inv.height, `seed ${seed}`).toBe(output.height);
    }
  });
  it('dãy tăng dần vẫn giữ cây cân bằng (mọi lá cùng mức)', () => {
    const input = { keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
    const output = solve(input);
    const inv = checkMultiwayInvariant(traceFinal(input), 3);
    expect(inv.sameLeafDepth).toBe(true);
    expect(output.height).toBeLessThanOrEqual(4);
  });
  it('bước "split" giải thích bằng tiếng Việt khi nút đầy', () => {
    const rec = new TraceRecorder(
      algorithm.initVisual({ keys: [1, 2, 3, 4] }),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run({ keys: [1, 2, 3, 4] }, { rec, signal: new AbortController().signal });
    const split = rec.steps.find(s => s.lineId === 'split');
    expect(split?.explain).toContain('tách');
  });
});
