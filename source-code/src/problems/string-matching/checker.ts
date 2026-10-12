import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function bruteForcePositions(input: Input): number[] {
 const {text, pattern} = input;
 const out: number[] = [];
 for (let s = 0; s + pattern.length <= text.length; s++) {
  let ok = true;
  for (let j = 0; j < pattern.length; j++) {
   if (text[s + j] !== pattern[j]) {
    ok = false;
    break;
   }
  }
  if (ok) out.push(s);
 }
 return out;
}

export function check(input: Input, output: Output): Verdict {
 if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
 if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
 const expected = bruteForcePositions(input);
 const got = [...output.positions].sort((a, b) => a - b);
 const exp = [...expected].sort((a, b) => a - b);
 if (got.length !== exp.length || got.some((v, i) => v !== exp[i])) {
  return {ok: false, reason: 'Tập vị trí tìm được không khớp với vét cạn'};
 }
 return {ok: true, optimal: true, score: got.length};
}
