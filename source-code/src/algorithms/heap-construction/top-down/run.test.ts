import { describe, it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/heap-construction/generators';
import { check } from '../../../problems/heap-construction/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
import type { Input } from '../../../problems/heap-construction/definition';
function solve(input: Input) {
  return algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
}
describe('xây đống từ trên xuống', () => {
  it('trả về max-heap hợp lệ trên 150 seed ngẫu nhiên', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(check(input, output), `seed ${seed}`).toMatchObject({ ok: true });
    }
  });
  it('trace tua lại đúng trạng thái cuối', () => {
    const input = generate(5, 'small');
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    const output = algorithm.run(input, { rec, signal: new AbortController().signal });
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(store.length);
    expect(final.values).toEqual(output.heap);
    expect(final.nodes.map(n => Number(n.label))).toEqual(output.heap);
  });
  it('bước "swap" giải thích bằng tiếng Việt khi có đổi chỗ', () => {
    const input = { values: [1, 2, 3, 4, 5] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const swap = rec.steps.find(s => s.lineId === 'swap');
    expect(swap?.explain).toContain('Đổi chỗ');
  });
});
