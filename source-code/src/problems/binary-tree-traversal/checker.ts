import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
function heightOf(input: Input, id: number | null): number {
  if (id === null) return -1;
  const node = input.nodes.find(n => n.id === id)!;
  return 1 + Math.max(heightOf(input, node.left), heightOf(input, node.right));
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  if (output.order.length !== input.nodes.length)
    return { ok: false, reason: 'Số phần tử trong thứ tự duyệt không khớp số đỉnh' };
  const expectedValues = [...input.nodes.map(n => n.value)].sort((a, b) => a - b);
  const gotValues = [...output.order].sort((a, b) => a - b);
  if (JSON.stringify(expectedValues) !== JSON.stringify(gotValues))
    return { ok: false, reason: 'Thứ tự duyệt không chứa đúng các giá trị của cây' };
  if (output.height !== heightOf(input, input.root))
    return { ok: false, reason: 'Độ cao tính sai' };
  return { ok: true };
}
