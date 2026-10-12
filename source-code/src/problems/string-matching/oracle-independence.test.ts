import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('các checker B4 dùng oracle độc lập với thuật toán được chấm', () => {
  const methods: Record<string, RegExp> = {
    'string-matching': /\.indexOf\(/,
    'closest-pair': /for\s*\(let j\s*=\s*i\s*\+\s*1/,
    'change-making': /frontier/,
    'coin-row': /capacity\[source\]/,
    'coin-collecting': /function visit\(/,
    'optimal-bst': /function costs\(/,
    'linear-programming-2d': /improvingRay/,
  };
  for (const [problem, method] of Object.entries(methods)) {
    const source = readFileSync(resolve(process.cwd(), `src/problems/${problem}/checker.ts`), 'utf8');
    expect(source, problem).toMatch(method);
    expect(source, problem).not.toMatch(/from ['"].*algorithms\//);
  }
});
