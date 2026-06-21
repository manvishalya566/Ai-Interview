'use client'
import { memo } from 'react'
import { Play, SkipForward, Loader2, Square, Repeat } from 'lucide-react'
import { useInterviewStore } from '@/stores/interview-store'
import { FigmaButton } from '@/components/interview/FigmaButton'

export const InterviewControls = memo(function InterviewControls({
  onStart,
  onNext,
  onEnd,
  onRetry,
}: {
  onStart: () => void
  onNext: () => void
  onEnd: () => void
  onRetry?: () => void
}) {
  const errorMessage = useInterviewStore((s) => s.errorMessage)

  if (errorMessage) {
    return (
      <FigmaButton icon={Repeat} onClick={onRetry}>
        Retry
      </FigmaButton>
    )
  }
  const state = useInterviewStore((s) => s.interviewState)
  const isGenerating = useInterviewStore((s) => s.isGenerating)

  if (state === 'idle') {
    return (
      <FigmaButton icon={Play} onClick={onStart} disabled={isGenerating}>
        {isGenerating ? 'Starting...' : 'Start Interview'}
      </FigmaButton>
    )
  }

  if (state === 'active') {
    return (
      <div className="flex items-center gap-2">
        <FigmaButton variant="secondary" onClick={() => useInterviewStore.getState().incrementRepeatCount()} disabled={isGenerating}>
          <Repeat className="h-5 w-5" />
          Repeat
        </FigmaButton>
        <FigmaButton
          variant="secondary"
          icon={isGenerating ? Loader2 : SkipForward}
          onClick={onNext}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Next'}
        </FigmaButton>
        <FigmaButton variant="danger" icon={Square} onClick={onEnd} disabled={isGenerating}>
          End
        </FigmaButton>
      </div>
    )
  }

  return null
})
