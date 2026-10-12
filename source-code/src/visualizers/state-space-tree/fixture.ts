import type {StateSpaceTreeVisualState} from './index';
export const fixture:StateSpaceTreeVisualState={
 nodes:[
  {id:0,parent:null,label:'∅',status:'done',value:0},
  {id:1,parent:0,label:'L A',status:'best',value:9},
  {id:2,parent:0,label:'R A',status:'pruned',value:0},
 ],
};
