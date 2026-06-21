"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FigmaButton } from "@/components/ui/figma-button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; href: string }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-border bg-background p-12 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-secondary">
        <Icon className="h-6 w-6 text-foreground/40" />
      </div>
      <h3 className="text-headline text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-body-sm text-foreground/40">{description}</p>
      {action && (
        <FigmaButton variant="primary" className="mt-6" asChild>
          <Link href={action.href}>{action.label}</Link>
        </FigmaButton>
      )}
    </div>
  )
}
