'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SkillData {
  label: string
  value: number
}

const defaultSkills: SkillData[] = [
  { label: 'React Hooks', value: 82 },
  { label: 'Technical Comm.', value: 74 },
  { label: 'Problem Solving', value: 88 },
]

function CircularRing({ value, label, index }: { value: number; label: string; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const size = 120
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const gradients = [
    { from: '#FF4D9D', to: '#FF6BCB' },
    { from: '#C084FC', to: '#8B5CF6' },
    { from: '#60A5FA', to: '#3B82F6' },
  ]
  const g = gradients[index % gradients.length]

  return (
    <div ref={ref} className="flex flex-col items-center gap-2.5 group">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90 drop-shadow-sm">
          <defs>
            <linearGradient id={`ring-grad-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
            <filter id={`ring-glow-${index}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f0eeff"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#ring-grad-${index})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.5, delay: 0.3 + index * 0.15, ease: 'easeOut' }}
            filter={`url(#ring-glow-${index})`}
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.15 }}
            className="text-xl font-bold tracking-tight text-[#0a0a0f]"
          >
            {value}%
          </motion.span>
        </div>
      </div>

      <span className="text-xs font-medium text-[#6b6a7a] text-center leading-tight">{label}</span>
    </div>
  )
}

export function SkillAnalysis({ skillData }: { skillData?: SkillData[] }) {
  const data = skillData && skillData.length > 0 ? skillData.slice(0, 3) : defaultSkills

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Skill Analysis</h2>
        <p className="mt-0.5 text-sm text-[#6b6a7a]">Your skill breakdown</p>
      </div>

      <div className="flex flex-col items-center gap-5">
        {data.map((skill, i) => (
          <CircularRing key={skill.label} value={skill.value} label={skill.label} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
