'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Bot, History, MessageSquare,
  Upload, FileText, CheckCircle, X, Menu,
  ChevronRight, ArrowRight, Sparkles, Brain,
  Code, Database, Layers, Users,
  User, Briefcase, Server, Cloud,
  Zap, Shield, BarChart3, Cpu,
  Globe, Terminal, BookOpen, Lightbulb,
  ChevronLeft, Loader2, BookMarked,
  GraduationCap, Star, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'Start Interview', icon: Bot },
  { href: '/history', label: 'History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
]

const navigationLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/interview', label: 'Interview' },
  { href: '/history', label: 'History' },
  { href: '/feedback', label: 'Feedback' },
]

const extractedSkills = [
  { label: 'React.js', category: 'Frontend', level: 95, icon: Code },
  { label: 'Node.js', category: 'Backend', level: 88, icon: Server },
  { label: 'Python', category: 'Language', level: 82, icon: Terminal },
  { label: 'PostgreSQL', category: 'Database', level: 78, icon: Database },
  { label: 'TypeScript', category: 'Language', level: 90, icon: Code },
  { label: 'AWS', category: 'Cloud', level: 75, icon: Cloud },
  { label: 'Docker', category: 'DevOps', level: 72, icon: Cpu },
  { label: 'GraphQL', category: 'API', level: 80, icon: Layers },
]

const extractedExperience = [
  { role: 'Senior Frontend Engineer', company: 'Tech Corp', period: '2023 - Present', description: 'Led migration to micro-frontend architecture' },
  { role: 'Full Stack Developer', company: 'StartupX', period: '2021 - 2023', description: 'Built scalable RESTful APIs and React UIs' },
  { role: 'Software Engineer Intern', company: 'BigTech Inc', period: '2020 - 2021', description: 'Developed internal tools using Node.js & React' },
]

const extractedProjects = [
  { name: 'E-Commerce Platform', tech: 'React, Node.js, PostgreSQL', description: 'Full-stack online marketplace with real-time payments' },
  { name: 'AI Chat Assistant', tech: 'Python, TensorFlow, FastAPI', description: 'Conversational AI with NLP capabilities' },
  { name: 'DevOps Dashboard', tech: 'React, Docker, AWS', description: 'Real-time infrastructure monitoring dashboard' },
]

const suggestedTopics = [
  { title: 'React', icon: Code, questions: 24 },
  { title: 'Node.js', icon: Server, questions: 18 },
  { title: 'DBMS', icon: Database, questions: 15 },
  { title: 'DSA', icon: Cpu, questions: 30 },
  { title: 'HR Questions', icon: Users, questions: 12 },
]

const features = [
  { title: 'Resume-Based Questions', description: 'AI generates questions specifically tailored to your resume content and experience level', icon: FileText },
  { title: 'Deep AI Analysis', description: 'Advanced NLP extracts skills, technologies, and experience patterns from your resume', icon: Brain },
  { title: 'Personalized Interview', description: 'Every interview is uniquely crafted based on your background and target role', icon: User },
  { title: 'Instant Feedback', description: 'Get real-time AI feedback on your answers with actionable improvement suggestions', icon: Zap },
]

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-black/40">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group flex items-center gap-1 text-sm text-black/60 transition-colors hover:text-black">
          {action.label}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
      className="group flex items-center gap-3 rounded-[8px] bg-[#f7f7f5] p-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-white">
        <Icon className="h-4 w-4 text-black" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-black truncate">{label}</span>
          <span className="shrink-0 text-xs font-medium text-black/50">{level}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-black"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function ResumeUploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const inputRef = useRef(null)

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true) }, [])
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false) }, [])
  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') handleFile(droppedFile)
  }, [])
  const handleFileSelect = (e) => { const f = e.target.files[0]; if (f) handleFile(f) }
  const handleFile = (file) => {
    setFile(file); setUploading(true)
    setTimeout(() => { setUploading(false); setUploaded(true); setTimeout(() => setShowAnalysis(true), 800) }, 2000)
  }
  const handleGenerate = () => { setGenerating(true); setTimeout(() => { setGenerating(false); setGenerated(true) }, 2500) }
  const resetUpload = () => {
    setFile(null); setUploading(false); setUploaded(false); setShowAnalysis(false); setGenerated(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex w-full min-h-screen bg-white text-black">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-[#e6e6e6] bg-white transition-all duration-300 lg:flex',
          mobileSidebarOpen && '!flex'
        )}
      >
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#e6e6e6] bg-white lg:hidden"
            >
              <MobileSidebarContent onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <DesktopSidebarContent collapsed={!sidebarOpen} />
      </motion.aside>

      <div className={cn('flex flex-1 flex-col transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-18')}>
        <header className="sticky top-0 z-30 border-b border-[#e6e6e6] bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-[50px] p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden rounded-[50px] p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black lg:block"
              >
                {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-black sm:inline">MockAI</span>
              </Link>
              <div className="ml-2 hidden items-center gap-1 md:flex">
                {navigationLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-[50px] px-3 py-1.5 text-sm font-medium text-black/50 transition-all hover:bg-[#f7f7f5] hover:text-black">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 md:flex">
                <div className="text-right">
                  <p className="text-xs text-black/40">Ready to upload</p>
                  <p className="text-sm font-medium text-black">Alex</p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">A</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-8 sm:p-12"
            >
              <div className="text-center sm:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="mb-5 inline-flex items-center gap-2 rounded-[50px] bg-[#f7f7f5] px-3 py-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-black" />
                  <span className="text-xs font-medium text-black">AI-Powered Resume Analysis</span>
                </motion.div>
                <h1 className="mb-3 text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
                  Upload Your <span className="text-black/70">Resume</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-black/50 sm:mx-0">
                  Get AI-generated interview questions tailored to your skills, experience, and projects.
                  Upload your resume and let our AI craft the perfect mock interview.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-2 text-sm text-black/40">
                    <CheckCircle className="h-4 w-4 text-black/60" />
                    PDF Support
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/40">
                    <CheckCircle className="h-4 w-4 text-black/60" />
                    Instant Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/40">
                    <CheckCircle className="h-4 w-4 text-black/60" />
                    Smart Questions
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              {!uploaded ? (
                <div
                  onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    'group relative cursor-pointer rounded-[8px] border-2 border-dashed p-12 text-center transition-all duration-300',
                    dragOver ? 'border-black bg-[#f7f7f5]' : 'border-[#e6e6e6] bg-[#f7f7f5] hover:border-black/30'
                  )}
                >
                  <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                  <motion.div animate={dragOver ? { scale: 1.1 } : { scale: 1 }} className="flex flex-col items-center gap-4">
                    <div className={cn('rounded-[8px] bg-white p-4 transition-all duration-300', dragOver && 'scale-110')}>
                      <Upload className={cn('h-8 w-8 transition-all duration-300', dragOver ? 'text-black' : 'text-black/60')} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-black">
                        {dragOver ? 'Drop your resume here' : 'Drag & drop your resume here'}
                      </p>
                      <p className="mt-1 text-sm text-black/40">
                        or <span className="font-medium text-black underline underline-offset-2">browse files</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-[50px] border border-[#e6e6e6] bg-white px-4 py-1.5">
                      <FileText className="h-3.5 w-3.5 text-black/40" />
                      <span className="text-xs text-black/40">PDF only · Max 10MB</span>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[24px] border border-[#e6e6e6] bg-white p-8"
                >
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[8px] bg-[#c8e6cd]"
                    >
                      <CheckCircle className="h-10 w-10 text-black" />
                    </motion.div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h3 className="text-xl font-bold text-black">Upload Successful</h3>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                          className="rounded-[50px] bg-[#c8e6cd] px-2.5 py-0.5 text-xs font-medium text-black"
                        >
                          Verified
                        </motion.div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-black/60" />
                          <span className="text-sm font-medium text-black/70">{file?.name || 'resume.pdf'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-black/40" />
                          <span className="text-sm text-black/40">Uploaded just now</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 justify-center sm:justify-start">
                        <div className="h-1.5 flex-1 max-w-[200px] overflow-hidden rounded-full bg-[#f1f1f1]">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                            className="h-full rounded-full bg-black"
                          />
                        </div>
                        <span className="text-xs text-black/60">100%</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={resetUpload}
                      className="shrink-0 rounded-[50px] border border-[#e6e6e6] bg-white p-2.5 text-black/40 transition-colors hover:border-black/30 hover:bg-[#efd4d4] hover:text-black"
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
                  className="flex items-center justify-center gap-3 rounded-[24px] border border-[#e6e6e6] bg-white p-4"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-black" />
                  <span className="text-sm text-black/70">Analyzing your resume with AI...</span>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f7f7f5]">
                      <Brain className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-black">AI Analysis Complete</h2>
                      <p className="text-sm text-black/40">Our AI has analyzed your resume and extracted the following information</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                  >
                    <SectionHeader title="Extracted Skills" subtitle="Technologies and competencies identified from your resume" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      {extractedSkills.map((skill, i) => (
                        <SkillBar key={skill.label} {...skill} delay={0.2 + i * 0.04} />
                      ))}
                    </div>
                  </motion.div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                    >
                      <SectionHeader title="Work Experience" subtitle="Professional history extracted from resume" />
                      <div className="space-y-4">
                        {extractedExperience.map((exp, i) => (
                          <motion.div
                            key={exp.role}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="rounded-[8px] border border-[#e6e6e6] bg-white p-4 transition-colors hover:bg-[#f7f7f5]"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f7f7f5]">
                                  <Briefcase className="h-4 w-4 text-black" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-black">{exp.role}</p>
                                  <p className="text-xs text-black/40">{exp.company}</p>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-[8px] bg-[#f7f7f5] px-2 py-1 text-xs text-black/40">{exp.period}</span>
                            </div>
                            <p className="mt-2 ml-12 text-xs text-black/50">{exp.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                      className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
                    >
                      <SectionHeader title="Projects" subtitle="Key projects identified from your resume" />
                      <div className="space-y-4">
                        {extractedProjects.map((project, i) => (
                          <motion.div
                            key={project.name}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.08 }}
                            className="rounded-[8px] border border-[#e6e6e6] bg-white p-4 transition-colors hover:bg-[#f7f7f5]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f7f7f5]">
                                <Code className="h-4 w-4 text-black" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-black">{project.name}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                  {project.tech.split(', ').map((t) => (
                                    <span key={t} className="rounded-[50px] bg-[#f7f7f5] px-2 py-0.5 text-[10px] text-black/40">{t}</span>
                                  ))}
                                </div>
                                <p className="mt-2 text-xs text-black/50">{project.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="rounded-[24px] border border-[#e6e6e6] bg-white p-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[8px] bg-black">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-black">Ready for Your AI Interview?</h3>
                    <p className="mb-6 text-sm text-black/50 max-w-lg mx-auto">
                      Generate a personalized mock interview based on your resume. Our AI will create questions
                      tailored to your skills, experience, and target roles.
                    </p>
                    {!generated ? (
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="inline-flex items-center gap-2 rounded-[50px] bg-black px-8 py-4 text-base font-medium text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                      >
                        {generating ? (
                          <><Loader2 className="h-5 w-5 animate-spin" /> Generating Your Interview...</>
                        ) : (
                          <><Sparkles className="h-5 w-5" /> Generate AI Interview</>
                        )}
                      </button>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-black">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">Interview Generated Successfully!</span>
                        </div>
                        <Link href="/interview" className="inline-flex items-center gap-2 rounded-[50px] bg-black px-8 py-4 text-base font-medium text-white transition-colors hover:bg-black/80">
                          <Bot className="h-5 w-5" />
                          <span>Start Interview Now</span>
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="AI Suggested Topics" subtitle="Based on your resume, our AI recommends focusing on these areas" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {suggestedTopics.map((topic, i) => (
                  <motion.div
                    key={topic.title}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                    className="rounded-[8px] bg-[#f7f7f5] p-5 transition-colors hover:bg-[#e6e6e6]"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[8px] bg-white">
                      <topic.icon className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="text-center text-lg font-bold text-black">{topic.title}</h3>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                      <BookMarked className="h-3.5 w-3.5 text-black/40" />
                      <span className="text-xs text-black/40">{topic.questions} questions available</span>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <span className="rounded-[50px] bg-white px-3 py-1 text-xs text-black/50 transition-colors hover:bg-black hover:text-white">Practice Now</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-[24px] border border-[#e6e6e6] bg-white p-6"
            >
              <SectionHeader title="Why Upload Your Resume?" subtitle="Unlock the full power of AI-driven interview preparation" />
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                    className="rounded-[8px] border border-[#e6e6e6] bg-white p-6 transition-colors hover:bg-[#f7f7f5]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-black">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-black">{feature.title}</h3>
                        <p className="mt-1 text-sm text-black/50 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  )
}

function DesktopSidebarContent({ collapsed }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-[#e6e6e6]', collapsed ? 'justify-center px-3' : 'px-5')}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-black">MockAI</span>}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-3 rounded-[50px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/resume-upload' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>
      <div className={cn('border-t border-[#e6e6e6] p-3', collapsed && 'flex justify-center')}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-[8px] bg-[#f7f7f5] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black text-xs font-bold text-white">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-black">Alex Johnson</p>
              <p className="truncate text-xs text-black/40">alex@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black text-xs font-bold text-white">A</div>
        )}
      </div>
    </div>
  )
}

function MobileSidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-[#e6e6e6] px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-black">MockAI</span>
        </Link>
        <button onClick={onClose} className="rounded-[50px] p-2 text-black/40 transition-colors hover:bg-[#f7f7f5] hover:text-black">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-[50px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/resume-upload' ? 'bg-black text-white' : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black'
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-[#e6e6e6] p-3">
        <div className="flex items-center gap-3 rounded-[8px] bg-[#f7f7f5] px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-black text-xs font-bold text-white">A</div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-black">Alex Johnson</p>
            <p className="truncate text-xs text-black/40">alex@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
