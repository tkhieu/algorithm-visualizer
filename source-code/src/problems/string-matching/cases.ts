import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';
import {bruteForcePositions} from './checker';

const raw: TestCase<Input>[] = [
 {id: 'normal-1', name: 'Ví dụ Horspool', group: 'normal', input: {text: 'ABCABCDABABCD', pattern: 'ABCD'}},
 {id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small')},
 {id: 'edge-no-match', name: 'Không xuất hiện', group: 'edge', input: {text: 'AAAAAAAA', pattern: 'BB'}},
 {id: 'edge-single-char', name: 'Mẫu một ký tự', group: 'edge', input: {text: 'ABCABC', pattern: 'A'}},
 {
  id: 'edge-equal-length',
  name: 'Mẫu bằng độ dài văn bản',
  group: 'edge',
  input: {text: 'ABCD', pattern: 'ABCD'},
 },
 {id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny')},
 {id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small')},
 {id: 'large-1', name: 'Văn bản dài 1', group: 'large', input: generate(21, 'large')},
 {id: 'large-2', name: 'Văn bản dài 2', group: 'large', input: generate(22, 'large')},
 {
  id: 'special-overlap',
  name: 'Các lần khớp chồng lấp',
  group: 'special',
  input: {text: 'AAAAA', pattern: 'AA'},
 },
 {
  id: 'special-repeat-alphabet',
  name: 'Mẫu có ký tự lặp nhiều lần',
  group: 'special',
  input: {text: 'ABABABABAB', pattern: 'ABAB'},
 },
 {id: 'invalid-empty-text', name: 'Văn bản rỗng', group: 'invalid', input: {text: '', pattern: 'A'}},
 {id: 'invalid-empty-pattern', name: 'Mẫu rỗng', group: 'invalid', input: {text: 'ABC', pattern: ''}},
];

export const cases: TestCase<Input>[] = raw.map(c =>
 c.group === 'invalid' ? c : {...c, expected: {positions: bruteForcePositions(c.input as Input)}},
);
