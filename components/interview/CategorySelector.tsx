'use client'
import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useInterviewStore } from '@/stores/interview-store'
import { Code, Layers, Monitor, Database, User, Cpu, Shield } from 'lucide-react'

const categories = [
  { id: 'dsa', label: 'DSA', icon: Code, desc: 'Data Structures & Algorithms' },
  { id: 'react', label: 'React', icon: Layers, desc: 'React Ecosystem' },
  { id: 'system-design', label: 'System Design', icon: Monitor, desc: 'Architecture & Scale' },
  { id: 'backend', label: 'Backend', icon: Database, desc: 'Server & API' },
  { id: 'hr', label: 'HR', icon: User, desc: 'Behavioral Questions' },
  { id: 'dbms', label: 'DBMS', icon: Cpu, desc: 'Database Management' },
  { id: 'oops', label: 'OOPs', icon: Shield, desc: 'Object Oriented Prog.' },
]

export const CategorySelector = memo(function CategorySelector() {
  const selectedCategory = useInterviewStore((s) => s.selectedCategory)
  const setSelectedCategory = useInterviewStore((s) => s.setSelectedCategory)
  const interviewState = useInterviewStore((s) => s.interviewState)

  const handleSelect = useCallback((id: string) => {
    setSelectedCategory(id)
    if (interviewState !== 'active') {
      useInterviewStore.getState().setQuestionPool([])
      useInterviewStore.getState().setCurrentQIdx(0)
      useInterviewStore.getState().setAskedQuestions([])
    }
  }, [interviewState, setSelectedCategory])

  return (
    <div className="rounded-[16px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-lg p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground/90">Question Categories</h2>
          <p className="mt-1 text-sm text-foreground/40">Select a category to practice specific topics</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(cat.id)}
            className={cn(
              'group relative overflow-hidden rounded-[12px] border p-4 text-left transition-all duration-200',
              selectedCategory === cat.id
                ? 'border-foreground/40 bg-secondary/80'
                : 'border-white/10 bg-background/40 hover:border-foreground/20',
            )}
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="rounded-xl bg-secondary/80 p-2.5 border border-white/10">
                <cat.icon className="h-4 w-4 text-foreground/60" />
              </div>
              <span className="text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
                {cat.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
})
