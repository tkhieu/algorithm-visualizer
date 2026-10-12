import type {TreeVisualState} from './index';
export const fixture:TreeVisualState={
 nodes:[
  {id:'r',parent:null,label:'8'},
  {id:'l',parent:'r',label:'3',role:'current'},
  {id:'rr',parent:'r',label:'10',role:'balanced'},
 ],
 note:'Chèn giá trị 3 vào cây',
};
