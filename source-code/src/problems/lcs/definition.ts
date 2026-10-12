import {z} from 'zod';

export const inputSchema = z.object({
  a: z.string().min(0).max(40),
  b: z.string().min(0).max(40),
});
export const outputSchema = z.object({
  length: z.number().int().nonnegative(),
  subsequence: z.string(),
});
export type Input = z.infer<typeof inputSchema>;
export type Output = z.infer<typeof outputSchema>;

export const statement =
  `Cho hai chuỗi ký tự a và b. Dãy con chung dài nhất (LCS) là dãy con (không cần liên tiếp) xuất hiện ` +
  `trong cả hai chuỗi theo đúng thứ tự, có độ dài lớn nhất. Hãy tìm độ dài của LCS và một dãy con đạt được độ dài đó.`;
export const constraints = ['0 ≤ |a|, |b| ≤ 40'];
