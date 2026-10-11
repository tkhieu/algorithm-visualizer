import * as React from 'react';import {cn} from '../../lib/utils';
export function Card({className,...props}:React.ComponentProps<'div'>){return <div className={cn('rounded-lg border border-neutral-300 bg-white shadow-sm',className)} {...props}/>}
export function CardHeader({className,...props}:React.ComponentProps<'div'>){return <div className={cn('p-4 pb-2',className)} {...props}/>}
export function CardTitle({className,...props}:React.ComponentProps<'h2'>){return <h2 className={cn('text-base font-semibold',className)} {...props}/>}
export function CardContent({className,...props}:React.ComponentProps<'div'>){return <div className={cn('p-4 pt-2',className)} {...props}/>}
