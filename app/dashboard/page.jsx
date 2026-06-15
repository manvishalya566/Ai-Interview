'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, History, MessageSquare, BarChart3, Settings, LogOut,
  Bell, Search, User, Calendar, Target, TrendingUp, Clock, Award,
  CheckCircle, Zap, Code, BookOpen, ArrowRight, ChevronRight,
  Star, Plus, Activity, Briefcase, Sparkles, PlayCircle,
  Menu, X, Bot, Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/ui/footer'
import { FigmaButton } from '@/components/ui/figma-button'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'Start Interview', icon: PlayCircle },
  { href: '/history', label: 'History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/login', label: 'Logout', icon: LogOut },
]

const pastelAccents = {
  lime: '#dceeb1',
  lilac: '#c5b0f4',
  mint: '#c8e6cd',
  coral: '#f3c9b6',
  pink: '#efd4d4',
  cream: '#f4ecd6',
}

const statsCards = [
  { label: 'Total Interviews', value: 24, suffix: '', icon: Briefcase, change: '+8', changeUp: true, accent: 'lime' },
  { label: 'Average Score', value: 87, suffix: '%', icon: Target, change: '+12%', changeUp: true, accent: 'lilac' },
  { label: 'Skills Mastered', value: 12, suffix: '', icon: Award, change: '+3', changeUp: true, accent: 'mint' },
  { label: 'Streak Days', value: 18, suffix: '', icon: Zap, change: '+5', changeUp: true, accent: 'coral' },
]

const recentInterviews = [
  { company: 'Google', role: 'Senior Frontend Engineer', score: 92, date: 'May 20, 2026', status: 'Completed' },
  { company: 'Stripe', role: 'Full Stack Developer', score: 88, date: 'May 18, 2026', status: 'Completed' },
  { company: 'Meta', role: 'Product Designer', score: 76, date: 'May 15, 2026', status: 'Completed' },
  { company: 'Airbnb', role: 'Frontend Engineer', score: 94, date: 'May 12, 2026', status: 'Completed' },
  { company: 'Netflix', role: 'UI Engineer', score: 85, date: 'May 10, 2026', status: 'Completed' },
]

const upcomingPractices = [
  { company: 'Apple', role: 'iOS Engineer', date: 'May 25, 2026', time: '10:00 AM', duration: '45 min' },
  { company: 'Amazon', role: 'SDE II', date: 'May 27, 2026', time: '2:00 PM', duration: '60 min' },
  { company: 'Microsoft', role: 'Cloud Architect', date: 'May 30, 2026', time: '11:00 AM', duration: '45 min' },
]

const activityData = [
  { action: 'Completed Google mock interview', time: '2 hours ago', score: 92, type: 'interview' },
  { action: 'Reviewed feedback for Stripe', time: '4 hours ago', score: null, type: 'feedback' },
  { action: 'Practiced DSA - Arrays & Strings', time: 'Yesterday', score: null, type: 'practice' },
  { action: 'Completed Meta mock interview', time: 'Yesterday', score: 76, type: 'interview' },
  { action: 'Improved communication score by 8%', time: '2 days ago', score: null, type: 'improvement' },
  { action: 'Resume reviewed by AI', time: '3 days ago', score: null, type: 'resume' },
]

const weeklyData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 72 },
  { day: 'Wed', value: 58 },
  { day: 'Thu', value: 85 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 78 },
  { day: 'Sun', value: 82 },
]

const skillData = [
  { label: 'Technical', value: 88 },
  { label: 'Communication', value: 76 },
  { label: 'Confidence', value: 82 },
  { label: 'Problem Solving', value: 91 },
  { label: 'Behavioral', value: 74 },
]

function AnimatedCounter({ value, suffix = '' }) {
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
  return (
    <span ref={ref}>{count}{suffix}</span>
  )
}

function CircularProgress({ value, size = 100, strokeWidth = 6, label, accentColor = '#dceeb1' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f1f1"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accentColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <span className="text-2xl font-bold text-black">{value}%</span>
      {label && <span className="text-xs text-black/50">{label}</span>}
    </div>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-black/90">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-black/40">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-sm text-black/60 transition-colors hover:text-black"
        >
          {action.label}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

function StatCard({ data, index }) {
  const accentColors = {
    lime: '#dceeb1',
    lilac: '#c5b0f4',
    mint: '#c8e6cd',
    coral: '#f3c9b6',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative overflow-hidden rounded-[16px] border border-[#e6e6e6] bg-white p-6 transition-all duration-300 hover:border-black/20"
    >
      <div
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: accentColors[data.accent] }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm text-black/50">{data.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-black">
              <AnimatedCounter value={data.value} suffix={data.suffix} />
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span className={cn('text-xs font-medium', data.changeUp ? 'text-[#1ea64a]' : 'text-red-500')}>
              {data.change}
            </span>
            <span className="text-xs text-black/30">vs last week</span>
          </div>
        </div>
        <div className="rounded-xl bg-[#f7f7f5] p-3">
          <data.icon className="h-5 w-5 text-black/60" />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex w-full min-h-screen bg-white text-black">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
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
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-8"
            >
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-[50px] border border-[#e6e6e6] bg-[#f7f7f5] px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5 text-black/60" />
                    <span className="text-xs font-medium text-black/70">AI Mock Interview Dashboard</span>
                  </div>
                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl text-black">
                    Ready to Ace Your Next Interview, Alex?
                  </h1>
                  <p className="max-w-xl text-base text-black/50">
                    You have completed <span className="font-semibold text-black">24 mock interviews</span> this month.
                    Your average score has improved by <span className="font-semibold text-[#1ea64a]">12%</span>.
                    Keep pushing forward!
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
          <FigmaButton variant="primary" size="lg" asChild>
            <Link href="/interview">
              <Bot className="h-5 w-5" />
              Start Mock Interview
              <ArrowRight className="h-5 w-5" />
            </Link>
          </FigmaButton>
          <FigmaButton variant="secondary" size="lg" asChild>
            <Link href="/resume-upload">
              Upload Resume
            </Link>
          </FigmaButton>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((card, i) => (
                <StatCard key={card.label} data={card} index={i} />
              ))}
            </div>

            {/* Performance + Skill Analysis */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Weekly Progress Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-[16px] border border-[#e6e6e6] bg-white p-6 lg:col-span-2"
              >
                <SectionHeader title="Weekly Performance" subtitle="Your progress over the last 7 days" />
                <div className="mt-8 flex items-end justify-between gap-3">
                  {weeklyData.map((item, i) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                      className="group relative flex flex-1 flex-col items-center gap-2"
                    >
                      <span className="text-xs font-medium text-black/40">{item.day}</span>
                      <div className="relative w-full">
                        <div className="h-32 w-full rounded-lg bg-[#f7f7f5]" />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${item.value}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                          className="absolute bottom-0 left-0 right-0 rounded-lg bg-black/10 transition-all duration-300 group-hover:bg-black/20"
                          style={{ minHeight: '8px' }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f7f7f5] px-2 py-0.5 text-xs text-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {item.value}%
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Skill Analysis - Circular Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Skill Analysis" subtitle="Your skill breakdown" />
                <div className="mt-4 grid grid-cols-2 gap-6">
                  {skillData.slice(0, 4).map((skill, i) => (
                    <div key={skill.label} className="flex flex-col items-center">
                      <CircularProgress
                        value={skill.value}
                        size={90}
                        strokeWidth={5}
                        accentColor={[pastelAccents.lime, pastelAccents.lilac, pastelAccents.mint, pastelAccents.coral][i]}
                      />
                      <span className="mt-2 text-xs text-black/50">{skill.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Interviews + Skill Bars */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Interviews Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-[16px] border border-[#e6e6e6] bg-white p-6 lg:col-span-2"
              >
                <SectionHeader
                  title="Recent Interviews"
                  subtitle="Your latest mock interview results"
                  action={{ label: 'View All', href: '/history' }}
                />
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e6e6e6]">
                        <th className="pb-3 text-left text-xs font-medium text-black/40">Company</th>
                        <th className="pb-3 text-left text-xs font-medium text-black/40">Role</th>
                        <th className="pb-3 text-center text-xs font-medium text-black/40">Score</th>
                        <th className="pb-3 text-left text-xs font-medium text-black/40">Date</th>
                        <th className="pb-3 text-left text-xs font-medium text-black/40">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInterviews.map((row, i) => (
                        <motion.tr
                          key={row.company}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                          className="group border-b border-[#f1f1f1] transition-colors last:border-0 hover:bg-[#f7f7f5]"
                        >
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f7f7f5] text-xs font-bold text-black/60">
                                {row.company.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-black/80">{row.company}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-sm text-black/50">{row.role}</td>
                          <td className="py-3.5 text-center">
                            <span className={cn(
                              'inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-sm font-semibold',
                              row.score >= 90 ? 'bg-[#1ea64a]/10 text-[#1ea64a]' :
                              row.score >= 80 ? 'bg-black/10 text-black' :
                              'bg-yellow-500/10 text-yellow-600'
                            )}>
                              {row.score}%
                            </span>
                          </td>
                          <td className="py-3.5 text-sm text-black/50">{row.date}</td>
                          <td className="py-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#1ea64a]/10 px-2.5 py-0.5 text-xs font-medium text-[#1ea64a]">
                              <CheckCircle className="h-3 w-3" />
                              {row.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Skill Bars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader title="Detailed Skills" subtitle="Performance by category" />
                <div className="mt-4 space-y-5">
                  {skillData.map((skill, i) => (
                    <motion.div
                      key={skill.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm text-black/70">{skill.label}</span>
                        <span className="text-xs font-medium text-black/50">{skill.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f1f1f1]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                          className="h-full rounded-full bg-black/20"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Upcoming Practice + AI Feedback */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Practice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader
                  title="Upcoming Practice"
                  subtitle="Scheduled mock interviews"
                  action={{ label: 'Schedule New', href: '/interview' }}
                />
                <div className="space-y-3">
                  {upcomingPractices.map((item, i) => (
                    <motion.div
                      key={item.company}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.45 + i * 0.08 }}
                      className="group flex items-start gap-4 rounded-[12px] border border-[#f1f1f1] bg-white p-4 transition-all duration-200 hover:border-black/20 hover:bg-[#f7f7f5]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f5] transition-all duration-200 group-hover:bg-[#e6e6e6]">
                        <Calendar className="h-5 w-5 text-black/60" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-black/80">{item.company}</p>
                            <p className="text-xs text-black/40">{item.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-black/70">{item.date}</p>
                            <p className="text-xs text-black/40">{item.time}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Clock className="h-3 w-3 text-black/30" />
                          <span className="text-xs text-black/30">{item.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Feedback Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
              >
                <SectionHeader
                  title="AI Feedback Highlights"
                  subtitle="Recent performance insights"
                  action={{ label: 'Full Report', href: '/feedback' }}
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center rounded-xl bg-[#f7f7f5] p-4">
                    <CircularProgress value={76} size={80} strokeWidth={5} accentColor="#c5b0f4" />
                    <span className="mt-2 text-xs text-black/50">Communication</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-[#f7f7f5] p-4">
                    <CircularProgress value={88} size={80} strokeWidth={5} accentColor="#dceeb1" />
                    <span className="mt-2 text-xs text-black/50">Technical</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-[#f7f7f5] p-4">
                    <CircularProgress value={82} size={80} strokeWidth={5} accentColor="#c8e6cd" />
                    <span className="mt-2 text-xs text-black/50">Confidence</span>
                  </div>
                </div>
                <div className="mt-5 space-y-3 rounded-xl bg-[#f7f7f5] p-4">
                  <p className="text-xs font-mono uppercase tracking-[0.54px] text-black/70">Improvement Suggestions</p>
                  <ul className="space-y-2">
                    {[
                      'Use more structured responses (STAR method)',
                      'Reduce filler words and hesitations',
                      'Practice time management for coding questions',
                    ].map((tip, i) => (
                      <motion.li
                        key={tip}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-black/60"
                      >
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black/40" />
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="Quick Actions" subtitle="Jump to your most-used tools" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Start Interview', icon: Bot, href: '/interview' },
                  { label: 'View Feedback', icon: MessageSquare, href: '/feedback' },
                  { label: 'Practice DSA', icon: Code, href: '/interview' },
                  { label: 'Resume Review', icon: BookOpen, href: '/interview' },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden rounded-[12px] border border-[#e6e6e6] bg-[#f7f7f5] p-4 transition-all duration-200 hover:border-black/20"
                    >
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="rounded-xl bg-white p-3 border border-[#e6e6e6]">
                          <action.icon className="h-5 w-5 text-black/60" />
                        </div>
                        <span className="text-sm font-medium text-black/70 transition-colors group-hover:text-black">{action.label}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="Activity Timeline" subtitle="Your recent activity" />
              <div className="relative mt-4">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#e6e6e6]" />
                <div className="space-y-0">
                  {activityData.map((item, i) => (
                    <motion.div
                      key={item.action}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                      className="group relative flex items-start gap-4 pb-6 last:pb-0"
                    >
                      <div className="relative z-10 mt-1">
                        <div className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 bg-white',
                          item.type === 'interview' ? 'border-[#dceeb1]' :
                          item.type === 'feedback' ? 'border-[#c5b0f4]' :
                          item.type === 'practice' ? 'border-[#c8e6cd]' :
                          'border-[#e6e6e6]'
                        )}>
                          {item.type === 'interview' && <Star className="h-3 w-3 text-black/60" />}
                          {item.type === 'feedback' && <MessageSquare className="h-3 w-3 text-black/60" />}
                          {item.type === 'practice' && <Code className="h-3 w-3 text-black/60" />}
                          {item.type === 'improvement' && <TrendingUp className="h-3 w-3 text-[#1ea64a]" />}
                          {item.type === 'resume' && <BookOpen className="h-3 w-3 text-black/60" />}
                        </div>
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-4 rounded-xl bg-white px-4 py-2.5 transition-all duration-200 group-hover:bg-[#f7f7f5]">
                        <div>
                          <p className="text-sm text-black/70">{item.action}</p>
                          <p className="mt-0.5 text-xs text-black/30">{item.time}</p>
                        </div>
                        {item.score && (
                          <span className={cn(
                            'shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold',
                            item.score >= 90 ? 'bg-[#1ea64a]/10 text-[#1ea64a]' :
                            item.score >= 80 ? 'bg-black/10 text-black' :
                            'bg-yellow-500/10 text-yellow-600'
                          )}>
                            {item.score}%
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="h-8" />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

function DesktopSidebarContent({ collapsed }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-[#e6e6e6]', collapsed ? 'justify-center px-3' : 'px-5')}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-black">
              MockAI
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/dashboard'
                ? 'bg-[#f7f7f5] text-black'
                : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black',
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
          <div className="flex items-center gap-3 rounded-[12px] bg-[#f7f7f5] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-black/80">Alex Johnson</p>
              <p className="truncate text-xs text-black/40">alex@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            A
          </div>
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-black">MockAI</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-black/60 transition-colors hover:bg-[#f7f7f5] hover:text-black"
        >
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
              'flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/dashboard'
                ? 'bg-[#f7f7f5] text-black'
                : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black'
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-[#e6e6e6] p-3">
        <div className="flex items-center gap-3 rounded-[12px] bg-[#f7f7f5] px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-black/80">Alex Johnson</p>
            <p className="truncate text-xs text-black/40">alex@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
