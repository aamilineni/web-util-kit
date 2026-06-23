import type { ReactNode } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { isNativeApp } from '@/lib/capacitor'

type AppRouterProps = {
  children: ReactNode
}

export function AppRouter({ children }: AppRouterProps) {
  const Router = isNativeApp ? HashRouter : BrowserRouter
  return <Router>{children}</Router>
}
