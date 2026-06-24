"use client"

import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"

interface ThemeToggleProps {
  className?: string
  collapsed?: boolean
}

export function ThemeToggle({ className, collapsed }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()

  if (collapsed) {
    return (
      <button
        onClick={toggle}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
          theme === "dark"
            ? "bg-[#C084FC]/10 text-[#C084FC] hover:bg-[#C084FC]/20"
            : "bg-[#f0eeff] text-[#6b6a7a] hover:bg-[#e8e5ff]",
          className,
        )}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full",
        theme === "dark"
          ? "bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10 text-[#C084FC] shadow-sm"
          : "text-[#6b6a7a] hover:bg-[#f5f0ff] hover:text-[#0a0a0f]",
        className,
      )}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
          theme === "dark"
            ? "bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] text-white shadow-lg shadow-[#C084FC]/30"
            : "bg-[#f0eeff] text-[#6b6a7a] group-hover:bg-[#e8e5ff]",
        )}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.div>
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  )
}
