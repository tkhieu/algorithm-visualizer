import {z} from 'zod';
export const pointSchema=z.object({x:z.number().int().min(-1000).max(1000),y:z.number().int().min(-1000).max(1000)});
export const inputSchema=z.object({points:z.array(pointSchema).min(2).max(200)});
export const outputSchema=z.object({i:z.number().int().nonnegative(),j:z.number().int().nonnegative(),distance:z.number().nonnegative()});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement=`Cho n điểm trên mặt phẳng. Hãy tìm cặp điểm có khoảng cách Euclid nhỏ nhất.`;
export const constraints=['2 ≤ n ≤ 200','Toạ độ nguyên trong [-1000, 1000]'];
