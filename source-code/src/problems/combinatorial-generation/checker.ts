import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function reference(n: number, kind: Output['kind']): number[][] {
  if (kind === 'permutations') {
    const result: number[][] = [];
    function walk(prefix: number[], rest: number[]) {
      if (rest.length === 0) {
        result.push(prefix);
        return;
      }
      for (let i = 0; i < rest.length; i++)
        walk([...prefix, rest[i]], [...rest.slice(0, i), ...rest.slice(i + 1)]);
    }
    walk(
      [],
      Array.from({ length: n }, (_, i) => i + 1)
    );
    return result;
  }
  return Array.from({ length: 2 ** n }, (_, i) => {
    const value = kind === 'gray' ? i ^ (i >> 1) : i;
    return Array.from({ length: n }, (_, j) => (value >> (n - j - 1)) & 1);
  });
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const expected = reference(input.n, output.kind);
  const key = (x: number[]) => x.join(',');
  const actual = output.objects.map(key);
  if (
    actual.length !== expected.length ||
    new Set(actual).size !== actual.length ||
    actual.some((v) => !expected.some((e) => key(e) === v))
  )
    return { ok: false, reason: 'Thiếu, trùng hoặc sai đối tượng' };
  if (
    output.kind === 'gray' &&
    output.objects.some(
      (v, i) => i > 0 && v.filter((bit, j) => bit !== output.objects[i - 1][j]).length !== 1
    )
  )
    return { ok: false, reason: 'Mã Gray kề nhau phải khác đúng một bit' };
  return { ok: true };
}
