"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const colorBlockVariants = {
  lime: "bg-[#dceeb1] text-black",
  lilac: "bg-[#c5b0f4] text-black",
  cream: "bg-[#f4ecd6] text-black",
  mint: "bg-[#c8e6cd] text-black",
  pink: "bg-[#efd4d4] text-black",
  coral: "bg-[#f3c9b6] text-black",
  navy: "bg-[#1f1d3d] text-white",
} as const

interface ColorBlockProps extends React.ComponentProps<"section"> {
  variant?: keyof typeof colorBlockVariants
  as?: React.ElementType
}

function ColorBlock({
  className,
  variant = "lime",
  as: Component = "section",
  children,
  ...props
}: ColorBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Component
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
      </Component>
    </motion.div>
  )
}

ColorBlock.displayName = "ColorBlock"

export { ColorBlock, colorBlockVariants }
