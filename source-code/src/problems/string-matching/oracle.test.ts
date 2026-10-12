import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as brute } from '../../algorithms/string-matching/brute-force';
import { algorithm as horspool } from '../../algorithms/string-matching/horspool';
import { algorithm as boyerMoore } from '../../algorithms/string-matching/boyer-moore';
import { check } from './checker';

it('native indexOf xác nhận cả ba thuật toán với khớp chồng lấp và mẫu dài hơn văn bản', () => {
  for (const input of [
    { text: 'ABABABA', pattern: 'ABA' },
    { text: 'ABC', pattern: 'ABCD' },
    { text: 'AAAAAA', pattern: 'AAA' },
  ]) {
    const expected: number[] = [];
    for (let from = 0; from < input.text.length;) {
      const index = input.text.indexOf(input.pattern, from);
      if (index < 0) break;
      expected.push(index);
      from = index + 1;
    }
    for (const algo of [brute, horspool, boyerMoore]) {
      const output = algo.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
      expect(output.positions).toEqual(expected);
      expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
    }
  }
});
