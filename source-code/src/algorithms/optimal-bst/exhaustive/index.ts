import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/optimal-bst/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'optimal-bst/exhaustive',
 problemId: 'optimal-bst',
 title: 'Vét cạn mọi cây',
 chapter: 8,
 section: '8.3',
 page: 297,
 technique: 'brute-force',
 exactness: 'exact',
 complexity: {time: 'O(4ⁿ/n^1.5)', space: 'O(n)'},
 views: ['matrix', 'tree'],
 pseudocode,
 legend,
 traceLimit: {...limits, maxInputSize: 9},
 initVisual,
 run,
};
