'use client'

import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle, Clock, CalendarClock } from 'lucide-react'
import Link from 'next/link'

const defaultInterviews = [
  { company: 'Google', role: 'Frontend Engineer', score: 92, date: '2024-12-15', status: 'Completed', logoBg: 'from-blue-500 to-blue-600' },
  { company: 'Stripe', role: 'Full Stack Dev', score: 88, date: '2024-12-12', status: 'Completed', logoBg: 'from-purple-500 to-violet-600' },
  { company: 'Meta', role: 'React Developer', score: 76, date: '2024-12-10', status: 'Completed', logoBg: 'from-sky-500 to-cyan-600' },
  { company: 'Apple', role: 'iOS Engineer', score: 0, date: '2024-12-20', status: 'Scheduled', logoBg: 'from-gray-500 to-gray-600' },
  { company: 'Netflix', role: 'UI Engineer', score: 0, date: 'In Progress', status: 'In Progress', logoBg: 'from-red-500 to-rose-600' },
]

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

const companyLogos: Record<string, string> = {
  Google: 'G',
  Stripe: 'S',
  Meta: 'M',
  Apple: 'A',
  Netflix: 'N',
}

export function RecentInterviews({ interviews }: { interviews?: typeof defaultInterviews }) {
  const data = interviews && interviews.length > 0 ? interviews : defaultInterviews

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
        <Link href="/history">
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-1 text-sm font-medium text-[#8B5CF6] transition-colors hover:text-[#7C3AED]"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.div>
        </Link>
      </div>

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
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${row.logoBg} text-xs font-bold text-white shadow-sm`}>
                      {companyLogos[row.company] || row.company.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-[#0a0a0f]">{row.company}</span>
                  </div>
                </td>
                <td className="py-3.5 text-sm text-[#6b6a7a]">{row.role}</td>
                <td className="py-3.5 text-center">
                  <ScoreBadge score={row.score} />
                </td>
                <td className="py-3.5 text-sm text-[#6b6a7a]">{row.date}</td>
                <td className="py-3.5 pr-6">
                  <StatusPill status={row.status} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
