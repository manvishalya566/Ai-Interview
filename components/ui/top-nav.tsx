"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { FigmaButton } from "@/components/ui/figma-button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Dashboard", href: "#" },
  { label: "Interview", href: "#" },
  { label: "History", href: "#" },
  { label: "Feedback", href: "#" },
]

interface TopNavProps extends React.ComponentProps<"header"> {}

function TopNav({ className, ...props }: TopNavProps) {
  return (
    <header
      data-slot="top-nav"
      className={cn(
        "sticky top-0 z-50 h-[56px] bg-white border-b border-[#e6e6e6]",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center px-6 lg:px-8">
        <a
          href="#"
          className="mr-8 shrink-0 text-[20px] font-bold text-black"
        >
          PrepGenius
        </a>

        <nav className="hidden min-[960px]:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[16px] font-[330] text-black hover:text-black/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden min-[560px]:flex items-center gap-3">
            <FigmaButton variant="secondary" size="default">
              Contact sales
            </FigmaButton>
            <FigmaButton variant="primary" size="default">
              Get started for free
            </FigmaButton>
          </div>

          <div className="min-[960px]:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f7f7f5] text-black"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" showCloseButton={false}>
                <div className="flex flex-col gap-2 mt-12 px-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[20px] font-[480] text-black py-3 px-2 rounded-[8px] hover:bg-[#f7f7f5] transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-3 mt-6">
                    <FigmaButton
                      variant="secondary"
                      size="default"
                      className="w-full justify-center"
                    >
                      Contact sales
                    </FigmaButton>
                    <FigmaButton
                      variant="primary"
                      size="default"
                      className="w-full justify-center"
                    >
                      Get started for free
                    </FigmaButton>
                  </div>
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
