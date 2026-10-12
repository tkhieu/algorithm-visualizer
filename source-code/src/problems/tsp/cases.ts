import type {TestCase} from '../../core/contracts';
import type {Input} from './definition';
import {generate} from './generators';

const square: Input = {
  points: [
    {x: 0, y: 0},
    {x: 0, y: 10},
    {x: 10, y: 10},
    {x: 10, y: 0},
  ],
};

export const cases: TestCase<Input>[] = [
  {id: 'normal-1', name: 'Hình vuông 4 điểm', group: 'normal', input: square},
  {id: 'normal-2', name: 'Cỡ nhỏ ngẫu nhiên', group: 'normal', input: generate(1, 'small')},
  {id: 'edge-single', name: 'Một điểm duy nhất', group: 'edge', input: {points: [{x: 0, y: 0}]}},
  {
    id: 'edge-two',
    name: 'Hai điểm',
    group: 'edge',
    input: {
      points: [
        {x: 0, y: 0},
        {x: 3, y: 4},
      ],
    },
  },
  {id: 'small-1', name: 'Cỡ nhỏ 1', group: 'small', input: generate(2, 'small')},
  {id: 'small-2', name: 'Cỡ nhỏ 2', group: 'small', input: generate(3, 'small')},
  {id: 'large-1', name: 'Cỡ lớn 1', group: 'large', input: generate(1, 'large')},
  {id: 'large-2', name: 'Cỡ lớn 2', group: 'large', input: generate(2, 'large')},
  {
    id: 'special-collinear',
    name: 'Các điểm thẳng hàng',
    group: 'special',
    input: {
      points: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
      ],
    },
  },
  {id: 'invalid-out-of-range', name: 'Toạ độ ngoài phạm vi', group: 'invalid', input: {points: [{x: 5000, y: 0}]}},
];
