import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/exponentiation/definition';
import { record, finish, type VisualState } from '../shared';
export function run({ base, exponent }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let value = 1n;
  for (const bit of exponent.toString(2)) {
    if (signal.aborted) throw new Error('Đã huỷ');
    value *= value;
    rec.count('assign');
    record(rec, 'square', `Bình phương tích lũy theo bit ${bit}: ${value}.`, value);
    if (bit === '1') {
      value *= BigInt(base);
      rec.count('assign');
      record(rec, 'multiply', `Bit bằng 1, nhân thêm cơ số ${base}: ${value}.`, value);
    }
  }
  return finish(rec, value);
}
