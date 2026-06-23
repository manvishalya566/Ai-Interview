'use client'

import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, Target, Crown, Star } from 'lucide-react'

interface Achievement {
  icon: any
  label: string
  description: string
  gradient: string
  glow: string
  unlocked: boolean
}

const achievements: Achievement[] = [
  {
    icon: Trophy,
    label: 'Top Performer',
    description: 'Rank in the top 10%',
    gradient: 'from-[#F59E0B] to-[#F97316]',
    glow: 'rgba(245, 158, 11, 0.3)',
    unlocked: true,
  },
  {
    icon: Flame,
    label: '14 Day Streak',
    description: 'Practice for 14 days straight',
    gradient: 'from-[#EF4444] to-[#F97316]',
    glow: 'rgba(239, 68, 68, 0.3)',
    unlocked: true,
  },
  {
    icon: Zap,
    label: 'Fast Learner',
    description: 'Improve by 20% in a week',
    gradient: 'from-[#8B5CF6] to-[#C084FC]',
    glow: 'rgba(139, 92, 246, 0.3)',
    unlocked: true,
  },
  {
    icon: Target,
    label: 'Interview Ready',
    description: 'Score 80%+ on 5 interviews',
    gradient: 'from-[#22C55E] to-[#34D399]',
    glow: 'rgba(34, 197, 94, 0.3)',
    unlocked: false,
  },
]

function AchievementBadge({ badge, index }: { badge: Achievement; index: number }) {
  const Icon = badge.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.55 + index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-xl border p-3.5 transition-all duration-300 ${
        badge.unlocked
          ? 'bg-white border-[#e8e7f0] hover:shadow-lg hover:shadow-[#C084FC]/10 hover:border-[#C084FC]/30'
          : 'bg-[#faf9ff] border-[#e8e7f0] opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badge.gradient} shadow-lg`}
          style={{ boxShadow: `0 4px 12px ${badge.glow}` }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold ${badge.unlocked ? 'text-[#0a0a0f]' : 'text-[#a0a0b0]'}`}>
              {badge.label}
            </span>
            {badge.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 1 + index * 0.1 }}
              >
                <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
              </motion.div>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#6b6a7a] truncate">{badge.description}</p>
        </div>
      </div>

      {!badge.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="rounded-full bg-[#e8e7f0] px-2.5 py-0.5">
            <span className="text-[10px] font-semibold text-[#a0a0b0]">Locked</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function Achievements() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-5">
        <Crown className="h-5 w-5 text-[#F59E0B]" />
        <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Achievements</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((badge, i) => (
          <AchievementBadge key={badge.label} badge={badge} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
