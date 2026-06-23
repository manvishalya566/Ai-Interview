'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { useAuth } from '@/hooks/useAuth'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'Start Interview', icon: PlayCircle },
  { href: '/history', label: 'History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '#', label: 'Logout', icon: LogOut },
]

const pastelAccents = {
  lime: '#dceeb1',
  lilac: '#c5b0f4',
  mint: '#c8e6cd',
  coral: '#f3c9b6',
  pink: '#efd4d4',
  cream: '#f4ecd6',
}

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
      <span className="text-2xl font-bold text-foreground">{value}%</span>
      {label && <span className="text-xs text-foreground/50">{label}</span>}
    </div>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-foreground/90">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-foreground/40">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-sm text-foreground/60 transition-colors hover:text-foreground"
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
      className="relative overflow-hidden rounded-[16px] border border-border bg-background p-6 transition-all duration-300 hover:border-foreground/20"
    >
      <div
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: accentColors[data.accent] }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/50">{data.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              <AnimatedCounter value={data.value} suffix={data.suffix} />
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span className={cn('text-xs font-medium', data.changeUp ? 'text-semantic-success' : 'text-red-500')}>
              {data.change}
            </span>
            <span className="text-xs text-foreground/30">vs last week</span>
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3">
          <data.icon className="h-5 w-5 text-foreground/60" />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/stats")
        const data = await res.json()
        if (data.success) {
          setDashboardData(data)
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex items-center gap-2 text-foreground/50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const { stats, weeklyData, skillData, recentInterviews, activityData } = dashboardData || {
    stats: { totalInterviews: 0, averageScore: 0, skillsAssessed: 0, streakDays: 0 },
    weeklyData: [],
    skillData: [],
    recentInterviews: [],
    activityData: [],
  }

  const statsCards = [
    { label: 'Total Interviews', value: stats.totalInterviews, suffix: '', icon: Briefcase, change: `+${Math.min(stats.totalInterviews, 5)}`, changeUp: true, accent: 'lime' },
    { label: 'Average Score', value: stats.averageScore, suffix: '%', icon: Target, change: `+${Math.min(stats.averageScore > 0 ? Math.round(stats.averageScore * 0.05) : 0, 10)}%`, changeUp: stats.averageScore >= 50, accent: 'lilac' },
    { label: 'Skills Assessed', value: stats.skillsAssessed, suffix: '', icon: Award, change: '+0', changeUp: true, accent: 'mint' },
    { label: 'Streak Days', value: stats.streakDays, suffix: '', icon: Zap, change: '+0', changeUp: true, accent: 'coral' },
  ]

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-border  transition-all duration-300 lg:flex',
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
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border  lg:hidden"
            >
              <MobileSidebarContent user={user} onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <DesktopSidebarContent user={user} collapsed={!sidebarOpen} />
      </motion.aside>

      <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-18')}>
        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
// bg-gradient-to-t from-block-pink to-accent
              className="rounded-[24px] border border-border bg-gradient-to-t from-block-pink to-accent  p-8"
            >
              <div className=" items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-[50px] border border-border bg-secondary px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
                    <span className="text-xs font-medium text-foreground/70">AI Mock Interview Dashboard</span>
                  </div>
                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl text-foreground">
                    Ready to Ace Your Next Interview, {user?.name?.split(" ")[0] || "there"}?
                  </h1>
                  <p className=" text-base text-foreground/50">
                    Welcome back, {user?.name || "champion"}. Continue practicing to sharpen your skills
                    and land your dream job!
                  </p>
                </div>
                <div className="flex justify-end gap-3 sm:flex-row mt-4">
          <FigmaButton variant="primary" size="md" className="py-3" asChild>
            <Link href="/interview">
              <Bot className="h-6 w-6 mr-3" />
              Start Interview
              <ArrowRight className="h-5 w-5" />
            </Link>
          </FigmaButton>
          <FigmaButton variant="secondary" size="md" className="py-3" asChild>
            <Link href="/resume-upload">
              Upload Resume
            </Link>
          </FigmaButton>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards?.map((card, i) => (
                <StatCard key={card.label} data={card} index={i} />
              ))}
            </div>

            {/* Performance + Skill Analysis */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Weekly Progress Chart */}
              {weeklyData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-[16px] border border-border bg-background p-6 lg:col-span-2"
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
                        <span className="text-xs font-medium text-foreground/40">{item.day}</span>
                        <div className="relative w-full">
                          <div className="h-32 w-full rounded-lg bg-accent/30"></div>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${item.value}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                            className="absolute bottom-0 left-0 right-0 rounded-lg bg-accent transition-all duration-300 group-hover:bg-foreground/20"
                            style={{ minHeight: '8px' }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              {item.value}%
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Skill Analysis - Circular Progress */}
              {skillData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-[16px] border border-border bg-background p-6"
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
                        <span className="mt-2 text-xs text-foreground/50">{skill.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Recent Interviews + Skill Bars */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Interviews Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-[16px] border border-border bg-background p-6 lg:col-span-2"
              >
                <SectionHeader
                  title="Recent Interviews"
                  subtitle="Your latest mock interview results"
                  action={{ label: 'View All', href: '/history' }}
                />
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-xs font-medium text-foreground/40">Company</th>
                        <th className="pb-3 text-left text-xs font-medium text-foreground/40">Role</th>
                        <th className="pb-3 text-center text-xs font-medium text-foreground/40">Score</th>
                        <th className="pb-3 text-left text-xs font-medium text-foreground/40">Date</th>
                        <th className="pb-3 text-left text-xs font-medium text-foreground/40">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInterviews?.map((row, i) => (
                        <motion.tr
                          key={row.company}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                          className="group border-b border-muted transition-colors last:border-0 hover:bg-secondary"
                        > 
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground/60">
                                {row.company.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-foreground/80">{row.company}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-sm text-foreground/50">{row.role}</td>
                          <td className="py-3.5 text-center">
                            <span className={cn(
                              'inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-sm font-semibold',
                              row.score >= 90 ? 'bg-semantic-success/10 text-semantic-success' :
                              row.score >= 80 ? 'bg-foreground/10 text-foreground' :
                              'bg-yellow-500/10 text-yellow-600'
                            )}>
                              {row.score}%
                            </span>
                          </td>
                          <td className="py-3.5 text-sm text-foreground/50">{row.date}</td>
                          <td className="py-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-semantic-success/10 px-2.5 py-0.5 text-xs font-medium text-semantic-success">
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
              {skillData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="rounded-[16px] border border-border bg-background p-6"
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
                          <span className="text-sm text-foreground/70">{skill.label}</span>
                          <span className="text-xs font-medium text-foreground/50">{skill.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-accent/40">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                            className="h-full rounded-full bg-accent"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* AI Feedback Highlights - from real skill data */}
            {skillData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="rounded-[16px] border border-border bg-background p-6"
              >
                <SectionHeader
                  title="AI Feedback Highlights"
                  subtitle="Recent performance insights"
                  action={{ label: 'Full Report', href: '/feedback' }}
                />
                <div className="grid grid-cols-3 gap-4">
                  {skillData.slice(0, 3).map((m, i) => (
                    <div key={m.label} className="flex flex-col items-center rounded-xl bg-secondary p-4">
                      <CircularProgress
                        value={m.value}
                        size={80}
                        strokeWidth={5}
                        accentColor={[pastelAccents.lilac, pastelAccents.lime, pastelAccents.mint][i]}
                      />
                      <span className="mt-2 text-xs text-foreground/50">{m.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-[16px] border border-border bg-background p-6"
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
                      className="group relative overflow-hidden rounded-[12px] border border-border bg-secondary p-4 transition-all duration-200 hover:border-foreground/20"
                    >
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="rounded-xl bg-background p-3 border border-border">
                          <action.icon className="h-5 w-5 text-foreground/60" />
                        </div>
                        <span className="text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">{action.label}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            {activityData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="rounded-[16px] border border-border bg-background p-6"
              >
                <SectionHeader title="Activity Timeline" subtitle="Your recent activity" />
                <div className="relative mt-4">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
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
                            'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 bg-background',
                            item.type === 'interview' ? 'border-block-lime' :
                            item.type === 'feedback' ? 'border-block-lilac' :
                            item.type === 'practice' ? 'border-block-mint' :
                            'border-border'
                          )}>
                            {item.type === 'interview' && <Star className="h-3 w-3 text-foreground/60" />}
                            {item.type === 'feedback' && <MessageSquare className="h-3 w-3 text-foreground/60" />}
                            {item.type === 'practice' && <Code className="h-3 w-3 text-foreground/60" />}
                            {item.type === 'improvement' && <TrendingUp className="h-3 w-3 text-semantic-success" />}
                            {item.type === 'resume' && <BookOpen className="h-3 w-3 text-foreground/60" />}
                          </div>
                        </div>
                        <div className="flex flex-1 items-start justify-between gap-4 rounded-xl bg-background px-4 py-2.5 transition-all duration-200 group-hover:bg-secondary">
                          <div>
                            <p className="text-sm text-foreground/70">{item.action}</p>
                            <p className="mt-0.5 text-xs text-foreground/30">{item.time}</p>
                          </div>
                          {item.score != null && item.score > 0 && (
                            <span className={cn(
                              'shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold',
                              item.score >= 90 ? 'bg-semantic-success/10 text-semantic-success' :
                              item.score >= 80 ? 'bg-foreground/10 text-foreground' :
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
            )}
            {activityData.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="rounded-[16px] border border-border bg-background p-6"
              >
                <SectionHeader title="Activity Timeline" subtitle="Your recent activity" />
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Activity className="h-10 w-10 text-foreground/20 mb-3" />
                  <p className="text-sm text-foreground/40">No activity yet. Complete your first interview to see it here.</p>
                </div>
              </motion.div>
            )}

            <div className="h-8" />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

function DesktopSidebarContent({ user, collapsed }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U"
  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-border', collapsed ? 'justify-center px-3' : 'px-5')}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground">
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
                ? 'bg-secondary text-foreground'
                : 'text-foreground/50 hover:bg-secondary hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div className={cn('border-t border-border p-3', collapsed && 'flex justify-center')}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-[12px] bg-secondary px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initial}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground/80">{user?.name || "User"}</p>
              <p className="truncate text-xs text-foreground/40">{user?.email || ""}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initial}
          </div>
        )}
      </div>
    </div>
  )
}

function MobileSidebarContent({ user, onClose }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U"
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">MockAI</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
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
                ? 'bg-secondary text-foreground'
                : 'text-foreground/50 hover:bg-secondary hover:text-foreground'
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-[12px] bg-secondary px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initial}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground/80">{user?.name || "User"}</p>
            <p className="truncate text-xs text-foreground/40">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
