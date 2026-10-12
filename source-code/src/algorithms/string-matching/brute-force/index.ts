import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/string-matching/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
 id: 'string-matching/brute-force',
 problemId: 'string-matching',
 title: 'So khớp vét cạn',
 chapter: 3,
 section: '3.2',
 page: 104,
 technique: 'brute-force',
 exactness: 'exact',
 complexity: {time: 'O(nm)', space: 'O(1)'},
 views: ['string-align'],
 pseudocode,
 legend,
 traceLimit: limits,
 initVisual,
 run,
};
