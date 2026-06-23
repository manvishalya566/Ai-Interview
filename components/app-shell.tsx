"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Brain, Search, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { SIDEBAR_LINKS, PUBLIC_NAV_LINKS } from "@/lib/nav-config"
import { FigmaButton } from "@/components/ui/figma-button"
import { useAuth } from "@/hooks/useAuth"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { user } = useAuth() as any
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex w-full min-h-screen bg-canvas text-foreground">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-border bg-background transition-all duration-300 lg:flex",
          mobileSidebarOpen && "!flex"
        )}
      >
        {mobileSidebarOpen ? (
          <MobileSidebarContent user={user} onClose={() => setMobileSidebarOpen(false)} />
        ) : (
          <DesktopSidebarContent user={user} collapsed={!sidebarOpen} />
        )}
      </aside>

      <div className={cn("flex flex-1 flex-col transition-all duration-300", sidebarOpen ? "lg:ml-60" : "lg:ml-18")}>
        <header className="sticky top-0 z-30 border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-pill p-2 text-foreground/40 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden rounded-pill p-2 text-foreground/40 transition-colors hover:bg-secondary hover:text-foreground lg:block"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-9 w-48 rounded-pill border border-border bg-background pl-9 pr-4 text-sm text-foreground/80 placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none lg:w-64"
                />
              </div>
              <nav className="hidden items-center gap-1 md:flex">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-pill px-3 py-1.5 text-sm transition-all",
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/50 hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <button className="relative rounded-pill border border-border bg-background p-2 text-foreground/40 transition-colors hover:bg-secondary hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            {children}
            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}

function DesktopSidebarContent({ user, collapsed }: { user: any; collapsed: boolean }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U"
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 items-center border-b border-border", collapsed ? "justify-center px-3" : "px-5")}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-foreground">MockAI</span>}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_LINKS.map((link) => {
          const active = typeof window !== "undefined" && window.location.pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-pill px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/50 hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>
      <div className={cn("border-t border-border p-3", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              {initial}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <p className="truncate text-xs text-foreground/40">{user?.email || ""}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            {initial}
          </div>
        )}
      </div>
    </div>
  )
}

function MobileSidebarContent({ user, onClose }: { user: any; onClose: () => void }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U"
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">MockAI</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-pill p-2 text-foreground/40 transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-pill px-3 py-2.5 text-sm font-medium transition-all duration-200",
              typeof window !== "undefined" && window.location.pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground/50 hover:bg-secondary hover:text-foreground"
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            {initial}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">{user?.name || "User"}</p>
            <p className="truncate text-xs text-foreground/40">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
