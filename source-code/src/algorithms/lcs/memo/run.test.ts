import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalLength} from '../../../problems/lcs/checker';
import {generate} from '../../../problems/lcs/generators';

describe('lcs/memo', () => {
  it('tìm đúng độ dài LCS tối ưu trên nhiều seed và cỡ', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.length).toBe(optimalLength(input.a, input.b));
      }
    }
  });

  it('khớp ví dụ kinh điển (4) và có xuất hiện lượt lấy từ bảng nhớ', () => {
    const input = {a: 'ABCBDAB', b: 'BDCABA'};
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(output.length).toBe(4);
    expect(rec.steps.some((s) => s.explain.includes('đã có trong bảng nhớ'))).toBe(true);
  });

  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {a: 'ABCBDAB', b: 'BDCABA'};
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    const final = store.seek(rec.steps.length);
    expect(final.matrix[7][6]).toBe(output.length);
    expect(rec.steps.some((s) => s.explain.includes('thêm vào dãy con'))).toBe(true);
  });
});
