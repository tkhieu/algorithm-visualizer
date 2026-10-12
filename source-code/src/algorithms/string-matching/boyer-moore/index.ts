import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/string-matching/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'string-matching/boyer-moore',
 problemId: 'string-matching',
 title: 'Thuật toán Boyer–Moore',
 chapter: 7,
 section: '7.2',
 page: 259,
 technique: 'space-time-tradeoff',
 exactness: 'exact',
 complexity: {time: 'O(nm) xấu nhất, O(n) TB', space: 'O(k)'},
 views: ['string-align'],
 pseudocode,
 legend,
 traceLimit: limits,
 initVisual,
 run,
};
