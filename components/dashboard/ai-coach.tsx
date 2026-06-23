'use client'

import { motion } from 'framer-motion'
import { Sparkles, Stars, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

function MiniAIAssistant() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="relative h-20 w-20 shrink-0"
    >
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <defs>
          <linearGradient id="coach-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="coach-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6BCB" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>

        {/* Body */}
        <rect x="20" y="28" width="40" height="38" rx="16" fill="url(#coach-body)" />

        {/* Eyes */}
        <ellipse cx="33" cy="45" rx="4" ry="5" fill="white" />
        <ellipse cx="47" cy="45" rx="4" ry="5" fill="white" />
        <circle cx="34" cy="46" r="2" fill="#1a1a2e" />
        <circle cx="48" cy="46" r="2" fill="#1a1a2e" />

        {/* Smile */}
        <path d="M35 54 Q40 59 45 54" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Antenna */}
        <line x1="40" y1="28" x2="40" y2="14" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="12" r="5" fill="url(#coach-glow)">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="12" r="2.5" fill="white" opacity="0.6">
          <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Blush */}
        <ellipse cx="28" cy="52" rx="5" ry="3" fill="white" opacity="0.2" />
        <ellipse cx="52" cy="52" rx="5" ry="3" fill="white" opacity="0.2" />
      </svg>
    </motion.div>
  )
}

function ConfettiPiece({ index, color }: { index: number; color: string }) {
  const left = 30 + Math.random() * 40
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2

  return (
    <motion.div
      className="absolute top-0"
      style={{ left: `${left}%` }}
      initial={{ y: -10, opacity: 0, rotate: 0 }}
      animate={{
        y: [0, 60],
        opacity: [0, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    >
      <div className="h-2 w-2 rounded-sm" style={{ background: color }} />
    </motion.div>
  )
}

export function AICoach({ userName }: { userName?: string }) {
  const confettiColors = ['#FF4D9D', '#C084FC', '#8B5CF6', '#F59E0B', '#22C55E', '#FF6BCB']
  const confettiPieces = Array.from({ length: 8 }, (_, i) => i)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-gradient-to-r from-[#f5f0ff] to-white p-6 shadow-sm"
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-[#C084FC]/10 to-[#8B5CF6]/5 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF4D9D]/10 to-[#FF6BCB]/5 blur-3xl" />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiPieces.map((i) => (
          <ConfettiPiece key={i} index={i} color={confettiColors[i % confettiColors.length]} />
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-5">
        <MiniAIAssistant />

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#8B5CF6]">AI Coach</span>
            <Sparkles className="h-3 w-3 text-[#F59E0B]" />
          </div>
          <p className="text-sm leading-relaxed text-[#0a0a0f]">
            You&apos;re improving faster than <span className="font-bold text-[#8B5CF6]">78%</span> of candidates this week{' '}
            <span className="inline-block">
              <PartyPopper className="h-4 w-4 text-[#F59E0B] inline" />
            </span>
          </p>
          <p className="text-xs text-[#6b6a7a]">Keep up the momentum, {userName || 'champion'}!</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C084FC] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#C084FC]/25 transition-all duration-300 hover:shadow-xl"
        >
          <Stars className="h-3.5 w-3.5" />
          View Insights
        </motion.button>
      </div>
    </motion.div>
  )
}
