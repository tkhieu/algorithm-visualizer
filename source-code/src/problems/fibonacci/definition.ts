import {z} from 'zod';
export const inputSchema=z.object({n:z.number().int().min(0).max(20)});export const outputSchema=z.object({value:z.number().int().nonnegative()});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement='Cho n, tính F(n) với F(0)=0, F(1)=1 và F(n)=F(n−1)+F(n−2). Ví dụ: n=6 → 8; n=0 → 0.';
export const constraints=['0 ≤ n ≤ 20 (giới hạn để xem cây đệ quy thuần)'];
