import type {Problem} from '../../core/contracts';
import {
 inputSchema,
 outputSchema,
 statement,
 constraints,
 type Input,
 type Output,
} from './definition';
import {generate} from './generators';
import {cases} from './cases';
import {check} from './checker';

export const problem: Problem<Input, Output> = {
 id: 'convex-hull',
 title: 'Bao lồi',
 statement,
 inputSchema,
 outputSchema,
 constraints,
 generate,
 cases,
 check,
};
