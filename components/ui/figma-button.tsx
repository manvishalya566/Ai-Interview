"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const figmaButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-[480] text-[15px] leading-none tracking-[-0.10px] whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white rounded-[50px] px-4 py-[7px]",
        secondary:
          "bg-white text-black rounded-[50px] px-[14px] pt-[6px] pb-[8px]",
        "tertiary-text":
          "bg-transparent text-black rounded-[9999px] px-3 py-1.5",
        "icon-circular":
          "bg-[#f7f7f5] text-black w-8 h-8 rounded-full p-0 flex items-center justify-center",
        "icon-circular-inverse":
          "bg-white/16 text-white w-8 h-8 rounded-full p-0 flex items-center justify-center",
        "magenta-promo":
          "bg-[#ff3d8b] text-white rounded-[50px] px-[14px] py-[7px]",
        "pricing-tab-default":
          "bg-white text-black rounded-[50px] px-[14px] py-1.5",
        "pricing-tab-selected":
          "bg-black text-white rounded-[50px] px-[14px] py-1.5",
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
