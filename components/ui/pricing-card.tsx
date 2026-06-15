"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface PricingCardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "featured"
}

function PricingCard({
  className,
  variant = "default",
  children,
  ...props
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        data-slot="pricing-card"
        data-variant={variant}
        className={cn(
          "bg-white rounded-[24px] border border-[#e6e6e6] p-[24px]",
          variant === "featured" &&
            "border-t-2 border-t-black shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </motion.div>
  )
}

PricingCard.displayName = "PricingCard"

export { PricingCard }
