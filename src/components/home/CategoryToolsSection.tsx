import { ChevronDown } from 'lucide-react'
import type { ToolCategory } from '@/config/tools'
import { getCategoryTools } from '@/config/tools'
import { ToolCard } from '@/components/home/ToolCard'

type CategoryToolsSectionProps = {
  category: ToolCategory
  index: number
  open: boolean
  onToggle: () => void
}

export function CategoryToolsSection({ category, index, open, onToggle }: CategoryToolsSectionProps) {
  const Icon = category.icon
  const toolCount = getCategoryTools(category).length
  const panelId = `category-panel-${category.id}`

  return (
    <section
      id={category.id}
      aria-labelledby={`category-${category.id}`}
      className="tool-category-section animate-stagger-in scroll-mt-36"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full flex-wrap items-start justify-between gap-3 rounded-xl text-left transition-colors hover:bg-slate-50/80 sm:items-center"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={`category-${category.id}`} className="text-lg font-bold text-slate-900 sm:text-xl">
              {category.title}
            </h2>
            <p className="mt-0.5 max-w-2xl text-sm text-slate-600">{category.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-center">
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {toolCount} tools
          </span>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
          open ? 'mt-4 grid-rows-[1fr] opacity-100 sm:mt-5' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {category.sections?.length ? (
            <div className="space-y-6 sm:space-y-8">
              {category.sections.map((section) => (
                <div key={section.id} className="tool-subsection">
                  <div className="mb-3 border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{section.title}</h3>
                    {section.description && (
                      <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{section.description}</p>
                    )}
                  </div>
                  <div className="tools-grid">
                    {section.tools.map((tool, toolIndex) => (
                      <ToolCard key={tool.id} tool={tool} index={toolIndex} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tools-grid">
              {getCategoryTools(category).map((tool, toolIndex) => (
                <ToolCard key={tool.id} tool={tool} index={toolIndex} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
