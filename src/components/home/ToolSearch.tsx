import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Command, Search, X } from 'lucide-react'
import { ALL_TOOLS, TOOL_CATEGORIES, getCategoryForTool } from '@/config/tools'
import type { ToolDefinition } from '@/config/tools'

type SearchGroup = {
  categoryId: string
  categoryTitle: string
  tools: ToolDefinition[]
}

function groupToolsByCategory(tools: ToolDefinition[]): SearchGroup[] {
  const groups: SearchGroup[] = []

  for (const category of TOOL_CATEGORIES) {
    const categoryTools = tools.filter((tool) => getCategoryForTool(tool.path)?.id === category.id)
    if (categoryTools.length > 0) {
      groups.push({
        categoryId: category.id,
        categoryTitle: category.title,
        tools: categoryTools,
      })
    }
  }

  return groups
}

export function ToolSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_TOOLS.slice(0, 8)
    return ALL_TOOLS.filter(
      (tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((keyword) => keyword.includes(q)),
    )
  }, [query])

  const groupedResults = useMemo(() => groupToolsByCategory(results), [results])
  const flatResults = useMemo(() => groupedResults.flatMap((group) => group.tools), [groupedResults])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (event.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const goTo = (path: string) => {
    navigate(path)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, flatResults.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    }
    if (event.key === 'Enter' && flatResults[activeIndex]) {
      goTo(flatResults[activeIndex].path)
    }
  }

  let resultOffset = 0

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={onInputKeyDown}
          placeholder="Search tools — merge pdf, base64, uuid…"
          className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3.5 pl-12 pr-28 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500 sm:flex">
          <Command className="h-3 w-3" />
          K
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 sm:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && groupedResults.length > 0 && (
        <div className="absolute z-30 mt-2 max-h-[min(24rem,70vh)] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl animate-fade-in">
          {groupedResults.map((group) => (
            <div key={group.categoryId}>
              <p className="sticky top-0 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.categoryTitle}
              </p>
              <ul>
                {group.tools.map((tool) => {
                  const index = resultOffset++
                  return (
                    <li key={tool.id}>
                      <Link
                        to={tool.path}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => goTo(tool.path)}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          index === activeIndex ? 'bg-brand-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <tool.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-slate-900">{tool.title}</span>
                          <span className="block truncate text-xs text-slate-500">{tool.description}</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {open && query && flatResults.length === 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-xl">
          No tools found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
