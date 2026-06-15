"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface MarqueeStripProps extends React.ComponentProps<"div"> {
  items: string[]
  speed?: number
}

function MarqueeStrip({
  className,
  items,
  speed = 30,
  ...props
}: MarqueeStripProps) {
  const id = React.useId()

  return (
    <div
      data-slot="marquee-strip"
      className={cn(
        "h-[36px] bg-black text-white overflow-hidden",
        className
      )}
      {...props}
    >
      <style>{`
        @keyframes marquee-${id} {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex h-full items-center"
        style={{
          animation: `marquee-${id} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="px-4 text-[16px] font-[330] whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

MarqueeStrip.displayName = "MarqueeStrip"

export { MarqueeStrip }
