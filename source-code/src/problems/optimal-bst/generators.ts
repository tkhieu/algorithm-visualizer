import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{
 const r=rng(seed);
 const n={tiny:3,small:5,medium:7,large:9}[size];
 const freq=Array.from({length:n},()=>1+Math.floor(r()*20));
 return {freq};
}
