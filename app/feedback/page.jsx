'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, CheckCircle,
  XCircle, TrendingUp, Zap, Brain, Code, BookOpen,
  Clock, Target, Sparkles, Download, Share2, RotateCcw,
  PlayCircle, ChevronDown, AlertCircle,
  Lightbulb, LineChart, Activity, Calendar,
  Mic, Eye, MessageCircle, Bot, ArrowRight,
  BarChart3, Users, PieChart, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { FigmaButton } from '@/components/ui/figma-button'

const IconsMap = {
  MessageCircle, Code, Star, Brain, Mic, Eye,
  CheckCircle, Target, Users, Clock, Zap,
  PieChart, Activity, PlayCircle, BarChart3,
}

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="rounded-md bg-secondary p-2">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
        )}
        <h2 className="text-card-title text-foreground">{title}</h2>
      </div>
      {subtitle && <p className="text-body-sm text-foreground/40 ml-10">{subtitle}</p>}
    </div>
  )
}

function ProgressBar({ value, label, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-foreground/60">{label}</span>
        <span className="text-body-sm font-medium text-foreground">{value}%</span>
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

function QuestionCard({ question, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-lg border border-border bg-background overflow-hidden transition-colors hover:bg-secondary"
    >
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-5 flex items-start justify-between text-left">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center rounded-md bg-secondary px-2.5 py-0.5 text-body-sm font-medium text-foreground">Q{question.id}</span>
            <span className={cn(
              'inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-body-sm font-semibold',
              question.score >= 90 ? 'bg-block-mint text-foreground' :
              question.score >= 75 ? 'bg-block-lime text-foreground' : 'bg-block-cream text-foreground'
            )}>
              <Star className="h-3 w-3" />
              {question.score}%
            </span>
          </div>
          <p className="text-body-sm font-medium text-foreground leading-relaxed">{question.question}</p>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 rounded-md bg-secondary p-2 transition-colors">
          <ChevronDown className="h-4 w-4 text-foreground/50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md bg-secondary p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-foreground" />
                    <span className="text-eyebrow text-foreground">Your Answer</span>
                  </div>
                  <p className="text-body-sm text-foreground/60 leading-relaxed">{question.userAnswer}</p>
                </div>
                <div className="rounded-md bg-secondary p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-foreground" />
                    <span className="text-eyebrow text-foreground">AI Feedback</span>
                  </div>
                  <p className="text-body-sm text-foreground/60 leading-relaxed">{question.aiFeedback}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md bg-block-mint p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-foreground" />
                    <span className="text-eyebrow text-foreground">Correct Approach</span>
                  </div>
                  <p className="text-body-sm text-foreground/60 leading-relaxed">{question.correctApproach}</p>
                </div>
                <div className="rounded-md bg-block-lime p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-foreground" />
                    <span className="text-eyebrow text-foreground">Improvement Tip</span>
                  </div>
                  <p className="text-body-sm text-foreground/60 leading-relaxed">{question.improvement}</p>
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
  const [feedback, setFeedback] = useState(null)
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
        console.error("Failed to load feedback:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [interviewId])

  const interview = feedback

  const performanceMetrics = interview?.performanceMetrics?.filter(m => m.value != null) || []
  const strengths = interview?.strengths || []
  const weaknesses = interview?.weaknesses || []
  const aiSuggestions = interview?.aiSuggestions || []
  const recommendedTopics = interview?.recommendedTopics || []
  const questionReviews = interview?.questionFeedback?.length > 0
    ? interview.questionFeedback.map((qf, idx) => ({ ...qf, id: idx + 1 }))
    : []
  const timelineEvents = interview?.timelineEvents?.length > 0
    ? interview.timelineEvents.map(te => ({ ...te, icon: IconsMap[te.icon] || PlayCircle }))
    : []
  const skillBreakdown = interview?.skillBreakdown?.length > 0
    ? interview.skillBreakdown.map(sb => ({ ...sb, icon: IconsMap[sb.icon] || Code }))
    : []
  const weeklyPerformance = interview?.weeklyPerformance || []

  const overallScore = interview?.overallScore
  const company = interview?.company
  const role = interview?.role
  const dateStr = interview?.date ? new Date(interview.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null
  const duration = interview?.duration ? `${interview.duration} min` : null
  const questionsTotal = interview?.questions?.length || 0

  const quickStats = interview?.quickStats || []

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-foreground/50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
            <span className="text-sm">Loading feedback...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!interview) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle className="h-12 w-12 text-foreground/30" />
          <p className="text-foreground/50">No interview data found.</p>
          <Link href="/interview" className="rounded-pill bg-primary px-6 py-2.5 text-body-sm font-medium text-primary-foreground">
            Start New Interview
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="rounded-lg border border-border bg-background p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-pill bg-block-mint px-3 py-1">
              <CheckCircle className="h-3.5 w-3.5 text-foreground" />
              <span className="text-eyebrow text-foreground">Interview Completed</span>
            </div>
            <div>
              <h1 className="text-headline text-foreground">Interview Feedback</h1>
              <p className="mt-2 text-body text-foreground/50">
                {[company, role].filter(Boolean).join(' — ')}
                {dateStr && ` • ${dateStr}`}
                {duration && <span className="text-foreground/70"> • {duration}</span>}
              </p>
            </div>
          </div>
          {overallScore != null && (
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-foreground">{overallScore}<span className="text-2xl text-foreground/40">%</span></div>
                <p className="text-body-sm font-medium text-foreground mt-1">Overall Score</p>
                <p className="text-body-sm text-foreground/40">{overallScore >= 80 ? 'Excellent Performance' : overallScore >= 60 ? 'Good Performance' : 'Needs Improvement'}</p>
              </div>
              <div className="hidden space-y-3 lg:block">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-body-sm text-foreground/60">AI Performance Rating</span>
                  <span className="text-card-title text-foreground">{overallScore >= 90 ? 'A' : overallScore >= 80 ? 'A-' : overallScore >= 70 ? 'B+' : 'B'}</span>
                </div>
                {questionsTotal > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-foreground/60" />
                    <span className="text-body-sm text-foreground/60">Questions Attempted</span>
                    <span className="text-card-title text-foreground">{questionsTotal}/{questionsTotal}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-foreground/40" />
                  <span className="text-body-sm text-foreground/60">Readiness Score</span>
                  <span className="text-card-title text-foreground">{overallScore}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {(performanceMetrics.length > 0 || quickStats.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {performanceMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Performance Analytics" subtitle="Key metrics breakdown" icon={BarChart3} />
              <div className="space-y-5">
                {performanceMetrics.map((metric, i) => (
                  <ProgressBar key={metric.label} label={metric.label} value={metric.value} delay={i} />
                ))}
              </div>
            </motion.div>
          )}
          {quickStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Quick Stats" subtitle="Performance at a glance" icon={Zap} />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {quickStats.map((stat, i) => {
                  const IconComp = IconsMap[stat.icon] || Code
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                      className="rounded-md border border-border bg-background p-4 text-center transition-colors hover:bg-secondary"
                    >
                      <IconComp className="mx-auto h-5 w-5 mb-2 text-foreground" />
                      <p className="text-card-title text-foreground">{stat.value}</p>
                      <p className="text-body-sm text-foreground/40 mt-0.5">{stat.label}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {(strengths.length > 0 || weaknesses.length > 0 || aiSuggestions.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-3">
          {strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg border border-border bg-background p-6" style={{ borderLeft: '4px solid #c8e6cd' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-md bg-block-mint p-2">
                  <CheckCircle className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-card-title text-foreground">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {strengths.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 rounded-full bg-block-mint p-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <span className="text-body-sm text-foreground/60 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {weaknesses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
              className="rounded-lg border border-border bg-background p-6" style={{ borderLeft: '4px solid #efd4d4' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-md bg-block-pink p-2">
                  <AlertCircle className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-card-title text-foreground">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {weaknesses.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 rounded-full bg-block-pink p-0.5">
                      <XCircle className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <span className="text-body-sm text-foreground/60 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {aiSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-lg border border-border bg-background p-6" style={{ borderLeft: '4px solid #c5b0f4' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-md bg-block-lilac p-2">
                  <Lightbulb className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-card-title text-foreground">AI Suggestions</h3>
              </div>
              <ul className="space-y-3">
                {aiSuggestions.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 rounded-full bg-block-lilac p-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-foreground" />
                    </div>
                    <span className="text-body-sm text-foreground/60 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {questionReviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <SectionHeader title="Question-by-Question Review" subtitle="Detailed AI feedback for each question" icon={MessageSquare} />
          <div className="space-y-4">
            {questionReviews.map((q) => (
              <QuestionCard key={q.id} question={q} index={questionReviews.indexOf(q)} />
            ))}
          </div>
        </motion.div>
      )}

      {(timelineEvents.length > 0 || skillBreakdown.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {timelineEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Interview Timeline" subtitle="Minute-by-minute breakdown" icon={Clock} />
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-0">
                  {timelineEvents.map((event, i) => (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
                      className="group relative flex items-start gap-4 pb-6 last:pb-0"
                    >
                      <div className="relative z-10 mt-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-secondary transition-colors group-hover:bg-border">
                          <event.icon className="h-4 w-4 text-foreground" />
                        </div>
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-4 rounded-md bg-background px-4 py-2 transition-colors group-hover:bg-secondary">
                        <div>
                          <p className="text-body-sm font-medium text-foreground">{event.title}</p>
                          <p className="mt-0.5 text-body-sm text-foreground/40">{event.description}</p>
                        </div>
                        <span className="shrink-0 text-body-sm text-foreground/30">{event.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {skillBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Skill Breakdown" subtitle="Readiness by category" icon={Target} />
              <div className="grid grid-cols-2 gap-4">
                {skillBreakdown.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                    className="rounded-md border border-border bg-background p-4 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <skill.icon className="h-4 w-4 text-foreground" />
                        <span className="text-body-sm font-medium text-foreground">{skill.name}</span>
                      </div>
                      <span className={cn(
                        'text-body-sm font-semibold',
                        skill.trend === 'up' ? 'text-foreground' :
                        skill.trend === 'down' ? 'text-foreground/60' : 'text-foreground/40'
                      )}>
                        {skill.trend === 'up' ? '\u2191' : skill.trend === 'down' ? '\u2193' : '\u2192'} {skill.improvement}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-card-title text-foreground">{skill.score}%</span>
                      <span className="text-body-sm text-foreground/40">{skill.readiness}% ready</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', skill.score >= 85 ? 'bg-primary' : skill.score >= 70 ? 'bg-foreground/70' : 'bg-foreground/50')}
                        style={{ width: `${skill.readiness}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {(weeklyPerformance.length > 0 || overallScore != null) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {weeklyPerformance.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Weekly Performance" subtitle="Your trend over the last 7 days" icon={LineChart} />
              <div className="mt-6 flex items-end justify-between gap-2" style={{ height: '180px' }}>
                {weeklyPerformance.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.65 + i * 0.05 }}
                    className="group relative flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative w-full" style={{ height: '140px' }}>
                      <div className="absolute bottom-0 left-0 right-0 h-full rounded-md bg-secondary" />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${day.score}%` }}
                        transition={{ duration: 0.8, delay: 0.7 + i * 0.05, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 rounded-md bg-primary transition-all duration-300"
                        style={{ minHeight: '12px' }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-body-sm text-primary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {day.score}%
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-body-sm font-medium text-foreground/40">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {overallScore != null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Score Comparison" subtitle="How you stack up" icon={BarChart3} />
              <div className="mt-4 rounded-md bg-secondary p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-foreground" />
                  <span className="text-eyebrow text-foreground">Above Average</span>
                </div>
                <p className="text-body-sm text-foreground/60">
                  Your score of <span className="font-medium text-foreground">{overallScore}%</span> is <span className="font-medium text-foreground">{Math.abs(overallScore - 74)}% {overallScore >= 74 ? 'higher' : 'lower'}</span> than the average candidate.
                  {overallScore >= 80 && " You're in the Top 20% of performers."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {recommendedTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
          className="rounded-lg border border-border bg-background p-6"
        >
          <SectionHeader title="AI Recommendations" subtitle="Personalized practice plan" icon={Sparkles} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-body-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-foreground" />
                Recommended Topics
              </h4>
              <div className="space-y-3">
                {recommendedTopics.map((topic, i) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 + i * 0.1 }}
                    className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-foreground/60" />
                      <span className="text-body-sm text-foreground/70">{topic.name}</span>
                    </div>
                    <span className={cn(
                      'rounded-pill px-2.5 py-0.5 text-body-sm font-medium',
                      topic.priority === 'High' ? 'bg-block-pink text-foreground' : 'bg-block-cream text-foreground'
                    )}>
                      {topic.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Quick Actions" subtitle="Next steps based on your performance" icon={Zap} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/interview">
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <RotateCcw className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Retry Interview</h4>
              <p className="mt-1 text-body-sm text-foreground/40">Practice the same topics again</p>
            </motion.div>
          </Link>
          <button>
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Download Report</h4>
              <p className="mt-1 text-body-sm text-foreground/40">Export full PDF report</p>
            </motion.div>
          </button>
          <button>
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <Share2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Share Feedback</h4>
              <p className="mt-1 text-body-sm text-foreground/40">Share with mentors/peers</p>
            </motion.div>
          </button>
          <Link href="/dashboard">
            <motion.div whileHover={{ y: -2 }} className="rounded-md border border-border bg-background p-5 transition-colors hover:bg-secondary">
              <div className="mb-3 inline-flex rounded-md bg-primary p-2.5">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="text-body-sm font-semibold text-foreground">Back to Dashboard</h4>
              <p className="mt-1 text-body-sm text-foreground/40">View your overall progress</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center pb-8"
      >
        <Link
          href="/interview"
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-8 py-3.5 text-body-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/80"
        >
          <PlayCircle className="h-4 w-4" />
          <span>Practice Another Interview</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </AppShell>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-foreground/50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </AppShell>
    }>
      <FeedbackPageContent />
    </Suspense>
  )
}
