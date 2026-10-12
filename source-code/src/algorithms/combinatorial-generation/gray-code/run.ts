import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/combinatorial-generation/definition';
import { emit, finish, type VisualState } from '../shared';
export function run({ n }: Input, { rec, signal }: RunContext<VisualState>): Output {
  const objects: number[][] = [];
  for (let i = 0; i < 2 ** n; i++) {
    if (signal.aborted) throw new Error('Đã huỷ');
    // XOR i với i dịch phải một bit tạo thứ tự Gray, mỗi bước chỉ đổi một bit.
    const value = i ^ (i >> 1),
      bits = Array.from({ length: n }, (_, j) => (value >> (n - j - 1)) & 1);
    objects.push(bits);
    emit(rec, bits, `Mã Gray thứ ${i} là ${bits.join('')}; khác mã trước một bit.`);
  }
  return finish(rec, 'gray', objects);
}
