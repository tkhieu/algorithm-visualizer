import { it, expect } from 'vitest'
import { inputSchema } from './definition'
import { cases } from './cases'
import { check } from './checker'
it('ràng buộc và ví dụ duyệt đồ thị', () => {
  expect(
    cases
      .filter((c) => c.group === 'invalid')
      .every((c) => !inputSchema.safeParse(c.input).success),
  ).toBe(true)
  expect(check({ n: 2, edges: [[0, 1]], start: 0 }, { order: [0, 1], parent: [null, 0] }).ok).toBe(
    true,
  )
})

import { generate } from './generators'
it('bộ sinh có seed và đủ nhóm ca hợp lệ', () => {
  for (const size of ['tiny', 'small', 'medium', 'large'] as const) {
    const input = generate(27, size)
    expect(generate(27, size)).toEqual(input)
    expect(inputSchema.safeParse(input).success).toBe(true)
  }
  for (const group of ['normal', 'edge', 'small', 'large', 'special', 'invalid'])
    expect(cases.some((c) => c.group === group)).toBe(true)
  for (const c of cases.filter((c) => c.group !== 'invalid'))
    expect(inputSchema.safeParse(c.input).success).toBe(true)
})
