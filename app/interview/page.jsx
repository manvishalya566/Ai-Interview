'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, History, MessageSquare, LogOut,
  Bot, Brain, CheckCircle, X, Menu, Mic, MicOff,
  Play, Square, SkipForward, Code, BarChart3,
  TrendingUp, Award, ArrowRight,
  User, Check, ChevronLeft, ChevronRight,
  Terminal, Lightbulb, RefreshCcw,
  Video, VideoOff, ThumbsUp, ThumbsDown,
  Database, Cpu, Shield, Layers, Monitor,
  Clock as ClockIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Footer } from '@/components/ui/footer'

const questionCategories = [
  { id: 'dsa', label: 'DSA', icon: Code, desc: 'Data Structures & Algorithms' },
  { id: 'react', label: 'React', icon: Layers, desc: 'React Ecosystem' },
  { id: 'system-design', label: 'System Design', icon: Monitor, desc: 'Architecture & Scale' },
  { id: 'backend', label: 'Backend', icon: Database, desc: 'Server & API' },
  { id: 'hr', label: 'HR', icon: User, desc: 'Behavioral Questions' },
  { id: 'dbms', label: 'DBMS', icon: Cpu, desc: 'Database Management' },
  { id: 'oops', label: 'OOPs', icon: Shield, desc: 'Object Oriented Prog.' },
]

const sampleQuestions = [
  {
    id: 1,
    question: "Explain the concept of Virtual DOM in React and how it improves performance compared to direct DOM manipulation.",
    topic: 'React',
    difficulty: 'Medium',
    category: 'react',
  },
  {
    id: 2,
    question: "Design a URL shortening service like TinyURL. Walk through your system design approach including database schema, API design, and scalability considerations.",
    topic: 'System Design',
    difficulty: 'Hard',
    category: 'system-design',
  },
  {
    id: 3,
    question: "Given an array of integers, find the two numbers that add up to a specific target. Optimize for O(n) time complexity.",
    topic: 'DSA',
    difficulty: 'Easy',
    category: 'dsa',
  },
]

const aiFeedbackData = [
  { label: 'Confidence', value: 82 },
  { label: 'Communication', value: 76 },
  { label: 'Technical Accuracy', value: 88 },
  { label: 'Eye Contact', value: 70 },
  { label: 'Speaking Speed', value: 85 },
]

const progressMetrics = [
  { label: 'Overall Performance', value: 84 },
  { label: 'Problem Solving', value: 78 },
  { label: 'Communication', value: 72 },
  { label: 'Technical Knowledge', value: 88 },
]

const improvementSuggestions = [
  'Use more structured responses with STAR methodology',
  'Reduce filler words like "um" and "like"',
  'Practice time-boxed coding challenges daily',
  'Improve eye contact and body language',
]

const aiInsightsData = [
  { label: 'Performance Trend', value: '+12%', icon: TrendingUp, detail: 'Improving consistently over last 5 sessions' },
  { label: 'Interview Readiness', value: '85%', icon: Award, detail: 'Ready for top-tier company interviews' },
  { label: 'Recommended Focus', value: 'System Design', icon: Lightbulb, detail: 'Focus on distributed systems & scaling' },
  { label: 'AI Suggestion', value: 'Practice DSA', icon: Bot, detail: 'Complete 3 more mock interviews this week' },
]

const pastelAccents = {
  lime: '#dceeb1',
  lilac: '#c5b0f4',
  mint: '#c8e6cd',
  coral: '#f3c9b6',
  pink: '#efd4d4',
  cream: '#f4ecd6',
}

function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])
  return (
    <span ref={ref}>{count}{suffix}</span>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-black/90">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-black/40">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-sm text-black/60 transition-colors hover:text-black"
        >
          {action.label}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

function FigmaButton({ children, onClick, variant = 'primary', icon: Icon, disabled, className }) {
  const baseClasses = 'inline-flex items-center gap-2 rounded-[50px] text-[20px] font-[480] transition-all duration-200'
  const variants = {
    primary: 'bg-black text-white px-5 py-2.5 hover:bg-black/80',
    secondary: 'border border-[#e6e6e6] bg-white text-black px-5 py-2.5 hover:bg-[#f7f7f5]',
    ghost: 'bg-white text-black px-3 py-2 hover:bg-[#f7f7f5] rounded-full',
    danger: 'bg-black text-white px-5 py-2.5 hover:bg-black/80',
    icon: 'bg-[#f7f7f5] text-black rounded-full h-10 w-10 p-0 flex items-center justify-center hover:bg-[#e6e6e6]',
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variants[variant],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </motion.button>
  )
}

export default function InterviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [interviewState, setInterviewState] = useState('idle')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('react')
  const [activeTab, setActiveTab] = useState('interview')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(
    '// Write your solution here\n\nfunction solve(input) {\n  // Your code\n  return null;\n}'
  )
  const [codeOutput, setCodeOutput] = useState('')
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [fullTranscript, setFullTranscript] = useState([])
  const timerRef = useRef(null)

  const currentQuestion = sampleQuestions[currentQuestionIndex] || sampleQuestions[0]
  const totalQuestions = sampleQuestions.length

  useEffect(() => {
    if (interviewState === 'active') {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [interviewState])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartInterview = () => {
    setInterviewState('active')
    setTimerSeconds(0)
    setTranscript('')
    setFullTranscript([])
    const words = [
      "I believe React's Virtual DOM is...",
      "It creates a lightweight representation of the real DOM...",
      "When state changes, React compares the virtual DOM with its previous version...",
      "This diffing process is called reconciliation...",
      "It batches updates and only applies minimal changes to the actual DOM...",
    ]
    let i = 0
    const interval = setInterval(() => {
      if (i < words.length) {
        setTranscript(words[i])
        setFullTranscript((prev) => [...prev, { text: words[i], time: formatTime(timerSeconds) }])
        i++
      } else {
        clearInterval(interval)
      }
    }, 2500)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTranscript('')
      setTimerSeconds(0)
    }
  }

  const handleEndInterview = () => {
    setInterviewState('completed')
    setShowSummary(true)
    clearInterval(timerRef.current)
  }

  const handleRunCode = () => {
    setCodeOutput('> Running code...\n> Compilation successful\n> Output: [1, 2, 3, 4, 5]\n> Execution time: 0.042ms')
  }

  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const sidebarLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/interview', label: 'Interview', icon: Bot },
    { href: '/history', label: 'History', icon: History },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  ]

  return (
    <div className="flex w-full min-h-screen bg-white text-black">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
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
        <main className="flex-1 overflow-auto">
          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              {[
                { id: 'interview', label: 'Interview', icon: Bot },
                { id: 'coding', label: 'Coding', icon: Terminal },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-[50px] px-5 py-2.5 text-[20px] font-[480] transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-[#e6e6e6] hover:bg-[#f7f7f5]'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Interview Tab */}
            {activeTab === 'interview' && (
              <>
                <div className="grid gap-6 xl:grid-cols-5">
                  {/* LEFT - AI Interviewer */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6 xl:col-span-3"
                  >
                    {/* AI Interviewer Card */}
                    <div className="rounded-[16px] border border-[#e6e6e6] bg-white p-6">
                      <div className="flex items-start gap-5">
                        {/* AI Avatar */}
                        <div className="relative shrink-0">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[16px] bg-black">
                            <Bot className="h-10 w-10 text-white" />
                          </div>
                          {interviewState === 'active' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#1ea64a] ring-2 ring-white"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-[#1ea64a]/50"
                              />
                            </motion.div>
                          )}
                        </div>

                        {/* AI Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-black/90">AI Interviewer</h3>
                            {interviewState === 'active' && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-full bg-[#1ea64a]/10 px-2.5 py-0.5 text-xs font-medium text-[#1ea64a]"
                              >
                                Listening
                              </motion.span>
                            )}
                          </div>
                          <p className="text-sm text-black/40">Senior Technical Interviewer at MockAI</p>

                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-2 rounded-xl bg-[#f7f7f5] px-3 py-1.5">
                              <ClockIcon className="h-4 w-4 text-black/60" />
                              <span className="font-mono text-sm text-black/70">{formatTime(timerSeconds)}</span>
                            </div>
                            {interviewState === 'active' && (
                              <motion.div
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex items-center gap-1.5"
                              >
                                <span className="h-2 w-2 rounded-full bg-black" />
                                <span className="text-xs text-black/40">Recording</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Question */}
                      <div className="mt-6">
                        <div className="mb-3 flex items-center gap-2">
                          <span className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-medium',
                            currentQuestion.difficulty === 'Easy' ? 'bg-[#1ea64a]/10 text-[#1ea64a]' :
                            currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                            'bg-black/10 text-black'
                          )}>
                            {currentQuestion.difficulty}
                          </span>
                          <span className="rounded-full bg-[#f7f7f5] px-2.5 py-0.5 text-xs font-medium text-black/70">
                            {currentQuestion.topic}
                          </span>
                          <span className="rounded-full bg-[#f7f7f5] px-2.5 py-0.5 text-xs font-medium text-black/70">
                            Q {currentQuestionIndex + 1}/{totalQuestions}
                          </span>
                        </div>

                        <motion.div
                          key={currentQuestion.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-[16px] bg-[#f7f7f5] p-5"
                        >
                          <p className="text-lg leading-relaxed text-black/80">
                            {currentQuestion.question}
                          </p>
                        </motion.div>

                        <div className="mt-4">
                          <div className="mb-1.5 flex items-center justify-between text-xs text-black/40">
                            <span>Question Progress</span>
                            <span>{Math.round(progressPercent)}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#f1f1f1]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className="h-full rounded-full bg-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transcription Area */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-[16px] border border-[#e6e6e6] bg-white p-5"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-black/70">Live Transcription</h3>
                        {interviewState === 'active' && (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="flex items-center gap-1"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-black" />
                              <span className="h-1.5 w-1.5 rounded-full bg-black" />
                              <span className="h-1.5 w-1.5 rounded-full bg-black" />
                            </motion.div>
                            <span className="text-xs text-black">Live</span>
                          </div>
                        )}
                      </div>
                      <div className="min-h-[80px] rounded-xl bg-[#f7f7f5] p-4">
                        {interviewState === 'idle' ? (
                          <p className="text-sm italic text-black/30">Your response will appear here once you start the interview...</p>
                        ) : (
                          <motion.p
                            key={transcript}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-black/70"
                          >
                            {transcript || 'Waiting for response...'}
                          </motion.p>
                        )}
                      </div>

                      {interviewState === 'active' && (
                        <div className="mt-3 flex items-center gap-0.5">
                          {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{
                                height: [4, Math.random() * 24 + 4, 4],
                              }}
                              transition={{
                                duration: 0.6 + Math.random() * 0.4,
                                repeat: Infinity,
                                delay: i * 0.05,
                                ease: 'easeInOut',
                              }}
                              className="w-1 rounded-full bg-black/30"
                              style={{ height: 4 }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* RIGHT - Webcam + Controls + Feedback */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6 xl:col-span-2"
                  >
                    {/* Webcam Preview */}
                    <div className="group relative overflow-hidden rounded-[16px] border border-[#e6e6e6] bg-white">
                      <div className="aspect-[4/3] bg-[#f7f7f5]">
                        {isCameraOn ? (
                          <div className="relative flex h-full items-center justify-center">
                            <div className="absolute inset-0 opacity-[0.03]" style={{
                              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                              backgroundSize: '40px 40px'
                            }} />
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/10 ring-2 ring-black/20">
                                <User className="h-10 w-10 text-black/40" />
                              </div>
                              <span className="text-sm text-black/40">Camera Active</span>
                            </div>
                            <div className="absolute top-2 left-2 flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                              <span className="text-xs font-medium text-black/60">CAM 1</span>
                            </div>
                            {interviewState === 'active' && (
                              <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-2 right-2 h-2 w-2 rounded-full bg-black"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                              <VideoOff className="h-12 w-12 text-black/20" />
                              <span className="text-sm text-black/30">Camera Off</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interview Controls */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="rounded-[16px] border border-[#e6e6e6] bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {interviewState === 'idle' ? (
                          <FigmaButton icon={Play} onClick={handleStartInterview}>
                            Start Interview
                          </FigmaButton>
                        ) : interviewState === 'active' ? (
                          <>
                            <FigmaButton variant="secondary" onClick={() => setInterviewState('paused')}>
                              <Square className="h-5 w-5" />
                              Pause
                            </FigmaButton>
                            {currentQuestionIndex < totalQuestions - 1 && (
                              <FigmaButton icon={SkipForward} onClick={handleNextQuestion}>
                                Next Question
                              </FigmaButton>
                            )}
                            <FigmaButton variant="danger" icon={Square} onClick={handleEndInterview}>
                              End Interview
                            </FigmaButton>
                          </>
                        ) : interviewState === 'paused' ? (
                          <>
                            <FigmaButton icon={Play} onClick={() => setInterviewState('active')}>
                              Resume
                            </FigmaButton>
                            <FigmaButton variant="danger" icon={Square} onClick={handleEndInterview}>
                              End Interview
                            </FigmaButton>
                          </>
                        ) : null}

                        {interviewState !== 'idle' && interviewState !== 'completed' && (
                          <>
                            <FigmaButton
                              variant="icon"
                              onClick={() => setIsMuted(!isMuted)}
                            >
                              {isMuted ? <MicOff className="h-4 w-4 text-black" /> : <Mic className="h-4 w-4 text-black" />}
                            </FigmaButton>
                            <FigmaButton
                              variant="icon"
                              onClick={() => setIsCameraOn(!isCameraOn)}
                            >
                              {isCameraOn ? <Video className="h-4 w-4 text-black" /> : <VideoOff className="h-4 w-4 text-black" />}
                            </FigmaButton>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* AI Feedback Cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-[16px] border border-[#e6e6e6] bg-white p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-black/70">Live AI Analysis</h3>
                        <Bot className="h-4 w-4 text-black/60" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {aiFeedbackData.map((item, i) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="group rounded-xl bg-[#f7f7f5] p-3 transition-all duration-200 hover:bg-[#e6e6e6]"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs text-black/40">{item.label}</span>
                              <span className="text-xs font-semibold text-black/70">{item.value}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                                className="h-full rounded-full bg-black/30"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Question Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
                >
                  <SectionHeader title="Question Categories" subtitle="Select a category to practice specific topics" />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                    {questionCategories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          'group relative overflow-hidden rounded-[12px] border p-4 text-left transition-all duration-200',
                          selectedCategory === cat.id
                            ? 'border-black/40 bg-[#f7f7f5]'
                            : 'border-[#e6e6e6] bg-white hover:border-black/20'
                        )}
                      >
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className="rounded-xl bg-[#f7f7f5] p-2.5 border border-[#e6e6e6]">
                            <cat.icon className="h-4 w-4 text-black/60" />
                          </div>
                          <span className="text-sm font-medium text-black/70 transition-colors group-hover:text-black">{cat.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Coding Tab */}
            {activeTab === 'coding' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Editor */}
                  <div className="rounded-[16px] border border-[#e6e6e6] bg-white overflow-hidden lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-[#e6e6e6] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-black/20" />
                          <div className="h-3 w-3 rounded-full bg-black/20" />
                          <div className="h-3 w-3 rounded-full bg-black/20" />
                        </div>
                        <span className="text-sm text-black/40">solution.js</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="rounded-[50px] border border-[#e6e6e6] bg-white px-3 py-1.5 text-xs text-black/60 focus:outline-none"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="typescript">TypeScript</option>
                        </select>
                        <FigmaButton icon={Terminal} onClick={handleRunCode}>
                          Run
                        </FigmaButton>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 flex flex-col gap-1 px-4 py-4 text-xs text-black/20 select-none font-mono">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full min-h-[350px] bg-transparent pl-12 pr-4 py-4 font-mono text-sm text-black/80 placeholder:text-black/20 focus:outline-none resize-none"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  {/* Output Panel */}
                  <div className="rounded-[16px] border border-[#e6e6e6] bg-white overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-[#e6e6e6] px-4 py-3">
                      <Terminal className="h-4 w-4 text-black/60" />
                      <span className="text-sm font-medium text-black/60">Output</span>
                    </div>
                    <div className="p-4 font-mono text-sm text-black/60 min-h-[350px] whitespace-pre-wrap">
                      {codeOutput || '> Ready to run your code...'}
                    </div>
                  </div>
                </div>

                {/* Coding Challenge Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-[#f7f7f5] p-3 border border-[#e6e6e6]">
                      <Code className="h-6 w-6 text-black/60" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black/90">Two Sum Problem</h3>
                      <p className="mt-1 text-sm text-black/50">
                        Given an array of integers nums and an integer target, return indices of the two numbers
                        such that they add up to target. You may assume that each input would have exactly one solution.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#1ea64a]/10 px-3 py-1 text-xs font-medium text-[#1ea64a]">Easy</span>
                        <span className="rounded-full bg-[#f7f7f5] px-3 py-1 text-xs font-medium text-black/70">Arrays</span>
                        <span className="rounded-full bg-[#f7f7f5] px-3 py-1 text-xs font-medium text-black/70">Hash Table</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Progress Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  <div className="rounded-[16px] border border-[#e6e6e6] bg-white p-6">
                    <SectionHeader title="Progress Analytics" subtitle="Your performance across key metrics" />
                    <div className="mt-4 space-y-5">
                      {progressMetrics.map((metric, i) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-black/70">{metric.label}</span>
                            <span className="text-sm font-semibold text-black/80">
                              <AnimatedCounter value={metric.value} suffix="%" />
                            </span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#f1f1f1]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.value}%` }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                              className="h-full rounded-full bg-black/30"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="rounded-[16px] border border-[#e6e6e6] bg-white p-6">
                    <SectionHeader title="AI Insights" subtitle="Smart recommendations from AI analysis" />
                    <div className="space-y-3">
                      {aiInsightsData.map((insight, i) => (
                        <motion.div
                          key={insight.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          className="group flex items-start gap-4 rounded-xl bg-[#f7f7f5] p-4 transition-all duration-200 hover:bg-[#e6e6e6]"
                        >
                          <div className="rounded-xl bg-white p-2.5 border border-[#e6e6e6]">
                            <insight.icon className="h-4 w-4 text-black/60" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-black/70">{insight.label}</span>
                              <span className="text-sm font-bold text-black/90">{insight.value}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-black/40">{insight.detail}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Performance Trend Graph */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
                >
                  <SectionHeader title="Performance Trends" subtitle="Your interview scores over time" />
                  <div className="mt-6 flex items-end justify-between gap-2 h-48">
                    {[
                      { label: 'Week 1', value: 55 },
                      { label: 'Week 2', value: 62 },
                      { label: 'Week 3', value: 58 },
                      { label: 'Week 4', value: 72 },
                      { label: 'Week 5', value: 68 },
                      { label: 'Week 6', value: 78 },
                      { label: 'Week 7', value: 85 },
                      { label: 'Week 8', value: 82 },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="group relative flex flex-1 flex-col items-center gap-2"
                      >
                        <div className="relative w-full flex-1 flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${item.value}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
                            className="w-full rounded-lg bg-black/10 transition-all duration-300 group-hover:bg-black/20 cursor-pointer"
                            style={{ minHeight: '8px' }}
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f7f7f5] px-2 py-0.5 text-xs text-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              {item.value}%
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs font-medium text-black/40">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Improvement Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-[16px] border border-[#e6e6e6] bg-white p-6"
                >
                  <SectionHeader title="Improvement Suggestions" subtitle="AI-powered recommendations to boost your performance" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {improvementSuggestions.map((suggestion, i) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="group flex items-start gap-3 rounded-xl bg-[#f7f7f5] p-4 transition-all duration-200 hover:bg-[#e6e6e6]"
                      >
                        <div className="rounded-lg bg-white p-2 border border-[#e6e6e6]">
                          <Lightbulb className="h-4 w-4 text-black/60" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-black/70">{suggestion}</p>
                        </div>
                        <Check className="h-4 w-4 shrink-0 text-[#1ea64a]/50" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            <div className="h-8" />
          </div>
        </main>

        <Footer />
      </div>

      {/* Interview Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-[#e6e6e6] bg-white"
            >
              <div className="p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black"
                  >
                    <Award className="h-10 w-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-black">Interview Complete!</h2>
                  <p className="mt-2 text-black/50">Great effort! Here is your performance summary.</p>
                </div>

                {/* Score */}
                <div className="mb-8 flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="relative flex h-32 w-32 items-center justify-center">
                      <svg className="absolute inset-0 h-full w-full -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#f1f1f1" strokeWidth="6" fill="none" />
                        <motion.circle
                          cx="64" cy="64" r="56"
                          stroke="black"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 56}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - 84 / 100) }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                        />
                      </svg>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-4xl font-bold text-black"
                      >
                        84%
                      </motion.span>
                    </div>
                    <span className="mt-2 text-sm text-black/40">Final Score</span>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#1ea64a]/5 border border-[#1ea64a]/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-[#1ea64a]" />
                      <span className="text-sm font-medium text-[#1ea64a]">Strengths</span>
                    </div>
                    <ul className="space-y-2">
                      {['Strong technical knowledge', 'Clear problem-solving approach', 'Good confidence level'].map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-black/60"
                        >
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1ea64a]" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-black/5 border border-black/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-black/60" />
                      <span className="text-sm font-medium text-black/60">Weaknesses</span>
                    </div>
                    <ul className="space-y-2">
                      {['Need more structured responses', 'Work on time management', 'Use more specific examples'].map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-black/60"
                        >
                          <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black/40" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mb-8 rounded-xl bg-[#f7f7f5] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-black/60" />
                    <span className="text-sm font-medium text-black/70">Improvement Suggestions</span>
                  </div>
                  <ul className="space-y-2">
                    {improvementSuggestions.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-black/60"
                      >
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black/40" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <FigmaButton icon={RefreshCcw} onClick={() => {
                    setShowSummary(false)
                    setInterviewState('idle')
                    setCurrentQuestionIndex(0)
                    setTimerSeconds(0)
                    setTranscript('')
                    setFullTranscript([])
                    setCodeOutput('')
                  }}>
                    Retry Interview
                  </FigmaButton>
                  <FigmaButton variant="secondary" icon={MessageSquare} onClick={() => setShowSummary(false)}>
                    View Detailed Feedback
                  </FigmaButton>
                  <FigmaButton variant="ghost" onClick={() => setShowSummary(false)}>
                    Close
                  </FigmaButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DesktopSidebarContent({ collapsed }) {
  const sidebarLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/interview', label: 'Interview', icon: Bot },
    { href: '/history', label: 'History', icon: History },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/login', label: 'Logout', icon: LogOut },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-[#e6e6e6]', collapsed ? 'justify-center px-3' : 'px-5')}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-black">MockAI</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/interview'
                ? 'bg-[#f7f7f5] text-black'
                : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black',
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
          <div className="flex items-center gap-3 rounded-[12px] bg-[#f7f7f5] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-black/80">Alex Johnson</p>
              <p className="truncate text-xs text-black/40">alex@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            A
          </div>
        )}
      </div>
    </div>
  )
}

function MobileSidebarContent({ onClose }) {
  const sidebarLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/interview', label: 'Interview', icon: Bot },
    { href: '/history', label: 'History', icon: History },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/login', label: 'Logout', icon: LogOut },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-[#e6e6e6] px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-black">MockAI</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-black/60 transition-colors hover:bg-[#f7f7f5] hover:text-black"
        >
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
              'flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
              link.href === '/interview'
                ? 'bg-[#f7f7f5] text-black'
                : 'text-black/50 hover:bg-[#f7f7f5] hover:text-black'
            )}
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-[#e6e6e6] p-3">
        <div className="flex items-center gap-3 rounded-[12px] bg-[#f7f7f5] px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-black/80">Alex Johnson</p>
            <p className="truncate text-xs text-black/40">alex@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
