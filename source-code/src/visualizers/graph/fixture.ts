import type {GraphVisualState} from './index';
export const fixture:GraphVisualState={
 nodes:[{id:'A',role:'visited'},{id:'B',role:'current'},{id:'C'}],
 edges:[{from:'A',to:'B',weight:4,role:'tree'},{from:'B',to:'C',weight:2}],
 note:'Đang xét đỉnh B',
};
