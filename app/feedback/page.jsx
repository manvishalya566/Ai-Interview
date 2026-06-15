'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, History, MessageSquare, BarChart3, Settings, LogOut,
  Bell, User, ArrowLeft, Star, CheckCircle,
  XCircle, TrendingUp, Zap, Brain, Code, BookOpen,
  Clock, Target, Sparkles, Download, Share2, RotateCcw,
  PlayCircle, Menu, X, ChevronDown, AlertCircle,
  Lightbulb, LineChart, PieChart, Activity, Calendar, Users,
  Mic, Eye, MessageCircle, Bot, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'Start Interview', icon: PlayCircle },
  { href: '/history', label: 'History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/login', label: 'Logout', icon: LogOut },
]

const performanceMetrics = [
  { label: 'Communication Skills', value: 78, icon: MessageCircle },
  { label: 'Technical Knowledge', value: 92, icon: Code },
  { label: 'Confidence Level', value: 85, icon: Star },
  { label: 'Problem Solving', value: 88, icon: Brain },
  { label: 'Speaking Speed', value: 72, icon: Mic },
  { label: 'Eye Contact', value: 68, icon: Eye },
]

const strengths = [
  'Excellent technical depth in React and System Design',
  'Clear articulation of complex algorithms',
  'Strong problem-solving approach with optimal solutions',
  'Good use of examples and analogies',
]

const weaknesses = [
  'Tendency to rush through behavioral questions',
  'Occasional filler words ("um", "like") during thinking',
  'Could improve on time management for coding rounds',
  'Need more practice with system design trade-offs',
]

const aiSuggestions = [
  'Practice the STAR method for behavioral questions',
  'Record yourself to identify filler words',
  'Use a timer during coding practice sessions',
  'Review system design case studies from FAANG interviews',
]

const recommendedTopics = [
  { name: 'Advanced React Patterns', priority: 'High' },
  { name: 'System Design - Distributed Systems', priority: 'High' },
  { name: 'Behavioral Interview Techniques', priority: 'Medium' },
  { name: 'Dynamic Programming Optimization', priority: 'Medium' },
]

const questionReviews = [
  {
    id: 1,
    question: 'Implement a debounce function in JavaScript and explain its real-world applications.',
    userAnswer: 'Implemented a basic debounce with setTimeout, explained event handling in search inputs.',
    aiFeedback: 'Good implementation but missed edge cases like immediate execution option and leading/trailing calls.',
    score: 82,
    correctApproach: 'Use closure with setTimeout, add clearTimeout on each call, support options for leading/trailing execution.',
    improvement: 'Consider adding TypeScript types and testing with rapid-fire events.',
  },
  {
    id: 2,
    question: 'Explain the Virtual DOM in React and how it differs from real DOM manipulation.',
    userAnswer: 'Explained diffing algorithm, reconciliation, and performance benefits with examples.',
    aiFeedback: 'Excellent explanation! Clear comparison with real DOM, good use of analogies, and covered fiber architecture.',
    score: 95,
    correctApproach: 'Virtual DOM is a lightweight copy, React batches updates, uses diffing for minimal changes, fiber for priority scheduling.',
    improvement: 'Consider mentioning concurrent features like Suspense and Transitions in React 18.',
  },
  {
    id: 3,
    question: 'Design a URL shortener service like TinyURL or Bitly.',
    userAnswer: 'Discussed database schema, hashing algorithms, and basic scaling considerations.',
    aiFeedback: 'Good start but missed important system design aspects: cache layer, load balancing, rate limiting, and analytics.',
    score: 70,
    correctApproach: 'API layer + application servers + cache (Redis) + database (SQL/NoSQL) + hash function (MD5/base62) + load balancer + rate limiter.',
    improvement: 'Practice drawing system diagrams and thinking about failure modes, data partitioning, and global distribution.',
  },
  {
    id: 4,
    question: 'Tell me about a time you had to resolve a conflict with a team member.',
    userAnswer: 'Shared a story about disagreement on technical approach, reached compromise through discussion.',
    aiFeedback: 'Decent story but could use more STAR structure. Missing specific metrics on the outcome and what you learned.',
    score: 65,
    correctApproach: 'Use STAR: Situation (context), Task (your responsibility), Action (what YOU did), Result (quantifiable outcome), Learnings.',
    improvement: 'Prepare 3-4 STAR stories that showcase different competencies: leadership, conflict resolution, problem solving, growth.',
  },
]

const timelineEvents = [
  { time: '10:30 AM', title: 'Interview Started', description: 'Connected with AI interviewer', status: 'complete', icon: PlayCircle },
  { time: '10:32 AM', title: 'Introduction Phase', description: 'Warm-up questions and role discussion', status: 'complete', icon: Users },
  { time: '10:45 AM', title: 'Technical Round', description: '2 coding questions completed', status: 'complete', icon: Code },
  { time: '11:15 AM', title: 'System Design', description: 'URL shortener design discussion', status: 'complete', icon: PieChart },
  { time: '11:35 AM', title: 'Behavioral Questions', description: '3 STAR-method questions', status: 'complete', icon: MessageSquare },
  { time: '11:45 AM', title: 'Interview Completed', description: 'Score: 82% - Ready for Review', status: 'complete', icon: CheckCircle },
]

const skillBreakdown = [
  { name: 'DSA', score: 91, readiness: 95, improvement: '+12', trend: 'up', icon: Code },
  { name: 'React', score: 88, readiness: 90, improvement: '+8', trend: 'up', icon: Zap },
  { name: 'System Design', score: 72, readiness: 65, improvement: '-3', trend: 'down', icon: PieChart },
  { name: 'Backend', score: 78, readiness: 75, improvement: '+5', trend: 'up', icon: Activity },
  { name: 'Communication', score: 74, readiness: 70, improvement: '+2', trend: 'up', icon: MessageCircle },
  { name: 'HR Questions', score: 68, readiness: 60, improvement: '0', trend: 'neutral', icon: Users },
]

const weeklyPerformance = [
  { day: 'Mon', score: 72 }, { day: 'Tue', score: 68 }, { day: 'Wed', score: 75 },
  { day: 'Thu', score: 82 }, { day: 'Fri', score: 78 }, { day: 'Sat', score: 85 }, { day: 'Sun', score: 82 },
]

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="rounded-[8px] bg-[#f7f7f5] p-2">
            <Icon className="h-5 w-5 text-black" />
          </div>
        )}
        <h2 className="text-xl font-bold text-black">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-black/40 ml-10">{subtitle}</p>}
    </div>
  )
}

function ProgressBar({ value, label, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-black/60">{label}</span>
        <span className="text-sm font-medium text-black">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#f1f1f1]">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay: delay * 0.1, ease: 'easeOut' }}
          className="h-full rounded-full bg-black"
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
      className="rounded-[24px] border border-[#e6e6e6] bg-white overflow-hidden transition-colors hover:bg-[#f7f7f5]"
    >
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-5 flex items-start justify-between text-left">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center rounded-[8px] bg-[#f7f7f5] px-2.5 py-0.5 text-xs font-medium text-black">Q{question.id}</span>
            <span className={cn(
              'inline-flex items-center gap-1 rounded-[8px] px-2.5 py-0.5 text-xs font-semibold',
              question.score >= 90 ? 'bg-[#c8e6cd] text-black' :
              question.score >= 75 ? 'bg-[#dceeb1] text-black' : 'bg-[#f4ecd6] text-black'
            )}>
              <Star className="h-3 w-3" />
              {question.score}%
            </span>
          </div>
          <p className="text-sm font-medium text-black leading-relaxed">{question.question}</p>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 rounded-[8px] bg-[#f7f7f5] p-2 transition-colors">
          <ChevronDown className="h-4 w-4 text-black/50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[#e6e6e6] pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[8px] bg-[#f7f7f5] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-black" />
                    <span className="text-xs font-medium text-black uppercase tracking-wider">Your Answer</span>
                  </div>
                  <p className="text-sm text-black/60 leading-relaxed">{question.userAnswer}</p>
                </div>
                <div className="rounded-[8px] bg-[#f7f7f5] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-black" />
                    <span className="text-xs font-medium text-black uppercase tracking-wider">AI Feedback</span>
                  </div>
                  <p className="text-sm text-black/60 leading-relaxed">{question.aiFeedback}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[8px] bg-[#c8e6cd] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-black" />
                    <span className="text-xs font-medium text-black uppercase tracking-wider">Correct Approach</span>
                  </div>
                  <p className="text-sm text-black/60 leading-relaxed">{question.correctApproach}</p>
                </div>
                <div className="rounded-[8px] bg-[#dceeb1] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-black" />
                    <span className="text-xs font-medium text-black uppercase tracking-wider">Improvement Tip</span>
                  </div>
                  <p className="text-sm text-black/60 leading-relaxed">{question.improvement}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FeedbackPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex w-full min-h-screen bg-white text-black">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-[#e6e6e6] bg-white transition-all duration-300 lg:flex',
          mobileSidebarOpen && '!flex'
        )}
      >
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#e6e6e6] bg-white lg:hidden"
            >
              <MobileSidebarContent onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <DesktopSidebarContent collapsed={!sidebarOpen} />
      </motion.aside>

      <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-18')}>
        <header className="sticky top-0 z-30 border-b border-[#e6e6e6] bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-[50px] p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden rounded-[50px] p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black lg:block"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 md:flex">
                <div className="text-right">
                  <p className="text-xs text-black/40">Interview Feedback</p>
                  <p className="text-sm font-medium text-black">Google - SWE Role</p>
                </div>
              </div>
              <button className="rounded-[50px] border border-[#e6e6e6] bg-white p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-30" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-black" />
                </span>
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-[50px] bg-[#c8e6cd] px-3 py-1">
                    <CheckCircle className="h-3.5 w-3.5 text-black" />
                    <span className="text-xs font-medium text-black">Interview Completed</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Interview Feedback</h1>
                    <p className="mt-2 text-base text-black/50">
                      Google — Senior Software Engineer • May 20, 2026 • <span className="text-black/70">45 min</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-black">82<span className="text-2xl text-black/40">%</span></div>
                    <p className="text-sm font-medium text-black mt-1">Overall Score</p>
                    <p className="text-xs text-black/40">Excellent Performance</p>
                  </div>
                  <div className="hidden space-y-3 lg:block">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-black" />
                      <span className="text-sm text-black/60">AI Performance Rating</span>
                      <span className="text-lg font-bold text-black">A-</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-black/60" />
                      <span className="text-sm text-black/60">Questions Attempted</span>
                      <span className="text-lg font-bold text-black">4/4</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-black/40" />
                      <span className="text-sm text-black/60">Readiness Score</span>
                      <span className="text-lg font-bold text-black">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Performance Analytics" subtitle="Key metrics breakdown" icon={BarChart3} />
                <div className="space-y-5">
                  {performanceMetrics.map((metric, i) => (
                    <ProgressBar key={metric.label} label={metric.label} value={metric.value} delay={i} />
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Quick Stats" subtitle="Performance at a glance" icon={Zap} />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Best Category', value: 'Technical', icon: Code },
                    { label: 'Needs Work', value: 'Behavioral', icon: Users },
                    { label: 'Time Taken', value: '42 min', icon: Clock },
                    { label: 'Accuracy', value: '87%', icon: Target },
                    { label: 'Avg Response', value: '2.3 min', icon: Mic },
                    { label: 'Code Quality', value: 'A-', icon: CheckCircle },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                      className="rounded-[8px] border border-[#e6e6e6] bg-white p-4 text-center transition-colors hover:bg-[#f7f7f5]"
                    >
                      <stat.icon className="mx-auto h-5 w-5 mb-2 text-black" />
                      <p className="text-lg font-bold text-black">{stat.value}</p>
                      <p className="text-xs text-black/40 mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6" style={{ borderLeft: '4px solid #c8e6cd' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-[8px] bg-[#c8e6cd] p-2">
                    <CheckCircle className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {strengths.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0 rounded-full bg-[#c8e6cd] p-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-black" />
                      </div>
                      <span className="text-sm text-black/60 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6" style={{ borderLeft: '4px solid #efd4d4' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-[8px] bg-[#efd4d4] p-2">
                    <AlertCircle className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {weaknesses.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0 rounded-full bg-[#efd4d4] p-0.5">
                        <XCircle className="h-3.5 w-3.5 text-black" />
                      </div>
                      <span className="text-sm text-black/60 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6" style={{ borderLeft: '4px solid #c5b0f4' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-[8px] bg-[#c5b0f4] p-2">
                    <Lightbulb className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">AI Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {aiSuggestions.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0 rounded-full bg-[#c5b0f4] p-0.5">
                        <Sparkles className="h-3.5 w-3.5 text-black" />
                      </div>
                      <span className="text-sm text-black/60 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="Question-by-Question Review" subtitle="Detailed AI feedback for each question" icon={MessageSquare} />
              <div className="space-y-4">
                {questionReviews.map((q) => (
                  <QuestionCard key={q.id} question={q} index={questionReviews.indexOf(q)} />
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Interview Timeline" subtitle="Minute-by-minute breakdown" icon={Clock} />
                <div className="relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#e6e6e6]" />
                  <div className="space-y-0">
                    {timelineEvents.map((event, i) => (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
                        className="group relative flex items-start gap-4 pb-6 last:pb-0"
                      >
                        <div className="relative z-10 mt-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e6e6e6] bg-[#f7f7f5] transition-colors group-hover:bg-[#e6e6e6]">
                            <event.icon className="h-4 w-4 text-black" />
                          </div>
                        </div>
                        <div className="flex flex-1 items-start justify-between gap-4 rounded-[8px] bg-white px-4 py-2 transition-colors group-hover:bg-[#f7f7f5]">
                          <div>
                            <p className="text-sm font-medium text-black">{event.title}</p>
                            <p className="mt-0.5 text-xs text-black/40">{event.description}</p>
                          </div>
                          <span className="shrink-0 text-xs text-black/30">{event.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Skill Breakdown" subtitle="Readiness by category" icon={Target} />
                <div className="grid grid-cols-2 gap-4">
                  {skillBreakdown.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                      className="rounded-[8px] border border-[#e6e6e6] bg-white p-4 transition-colors hover:bg-[#f7f7f5]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <skill.icon className="h-4 w-4 text-black" />
                          <span className="text-sm font-medium text-black">{skill.name}</span>
                        </div>
                        <span className={cn(
                          'text-xs font-semibold',
                          skill.trend === 'up' ? 'text-black' :
                          skill.trend === 'down' ? 'text-black/60' : 'text-black/40'
                        )}>
                          {skill.trend === 'up' ? '↑' : skill.trend === 'down' ? '↓' : '→'} {skill.improvement}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-black">{skill.score}%</span>
                        <span className="text-xs text-black/40">{skill.readiness}% ready</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#f1f1f1]">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', skill.score >= 85 ? 'bg-black' : skill.score >= 70 ? 'bg-black/70' : 'bg-black/50')}
                          style={{ width: `${skill.readiness}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
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
                        <div className="absolute bottom-0 left-0 right-0 h-full rounded-[8px] bg-[#f7f7f5]" />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${day.score}%` }}
                          transition={{ duration: 0.8, delay: 0.7 + i * 0.05, ease: 'easeOut' }}
                          className="absolute bottom-0 left-0 right-0 rounded-[8px] bg-black transition-all duration-300"
                          style={{ minHeight: '12px' }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-black px-2 py-0.5 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {day.score}%
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs font-medium text-black/40">{day.day}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Score Comparison" subtitle="How you stack up" icon={BarChart3} />
                <div className="mt-4 rounded-[8px] bg-[#f7f7f5] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-black" />
                    <span className="text-xs font-semibold text-black uppercase tracking-wider">Above Average</span>
                  </div>
                  <p className="text-sm text-black/60">
                    Your score of <span className="font-medium text-black">82%</span> is <span className="font-medium text-black">8% higher</span> than the average candidate.
                    You&apos;re in the <span className="font-medium text-black">Top 20%</span> of performers.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="AI Recommendations" subtitle="Personalized practice plan" icon={Sparkles} />
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-black mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-black" />
                    Recommended Topics
                  </h4>
                  <div className="space-y-3">
                    {recommendedTopics.map((topic, i) => (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.75 + i * 0.1 }}
                        className="flex items-center justify-between rounded-[8px] border border-[#e6e6e6] bg-white px-4 py-3 transition-colors hover:bg-[#f7f7f5]"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-black/60" />
                          <span className="text-sm text-black/70">{topic.name}</span>
                        </div>
                        <span className={cn(
                          'rounded-[50px] px-2.5 py-0.5 text-xs font-medium',
                          topic.priority === 'High' ? 'bg-[#efd4d4] text-black' : 'bg-[#f4ecd6] text-black'
                        )}>
                          {topic.priority}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-black mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-black/60" />
                    Daily Practice Plan
                  </h4>
                  <div className="space-y-3">
                    {[
                      { day: 'Today', task: 'Review System Design feedback + 2 practice questions', duration: '45 min' },
                      { day: 'Tomorrow', task: 'Practice behavioral questions with STAR method', duration: '30 min' },
                      { day: 'Day 3', task: 'Advanced React patterns deep dive + coding', duration: '60 min' },
                      { day: 'Day 4', task: 'Full mock interview - Google SWE simulation', duration: '60 min' },
                    ].map((plan, i) => (
                      <motion.div
                        key={plan.day}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="rounded-[8px] border border-[#e6e6e6] bg-white px-4 py-3 transition-colors hover:bg-[#f7f7f5]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-xs font-medium', i === 0 ? 'text-black' : 'text-black/40')}>{plan.day}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-black/30" />
                            <span className="text-xs text-black/30">{plan.duration}</span>
                          </div>
                        </div>
                        <p className="text-sm text-black/60">{plan.task}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="Quick Actions" subtitle="Next steps based on your performance" icon={Zap} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/interview">
                  <motion.div whileHover={{ y: -2 }} className="rounded-[8px] border border-[#e6e6e6] bg-white p-5 transition-colors hover:bg-[#f7f7f5]">
                    <div className="mb-3 inline-flex rounded-[8px] bg-black p-2.5">
                      <RotateCcw className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-black">Retry Interview</h4>
                    <p className="mt-1 text-xs text-black/40">Practice the same topics again</p>
                  </motion.div>
                </Link>
                <button>
                  <motion.div whileHover={{ y: -2 }} className="rounded-[8px] border border-[#e6e6e6] bg-white p-5 transition-colors hover:bg-[#f7f7f5]">
                    <div className="mb-3 inline-flex rounded-[8px] bg-black p-2.5">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-black">Download Report</h4>
                    <p className="mt-1 text-xs text-black/40">Export full PDF report</p>
                  </motion.div>
                </button>
                <button>
                  <motion.div whileHover={{ y: -2 }} className="rounded-[8px] border border-[#e6e6e6] bg-white p-5 transition-colors hover:bg-[#f7f7f5]">
                    <div className="mb-3 inline-flex rounded-[8px] bg-black p-2.5">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-black">Share Feedback</h4>
                    <p className="mt-1 text-xs text-black/40">Share with mentors/peers</p>
                  </motion.div>
                </button>
                <Link href="/dashboard">
                  <motion.div whileHover={{ y: -2 }} className="rounded-[8px] border border-[#e6e6e6] bg-white p-5 transition-colors hover:bg-[#f7f7f5]">
                    <div className="mb-3 inline-flex rounded-[8px] bg-black p-2.5">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-black">Back to Dashboard</h4>
                    <p className="mt-1 text-xs text-black/40">View your overall progress</p>
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
                className="inline-flex items-center justify-center gap-2 rounded-[50px] bg-black px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-black/80"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Practice Another Interview</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}

function DesktopSidebarContent({ collapsed }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-[#e6e6e6]', collapsed ? 'justify-center px-3' : 'px-5')}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-black">MockAI</span>}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-3 rounded-[50px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/feedback' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>
      <div className={cn('border-t border-[#e6e6e6] p-3', collapsed && 'flex justify-center')}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-[8px] bg-[#f7f7f5] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black text-xs font-bold text-white">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-black">Alex Johnson</p>
              <p className="truncate text-xs text-black/40">alex@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black text-xs font-bold text-white">A</div>
        )}
      </div>
    </div>
  )
}

function MobileSidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-[#e6e6e6] px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-black">MockAI</span>
        </Link>
        <button onClick={onClose} className="rounded-[50px] p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-[50px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/feedback' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black'
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-[#e6e6e6] p-3">
        <div className="flex items-center gap-3 rounded-[8px] bg-[#f7f7f5] px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black text-xs font-bold text-white">A</div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-black">Alex Johnson</p>
            <p className="truncate text-xs text-black/40">alex@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
