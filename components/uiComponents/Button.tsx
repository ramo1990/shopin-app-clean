import React from 'react'
import { cn } from '@/lib/utils' // optionnel si tu veux combiner les classes

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

const Button = ({ className = '', children, ...rest }: Props) => {
  return (
    <button className={cn('px-4 py-2 rounded', className)} {...rest}>
      {children}
    </button>
  )
}

export default Button
