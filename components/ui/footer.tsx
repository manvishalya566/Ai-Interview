"use client"

import * as React from "react"
import Link from "next/link"
import { Brain, Globe, MessageSquare, Users, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const footerLinkGroups: Record<string, { href: string; label: string }[]> = {
  "Quick Links": [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/interview", label: "Interview" },
    { href: "/history", label: "History" },
    { href: "/feedback", label: "Feedback" },
  ],
  "Account": [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
  ],
  "Resources": [
    { href: "#", label: "Blog" },
    { href: "#", label: "Help Center" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
}

interface FooterProps extends React.ComponentProps<"footer"> {}

function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn("bg-[#0a0a0f] border-t border-white/5", className)}
      {...props}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/30 transition-transform duration-300 group-hover:scale-105">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">MockAI</span>
              <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
            </Link>
            <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-sm">
              AI-powered mock interviews to help you land your dream job. Practice smart, interview with confidence.
            </p>
            <div className="mt-8 flex gap-3">
              {[
                { icon: Globe, href: "#" },
                { icon: MessageSquare, href: "#" },
                { icon: Users, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-gradient-to-br hover:from-[#FF4D9D] hover:to-[#8B5CF6] hover:text-white transition-all duration-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinkGroups).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-5 text-xs font-semibold uppercase tracking-wider text-white/30">
                {heading}
              </h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-all duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} MockAI. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/20">Built with</span>
            <span className="text-xs bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] bg-clip-text text-transparent font-semibold">AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.displayName = "Footer"

export { Footer }
