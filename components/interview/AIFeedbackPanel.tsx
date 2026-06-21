'use client'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { useInterviewStore } from '@/stores/interview-store'

const feedbackData = [
  { label: 'Confidence', value: 82 },
  { label: 'Communication', value: 76 },
  { label: 'Technical Accuracy', value: 88 },
  { label: 'Eye Contact', value: 70 },
  { label: 'Speaking Speed', value: 85 },
]

export const AIFeedbackPanel = memo(function AIFeedbackPanel() {
  const errorMessage = useInterviewStore((s) => s.errorMessage)
  const isGenerating = useInterviewStore((s) => s.isGenerating)

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/70">Live AI Analysis</h3>
          <Bot className="h-4 w-4 text-foreground/60" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {feedbackData.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group rounded-xl bg-secondary/60 p-3 transition-all duration-200 hover:bg-border/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-foreground/40">{item.label}</span>
                <span className="text-xs font-semibold text-foreground/70">{item.value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-background/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full bg-foreground/30"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {errorMessage && !isGenerating && (
        <div className="rounded-[16px] border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-4">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}
    </div>
  )
})
