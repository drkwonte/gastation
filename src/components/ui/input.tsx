import * as React from 'react'
import { cn } from '../../lib/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl border px-3 text-sm font-medium leading-none',
        'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 focus-visible:ring-offset-2',
        className,
      )}
      style={{
        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#334155' : 'white',
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#475569' : '#e2e8f0',
        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f1f5f9' : '#0f172a',
      }}
      {...props}
    />
  )
})

