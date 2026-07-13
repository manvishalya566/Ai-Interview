'use client'

import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle, Clock, CalendarClock, Inbox } from 'lucide-react'
import Link from 'next/link'

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    Completed: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', icon: CheckCircle },
    'In Progress': { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', icon: Clock },
    Scheduled: { bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]', icon: CalendarClock },
  }
  const c = config[status] || config.Completed
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${c.bg} px-2.5 py-0.5 text-xs font-medium ${c.text}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  if (score === 0) return <span className="text-xs text-[#a0a0b0]">—</span>

  const color = score >= 90
    ? 'text-[#22C55E] bg-[#22C55E]/10'
    : score >= 80
    ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
    : 'text-[#F59E0B] bg-[#F59E0B]/10'

  return (
    <span className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-sm font-bold ${color}`}>
      {score}%
    </span>
  )
}

export function RecentInterviews({ interviews }: { interviews?: any[] }) {
  const data = interviews && interviews.length > 0 ? interviews : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm lg:col-span-2"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Recent Interviews</h2>
          <p className="mt-0.5 text-sm text-[#6b6a7a]">Your latest mock interview results</p>
        </div>
        {data.length > 0 && (
          <Link href="/history">
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-1 text-sm font-medium text-[#8B5CF6] transition-colors hover:text-[#7C3AED]"
            >
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </motion.div>
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eeff] mb-4">
            <Inbox className="h-7 w-7 text-[#a0a0b0]" />
          </div>
          <p className="text-sm font-medium text-[#6b6a7a]">No interviews yet</p>
          <p className="text-xs text-[#a0a0b0] mt-1">Complete your first interview to see results here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0eeff]">
                <th className="pb-3 pl-6 text-left text-xs font-semibold uppercase tracking-wider text-[#a0a0b0]">Company</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a0a0b0]">Role</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#a0a0b0]">Score</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a0a0b0]">Date</th>
                <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-[#a0a0b0]">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <motion.tr
                  key={`${row.company}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                  className="group border-b border-[#f0eeff] transition-colors last:border-0 hover:bg-[#faf9ff]"
                >
                  <td className="py-3.5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6d28d9] text-xs font-bold text-white shadow-sm`}>
                        {row.company ? row.company.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span className="text-sm font-semibold text-[#0a0a0f]">{row.company || 'General'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-sm text-[#6b6a7a]">{row.role || 'Mock Interview'}</td>
                  <td className="py-3.5 text-center">
                    <ScoreBadge score={row.score} />
                  </td>
                  <td className="py-3.5 text-sm text-[#6b6a7a]">{row.date || 'N/A'}</td>
                  <td className="py-3.5 pr-6">
                    <StatusPill status={row.status || 'Completed'} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
