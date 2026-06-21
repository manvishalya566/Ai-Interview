'use client'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader2, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInterviewStore } from '@/stores/interview-store'
import { TimerDisplay } from '@/components/interview/TimerDisplay'
import { InterviewControls } from '@/components/interview/InterviewControls'
import { FigmaButton } from '@/components/interview/FigmaButton'

export const QuestionCard = memo(function QuestionCard({
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
  const questionPool = useInterviewStore((s) => s.questionPool)
  const currentQIdx = useInterviewStore((s) => s.currentQIdx)
  const currentQuestion = questionPool[currentQIdx] || null
  const isSpeaking = useInterviewStore((s) => s.isSpeaking)
  const isGenerating = useInterviewStore((s) => s.isGenerating)
  const interviewState = useInterviewStore((s) => s.interviewState)
  const errorMessage = useInterviewStore((s) => s.errorMessage)
  const totalAsked = currentQIdx + 1

  return (
    <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
      <div className="flex items-center justify-between">
        <TimerDisplay />
        <div className="flex items-center gap-2">
          <InterviewControls
            onStart={onStart}
            onNext={onNext}
            onEnd={onEnd}
            onRetry={onRetry}
          />
        </div>
      </div>

      <div className="mt-4">
        {currentQuestion ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                currentQuestion.difficulty === 'Easy' ? 'bg-semantic-success/10 text-semantic-success' :
                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                'bg-foreground/10 text-foreground'
              )}>
                {currentQuestion.difficulty}
              </span>
              <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-foreground/70">
                {currentQuestion.topic}
              </span>
              <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-foreground/70">
                Q{totalAsked}
              </span>
            </div>

            {isSpeaking && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[16px] bg-secondary/60 p-5"
              >
                <p className="text-lg leading-relaxed text-foreground/80">
                  {currentQuestion.question}
                </p>
              </motion.div>
            )}

            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 flex items-center gap-2 text-sm text-foreground/40"
              >
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </div>
                AI is speaking...
              </motion.div>
            )}
          </>
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Brain className="h-10 w-10 text-foreground/30" />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground/60">AI is thinking...</p>
              <p className="mt-1 text-sm text-foreground/30">Generating a tailored question for you</p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="h-2 w-2 rounded-full bg-foreground/30"
                />
              ))}
            </div>
          </div>
        ) : interviewState === 'active' ? (
          <div className="py-10 text-center">
            {errorMessage ? (
              <div className="space-y-3">
                <p className="text-foreground/50">{errorMessage}</p>
                <FigmaButton icon={RefreshCcw} onClick={onRetry}>
                  Retry
                </FigmaButton>
              </div>
            ) : (
              <p className="text-foreground/30">Preparing your interview...</p>
            )}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-foreground/30">Press &quot;Start Interview&quot; to begin</p>
          </div>
        )}
      </div>
    </div>
  )
})
