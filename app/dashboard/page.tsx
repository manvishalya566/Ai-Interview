'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Activity, Sparkles, Bot, MessageSquare, Code, BookOpen, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { HeroSection } from '@/components/dashboard/hero-section'
import { StatCards } from '@/components/dashboard/stat-cards'
import { WeeklyPerformance } from '@/components/dashboard/weekly-performance'
import { SkillAnalysis } from '@/components/dashboard/skill-analysis'
import { AICoach } from '@/components/dashboard/ai-coach'
import { RecentInterviews } from '@/components/dashboard/recent-interviews'
import { DetailedSkills } from '@/components/dashboard/detailed-skills'
import { AIInsights } from '@/components/dashboard/ai-insights'
import { Achievements } from '@/components/dashboard/achievements'

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-[#6b6a7a]">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-sm font-medium text-[#8B5CF6] transition-colors hover:text-[#7C3AED]"
        >
          {action.label}
          <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

function QuickActions() {
  const actions = [
    { label: 'Start Interview', icon: Bot, href: '/interview', gradient: 'from-[#FF4D9D] to-[#FF6BCB]' },
    { label: 'View Feedback', icon: MessageSquare, href: '/feedback', gradient: 'from-[#C084FC] to-[#8B5CF6]' },
    { label: 'Practice DSA', icon: Code, href: '/interview', gradient: 'from-[#60A5FA] to-[#3B82F6]' },
    { label: 'Resume Review', icon: BookOpen, href: '/resume-upload', gradient: 'from-[#34D399] to-[#22C55E]' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
    >
      <SectionHeader title="Quick Actions" subtitle="Jump to your most-used tools" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-xl border border-[#e8e7f0] bg-[#faf9ff] p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#C084FC]/10 hover:border-[#C084FC]/30"
            >
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${action.gradient.replace('from-', '').replace('to-', '')})` }}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#0a0a0f]">{action.label}</span>
              </div>
              <div
                className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20"
                style={{ background: `radial-gradient(circle, ${action.gradient})` }}
              />
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

function ActivityTimeline({ activityData }: { activityData?: any[] }) {
  if (!activityData || activityData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
      >
        <SectionHeader title="Activity Timeline" subtitle="Your recent activity" />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eeff] mb-4">
            <Activity className="h-7 w-7 text-[#a0a0b0]" />
          </div>
          <p className="text-sm font-medium text-[#6b6a7a]">No activity yet</p>
          <p className="text-xs text-[#a0a0b0] mt-1">Complete your first interview to see it here.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
    >
      <SectionHeader title="Activity Timeline" subtitle="Your recent activity" />
      <div className="relative mt-2">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C084FC] via-[#f0eeff] to-transparent" />
        <div className="space-y-0">
          {activityData.map((item, i) => {
            const typeStyles = {
              interview: { bg: 'from-[#FF4D9D] to-[#FF6BCB]', border: 'border-[#FF4D9D]/30', icon: Star },
              feedback: { bg: 'from-[#C084FC] to-[#8B5CF6]', border: 'border-[#C084FC]/30', icon: MessageSquare },
              practice: { bg: 'from-[#60A5FA] to-[#3B82F6]', border: 'border-[#60A5FA]/30', icon: Code },
              improvement: { bg: 'from-[#22C55E] to-[#34D399]', border: 'border-[#22C55E]/30', icon: TrendingUp },
              resume: { bg: 'from-[#F59E0B] to-[#F97316]', border: 'border-[#F59E0B]/30', icon: BookOpen },
            }
            const style = (typeStyles as any)[item.type] || typeStyles.interview
            const Icon = style.icon

            return (
              <motion.div
                key={item.action || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.06 }}
                className="group relative flex items-start gap-4 pb-5 last:pb-0"
              >
                <div className="relative z-10 mt-1">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${style.bg} border-2 border-white shadow-sm`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex flex-1 items-start justify-between gap-4 rounded-xl px-4 py-2.5 transition-all duration-200 group-hover:bg-[#faf9ff]">
                  <div>
                    <p className="text-sm font-medium text-[#0a0a0f]">{item.action}</p>
                    <p className="mt-0.5 text-xs text-[#a0a0b0]">{item.time}</p>
                  </div>
                  {item.score != null && item.score > 0 && (
                    <span className={cn(
                      'shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold',
                      item.score >= 90 ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                      item.score >= 80 ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' :
                      'bg-[#F59E0B]/10 text-[#F59E0B]'
                    )}>
                      {item.score}%
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfcff]">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]"
        >
          <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
        </motion.div>
        <span className="text-sm font-medium text-[#6b6a7a]">Loading your dashboard...</span>
      </div>
    </div>
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
      router.replace('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/stats')
        const data = await res.json()
        if (data.success) {
          setDashboardData(data)
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading || dataLoading) {
    return <LoadingSkeleton />
  }

  if (!user) return null

  const { stats, weeklyData, skillData, recentInterviews, activityData } = dashboardData || {
    stats: { totalInterviews: 0, averageScore: 0, skillsAssessed: 0, streakDays: 0 },
    weeklyData: [],
    skillData: [],
    recentInterviews: [],
    activityData: [],
  }

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
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e8e7f0] bg-white/80 backdrop-blur-xl px-4 lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6a7a] hover:bg-[#f0eeff]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#0a0a0f]">MockAI</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            {/* Hero Section */}
            <HeroSection userName={(user as any)?.name?.split(' ')[0] || 'Manvi'} />

            {/* Stats Cards */}
            <StatCards stats={stats} />

            {/* Weekly Performance + Skill Analysis */}
            <div className="grid gap-6 lg:grid-cols-3">
              <WeeklyPerformance weeklyData={weeklyData} />
              <SkillAnalysis skillData={skillData} />
            </div>

            {/* AI Coach */}
            <AICoach userName={(user as any)?.name?.split(' ')[0] || 'champion'} />

            {/* Recent Interviews + Detailed Skills */}
            <div className="grid gap-6 lg:grid-cols-3">
              <RecentInterviews interviews={recentInterviews} />
              <DetailedSkills skillData={skillData} />
            </div>

            {/* AI Insights + Achievements */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AIInsights />
              <div className="lg:col-span-2">
                <Achievements />
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Activity Timeline */}
            <ActivityTimeline activityData={activityData} />

            <div className="h-6" />
          </div>
        </main>
      </div>
    </div>
  )
}
