import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'ui-button',
  {
    variants: {
      variant: {
        default: 'ui-button--default',
        ghost: 'ui-button--ghost',
        outline: 'ui-button--outline',
      },
      size: {
        default: 'ui-button--size-default',
        sm: 'ui-button--size-sm',
        icon: 'ui-button--size-icon',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
