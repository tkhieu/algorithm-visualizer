import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/linear-programming-2d/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'linear-programming-2d/simplex',
 problemId: 'linear-programming-2d',
 title: 'Thuật toán Simplex',
 chapter: 10,
 section: '10.1',
 page: 346,
 technique: 'iterative-improvement',
 exactness: 'exact',
 complexity: {time: 'O(2ⁿ) xấu nhất', space: 'O(n²)'},
 views: ['numeric-plot', 'matrix'],
 pseudocode,
 legend,
 traceLimit: limits,
 initVisual,
 run,
};
