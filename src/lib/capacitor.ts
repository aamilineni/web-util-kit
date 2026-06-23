import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

export const isNativeApp = Capacitor.isNativePlatform()

export async function initCapacitor() {
  if (!isNativeApp) {
    return
  }

  document.documentElement.classList.add('native-app')

  try {
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#4f46e5' })
  } catch {
    // Status bar plugin not available on this platform
  }

  try {
    await SplashScreen.hide()
  } catch {
    // Splash screen already hidden
  }
}
