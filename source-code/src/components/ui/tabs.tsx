import * as TabsPrimitive from '@radix-ui/react-tabs';import {cn} from '../../lib/utils';
export const Tabs=TabsPrimitive.Root;
export function TabsList({className,...props}:React.ComponentProps<typeof TabsPrimitive.List>){return <TabsPrimitive.List className={cn('inline-flex rounded-md border border-neutral-300 bg-neutral-100 p-1',className)} {...props}/>}
export function TabsTrigger({className,...props}:React.ComponentProps<typeof TabsPrimitive.Trigger>){return <TabsPrimitive.Trigger className={cn('rounded px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm',className)} {...props}/>}
export function TabsContent({className,...props}:React.ComponentProps<typeof TabsPrimitive.Content>){return <TabsPrimitive.Content className={cn('mt-3',className)} {...props}/>}
