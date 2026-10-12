import { describe, it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/sorting/generators';
import { check } from '../../../problems/sorting/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
import type { Input } from '../../../problems/sorting/definition';
function solve(input: Input) {
  return algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
}
describe('sắp xếp trộn', () => {
  it('đúng kết quả trên 150 seed ngẫu nhiên, đối chiếu Array.sort', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output.sorted, `seed ${seed}`).toEqual([...input.values].sort((a, b) => a - b));
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
    expect(final.values).toEqual(output.sorted);
  });
  it('bước "place" giải thích bằng tiếng Việt', () => {
    const input = { values: [3, 1, 2] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const place = rec.steps.find(s => s.lineId === 'place');
    expect(place?.explain).toContain('Đặt');
  });
});
