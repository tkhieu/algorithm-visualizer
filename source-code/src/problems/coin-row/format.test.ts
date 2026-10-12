import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('các file B4 từng bị nén có cấu trúc nhiều dòng và mọi dòng không quá 160 ký tự', () => {
  const files = [
    'src/algorithms/closest-pair/shared.ts',
    'src/algorithms/coin-row/shared.ts',
    'src/problems/coin-row/checker.ts',
  ];
  for (const file of files) {
    const source = readFileSync(resolve(process.cwd(), file), 'utf8');
    const lines = source.split('\n');
    expect(lines.length).toBeGreaterThan(15);
    expect(lines.every((line) => line.length <= 160)).toBe(true);
    expect(source).not.toMatch(/;[ \t]*import[ \t]/);
  }
});
