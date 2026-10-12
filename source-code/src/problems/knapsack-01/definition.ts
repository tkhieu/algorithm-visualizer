import {z} from 'zod';
export const inputSchema=z.object({capacity:z.number().int().min(0).max(2000),items:z.array(z.object({name:z.string().trim().min(1).max(40),weight:z.number().int().min(1).max(2000),value:z.number().int().min(0).max(100000)})).max(100)});
export const outputSchema=z.object({value:z.number().int().nonnegative(),weight:z.number().int().nonnegative(),selected:z.array(z.number().int().nonnegative())});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement=`Cho một chiếc túi có sức chứa W và n đồ vật. Mỗi đồ vật i có khối lượng wᵢ và giá trị vᵢ. Chỉ được chọn hoặc bỏ toàn bộ mỗi đồ vật, mỗi đồ vật tối đa một lần. Hãy chọn tập đồ vật có tổng khối lượng không vượt W và tổng giá trị lớn nhất.`;
export const constraints=['0 ≤ W ≤ 2000','0 ≤ n ≤ 100','1 ≤ wᵢ ≤ 2000','0 ≤ vᵢ ≤ 100000','Tên đồ vật từ 1 đến 40 ký tự'];
