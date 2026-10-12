import {z} from 'zod';
export const inputSchema = z.object({
  nodes: z.array(z.string().trim().min(1).max(20)).min(1).max(10),
  edges: z.array(z.object({from: z.string(), to: z.string()})).max(100),
});
export const outputSchema = z.object({found: z.boolean(), circuit: z.array(z.string())});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một đồ thị vô hướng gồm các đỉnh và cạnh. Chu trình Hamilton là một chu trình đi qua mỗi ` +
  `đỉnh đúng một lần rồi quay về đỉnh xuất phát. Hãy tìm một chu trình Hamilton nếu tồn tại, hoặc báo không tồn tại.`;
export const constraints = [
  '1 ≤ số đỉnh ≤ 10',
  'Cạnh vô hướng, không trọng số',
  'Không có khuyên (tự nối) hoặc cạnh trùng hợp lệ nhưng bị bỏ qua khi tính',
];
