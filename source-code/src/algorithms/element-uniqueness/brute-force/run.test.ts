import { describe, it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/element-uniqueness/generators';
import { check } from '../../../problems/element-uniqueness/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
import type { Input } from '../../../problems/element-uniqueness/definition';
function solve(input: Input) {
  return algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
}
function reference(input: Input): boolean {
  return new Set(input.values).size === input.values.length;
}
describe('so từng cặp — kiểm tra phần tử duy nhất', () => {
  it('đúng kết quả duy nhất/trùng trên 150 seed ngẫu nhiên, đối chiếu Set', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output.unique, `seed ${seed}`).toBe(reference(input));
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
    if (output.unique) expect(final.marks).toEqual([]);
    else
      expect(final.marks.filter(m => m.role === 'found').map(m => input.values[m.index])).toEqual([
        output.duplicate,
        output.duplicate,
      ]);
  });
  it('bước "found" giải thích bằng tiếng Việt khi có trùng', () => {
    const input = { values: [5, 3, 8, 1, 3, 2] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const found = rec.steps.find(s => s.lineId === 'found');
    expect(found?.explain).toContain('trùng');
  });
});
