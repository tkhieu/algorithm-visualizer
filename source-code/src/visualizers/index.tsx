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
  // Player may briefly retain the previous view while a new algorithm loads.
  const shape=(state??{}) as Record<string,unknown>;
  const inputShape=(input??{}) as Record<string,unknown>;
  const compatible:VisualKind[]=[];
  if(Array.isArray(shape.matrix))compatible.push('matrix');
  if(Array.isArray(shape.values))compatible.push('array-bars');
  if(Array.isArray(shape.samples)&&Array.isArray(shape.domain))compatible.push('numeric-plot');
  if(Array.isArray(shape.nodes)){
    if(Array.isArray(shape.edges))compatible.push('graph');
    else if(shape.nodes.length===0||typeof shape.nodes[0]?.id==='number'){
      compatible.push('state-space-tree');
    } else compatible.push('tree');
  }
  if(Array.isArray(shape.items)){
    if(Array.isArray(inputShape.items))compatible.push('items');
    if(!Array.isArray(inputShape.items)||shape.items.length===0||typeof shape.items[0]==='object'){
      compatible.push('sequence');
    }
  }
  if(typeof shape.text==='string'&&typeof shape.pattern==='string')compatible.push('string-align');
  if(Array.isArray(shape.points)&&!Array.isArray(shape.samples))compatible.push('points-2d');
  if(Array.isArray(shape.buckets))compatible.push('hash-table');
  if(typeof shape.rows==='number'&&Array.isArray(shape.marks))compatible.push('board');
  kind=compatible.includes(kind)?kind:compatible[0]??kind;
 switch(kind){
  case 'matrix':return <MatrixView state={state as MatrixVisualState} input={input as MatrixInput} compact={compact}/>;
  case 'state-space-tree':return <StateSpaceTreeView state={state as StateSpaceTreeVisualState} compact={compact}/>;
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
