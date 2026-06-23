'use client'
import { useState, useRef, useCallback } from 'react'
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
  Clock, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'

const SKILL_KEYWORDS = [
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

function extractSkills(text) {
  const lower = text.toLowerCase()
  const found = SKILL_KEYWORDS.reduce((acc, s) => {
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

function extractExperience(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const expKeywords = ['experience', 'work', 'employment', 'professional', 'career']
  const startIdx = lines.findIndex(l => expKeywords.some(k => l.toLowerCase().includes(k)))
  if (startIdx === -1) return []

  const entries = []
  let current = {}
  for (let i = startIdx + 1; i < Math.min(startIdx + 30, lines.length); i++) {
    const line = lines[i]
    if (line.length < 5) continue

    const dateMatch = line.match(/(\d{4})\s*[-–—to]+\s*(\d{4}|present|current)/i)

    if (dateMatch) {
      if (current.role && current.company) {
        entries.push(current)
      }
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

function extractProjects(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const projKeywords = ['project', 'portfolio', 'key achievement', 'notable work']
  const startIdx = lines.findIndex(l => projKeywords.some(k => l.toLowerCase().includes(k)))
  if (startIdx === -1) return []

  const entries = []
  let current = {}
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

function extractName(text) {
  const firstLine = text.split('\n').find(l => l.trim().length > 0)
  if (firstLine) {
    const cleaned = firstLine.replace(/^(resume|cv|curriculum vitae)[:\s]*/i, '').trim()
    if (cleaned.length > 2 && cleaned.length < 60 && !cleaned.includes('http')) {
      return cleaned
    }
  }
  return null
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-card-title text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-body-sm text-foreground/40">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group flex items-center gap-1 text-body-sm text-foreground/60 transition-colors hover:text-foreground">
          {action.label}
        </Link>
      )}
    </div>
  )
}

function SkillBar({ label, level, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group flex items-center gap-3 rounded-md bg-secondary p-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background">
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-body-sm font-medium text-foreground truncate">{label}</span>
          <span className="shrink-0 text-body-sm font-medium text-foreground/50">{level}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-background">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function ResumeUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [resumeData, setResumeData] = useState(null)
  const [extractedSkills, setExtractedSkills] = useState([])
  const [extractedExperience, setExtractedExperience] = useState([])
  const [extractedProjects, setExtractedProjects] = useState([])
  const [error, setError] = useState(null)
  const [generateError, setGenerateError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
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

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }, [])
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }, [])
  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFile(droppedFile)
    } else if (droppedFile) {
      setError('Only PDF files are supported')
    }
  }, [])
  const handleFileSelect = (e) => { const f = e.target.files[0]; if (f) handleFile(f) }

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
      return {
        title: cat,
        icon: firstSkill?.icon || Code,
        questions: Math.max(count * 3, 10),
      }
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
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="rounded-lg border border-border bg-background p-8 sm:p-12"
      >
        <div className="text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-pill bg-secondary px-3 py-1"
          >
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
            <span className="text-eyebrow text-foreground">AI-Powered Resume Analysis</span>
          </motion.div>
          <h1 className="mb-3 text-headline text-foreground">
            Upload Your <span className="text-foreground/70">Resume</span>
          </h1>
          <p className="mx-auto max-w-2xl text-body text-foreground/50 sm:mx-0">
            Get AI-generated interview questions tailored to your skills, experience, and projects.
            Upload your resume and let our AI craft the perfect mock interview.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
            <div className="flex items-center gap-2 text-body-sm text-foreground/40">
              <CheckCircle className="h-4 w-4 text-foreground/60" />
              PDF Support
            </div>
            <div className="flex items-center gap-2 text-body-sm text-foreground/40">
              <CheckCircle className="h-4 w-4 text-foreground/60" />
              Instant Analysis
            </div>
            <div className="flex items-center gap-2 text-body-sm text-foreground/40">
              <CheckCircle className="h-4 w-4 text-foreground/60" />
              Smart Questions
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p className="text-body-sm text-red-300">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto shrink-0 text-red-400 hover:text-red-300">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
      >
        {!uploaded ? (
          <div
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'group relative cursor-pointer rounded-md border-2 border-dashed p-12 text-center transition-all duration-300',
              dragOver ? 'border-foreground bg-secondary' : 'border-border bg-secondary hover:border-foreground/30'
            )}
          >
            <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
            <motion.div animate={dragOver ? { scale: 1.1 } : { scale: 1 }} className="flex flex-col items-center gap-4">
              <div className={cn('rounded-md bg-background p-4 transition-all duration-300', dragOver && 'scale-110')}>
                <Upload className={cn('h-8 w-8 transition-all duration-300', dragOver ? 'text-foreground' : 'text-foreground/60')} />
              </div>
              <div>
                <p className="text-body-lg font-semibold text-foreground">
                  {dragOver ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </p>
                <p className="mt-1 text-body-sm text-foreground/40">
                  or <span className="font-medium text-foreground underline underline-offset-2">browse files</span>
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-pill border border-border bg-background px-4 py-1.5">
                <FileText className="h-3.5 w-3.5 text-foreground/40" />
                <span className="text-eyebrow text-foreground/40">PDF only \u00b7 Max 10MB</span>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-border bg-background p-8"
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-block-mint"
              >
                <CheckCircle className="h-10 w-10 text-foreground" />
              </motion.div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-card-title text-foreground">Upload Successful</h3>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                    className="rounded-pill bg-block-mint px-2.5 py-0.5 text-eyebrow text-foreground"
                  >
                    Verified
                  </motion.div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-foreground/60" />
                    <span className="text-body-sm font-medium text-foreground/70">{resumeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-foreground/40" />
                    <span className="text-body-sm text-foreground/40">Uploaded just now</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 justify-center sm:justify-start">
                  <div className="h-1.5 flex-1 max-w-[200px] overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: '100%' }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <span className="text-eyebrow text-foreground/60">100%</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={resetUpload}
                className="shrink-0 rounded-pill border border-border bg-background p-2.5 text-foreground/40 transition-colors hover:border-foreground/30 hover:bg-block-pink hover:text-foreground"
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
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-3 rounded-lg border border-border bg-background p-4"
          >
            <Loader2 className="h-5 w-5 animate-spin text-foreground" />
            <span className="text-body-sm text-foreground/70">Analyzing your resume with AI...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Brain className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-card-title text-foreground">AI Analysis Complete</h2>
                <p className="text-body-sm text-foreground/40">
                  {candidateName ? `Resume parsed for ${candidateName}` : 'Our AI has analyzed your resume and extracted the following information'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-lg border border-border bg-background p-6"
            >
              <SectionHeader title="Extracted Skills" subtitle={`${extractedSkills.length} technologies and competencies identified from your resume`} />
              {extractedSkills.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {extractedSkills.map((skill, i) => (
                    <SkillBar key={skill.label} label={skill.label} level={85} icon={skill.icon} delay={0.2 + i * 0.04} />
                  ))}
                </div>
              ) : (
                <p className="text-body-sm text-foreground/40 italic">No specific skills could be auto-detected. Skills will be analyzed during interview generation.</p>
              )}
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-lg border border-border bg-background p-6"
              >
                <SectionHeader title="Work Experience" subtitle={`${extractedExperience.length} positions identified`} />
                {extractedExperience.length > 0 ? (
                  <div className="space-y-4">
                    {extractedExperience.map((exp, i) => (
                      <motion.div
                        key={exp.role + i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="rounded-md border border-border bg-background p-4 transition-colors hover:bg-secondary"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                              <Briefcase className="h-4 w-4 text-foreground" />
                            </div>
                            <div>
                              <p className="text-body-sm font-medium text-foreground">{exp.role || 'Role'}</p>
                              {exp.company && <p className="text-eyebrow text-foreground/40">{exp.company}</p>}
                            </div>
                          </div>
                          {exp.period && <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-eyebrow text-foreground/40">{exp.period}</span>}
                        </div>
                        {exp.description && <p className="mt-2 ml-12 text-eyebrow text-foreground/50">{exp.description}</p>}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-sm text-foreground/40 italic">Work experience will be analyzed during interview generation.</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-lg border border-border bg-background p-6"
              >
                <SectionHeader title="Projects" subtitle={`${extractedProjects.length} key projects identified`} />
                {extractedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {extractedProjects.map((project, i) => (
                      <motion.div
                        key={project.name + i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.08 }}
                        className="rounded-md border border-border bg-background p-4 transition-colors hover:bg-secondary"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                            <Code className="h-4 w-4 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-medium text-foreground">{project.name}</p>
                            {project.tech && (
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                {project.tech.split(/[,;]\s*/).map((t) => (
                                  <span key={t} className="rounded-pill bg-secondary px-2 py-0.5 text-eyebrow text-foreground/40">{t}</span>
                                ))}
                              </div>
                            )}
                            {project.description && <p className="mt-2 text-eyebrow text-foreground/50">{project.description}</p>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-sm text-foreground/40 italic">Projects will be analyzed during interview generation.</p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-lg border border-border bg-background p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-primary">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-headline text-foreground">Ready for Your AI Interview?</h3>
              <p className="mb-6 text-body-sm text-foreground/50 max-w-lg mx-auto">
                Generate a personalized mock interview based on your resume. Our AI will create questions
                tailored to your skills, experience, and target roles.
              </p>
              {generateError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-body-sm text-red-400">
                  {generateError}
                </motion.p>
              )}
              {!generated ? (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-pill bg-primary px-8 py-4 text-button text-primary-foreground transition-colors hover:bg-foreground/80 disabled:opacity-50"
                >
                  {generating ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Generating Your Interview...</>
                  ) : (
                    <><Sparkles className="h-5 w-5" /> Generate AI Interview</>
                  )}
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Interview Generated Successfully!</span>
                  </div>
                  <button
                    onClick={() => router.push('/interview')}
                    className="inline-flex items-center gap-2 rounded-pill bg-primary px-8 py-4 text-button text-primary-foreground transition-colors hover:bg-foreground/80"
                  >
                    <Bot className="h-5 w-5" />
                    <span>Start Interview Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Suggested Focus Areas" subtitle="Based on your resume, these are the key areas to focus on" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {suggestedTopics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              className="rounded-md bg-secondary p-5 transition-colors hover:bg-border"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-background">
                <topic.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-center text-card-title text-foreground">{topic.title}</h3>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <BookMarked className="h-3.5 w-3.5 text-foreground/40" />
                <span className="text-eyebrow text-foreground/40">{topic.questions} questions available</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-lg border border-border bg-background p-6"
      >
        <SectionHeader title="Why Upload Your Resume?" subtitle="Unlock the full power of AI-driven interview preparation" />
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
              className="rounded-md border border-border bg-background p-6 transition-colors hover:bg-secondary"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-body-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-body-sm text-foreground/50 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  )
}
