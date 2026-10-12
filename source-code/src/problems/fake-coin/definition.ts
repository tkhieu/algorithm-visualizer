import {z} from 'zod';
export const inputSchema=z.object({weights:z.array(z.union([z.literal(9),z.literal(10)])).min(2).max(200)}).refine(v=>v.weights.filter(x=>x===9).length===1,'Phải có đúng một đồng xu nhẹ hơn');
export const outputSchema=z.object({index:z.number().int().nonnegative()});export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement='Có n đồng xu, đúng một xu giả nhẹ hơn các xu còn lại. Mỗi lần cân được đặt hai nhóm có cùng số xu lên đĩa cân. Hãy tìm vị trí xu giả (đếm từ 0). Ví dụ: [10,9,10] → 1; [10,10,9,10] → 2.';
export const constraints=['2 ≤ n ≤ 200','Xu thật nặng 10 đơn vị, xu giả nặng 9 đơn vị','Đúng một xu giả'];
