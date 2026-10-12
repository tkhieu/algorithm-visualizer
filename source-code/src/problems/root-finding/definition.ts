import {z} from 'zod';
export function f(x:number,c:number,d:number){return x*x*x+c*x-d}
export const inputSchema=z.object({c:z.number().int().min(1).max(10),d:z.number().int().min(-20).max(20),left:z.number().min(-10).max(10),right:z.number().min(-10).max(10),tolerance:z.number().min(1e-8).max(1e-3)}).refine(v=>v.left<v.right&&f(v.left,v.c,v.d)<=0&&f(v.right,v.c,v.d)>=0,'Khoảng phải kẹp nghiệm');
export const outputSchema=z.object({root:z.number().finite()});export type Input=z.infer<typeof inputSchema>;export type Output=z.infer<typeof outputSchema>;
export const statement='Tìm nghiệm của f(x)=x³+c·x−d với c>0 trên khoảng [left,right] kẹp nghiệm. Hàm tăng nghiêm ngặt nên nghiệm duy nhất. Trả nghiệm với sai số không quá tolerance. Ví dụ: c=1,d=0,[−1,1] → 0; c=1,d=2,[0,2] → 1.';
export const constraints=['1 ≤ c ≤ 10','−20 ≤ d ≤ 20','−10 ≤ left < right ≤ 10','f(left) ≤ 0 ≤ f(right)','10⁻⁸ ≤ tolerance ≤ 10⁻³'];
