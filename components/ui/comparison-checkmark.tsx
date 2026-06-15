"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface ComparisonCheckmarkProps extends React.ComponentProps<"div"> {}

function ComparisonCheckmark({
  className,
  ...props
}: ComparisonCheckmarkProps) {
  return (
    <div
      data-slot="comparison-checkmark"
      className={cn(
        "w-4 h-4 rounded-full flex items-center justify-center",
        className
      )}
      {...props}
    >
      <Check className="size-3 text-[#1ea64a]" strokeWidth={3} />
    </div>
  )
}

ComparisonCheckmark.displayName = "ComparisonCheckmark"

export { ComparisonCheckmark }
