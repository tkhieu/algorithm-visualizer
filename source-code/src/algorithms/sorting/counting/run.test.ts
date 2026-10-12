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
describe('sắp xếp đếm phân phối', () => {
  it('đúng kết quả trên 150 seed ngẫu nhiên, đối chiếu Array.sort', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const input = generate(seed, 'small');
      const output = solve(input);
      expect(output.sorted, `seed ${seed}`).toEqual([...input.values].sort((a, b) => a - b));
      expect(check(input, output)).toMatchObject({ ok: true });
    }
  });
  it('xử lý đúng dãy rỗng và dãy toàn phần tử giống nhau', () => {
    expect(solve({ values: [] }).sorted).toEqual([]);
    expect(solve({ values: [4, 4, 4] }).sorted).toEqual([4, 4, 4]);
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
  it('ổn định: giữ đúng thứ tự gốc (tag) cho các khóa bằng nhau', () => {
    // values[1]=3 (idx 1) đứng trước values[4]=3 (idx 4); values[0]=5 (idx 0) đứng trước
    // values[2]=5 (idx 2). Sắp xếp ổn định phải giữ đúng thứ tự tương đối này trong kết quả.
    const input = { values: [5, 3, 5, 1, 3] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    const output = algorithm.run(input, { rec, signal: new AbortController().signal });
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(store.length);
    expect(output.sorted).toEqual([1, 3, 3, 5, 5]);
    expect(final.tags).toEqual([3, 1, 4, 0, 2]);
  });
  it('bước "distribute" tích lũy đúng số phần tử nhỏ hơn hoặc bằng mỗi giá trị', () => {
    const input = { values: [5, 3, 5, 1, 3] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const distribute = rec.steps.filter(s => s.lineId === 'distribute');
    expect(distribute.length).toBeGreaterThan(0);
    expect(distribute.every(s => s.explain.includes('Tích lũy'))).toBe(true);
  });
  it('bước "tally" giải thích bằng tiếng Việt', () => {
    const input = { values: [3, 1, 2] };
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map(l => l.id)),
      algorithm.traceLimit,
    );
    algorithm.run(input, { rec, signal: new AbortController().signal });
    const tally = rec.steps.find(s => s.lineId === 'tally');
    expect(tally?.explain).toContain('Đếm thêm');
  });
});
