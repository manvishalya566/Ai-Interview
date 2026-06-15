'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  LayoutDashboard, History, MessageSquare, BarChart3, Settings, LogOut,
  Brain, Target, Clock, Users,
  Code, Star, Activity, Zap,
  X, Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/ui/footer'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'Start Interview', icon: Zap },
  { href: '/history', label: 'History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/login', label: 'Logout', icon: LogOut },
]

const statCards = [
  { label: 'Total Interviews', value: 48, icon: Briefcase, change: '+12%', color: '#dceeb1' },
  { label: 'Average Score', value: '84%', icon: Target, change: '+5%', color: '#c5b0f4' },
  { label: 'Current Streak', value: '7 days', icon: Activity, change: '+2', color: '#f4ecd6' },
  { label: 'Skills Mastered', value: '12', icon: Star, change: '+3', color: '#c8e6cd' },
]

const weeklyData = [
  { day: 'Mon', value: 65 }, { day: 'Tue', value: 70 }, { day: 'Wed', value: 68 },
  { day: 'Thu', value: 75 }, { day: 'Fri', value: 82 }, { day: 'Sat', value: 78 }, { day: 'Sun', value: 85 },
]

const skillData = [
  { name: 'DSA', score: 91, fullMark: 100 },
  { name: 'React', score: 88, fullMark: 100 },
  { name: 'Backend', score: 78, fullMark: 100 },
  { name: 'DBMS', score: 72, fullMark: 100 },
  { name: 'System Design', score: 68, fullMark: 100 },
  { name: 'Behavioral', score: 74, fullMark: 100 },
]

const scoreDistribution = [
  { range: '90-100%', count: 8, color: '#c8e6cd' },
  { range: '80-89%', count: 14, color: '#dceeb1' },
  { range: '70-79%', count: 12, color: '#f4ecd6' },
  { range: '60-69%', count: 10, color: '#f3c9b6' },
  { range: 'Below 60%', count: 4, color: '#efd4d4' },
]

const improvements = [
  { area: 'System Design', suggestion: 'Focus on distributed systems case studies', impact: 'High', icon: Code },
  { area: 'Behavioral', suggestion: 'Practice STAR method with real examples', impact: 'High', icon: Users },
  { area: 'Time Management', suggestion: 'Use timed practice sessions', impact: 'Medium', icon: Clock },
  { area: 'Communication', suggestion: 'Record and review your responses', impact: 'Medium', icon: MessageSquare },
]

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
  const [sidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Weekly')

  return (
    <div className="flex w-full min-h-screen bg-white text-black">
      {mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className={cn(
          'fixed left-0 top-0 z-30 hidden h-full flex-col border-r border-[#e6e6e6] bg-white transition-all duration-300 lg:flex',
          mobileSidebarOpen && '!flex'
        )}
        >
          {mobileSidebarOpen && (
            <motion.div
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#e6e6e6] bg-white lg:hidden"
            >
              <MobileSidebarContent onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          )}
          <DesktopSidebarContent collapsed={!sidebarOpen} />
        </motion.aside>

        <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-18')}>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              >
                <h1 className="text-[26px] font-[540] text-black" style={{ letterSpacing: '-0.26px' }}>
                  Analytics
                </h1>
                <p className="mt-1 text-base text-black/40">Track your interview performance over time</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="rounded-[24px] border border-[#e6e6e6] bg-white p-4"
                    style={{ borderLeft: `4px solid ${stat.color}` }}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f7f7f5]">
                      <stat.icon className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-2xl font-bold text-black">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-black/40">{stat.label}</p>
                      <span className="text-xs font-medium text-black/60">{stat.change}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
                  className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-black">Performance Chart</h2>
                      <p className="text-sm text-black/40">Score trend over time</p>
                    </div>
                    <div className="flex gap-2">
                      {['Weekly', 'Monthly'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            'rounded-[50px] px-4 py-1.5 text-sm font-medium transition-all',
                            activeTab === tab ? 'bg-black text-white' : 'bg-[#f7f7f5] text-black/60 hover:bg-[#e6e6e6]'
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
                          <div className="absolute bottom-0 left-0 right-0 h-full rounded-[8px] bg-[#f7f7f5]" />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${d.value}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                            className="absolute bottom-0 left-0 right-0 rounded-[8px] bg-black transition-all duration-300"
                            style={{ minHeight: '12px' }}
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-black px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                              {d.value}%
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs font-medium text-black/40">{d.day}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
                  className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-black">Skill Breakdown</h2>
                    <p className="text-sm text-black/40">Your proficiency across skills</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    {skillData.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-black">{skill.name}</span>
                          <span className="text-sm font-medium text-black">{skill.score}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-[#f1f1f1]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.score}%` }}
                            transition={{ duration: 1, delay: 0.45 + i * 0.06, ease: 'easeOut' }}
                            className="h-full rounded-full bg-black"
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
                  className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-black">Score Distribution</h2>
                    <p className="text-sm text-black/40">How your scores are distributed</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    {scoreDistribution.map((item, i) => (
                      <motion.div
                        key={item.range}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                        className="flex items-center gap-3"
                      >
                        <span className="w-20 text-sm text-black/60">{item.range}</span>
                        <div className="flex-1 h-6 rounded-[8px] bg-[#f7f7f5] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / 48) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                            className="h-full rounded-[8px]"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-medium text-black">{item.count}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}
                  className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                >
                  <div>
                    <h2 className="text-lg font-bold text-black">Improvement Suggestions</h2>
                    <p className="text-sm text-black/40">Areas to focus on</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    {improvements.map((item, i) => (
                      <motion.div
                        key={item.area}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                        className="rounded-[8px] border border-[#e6e6e6] bg-white p-4 transition-colors hover:bg-[#f7f7f5]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-black" />
                            <span className="text-sm font-medium text-black">{item.area}</span>
                          </div>
                          <span className={cn(
                            'rounded-[50px] px-2 py-0.5 text-xs font-medium',
                            item.impact === 'High' ? 'bg-[#efd4d4] text-black' : 'bg-[#f4ecd6] text-black'
                          )}>
                            {item.impact}
                          </span>
                        </div>
                        <p className="text-xs text-black/50 ml-6">{item.suggestion}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
    </div>
  )
}

function DesktopSidebarContent({ collapsed }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-[#e6e6e6]', collapsed ? 'justify-center px-3' : 'px-5')}>
        <button className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-black">MockAI</span>}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-3 rounded-[50px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/analytics' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black',
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
        <button className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-black">MockAI</span>
        </button>
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
              link.href === '/analytics' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black'
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
