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
function referenceMode(input: Input): { unique: boolean; duplicate: number | null } {
  const sorted = [...input.values].sort((a, b) => a - b);
  let best: number | null = null,
    bestCount = 0,
    runStart = 0;
  for (let i = 0; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i] !== sorted[runStart]) {
      const len = i - runStart;
      if (len > bestCount) {
        bestCount = len;
        best = sorted[runStart];
      }
      runStart = i;
    }
  }
  return bestCount >= 2 ? { unique: false, duplicate: best } : { unique: true, duplicate: null };
}
describe('tìm mode bằng sắp xếp trước', () => {
  it('đúng kết quả mode trên 150 seed ngẫu nhiên, đối chiếu đếm tần suất trực tiếp', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output, `seed ${seed}`).toEqual(referenceMode(input));
      expect(check(input, output)).toMatchObject({ ok: true });
    }
  });
  it('trace tua lại đúng trạng thái cuối', () => {
    const input = { values: [1, 2, 2, 3, 2, 4, 2, 5] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    const output = algorithm.run(input, { rec, signal: new AbortController().signal });
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(store.length);
    expect(output).toEqual({ unique: false, duplicate: 2 });
    expect(final.marks.filter(m => m.role === 'found').length).toBe(4);
  });
  it('bước "done" giải thích mode bằng tiếng Việt', () => {
    const input = { values: [1, 2, 2, 3, 2, 4, 2, 5] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    expect(rec.steps.at(-1)?.explain).toContain('Mode');
  });
});
