import type { ReactNode } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'

type ToolShellProps = {
  children: ReactNode
  width?: 'default' | 'wide' | 'full'
  className?: string
}

export function ToolShell({ children, width = 'default', className = '' }: ToolShellProps) {
  return (
    <PageContainer width={width} className={`space-y-5 sm:space-y-6 ${className}`}>
      {children}
    </PageContainer>
  )
}
