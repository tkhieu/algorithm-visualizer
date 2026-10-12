import {z} from 'zod';
export const inputSchema=z.object({n:z.number().int().min(1).max(5)});export const outputSchema=z.object({kind:z.enum(['permutations','subsets','gray']),objects:z.array(z.array(z.number().int().nonnegative()))});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement='Với n phần tử 1..n, hãy sinh toàn bộ hoán vị hoặc toàn bộ tập con dạng chuỗi bit n vị trí. Biến thể Gray sắp các chuỗi bit sao cho hai chuỗi kề nhau khác đúng một bit. Ví dụ n=2: hoán vị [1,2],[2,1]; tập con 00,01,10,11.';
export const constraints=['1 ≤ n ≤ 5','Mỗi đối tượng phải xuất hiện đúng một lần'];
