import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

type ToolPageHeaderProps = {
  title: string
  description: string
  category?: string
}

export function ToolPageHeader({ title, description, category }: ToolPageHeaderProps) {
  return (
    <div className="space-y-2">
      <nav className="flex items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-600">
          All Tools
        </Link>
        {category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{category}</span>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-800">{title}</span>
      </nav>
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
      </div>
    </div>
  )
}
