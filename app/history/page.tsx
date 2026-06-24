'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  History, Search, Filter, ArrowUpDown, Clock, Target,
  TrendingUp, Award, Zap, Brain, Code, Briefcase,
  PlayCircle, CheckCircle, ArrowRight, Menu,
  ChevronRight, Bot, Trophy, Flame,
  Lightbulb, Download, Layers,
  Server, Database, Users as UsersIcon, MessageCircle, Crown,
  BarChart3, MessageSquare, Sparkles, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

const achievements = [
  { name: 'Top Performer', icon: Trophy, description: 'Scored 90%+ in 5 interviews', color: 'from-[#FFD700] to-[#FFA500]' },
  { name: '7 Day Streak', icon: Flame, description: 'Practiced for 7 consecutive days', color: 'from-[#FF4D9D] to-[#FF6BCB]' },
  { name: 'Fast Learner', icon: Zap, description: 'Improved by 15% in 2 weeks', color: 'from-[#60A5FA] to-[#3B82F6]' },
  { name: 'Consistent', icon: Award, description: 'Completed 30+ interviews', color: 'from-[#34D399] to-[#22C55E]' },
  { name: 'High Confidence', icon: Crown, description: 'Scored 90+ in communication', color: 'from-[#C084FC] to-[#8B5CF6]' },
]

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
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
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

function ProgressBar({ value, label, delay = 0, showValue = true, color }: { value: number; label?: string; delay?: number; showValue?: boolean; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm text-[#6b6a7a]">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-[#0a0a0f]">{value}%</span>}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-[#f0eeff]">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay: delay * 0.1, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            color || 'bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]'
          )}
        />
      </div>
    </div>
  )
}

interface Interview {
  _id: string
  company?: string
  role?: string
  type?: string
  date?: string
  duration?: number
  difficulty?: string
  status?: string
  overallScore?: number
  [key: string]: unknown
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Newest')
  const [historyData, setHistoryData] = useState<Interview[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/interview/history')
        const data = await res.json()
        if (data.success) {
          setHistoryData(data.interviews)
        }
      } catch (err) {
        console.error('Failed to load history:', err)
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
    { label: 'Total Interviews', value: totalInterviews, suffix: '', icon: Briefcase, accent: '#dceeb1', gradient: 'from-[#dceeb1]/40 to-[#dceeb1]/10' },
    { label: 'Average Score', value: averageScore, suffix: '%', icon: Target, accent: '#c5b0f4', gradient: 'from-[#c5b0f4]/40 to-[#c5b0f4]/10' },
    { label: 'Highest Score', value: highestScore, suffix: '%', icon: Award, accent: '#f4ecd6', gradient: 'from-[#f4ecd6]/40 to-[#f4ecd6]/10' },
    { label: 'Success Rate', value: successRate, suffix: '%', icon: TrendingUp, accent: '#c8e6cd', gradient: 'from-[#c8e6cd]/40 to-[#c8e6cd]/10' },
    { label: 'Practice Hours', value: Math.round(totalDuration / 60), suffix: 'h', icon: Clock, accent: '#efd4d4', gradient: 'from-[#efd4d4]/40 to-[#efd4d4]/10' },
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyPerformance = weekDays.map(day => {
    const dayInterviews = interviews.filter(i => {
      const d = new Date(i.date || '')
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
    { name: 'DSA', score: Math.min(averageScore + 10, 100), improvement: '+12%', icon: Code },
    { name: 'React', score: Math.min(averageScore + 7, 100), improvement: '+8%', icon: Layers },
    { name: 'Backend', score: Math.max(averageScore - 3, 0), improvement: '+5%', icon: Server },
    { name: 'DBMS', score: Math.max(averageScore - 8, 0), improvement: '+3%', icon: Database },
    { name: 'OOPs', score: Math.min(averageScore + 5, 100), improvement: '+10%', icon: Layers },
    { name: 'HR Questions', score: Math.max(averageScore - 12, 0), improvement: '-2%', icon: UsersIcon },
    { name: 'Communication', score: Math.max(averageScore - 6, 0), improvement: '+6%', icon: MessageCircle },
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
    if (selectedSort === 'Newest') return new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
    if (selectedSort === 'Oldest') return new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
    if (selectedSort === 'Highest Score') return (b.overallScore || 0) - (a.overallScore || 0)
    if (selectedSort === 'Lowest Score') return (a.overallScore || 0) - (b.overallScore || 0)
    return 0
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#22C55E] bg-[#22C55E]/10'
    if (score >= 80) return 'text-[#8B5CF6] bg-[#8B5CF6]/10'
    if (score >= 70) return 'text-[#F59E0B] bg-[#F59E0B]/10'
    return 'text-[#EF4444] bg-[#EF4444]/10'
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed': return 'bg-[#22C55E]/10 text-[#22C55E]'
      case 'In Progress': return 'bg-[#3B82F6]/10 text-[#3B82F6]'
      case 'Failed': return 'bg-[#EF4444]/10 text-[#EF4444]'
      default: return 'bg-[#f0eeff] text-[#6b6a7a]'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Hard': return 'bg-[#EF4444]/10 text-[#EF4444]'
      case 'Medium': return 'bg-[#F59E0B]/10 text-[#F59E0B]'
      case 'Easy': return 'bg-[#22C55E]/10 text-[#22C55E]'
      default: return 'bg-[#f0eeff] text-[#6b6a7a]'
    }
  }

  const companyGradients = [
    'from-[#FF4D9D] to-[#FF6BCB]',
    'from-[#C084FC] to-[#8B5CF6]',
    'from-[#60A5FA] to-[#3B82F6]',
    'from-[#34D399] to-[#22C55E]',
    'from-[#F59E0B] to-[#F97316]',
    'from-[#EC4899] to-[#DB2777]',
  ]

  return (
    <div className="flex min-h-screen bg-[#fcfcff]">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <DashboardSidebar
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={cn(
        'flex flex-1 flex-col transition-all duration-300',
        sidebarOpen ? 'lg:ml-60' : 'lg:ml-[72px]'
      )}>
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e8e7f0] bg-white/80 backdrop-blur-xl px-4 lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6a7a] hover:bg-[#f0eeff]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]">
              <History className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#0a0a0f]">MockAI</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm lg:p-8"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#FF4D9D]/10 to-[#8B5CF6]/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#C084FC]/10 to-[#FF6BCB]/10 blur-3xl" />
              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#8B5CF6]">
                    Interview History
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0f] lg:text-4xl">
                      Your Interview Journey
                    </h1>
                    <p className="mt-1.5 text-base text-[#6b6a7a]">
                      {loading ? (
                        'Loading your progress...'
                      ) : (
                        <>
                          Track your progress across{' '}
                          <span className="font-semibold text-[#0a0a0f]">{totalInterviews} interviews</span>{' '}
                          with an average score of{' '}
                          <span className="font-semibold text-[#0a0a0f]">{averageScore}%</span>
                        </>
                      )}
                    </p>
                  </div>
                  <Link
                    href="/interview"
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C084FC]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>New Interview</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(192, 132, 252, 0.15)' }}
                  className="group relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#C084FC]/30 hover:shadow-xl hover:shadow-[#C084FC]/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundImage: `linear-gradient(135deg, ${stat.gradient})` }} />
                  <div className="relative z-10">
                    <div className="mb-3 inline-flex rounded-xl p-2.5" style={{ backgroundColor: stat.accent + '20' }}>
                      <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-[#0a0a0f] lg:text-3xl">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="mt-1 text-sm text-[#6b6a7a]">{stat.label}</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20" style={{ backgroundColor: stat.accent }} />
                </motion.div>
              ))}
            </div>

            {/* Filters & Sort */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                        activeFilter === filter
                          ? 'bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] text-white shadow-md shadow-[#C084FC]/25'
                          : 'border border-[#e8e7f0] bg-white text-[#6b6a7a] hover:bg-[#f5f0ff] hover:text-[#0a0a0f] hover:border-[#C084FC]/30'
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a0a0b0]" />
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="h-10 appearance-none rounded-full border border-[#e8e7f0] bg-white pl-10 pr-10 text-sm text-[#6b6a7a] focus:border-[#C084FC] focus:outline-none focus:ring-2 focus:ring-[#C084FC]/20 cursor-pointer"
                  >
                    {sorts.map((sort) => (
                      <option key={sort} value={sort}>{sort}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Interview History Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#e8e7f0] px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Recent Interview History</h2>
                  <p className="text-sm text-[#6b6a7a]">Complete record of all your interviews</p>
                </div>
                <span className="hidden rounded-full bg-[#f0eeff] px-3 py-1 text-xs font-medium text-[#6b6a7a] sm:inline-block">
                  {sortedInterviews.length} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e8e7f0]">
                      {['Company', 'Role', 'Type', 'Date', 'Duration', 'Difficulty', 'Score', 'Status', ''].map((h) => (
                        <th key={h} className={cn(
                          'px-4 py-3.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#a0a0b0]',
                          h === 'Score' && 'text-center',
                          h === '' && 'text-right'
                        )}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedInterviews.map((row, i) => (
                      <motion.tr
                        key={row._id || `${row.company}-${row.date}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                        className="group border-b border-[#f0eeff] transition-colors last:border-0 hover:bg-[#faf9ff]"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm',
                              companyGradients[i % companyGradients.length]
                            )}>
                              {(row.company || 'G').charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-[#0a0a0f]">{row.company || 'General'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#6b6a7a]">{row.role || 'Software Engineer'}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-lg bg-[#f0eeff] px-2.5 py-1 text-xs font-medium text-[#6b6a7a]">
                            {row.type || 'Technical'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#6b6a7a]">{formatDate(row.date)}</td>
                        <td className="px-4 py-4 text-sm text-[#6b6a7a]">{row.duration ? `${row.duration} min` : '—'}</td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            'inline-block rounded-lg px-2.5 py-1 text-xs font-semibold',
                            getDifficultyColor(row.difficulty)
                          )}>
                            {row.difficulty || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn(
                            'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold',
                            getScoreColor(row.overallScore || 0)
                          )}>
                            {row.overallScore || 0}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                            getStatusColor(row.status)
                          )}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {row.status || 'Completed'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Link
                              href={`/feedback?id=${row._id}`}
                              className="rounded-full border border-[#e8e7f0] bg-white px-3 py-1.5 text-xs font-medium text-[#6b6a7a] transition-all hover:border-[#C084FC]/30 hover:bg-[#f5f0ff] hover:text-[#8B5CF6]"
                            >
                              Feedback
                            </Link>
                            <Link
                              href="/interview"
                              className="rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:shadow-[#C084FC]/25"
                            >
                              Retry
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {sortedInterviews.length === 0 && !loading && (
                      <tr>
                        <td colSpan={9} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eeff]">
                              <History className="h-7 w-7 text-[#a0a0b0]" />
                            </div>
                            <p className="text-sm font-medium text-[#6b6a7a]">No interviews found</p>
                            <p className="text-xs text-[#a0a0b0]">Complete your first interview to see it here.</p>
                            <Link
                              href="/interview"
                              className="mt-2 rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-md"
                            >
                              Start Interview
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Weekly Performance + Score Comparison */}
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Weekly Performance</h2>
                    <p className="text-sm text-[#6b6a7a] mt-0.5">Score trend over the last 7 days</p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                    <BarChart3 className="h-4.5 w-4.5 text-[#8B5CF6]" />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2" style={{ height: '180px' }}>
                  {weeklyPerformance.map((day, i) => {
                    const maxVal = Math.max(...weeklyPerformance.map(d => d.value), 1)
                    const heightPct = (day.value / maxVal) * 100
                    return (
                      <div key={day.day} className="group relative flex flex-1 flex-col items-center gap-2">
                        <div className="relative w-full rounded-xl" style={{ height: '140px' }}>
                          <div className="absolute bottom-0 left-0 right-0 h-full rounded-xl bg-[#f0eeff]" />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(heightPct, 8)}%` }}
                            transition={{ duration: 0.8, delay: 0.35 + i * 0.05, ease: 'easeOut' }}
                            className="absolute bottom-0 left-[10%] right-[10%] rounded-t-xl bg-gradient-to-t from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/20 transition-all duration-300"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0a0a0f] px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                              {day.value}%
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs font-medium text-[#a0a0b0]">{day.day}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Score Comparison</h2>
                    <p className="text-sm text-[#6b6a7a] mt-0.5">Above average performance</p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                    <TrendingUp className="h-4.5 w-4.5 text-[#22C55E]" />
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f5f0ff] to-[#f0eeff] p-5">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#C084FC]/20 to-[#8B5CF6]/20 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1">
                      <TrendingUp className="h-3.5 w-3.5 text-[#22C55E]" />
                      <span className="text-xs font-semibold text-[#22C55E]">Above Average</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#6b6a7a]">
                      Your score of{' '}
                      <span className="font-bold text-[#0a0a0f]">{averageScore}%</span>{' '}
                      is{' '}
                      <span className="font-bold text-[#22C55E]">
                        {Math.max(averageScore - 72, 0)}% higher
                      </span>{' '}
                      than the average candidate. You&apos;re in the{' '}
                      <span className="font-bold text-[#8B5CF6]">Top {Math.max(100 - averageScore, 5)}%</span>{' '}
                      of all users.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-[#e8e7f0] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${averageScore}%` }}
                          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]"
                        />
                      </div>
                      <span className="text-xs font-bold text-[#0a0a0f]">{averageScore}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Interview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Interview Cards</h2>
                  <p className="text-sm text-[#6b6a7a] mt-0.5">Quick overview of your recent interviews</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {interviewCards.map((card, i) => (
                  <motion.div
                    key={card._id || card.company}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 + i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-5 transition-all duration-300 hover:border-[#C084FC]/30 hover:shadow-xl hover:shadow-[#C084FC]/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#C084FC]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <div className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-sm',
                          companyGradients[i % companyGradients.length]
                        )}>
                          {card.company.charAt(0)}
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {card.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#0a0a0f]">{card.company}</h3>
                      <p className="text-sm text-[#6b6a7a]">{card.role}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="rounded-lg bg-[#f0eeff] px-2.5 py-1 text-xs font-medium text-[#6b6a7a]">
                          {card.mode}
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-[#0a0a0f]">{card.score}</span>
                          <span className="text-sm text-[#a0a0b0]">%</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/feedback?id=${card._id}`}
                          className="flex-1 rounded-full border border-[#e8e7f0] bg-white py-2 text-center text-xs font-medium text-[#6b6a7a] transition-all hover:border-[#C084FC]/30 hover:bg-[#f5f0ff] hover:text-[#8B5CF6]"
                        >
                          Feedback
                        </Link>
                        <Link
                          href="/interview"
                          className="flex-1 rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] py-2 text-center text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:shadow-[#C084FC]/25"
                        >
                          Retry
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skill Performance Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Skill Performance Breakdown</h2>
                  <p className="text-sm text-[#6b6a7a] mt-0.5">Your proficiency across all domains</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {skillsBreakdown.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.55 + i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="group rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-5 transition-all duration-300 hover:border-[#C084FC]/30 hover:shadow-lg hover:shadow-[#C084FC]/10"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eeff] transition-colors group-hover:bg-[#e8e5ff]">
                        <skill.icon className="h-5 w-5 text-[#8B5CF6]" />
                      </div>
                      <span className={cn(
                        'rounded-lg px-2 py-0.5 text-xs font-bold',
                        skill.improvement.startsWith('+')
                          ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : 'bg-[#EF4444]/10 text-[#EF4444]'
                      )}>
                        {skill.improvement}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0a0a0f]">{skill.name}</h3>
                    <div className="mt-3">
                      <ProgressBar value={skill.score} showValue />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Recommendations + Learning Path */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">AI Recommendations</h2>
                  <p className="text-sm text-[#6b6a7a] mt-0.5">Personalized suggestions based on your performance</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  {aiRecommendations.map((rec, i) => (
                    <motion.div
                      key={rec.area}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="group rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-4 transition-all duration-200 hover:border-[#C084FC]/30 hover:shadow-md hover:shadow-[#C084FC]/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0eeff] transition-colors group-hover:bg-[#e8e5ff]">
                            <Lightbulb className="h-4 w-4 text-[#8B5CF6]" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-[#0a0a0f]">{rec.area}</span>
                            <p className="mt-0.5 text-xs text-[#a0a0b0]">{rec.weakness}</p>
                            <p className="mt-1 text-xs font-medium text-[#8B5CF6]">{rec.action}</p>
                          </div>
                        </div>
                        <span className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                          rec.priority === 'High'
                            ? 'bg-[#EF4444]/10 text-[#EF4444]'
                            : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        )}>
                          {rec.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f5f0ff] to-[#f0eeff] p-5">
                    <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#C084FC]/20 to-[#FF4D9D]/20 blur-2xl" />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-[#0a0a0f]">AI Learning Path</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { step: '1', title: 'Master System Design', desc: 'Complete 5 case studies this week', done: false },
                          { step: '2', title: 'Refine Behavioral Stories', desc: 'Record 10 STAR method answers', done: false },
                          { step: '3', title: 'Practice DSA Hard Problems', desc: 'Solve 20 LeetCode hard questions', done: false },
                          { step: '4', title: 'Full Mock Interview', desc: 'Take a complete timed interview', done: false },
                        ].map((step, i) => (
                          <motion.div
                            key={step.title}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 + i * 0.08 }}
                            className="flex items-start gap-3"
                          >
                            <div className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-all',
                              step.done
                                ? 'bg-gradient-to-br from-[#22C55E] to-[#34D399] text-white'
                                : 'bg-white text-[#0a0a0f] border border-[#e8e7f0]'
                            )}>
                              {step.done ? <CheckCircle className="h-4 w-4" /> : step.step}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#0a0a0f]">{step.title}</p>
                              <p className="text-xs text-[#a0a0b0]">{step.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/interview"
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C084FC]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/40"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <PlayCircle className="h-4 w-4 relative" />
                    <span className="relative">Start Recommended Practice</span>
                    <ArrowRight className="h-4 w-4 relative transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Achievements & Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Achievements & Badges</h2>
                  <p className="text-sm text-[#6b6a7a] mt-0.5">Milestones you&apos;ve unlocked on your journey</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {achievements.map((badge, i) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.65 + i * 0.06 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#C084FC]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-all duration-300 group-hover:opacity-20" style={{ backgroundImage: `linear-gradient(135deg, ${badge.color.replace('from-', '').replace('to-', '').replace(/\[|\]/g, '')})` }} />
                    <div className="relative z-10">
                      <div className={cn(
                        'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110',
                        badge.color
                      )}>
                        <badge.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-[#0a0a0f]">{badge.name}</h3>
                      <p className="mt-1 text-xs text-[#a0a0b0] leading-relaxed">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Quick Actions</h2>
                  <p className="text-sm text-[#6b6a7a] mt-0.5">Jump to your next step</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Start New Interview', desc: 'Begin a fresh mock interview', icon: PlayCircle, href: '/interview', gradient: 'from-[#FF4D9D] to-[#FF6BCB]' },
                  { label: 'View Feedback', desc: 'Review your latest results', icon: MessageSquare, href: '/feedback', gradient: 'from-[#C084FC] to-[#8B5CF6]' },
                  { label: 'Download Reports', desc: 'Export your interview history', icon: Download, href: '#', gradient: 'from-[#60A5FA] to-[#3B82F6]' },
                  { label: 'Go to Dashboard', desc: 'View full analytics overview', icon: BarChart3, href: '/dashboard', gradient: 'from-[#34D399] to-[#22C55E]' },
                ].map((action, i) => (
                  <Link key={action.label} href={action.href}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[#C084FC]/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#C084FC]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative z-10">
                        <div className={cn(
                          'mb-3 inline-flex rounded-xl bg-gradient-to-br p-2.5 shadow-sm',
                          action.gradient
                        )}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0a0a0f]">{action.label}</h4>
                        <p className="mt-0.5 text-xs text-[#a0a0b0]">{action.desc}</p>
                      </div>
                      <div className={cn(
                        'absolute -right-6 -bottom-6 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20',
                        action.gradient
                      )} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <div className="h-6" />
          </div>
        </main>
      </div>
    </div>
  )
}
