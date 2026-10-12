import { describe, it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/dictionary-hashing/generators';
import { check } from '../../../problems/dictionary-hashing/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
import type { Input, Output } from '../../../problems/dictionary-hashing/definition';
function solve(input: Input) {
  return algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
}
function reference(input: Input): Output {
  const buckets: number[][] = Array.from({ length: input.tableSize }, () => []);
  for (const k of input.keys)
    buckets[((k % input.tableSize) + input.tableSize) % input.tableSize].push(k);
  return { buckets };
}
describe('băm với danh sách liên kết', () => {
  it('khớp chính xác tham chiếu trên 150 seed ngẫu nhiên', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output, `seed ${seed}`).toEqual(reference(input));
      expect(check(input, output)).toMatchObject({ ok: true });
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
    expect(final.buckets.map(b => b.entries.map(e => e.key))).toEqual(output.buckets);
  });
  it('bước "insert" giải thích bằng tiếng Việt', () => {
    const input = { tableSize: 5, keys: [3, 8] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const insert = rec.steps.find(s => s.lineId === 'insert');
    expect(insert?.explain).toContain('Thêm');
  });
});
