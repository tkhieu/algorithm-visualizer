import {describe, it, expect} from 'vitest';
import {algorithm} from './index';
import {MetricsRecorder, TraceRecorder} from '../../../core/recorder';
import {TraceStore} from '../../../core/trace/TraceStore';
import {check, optimalLength} from '../../../problems/lcs/checker';
import {generate} from '../../../problems/lcs/generators';

describe('lcs/brute-force', () => {
  it('tìm đúng độ dài LCS tối ưu trên nhiều seed cỡ nhỏ', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const size of ['tiny', 'small'] as const) {
        const input = generate(seed, size);
        const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
        expect(check(input, output).ok, `seed ${seed} ${size}`).toBe(true);
        expect(output.length).toBe(optimalLength(input.a, input.b));
      }
    }
  });

  it('khớp ví dụ kinh điển (4)', () => {
    const output = algorithm.run({a: 'ABCBD', b: 'BDCAB'}, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output.length).toBe(optimalLength('ABCBD', 'BDCAB'));
  });

  it('từ chối tổng độ dài vượt giới hạn an toàn', () => {
    const big = {a: 'A'.repeat(10), b: 'B'.repeat(10)};
    expect(() => algorithm.run(big, {rec: new MetricsRecorder(), signal: new AbortController().signal})).toThrow();
  });

  it('trace tua lại đúng và khớp output cuối', () => {
    const input = {a: 'ABCBD', b: 'BDCAB'};
    const rec = new TraceRecorder(algorithm.initVisual(input), new Set(algorithm.pseudocode.map((l) => l.id)), algorithm.traceLimit);
    const output = algorithm.run(input, {rec, signal: new AbortController().signal});
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(algorithm.initVisual(input));
    for (const step of rec.steps) store.append(step);
    expect(rec.steps.some((s) => s.explain.includes('nối thêm vào kết quả'))).toBe(true);
    expect(output.subsequence.length).toBe(output.length);
  });
});
