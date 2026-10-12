import {z} from 'zod';

export const inputSchema = z.object({values: z.array(z.number().int().min(0).max(1000)).max(60)});
export const outputSchema = z.object({
 value: z.number().int().nonnegative(),
 selected: z.array(z.number().int().nonnegative()),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement = 'Cho một dãy n đồng xu có giá trị c₁, c₂, …, cₙ xếp thành một hàng. Hãy chọn ' +
 'một tập con các đồng xu không có hai đồng xu liền kề nào cùng được chọn, sao cho tổng giá trị lớn nhất.';
export const constraints = ['0 ≤ n ≤ 60', '0 ≤ cᵢ ≤ 1000'];
