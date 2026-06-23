'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, FileJson, Type, Server, Lightbulb } from 'lucide-react'

interface SkillData {
  label: string
  value: number
}

const defaultSkills: SkillData[] = [
  { label: 'React', value: 85 },
  { label: 'JavaScript', value: 78 },
  { label: 'TypeScript', value: 72 },
  { label: 'System Design', value: 65 },
  { label: 'Problem Solving', value: 90 },
]

const skillIcons: Record<string, any> = {
  React: Code2,
  JavaScript: FileJson,
  TypeScript: Type,
  'System Design': Server,
  'Problem Solving': Lightbulb,
}

const skillGradients: Record<string, { from: string; to: string }> = {
  React: { from: '#FF4D9D', to: '#FF6BCB' },
  JavaScript: { from: '#C084FC', to: '#8B5CF6' },
  TypeScript: { from: '#60A5FA', to: '#3B82F6' },
  'System Design': { from: '#34D399', to: '#22C55E' },
  'Problem Solving': { from: '#F59E0B', to: '#F97316' },
}

function SkillBar({ skill, index }: { skill: SkillData; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const Icon = skillIcons[skill.label] || Code2
  const grad = skillGradients[skill.label] || { from: '#C084FC', to: '#8B5CF6' }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: `${grad.from}15` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: grad.from }} />
          </div>
          <span className="text-sm font-medium text-[#0a0a0f]">{skill.label}</span>
        </div>
        <span className="text-xs font-bold text-[#6b6a7a]">{skill.value}%</span>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full bg-[#f0eeff]">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.value}%` } : {}}
          transition={{ duration: 1, delay: 0.6 + index * 0.08, ease: 'easeOut' }}
          className="relative h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
            boxShadow: `0 0 12px ${grad.from}40`,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-white/20" style={{ width: '30%' }} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function DetailedSkills({ skillData }: { skillData?: SkillData[] }) {
  const data = skillData && skillData.length > 0 ? skillData.slice(0, 5) : defaultSkills

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold tracking-tight text-[#0a0a0f]">Detailed Skills</h2>
        <p className="mt-0.5 text-sm text-[#6b6a7a]">Performance by category</p>
      </div>

      <div className="space-y-4">
        {data.map((skill, i) => (
          <SkillBar key={skill.label} skill={skill} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
