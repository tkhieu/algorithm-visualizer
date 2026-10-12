import type {NumericPlotVisualState} from './index';
export const fixture:NumericPlotVisualState={
 domain:[-2,2],
 samples:Array.from({length:21},(_,i)=>{const x=-2+(i*4)/20;return {x,y:x*x-1}}),
 points:[{x:1,y:0,role:'root'},{x:-1,y:0,role:'root'}],
 intervals:[{from:0.5,to:1.5}],
 note:'Nghiệm gần x=1',
};
