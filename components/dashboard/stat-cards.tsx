'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Briefcase, Target, Award, Zap, TrendingUp } from 'lucide-react'

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{count}{suffix}</span>
}

interface StatCardData {
  label: string
  value: number
  suffix?: string
  change: string
  changeUp: boolean
  icon: any
  gradient: string
  gradientFrom: string
  gradientTo: string
}

const gradients: Record<string, { from: string; to: string }> = {
  pink: { from: '#FF4D9D', to: '#FF6BCB' },
  purple: { from: '#C084FC', to: '#8B5CF6' },
  blue: { from: '#60A5FA', to: '#3B82F6' },
  green: { from: '#34D399', to: '#22C55E' },
}

export function StatCards({ stats }: { stats: any }) {
  const cards: StatCardData[] = [
    {
      label: 'Total Interviews',
      value: stats.totalInterviews || 24,
      change: '+12%',
      changeUp: true,
      icon: Briefcase,
      gradient: 'from-[#FF4D9D] to-[#FF6BCB]',
      gradientFrom: gradients.pink.from,
      gradientTo: gradients.pink.to,
    },
    {
      label: 'Average Score',
      value: stats.averageScore || 84,
      suffix: '%',
      change: '+8%',
      changeUp: true,
      icon: Target,
      gradient: 'from-[#C084FC] to-[#8B5CF6]',
      gradientFrom: gradients.purple.from,
      gradientTo: gradients.purple.to,
    },
    {
      label: 'Skills Assessed',
      value: stats.skillsAssessed || 18,
      change: '+4',
      changeUp: true,
      icon: Award,
      gradient: 'from-[#60A5FA] to-[#3B82F6]',
      gradientFrom: gradients.blue.from,
      gradientTo: gradients.blue.to,
    },
    {
      label: 'Streak Days',
      value: stats.streakDays || 14,
      change: '+5',
      changeUp: true,
      icon: Zap,
      gradient: 'from-[#34D399] to-[#22C55E]',
      gradientFrom: gradients.green.from,
      gradientTo: gradients.green.to,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="group relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/10 hover:border-[#C084FC]/30"
        >
          {/* Gradient accent line */}
          <div
            className="absolute left-0 top-0 h-full w-[3px] opacity-80 transition-all duration-300 group-hover:w-[4px]"
            style={{ background: `linear-gradient(to bottom, ${card.gradientFrom}, ${card.gradientTo})` }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#6b6a7a]">{card.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-[#0a0a0f]">
                  <AnimatedCounter value={card.value} suffix={card.suffix || ''} />
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                  card.changeUp
                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                    : 'bg-[#EF4444]/10 text-[#EF4444]'
                )}>
                  <TrendingUp className="h-3 w-3" />
                  {card.change}
                </div>
                <span className="text-[11px] text-[#a0a0b0]">vs last week</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${card.gradientFrom}15, ${card.gradientTo}15)`,
              }}
            >
              <card.icon className="h-5 w-5" style={{ color: card.gradientFrom }} />
            </motion.div>
          </div>

          {/* Subtle glow on hover */}
          <div
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
            style={{ background: `radial-gradient(circle, ${card.gradientFrom}, transparent)` }}
          />
        </motion.div>
      ))}
    </div>
  )
}
