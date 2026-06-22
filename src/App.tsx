import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ConstrainedToolLayout } from '@/components/layout/ConstrainedToolLayout'
import { HomePage } from '@/pages/HomePage'
import { MergePage } from '@/pages/MergePage'
import { SplitPage } from '@/pages/SplitPage'
import { SignPage } from '@/pages/SignPage'
import { UnlockPage } from '@/pages/UnlockPage'
import { ViewerPage } from '@/pages/ViewerPage'
import { Base64Page } from '@/pages/dev/Base64Page'
import { UuidPage } from '@/pages/dev/UuidPage'
import { AesPage } from '@/pages/dev/AesPage'
import { JwtPage } from '@/pages/dev/JwtPage'
import { JsonPage } from '@/pages/dev/JsonPage'
import { YamlPage } from '@/pages/dev/YamlPage'
import { JsonComparePage } from '@/pages/dev/JsonComparePage'
import { YamlComparePage } from '@/pages/dev/YamlComparePage'
import { CronPage } from '@/pages/dev/CronPage'
import { UrlPage } from '@/pages/dev/UrlPage'
import { HashPage } from '@/pages/dev/HashPage'
import { TimestampPage } from '@/pages/dev/TimestampPage'
import { RegexPage } from '@/pages/dev/RegexPage'
import { PasswordPage } from '@/pages/dev/PasswordPage'
import { HtmlPage } from '@/pages/dev/HtmlPage'
import { ColorPage } from '@/pages/dev/ColorPage'
import { QrPage } from '@/pages/dev/QrPage'
import { WorldClockPage } from '@/pages/time/WorldClockPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route path="pdf/merge" element={<MergePage />} />
        <Route path="pdf/split" element={<SplitPage />} />
        <Route path="pdf/view" element={<ViewerPage />} />
        <Route path="pdf/sign" element={<SignPage />} />
        <Route path="pdf/unlock" element={<UnlockPage />} />

        <Route path="world-clock" element={<WorldClockPage />} />

        <Route element={<ConstrainedToolLayout />}>
          <Route path="base64" element={<Base64Page />} />
          <Route path="uuid" element={<UuidPage />} />
          <Route path="hash" element={<HashPage />} />
          <Route path="aes" element={<AesPage />} />
          <Route path="jwt" element={<JwtPage />} />
          <Route path="json" element={<JsonPage />} />
          <Route path="json-compare" element={<JsonComparePage />} />
          <Route path="yaml" element={<YamlPage />} />
          <Route path="yaml-compare" element={<YamlComparePage />} />
          <Route path="cron" element={<CronPage />} />
          <Route path="url" element={<UrlPage />} />
          <Route path="regex" element={<RegexPage />} />
          <Route path="html" element={<HtmlPage />} />
          <Route path="password" element={<PasswordPage />} />
          <Route path="timestamp" element={<TimestampPage />} />
          <Route path="color" element={<ColorPage />} />
          <Route path="qr" element={<QrPage />} />
        </Route>

        <Route path="merge-pdf" element={<Navigate to="/pdf/merge" replace />} />
        <Route path="split-pdf" element={<Navigate to="/pdf/split" replace />} />
        <Route path="view-pdf" element={<Navigate to="/pdf/view" replace />} />
        <Route path="sign-pdf" element={<Navigate to="/pdf/sign" replace />} />
        <Route path="unlock-pdf" element={<Navigate to="/pdf/unlock" replace />} />
        <Route path="merge" element={<Navigate to="/pdf/merge" replace />} />
        <Route path="split" element={<Navigate to="/pdf/split" replace />} />
        <Route path="view" element={<Navigate to="/pdf/view" replace />} />
      </Route>
    </Routes>
  )
}
