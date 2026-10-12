import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{const r=rng(seed);const base={tiny:4,small:5,medium:8,large:10}[size];return {n:Math.min(12,base+Math.floor(r()*2))}}
