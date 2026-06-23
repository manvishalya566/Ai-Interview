'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, PlayCircle, History, MessageSquare,
  BarChart3, Settings, Brain, Sparkles, Crown, LogOut, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'Start Interview', icon: PlayCircle },
  { href: '/history', label: 'History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ href, label, icon: Icon, collapsed }: {
  href: string
  label: string
  icon: any
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: collapsed ? 0 : 4 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10 text-[#8B5CF6] shadow-sm'
            : 'text-[#6b6a7a] hover:bg-[#f5f0ff] hover:text-[#0a0a0f]'
        )}
      >
        {isActive && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <div className={cn(
          'relative z-10 flex items-center gap-3',
          collapsed && 'justify-center'
        )}>
          <div className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
            isActive
              ? 'bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] text-white shadow-lg shadow-[#C084FC]/30'
              : 'bg-[#f0eeff] text-[#6b6a7a] group-hover:bg-[#e8e5ff]'
          )}>
            <Icon className="h-4 w-4" />
          </div>
          {!collapsed && <span className="relative z-10">{label}</span>}
        </div>
      </motion.div>
    </Link>
  )
}

export function DashboardSidebar({ user, collapsed, onToggle, mobileOpen, onMobileClose }: {
  user?: any
  collapsed?: boolean
  onToggle?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'
  const pathname = usePathname()

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white/80 backdrop-blur-xl border-r border-[#e8e7f0]">
      <div className={cn(
        'flex h-[72px] items-center border-b border-[#e8e7f0]',
        collapsed ? 'justify-center px-3' : 'px-5'
      )}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/30"
          >
            <Brain className="h-5 w-5 text-white" />
          </motion.div>
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-[#0a0a0f]">MockAI</span>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
              </motion.div>
            </div>
          )}
        </Link>
        {mobileOpen && (
          <button onClick={onMobileClose} className="ml-auto rounded-lg p-1.5 text-[#6b6a7a] hover:bg-[#f0eeff] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => (
          <div key={item.href} onClick={mobileOpen ? onMobileClose : undefined}>
            <NavItem {...item} collapsed={collapsed} />
          </div>
        ))}
      </nav>

      <div className={cn(
        'border-t border-[#e8e7f0] p-3',
        collapsed && 'flex justify-center'
      )}>
        {!collapsed ? (
          <motion.div
            whileHover={{ y: -2 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f5f0ff] to-[#f0eeff] p-3 transition-all duration-300 hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D9D]/5 to-[#8B5CF6]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] text-sm font-bold text-white shadow-md">
                  {initial}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] border-2 border-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-[#0a0a0f]">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-[#6b6a7a]">{user?.email || ''}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] px-2 py-0.5">
                <Crown className="h-3 w-3 text-white" />
                <span className="text-[10px] font-bold tracking-tight text-white">PRO</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] text-sm font-bold text-white shadow-md">
              {initial}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-full overflow-hidden transition-all duration-300 lg:block'
        )}
      >
        {sidebarContent}
      </motion.aside>

      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </>
  )
}
