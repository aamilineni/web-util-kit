import { Outlet } from 'react-router-dom'
import { ToolShell } from '@/components/layout/ToolShell'

/** Narrow centered layout for form-based tools (dev, everyday, etc.) */
export function ConstrainedToolLayout() {
  return (
    <ToolShell width="default">
      <Outlet />
    </ToolShell>
  )
}
