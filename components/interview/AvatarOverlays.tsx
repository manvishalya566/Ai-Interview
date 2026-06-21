'use client'
import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInterviewStore } from '@/stores/interview-store'

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const BAR_COUNT = 9
const barSeeds = Array.from({ length: BAR_COUNT }, (_, i) => ({
  height: seededRandom(i * 13.37) * 20 + 8,
  duration: seededRandom(i * 7.31) * 0.4 + 0.4,
}))

const statusConfig = {
  idle: { label: 'Standing by', dot: 'bg-white/40', accent: false },
  speaking: { label: 'Speaking', dot: 'bg-accent', accent: true },
  thinking: { label: 'Thinking', dot: 'bg-yellow-400', accent: false },
  listening: { label: 'Listening', dot: 'bg-semantic-success', accent: false },
  loading: { label: 'Loading Avatar', dot: 'bg-yellow-400', accent: false },
  failed: { label: 'Avatar Unavailable', dot: 'bg-red-400', accent: false },
}

interface StatusBadgeProps {
  state: 'speaking' | 'thinking' | 'listening' | 'loading' | 'failed' | 'idle'
  isRecording?: boolean
}

const StatusBadge = memo(function StatusBadge({ state, isRecording }: StatusBadgeProps) {
  const config = statusConfig[state]
  return (
    <div className="absolute left-3 top-3 z-40">
      <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
        <motion.span
          animate={config.accent ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
          className={cn('h-2 w-2 rounded-full', config.dot)}
        />
        <span className="text-xs font-medium text-white">{config.label}</span>
      </div>
      {isRecording && (
        <div className="mt-1 ml-1 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-semantic-success" />
          <span className="text-[10px] text-white/60">REC</span>
        </div>
      )}
    </div>
  )
})

const SpeakingGlow = memo(function SpeakingGlow() {
  const isSpeaking = useInterviewStore((s) => s.isSpeaking)
  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          key="speaking-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-[16px] pointer-events-none z-30"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[16px] ring-2 ring-accent/50 ring-offset-2 ring-offset-background/20"
          />
          <motion.div
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 rounded-[16px] shadow-[0_0_60px_20px_rgba(255,61,139,0.15)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const AudioBars = memo(function AudioBars() {
  const isSpeaking = useInterviewStore((s) => s.isSpeaking)
  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          key="speaking-bars"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 bottom-0 z-30"
        >
          <div className="bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-12 pb-4 px-4">
            <div className="flex items-center justify-center gap-1">
              {barSeeds.map((seed, i) => (
                <motion.span
                  key={i}
                  animate={{ height: [4, seed.height, 4] }}
                  transition={{
                    duration: seed.duration,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                  className={cn(
                    'w-[3px] rounded-full',
                    i % 3 === 1 ? 'bg-accent/90' : 'bg-white/90',
                  )}
                  style={{ height: 4 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const Label = memo(function Label() {
  return (
    <div className="absolute bottom-3 left-3 z-30">
      <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
        <Brain className="h-3.5 w-3.5 text-white" />
        <span className="text-xs font-medium text-white">AI Interviewer</span>
      </div>
    </div>
  )
})

const GradientOverlay = memo(function GradientOverlay() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-30" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-20" />
    </>
  )
})

export function computeAvatarStatus(
  isSpeaking: boolean,
  isGenerating: boolean,
  interviewState: string,
  isLoading: boolean,
  hasError: boolean,
): 'speaking' | 'thinking' | 'listening' | 'loading' | 'failed' | 'idle' {
  if (hasError) return 'failed'
  if (isLoading) return 'loading'
  if (isSpeaking) return 'speaking'
  if (isGenerating) return 'thinking'
  if (interviewState === 'active') return 'listening'
  return 'idle'
}

export { StatusBadge, SpeakingGlow, AudioBars, Label, GradientOverlay }
