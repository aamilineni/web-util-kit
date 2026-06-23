import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from '@/components/Router'
import { ToastProvider } from '@/components/ui/Toast'
import { initCapacitor } from '@/lib/capacitor'
import { initGoogle } from '@/lib/google'
import App from './App'
import './index.css'

initGoogle()
void initCapacitor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppRouter>
  </StrictMode>,
)
