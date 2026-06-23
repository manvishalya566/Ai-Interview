'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Briefcase, Target, Activity, Star, Code, Users,
  Clock, MessageSquare, TrendingUp, Menu, Sparkles, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { useAuth } from '@/hooks/useAuth'

const IconMap: Record<string, typeof Code> = { Code, Users, Clock, MessageSquare }

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
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
      if (current >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{count}{suffix}</span>
}

interface StatCard {
  label: string
  value: number
  suffix: string
  icon: typeof Briefcase
  change: string
  gradient: string
}

interface Improvement {
  area: string
  suggestion: string
  impact: string
  icon?: keyof typeof IconMap | typeof Code
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Weekly')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics')
        const data = await res.json()
        if (data.success) setAnalyticsData(data)
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const {
    totalInterviews = 0,
    averageScore = 0,
    currentStreak = 0,
    skillsMastered = 0,
    weeklyData = [],
    skillData = [],
    scoreDistribution = [],
    improvements = [],
  } = analyticsData || {}

  const statCards: StatCard[] = [
    { label: 'Total Interviews', value: totalInterviews, suffix: '', icon: Briefcase, change: `+${Math.min(totalInterviews, 5)}`, gradient: 'from-[#FF4D9D] to-[#FF6BCB]' },
    { label: 'Average Score', value: averageScore, suffix: '%', icon: Target, change: `+${Math.min(Math.round(averageScore * 0.05), 10)}%`, gradient: 'from-[#C084FC] to-[#8B5CF6]' },
    { label: 'Current Streak', value: currentStreak, suffix: ' days', icon: Activity, change: '+2', gradient: 'from-[#60A5FA] to-[#3B82F6]' },
    { label: 'Skills Mastered', value: skillsMastered, suffix: '', icon: Star, change: '+3', gradient: 'from-[#34D399] to-[#22C55E]' },
  ]

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcff]">
        <div className="flex flex-col items-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]">
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
          </motion.div>
          <span className="text-sm font-medium text-[#6b6a7a]">Loading analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#fcfcff]">
      <DashboardSidebar
        user={user}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-[72px]')}>
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e8e7f0] bg-white/80 backdrop-blur-xl px-4 lg:hidden">
          <button onClick={() => setMobileSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6a7a] hover:bg-[#f0eeff]">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-[#0a0a0f]">MockAI</span>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/30">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-headline text-[#0a0a0f]">Analytics</h1>
                  <p className="text-body-sm text-[#6b6a7a]">Track your interview performance over time</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/10"
                >
                  <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', stat.gradient)} />
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center justify-between">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm', stat.gradient)}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-xs font-semibold text-[#22C55E]">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-[#0a0a0f]">
                      {stat.suffix ? `${stat.value}${stat.suffix}` : <AnimatedCounter value={stat.value} />}
                    </div>
                    <p className="mt-0.5 text-sm text-[#6b6a7a]">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-[#C084FC]/10 transition-all duration-300"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Performance Chart</h2>
                    <p className="text-sm text-[#6b6a7a]">Score trend over time</p>
                  </div>
                  <div className="relative flex rounded-xl bg-[#f5f0ff] p-1">
                    {['Weekly', 'Monthly'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          'relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200',
                          activeTab === tab ? 'text-white' : 'text-[#6b6a7a] hover:text-[#0a0a0f]'
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                    <motion.div
                      layoutId="chart-tab-pill"
                      className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] shadow-md"
                      animate={{ left: activeTab === 'Weekly' ? '4px' : '50%', width: 'calc(50% - 8px)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2" style={{ height: '200px' }}>
                  {weeklyData.map((d: any, i: number) => (
                    <motion.div
                      key={d.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
                      className="group relative flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="relative w-full" style={{ height: '160px' }}>
                        <div className="absolute bottom-0 left-0 right-0 h-full rounded-xl bg-[#f0eeff]" />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${d.value}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                          className="absolute bottom-0 left-0 right-0 rounded-xl bg-gradient-to-t from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/30 transition-all duration-300"
                          style={{ minHeight: '8px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0a0a0f] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                            {d.value}%
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs font-medium text-[#a0a0b0]">{d.day}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-[#C084FC]/10 transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Skill Breakdown</h2>
                  <p className="text-sm text-[#6b6a7a]">Your proficiency across skills</p>
                </div>
                <div className="space-y-5">
                  {skillData.map((skill: any, i: number) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[#0a0a0f]">{skill.name}</span>
                        <span className="text-sm font-bold text-[#8B5CF6]">{skill.score}%</span>
                      </div>
                      <div className="relative h-2.5 overflow-hidden rounded-full bg-[#f0eeff]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.score}%` }}
                          transition={{ duration: 1, delay: 0.45 + i * 0.06, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-sm shadow-[#C084FC]/30"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-[#C084FC]/10 transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Score Distribution</h2>
                  <p className="text-sm text-[#6b6a7a]">How your scores are distributed</p>
                </div>
                <div className="space-y-4">
                  {scoreDistribution.map((item: any, i: number) => {
                    const pct = totalInterviews > 0 ? (item.count / totalInterviews) * 100 : 0
                    return (
                      <motion.div
                        key={item.range}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                        className="flex items-center gap-3"
                      >
                        <span className="w-20 text-sm text-[#6b6a7a]">{item.range}</span>
                        <div className="relative flex-1 h-7 rounded-xl bg-[#f0eeff] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                            className="h-full rounded-xl"
                            style={{ background: item.color || 'linear-gradient(90deg, #C084FC, #8B5CF6)' }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-bold text-[#0a0a0f]">{item.count}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-[#C084FC]/10 transition-all duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Improvement Suggestions</h2>
                  <p className="text-sm text-[#6b6a7a]">Areas to focus on</p>
                </div>
                <div className="space-y-3">
                  {improvements.map((item: Improvement, i: number) => {
                    const IconComp = typeof item.icon === 'string' ? (IconMap[item.icon] || Code) : (item.icon || Code)
                    return (
                      <motion.div
                        key={item.area}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                        whileHover={{ x: 4, transition: { duration: 0.15 } }}
                        className="group cursor-pointer rounded-xl border border-[#e8e7f0] bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-[#C084FC]/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                              item.impact === 'High' ? 'bg-[#FF4D9D]/10 text-[#FF4D9D]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                            )}>
                              <IconComp className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-[#0a0a0f]">{item.area}</span>
                                <span className={cn(
                                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                                  item.impact === 'High'
                                    ? 'bg-gradient-to-r from-[#FF4D9D]/20 to-[#FF6BCB]/20 text-[#FF4D9D]'
                                    : 'bg-gradient-to-r from-[#F59E0B]/20 to-[#F97316]/20 text-[#F59E0B]'
                                )}>
                                  {item.impact}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm text-[#6b6a7a]">{item.suggestion}</p>
                            </div>
                          </div>
                          <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[#a0a0b0] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
