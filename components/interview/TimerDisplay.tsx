'use client'
import { memo } from 'react'
import { Clock } from 'lucide-react'
import { useInterviewStore } from '@/stores/interview-store'

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const TimerDisplay = memo(function TimerDisplay() {
  const seconds = useInterviewStore((s) => s.timerSeconds)
  const state = useInterviewStore((s) => s.interviewState)
  const isSpeaking = useInterviewStore((s) => s.isSpeaking)
  const isGenerating = useInterviewStore((s) => s.isGenerating)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-secondary/80 px-3 py-1.5">
          <Clock className="h-4 w-4 text-foreground/60" />
          <span className="font-mono text-sm text-foreground/70">{formatTime(seconds)}</span>
        </div>
        {state === 'active' && !isSpeaking && !isGenerating && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-semantic-success" />
            <span className="text-xs text-foreground/40">Recording</span>
          </div>
        )}
      </div>
    </div>
  )
})
