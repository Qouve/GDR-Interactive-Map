import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function ScrollArea({ className, children, ...props }: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root className={cn('ui-scroll-area', className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="ui-scroll-area-viewport">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="ui-scroll-area-scrollbar"
      >
        <ScrollAreaPrimitive.Thumb className="ui-scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
