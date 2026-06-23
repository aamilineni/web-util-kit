import { useCallback, useState } from 'react'
import { Shield, Sparkles, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/layout/PageContainer'
import { CategoryToolsSection } from '@/components/home/CategoryToolsSection'
import { SectionNav } from '@/components/home/SectionNav'
import { ToolSearch } from '@/components/home/ToolSearch'
import { TOOL_CATEGORIES } from '@/config/tools'
import { SEO, homeJsonLd, usePageSeo } from '@/lib/seo'

const highlights = [
  {
    icon: Shield,
    title: 'Private by design',
    text: 'Every tool runs in your browser. Files and data are never uploaded to a server.',
  },
  {
    icon: Sparkles,
    title: 'Completely free',
    text: 'PDF, developer, time, and everyday utilities — no limits, no paywalls, no accounts.',
  },
  {
    icon: Zap,
    title: 'One stop for everything',
    text: 'Search any utility instantly with ⌘K. Adaptive layout on any screen size.',
  },
]

export function HomePage() {
  usePageSeo(SEO.home, homeJsonLd)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOOL_CATEGORIES.map((category) => [category.id, category.id === 'pdf'])),
  )

  const toggleSection = useCallback((categoryId: string) => {
    setOpenSections((current) => ({ ...current, [categoryId]: !current[categoryId] }))
  }, [])

  return (
    <PageContainer width="full" className="space-y-5 sm:space-y-6">
      <ToolSearch />
      <SectionNav
        categories={TOOL_CATEGORIES}
        openSections={openSections}
        onToggle={toggleSection}
      />

      <div className="space-y-4 sm:space-y-5">
        {TOOL_CATEGORIES.map((category, categoryIndex) => (
          <CategoryToolsSection
            key={category.id}
            category={category}
            index={categoryIndex}
            open={openSections[category.id] ?? false}
            onToggle={() => toggleSection(category.id)}
          />
        ))}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {highlights.map((item, index) => (
          <Card
            key={item.title}
            className="interactive-card p-4 sm:p-5 animate-stagger-in"
            style={{ animationDelay: `${500 + index * 60}ms` }}
          >
            <item.icon className="mb-3 h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </Card>
        ))}
      </section>
    </PageContainer>
  )
}
