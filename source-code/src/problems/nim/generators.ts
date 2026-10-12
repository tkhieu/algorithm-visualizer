import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{const r=rng(seed);const n={tiny:1,small:3,medium:6,large:10}[size],max={tiny:10,small:30,medium:100,large:1000}[size];return {piles:Array.from({length:n},()=>Math.floor(r()*(max+1)))}}
