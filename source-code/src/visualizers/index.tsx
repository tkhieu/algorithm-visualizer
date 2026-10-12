import type {VisualKind} from '../core/contracts';
import {MatrixView,type MatrixInput,type MatrixVisualState} from './matrix';
import {StateSpaceTreeView,type StateSpaceTreeVisualState} from './state-space-tree';
import {ItemsView,type ItemsInput,type ItemsVisualState} from './items';
import {ArrayBarsView,type ArrayBarsVisualState} from './array-bars';
import {GraphView,type GraphVisualState} from './graph';
import {TreeView,type TreeVisualState} from './tree';
import {StringAlignView,type StringAlignVisualState} from './string-align';
import {Points2DView,type Points2DVisualState} from './points-2d';
import {NumericPlotView,type NumericPlotVisualState} from './numeric-plot';
import {HashTableView,type HashTableVisualState} from './hash-table';
import {SequenceView,type SequenceVisualState} from './sequence';
import {BoardView,type BoardVisualState} from './board';

/**
 * Dispatcher chung cho mọi view. Mỗi algorithm khai báo `views: VisualKind[]` và tự đảm bảo
 * `V` (visual state của nó) khớp cấu trúc với kiểu *VisualState của view đó — registry xoá kiểu
 * thành `unknown` ở biên nên việc ép kiểu ở đây là có chủ đích; xem docs/adding-an-algorithm.md.
 */
export function Visualizer({kind,state,input,compact=false}:{kind:VisualKind;state:unknown;input?:unknown;compact?:boolean}){
 // A route can render once with the previous player's selected view before its reset effect runs.
 // Keep that transient frame harmless when the new algorithm has a different state shape.
 if(!compatible(kind,state))return <p className="muted">Đang chuyển dạng trực quan…</p>;
 switch(kind){
  case 'matrix':return <MatrixView state={state as MatrixVisualState} input={input as MatrixInput} compact={compact}/>;
  case 'state-space-tree':{
   // Thuật toán kết hợp view 'graph' (field `nodes`/`edges` của chính đồ thị) với 'state-space-tree'
   // đặt cây duyệt ở field riêng `treeNodes` để tránh đụng tên với `nodes` của đồ thị; nếu không có
   // `treeNodes`, dùng `nodes` như trước (tương thích ngược với các algorithm chỉ có một view cây).
   const raw=state as {nodes?:StateSpaceTreeVisualState['nodes'];treeNodes?:StateSpaceTreeVisualState['nodes']};
   return <StateSpaceTreeView state={{nodes:raw.treeNodes??raw.nodes??[]}} compact={compact}/>;
  }
  case 'items':return <ItemsView state={state as ItemsVisualState} input={input as ItemsInput} compact={compact}/>;
  case 'array-bars':return <ArrayBarsView state={state as ArrayBarsVisualState} compact={compact}/>;
  case 'graph':return <GraphView state={state as GraphVisualState} compact={compact}/>;
  case 'tree':return <TreeView state={state as TreeVisualState} compact={compact}/>;
  case 'string-align':return <StringAlignView state={state as StringAlignVisualState} compact={compact}/>;
  case 'points-2d':return <Points2DView state={state as Points2DVisualState} compact={compact}/>;
  case 'numeric-plot':return <NumericPlotView state={state as NumericPlotVisualState} compact={compact}/>;
  case 'hash-table':return <HashTableView state={state as HashTableVisualState} compact={compact}/>;
  case 'sequence':return <SequenceView state={state as SequenceVisualState} compact={compact}/>;
  case 'board':return <BoardView state={state as BoardVisualState} compact={compact}/>;
 }
}

function compatible(kind:VisualKind,state:unknown):boolean{
 if(!state||typeof state!=='object')return false;
 const value=state as Record<string,unknown>;
 switch(kind){
  case 'matrix':return Array.isArray(value.matrix);
  case 'state-space-tree':case 'tree':return Array.isArray(value.nodes);
  case 'items':case 'sequence':return Array.isArray(value.items);
  case 'array-bars':return Array.isArray(value.values);
  case 'graph':return Array.isArray(value.nodes)&&Array.isArray(value.edges);
  case 'string-align':return typeof value.text==='string'&&typeof value.pattern==='string';
  case 'points-2d':return Array.isArray(value.points);
  case 'numeric-plot':return Array.isArray(value.domain)&&Array.isArray(value.samples);
  case 'hash-table':return Array.isArray(value.buckets);
  case 'board':return typeof value.rows==='number'&&Array.isArray(value.marks);
 }
}
