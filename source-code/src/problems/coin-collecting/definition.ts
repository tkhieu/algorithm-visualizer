import {z} from 'zod';

export const inputSchema = z.object({
 grid: z.array(z.array(z.boolean()).min(1).max(30)).min(1).max(30),
}).refine(
 v => v.grid.every(row => row.length === v.grid[0].length),
 {message: 'Các hàng phải có cùng độ dài'},
);
export const outputSchema = z.object({
 value: z.number().int().nonnegative(),
 path: z.array(z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()])),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement = 'Cho lưới n×m, một số ô có đồng xu. Một robot xuất phát ở ô (0,0), mỗi bước ' +
 'chỉ được đi sang phải hoặc xuống dưới, đến ô (n−1,m−1). Hãy tìm đường đi gom được nhiều đồng xu nhất.';
export const constraints = ['1 ≤ n, m ≤ 30'];
