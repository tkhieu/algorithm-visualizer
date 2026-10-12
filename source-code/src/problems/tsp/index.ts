import type {Problem} from '../../core/contracts';
import {inputSchema, outputSchema, statement, constraints, type Input, type Output} from './definition';
import {generate} from './generators';
import {cases} from './cases';
import {check} from './checker';

export const problem: Problem<Input, Output> = {
  id: 'tsp',
  title: 'Người du lịch (TSP)',
  statement,
  inputSchema,
  outputSchema,
  constraints,
  generate,
  cases,
  check,
  objective: {sense: 'min', score: (_input, output) => output.length},
};
