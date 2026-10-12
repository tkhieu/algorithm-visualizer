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
 id: 'linear-programming-2d',
 title: 'Quy hoạch tuyến tính 2 chiều',
 statement,
 inputSchema,
 outputSchema,
 constraints,
 generate,
 cases,
 check,
 objective: {sense: 'max', score: (_i, o) => o.value},
};
