import { z } from 'zod';
export const nodeSchema = z.object({
  id: z.number().int().min(0),
  value: z.number().int().min(-999).max(999),
  left: z.number().int().min(0).nullable(),
  right: z.number().int().min(0).nullable(),
});
export const inputSchema = z
  .object({ nodes: z.array(nodeSchema).max(31), root: z.number().int().min(0).nullable() })
  .superRefine((v, ctx) => {
    const n = v.nodes.length;
    const ids = new Set(v.nodes.map(x => x.id));
    if (ids.size !== n) ctx.addIssue({ code: 'custom', message: 'id trùng lặp' });
    for (const node of v.nodes) {
      if (node.id < 0 || node.id >= n)
        ctx.addIssue({ code: 'custom', message: 'id ngoài phạm vi' });
      for (const c of [node.left, node.right]) {
        if (c === null) continue;
        if (c === node.id) ctx.addIssue({ code: 'custom', message: 'đỉnh tự tham chiếu' });
        else if (c < 0 || c >= n || !ids.has(c))
          ctx.addIssue({ code: 'custom', message: 'con tham chiếu id không tồn tại' });
      }
    }
    if (v.root !== null && !ids.has(v.root))
      ctx.addIssue({ code: 'custom', message: 'root không hợp lệ' });
    if (v.root === null && n > 0)
      ctx.addIssue({ code: 'custom', message: 'cây không rỗng phải có root' });
    const childCount = new Map<number, number>();
    for (const node of v.nodes)
      for (const c of [node.left, node.right])
        if (c !== null) childCount.set(c, (childCount.get(c) ?? 0) + 1);
    if ([...childCount.values()].some(c => c > 1))
      ctx.addIssue({ code: 'custom', message: 'một đỉnh có nhiều cha' });
    if (v.root !== null && childCount.has(v.root))
      ctx.addIssue({ code: 'custom', message: 'gốc không được là con của đỉnh khác' });
    if (v.root !== null) {
      const visited = new Set<number>();
      const stack = [v.root];
      while (stack.length) {
        const id = stack.pop()!;
        if (visited.has(id)) continue;
        visited.add(id);
        const node = v.nodes.find(x => x.id === id);
        if (!node) continue;
        if (node.left !== null) stack.push(node.left);
        if (node.right !== null) stack.push(node.right);
      }
      if (visited.size !== n)
        ctx.addIssue({ code: 'custom', message: 'cây không liên thông hoặc có chu trình' });
    }
  });
export const outputSchema = z.object({
  order: z.array(z.number().int()),
  height: z.number().int(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một cây nhị phân (mỗi đỉnh có tối đa một con trái và một con phải). Hãy liệt kê ` +
  `thứ tự các giá trị khi duyệt cây và tính độ cao của cây (số cạnh trên đường đi dài ` +
  `nhất từ gốc tới lá; cây rỗng có độ cao -1).`;
export const constraints = [
  '0 ≤ số đỉnh ≤ 31',
  '-999 ≤ giá trị ≤ 999',
  'Cây không có chu trình, mỗi đỉnh có đúng một cha (trừ gốc)',
];
