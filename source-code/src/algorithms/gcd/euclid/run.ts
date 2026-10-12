import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/gcd/definition';
import type { VisualState } from '../shared';
export function run({ a, b }: Input, { rec, signal }: RunContext<VisualState>): Output {
  while (b !== 0) {
    if (signal.aborted) throw new Error('Đã huỷ');
    rec.count('compare');
    const r = a % b;
    rec.step('remainder', `Chia ${a} cho ${b}, số dư là ${r}.`, (d) => {
      d.items.push({ label: `${a} mod ${b} = ${r}` });
      d.current = d.items.length - 1;
      d.note = `Cặp mới (${b}, ${r})`;
    });
    a = b;
    b = r;
  }
  rec.step('done', `Ước chung lớn nhất là ${a}.`, (d) => {
    d.items.push({ label: String(a), role: 'done' });
    d.current = d.items.length - 1;
    d.note = `ƯCLN = ${a}`;
  });
  return { gcd: a };
}
