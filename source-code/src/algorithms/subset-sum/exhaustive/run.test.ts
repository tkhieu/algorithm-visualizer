import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, existsSubset} from '../../../problems/subset-sum/checker';
import {generate} from '../../../problems/subset-sum/generators';
import {execute} from '../../../core/worker-protocol/execute';
describe('subset-sum/exhaustive', () => {
  it('đúng so với tham chiếu trên nhiều seed cỡ nhỏ/trung', () => {
    for (let seed = 1; seed <= 40; seed++)
      for (const size of ['tiny', 'small', 'medium'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.found).toBe(existsSubset(input));
      }
  });
  it('precondition từ chối n vượt giới hạn an toàn bằng lý do tiếng Việt, không phải lỗi ném ra', () => {
    const big = {values: Array.from({length: 23}, () => 1), target: 10};
    expect(algorithm.precondition?.(big)).toMatch(/n ≤ 12/);
  });
  it('execute() trả "không áp dụng" (không phải "error") khi vượt giới hạn an toàn', async () => {
    const big = {values: Array.from({length: 20}, () => 1), target: 10};
    const result = await execute(algorithm.id, big, true);
    expect(result).toMatchObject({status: 'not-applicable'});
    expect(result.status === 'not-applicable' && result.reason).toMatch(/n ≤ 12/);
  });
  it('S=0 trả ngay tập rỗng dù n bằng giới hạn schema, precondition không chặn trường hợp này', () => {
    const input = {values: Array.from({length: 20}, () => 1), target: 0};
    expect(algorithm.precondition?.(input)).toBeUndefined();
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map((line) => line.id)),
      algorithm.traceLimit,
    );
    expect(algorithm.run(input, {rec, signal: new AbortController().signal}))
      .toEqual({found: true, indices: []});
    expect(rec.steps).toHaveLength(1);
  });
  it('precondition chặn n hợp lệ theo schema (≤ 20) nhưng vượt giới hạn công việc vét cạn, target ≠ 0', () => {
    const input = {values: Array.from({length: 20}, () => 1), target: 100};
    expect(algorithm.precondition?.(input)).toMatch(/n ≤ 12/);
  });
  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {values: [3, 34, 4, 12, 5, 2], target: 9};
    const rec = new TraceRecorder(
      algorithm.initVisual(input),
      new Set(algorithm.pseudocode.map((l) => l.id)),
      algorithm.traceLimit,
    );
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(rec.steps.length);
    const best = final.nodes.filter((n) => n.status === 'best');
    expect(best).toHaveLength(1);
    expect(best[0].value).toBe(9);
    expect(output.found).toBe(true);
    expect(rec.steps.some((s) => s.explain.includes('nghiệm'))).toBe(true);
  });
});
