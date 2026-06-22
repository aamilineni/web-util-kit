import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  width?: 'default' | 'wide' | 'full'
  className?: string
}

const widthClass = {
  default: 'max-w-3xl',
  wide: 'max-w-6xl',
  full: 'max-w-[1600px]',
} as const

export function PageContainer({
  children,
  width = 'wide',
  className = '',
}: PageContainerProps) {
  return (
    <div className={`mx-auto w-full px-[clamp(1rem,2.5vw,2rem)] ${widthClass[width]} ${className}`}>
      {children}
    </div>
  )
}
