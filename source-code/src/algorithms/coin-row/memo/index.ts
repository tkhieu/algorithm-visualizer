import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-row/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'coin-row/memo',
 problemId: 'coin-row',
 title: 'Quy hoạch động — có nhớ',
 chapter: 8,
 section: '8.1',
 page: 285,
 technique: 'dp',
 exactness: 'exact',
 complexity: {time: 'O(n)', space: 'O(n)'},
 views: ['sequence'],
 pseudocode,
 legend,
 traceLimit: limits,
 initVisual,
 run,
};
