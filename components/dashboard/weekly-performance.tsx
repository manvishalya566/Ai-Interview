'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy } from 'lucide-react'

const defaultData = [
  { day: 'Mon', value: 10 },
  { day: 'Tue', value: 15 },
  { day: 'Wed', value: 22 },
  { day: 'Thu', value: 35 },
  { day: 'Fri', value: 45 },
  { day: 'Sat', value: 58 },
  { day: 'Sun', value: 84 },
]

function TrendingSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 12L6 8L9 11L14 4" stroke="url(#t-svg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="t-svg" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#22C55E" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function WeeklyPerformance({ weeklyData }: { weeklyData?: typeof defaultData }) {
  const data = weeklyData && weeklyData.length > 0 ? weeklyData : defaultData
  const maxValue = Math.max(...data.map(d => d.value))
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const isBest = (val: number) => val === Math.max(...data.map(d => d.value))

  const w = 700
  const h = 220
  const topPad = 12
  const bottomPad = 4
  const innerH = h - topPad - bottomPad
  const n = data.length
  const step = w / n
  const barW = 32
  const barR = 4

  const dataPoints = data.map((d, i) => ({
    cx: i * step + step / 2,
    cy: topPad + innerH - (d.value / maxValue) * innerH,
    value: d.value,
  }))

  const bezierPath = dataPoints.reduce((acc, p, i, arr) => {
    if (i === 0) return `M${p.cx},${p.cy}`
    const prev = arr[i - 1]
    const cpx1 = (prev.cx + p.cx) / 2
    const cpy1 = prev.cy
    const cpx2 = (prev.cx + p.cx) / 2
    const cpy2 = p.cy
    return `${acc} C${cpx1},${cpy1} ${cpx2},${cpy2} ${p.cx},${p.cy}`
  }, '')

  const areaPath = `${bezierPath} L${w},${h} L0,${h} Z`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm lg:col-span-2"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Weekly Performance</h2>
          <p className="mt-0.5 text-sm text-[#6b6a7a]">Your progress over the last 7 days</p>
        </div>
        {isBest(data[data.length - 1].value) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.8 }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/20 px-3 py-1.5 border border-[#F59E0B]/20"
          >
            <Trophy className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className="text-xs font-bold text-[#F59E0B]">Best</span>
          </motion.div>
        )}
      </div>

      <div ref={ref}>
        <svg
          width="100%"
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="overflow-visible block"
        >
          <defs>
            <linearGradient id="trend-line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF4D9D" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.01" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <line key={pct} x1="0" y1={topPad + (1 - pct / 100) * innerH} x2={w} y2={topPad + (1 - pct / 100) * innerH} stroke="#e8e7f0" strokeWidth="1" />
          ))}

          {/* Area under trend */}
          <motion.path
            d={areaPath}
            fill="url(#area-fill)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* Bars */}
          {data.map((item, i) => {
            const pt = dataPoints[i]
            const barH = (item.value / maxValue) * innerH
            const best = isBest(item.value)
            return (
              <g key={item.day} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                <motion.rect
                  x={pt.cx - barW / 2}
                  y={topPad + innerH - barH}
                  width={barW}
                  height={barH}
                  rx={barR}
                  fill={best ? '#8B5CF6' : '#C084FC'}
                  opacity={best ? 0.6 : 0.3}
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
                  style={{ transformOrigin: `${pt.cx}px ${topPad + innerH}px` }}
                />
                {hoveredIdx === i && (
                  <g>
                    <rect x={pt.cx - 28} y={topPad + innerH - barH - 30} width={56} height={24} rx={6} fill="#1a1a2e" />
                    <text x={pt.cx} y={topPad + innerH - barH - 13} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                      {item.value}%
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Trend line */}
          <motion.path
            d={bezierPath}
            fill="none"
            stroke="url(#trend-line-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {dataPoints.map((pt, i) => (
            <g key={`dot-${i}`}>
              <motion.circle
                cx={pt.cx} cy={pt.cy} r="5"
                fill="white" stroke="#8B5CF6" strokeWidth="2.5"
                initial={{ r: 0 }} animate={isInView ? { r: 5 } : {}}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
              />
              <circle cx={pt.cx} cy={pt.cy} r="9" fill="#C084FC" opacity="0.12" />
            </g>
          ))}
        </svg>

        {/* Day labels */}
        <div className="flex">
          {data.map((item) => (
            <span
              key={item.day}
              className="text-xs font-medium text-[#a0a0b0] text-center"
              style={{ width: `${100 / n}%` }}
            >
              {item.day}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col items-start gap-1.5 border-t border-[#e8e7f0] pt-4 text-sm">
        <div className="flex items-center gap-1.5 font-semibold text-[#0a0a0f]">
          <TrendingSvg />
          Trending up by 5.2% this week
        </div>
        <p className="text-xs text-[#6b6a7a]">
          Showing performance for the last 7 days
        </p>
      </div>
    </motion.div>
  )
}
