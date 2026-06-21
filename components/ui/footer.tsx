"use client"

import * as React from "react"
import Link from "next/link"
import { Brain, Globe, MessageSquare, Users } from "lucide-react"

import { cn } from "@/lib/utils"

const footerLinkGroups = {
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
      className={cn("bg-background border-t border-border", className)}
      {...props}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-[480] text-foreground">MockAI</span>
            </Link>
            <p className="mt-4 text-[16px] font-[330] leading-[1.45] text-foreground/60">
              AI-powered mock interviews to help you land your dream job. Practice smart, interview with confidence.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="rounded-full p-2 bg-secondary text-foreground/60 hover:text-foreground transition-colors">
                <Globe className="size-4" />
              </a>
              <a href="#" className="rounded-full p-2 bg-secondary text-foreground/60 hover:text-foreground transition-colors">
                <MessageSquare className="size-4" />
              </a>
              <a href="#" className="rounded-full p-2 bg-secondary text-foreground/60 hover:text-foreground transition-colors">
                <Users className="size-4" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinkGroups).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-[12px] font-[400] font-mono uppercase tracking-[0.60px] text-foreground/40">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[16px] font-[330] text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-[12px] font-[400] font-mono uppercase tracking-[0.60px] text-foreground/40">
            &copy; {new Date().getFullYear()} MockAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

Footer.displayName = "Footer"

export { Footer }
