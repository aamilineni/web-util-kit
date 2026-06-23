import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, Menu, Shield, X } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { TOOL_CATEGORIES, getCategoryTools } from '@/config/tools'
import { SITE_NAME_PREFIX, SITE_NAME_SUFFIX, SITE_NAME } from '@/lib/seo'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <PageContainer width="full" className="flex items-center justify-between gap-3 py-2.5 sm:py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <span className="truncate text-sm sm:text-base">
              {SITE_NAME_PREFIX}<span className="text-brand-600">{SITE_NAME_SUFFIX}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Tool categories">
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.id} className="group relative">
                <Link
                  to={`/#${category.id}`}
                  className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {category.title}
                </Link>
                <div className="invisible absolute left-0 top-full z-20 min-w-64 translate-y-1 rounded-xl border border-slate-200 bg-white py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {category.sections?.length
                    ? category.sections.map((section) => (
                        <div key={section.id} className="py-1">
                          <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {section.title}
                          </p>
                          {section.tools.map((tool) => (
                            <NavLink
                              key={tool.id}
                              to={tool.path}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                            >
                              <tool.icon className="h-4 w-4 shrink-0 text-brand-500" />
                              <span className="truncate">{tool.title}</span>
                            </NavLink>
                          ))}
                        </div>
                      ))
                    : getCategoryTools(category).map((tool) => (
                        <NavLink
                          key={tool.id}
                          to={tool.path}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          <tool.icon className="h-4 w-4 shrink-0 text-brand-500" />
                          <span className="truncate">{tool.title}</span>
                        </NavLink>
                      ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 md:inline-flex">
              <Shield className="h-3.5 w-3.5" />
              100% Free
            </span>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 xl:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </PageContainer>

        {mobileOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-4 xl:hidden animate-fade-in">
            <div className="mx-auto grid max-h-[70vh] max-w-[1600px] gap-4 overflow-y-auto sm:grid-cols-2">
              {TOOL_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {category.title}
                  </p>
                  <div className="space-y-3">
                    {category.sections?.length
                      ? category.sections.map((section) => (
                          <div key={section.id}>
                            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              {section.title}
                            </p>
                            <div className="space-y-1">
                              {section.tools.map((tool) => (
                                <NavLink
                                  key={tool.id}
                                  to={tool.path}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50"
                                >
                                  <tool.icon className="h-4 w-4 shrink-0 text-brand-500" />
                                  <span className="truncate">{tool.title}</span>
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        ))
                      : getCategoryTools(category).map((tool) => (
                          <NavLink
                            key={tool.id}
                            to={tool.path}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50"
                          >
                            <tool.icon className="h-4 w-4 shrink-0 text-brand-500" />
                            <span className="truncate">{tool.title}</span>
                          </NavLink>
                        ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:pt-5">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/90">
        <PageContainer width="full" className="py-5">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            {SITE_NAME} — {TOOL_CATEGORIES.reduce((n, c) => n + getCategoryTools(c).length, 0)} free tools.
            Everything runs in your browser.
          </p>
        </PageContainer>
      </footer>
    </div>
  )
}
