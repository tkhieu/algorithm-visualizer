import type {Input, Output} from '../../problems/matrix-chain/definition';

export interface TreeNode {
  id: string;
  parent: string | null;
  label: string;
  role?: string;
}
export interface VisualState {
  matrix: (number | string | null)[][];
  computed: boolean[][];
  current: {i: number; w: number} | null;
  dependencies: [number, number][];
  nodes: TreeNode[];
  note: string;
}

export function initVisual(input: Input): VisualState {
  const n = input.dims.length - 1;
  return {
    matrix: Array.from({length: n + 1}, () => new Array<number | string | null>(n + 1).fill(null)),
    computed: Array.from({length: n + 1}, () => new Array<boolean>(n + 1).fill(false)),
    current: null,
    dependencies: [],
    nodes: [],
    note: '',
  };
}

/** Xây parenthesization từ bảng split[i][j] (phân tách tối ưu đoạn [i,j]). */
export function buildParenthesization(i: number, j: number, split: number[][]): string {
  if (i === j) return `A${i}`;
  const k = split[i][j];
  return `(${buildParenthesization(i, k, split)}${buildParenthesization(k + 1, j, split)})`;
}

export function pack(dims: number[], cost: number, split: number[][]): Output {
  const n = dims.length - 1;
  return {cost, parenthesization: n === 1 ? 'A1' : buildParenthesization(1, n, split)};
}

export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}

export const limits = {maxSteps: 5000, maxBytes: 2500000};

/** Xây cây đặt ngoặc (view "tree") từ bảng split, dùng cho hiển thị cuối cùng. */
export function buildTree(i: number, j: number, split: number[][], parent: string | null, nodes: TreeNode[]): string {
  const id = `${i}-${j}`;
  if (i === j) {
    nodes.push({id, parent, label: `A${i}`});
    return id;
  }
  const k = split[i][j];
  nodes.push({id, parent, label: `${i}..${j}`});
  buildTree(i, k, split, id, nodes);
  buildTree(k + 1, j, split, id, nodes);
  return id;
}
