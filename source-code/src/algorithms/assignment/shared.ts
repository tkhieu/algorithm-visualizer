import type {Input, Output} from '../../problems/assignment/definition';
import {assignmentCost} from '../../problems/assignment/checker';

export interface TreeNode {
  id: number;
  parent: number | null;
  label: string;
  status: 'current' | 'open' | 'pruned' | 'best' | 'done' | 'superseded';
  value: number;
  bound?: number;
}
export interface BoardMark {
  row: number;
  col: number;
  role: string;
  label?: string;
}
export interface VisualState {
  rows: number;
  cols: number;
  marks: BoardMark[];
  nodes: TreeNode[];
  note: string;
}

export function initVisual(input: Input): VisualState {
  return {rows: input.cost.length, cols: input.cost.length, marks: [], nodes: [], note: ''};
}

export function pack(cost: number[][], assignment: number[]): Output {
  return {assignment, cost: assignmentCost(cost, assignment)};
}

export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}

export const limits = {maxSteps: 5000, maxBytes: 2500000};

export function marksFor(cost: number[][], assignment: (number | null)[]): BoardMark[] {
  const marks: BoardMark[] = [];
  for (let i = 0; i < cost.length; i++) {
    const j = assignment[i];
    for (let col = 0; col < cost.length; col++) marks.push({row: i, col, role: col === j ? 'chosen' : '', label: String(cost[i][col])});
  }
  return marks;
}
