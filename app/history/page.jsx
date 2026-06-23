'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  History, Search, Filter, ArrowUpDown, Clock, Target,
  TrendingUp, Award, Zap, Brain, Code, Briefcase,
  PlayCircle, CheckCircle, ArrowRight,
  ChevronRight, Bot, Trophy, Flame,
  Lightbulb, Download, Layers,
  Server, Database, Users as UsersIcon, MessageCircle, Crown,
  BarChart3, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { FigmaButton } from '@/components/ui/figma-button'

const achievements = [
  { name: 'Top Performer', icon: Trophy, description: 'Scored 90%+ in 5 interviews' },
  { name: '7 Day Streak', icon: Flame, description: 'Practiced for 7 consecutive days' },
  { name: 'Fast Learner', icon: Zap, description: 'Improved by 15% in 2 weeks' },
  { name: 'Consistent', icon: Award, description: 'Completed 30+ interviews' },
  { name: 'High Confidence', icon: Crown, description: 'Scored 90+ in communication' },
]

function AnimatedCounter({ value, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    const duration = 2000; const steps = 60; const increment = value / steps; let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])
  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-card-title text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-body-sm text-foreground/40">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group flex items-center gap-1 text-body-sm text-foreground/60 transition-colors hover:text-foreground">
          {action.label}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

function ProgressBar({ value, label, delay = 0, showValue = true }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-foreground/60">{label}</span>
        {showValue && <span className="text-body-sm font-medium text-foreground">{value}%</span>}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay: delay * 0.1, ease: 'easeOut' }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Newest')
  const [historyData, setHistoryData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/interview/history")
        const data = await res.json()
        if (data.success) {
          setHistoryData(data.interviews)
        }
      } catch (err) {
        console.error("Failed to load history:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const interviews = historyData || []

  const totalInterviews = interviews.length
  const averageScore = totalInterviews > 0
    ? Math.round(interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / totalInterviews)
    : 0
  const highestScore = totalInterviews > 0
    ? Math.max(...interviews.map(i => i.overallScore || 0))
    : 0
  const successCount = interviews.filter(i => (i.overallScore || 0) >= 70).length
  const successRate = totalInterviews > 0 ? Math.round((successCount / totalInterviews) * 100) : 0
  const totalDuration = interviews.reduce((s, i) => s + (i.duration || 0), 0)

  const heroStats = [
    { label: 'Total Interviews', value: totalInterviews, suffix: '', icon: Briefcase, color: '#dceeb1' },
    { label: 'Average Score', value: averageScore, suffix: '%', icon: Target, color: '#c5b0f4' },
    { label: 'Highest Score', value: highestScore, suffix: '%', icon: Award, color: '#f4ecd6' },
    { label: 'Success Rate', value: successRate, suffix: '%', icon: TrendingUp, color: '#c8e6cd' },
    { label: 'Practice Hours', value: Math.round(totalDuration / 60), suffix: 'h', icon: Clock, color: '#efd4d4' },
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyPerformance = weekDays.map(day => {
    const dayInterviews = interviews.filter(i => {
      const d = new Date(i.date)
      return weekDays[d.getDay()] === day
    })
    const avg = dayInterviews.length > 0
      ? Math.round(dayInterviews.reduce((s, iv) => s + (iv.overallScore || 0), 0) / dayInterviews.length)
      : 0
    return { day, value: avg }
  })

  const interviewCards = interviews.slice(0, 6).map(i => ({
    company: i.company || i.type || 'General',
    role: i.role || 'Software Engineer',
    score: i.overallScore || 0,
    status: i.status || 'Completed',
    mode: i.type || 'Technical',
    _id: i._id,
  }))

  const skillsBreakdown = [
    { name: 'DSA', score: averageScore > 0 ? Math.min(averageScore + 10, 100) : 0, improvement: '+12%', icon: Code },
    { name: 'React', score: averageScore > 0 ? Math.min(averageScore + 7, 100) : 0, improvement: '+8%', icon: Layers },
    { name: 'Backend', score: averageScore > 0 ? Math.max(averageScore - 3, 0) : 0, improvement: '+5%', icon: Server },
    { name: 'DBMS', score: averageScore > 0 ? Math.max(averageScore - 8, 0) : 0, improvement: '+3%', icon: Database },
    { name: 'OOPs', score: averageScore > 0 ? Math.min(averageScore + 5, 100) : 0, improvement: '+10%', icon: Layers },
    { name: 'HR Questions', score: averageScore > 0 ? Math.max(averageScore - 12, 0) : 0, improvement: '-2%', icon: UsersIcon },
    { name: 'Communication', score: averageScore > 0 ? Math.max(averageScore - 6, 0) : 0, improvement: '+6%', icon: MessageCircle },
  ]

  const aiRecommendations = [
    { area: 'System Design', weakness: 'Low confidence in distributed systems', action: 'Practice with 5+ case studies', priority: 'High' },
    { area: 'Behavioral', weakness: 'STAR method needs refinement', action: 'Record 10 STAR practice answers', priority: 'High' },
    { area: 'DBMS', weakness: 'Query optimization weak', action: 'Complete SQL advanced course', priority: 'Medium' },
    { area: 'Time Management', weakness: 'Running over time on coding', action: 'Use timer for all practices', priority: 'Medium' },
  ]

  const filters = ['All', 'Technical', 'Behavioral', 'System Design', 'Mixed']
  const sorts = ['Newest', 'Oldest', 'Highest Score', 'Lowest Score']

  const filteredInterviews = activeFilter === 'All'
    ? interviews
    : interviews.filter(i => (i.type || 'Technical') === activeFilter)

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (selectedSort === 'Newest') return new Date(b.date) - new Date(a.date)
    if (selectedSort === 'Oldest') return new Date(a.date) - new Date(b.date)
    if (selectedSort === 'Highest Score') return (b.overallScore || 0) - (a.overallScore || 0)
    if (selectedSort === 'Lowest Score') return (a.overallScore || 0) - (b.overallScore || 0)
    return 0
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        <h1 className="text-headline text-foreground">Your Interview Journey</h1>
        <p className="mb-8 text-body text-foreground/50">
          {loading ? 'Loading your progress...' : (
            <>Track your progress across <span className="font-semibold text-foreground">{totalInterviews} interviews</span> with an average score of <span className="font-semibold text-foreground">{averageScore}%</span></>
          )}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="rounded-lg border border-border bg-background p-4"
              style={{ borderLeft: `4px solid ${stat.color}` }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <stat.icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-body-sm text-foreground/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'rounded-pill px-4 py-2 text-body-sm font-medium transition-all duration-200',
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background text-foreground/50 hover:bg-secondary hover:text-foreground'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="h-10 appearance-none rounded-pill border border-border bg-background pl-9 pr-10 text-body-sm text-foreground/70 focus:border-foreground/30 focus:outline-none"
            >
              {sorts.map((sort) => (
                <option key={sort} value={sort} className="bg-background text-foreground">{sort}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Recent Interview History" subtitle="Complete record of all your interviews" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Company</th>
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Role</th>
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Type</th>
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Date</th>
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Duration</th>
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Difficulty</th>
                <th className="pb-3 text-center text-eyebrow text-foreground/40">Score</th>
                <th className="pb-3 text-left text-eyebrow text-foreground/40">Status</th>
                <th className="pb-3 text-right text-eyebrow text-foreground/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedInterviews.map((row, i) => (
                <motion.tr
                  key={`${row.company}-${row.date}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                  className="border-b border-muted transition-colors last:border-0 hover:bg-secondary"
                >
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-bold text-foreground">{row.company.charAt(0)}</div>
                      <span className="text-body-sm font-medium text-foreground">{row.company}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-body-sm text-foreground/50">{row.role}</td>
                  <td className="py-3.5">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-body-sm text-foreground/50">{row.type}</span>
                  </td>
                  <td className="py-3.5 text-body-sm text-foreground/50">{formatDate(row.date)}</td>
                  <td className="py-3.5 text-body-sm text-foreground/50">{row.duration ? `${row.duration} min` : 'N/A'}</td>
                  <td className="py-3.5">
                    <span className={cn(
                      'rounded-md px-2 py-0.5 text-body-sm font-medium',
                      row.difficulty === 'Hard' ? 'bg-block-pink text-foreground' :
                      row.difficulty === 'Medium' ? 'bg-block-cream text-foreground' : 'bg-block-mint text-foreground'
                    )}>
                      {row.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={cn(
                      'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-body-sm font-semibold',
                      (row.overallScore || 0) >= 90 ? 'bg-block-mint text-foreground' :
                      (row.overallScore || 0) >= 80 ? 'bg-block-lime text-foreground' :
                      (row.overallScore || 0) >= 70 ? 'bg-block-cream text-foreground' : 'bg-block-pink text-foreground'
                    )}>
                      {row.overallScore || 0}%
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-pill bg-block-mint px-2.5 py-0.5 text-body-sm font-medium text-foreground">
                      <CheckCircle className="h-3 w-3" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/feedback?id=${row._id}`} className="rounded-pill border border-border bg-background px-2.5 py-1.5 text-body-sm text-foreground/50 transition-colors hover:bg-secondary hover:text-foreground">Details</Link>
                      <Link href="/interview" className="rounded-pill bg-primary px-2.5 py-1.5 text-body-sm text-primary-foreground transition-colors hover:bg-foreground/80">Retry</Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <SectionHeader title="Weekly Performance" subtitle="Score trend over the last 7 days" />
          <div className="mt-6 flex items-end justify-between gap-2" style={{ height: '180px' }}>
            {weeklyPerformance.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.05 }}
                className="group relative flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative w-full" style={{ height: '140px' }}>
                  <div className="absolute bottom-0 left-0 right-0 h-full rounded-md bg-secondary" />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.value}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                    className="absolute bottom-0 left-0 right-0 rounded-md bg-primary transition-all duration-300"
                    style={{ minHeight: '12px' }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-body-sm text-primary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {day.value}%
                    </div>
                  </motion.div>
                </div>
                <span className="text-body-sm font-medium text-foreground/40">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <SectionHeader title="Score Comparison" subtitle="Above average performance" />
          <div className="mt-4 rounded-md bg-secondary p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-foreground" />
              <span className="text-eyebrow text-foreground">Above Average</span>
            </div>
            <p className="text-body-sm text-foreground/60">
              Your score of <span className="font-medium text-foreground">84%</span> is <span className="font-medium text-foreground">12% higher</span> than the average candidate.
              You&apos;re in the <span className="font-medium text-foreground">Top 15%</span> of all users.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Interview Cards" subtitle="Quick overview of all your interviews" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interviewCards.map((card, i) => (
            <motion.div
              key={card.company}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 + i * 0.06 }}
              className="rounded-md bg-secondary p-4 transition-colors hover:bg-border"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-background text-lg font-bold text-foreground">
                  {card.company.charAt(0)}
                </div>
                <span className="rounded-pill bg-block-mint px-2.5 py-0.5 text-body-sm font-medium text-foreground">
                  {card.status}
                </span>
              </div>
              <h3 className="text-card-title text-foreground">{card.company}</h3>
              <p className="text-body-sm text-foreground/50">{card.role}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-background px-2 py-0.5 text-body-sm text-foreground/50">{card.mode}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">{card.score}</span>
                  <span className="text-body-sm text-foreground/40">%</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/feedback?id=${card._id}`} className="flex-1 rounded-pill border border-border bg-background py-2 text-center text-body-sm text-foreground/50 transition-colors hover:bg-secondary hover:text-foreground">Feedback</Link>
                <Link href="/interview" className="flex-1 rounded-pill bg-primary py-2 text-center text-body-sm text-primary-foreground transition-colors hover:bg-foreground/80">Retry</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Skill Performance Breakdown" subtitle="Your proficiency across all domains" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillsBreakdown.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.06 }}
              className="rounded-lg border border-border bg-background p-5 transition-colors hover:bg-secondary"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                  <skill.icon className="h-5 w-5 text-foreground" />
                </div>
                <span className={cn(
                  'rounded-md px-2 py-0.5 text-body-sm font-semibold',
                  skill.improvement.startsWith('+') ? 'bg-block-mint text-foreground' :
                  skill.improvement.startsWith('-') ? 'bg-block-pink text-foreground' : 'bg-secondary text-foreground/50'
                )}>
                  {skill.improvement}
                </span>
              </div>
              <h3 className="text-body-sm font-medium text-foreground">{skill.name}</h3>
              <div className="mt-3">
                <ProgressBar value={skill.score} showValue={true} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="AI Recommendations" subtitle="Personalized suggestions based on your performance" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <motion.div
                key={rec.area}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                className="rounded-md border border-border bg-background p-4 transition-colors hover:bg-secondary"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                      <Lightbulb className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <span className="text-body-sm font-medium text-foreground">{rec.area}</span>
                  </div>
                  <span className={cn(
                    'rounded-pill px-2 py-0.5 text-body-sm font-medium',
                    rec.priority === 'High' ? 'bg-block-pink text-foreground' : 'bg-block-cream text-foreground'
                  )}>
                    {rec.priority}
                  </span>
                </div>
                <div className="ml-9 space-y-1">
                  <p className="text-body-sm text-foreground/60">Weakness: {rec.weakness}</p>
                  <p className="text-body-sm text-foreground/70">Action: {rec.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-md bg-secondary p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-5 w-5 text-foreground" />
                <span className="text-body-sm font-semibold text-foreground">AI Learning Path</span>
              </div>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Master System Design', desc: 'Complete 5 case studies this week', done: false },
                  { step: '2', title: 'Refine Behavioral Stories', desc: 'Record 10 STAR method answers', done: false },
                  { step: '3', title: 'Practice DSA Hard Problems', desc: 'Solve 20 LeetCode hard questions', done: false },
                  { step: '4', title: 'Full Mock Interview', desc: 'Take a complete timed interview', done: false },
                ].map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-body-sm font-bold',
                      step.done ? 'bg-block-mint text-foreground' : 'bg-background text-foreground'
                    )}>
                      {step.step}
                    </div>
                    <div>
                      <p className="text-body-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-body-sm text-foreground/40">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <Link
              href="/interview"
              className="group relative flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-3 text-body-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/80"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Start Recommended Practice</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Achievements & Badges" subtitle="Milestones you've unlocked on your journey" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {achievements.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.06 }}
              className="rounded-md bg-secondary p-6 text-center transition-colors hover:bg-border"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-background">
                <badge.icon className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="text-body-sm font-semibold text-foreground">{badge.name}</h3>
              <p className="mt-1 text-body-sm text-foreground/40">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Quick Actions" subtitle="Jump to your next step" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/interview">
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <PlayCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Start New Interview</h4>
              <p className="mt-1 text-body-sm text-foreground/40">Begin a fresh mock interview</p>
            </motion.div>
          </Link>
          <Link href="/feedback">
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">View Feedback</h4>
              <p className="mt-1 text-body-sm text-foreground/40">Review your latest results</p>
            </motion.div>
          </Link>
          <button>
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Download Reports</h4>
              <p className="mt-1 text-body-sm text-foreground/40">Export your interview history</p>
            </motion.div>
          </button>
          <Link href="/dashboard">
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Go to Dashboard</h4>
              <p className="mt-1 text-body-sm text-foreground/40">View full analytics overview</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </AppShell>
  )
}
