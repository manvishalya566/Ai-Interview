'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Lightbulb, Sparkles } from 'lucide-react'

interface InsightData {
  strongest: { label: string; value: number }
  weakest: { label: string; value: number }
  suggested: string
}

const defaultInsights: InsightData = {
  strongest: { label: 'Problem Solving', value: 90 },
  weakest: { label: 'System Design', value: 65 },
  suggested: 'Focus on System Design — it has the biggest impact on senior-level interviews.',
}

export function AIInsights({ data }: { data?: InsightData }) {
  const insights = data || defaultInsights

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#C084FC] to-[#8B5CF6] shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">AI Insights</h2>
      </div>

      <div className="space-y-4">
        {/* Strongest */}
        <div className="rounded-xl bg-gradient-to-r from-[#22C55E]/5 to-[#22C55E]/10 p-3.5 border border-[#22C55E]/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#22C55E]/15">
              <TrendingUp className="h-3.5 w-3.5 text-[#22C55E]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22C55E]">Strongest</span>
          </div>
          <p className="text-sm font-bold text-[#0a0a0f]">{insights.strongest.label}</p>
          <p className="text-xs text-[#6b6a7a] mt-0.5">{insights.strongest.value}% proficiency</p>
        </div>

        {/* Weakest */}
        <div className="rounded-xl bg-gradient-to-r from-[#F59E0B]/5 to-[#F59E0B]/10 p-3.5 border border-[#F59E0B]/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F59E0B]/15">
              <TrendingDown className="h-3.5 w-3.5 text-[#F59E0B]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">Needs Work</span>
          </div>
          <p className="text-sm font-bold text-[#0a0a0f]">{insights.weakest.label}</p>
          <p className="text-xs text-[#6b6a7a] mt-0.5">{insights.weakest.value}% proficiency</p>
        </div>

        {/* Suggested */}
        <div className="rounded-xl bg-gradient-to-r from-[#8B5CF6]/5 to-[#C084FC]/10 p-3.5 border border-[#C084FC]/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#8B5CF6]/15">
              <Target className="h-3.5 w-3.5 text-[#8B5CF6]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]">Suggested Practice</span>
          </div>
          <div className="flex items-start gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-[#F59E0B] mt-0.5 shrink-0" />
            <p className="text-sm text-[#0a0a0f]">{insights.suggested}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
