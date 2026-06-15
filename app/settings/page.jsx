'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, History, MessageSquare, BarChart3, Settings, LogOut,
  Brain, User, Bell, Shield, Sun, Moon, Eye,
  Key, Mail, Save, Menu, X, ChevronRight,
  CheckCircle
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

const notificationOptions = [
  { label: 'Email notifications for new feedback', key: 'feedback', enabled: true },
  { label: 'Weekly performance summary', key: 'weekly', enabled: true },
  { label: 'Interview reminders', key: 'reminders', enabled: false },
  { label: 'Product updates and tips', key: 'updates', enabled: false },
]

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        enabled ? 'bg-black' : 'bg-[#e6e6e6]'
      )}
    >
      <span className={cn(
        'inline-block h-4 w-4 rounded-full bg-white transition-transform',
        enabled ? 'translate-x-6' : 'translate-x-1'
      )} />
    </button>
  )
}

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const [profile, setProfile] = useState({ name: 'Alex Johnson', email: 'alex@example.com' })
  const [notifications, setNotifications] = useState(notificationOptions)
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' })
  const [saved, setSaved] = useState(false)

  const toggleNotification = (key) => {
    setNotifications(notifications.map(n => n.key === key ? { ...n, enabled: !n.enabled } : n))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
                  Settings
                </h1>
                <p className="mt-1 text-base text-black/40">Manage your account and preferences</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-[8px] bg-[#f7f7f5] p-2">
                    <User className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Profile Settings</h2>
                    <p className="text-sm text-black/40">Update your personal information</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                    <input
                      type="text" value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email Address</label>
                    <input
                      type="email" value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-[8px] bg-[#f7f7f5] p-2">
                    <Bell className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Notification Preferences</h2>
                    <p className="text-sm text-black/40">Control what notifications you receive</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {notifications.map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <span className="text-sm text-black/70">{item.label}</span>
                      <Toggle enabled={item.enabled} onChange={() => toggleNotification(item.key)} />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-[8px] bg-[#f7f7f5] p-2">
                    <Key className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Change Password</h2>
                    <p className="text-sm text-black/40">Update your account password</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Current Password</label>
                    <input
                      type="password" value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      className="w-full rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">New Password</label>
                      <input
                        type="password" value={passwordData.newPass}
                        onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                        className="w-full rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Confirm New Password</label>
                      <input
                        type="password" value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        className="w-full rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
                className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-[8px] bg-[#f7f7f5] p-2">
                    <Sun className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Theme</h2>
                    <p className="text-sm text-black/40">This design system is fixed to light mode</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-[8px] border border-[#e6e6e6] bg-white px-4 py-3">
                    <Sun className="h-4 w-4 text-black" />
                    <span className="text-sm text-black">Light (default)</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[8px] border border-[#e6e6e6] bg-[#f7f7f5] px-4 py-3 opacity-50">
                    <Moon className="h-4 w-4 text-black" />
                    <span className="text-sm text-black">Dark</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-[50px] bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/80"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-black/60"
                  >
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Changes saved</span>
                  </motion.div>
                )}
              </motion.div>
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
              link.href === '/settings' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black',
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
              link.href === '/settings' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black'
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

function Zap({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
