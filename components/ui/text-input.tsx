"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

function TextInput({
  className,
  error = false,
  ...props
}: TextInputProps) {
  return (
    <input
      data-slot="text-input"
      data-error={error || undefined}
      className={cn(
        "bg-white text-black border border-[#e6e6e6] rounded-[8px] px-[14px] py-[12px] text-[18px] font-[320] leading-[1.45] tracking-[-0.26px] outline-none transition-colors placeholder:text-black/30 focus:border-black",
        error && "border-red-500 focus:border-red-500",
        className
      )}
      {...props}
    />
  )
}

TextInput.displayName = "TextInput"

export { TextInput }
