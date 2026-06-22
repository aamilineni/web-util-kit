import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { ToolDefinition } from '@/config/tools'

type ToolCardProps = {
  tool: ToolDefinition
  index?: number
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <Link
      to={tool.path}
      className="group block h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <article className="interactive-card relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/0 to-brand-600/0 transition-all duration-300 group-hover:from-brand-500/5 group-hover:to-brand-600/10" />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-100">
              <tool.icon className="h-5 w-5" />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Free
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100" />
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
            {tool.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
        </div>
      </article>
    </Link>
  )
}
