'use client'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  children?: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  className?: string
}

const variants: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground px-5 py-2.5 hover:bg-foreground/80',
  secondary: 'border border-border bg-background text-foreground px-5 py-2.5 hover:bg-secondary',
  ghost: 'bg-background text-foreground px-3 py-2 hover:bg-secondary rounded-full',
  danger: 'bg-primary text-primary-foreground px-5 py-2.5 hover:bg-foreground/80',
  icon: 'bg-secondary text-foreground rounded-full h-10 w-10 p-0 flex items-center justify-center hover:bg-border',
}

export const FigmaButton = memo(function FigmaButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled,
  className,
}: Props) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-[50px] text-[20px] font-[480] transition-all duration-200',
        variants[variant],
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </motion.button>
  )
})
