"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface FeatureTileProps extends React.ComponentProps<"div"> {
  label?: string
}

function FeatureTile({
  className,
  children,
  label,
  ...props
}: FeatureTileProps) {
  return (
    <div
      data-slot="feature-tile"
      className={cn(
        "bg-[#f7f7f5] rounded-[8px] p-[24px] text-black",
        className
      )}
      {...props}
    >
      {label && (
        <span className="block mb-3 text-[18px] uppercase tracking-[0.54px] font-mono leading-[1.30]">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

FeatureTile.displayName = "FeatureTile"

export { FeatureTile }
