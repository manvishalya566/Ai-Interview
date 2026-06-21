'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Key, Sun, Moon, Save, CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { FigmaButton } from '@/components/ui/figma-button'

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
        enabled ? 'bg-primary' : 'bg-border'
      )}
    >
      <span className={cn(
        'inline-block h-4 w-4 rounded-full bg-background transition-transform',
        enabled ? 'translate-x-6' : 'translate-x-1'
      )} />
    </button>
  )
}

export default function SettingsPage() {
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
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        <h1 className="text-headline text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-body text-foreground/40">Manage your account and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-secondary p-2">
            <User className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-card-title text-foreground">Profile Settings</h2>
            <p className="text-body-sm text-foreground/40">Update your personal information</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text" value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">Email Address</label>
            <input
              type="email" value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-secondary p-2">
            <Bell className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-card-title text-foreground">Notification Preferences</h2>
            <p className="text-body-sm text-foreground/40">Control what notifications you receive</p>
          </div>
        </div>
        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <span className="text-body-sm text-foreground/70">{item.label}</span>
              <Toggle enabled={item.enabled} onChange={() => toggleNotification(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-secondary p-2">
            <Key className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-card-title text-foreground">Change Password</h2>
            <p className="text-body-sm text-foreground/40">Update your account password</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">Current Password</label>
            <input
              type="password" value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-body-sm font-medium text-foreground mb-1">New Password</label>
              <input
                type="password" value={passwordData.newPass}
                onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-foreground mb-1">Confirm New Password</label>
              <input
                type="password" value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-body-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-secondary p-2">
            <Sun className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-card-title text-foreground">Theme</h2>
            <p className="text-body-sm text-foreground/40">This design system is fixed to light mode</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
            <Sun className="h-4 w-4 text-foreground" />
            <span className="text-body-sm text-foreground">Light (default)</span>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-secondary px-4 py-3 opacity-50">
            <Moon className="h-4 w-4 text-foreground" />
            <span className="text-body-sm text-foreground">Dark</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center gap-4"
      >
        <FigmaButton variant="primary" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Changes
        </FigmaButton>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-body-sm text-foreground/60"
          >
            <CheckCircle className="h-4 w-4" />
            Changes saved
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  )
}
