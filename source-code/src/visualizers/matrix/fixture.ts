import type {MatrixInput,MatrixVisualState} from './index';
export const fixture:MatrixVisualState={
 matrix:[[0,0,0],[0,0,4],[0,3,4]],
 computed:[[true,true,true],[true,true,true],[true,true,true]],
 current:{i:2,w:2},
 dependencies:[[1,2]],
 backtrack:[[1,1]],
};
export const fixtureInput:MatrixInput={capacity:2};
