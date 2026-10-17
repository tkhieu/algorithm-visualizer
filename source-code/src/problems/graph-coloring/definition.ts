import {z} from 'zod';
/** 'k-coloring' (mặc định): bài toán quyết định k màu, giữ nguyên hành vi gốc.
 * 'chromatic': tìm sắc số χ(G), tham số colors bị bỏ qua. */
export const modeSchema = z.enum(['k-coloring', 'chromatic']);
export type Mode = z.infer<typeof modeSchema>;
/** Xuất ra ngoài (dùng lại ở ui.tsx khi kẹp số cạnh của bộ sinh ngẫu nhiên) để hai nơi không bao
 * giờ lệch nhau — một hằng số duy nhất, không phải hai số viết tay ở hai file. */
export const MAX_NODES = 320;
export const MAX_EDGES = 8000;
export const inputSchema = z.object({
  nodes: z.array(z.string().trim().min(1).max(20)).max(MAX_NODES),
  edges: z.array(z.object({from: z.string(), to: z.string()})).max(MAX_EDGES),
  colors: z.number().int().min(1).max(10),
  mode: modeSchema.optional(),
});
export const outputSchema = z.object({
  found: z.boolean(),
  coloring: z.array(z.number().int().nonnegative()),
  heuristic: z.boolean().optional(),
  colorsUsed: z.number().int().nonnegative().optional(),
  chromaticExact: z.boolean().optional(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  `Cho một đồ thị vô hướng (bài toán "Sở thú": mỗi đỉnh là một loài, cạnh nối hai loài không thể ở ` +
  `chung chuồng). Ở chế độ "k-coloring" (mặc định), cho sẵn số màu k: hãy gán cho mỗi đỉnh một màu trong k màu ` +
  `sao cho hai đỉnh kề nhau không cùng màu — thuật toán chính xác có thể chứng minh vô nghiệm, thuật toán tham ` +
  `lam chỉ báo chưa tìm được cách tô. Ở chế độ "chromatic", tham số k bị bỏ qua: hãy tìm sắc số χ(G) — số màu ` +
  `tối thiểu để tô được đồ thị.`;
export const constraints = [
  '0 ≤ số đỉnh ≤ 320',
  '1 ≤ k ≤ 10 (chỉ dùng ở chế độ "k-coloring")',
  'Cạnh vô hướng, không trọng số',
  'Chế độ "chromatic" bỏ qua k, tìm χ(G) nhỏ nhất',
];
