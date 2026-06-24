'use client'

import { useState, useRef, useCallback, DragEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Upload, FileText, CheckCircle, X,
  ArrowRight, Sparkles, Brain,
  Code, Database, Users,
  User, Briefcase, Server, Cloud,
  Zap, Cpu,
  Terminal, Loader2, BookMarked,
  Clock, AlertCircle, Menu, ChevronRight,
  Rocket, Shield, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { FigmaButton } from '@/components/ui/figma-button'
import { useAuth } from '@/hooks/useAuth'

interface SkillKeyword {
  keyword: string
  label: string
  category: string
  icon: typeof Code
}

const SKILL_KEYWORDS: SkillKeyword[] = [
  { keyword: 'react', label: 'React', category: 'Frontend', icon: Code },
  { keyword: 'angular', label: 'Angular', category: 'Frontend', icon: Code },
  { keyword: 'vue', label: 'Vue', category: 'Frontend', icon: Code },
  { keyword: 'next.js', label: 'Next.js', category: 'Frontend', icon: Code },
  { keyword: 'typescript', label: 'TypeScript', category: 'Language', icon: Code },
  { keyword: 'javascript', label: 'JavaScript', category: 'Language', icon: Code },
  { keyword: 'python', label: 'Python', category: 'Language', icon: Terminal },
  { keyword: 'java', label: 'Java', category: 'Language', icon: Terminal },
  { keyword: 'node', label: 'Node.js', category: 'Backend', icon: Server },
  { keyword: 'express', label: 'Express', category: 'Backend', icon: Server },
  { keyword: 'graphql', label: 'GraphQL', category: 'API', icon: Zap },
  { keyword: 'rest', label: 'REST APIs', category: 'API', icon: Zap },
  { keyword: 'postgresql', label: 'PostgreSQL', category: 'Database', icon: Database },
  { keyword: 'mongodb', label: 'MongoDB', category: 'Database', icon: Database },
  { keyword: 'mysql', label: 'MySQL', category: 'Database', icon: Database },
  { keyword: 'redis', label: 'Redis', category: 'Database', icon: Database },
  { keyword: 'aws', label: 'AWS', category: 'Cloud', icon: Cloud },
  { keyword: 'docker', label: 'Docker', category: 'DevOps', icon: Cpu },
  { keyword: 'kubernetes', label: 'Kubernetes', category: 'DevOps', icon: Cpu },
  { keyword: 'git', label: 'Git', category: 'Tools', icon: Code },
  { keyword: 'sql', label: 'SQL', category: 'Database', icon: Database },
  { keyword: 'html', label: 'HTML', category: 'Frontend', icon: Code },
  { keyword: 'css', label: 'CSS', category: 'Frontend', icon: Code },
  { keyword: 'tailwind', label: 'Tailwind CSS', category: 'Frontend', icon: Code },
  { keyword: 'flutter', label: 'Flutter', category: 'Mobile', icon: Cpu },
  { keyword: 'react native', label: 'React Native', category: 'Mobile', icon: Cpu },
  { keyword: 'go', label: 'Go', category: 'Language', icon: Terminal },
  { keyword: 'rust', label: 'Rust', category: 'Language', icon: Terminal },
  { keyword: 'c++', label: 'C++', category: 'Language', icon: Terminal },
  { keyword: 'c#', label: 'C#', category: 'Language', icon: Terminal },
]

function extractSkills(text: string): SkillKeyword[] {
  const lower = text.toLowerCase()
  const found = SKILL_KEYWORDS.reduce<SkillKeyword[]>((acc, s) => {
    const regex = new RegExp(`\\b${s.keyword.replace(/[.+*?^${}()|[\]\\]/g, '\\$&')}`, 'i')
    if (regex.test(lower)) {
      if (!acc.find(a => a.label === s.label)) {
        acc.push({ ...s })
      }
    }
    return acc
  }, [])
  return found
}

function extractExperience(text: string): { period: string; role: string; company: string; description: string }[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const expKeywords = ['experience', 'work', 'employment', 'professional', 'career']
  const startIdx = lines.findIndex(l => expKeywords.some(k => l.toLowerCase().includes(k)))
  if (startIdx === -1) return []

  const entries: { period: string; role: string; company: string; description: string }[] = []
  let current: { period: string; role: string; company: string; description: string } = { period: '', role: '', company: '', description: '' }
  for (let i = startIdx + 1; i < Math.min(startIdx + 30, lines.length); i++) {
    const line = lines[i]
    if (line.length < 5) continue
    const dateMatch = line.match(/(\d{4})\s*[-–—to]+\s*(\d{4}|present|current)/i)
    if (dateMatch) {
      if (current.role && current.company) entries.push(current)
      current = { period: line, role: '', company: '', description: '' }
    } else if (current.period && !current.role) {
      const parts = line.split(/[-–—]|at|@|,|\|/).map(s => s.trim()).filter(Boolean)
      current.role = parts[0] || line
      current.company = parts[1] || ''
    } else if (current.role && current.period) {
      current.description = (current.description + ' ' + line).trim()
    }
  }
  if (current.role && current.period) entries.push(current)
  return entries.slice(0, 5)
}

function extractProjects(text: string): { name: string; tech: string; description: string }[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const projKeywords = ['project', 'portfolio', 'key achievement', 'notable work']
  const startIdx = lines.findIndex(l => projKeywords.some(k => l.toLowerCase().includes(k)))
  if (startIdx === -1) return []

  const entries: { name: string; tech: string; description: string }[] = []
  let current: { name: string; tech: string; description: string } = { name: '', tech: '', description: '' }
  for (let i = startIdx + 1; i < Math.min(startIdx + 20, lines.length); i++) {
    const line = lines[i]
    if (line.length < 5) continue
    const techKeywords = ['using', 'built with', 'technologies', 'tech stack', 'react', 'node', 'python', 'aws', 'docker']
    const hasTech = techKeywords.some(k => line.toLowerCase().includes(k))
    if (/^[A-Z][A-Za-z0-9\s\-]{3,40}$/.test(line.trim()) && !hasTech) {
      if (current.name) entries.push(current)
      current = { name: line.trim(), tech: '', description: '' }
    } else if (current.name && !current.tech && hasTech) {
      current.tech = line.trim()
    } else if (current.name) {
      current.description = (current.description + ' ' + line).trim()
    }
  }
  if (current.name) entries.push(current)
  return entries.slice(0, 5)
}

function extractName(text: string): string | null {
  const firstLine = text.split('\n').find(l => l.trim().length > 0)
  if (firstLine) {
    const cleaned = firstLine.replace(/^(resume|cv|curriculum vitae)[:\s]*/i, '').trim()
    if (cleaned.length > 2 && cleaned.length < 60 && !cleaned.includes('http')) return cleaned
  }
  return null
}

function SkillBar({ label, level, icon: Icon, delay = 0 }: { label: string; level: number; icon: typeof Code; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ x: 4, transition: { duration: 0.15 } }}
      className="group flex items-center gap-3 rounded-xl bg-[#f5f0ff] p-3 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
        <Icon className="h-4 w-4 text-[#8B5CF6]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#0a0a0f] truncate">{label}</span>
          <span className="shrink-0 text-xs font-bold text-[#8B5CF6]">{level}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function ResumeUploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [extractedSkills, setExtractedSkills] = useState<SkillKeyword[]>([])
  const [extractedExperience, setExtractedExperience] = useState<{ period: string; role: string; company: string; description: string }[]>([])
  const [extractedProjects, setExtractedProjects] = useState<{ name: string; tech: string; description: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setFile(file); setUploading(true); setError(null)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await fetch('/api/resume-upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setResumeData(data)
        const text = data.extractedText || ''
        setExtractedSkills(extractSkills(text))
        setExtractedExperience(extractExperience(text))
        setExtractedProjects(extractProjects(text))
        setUploading(false); setUploaded(true)
        setTimeout(() => setShowAnalysis(true), 800)
      } else {
        setError(data.message || 'Upload failed')
        setUploading(false)
      }
    } catch {
      setError('Failed to upload resume. Please try again.')
      setUploading(false)
    }
  }

  const handleDragOver = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }, [])
  const handleDragLeave = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }, [])
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFile(droppedFile)
    } else if (droppedFile) {
      setError('Only PDF files are supported')
    }
  }, [])
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f) }

  const handleGenerate = async () => {
    setGenerating(true); setGenerateError(null)
    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeData?.extractedText || '' }),
      })
      const data = await res.json()
      if (data.success && data.questions?.length > 0) {
        sessionStorage.setItem('interviewQuestions', JSON.stringify(data.questions))
        sessionStorage.setItem('interviewResume', resumeData?.extractedText || '')
        setGenerating(false); setGenerated(true)
      } else {
        setGenerateError(data.error || 'Failed to generate questions')
        setGenerating(false)
      }
    } catch {
      setGenerateError('Failed to generate interview. Please try again.')
      setGenerating(false)
    }
  }

  const resetUpload = () => {
    setFile(null); setUploading(false); setUploaded(false); setShowAnalysis(false); setGenerated(false)
    setResumeData(null); setError(null); setGenerateError(null);
    setExtractedSkills([]); setExtractedExperience([]); setExtractedProjects([])
    if (inputRef.current) inputRef.current.value = ''
  }

  const resumeName = resumeData?.fileName || file?.name || 'resume.pdf'
  const candidateName = resumeData?.extractedText ? extractName(resumeData.extractedText) : null

  const suggestedTopics = extractedSkills.length > 0
    ? [...new Set(extractedSkills.map(s => s.category))].map(cat => {
      const count = extractedSkills.filter(s => s.category === cat).length
      const firstSkill = extractedSkills.find(s => s.category === cat)
      return { title: cat, icon: firstSkill?.icon || Code, questions: Math.max(count * 3, 10) }
    })
    : [
      { title: 'Frontend', icon: Code, questions: 20 },
      { title: 'Backend', icon: Server, questions: 18 },
      { title: 'Database', icon: Database, questions: 15 },
      { title: 'System Design', icon: Cpu, questions: 25 },
      { title: 'Behavioral', icon: Users, questions: 12 },
    ]

  const features = [
    { title: 'Resume-Based Questions', description: 'AI generates questions specifically tailored to your resume content and experience level', icon: FileText },
    { title: 'Deep AI Analysis', description: 'Advanced NLP extracts skills, technologies, and experience patterns from your resume', icon: Brain },
    { title: 'Personalized Interview', description: 'Every interview is uniquely crafted based on your background and target role', icon: User },
    { title: 'Instant Feedback', description: 'Get real-time AI feedback on your answers with actionable improvement suggestions', icon: Zap },
  ]

  return (
    <div className="flex min-h-screen bg-[#fcfcff]">
      <DashboardSidebar
        user={user}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-[72px]')}>
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e8e7f0] bg-white/80 backdrop-blur-xl px-4 lg:hidden">
          <button onClick={() => setMobileSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6a7a] hover:bg-[#f0eeff]">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-[#0a0a0f]">MockAI</span>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] shadow-lg shadow-[#C084FC]/30">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-headline text-[#0a0a0f]">Upload Resume</h1>
                  <p className="text-body-sm text-[#6b6a7a]">Get AI-generated interview questions tailored to your resume</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-8 sm:p-10 shadow-sm"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF4D9D]/5 via-[#C084FC]/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="relative z-10 text-center sm:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10 px-4 py-1.5 border border-[#C084FC]/20"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span className="text-[10px] font-bold tracking-widest text-[#8B5CF6] uppercase">AI-Powered Resume Analysis</span>
                </motion.div>
                <h1 className="mb-3 text-headline text-[#0a0a0f]">
                  Upload Your <span className="bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] bg-clip-text text-transparent">Resume</span>
                </h1>
                <p className="mx-auto max-w-2xl text-body-sm text-[#6b6a7a] sm:mx-0">
                  Get AI-generated interview questions tailored to your skills, experience, and projects.
                  Upload your resume and let our AI craft the perfect mock interview.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                  {[
                    { icon: Shield, label: 'PDF Support' },
                    { icon: Zap, label: 'Instant Analysis' },
                    { icon: Brain, label: 'Smart Questions' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className="flex items-center gap-1.5 text-xs text-[#6b6a7a]"
                    >
                      <item.icon className="h-3.5 w-3.5 text-[#22C55E]" />
                      {item.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EF4444]/10">
                    <AlertCircle className="h-4 w-4 text-[#EF4444]" />
                  </div>
                  <p className="flex-1 text-sm text-[#EF4444]">{error}</p>
                  <button onClick={() => setError(null)} className="shrink-0 rounded-lg p-1 text-[#EF4444]/60 hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {!uploaded ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    'group relative cursor-pointer rounded-2xl border-2 border-dashed p-14 sm:p-16 text-center transition-all duration-300',
                    dragOver
                      ? 'border-[#C084FC] bg-gradient-to-br from-[#C084FC]/5 via-[#8B5CF6]/5 to-[#FF4D9D]/5'
                      : 'border-[#e8e7f0] bg-white/50 hover:border-[#C084FC]/40 hover:bg-[#faf9ff]'
                  )}
                >
                  <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                  <motion.div
                    animate={dragOver ? { scale: 1.05 } : { scale: 1 }}
                    className="flex flex-col items-center gap-5"
                  >
                    <motion.div
                      animate={dragOver ? { y: -8 } : { y: 0 }}
                      className="relative"
                    >
                      <div className={cn(
                        'flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300',
                        dragOver
                          ? 'bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-xl shadow-[#C084FC]/30'
                          : 'bg-[#f5f0ff] shadow-sm group-hover:shadow-md group-hover:shadow-[#C084FC]/20'
                      )}>
                        <Upload className={cn('h-8 w-8 transition-all duration-300', dragOver ? 'text-white' : 'text-[#8B5CF6]')} />
                      </div>
                      {dragOver && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#22C55E] shadow-lg"
                        >
                          <CheckCircle className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    <div>
                      <p className="text-lg font-bold text-[#0a0a0f]">
                        {dragOver ? 'Drop your resume here' : 'Drag & drop your resume here'}
                      </p>
                      <p className="mt-1.5 text-sm text-[#6b6a7a]">
                        or <span className="font-semibold text-[#8B5CF6] underline underline-offset-4 decoration-[#C084FC]/30">browse files</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e7f0] bg-white px-4 py-1.5 shadow-sm">
                      <FileText className="h-3.5 w-3.5 text-[#a0a0b0]" />
                      <span className="text-[10px] font-medium tracking-wider text-[#a0a0b0] uppercase">PDF only · Max 10MB</span>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-[#e8e7f0] bg-white p-8 shadow-sm"
                >
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] shadow-lg"
                    >
                      <CheckCircle className="h-10 w-10 text-white" />
                    </motion.div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h3 className="text-lg font-bold text-[#0a0a0f]">Upload Successful</h3>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="rounded-full bg-gradient-to-r from-[#22C55E]/20 to-[#16A34A]/20 px-3 py-0.5 text-[10px] font-bold tracking-wider text-[#22C55E] uppercase"
                        >
                          Verified
                        </motion.div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#8B5CF6]" />
                          <span className="text-sm font-medium text-[#0a0a0f]">{resumeName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#a0a0b0]" />
                          <span className="text-xs text-[#a0a0b0]">Uploaded just now</span>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3 justify-center sm:justify-start">
                        <div className="h-2 flex-1 max-w-[240px] overflow-hidden rounded-full bg-[#f0eeff]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#8B5CF6]">100%</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetUpload}
                      className="shrink-0 rounded-xl border border-[#e8e7f0] bg-white p-2.5 text-[#a0a0b0] transition-all duration-200 hover:border-[#EF4444]/30 hover:bg-[#EF4444]/5 hover:text-[#EF4444]"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3 rounded-xl border border-[#e8e7f0] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6]">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0a0a0f]">Analyzing your resume with AI</p>
                    <p className="text-xs text-[#6b6a7a]">Extracting skills, experience, and more...</p>
                  </div>
                  <div className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-[#f0eeff]">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D9D] to-[#8B5CF6] shadow-md">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#0a0a0f]">AI Analysis Complete</h2>
                      <p className="text-sm text-[#6b6a7a]">
                        {candidateName ? `Resume parsed for ${candidateName}` : 'Our AI has analyzed your resume and extracted the following information'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#0a0a0f]">Extracted Skills</h3>
                        <p className="text-sm text-[#6b6a7a]">{extractedSkills.length} technologies and competencies identified</p>
                      </div>
                    </div>
                    {extractedSkills.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {extractedSkills.map((skill, i) => (
                          <SkillBar key={skill.label} label={skill.label} level={85} icon={skill.icon} delay={0.2 + i * 0.04} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0eeff] mb-3">
                          <Code className="h-6 w-6 text-[#a0a0b0]" />
                        </div>
                        <p className="text-sm font-medium text-[#6b6a7a]">No skills auto-detected</p>
                        <p className="text-xs text-[#a0a0b0] mt-1">Skills will be analyzed during interview generation</p>
                      </div>
                    )}
                  </motion.div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                    >
                      <div className="mb-5 flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#0a0a0f]">Work Experience</h3>
                          <p className="text-sm text-[#6b6a7a]">{extractedExperience.length} positions identified</p>
                        </div>
                      </div>
                      {extractedExperience.length > 0 ? (
                        <div className="space-y-3">
                          {extractedExperience.map((exp, i) => (
                            <motion.div
                              key={exp.role + i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.08 }}
                              whileHover={{ x: 4, transition: { duration: 0.15 } }}
                              className="rounded-xl border border-[#e8e7f0] bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-[#C084FC]/20"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] shadow-sm">
                                    <Briefcase className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0a0a0f]">{exp.role || 'Role'}</p>
                                    {exp.company && <p className="text-xs text-[#6b6a7a]">{exp.company}</p>}
                                    {exp.description && <p className="mt-1.5 text-xs text-[#a0a0b0] leading-relaxed">{exp.description}</p>}
                                  </div>
                                </div>
                                {exp.period && (
                                  <span className="shrink-0 rounded-lg bg-[#f0eeff] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#6b6a7a] uppercase whitespace-nowrap">
                                    {exp.period}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-10 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0eeff] mb-3">
                            <Briefcase className="h-6 w-6 text-[#a0a0b0]" />
                          </div>
                          <p className="text-sm font-medium text-[#6b6a7a]">No experience detected</p>
                          <p className="text-xs text-[#a0a0b0] mt-1">Work experience will be analyzed during interview generation</p>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
                    >
                      <div className="mb-5 flex items-end justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#0a0a0f]">Projects</h3>
                          <p className="text-sm text-[#6b6a7a]">{extractedProjects.length} key projects identified</p>
                        </div>
                      </div>
                      {extractedProjects.length > 0 ? (
                        <div className="space-y-3">
                          {extractedProjects.map((project, i) => (
                            <motion.div
                              key={project.name + i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + i * 0.08 }}
                              whileHover={{ x: 4, transition: { duration: 0.15 } }}
                              className="rounded-xl border border-[#e8e7f0] bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-[#C084FC]/20"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#34D399] to-[#22C55E] shadow-sm">
                                  <Code className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#0a0a0f]">{project.name}</p>
                                  {project.tech && (
                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                      {project.tech.split(/[,;]\s*/).map((t: string) => (
                                        <span key={t} className="rounded-full bg-[#f5f0ff] px-2.5 py-0.5 text-[10px] font-medium text-[#8B5CF6]">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {project.description && <p className="mt-2 text-xs text-[#a0a0b0] leading-relaxed">{project.description}</p>}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-10 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0eeff] mb-3">
                            <Code className="h-6 w-6 text-[#a0a0b0]" />
                          </div>
                          <p className="text-sm font-medium text-[#6b6a7a]">No projects detected</p>
                          <p className="text-xs text-[#a0a0b0] mt-1">Projects will be analyzed during interview generation</p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden rounded-2xl border border-[#e8e7f0] bg-white p-8 sm:p-10 text-center shadow-sm"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-bl from-[#C084FC]/10 to-transparent rounded-full pointer-events-none" />
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] shadow-xl shadow-[#C084FC]/30"
                    >
                      <Bot className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="mb-2 text-headline text-[#0a0a0f]">Ready for Your AI Interview?</h3>
<p className="mb-7 text-sm text-[#6b6a7a] max-w-xl mx-auto">
  Generate a personalized mock interview based on your resume. Our AI will create questions tailored to your skills, experience, and target roles.
</p>
                    {generateError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-sm text-[#EF4444]">
                        {generateError}
                      </motion.p>
                    )}
                    {!generated ? (
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#C084FC]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {generating ? (
                          <><Loader2 className="h-5 w-5 animate-spin" /> Generating Your Interview...</>
                        ) : (
                          <><Sparkles className="h-5 w-5" /> Generate AI Interview <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" /></>
                        )}
                      </button>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                          className="flex items-center gap-2 text-[#22C55E]"
                        >
                          <CheckCircle className="h-6 w-6" />
                          <span className="font-bold text-[#0a0a0f]">Interview Generated Successfully!</span>
                        </motion.div>
                        <button
                          onClick={() => router.push('/interview')}
                          className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#C084FC]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Bot className="h-5 w-5" />
                          Start Interview Now
                          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0f]">Suggested Focus Areas</h2>
                  <p className="text-sm text-[#6b6a7a]">Based on your resume, these are the key areas to focus on</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {suggestedTopics.map((topic, i) => {
                  const gradients = [
                    'from-[#FF4D9D] to-[#FF6BCB]',
                    'from-[#C084FC] to-[#8B5CF6]',
                    'from-[#60A5FA] to-[#3B82F6]',
                    'from-[#34D399] to-[#22C55E]',
                    'from-[#F59E0B] to-[#F97316]',
                  ]
                  return (
                    <motion.div
                      key={topic.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group rounded-2xl bg-[#faf9ff] border border-[#e8e7f0] p-5 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/10 hover:border-[#C084FC]/20"
                    >
                      <div className={cn('mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm transition-all duration-300 group-hover:shadow-lg', gradients[i % gradients.length])}>
                        <topic.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-[#0a0a0f]">{topic.title}</h3>
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <BookMarked className="h-3.5 w-3.5 text-[#a0a0b0]" />
                        <span className="text-xs text-[#a0a0b0]">{topic.questions} questions available</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-[#e8e7f0] bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0f]">Why Upload Your Resume?</h2>
                  <p className="text-sm text-[#6b6a7a]">Unlock the full power of AI-driven interview preparation</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group rounded-2xl border border-[#e8e7f0] bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#C084FC]/10 hover:border-[#C084FC]/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4D9D]/10 via-[#C084FC]/10 to-[#8B5CF6]/10 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-[#C084FC]/20">
                        <feature.icon className="h-6 w-6 text-[#8B5CF6]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#0a0a0f]">{feature.title}</h3>
                        <p className="mt-1 text-sm text-[#6b6a7a] leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
