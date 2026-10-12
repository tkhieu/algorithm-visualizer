import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/fibonacci/definition';
import type { VisualState } from '../shared';
export function run({ n }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let next = 0;
  function fib(k: number, parent: string | null): number {
    if (signal.aborted) throw new Error('Đã huỷ');
    const id = parent === null ? 'root' : `call-${++next}`;
    rec.count('recurse');
    if (parent !== null)
      rec.step('call', `Gọi F(${k}) từ lời gọi cha.`, (d) => {
        if (d.nodes.length < 200) d.nodes.push({ id, parent, label: `F(${k})`, role: 'current' });
        d.note = `Đang tính F(${k})`;
      });
    if (k < 2) {
      rec.step('base', `F(${k}) = ${k} là trường hợp cơ sở.`, (d) => {
        d.items.push({ label: `F(${k})=${k}` });
        d.current = d.items.length - 1;
        d.note = `Giá trị cơ sở ${k}`;
      });
      return k;
    }
    const value = fib(k - 1, id) + fib(k - 2, id);
    rec.count('assign');
    rec.step('combine', `F(${k}) = F(${k - 1}) + F(${k - 2}) = ${value}.`, (d) => {
      d.items.push({ label: `F(${k})=${value}` });
      d.current = d.items.length - 1;
      d.note = `F(${k}) = ${value}`;
    });
    return value;
  }
  const value = fib(n, null);
  rec.step('done', `Kết quả F(${n}) = ${value}.`, (d) => {
    d.items.push({ label: String(value), role: 'done' });
    d.current = d.items.length - 1;
    d.note = `F(${n}) = ${value}`;
  });
  return { value };
}
