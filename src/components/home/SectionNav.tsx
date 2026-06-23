import type { ToolCategory } from '@/config/tools'
import { getCategoryTools } from '@/config/tools'

type SectionNavProps = {
  categories: ToolCategory[]
  openSections: Record<string, boolean>
  onToggle: (categoryId: string) => void
}

export function SectionNav({ categories, openSections, onToggle }: SectionNavProps) {
  const handleClick = (categoryId: string) => {
    const wasOpen = openSections[categoryId]
    onToggle(categoryId)
    if (!wasOpen) {
      window.setTimeout(() => {
        document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }

  return (
    <nav
      className="sticky top-[57px] z-30 -mx-1 border-b border-slate-200/80 bg-slate-50/95 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-slate-50/85 sm:top-[61px]"
      aria-label="Tool sections"
    >
      <div className="flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const Icon = category.icon
          const isOpen = openSections[category.id]
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleClick(category.id)}
              aria-expanded={isOpen}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm transition-colors ${
                isOpen
                  ? 'border-brand-300 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              <Icon className="h-4 w-4 text-brand-500" />
              <span>{category.title}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isOpen ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {getCategoryTools(category).length}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
