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
  const m = input.tableSize;
  const slots: (number | null)[] = new Array(m).fill(null);
  for (const key of input.keys) {
    const home = ((key % m) + m) % m;
    let idx = home,
      probes = 0;
    while (probes < m && slots[idx] !== null) {
      idx = (idx + 1) % m;
      probes++;
    }
    if (slots[idx] === null) slots[idx] = key;
  }
  return { buckets: slots.map(s => (s === null ? [] : [s])) };
}
describe('băm với dò tuyến tính', () => {
  it('khớp chính xác tham chiếu trên 150 seed ngẫu nhiên', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output, `seed ${seed}`).toEqual(reference(input));
      expect(check(input, output)).toMatchObject({ ok: true });
    }
  });
  it('xử lý đúng khi bảng đầy (bỏ qua khóa dư)', () => {
    const input = { tableSize: 3, keys: [0, 3, 6, 9] };
    const output = solve(input);
    expect(output.buckets.flat().length).toBe(3);
    expect(check(input, output)).toMatchObject({ ok: true });
  });
  it('trace tua lại đúng trạng thái cuối', () => {
    const input = { tableSize: 5, keys: [2, 7, 12] };
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
  it('bước "probe" giải thích bằng tiếng Việt khi có va chạm', () => {
    const input = { tableSize: 5, keys: [2, 7] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const probe = rec.steps.find(s => s.lineId === 'probe');
    expect(probe?.explain).toContain('dò');
  });
});
