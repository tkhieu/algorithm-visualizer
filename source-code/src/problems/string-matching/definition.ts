import { z } from 'zod';

export const inputSchema = z.object({
  text: z.string().min(1).max(400),
  pattern: z.string().min(1).max(60),
});
export const outputSchema = z.object({ positions: z.array(z.number().int().nonnegative()) });
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  'Cho văn bản T gồm n ký tự và mẫu P gồm m ký tự (m ≤ n). Hãy tìm tất cả vị trí ' +
  '(chỉ số bắt đầu, đánh từ 0) trong T mà P xuất hiện làm đoạn con liên tiếp.';
export const constraints = [
  '1 ≤ |P| ≤ 60',
  '1 ≤ |T| ≤ 400',
  'Ký tự lấy từ bảng chữ cái in hoa A–D (để minh hoạ bảng dịch rõ ràng)',
];
