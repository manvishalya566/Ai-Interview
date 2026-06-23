'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Target, Clock, Users,
  Code, Star, Activity, Zap,
  Briefcase, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'

function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    const duration = 2000; const steps = 60; const increment = parseInt(value) / steps; let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= parseInt(value)) { setCount(parseInt(value)); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Weekly')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics")
        const data = await res.json()
        if (data.success) {
          setAnalyticsData(data)
        }
      } catch (err) {
        console.error("Failed to load analytics:", err)
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

  const statCards = [
    { label: 'Total Interviews', value: totalInterviews, icon: Briefcase, change: `+${Math.min(totalInterviews, 5)}`, color: '#dceeb1' },
    { label: 'Average Score', value: `${averageScore}%`, icon: Target, change: `+${Math.min(Math.round(averageScore * 0.05), 10)}%`, color: '#c5b0f4' },
    { label: 'Current Streak', value: `${currentStreak} days`, icon: Activity, change: '+2', color: '#f4ecd6' },
    { label: 'Skills Mastered', value: `${skillsMastered}`, icon: Star, change: '+3', color: '#c8e6cd' },
  ]

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-foreground/50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
            <span className="text-sm">Loading analytics...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        <h1 className="text-headline text-foreground">Analytics</h1>
        <p className="mt-1 text-body text-foreground/40">Track your interview performance over time</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            className="rounded-lg border border-border bg-background p-4"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              <stat.icon className="h-5 w-5 text-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stat.label === 'Average Score' || stat.label === 'Current Streak' || stat.label === 'Skills Mastered' ? stat.value : <AnimatedCounter value={stat.value} />}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-body-sm text-foreground/40">{stat.label}</p>
              <span className="text-body-sm font-medium text-foreground/60">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-card-title text-foreground">Performance Chart</h2>
              <p className="text-body-sm text-foreground/40">Score trend over time</p>
            </div>
            <div className="flex gap-2">
              {['Weekly', 'Monthly'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'rounded-pill px-4 py-1.5 text-body-sm font-medium transition-all',
                    activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/60 hover:bg-border'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: '200px' }}>
            {weeklyData.map((d, i) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
                className="group relative flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative w-full" style={{ height: '160px' }}>
                  <div className="absolute bottom-0 left-0 right-0 h-full rounded-md bg-secondary" />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${d.value}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                    className="absolute bottom-0 left-0 right-0 rounded-md bg-primary transition-all duration-300"
                    style={{ minHeight: '12px' }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-body-sm text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {d.value}%
                    </div>
                  </motion.div>
                </div>
                <span className="text-body-sm font-medium text-foreground/40">{d.day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <div>
            <h2 className="text-card-title text-foreground">Skill Breakdown</h2>
            <p className="text-body-sm text-foreground/40">Your proficiency across skills</p>
          </div>
          <div className="mt-6 space-y-4">
            {skillData.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-body-sm text-foreground">{skill.name}</span>
                  <span className="text-body-sm font-medium text-foreground">{skill.score}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 1, delay: 0.45 + i * 0.06, ease: 'easeOut' }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <div>
            <h2 className="text-card-title text-foreground">Score Distribution</h2>
            <p className="text-body-sm text-foreground/40">How your scores are distributed</p>
          </div>
          <div className="mt-6 space-y-3">
            {scoreDistribution.map((item, i) => (
              <motion.div
                key={item.range}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="w-20 text-body-sm text-foreground/60">{item.range}</span>
                <div className="flex-1 h-6 rounded-md bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalInterviews > 0 ? (item.count / totalInterviews) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                    className="h-full rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <span className="w-8 text-right text-body-sm font-medium text-foreground">{item.count}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <div>
            <h2 className="text-card-title text-foreground">Improvement Suggestions</h2>
            <p className="text-body-sm text-foreground/40">Areas to focus on</p>
          </div>
          <div className="mt-6 space-y-3">
            {improvements.map((item, i) => (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                className="rounded-md border border-border bg-background p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {item.icon && typeof item.icon === 'string' ? (
                      (() => { const IconMap = { Code, Users, Clock, MessageSquare }; const Ic = IconMap[item.icon] || Code; return <Ic className="h-4 w-4 text-foreground" /> })()
                    ) : (
                      <item.icon className="h-4 w-4 text-foreground" />
                    )}
                    <span className="text-body-sm font-medium text-foreground">{item.area}</span>
                  </div>
                  <span className={cn(
                    'rounded-pill px-2 py-0.5 text-body-sm font-medium',
                    item.impact === 'High' ? 'bg-block-pink text-foreground' : 'bg-block-cream text-foreground'
                  )}>
                    {item.impact}
                  </span>
                </div>
                <p className="text-body-sm text-foreground/50 ml-6">{item.suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
