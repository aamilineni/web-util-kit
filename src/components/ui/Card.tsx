import type { CSSProperties, ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
