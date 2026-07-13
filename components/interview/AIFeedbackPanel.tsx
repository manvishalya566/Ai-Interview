'use client'
import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Loader2 } from 'lucide-react'
import { useInterviewStore } from '@/stores/interview-store'

const METRICS = [
  'Communication',
  'Confidence',
  'Technical Accuracy',
  'Eye Contact',
  'Speaking Speed',
] as const

export const AIFeedbackPanel = memo(function AIFeedbackPanel() {
  const interviewState = useInterviewStore((s) => s.interviewState)
  const isGenerating = useInterviewStore((s) => s.isGenerating)
  const errorMessage = useInterviewStore((s) => s.errorMessage)
  const [analysisData, setAnalysisData] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    if (interviewState === 'completed' && !isGenerating) {
      const fetchAnalysis = async () => {
        try {
          const res = await fetch('/api/interview/history')
          const data = await res.json()
          if (data.success && data.interviews?.length > 0) {
            const last = data.interviews[0]
            if (last.scores) {
              setAnalysisData(last.scores)
            } else if (last.skillBreakdown) {
              const map: Record<string, number> = {}
              last.skillBreakdown.forEach((s: any) => {
                if (s.name && s.score != null) map[s.name] = s.score
              })
              setAnalysisData(map)
            }
          }
        } catch {
          // silent — analysis fetch is best-effort
        }
      }
      fetchAnalysis()
    }
  }, [interviewState, isGenerating])

  if (interviewState === 'idle') {
    return (
      <div className="space-y-4">
        <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/70">Live AI Analysis</h3>
            <Bot className="h-4 w-4 text-foreground/60" />
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/60">
              <Bot className="h-5 w-5 text-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground/60">Waiting for interview to begin</p>
            <p className="mt-1 text-xs text-foreground/40">Analysis will appear once you start speaking.</p>
          </div>
        </div>
      </div>
    )
  }

  if (interviewState === 'active' || interviewState === 'paused') {
    return (
      <div className="space-y-4">
        <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/70">Live AI Analysis</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-[10px] font-medium text-yellow-500 tracking-wide uppercase">Analyzing</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="group rounded-xl bg-secondary/60 p-3 transition-all duration-200 hover:bg-border/50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-foreground/40">{label}</span>
                  <span className="text-xs font-semibold text-foreground/40">--</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-background/50">
                  <motion.div
                    className="h-full rounded-full bg-foreground/10"
                    style={{ width: '100%' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-[16px] border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-4">
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/70">Live AI Analysis</h3>
            <Bot className="h-4 w-4 text-foreground/60" />
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="mb-3 h-6 w-6 animate-spin text-foreground/40" />
            <p className="text-sm font-medium text-foreground/60">Analyzing your responses...</p>
            <p className="mt-1 text-xs text-foreground/40">AI is evaluating your interview performance.</p>
          </div>
        </div>
      </div>
    )
  }

  if (analysisData) {
    return (
      <div className="space-y-4">
        <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/70">Live AI Analysis</h3>
            <Bot className="h-4 w-4 text-foreground/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map((label, i) => {
              const value = analysisData[label] ?? 0
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="group rounded-xl bg-secondary/60 p-3 transition-all duration-200 hover:bg-border/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-foreground/40">{label}</span>
                    <span className="text-xs font-semibold text-foreground/70">{value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-background/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                      className="h-full rounded-full bg-foreground/30"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/70">Live AI Analysis</h3>
          <Bot className="h-4 w-4 text-foreground/60" />
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Loader2 className="mb-3 h-6 w-6 animate-spin text-foreground/40" />
          <p className="text-sm font-medium text-foreground/60">Loading analysis...</p>
        </div>
      </div>
    </div>
  )
})
