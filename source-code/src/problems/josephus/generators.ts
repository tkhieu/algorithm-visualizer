import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{const r=rng(seed);const n={tiny:5,small:15,medium:60,large:180}[size];return {n:1+Math.floor(r()*n),k:1+Math.floor(r()*Math.min(n,30))}}
