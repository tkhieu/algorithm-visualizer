import {z} from 'zod';
export const inputSchema = z.object({
  nodes: z.array(z.string().trim().min(1).max(20)).min(1).max(10),
  edges: z.array(z.object({from: z.string(), to: z.string()})).max(100),
  colors: z.number().int().min(1).max(10),
});
export const outputSchema = z.object({found: z.boolean(), coloring: z.array(z.number().int().nonnegative())});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một đồ thị vô hướng (bài toán "Sở thú": mỗi đỉnh là một loài, cạnh nối hai loài không thể ở ` +
  `chung chuồng) và một số màu k cho trước. Hãy gán cho mỗi đỉnh một màu trong k màu sao cho hai đỉnh kề nhau ` +
  `không cùng màu, hoặc báo không thể với k màu đã cho.`;
export const constraints = ['1 ≤ số đỉnh ≤ 10', '1 ≤ k ≤ 10', 'Cạnh vô hướng, không trọng số'];
