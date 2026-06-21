"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { FigmaButton } from "@/components/ui/figma-button"

interface PromoBannerProps extends React.ComponentProps<"div"> {
  ctaText: string
  ctaHref: string
}

function PromoBanner({
  className,
  children,
  ctaText,
  ctaHref,
  ...props
}: PromoBannerProps) {
  return (
    <div
      data-slot="promo-banner"
      className={cn(
        "bg-block-lilac rounded-[8px] p-[16px_24px] flex flex-row items-center justify-between gap-4 text-foreground",
        className
      )}
      {...props}
    >
      <div className="flex-1 text-[16px] font-[330] leading-[1.45]">
        {children}
      </div>
      <FigmaButton variant="magenta-promo" asChild>
        <a href={ctaHref}>{ctaText}</a>
      </FigmaButton>
    </div>
  )
}

PromoBanner.displayName = "PromoBanner"

export { PromoBanner }
