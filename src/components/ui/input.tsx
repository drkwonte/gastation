import * as React from 'react'
import { cn } from '../../lib/cn'
import styles from './input.module.css'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(styles.input, className)} {...props} />
})

