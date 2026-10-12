import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/exponentiation/definition';
import { record, finish, type VisualState } from '../shared';
export function run({ base, exponent }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let value = 1n;
  for (let i = 0; i < exponent; i++) {
    if (signal.aborted) throw new Error('Đã huỷ');
    value *= BigInt(base);
    rec.count('assign');
    record(rec, 'multiply', `Nhân lần ${i + 1} với ${base}: tích ${value}.`, value);
  }
  return finish(rec, value);
}
