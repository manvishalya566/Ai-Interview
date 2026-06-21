"use client"

import { AlertCircle, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { FigmaButton } from "@/components/ui/figma-button"

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-border bg-background p-12 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-block-pink">
        <AlertCircle className="h-6 w-6 text-foreground" />
      </div>
      <h3 className="text-headline text-foreground">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-body-sm text-foreground/40">{message}</p>
      {onRetry && (
        <FigmaButton variant="secondary" className="mt-6" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" />
          Try again
        </FigmaButton>
      )}
    </div>
  )
}
