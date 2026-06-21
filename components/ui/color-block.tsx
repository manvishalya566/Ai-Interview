"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const colorBlockVariants = {
  lime: "bg-block-lime text-foreground",
  lilac: "bg-block-lilac text-foreground",
  cream: "bg-block-cream text-foreground",
  mint: "bg-block-mint text-foreground",
  pink: "bg-block-pink text-foreground",
  coral: "bg-block-coral text-foreground",
  navy: "bg-block-navy text-primary-foreground",
} as const

function ColorBlock({
  className,
  variant = "lime",
  children,
  ...props
}: React.ComponentPropsWithoutRef<"section"> & {
  variant?: keyof typeof colorBlockVariants
}) {
  return (
    <section
      data-slot="color-block"
      data-variant={variant}
      className={cn(
        "w-full rounded-[24px] p-[48px] max-md:rounded-none",
        colorBlockVariants[variant],
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-[1280px]">{children}</div>
    </section>
  )
}

ColorBlock.displayName = "ColorBlock"

export { ColorBlock, colorBlockVariants }
