"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface PricingTabProps extends React.ComponentProps<"button"> {
  variant?: "default" | "selected"
}

function PricingTab({
  className,
  variant = "default",
  children,
  ...props
}: PricingTabProps) {
  return (
    <button
      data-slot="pricing-tab"
      data-variant={variant}
      className={cn(
        "rounded-[50px] px-[18px] py-2 text-[20px] font-[480] leading-[1.40] tracking-[-0.10px] transition-all outline-none select-none",
        variant === "default" && "bg-background text-foreground",
        variant === "selected" && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

PricingTab.displayName = "PricingTab"

export { PricingTab }
