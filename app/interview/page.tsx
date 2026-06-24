'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Brain, CheckCircle, X, Mic, MicOff,
  Play, Square, SkipForward, Code, BarChart3,
  TrendingUp, Award, ArrowRight, Menu,
  User, ChevronRight,
  Terminal, Lightbulb, RefreshCcw,
  Video, VideoOff,
  Database, Cpu, Shield, Layers, Monitor,
  Clock, Loader2, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

import Interviewer3DBase from '@/components/Interviewer3D'
import UserWebcamBase from '@/components/UserWebcam'
import { useWebcam } from '@/hooks/useWebcam'

const Interviewer3D = Interviewer3DBase as React.ComponentType<{ showEmojiReactions?: boolean }>
const UserWebcam = UserWebcamBase as React.ComponentType<{
  videoRef: any
  cameraOn: boolean
  micOn: boolean
  error: any
  loading: boolean
  interviewState: string
  className?: string
}>
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useTimerInterval } from '@/hooks/useTimerInterval'
import { useInterviewStore } from '@/stores/interview-store'
import type { Question } from '@/stores/interview-store'
import { QuestionCard } from '@/components/interview/QuestionCard'
import { TranscriptionPanel } from '@/components/interview/TranscriptionPanel'
import { AIFeedbackPanel } from '@/components/interview/AIFeedbackPanel'
import { CategorySelector } from '@/components/interview/CategorySelector'

interface QuestionCategory {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
}

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface MetricItem {
  label: string
  value: number
}

interface InsightItem {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  detail: string
}

interface SessionItem {
  date: string
  topic: string
  score: number
  duration: string
  status: string
}

interface HintItem {
  hint: string
  revealed: boolean
}

const questionCategories: QuestionCategory[] = [
  { id: 'dsa', label: 'DSA', icon: Code, desc: 'Data Structures & Algorithms' },
  { id: 'react', label: 'React', icon: Layers, desc: 'React Ecosystem' },
  { id: 'system-design', label: 'System Design', icon: Monitor, desc: 'Architecture & Scale' },
  { id: 'backend', label: 'Backend', icon: Database, desc: 'Server & API' },
  { id: 'hr', label: 'HR', icon: User, desc: 'Behavioral Questions' },
  { id: 'dbms', label: 'DBMS', icon: Cpu, desc: 'Database Management' },
  { id: 'oops', label: 'OOPs', icon: Shield, desc: 'Object Oriented Prog.' },
]

const tabs: TabItem[] = [
  { id: 'interview', label: 'Interview', icon: Bot },
 
]

const COOLDOWN_MS = 15000
const lastApiCallRef: { current: number } = { current: 0 }

const FALLBACK_QUESTIONS: Record<string, string[]> = {
  dsa: [
    "Explain the difference between an array and a linked list. When would you use one over the other?",
    "Implement a function to detect if a linked list has a cycle. What is the time and space complexity?",
    "Describe how a hash table works internally. How do you handle collisions?",
    "What is the time complexity of binary search? Explain the algorithm and its prerequisites.",
    "Explain the difference between BFS and DFS. When would you use each?",
    "What is a stack and how is it different from a queue? Give real-world use cases.",
    "Explain dynamic programming with an example. How is it different from recursion?",
    "What is the two-pointer technique? Give an example problem where it's useful.",
    "Explain how merge sort works. What is its time and space complexity?",
    "What is a binary search tree? Describe its properties and common operations.",
    "How would you find the kth largest element in an unsorted array?",
    "Explain the sliding window pattern with an example problem.",
    "What is the difference between min-heap and max-heap? How are heaps implemented?",
    "Describe how you would implement an LRU cache from scratch.",
    "Explain trie data structure. What problems does it solve efficiently?",
  ],
  react: [
    "Explain the virtual DOM and how React uses it for performance optimization.",
    "What is the difference between controlled and uncontrolled components in React?",
    "Explain the useEffect hook lifecycle. How does the dependency array work?",
    "What is prop drilling and how do you solve it? Compare Context API vs Redux.",
    "Explain React.memo and useMemo. When should you use each?",
    "How does React's reconciliation algorithm work? What is the role of keys?",
    "Explain the difference between state and props in React components.",
    "What are custom hooks? Create an example custom hook for window resize.",
    "How does React handle event delegation? Explain synthetic events.",
    "What is the difference between useRef and useState? When would you use useRef?",
    "Explain Server Components in Next.js and how they differ from Client Components.",
    "How would you optimize a React app that re-renders too often?",
    "What is the useReducer hook and when is it better than useState?",
    "Explain error boundaries in React. How do you implement one?",
    "Describe the context API workflow. What are its limitations?",
  ],
  "system-design": [
    "Design a URL shortening service like TinyURL. Discuss the key trade-offs.",
    "How would you design a scalable chat application like WhatsApp?",
    "Explain consistent hashing and why it's useful in distributed systems.",
    "Design a rate limiter for a public API. Compare token bucket vs leaky bucket.",
    "How would you design a distributed key-value store? Discuss CAP theorem.",
    "Explain how CDNs work. How would you design one?",
    "Design a real-time collaborative editor like Google Docs.",
    "What is load balancing? Compare round-robin vs least connections strategies.",
    "How would you design a notification system for millions of users?",
    "Explain database sharding. What strategies exist for choosing a shard key?",
    "Design a social media feed API. How do you handle scaling?",
    "What is eventual consistency? When is it acceptable to use?",
    "Describe how you would design a video streaming platform like YouTube.",
    "Explain the differences between SQL and NoSQL databases for system design.",
    "How would you design a fault-tolerant microservices architecture?",
  ],
  backend: [
    "Explain RESTful API design principles. What are the key HTTP methods and status codes?",
    "What is middleware in Express.js? Create an example authentication middleware.",
    "Explain JWT authentication flow. How do you handle token refresh?",
    "What is the difference between SQL and NoSQL databases? When would you use each?",
    "Explain database indexing. How does it improve query performance?",
    "What is idempotency in APIs? Why is it important and how do you implement it?",
    "Describe the difference between vertical and horizontal scaling.",
    "Explain how you would design a rate-limited API endpoint.",
    "What is CORS? How does it work and how do you configure it?",
    "Explain the event loop in Node.js. How does it handle asynchronous operations?",
    "What is a reverse proxy? How does it differ from a forward proxy?",
    "Describe the repository pattern and its benefits in backend architecture.",
    "How do you handle database migrations in a production environment?",
    "Explain the difference between authentication and authorization.",
    "What is WebSocket? How does it differ from HTTP polling?",
  ],
  hr: [
    "Tell me about a time you had a conflict with a team member. How did you resolve it?",
    "Describe a project where you took leadership. What was the outcome?",
    "Tell me about a time you failed. What did you learn from the experience?",
    "Where do you see yourself in five years? How does this role align with your goals?",
    "Describe a situation where you had to work under tight deadlines.",
    "Tell me about a time you received constructive criticism. How did you respond?",
    "Why do you want to work at this company? What excites you about this role?",
    "Describe a complex technical problem you solved. Walk me through your approach.",
    "Tell me about a time you had to persuade someone to adopt your idea.",
    "How do you stay updated with the latest technologies in your field?",
    "Describe a situation where you went above and beyond your job requirements.",
    "Tell me about a time you worked on a cross-functional team. What was your role?",
    "How do you handle multiple priorities and competing deadlines?",
    "Describe a time you mentored or coached a junior team member.",
    "Tell me about a project that required significant collaboration to succeed.",
  ],
  dbms: [
    "Explain the difference between INNER JOIN and LEFT JOIN with examples.",
    "What is normalization? Explain 1NF, 2NF, and 3NF with examples.",
    "How does database indexing work? What is the difference between clustered and non-clustered indexes?",
    "Explain ACID properties in database transactions.",
    "What is the difference between SQL and NoSQL databases? When would you choose NoSQL?",
    "Explain what a transaction is and how it ensures data integrity.",
    "What is denormalization? When and why would you use it?",
    "Explain the N+1 query problem and how to solve it.",
    "What is a foreign key? How does it enforce referential integrity?",
    "Explain the difference between UNION and UNION ALL in SQL.",
    "What is database sharding? What are the common strategies?",
    "Explain the CAP theorem and how it applies to distributed databases.",
    "What is a deadlock in databases? How do you prevent or resolve it?",
    "Explain the concept of database replication. What are the different types?",
    "How would you optimize a slow SQL query? What tools would you use?",
  ],
  oops: [
    "Explain the four pillars of OOP: encapsulation, inheritance, polymorphism, and abstraction.",
    "What is the difference between an abstract class and an interface? When do you use each?",
    "Explain the SOLID principles. Give an example of the Single Responsibility Principle.",
    "What is dependency injection? How does it improve code maintainability?",
    "Explain the difference between composition and inheritance. When would you prefer composition?",
    "What is a design pattern? Name three creational patterns and their use cases.",
    "Explain the Observer pattern. Give a real-world example of where it's used.",
    "What is method overloading vs method overriding? How do they differ?",
    "Explain the Factory pattern. How does it help with object creation?",
    "What is the Strategy pattern? When would you use it?",
    "Explain how polymorphism works in both compile-time and runtime contexts.",
    "What is a singleton pattern? What are its drawbacks and alternatives?",
    "Explain the Decorator pattern. How does it differ from inheritance?",
    "What is the Law of Demeter? Why is it important in OOP design?",
    "Describe the Adapter pattern. How does it help integrate incompatible interfaces?",
  ],
}

const defaultCode = '// Write your solution here\n\nfunction solve(input) {\n  // Your code\n  return null;\n}'


function GradientBlob({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute animate-blob opacity-30 blur-3xl',
        className
      )}
    />
  )
}

function GlassCard({ children, className, hover }: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } } : undefined}
      className={cn(
        'rounded-2xl border border-[#e8e7f0] bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300',
        hover && 'hover:shadow-xl hover:shadow-[#C084FC]/10',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default function InterviewPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('interview')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(defaultCode)
  const [codeOutput, setCodeOutput] = useState('')

  const webcam = useWebcam()
  const { isListening } = useSpeechRecognition()

  useTimerInterval()

  const requestLockRef = useRef<{ isLoading: boolean }>({ isLoading: false })
  const clickLockRef = useRef(false)

  const router = useRouter()

  const interviewState = useInterviewStore((s) => s.interviewState)
  const isSpeaking = useInterviewStore((s) => s.isSpeaking)
  const isGenerating = useInterviewStore((s) => s.isGenerating)
  const currentQuestion = useInterviewStore((s) => s.currentQuestion)
  const selectedCategory = useInterviewStore((s) => s.selectedCategory)
  const questionPool = useInterviewStore((s) => s.questionPool)
  const currentQIdx = useInterviewStore((s) => s.currentQIdx)
  const askedQuestions = useInterviewStore((s) => s.askedQuestions)
  const errorMessage = useInterviewStore((s) => s.errorMessage)
  const userAnswers = useInterviewStore((s) => s.userAnswers)
  const questionsAsked = useInterviewStore((s) => s.questionsAsked)

  const getFallbackQuestions = useCallback((categoryId: string, count: number): Question[] => {
    const pool = FALLBACK_QUESTIONS[categoryId] || FALLBACK_QUESTIONS.react
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const category = questionCategories.find(c => c.id === categoryId)
    return shuffled.slice(0, count).map(q => ({
      id: Date.now() + Math.random(),
      question: q,
      topic: category?.label || 'General',
      difficulty: 'Medium',
      category: categoryId,
    }))
  }, [])

  const generateBatchQuestions = useCallback(async (count = 3): Promise<Question[]> => {
    const now = Date.now()
    const elapsed = now - lastApiCallRef.current

    if (requestLockRef.current.isLoading) {
      return []
    }

    if (elapsed < COOLDOWN_MS) {
      return getFallbackQuestions(selectedCategory, count)
    }

    requestLockRef.current.isLoading = true
    useInterviewStore.getState().setIsGenerating(true)
    useInterviewStore.getState().setErrorMessage(null)

    const allPrevious = [
      ...askedQuestions.map(q => q),
      ...questionPool.map(q => q.question),
    ]
    const uniquePrevious = [...new Set(allPrevious)]

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          role: "Software Engineer",
          techstack: selectedCategory,
          level: "Medium",
          previousQuestions: uniquePrevious,
          count,
        }),
      })
      clearTimeout(timeoutId)

      if (!res.ok) {
        return getFallbackQuestions(selectedCategory, count)
      }

      let data: any
      try {
        data = await res.json()
      } catch {
        return getFallbackQuestions(selectedCategory, count)
      }

      if (!data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
        return getFallbackQuestions(selectedCategory, count)
      }

      lastApiCallRef.current = Date.now()
      const category = questionCategories.find(c => c.id === selectedCategory)

      return data.questions
        .filter((q: any) => q && q.trim().length > 10)
        .map((q: any) => ({
          id: Date.now() + Math.random(),
          question: q.replace(/^["'\s]+|["'\s]+$/g, '').trim(),
          topic: category?.label || 'General',
          difficulty: 'Medium',
          category: selectedCategory,
        }))
    } catch (err) {
      clearTimeout(timeoutId)
      return getFallbackQuestions(selectedCategory, count)
    } finally {
      requestLockRef.current.isLoading = false
      useInterviewStore.getState().setIsGenerating(false)
    }
  }, [selectedCategory, askedQuestions, questionPool, getFallbackQuestions])

  const handleStartInterview = useCallback(async () => {
    if (clickLockRef.current || requestLockRef.current.isLoading) return
    clickLockRef.current = true

    useInterviewStore.getState().setInterviewState('active')
    useInterviewStore.getState().resetTimer()
    useInterviewStore.getState().clearTranscript()
    useInterviewStore.getState().setQuestionPool([])
    useInterviewStore.getState().setCurrentQIdx(0)
    useInterviewStore.getState().setAskedQuestions([])
    useInterviewStore.setState({ userAnswers: [], questionsAsked: [] })
    webcam.startCamera()

    try {
      const questions = await generateBatchQuestions(3)
      useInterviewStore.getState().setQuestionPool(questions)
      useInterviewStore.getState().setCurrentQIdx(0)
    } finally {
      clickLockRef.current = false
    }
  }, [selectedCategory, askedQuestions, questionPool, webcam, generateBatchQuestions])

  const handleNextQuestion = useCallback(async () => {
    if (clickLockRef.current || requestLockRef.current.isLoading) return
    clickLockRef.current = true

    try {
      useInterviewStore.getState().saveCurrentAnswer()
      useInterviewStore.getState().resetTimer()
      useInterviewStore.getState().clearTranscript()

      const store = useInterviewStore.getState()
      const nextIdx = store.currentQIdx + 1

      if (nextIdx < store.questionPool.length) {
        store.setCurrentQIdx(nextIdx)
      } else {
        const newQuestions = await generateBatchQuestions(3)
        useInterviewStore.getState().setQuestionPool(prev => [...prev, ...newQuestions])
        useInterviewStore.getState().setCurrentQIdx(prev => prev + 1)
      }
    } finally {
      clickLockRef.current = false
    }
  }, [selectedCategory, askedQuestions, generateBatchQuestions])

  const handleEndInterview = useCallback(async () => {
    let store = useInterviewStore.getState()
    if (store.isGenerating) return

    store.saveCurrentAnswer()
    store = useInterviewStore.getState()

    const questions = store.questionsAsked
    const answers = store.userAnswers
    const duration = Math.floor(store.timerSeconds / 60)
    const techstack = store.selectedCategory

    store.setIsGenerating(true)
    store.setInterviewState('completed')

    let analysis: any = {}
    let submitResult: any = null

    try {
      if (questions.length > 0) {
        const analyzeRes = await fetch("/api/interview/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions,
            answers,
            techstack,
            level: "Medium",
            role: "Software Engineer",
          }),
        })
        const analyzeData = await analyzeRes.json()
        if (analyzeData.success) analysis = analyzeData
      }
    } catch (err) {
      console.error("[handleEndInterview] analyze error:", err)
    }

    try {
      const submitRes = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers,
          duration,
          type: techstack ? "Technical" : "Mixed",
          skillsAssessed: [techstack],
          overallScore: analysis.overallScore ?? null,
          feedback: analysis.feedback || "",
          questionFeedback: analysis.questionFeedback || [],
          scores: analysis.scores || {},
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          aiSuggestions: analysis.aiSuggestions || [],
          recommendedTopics: analysis.recommendedTopics || [],
          skillBreakdown: analysis.skillBreakdown || [],
          status: "Completed",
        }),
      })

      submitResult = await submitRes.json()
    } catch (err) {
      console.error("[handleEndInterview] submit error:", err)
    } finally {
      store = useInterviewStore.getState()
      store.setIsGenerating(false)
    }

    const interviewId = submitResult?.interview?._id
    if (interviewId) {
      router.push(`/feedback?id=${interviewId}`)
    } else {
      router.push('/feedback')
    }
  }, [router])

  const handleRetry = useCallback(() => {
    handleStartInterview()
  }, [handleStartInterview])

  const handleRunCode = () => {
    setCodeOutput('> Running code...\n> Compilation successful\n> Output: [1, 2, 3, 4, 5]\n> Execution time: 0.042ms')
  }

  return (
    <div className="flex min-h-screen bg-[#fcfcff]">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={cn(
        'flex flex-1 flex-col transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-18' : 'lg:ml-60'
      )}>
        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-[#e8e7f0]">
          <div className="flex items-center justify-between px-lg py-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eeff] text-[#6b6a7a] hover:bg-[#e8e5ff] transition-colors lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-headline text-[#0a0a0f]">Interview</h1>
                <p className="text-body-sm text-[#6b6a7a]">AI-powered mock interview practice</p>
              </div>
            </div>

            {/* Desktop tab bar */}
            <div className="hidden sm:flex items-center gap-1 rounded-pill bg-[#f0eeff] p-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200',
                    activeTab === tab.id ? 'text-white' : 'text-[#6b6a7a] hover:text-[#0a0a0f]'
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-pill bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile tab bar */}
          <div className="flex sm:hidden items-center gap-1 px-lg pb-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] text-white shadow-sm'
                    : 'bg-[#f0eeff] text-[#6b6a7a]'
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="relative px-lg py-lg space-y-lg">
            {/* Decorative blobs */}
            <GradientBlob className="-top-20 -right-20 h-60 w-60 bg-gradient-to-br from-[#FF4D9D]/10 via-[#C084FC]/10 to-transparent" />
            <GradientBlob className="-bottom-20 -left-20 h-60 w-60 bg-gradient-to-tr from-[#8B5CF6]/10 via-[#C084FC]/10 to-transparent" />

            <AnimatePresence mode="wait">
              {activeTab === 'interview' && (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 space-y-lg"
                >
                  {/* Video row */}
                  <div className="grid gap-lg lg:grid-cols-2">
                    <GlassCard className="relative overflow-hidden" hover>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D9D]/5 via-[#C084FC]/5 to-transparent pointer-events-none" />
                      <Interviewer3D />
                     
                    </GlassCard>

                    <div className="space-y-md">
                      <GlassCard className="relative overflow-hidden" hover>
                        <UserWebcam
                          videoRef={webcam.videoRef}
                          cameraOn={webcam.cameraOn}
                          micOn={webcam.micOn}
                          error={webcam.error}
                          loading={webcam.loading}
                          interviewState={interviewState}
                        />
                      </GlassCard>

                      {interviewState !== 'idle' && interviewState !== 'completed' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center justify-center"
                        >
                          <div className="flex items-center gap-2 transform -translate-y-[100%] mt-[-50px] rounded-full bg-white/80 backdrop-blur-xl border border-[#e8e7f0] px-3 py-2 shadow-lg">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={webcam.toggleMic}
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                                webcam.micOn ? 'bg-[#f0eeff] hover:bg-[#e8e7f0]' : 'bg-red-500/20 text-red-500'
                              )}
                            >
                              {webcam.micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={webcam.toggleCamera}
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                                webcam.cameraOn ? 'bg-[#f0eeff] hover:bg-[#e8e7f0]' : 'bg-red-500/20 text-red-500'
                              )}
                            >
                              {webcam.cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Question, Transcription & Feedback */}
                  <div className="grid gap-lg xl:grid-cols-3">
                    <div className="space-y-lg xl:col-span-2">
                      <QuestionCard
                        onStart={handleStartInterview}
                        onNext={handleNextQuestion}
                        onEnd={handleEndInterview}
                        onRetry={handleRetry}
                      />
                      <TranscriptionPanel />
                    </div>
                    <AIFeedbackPanel />
                  </div>

                  {/* Categories */}
                  <CategorySelector />
                </motion.div>
              )}

          
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
