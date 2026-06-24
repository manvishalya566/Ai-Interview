'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, CheckCircle,
  XCircle, TrendingUp, Zap, Brain, Code, BookOpen,
  Clock, Target, Sparkles, Download, Share2, RotateCcw,
  PlayCircle, ChevronDown, AlertCircle, Menu,
  Lightbulb, LineChart, Activity, Calendar,
  Mic, Eye, MessageCircle, Bot, ArrowRight,
  BarChart3, Users, PieChart, MessageSquare,
  Trophy, Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

const IconsMap: Record<string, typeof MessageCircle> = {
  MessageCircle, Code, Star, Brain, Mic, Eye,
  CheckCircle, Target, Users, Clock, Zap,
  PieChart, Activity, PlayCircle, BarChart3,
}

interface QuestionFeedback {
  id: number
  question?: string
  score?: number
  userAnswer?: string
  aiFeedback?: string
  correctApproach?: string
  improvement?: string
}

interface TimelineEvent {
  title?: string
  description?: string
  time?: string
  icon: typeof PlayCircle
}

interface SkillBreakdownItem {
  name?: string
  score?: number
  readiness?: number
  improvement?: string
  trend?: string
  icon: typeof Code
}

interface QuickStat {
  label?: string
  value?: string
  icon?: string
}

interface Interview {
  _id?: string
  company?: string
  role?: string
  date?: string
  duration?: number
  overallScore?: number
  performanceMetrics?: Array<{ label: string; value: number }>
  strengths?: string[]
  weaknesses?: string[]
  aiSuggestions?: string[]
  recommendedTopics?: Array<{ name: string; priority: string }>
  questionFeedback?: Array<Record<string, unknown>>
  timelineEvents?: Array<Record<string, unknown>>
  skillBreakdown?: Array<Record<string, unknown>>
  weeklyPerformance?: Array<{ day: string; score: number }>
  quickStats?: QuickStat[]
  questions?: unknown[]
}

function ProgressBar({ value, label, delay = 0, color }: { value: number; label?: string; delay?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6b6a7a]">{label}</span>
        <span className="text-sm font-semibold text-[#0a0a0f]">{value}%</span>
      </div>
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

function StatCard({ icon: Icon, value, label, index = 0 }: { icon: typeof Zap; value: string; label: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-4 text-center transition-all duration-200 hover:border-[#C084FC]/30 hover:shadow-lg hover:shadow-[#C084FC]/10"
    >
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0eeff]">
        <Icon className="h-4.5 w-4.5 text-[#8B5CF6]" />
      </div>
      <p className="text-lg font-bold text-[#0a0a0f]">{value}</p>
      <p className="text-xs text-[#a0a0b0] mt-0.5">{label}</p>
    </motion.div>
  )
}

function QuestionCard({ question, index }: { question: QuestionFeedback; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl border border-[#e8e7f0] bg-white overflow-hidden transition-all duration-200 hover:border-[#C084FC]/30"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-start justify-between text-left gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] px-2.5 py-0.5 text-xs font-bold text-white">
              Q{question.id}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold',
              (question.score || 0) >= 90 ? 'bg-[#22C55E]/10 text-[#22C55E]' :
              (question.score || 0) >= 75 ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' :
              'bg-[#F59E0B]/10 text-[#F59E0B]'
            )}>
              <Star className="h-3 w-3" />
              {question.score}%
            </span>
          </div>
          <p className="text-sm font-medium text-[#0a0a0f] leading-relaxed">{question.question}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0eeff]"
        >
          <ChevronDown className="h-4 w-4 text-[#6b6a7a]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[#e8e7f0] pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-[#faf9ff] p-4 border border-[#e8e7f0]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#f0eeff]">
                      <Bot className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#6b6a7a]">Your Answer</span>
                  </div>
                  <p className="text-sm text-[#6b6a7a] leading-relaxed">{question.userAnswer}</p>
                </div>
                <div className="rounded-xl bg-[#faf9ff] p-4 border border-[#e8e7f0]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#f0eeff]">
                      <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#6b6a7a]">AI Feedback</span>
                  </div>
                  <p className="text-sm text-[#6b6a7a] leading-relaxed">{question.aiFeedback}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gradient-to-br from-[#22C55E]/5 to-[#22C55E]/10 p-4 border border-[#22C55E]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#22C55E]/10">
                      <Lightbulb className="h-3.5 w-3.5 text-[#22C55E]" />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#22C55E]">Correct Approach</span>
                  </div>
                  <p className="text-sm text-[#6b6a7a] leading-relaxed">{question.correctApproach}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#8B5CF6]/5 to-[#8B5CF6]/10 p-4 border border-[#8B5CF6]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
                      <TrendingUp className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#8B5CF6]">Improvement Tip</span>
                  </div>
                  <p className="text-sm text-[#6b6a7a] leading-relaxed">{question.improvement}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FeedbackPageContent() {
  const searchParams = useSearchParams()
  const interviewId = searchParams.get('id')
  const [feedback, setFeedback] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeedback() {
      try {
        if (!interviewId) { setLoading(false); return }
        const res = await fetch(`/api/feedback/${interviewId}`)
        const data = await res.json()
        if (data.success) {
          setFeedback(data.interview)
        }
      } catch (err) {
        console.error('Failed to load feedback:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [interviewId])

  const interview: Interview | null = feedback

  const performanceMetrics = interview?.performanceMetrics?.filter(m => m.value != null) || []
  const strengths = interview?.strengths || []
  const weaknesses = interview?.weaknesses || []
  const aiSuggestions = interview?.aiSuggestions || []
  const recommendedTopics = interview?.recommendedTopics || []

  const questionReviews: QuestionFeedback[] = interview?.questionFeedback?.length
    ? interview.questionFeedback.map((qf, idx) => ({ ...qf, id: idx + 1 } as QuestionFeedback))
    : []

  const timelineEvents: TimelineEvent[] = interview?.timelineEvents?.length
    ? interview.timelineEvents.map(te => ({
        ...te,
        icon: IconsMap[(te as Record<string, string>).icon] || PlayCircle,
      } as TimelineEvent))
    : []

  const skillBreakdown: SkillBreakdownItem[] = interview?.skillBreakdown?.length
    ? interview.skillBreakdown.map(sb => ({
        ...sb,
        icon: IconsMap[(sb as Record<string, string>).icon] || Code,
      } as SkillBreakdownItem))
    : []

  const weeklyPerformance = interview?.weeklyPerformance || []
  const quickStats: QuickStat[] = interview?.quickStats || []

  const overallScore = interview?.overallScore
  const company = interview?.company
  const role = interview?.role
  const dateStr = interview?.date
    ? new Date(interview.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const duration = interview?.duration ? `${interview.duration} min` : null
  const questionsTotal = interview?.questions?.length || 0

  const [notification, setNotification] = useState<string | null>(null)

  const handleShare = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Interview Feedback', text: 'Check out my interview feedback!', url })
        setNotification('Shared successfully!')
      } catch {
        await navigator.clipboard.writeText(url)
        setNotification('Link copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(url)
      setNotification('Link copied to clipboard!')
    }
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const handleDownload = useCallback(() => {
    if (!interviewId) return
    window.location.href = `/api/feedback/${interviewId}/report`
  }, [interviewId])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#fcfcff] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]"
          >
            <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent" />
          </motion.div>
          <span className="text-sm font-medium text-[#6b6a7a]">Loading feedback...</span>
        </div>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen bg-[#fcfcff] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0eeff]">
            <AlertCircle className="h-8 w-8 text-[#a0a0b0]" />
          </div>
          <p className="text-sm font-medium text-[#6b6a7a]">No interview data found.</p>
          <Link
            href="/interview"
            className="rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C084FC]/25 transition-all hover:shadow-xl hover:shadow-[#C084FC]/40"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#fcfcff]">
      <main className="flex-1 overflow-auto">
        <div className="mx-auto  space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6a7a] transition-colors hover:text-[#0a0a0f]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to History</span>
            </Link>
          </motion.div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm lg:p-8"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#FF4D9D]/10 to-[#8B5CF6]/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#C084FC]/10 to-[#FF6BCB]/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22C55E]/10 via-[#22C55E]/5 to-transparent px-3 py-1">
                  <CheckCircle className="h-3.5 w-3.5 text-[#22C55E]" />
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#22C55E]">
                    Interview Completed
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0f] lg:text-4xl">
                    Interview Feedback
                  </h1>
                  <p className="mt-1.5 text-base text-[#6b6a7a]">
                    {[company, role].filter(Boolean).join(' \u2014 ')}
                    {dateStr && <span className="text-[#a0a0b0]"> \u2022 {dateStr}</span>}
                    {duration && <span className="text-[#a0a0b0]"> \u2022 {duration}</span>}
                  </p>
                </div>
              </div>

              {overallScore != null && (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="relative mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full">
                      <svg className="absolute inset-0 h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#f0eeff" strokeWidth="6" />
                        <motion.circle
                          cx="50" cy="50" r="44"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${(overallScore / 100) * 276.46} 276.46`}
                          initial={{ strokeDasharray: '0 276.46' }}
                          animate={{ strokeDasharray: `${(overallScore / 100) * 276.46} 276.46` }}
                          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF4D9D" />
                            <stop offset="50%" stopColor="#C084FC" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="relative flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#0a0a0f]">{overallScore}</span>
                        <span className="text-xs text-[#a0a0b0]">pts</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#0a0a0f]">Overall Score</p>
                    <span className={cn(
                      'text-xs font-bold',
                      overallScore >= 80 ? 'text-[#22C55E]' : overallScore >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                    )}>
                      {overallScore >= 80 ? 'Excellent Performance' : overallScore >= 60 ? 'Good Performance' : 'Needs Improvement'}
                    </span>
                  </div>

                  <div className="hidden space-y-3 lg:block">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]" />
                      <span className="text-sm text-[#6b6a7a]">Performance Grade</span>
                      <span className="text-lg font-bold text-[#0a0a0f]">
                        {overallScore >= 90 ? 'A' : overallScore >= 80 ? 'A-' : overallScore >= 70 ? 'B+' : 'B'}
                      </span>
                    </div>
                    {questionsTotal > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-[#a0a0b0]" />
                        <span className="text-sm text-[#6b6a7a]">Questions</span>
                        <span className="text-lg font-bold text-[#0a0a0f]">{questionsTotal}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#C084FC] to-[#8B5CF6]" />
                      <span className="text-sm text-[#6b6a7a]">Readiness</span>
                      <span className="text-lg font-bold text-[#0a0a0f]">{overallScore}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Performance Metrics + Quick Stats */}
          {(performanceMetrics.length > 0 || quickStats.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-2">
              {performanceMetrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                      <BarChart3 className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Performance Analytics</h2>
                      <p className="text-xs text-[#6b6a7a]">Key metrics breakdown</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric, i) => (
                      <ProgressBar key={metric.label} label={metric.label} value={metric.value} delay={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {quickStats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                      <Zap className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Quick Stats</h2>
                      <p className="text-xs text-[#6b6a7a]">Performance at a glance</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {quickStats.map((stat, i) => {
                      const IconComp = IconsMap[stat.icon || ''] || Code
                      return (
                        <StatCard key={stat.label || i} icon={IconComp} value={stat.value || ''} label={stat.label || ''} index={i} />
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Strengths / Weaknesses / AI Suggestions */}
          {(strengths.length > 0 || weaknesses.length > 0 || aiSuggestions.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-3">
              {strengths.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#22C55E] to-[#34D399]" />
                  <div className="flex items-center gap-3 mb-4 pl-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22C55E]/10">
                      <CheckCircle className="h-4.5 w-4.5 text-[#22C55E]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0a0a0f]">Strengths</h3>
                  </div>
                  <ul className="space-y-3 pl-3">
                    {strengths.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]/10">
                          <CheckCircle className="h-3 w-3 text-[#22C55E]" />
                        </div>
                        <span className="text-sm text-[#6b6a7a] leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {weaknesses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#EF4444] to-[#F97316]" />
                  <div className="flex items-center gap-3 mb-4 pl-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EF4444]/10">
                      <AlertCircle className="h-4.5 w-4.5 text-[#EF4444]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0a0a0f]">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-3 pl-3">
                    {weaknesses.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444]/10">
                          <XCircle className="h-3 w-3 text-[#EF4444]" />
                        </div>
                        <span className="text-sm text-[#6b6a7a] leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {aiSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#C084FC] to-[#8B5CF6]" />
                  <div className="flex items-center gap-3 mb-4 pl-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C084FC]/10">
                      <Lightbulb className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0a0a0f]">AI Suggestions</h3>
                  </div>
                  <ul className="space-y-3 pl-3">
                    {aiSuggestions.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#C084FC]/10">
                          <Sparkles className="h-3 w-3 text-[#8B5CF6]" />
                        </div>
                        <span className="text-sm text-[#6b6a7a] leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          )}

          {/* Question-by-Question Review */}
          {questionReviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                  <MessageSquare className="h-4.5 w-4.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Question-by-Question Review</h2>
                  <p className="text-xs text-[#6b6a7a]">Detailed AI feedback for each question</p>
                </div>
              </div>
              <div className="space-y-3">
                {questionReviews.map((q) => (
                  <QuestionCard key={q.id} question={q} index={q.id - 1} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Timeline + Skill Breakdown */}
          {(timelineEvents.length > 0 || skillBreakdown.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-2">
              {timelineEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                      <Clock className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Interview Timeline</h2>
                      <p className="text-xs text-[#6b6a7a]">Minute-by-minute breakdown</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C084FC] via-[#f0eeff] to-transparent" />
                    <div className="space-y-0">
                      {timelineEvents.map((event, i) => (
                        <motion.div
                          key={event.title || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                          className="group relative flex items-start gap-4 pb-6 last:pb-0"
                        >
                          <div className="relative z-10 mt-1">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#f0eeff] to-[#e8e5ff] shadow-sm transition-all duration-200 group-hover:from-[#C084FC] group-hover:to-[#8B5CF6] group-hover:text-white">
                              <event.icon className="h-4 w-4 text-[#6b6a7a] transition-colors duration-200 group-hover:text-white" />
                            </div>
                          </div>
                          <div className="flex flex-1 items-start justify-between gap-4 rounded-xl bg-[#faf9ff] px-4 py-2.5 transition-all duration-200 group-hover:bg-[#f5f0ff]">
                            <div>
                              <p className="text-sm font-semibold text-[#0a0a0f]">{event.title}</p>
                              <p className="mt-0.5 text-xs text-[#a0a0b0]">{event.description}</p>
                            </div>
                            <span className="shrink-0 text-xs font-medium text-[#a0a0b0]">{event.time}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {skillBreakdown.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                      <Target className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Skill Breakdown</h2>
                      <p className="text-xs text-[#6b6a7a]">Readiness by category</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {skillBreakdown.map((skill, i) => (
                      <motion.div
                        key={skill.name || i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-4 transition-all duration-200 hover:border-[#C084FC]/30 hover:shadow-md hover:shadow-[#C084FC]/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0eeff]">
                              <skill.icon className="h-3.5 w-3.5 text-[#8B5CF6]" />
                            </div>
                            <span className="text-sm font-semibold text-[#0a0a0f]">{skill.name}</span>
                          </div>
                          <span className={cn(
                            'text-xs font-bold',
                            skill.trend === 'up' ? 'text-[#22C55E]' :
                            skill.trend === 'down' ? 'text-[#EF4444]' : 'text-[#a0a0b0]'
                          )}>
                            {skill.trend === 'up' ? '\u2191' : skill.trend === 'down' ? '\u2193' : '\u2192'} {skill.improvement}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-[#0a0a0f]">{skill.score}%</span>
                          <span className="text-xs text-[#a0a0b0]">{skill.readiness}% ready</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#f0eeff] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.readiness}%` }}
                            transition={{ duration: 1, delay: 0.6 + i * 0.05, ease: 'easeOut' }}
                            className={cn(
                              'h-full rounded-full',
                              (skill.score || 0) >= 85
                                ? 'bg-gradient-to-r from-[#22C55E] to-[#34D399]'
                                : (skill.score || 0) >= 70
                                ? 'bg-gradient-to-r from-[#C084FC] to-[#8B5CF6]'
                                : 'bg-gradient-to-r from-[#F59E0B] to-[#F97316]'
                            )}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Weekly Performance + Score Comparison */}
          {(weeklyPerformance.length > 0 || overallScore != null) && (
            <div className="grid gap-6 lg:grid-cols-2">
              {weeklyPerformance.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                      <LineChart className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Weekly Performance</h2>
                      <p className="text-xs text-[#6b6a7a]">Your trend over the last 7 days</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2" style={{ height: '160px' }}>
                    {weeklyPerformance.map((day, i) => {
                      const maxVal = Math.max(...weeklyPerformance.map(d => d.score || 0), 1)
                      const heightPct = ((day.score || 0) / maxVal) * 100
                      return (
                        <div key={day.day || i} className="group relative flex flex-1 flex-col items-center gap-2">
                          <div className="relative w-full rounded-xl" style={{ height: '120px' }}>
                            <div className="absolute bottom-0 left-0 right-0 h-full rounded-xl bg-[#f0eeff]" />
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(heightPct, 8)}%` }}
                              transition={{ duration: 0.8, delay: 0.55 + i * 0.05, ease: 'easeOut' }}
                              className="absolute bottom-0 left-[10%] right-[10%] rounded-t-xl bg-gradient-to-t from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/20"
                            >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0a0a0f] px-2 py-0.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                                {day.score}%
                              </div>
                            </motion.div>
                          </div>
                          <span className="text-xs font-medium text-[#a0a0b0]">{day.day}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {overallScore != null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                      <BarChart3 className="h-4.5 w-4.5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Score Comparison</h2>
                      <p className="text-xs text-[#6b6a7a]">How you stack up</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f5f0ff] to-[#f0eeff] p-5">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#C084FC]/20 to-[#8B5CF6]/20 blur-2xl" />
                    <div className="relative z-10">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1">
                        <TrendingUp className="h-3.5 w-3.5 text-[#22C55E]" />
                        <span className="text-xs font-semibold text-[#22C55E]">
                          {overallScore >= 74 ? 'Above Average' : 'Below Average'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#6b6a7a]">
                        Your score of{' '}
                        <span className="font-bold text-[#0a0a0f]">{overallScore}%</span>{' '}
                        is{' '}
                        <span className={cn('font-bold', overallScore >= 74 ? 'text-[#22C55E]' : 'text-[#EF4444]')}>
                          {Math.abs(overallScore - 74)}% {overallScore >= 74 ? 'higher' : 'lower'}
                        </span>{' '}
                        than the average candidate.
                        {overallScore >= 80 && " You're in the Top 20% of performers."}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-[#e8e7f0] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overallScore}%` }}
                            transition={{ duration: 1.5, delay: 0.7, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#0a0a0f]">{overallScore}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* AI Recommendations */}
          {recommendedTopics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                  <Sparkles className="h-4.5 w-4.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">AI Recommendations</h2>
                  <p className="text-xs text-[#6b6a7a]">Personalized practice plan</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedTopics.map((topic, i) => (
                  <motion.div
                    key={topic.name || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.08 }}
                    whileHover={{ y: -2, borderColor: 'rgba(192, 132, 252, 0.3)' }}
                    className="flex items-center justify-between rounded-xl border border-[#e8e7f0] bg-[#faf9ff] px-4 py-3.5 transition-all duration-200 hover:shadow-md hover:shadow-[#C084FC]/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0eeff]">
                        <BookOpen className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm font-medium text-[#0a0a0f]">{topic.name}</span>
                    </div>
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      topic.priority === 'High'
                        ? 'bg-[#EF4444]/10 text-[#EF4444]'
                        : topic.priority === 'Medium'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'bg-[#22C55E]/10 text-[#22C55E]'
                    )}>
                      {topic.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff]">
                <Zap className="h-4.5 w-4.5 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#0a0a0f]">Quick Actions</h2>
                <p className="text-xs text-[#6b6a7a]">Next steps based on your performance</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Retry Interview', desc: 'Practice the same topics again', icon: RotateCcw, href: '/interview', gradient: 'from-[#FF4D9D] to-[#FF6BCB]' },
                { label: 'Download Report', desc: 'Export full PDF report', icon: Download, onClick: handleDownload, gradient: 'from-[#C084FC] to-[#8B5CF6]' },
                { label: 'Share Feedback', desc: 'Share with mentors/peers', icon: Share2, onClick: handleShare, gradient: 'from-[#60A5FA] to-[#3B82F6]' },
                { label: 'Back to Dashboard', desc: 'View your overall progress', icon: BarChart3, href: '/dashboard', gradient: 'from-[#34D399] to-[#22C55E]' },
              ].map((action, i) => {
                const card = (
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
                )
                if ('onClick' in action) {
                  return (
                    <button key={action.label} onClick={action.onClick} className="text-left">
                      {card}
                    </button>
                  )
                }
                return (
                  <Link key={action.label} href={action.href!}>
                    {card}
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex justify-center pb-4"
          >
            <Link
              href="/interview"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#C084FC]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <PlayCircle className="h-4 w-4 relative" />
              <span className="relative">Practice Another Interview</span>
              <ArrowRight className="h-4 w-4 relative transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#e8e7f0] bg-white px-5 py-3 shadow-lg"
            >
              <p className="text-sm font-medium text-[#0a0a0f]">{notification}</p>
            </motion.div>
          )}

          <div className="h-6" />
        </div>
      </main>
    </div>
  )
}

export default function FeedbackPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#0a0a0f]">MockAI</span>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]"
              >
                <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent" />
              </motion.div>
              <span className="text-sm font-medium text-[#6b6a7a]">Loading...</span>
            </div>
          </div>
        }>
          <FeedbackPageContent />
        </Suspense>
      </div>
    </div>
  )
}
