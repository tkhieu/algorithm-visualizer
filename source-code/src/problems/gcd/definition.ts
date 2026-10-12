import {z} from 'zod';
export const inputSchema=z.object({a:z.number().int().min(0).max(1000000),b:z.number().int().min(0).max(1000000)}).refine(v=>v.a+v.b>0,'Ít nhất một số phải dương');
export const outputSchema=z.object({gcd:z.number().int().positive()});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement='Cho hai số nguyên không âm a, b (không đồng thời bằng 0). Hãy tìm ước chung lớn nhất của chúng. Ví dụ: (18, 12) → 6; (0, 7) → 7.';
export const constraints=['0 ≤ a, b ≤ 1 000 000','a + b > 0'];
