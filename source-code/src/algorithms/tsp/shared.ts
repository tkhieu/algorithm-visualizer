import type {Input, Output} from '../../problems/tsp/definition';
import {dist, tourLength} from '../../problems/tsp/checker';

export interface TreeNode {
  id: number;
  parent: number | null;
  label: string;
  status: 'current' | 'open' | 'pruned' | 'best' | 'done' | 'superseded';
  value: number;
  bound?: number;
}
export interface PointVis {
  x: number;
  y: number;
  role?: string;
}
export interface SegmentVis {
  from: number;
  to: number;
  role?: string;
}
export interface VisualState {
  points: PointVis[];
  segments: SegmentVis[];
  tour: number[];
  nodes: TreeNode[];
  note: string;
}

export function initVisual(input: Input): VisualState {
  return {points: input.points.map((p) => ({x: p.x, y: p.y})), segments: [], tour: [], nodes: [], note: ''};
}

export function pack(points: Input['points'], tour: number[]): Output {
  return {tour, length: tourLength(points, tour)};
}

export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}

export const limits = {maxSteps: 5000, maxBytes: 2500000};

export function markTour(draft: VisualState, tour: number[]) {
  draft.tour = [...tour];
  draft.segments = tour.slice(0, -1).map((from, i) => ({from, to: tour[i + 1], role: 'path'}));
  draft.points.forEach((p, i) => {
    p.role = tour.includes(i) ? 'visited' : undefined;
  });
  if (tour.length) draft.points[tour[tour.length - 1]].role = 'current';
}

export {dist};
