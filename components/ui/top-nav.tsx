"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Menu, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import { useAuth } from "@/hooks/useAuth"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Interview", href: "/interview" },
  { label: "History", href: "/history" },
  { label: "Feedback", href: "/feedback" },
]

interface TopNavProps extends React.ComponentProps<"header"> {}

function TopNav({ className, ...props }: TopNavProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const isAuthenticated = !!user

  return (
    <header
      data-slot="top-nav"
      className={cn(
        "sticky top-0 z-50 h-[64px] bg-white/70 backdrop-blur-xl border-b border-[#e8e7f0]",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center px-6 lg:px-8">
        <Link
          href="/"
          className="mr-8 flex shrink-0 items-center gap-2.5 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-md shadow-[#C084FC]/30 transition-transform duration-300 group-hover:scale-105">
            <Brain className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0a0a0f]">MockAI</span>
          <Sparkles className="h-3.5 w-3.5 text-[#C084FC] animate-sparkle" />
        </Link>

        {isAuthenticated && (
          <nav className="hidden min-[960px]:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl",
                    isActive
                      ? "text-[#8B5CF6]"
                      : "text-[#6b6a7a] hover:text-[#0a0a0f] hover:bg-[#f5f0ff]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="top-nav-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden min-[560px]:flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-16 animate-pulse rounded-[50px] bg-[#e8e7f0]" />
                <div className="h-9 w-24 animate-pulse rounded-[50px] bg-[#e8e7f0]" />
              </div>
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex shrink-0 items-center justify-center gap-2 font-medium text-sm whitespace-nowrap transition-all duration-300 outline-none text-white rounded-[50px] px-5 py-2 bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#C084FC]/30 active:scale-[0.98] will-change-transform"
              >
                Dashboard
                <Sparkles className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex shrink-0 items-center justify-center font-medium text-sm whitespace-nowrap transition-all duration-300 outline-none bg-white text-[#0a0a0f] rounded-[50px] px-5 py-2 border border-[#e8e7f0] hover:scale-[1.02] hover:bg-[#f5f0ff] hover:border-[#C084FC]/30 active:scale-[0.98] will-change-transform"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex shrink-0 items-center justify-center gap-2 font-medium text-sm whitespace-nowrap transition-all duration-300 outline-none text-white rounded-[50px] px-5 py-2 bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#C084FC]/30 active:scale-[0.98] will-change-transform"
                >
                  Sign up
                  <Sparkles className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>

          <div className="hidden min-[560px]:block">
            <ThemeToggle collapsed />
          </div>

          <div className="min-[960px]:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#e8e7f0] bg-white text-[#6b6a7a] hover:bg-[#f5f0ff] hover:text-[#0a0a0f] transition-all duration-200"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" showCloseButton={false} className="p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#e8e7f0] bg-gradient-to-r from-[#f5f0ff] to-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-md shadow-[#C084FC]/30">
                      <Brain className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-[#0a0a0f]">MockAI</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1 px-4 py-6">
                    <div className="px-4 py-2">
                      <ThemeToggle />
                    </div>
                    {loading ? null : isAuthenticated ? (
                      navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            className={cn(
                              "relative text-base font-medium py-3 px-4 rounded-xl transition-all duration-200",
                              isActive
                                ? "bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10 text-[#8B5CF6]"
                                : "text-[#6b6a7a] hover:bg-[#f5f0ff] hover:text-[#0a0a0f]"
                            )}
                          >
                            {link.label}
                          </Link>
                        )
                      })
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="text-base font-medium text-[#6b6a7a] py-3 px-4 rounded-xl hover:bg-[#f5f0ff] hover:text-[#0a0a0f] transition-all duration-200"
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          className="text-base font-medium text-[#6b6a7a] py-3 px-4 rounded-xl hover:bg-[#f5f0ff] hover:text-[#0a0a0f] transition-all duration-200"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                  {!loading && !isAuthenticated && (
                    <div className="flex flex-col gap-3 px-4 pb-8 border-t border-[#e8e7f0] pt-6">
                      <Link
                        href="/login"
                        className="inline-flex shrink-0 items-center justify-center font-medium text-sm whitespace-nowrap transition-all duration-300 outline-none bg-white text-[#0a0a0f] rounded-[50px] px-5 py-2.5 border border-[#e8e7f0] hover:scale-[1.02] hover:bg-[#f5f0ff] hover:border-[#C084FC]/30 active:scale-[0.98] w-full"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="inline-flex shrink-0 items-center justify-center gap-2 font-medium text-sm whitespace-nowrap transition-all duration-300 outline-none text-white rounded-[50px] px-5 py-2.5 bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#C084FC]/30 active:scale-[0.98] w-full"
                      >
                        Sign up
                        <Sparkles className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

TopNav.displayName = "TopNav"

export { TopNav }
