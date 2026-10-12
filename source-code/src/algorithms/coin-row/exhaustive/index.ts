import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-row/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'coin-row/exhaustive',
 problemId: 'coin-row',
 title: 'Vét cạn đệ quy',
 chapter: 3,
 section: '3.4',
 page: 115,
 technique: 'brute-force',
 exactness: 'exact',
 complexity: {time: 'O(2ⁿ)', space: 'O(n)'},
 views: ['sequence'],
 pseudocode,
 legend,
 traceLimit: {...limits, maxInputSize: 16},
 initVisual,
 run,
};
