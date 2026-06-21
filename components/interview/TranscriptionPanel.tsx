'use client'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { useInterviewStore } from '@/stores/interview-store'

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const WAVEFORM_COUNT = 40
const waveformSeeds = Array.from({ length: WAVEFORM_COUNT }, (_, i) => ({
  height: seededRandom(i * 17.73) * 24 + 4,
  duration: seededRandom(i * 11.59) * 0.4 + 0.6,
}))

export const TranscriptionPanel = memo(function TranscriptionPanel() {
  const transcript = useInterviewStore((s) => s.transcript)
  const interviewState = useInterviewStore((s) => s.interviewState)
  const isActive = interviewState === 'active'

  return (
    <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground/70">Live Transcription</h3>
        {isActive && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-xs text-foreground">Live</span>
          </div>
        )}
      </div>
      <div className="min-h-[80px] rounded-xl bg-secondary/60 p-4">
        {interviewState === 'idle' ? (
          <p className="text-sm italic text-foreground/30">
            Your response will appear here once you start the interview...
          </p>
        ) : (
          <p className="text-sm text-foreground/70">
            {transcript || 'Waiting for response...'}
          </p>
        )}
      </div>

      {isActive && (
        <div className="mt-3 flex items-center gap-0.5">
          {waveformSeeds.map((seed, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, seed.height, 4] }}
              transition={{
                duration: seed.duration,
                repeat: Infinity,
                delay: i * 0.05,
                ease: 'easeInOut',
              }}
              className="w-1 rounded-full bg-foreground/30"
              style={{ height: 4 }}
            />
          ))}
        </div>
      )}
    </div>
  )
})
