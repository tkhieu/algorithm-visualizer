import {z} from 'zod';
const integer=z.string().regex(/^(0|[1-9][0-9]*)$/).max(40);
export const inputSchema=z.object({a:integer,b:integer});export const outputSchema=z.object({product:integer.max(80)});
export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement='Cho hai số nguyên không âm ở dạng chuỗi thập phân (để tránh giới hạn số thực JavaScript). Tính tích chính xác. Ví dụ: 123 × 45 → 5535; 0 × 987 → 0.';
export const constraints=['Mỗi thừa số từ 1 đến 40 chữ số','Không có số 0 đứng đầu, trừ chính số 0'];
