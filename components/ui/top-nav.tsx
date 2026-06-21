"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import { useAuth } from "@/hooks/useAuth"

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Interview", href: "/interview" },
  { label: "History", href: "/history" },
  { label: "Feedback", href: "/feedback" },
]

interface TopNavProps extends React.ComponentProps<"header"> {}

function TopNav({ className, ...props }: TopNavProps) {
  const { user, loading } = useAuth()
  const isAuthenticated = !!user

  return (
    <header
      data-slot="top-nav"
      className={cn(
        "sticky top-0 z-50 h-[56px] bg-background border-b border-border",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center px-6 lg:px-8">
        <Link
          href="/"
          className="mr-8 shrink-0 text-[20px] font-bold text-foreground"
        >
          PrepGenius
        </Link>

        {isAuthenticated && (
          <nav className="hidden min-[960px]:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[16px] font-[330] text-foreground hover:text-foreground/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden min-[560px]:flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-16 animate-pulse rounded-[50px] bg-border" />
                <div className="h-9 w-24 animate-pulse rounded-[50px] bg-border" />
              </div>
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all duration-300 outline-none text-primary-foreground rounded-[50px] px-4 py-[7px] bg-gradient-to-r from-primary to-accent hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform min-w-[100px]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all duration-300 outline-none bg-background text-foreground rounded-[50px] px-[14px] pt-[6px] pb-[8px] border border-border hover:scale-[1.02] hover:bg-secondary hover:border-foreground/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all duration-300 outline-none text-primary-foreground rounded-[50px] px-4 py-[7px] bg-gradient-to-r from-primary to-accent hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform min-w-[100px]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="min-[960px]:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-foreground"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" showCloseButton={false}>
                <div className="flex flex-col gap-2 mt-12 px-4">
                  {loading ? null : isAuthenticated ? (
                    navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-[20px] font-[480] text-foreground py-3 px-2 rounded-[8px] hover:bg-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-[20px] font-[480] text-foreground py-3 px-2 rounded-[8px] hover:bg-secondary transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="text-[20px] font-[480] text-foreground py-3 px-2 rounded-[8px] hover:bg-secondary transition-colors"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                  {!loading && !isAuthenticated && (
                    <div className="flex flex-col gap-3 mt-6">
                      <Link
                        href="/login"
                        className="inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all duration-300 outline-none bg-background text-foreground rounded-[50px] px-[14px] pt-[6px] pb-[8px] border border-border hover:scale-[1.02] hover:bg-secondary hover:border-foreground/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform w-full"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all duration-300 outline-none text-primary-foreground rounded-[50px] px-4 py-[7px] bg-gradient-to-r from-primary to-accent hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform w-full"
                      >
                        Sign up
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
