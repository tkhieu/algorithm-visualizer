import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/polynomial-eval/definition';
import { record, finish, type VisualState } from '../shared';
export function run({ coefficients, x }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let value = 0;
  for (let i = 0; i < coefficients.length; i++) {
    if (signal.aborted) throw new Error('Đã huỷ');
    let power = 1;
    for (let j = 0; j < i; j++) {
      power *= x;
      rec.count('assign');
    }
    value += coefficients[i] * power;
    rec.count('assign');
    record(
      rec,
      `Tính trực tiếp a[${i}]·${x}^${i} = ${coefficients[i] * power}; tổng ${value}.`,
      value
    );
  }
  return finish(rec, value);
}
