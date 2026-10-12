import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{
 const r=rng(seed);
 const n={tiny:4,small:8,medium:12,large:16}[size];
 const values=Array.from({length:n},()=>Math.floor(r()*30));
 return {values};
}
