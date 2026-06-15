"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TemplateCardProps extends React.ComponentProps<"div"> {
  title?: string
}

function TemplateCard({
  className,
  children,
  title,
  ...props
}: TemplateCardProps) {
  return (
    <div
      data-slot="template-card"
      className={cn(
        "bg-[#f7f7f5] rounded-[8px] p-[16px] text-black",
        className
      )}
      {...props}
    >
      {children}
      {title && (
        <p className="mt-2 text-[16px] font-[330] leading-[1.45]">
          {title}
        </p>
      )}
    </div>
  )
}

TemplateCard.displayName = "TemplateCard"

export { TemplateCard }
