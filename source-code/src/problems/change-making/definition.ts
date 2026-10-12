import {z} from 'zod';

export const inputSchema = z.object({
 amount: z.number().int().min(0).max(1000),
 coins: z.array(z.number().int().min(1).max(500)).min(1).max(20),
});
export const outputSchema = z.object({
 count: z.number().int().nonnegative(),
 coins: z.array(z.number().int().positive()),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement = 'Cho số tiền A và các mệnh giá đồng xu (có thể dùng lại không hạn chế mỗi ' +
 'mệnh giá). Hãy đổi đúng số tiền A bằng số lượng đồng xu ít nhất có thể. Giả sử danh sách mệnh giá ' +
 'luôn chứa đồng xu giá trị 1 để luôn có nghiệm.';
export const constraints = [
 '0 ≤ A ≤ 1000',
 '1 ≤ số mệnh giá ≤ 20, mỗi mệnh giá từ 1 đến 500',
 'Danh sách mệnh giá chứa giá trị 1',
];
