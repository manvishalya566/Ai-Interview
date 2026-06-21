"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: LucideIcon
}

function TextInput({
  className,
  error = false,
  icon: Icon,
  ...props
}: TextInputProps) {
  return (
    <div className="relative flex items-center h-12 rounded-md border border-hairline bg-background transition-all duration-200 focus-within:border-foreground/30">
      {Icon && (
        <Icon className="absolute left-4 h-4 w-4 text-foreground/30 pointer-events-none shrink-0" />
      )}
      <input
        data-slot="text-input"
        data-error={error || undefined}
        className={cn(
          "w-full h-full bg-transparent text-body text-foreground placeholder:text-foreground/25 focus:outline-none",
          Icon ? "pl-11 pr-4" : "px-4"
        )}
        {...props}
      />
    </div>
  )
}

TextInput.displayName = "TextInput"

export { TextInput }
