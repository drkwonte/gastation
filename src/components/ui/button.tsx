import * as React from 'react'
import { cn } from '../../lib/cn'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap select-none',
        'rounded-xl border text-sm font-semibold leading-none transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        size === 'sm' ? 'h-9 px-3' : 'h-10 px-4',
        variant === 'default'
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          : variant === 'secondary'
            ? 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
            : 'bg-transparent text-current border-transparent hover:bg-slate-100',
        className,
      )}
      {...props}
    />
  )
})

