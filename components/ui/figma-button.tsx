"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const figmaButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all duration-300 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground rounded-[50px] px-4 py-[7px] hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform",
        secondary:
          "bg-background text-foreground rounded-[50px] px-[14px] pt-[6px] pb-[8px] hover:scale-[1.02] hover:bg-secondary/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform",
        "tertiary-text":
          "bg-transparent text-foreground rounded-[9999px] px-3 py-1.5",
        "icon-circular":
          "bg-secondary text-foreground w-8 h-8 rounded-full p-0 flex items-center justify-center",
        "icon-circular-inverse":
          "bg-background/16 text-primary-foreground w-8 h-8 rounded-full p-0 flex items-center justify-center",
        "magenta-promo":
          "bg-accent-magenta text-primary-foreground rounded-[50px] px-[14px] py-[7px] hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 will-change-transform",
        "pricing-tab-default":
          "bg-background text-foreground rounded-[50px] px-[14px] py-1.5",
        "pricing-tab-selected":
          "bg-primary text-primary-foreground rounded-[50px] px-[14px] py-1.5",
      },
      size: {
        default: "h-auto",
        sm: "h-auto text-[13px] px-2.5 py-1",
        lg: "h-auto text-[18px] px-5 py-[9px]",
        icon: "size-8",
        "icon-sm": "size-6",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

interface FigmaButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof figmaButtonVariants> {
  asChild?: boolean
}

function FigmaButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: FigmaButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="figma-button"
      data-variant={variant}
      data-size={size}
      className={cn(figmaButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

FigmaButton.displayName = "FigmaButton"

export { FigmaButton, figmaButtonVariants }
