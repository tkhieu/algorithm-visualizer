import type {Points2DVisualState} from './index';
export const fixture:Points2DVisualState={
 points:[{x:0,y:0},{x:4,y:1,role:'closest'},{x:1,y:4,role:'closest'},{x:5,y:5}],
 segments:[{from:1,to:2,role:'closest'}],
 hull:[0,3,2],
 note:'Cặp điểm gần nhất: điểm 1 và 2',
};
