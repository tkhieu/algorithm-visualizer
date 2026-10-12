import type {StringAlignVisualState} from './index';
export const fixture:StringAlignVisualState={
 text:'ABCABCDABABCD',
 pattern:'ABCD',
 shift:4,
 comparisons:[{patternIndex:3,match:false},{patternIndex:2,match:true}],
 shiftTable:{A:3,B:2,C:1,D:4},
 note:'So khớp lệch 4 ký tự',
};
