import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-collecting/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'coin-collecting/exhaustive-paths',
 problemId: 'coin-collecting',
 title: 'Vét cạn mọi đường đi',
 chapter: 8,
 section: '8.1',
 page: 285,
 technique: 'brute-force',
 exactness: 'exact',
 complexity: {time: 'O(C(n+m,n))', space: 'O(n+m)'},
 views: ['board'],
 pseudocode,
 legend,
 traceLimit: {...limits, maxInputSize: 8},
 initVisual,
 run,
};
