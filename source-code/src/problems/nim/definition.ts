import { z } from 'zod';
export const inputSchema = z.object({
  piles: z.array(z.number().int().min(0).max(1000)).min(1).max(10)
});
export const outputSchema = z.object({
  winning: z.boolean(),
  pile: z.number().int().min(-1),
  remove: z.number().int().nonnegative()
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;
export const statement =
  'Trò chơi Nim thường: mỗi lượt lấy ít nhất một vật từ đúng một đống; người lấy vật cuối thắng. ' +
  'Với các kích thước đống đã cho, xác định người đi trước có thế thắng và nếu có, ' +
  'đưa ra một nước đi làm XOR của các đống còn lại bằng 0. ' +
  'Ví dụ: [1,2,3] → thua; [1,2,4] → thắng.';
export const constraints = [
  '1 ≤ số đống ≤ 10',
  '0 ≤ vật trong mỗi đống ≤ 1000',
  'Nếu tất cả đống rỗng thì người đi trước thua'
];
