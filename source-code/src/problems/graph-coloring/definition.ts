import {z} from 'zod';
export const inputSchema = z.object({
  nodes: z.array(z.string().trim().min(1).max(20)).max(10),
  edges: z.array(z.object({from: z.string(), to: z.string()})).max(100),
  colors: z.number().int().min(1).max(10),
});
export const outputSchema = z.object({
  found: z.boolean(),
  coloring: z.array(z.number().int().nonnegative()),
  heuristic: z.boolean().optional(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một đồ thị vô hướng (bài toán "Sở thú": mỗi đỉnh là một loài, cạnh nối hai loài không thể ở ` +
  `chung chuồng) và một số màu k cho trước. Hãy gán cho mỗi đỉnh một màu trong k màu sao cho hai đỉnh kề nhau ` +
  `không cùng màu. Thuật toán chính xác có thể chứng minh vô nghiệm; thuật toán tham lam chỉ báo chưa tìm được cách tô.`;
export const constraints = ['0 ≤ số đỉnh ≤ 10', '1 ≤ k ≤ 10', 'Cạnh vô hướng, không trọng số'];
