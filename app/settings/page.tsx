'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Bell, Key, Sun, Moon, Save, CheckCircle, Loader2,
  Menu, Sparkles, Shield, Mail, Lock, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { FigmaButton } from '@/components/ui/figma-button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/use-theme'

interface NotificationItem {
  label: string
  key: string
  enabled: boolean
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300',
        enabled
          ? 'bg-gradient-to-r from-[#FF4D9D] to-[#8B5CF6] shadow-md shadow-[#C084FC]/30'
          : 'bg-[#e8e7f0]'
      )}
    >
      <motion.span
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-shadow',
          enabled && 'shadow-md'
        )}
      />
    </button>
  )
}

const defaultNotifications: NotificationItem[] = [
  { label: 'Email notifications for new feedback', key: 'feedback', enabled: true },
  { label: 'Weekly performance summary', key: 'weekly', enabled: true },
  { label: 'Interview reminders', key: 'reminders', enabled: false },
  { label: 'Product updates and tips', key: 'updates', enabled: false },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications)
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      setProfile({ name: (user as any).name || '', email: (user as any).email || '' })
    }
  }, [user])

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/settings/notifications')
        const data = await res.json()
        if (data.success && data.notifications) {
          setNotifications(defaultNotifications.map(n => ({
            ...n,
            enabled: data.notifications[n.key] ?? n.enabled,
          })))
        }
      } catch {}
    }
    fetchNotifications()
  }, [])

  const toggleNotification = async (key: string) => {
    const updated = notifications.map(n => n.key === key ? { ...n, enabled: !n.enabled } : n)
    setNotifications(updated)
    const payload: Record<string, boolean> = {}
    updated.forEach(n => { payload[n.key] = n.enabled })
    try {
      await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {}
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {}
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwordData.newPass !== passwordData.confirm) {
      setPwMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (passwordData.newPass.length < 6) {
      setPwMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    setPwSaving(true)
    setPwMessage(null)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordData.current, newPassword: passwordData.newPass }),
      })
      const data = await res.json()
      if (data.success) {
        setPwMessage({ type: 'success', text: 'Password updated successfully' })
        setPasswordData({ current: '', newPass: '', confirm: '' })
      } else {
        setPwMessage({ type: 'error', text: data.message || 'Failed to update password' })
      }
    } catch {
      setPwMessage({ type: 'error', text: 'Failed to update password' })
    }
    setPwSaving(false)
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.08 + i * 0.06 } }),
  }

  return (
    <div className="flex min-h-screen bg-[#fcfcff]">
      <DashboardSidebar
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-[72px]')}>
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e8e7f0] bg-white/80 backdrop-blur-xl px-4 lg:hidden">
          <button onClick={() => setMobileSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6a7a] hover:bg-[#f0eeff]">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-[#0a0a0f]">MockAI</span>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/30">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-headline text-[#0a0a0f]">Settings</h1>
                  <p className="text-body-sm text-[#6b6a7a]">Manage your account and preferences</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#FF6BCB] shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0f]">Profile Settings</h2>
                  <p className="text-sm text-[#6b6a7a]">Update your personal information</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="group">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#0a0a0f] mb-1.5">
                    <User className="h-3.5 w-3.5 text-[#6b6a7a]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-xl border border-[#e8e7f0] bg-[#fcfcff] px-4 py-3 text-sm text-[#0a0a0f] placeholder:text-[#a0a0b0] transition-all duration-200 focus:border-[#C084FC]/50 focus:bg-white focus:shadow-md focus:shadow-[#C084FC]/10 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#0a0a0f] mb-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#6b6a7a]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-xl border border-[#e8e7f0] bg-[#fcfcff] px-4 py-3 text-sm text-[#0a0a0f] placeholder:text-[#a0a0b0] transition-all duration-200 focus:border-[#C084FC]/50 focus:bg-white focus:shadow-md focus:shadow-[#C084FC]/10 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <FigmaButton variant="primary" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </FigmaButton>
                <AnimatePresence>
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-1.5 text-sm text-[#22C55E]"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Changes saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C084FC] to-[#8B5CF6] shadow-sm">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0f]">Notification Preferences</h2>
                  <p className="text-sm text-[#6b6a7a]">Control what notifications you receive</p>
                </div>
              </div>
              <div className="space-y-1">
                {notifications.map((item) => (
                  <motion.div
                    key={item.key}
                    whileHover={{ x: 2 }}
                    className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-[#faf9ff]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300',
                        item.enabled ? 'bg-[#C084FC]/10' : 'bg-[#f0eeff]'
                      )}>
                        <Bell className={cn('h-4 w-4', item.enabled ? 'text-[#8B5CF6]' : 'text-[#a0a0b0]')} />
                      </div>
                      <span className="text-sm text-[#0a0a0f]">{item.label}</span>
                    </div>
                    <Toggle enabled={item.enabled} onChange={() => toggleNotification(item.key)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] shadow-sm">
                  <Sun className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0f]">Theme</h2>
                  <p className="text-sm text-[#6b6a7a]">Choose between light and dark mode</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 px-5 py-3 transition-all duration-300",
                    theme === 'light'
                      ? "border-[#C084FC]/30 bg-gradient-to-r from-[#C084FC]/5 to-[#8B5CF6]/5 shadow-sm"
                      : "border-[#e8e7f0] bg-[#f0eeff] opacity-60 hover:opacity-90"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#F97316] shadow-sm">
                    <Sun className="h-4 w-4 text-white" />
                  </div>
                  <span className={cn("text-sm font-semibold", theme === 'light' ? "text-[#0a0a0f]" : "text-[#6b6a7a]")}>Light</span>
                  {theme === 'light' && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#22C55E] to-[#16A34A]">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 px-5 py-3 transition-all duration-300",
                    theme === 'dark'
                      ? "border-[#C084FC]/30 bg-gradient-to-r from-[#C084FC]/5 to-[#8B5CF6]/5 shadow-sm"
                      : "border-[#e8e7f0] bg-[#f0eeff] opacity-60 hover:opacity-90"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a0a0f]">
                    <Moon className="h-4 w-4 text-white" />
                  </div>
                  <span className={cn("text-sm font-semibold", theme === 'dark' ? "text-[#0a0a0f]" : "text-[#6b6a7a]")}>Dark</span>
                  {theme === 'dark' && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#22C55E] to-[#16A34A]">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] shadow-sm">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0f]">Change Password</h2>
                  <p className="text-sm text-[#6b6a7a]">Update your account password</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="group">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#0a0a0f] mb-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#6b6a7a]" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full rounded-xl border border-[#e8e7f0] bg-[#fcfcff] px-4 py-3 text-sm text-[#0a0a0f] placeholder:text-[#a0a0b0] transition-all duration-200 focus:border-[#C084FC]/50 focus:bg-white focus:shadow-md focus:shadow-[#C084FC]/10 focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-[#0a0a0f] mb-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#6b6a7a]" />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPass}
                      onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                      className="w-full rounded-xl border border-[#e8e7f0] bg-[#fcfcff] px-4 py-3 text-sm text-[#0a0a0f] placeholder:text-[#a0a0b0] transition-all duration-200 focus:border-[#C084FC]/50 focus:bg-white focus:shadow-md focus:shadow-[#C084FC]/10 focus:outline-none"
                      placeholder="Min. 6 characters"
                    />
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-[#0a0a0f] mb-1.5">
                      <Shield className="h-3.5 w-3.5 text-[#6b6a7a]" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      className="w-full rounded-xl border border-[#e8e7f0] bg-[#fcfcff] px-4 py-3 text-sm text-[#0a0a0f] placeholder:text-[#a0a0b0] transition-all duration-200 focus:border-[#C084FC]/50 focus:bg-white focus:shadow-md focus:shadow-[#C084FC]/10 focus:outline-none"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <FigmaButton variant="secondary" onClick={handleChangePassword} disabled={pwSaving}>
                    {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                    Update Password
                  </FigmaButton>
                  <AnimatePresence>
                    {pwMessage && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn('text-sm', pwMessage.type === 'success' ? 'text-[#22C55E]' : 'text-[#EF4444]')}
                      >
                        {pwMessage.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
