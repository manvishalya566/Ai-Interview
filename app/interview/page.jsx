'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, History, MessageSquare, LogOut,
  Bot, Brain, CheckCircle, X, Mic, MicOff,
  Play, Square, SkipForward, Code, BarChart3,
  TrendingUp, Award, ArrowRight,
  User, ChevronRight,
  Terminal, Lightbulb, RefreshCcw,
  Video, VideoOff, ThumbsUp, ThumbsDown,
  Database, Cpu, Shield, Layers, Monitor,
  Clock as ClockIcon, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Footer } from '@/components/ui/footer'
import Interviewer3D from '@/components/Interviewer3D'
import UserWebcam from '@/components/UserWebcam'
import { useWebcam } from '@/hooks/useWebcam'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useTimerInterval } from '@/hooks/useTimerInterval'
import { useInterviewStore } from '@/stores/interview-store'
import { QuestionCard } from '@/components/interview/QuestionCard'
import { TranscriptionPanel } from '@/components/interview/TranscriptionPanel'
import { AIFeedbackPanel } from '@/components/interview/AIFeedbackPanel'
import { CategorySelector } from '@/components/interview/CategorySelector'

const questionCategories = [
  { id: 'dsa', label: 'DSA', icon: Code, desc: 'Data Structures & Algorithms' },
  { id: 'react', label: 'React', icon: Layers, desc: 'React Ecosystem' },
  { id: 'system-design', label: 'System Design', icon: Monitor, desc: 'Architecture & Scale' },
  { id: 'backend', label: 'Backend', icon: Database, desc: 'Server & API' },
  { id: 'hr', label: 'HR', icon: User, desc: 'Behavioral Questions' },
  { id: 'dbms', label: 'DBMS', icon: Cpu, desc: 'Database Management' },
  { id: 'oops', label: 'OOPs', icon: Shield, desc: 'Object Oriented Prog.' },
]

const COOLDOWN_MS = 15000
const lastApiCallRef = { current: 0 }

const FALLBACK_QUESTIONS = {
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

function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
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
  }, [value])
  return <span ref={ref}>{count}{suffix}</span>
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-foreground/90">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-foreground/40">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group flex items-center gap-1 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          {action.label}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

const defaultCode = '// Write your solution here\n\nfunction solve(input) {\n  // Your code\n  return null;\n}'

export default function InterviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('interview')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(defaultCode)
  const [codeOutput, setCodeOutput] = useState('')

  const webcam = useWebcam()
  const { isListening } = useSpeechRecognition()

  useTimerInterval()

  const requestLockRef = useRef({ isLoading: false })
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

  const getFallbackQuestions = (categoryId, count) => {
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
  }

  const generateBatchQuestions = async (count = 3) => {
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

      let data
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
        .filter(q => q && q.trim().length > 10)
        .map(q => ({
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
  }

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
  }, [selectedCategory, askedQuestions, questionPool, webcam])

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
  }, [selectedCategory, askedQuestions])

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

    let analysis = {}
    let submitResult = null

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
    <div className="flex w-full min-h-screen bg-canvas text-foreground">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-border bg-background transition-all duration-300 lg:flex',
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
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-background lg:hidden"
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
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground border border-border hover:bg-secondary'
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
                {/* Split Screen - AI Interviewer + User Webcam */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Left: AI Interviewer Video */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <Interviewer3D
                      showEmojiReactions={true}
                    />
                    {interviewState === 'active' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10"
                      >
                        <div className="flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 px-4 py-1.5 shadow-lg">
                          <motion.div
                            animate={isSpeaking ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className={cn(
                              'h-2 w-2 rounded-full',
                              isSpeaking ? 'bg-accent' : isGenerating ? 'bg-yellow-400' : 'bg-semantic-success'
                            )}
                          />
                          <span className="text-xs font-medium text-foreground/70">
                            {isSpeaking ? 'Speaking' : isGenerating ? 'Thinking' : 'Listening'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Right: User Webcam + Controls */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative flex flex-col gap-3"
                  >
                    <UserWebcam
                      videoRef={webcam.videoRef}
                      cameraOn={webcam.cameraOn}
                      micOn={webcam.micOn}
                      error={webcam.error}
                      loading={webcam.loading}
                      interviewState={interviewState}
                    />

                    {interviewState !== 'idle' && interviewState !== 'completed' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <div className="flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-lg">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={webcam.toggleMic}
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                              webcam.micOn ? 'bg-secondary hover:bg-border' : 'bg-red-500/20 text-red-500'
                            )}
                          >
                            {webcam.micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={webcam.toggleCamera}
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                              webcam.cameraOn ? 'bg-secondary hover:bg-border' : 'bg-red-500/20 text-red-500'
                            )}
                          >
                            {webcam.cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Question + Controls + Feedback Row */}
                <div className="grid gap-4 xl:grid-cols-3">
                  {/* Question & Transcription Column */}
                  <div className="space-y-4 xl:col-span-2">
                    <QuestionCard
                      onStart={handleStartInterview}
                      onNext={handleNextQuestion}
                      onEnd={handleEndInterview}
                      onRetry={handleRetry}
                    />
                    <TranscriptionPanel />
                  </div>

                  {/* AI Feedback Column */}
                  <AIFeedbackPanel />
                </div>

                {/* Question Categories */}
                <CategorySelector />
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
                  <div className="rounded-[16px] border border-border bg-background overflow-hidden lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-foreground/20" />
                          <div className="h-3 w-3 rounded-full bg-foreground/20" />
                          <div className="h-3 w-3 rounded-full bg-foreground/20" />
                        </div>
                        <span className="text-sm text-foreground/40">solution.js</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="rounded-[50px] border border-border bg-background px-3 py-1.5 text-xs text-foreground/60 focus:outline-none"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="typescript">TypeScript</option>
                        </select>
                        <button
                          onClick={handleRunCode}
                          className="inline-flex items-center gap-2 rounded-[50px] bg-primary text-primary-foreground px-5 py-2.5 text-[20px] font-[480] hover:bg-foreground/80 transition-all duration-200"
                        >
                          <Terminal className="h-5 w-5" />
                          Run
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 flex flex-col gap-1 px-4 py-4 text-xs text-foreground/20 select-none font-mono">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full min-h-[350px] bg-transparent pl-12 pr-4 py-4 font-mono text-sm text-foreground/80 placeholder:text-foreground/20 focus:outline-none resize-none"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  {/* Output Panel */}
                  <div className="rounded-[16px] border border-border bg-background overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                      <Terminal className="h-4 w-4 text-foreground/60" />
                      <span className="text-sm font-medium text-foreground/60">Output</span>
                    </div>
                    <div className="p-4 font-mono text-sm text-foreground/60 min-h-[350px] whitespace-pre-wrap">
                      {codeOutput || '> Ready to run your code...'}
                    </div>
                  </div>
                </div>

                {/* Coding Challenge Info */}
                <div className="rounded-[16px] border border-border bg-background p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary p-3 border border-border">
                      <Code className="h-6 w-6 text-foreground/60" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground/80">Challenge</h3>
                      <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                        Write a function that finds the longest palindromic substring in a given string.
                        For example, in the string &quot;babad&quot;, the longest palindromic substring is &quot;bab&quot; (or &quot;aba&quot;).
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                          Medium
                        </span>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">
                          Strings
                        </span>
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                          Dynamic Programming
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge Hints */}
                <div className="rounded-[16px] border border-border bg-background p-6">
                  <SectionHeader title="Hints" subtitle="Need help? Check these hints one by one." />
                  <div className="space-y-3">
                    {[
                      { hint: 'Consider using dynamic programming with a 2D table.', revealed: true },
                      { hint: 'Each character is a palindrome of length 1.', revealed: false },
                      { hint: 'For substrings of length > 2, check if the first and last characters match and the inner substring is a palindrome.', revealed: false },
                      { hint: 'Track the start index and maximum length found so far.', revealed: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/50 text-xs font-medium text-foreground/60">
                          {i + 1}
                        </div>
                        <p className={cn(
                          'text-sm leading-relaxed',
                          item.revealed ? 'text-foreground/80' : 'text-foreground/30'
                        )}>
                          {item.revealed ? item.hint : 'Click to reveal hint...'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenge Tags/Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[16px] border border-border bg-background p-5">
                    <div className="text-2xl font-bold text-foreground/80">78%</div>
                    <div className="mt-1 text-xs text-foreground/40">Acceptance Rate</div>
                  </div>
                  <div className="rounded-[16px] border border-border bg-background p-5">
                    <div className="text-2xl font-bold text-foreground/80">2.4k</div>
                    <div className="mt-1 text-xs text-foreground/40">Submissions Today</div>
                  </div>
                  <div className="rounded-[16px] border border-border bg-background p-5">
                    <div className="text-2xl font-bold text-foreground/80">35 min</div>
                    <div className="mt-1 text-xs text-foreground/40">Avg. Solve Time</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Progress Metrics Row */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {progressMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-[16px] border border-border bg-background p-6">
                      <p className="text-sm font-medium text-foreground/60">{metric.label}</p>
                      <p className="mt-2 text-4xl font-bold text-foreground/90">
                        <AnimatedCounter value={metric.value} suffix="%" />
                      </p>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-foreground/40"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insights Grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {aiInsightsData.map((insight) => (
                    <div key={insight.label} className="rounded-[16px] border border-border bg-background p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-secondary p-3 border border-border">
                            <insight.icon className="h-5 w-5 text-foreground/60" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground/60">{insight.label}</p>
                            <p className="text-2xl font-bold text-foreground/90">{insight.value}</p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-foreground/40">{insight.detail}</p>
                    </div>
                  ))}
                </div>

                {/* Improvement Suggestions */}
                <div className="rounded-[16px] border border-border bg-background p-6">
                  <SectionHeader title="AI Suggestions" subtitle="Personalized tips to improve your interview performance" />
                  <div className="space-y-3">
                    {improvementSuggestions.map((suggestion, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/60 p-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background/50">
                          <CheckCircle className="h-4 w-4 text-foreground/40" />
                        </div>
                        <p className="text-sm text-foreground/70">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Sessions */}
                <div className="rounded-[16px] border border-border bg-background p-6">
                  <SectionHeader
                    title="Recent Sessions"
                    subtitle="Your interview history"
                    action={{ label: 'View All', href: '/history' }}
                  />
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-3 pr-4 font-medium text-foreground/40">Date</th>
                          <th className="pb-3 pr-4 font-medium text-foreground/40">Topic</th>
                          <th className="pb-3 pr-4 font-medium text-foreground/40">Score</th>
                          <th className="pb-3 pr-4 font-medium text-foreground/40">Duration</th>
                          <th className="pb-3 font-medium text-foreground/40">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: '2026-06-10', topic: 'React', score: 82, duration: '15:32', status: 'completed' },
                          { date: '2026-06-08', topic: 'System Design', score: 75, duration: '18:00', status: 'completed' },
                          { date: '2026-06-05', topic: 'DSA', score: 88, duration: '20:15', status: 'completed' },
                          { date: '2026-06-01', topic: 'Backend', score: 70, duration: '12:45', status: 'completed' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="py-3 pr-4 text-foreground/60">{row.date}</td>
                            <td className="py-3 pr-4 text-foreground/70">{row.topic}</td>
                            <td className="py-3 pr-4">
                              <span className="font-medium text-foreground/80">{row.score}%</span>
                            </td>
                            <td className="py-3 pr-4 text-foreground/60">{row.duration}</td>
                            <td className="py-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-semantic-success/10 px-2.5 py-0.5 text-xs font-medium text-semantic-success">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function MobileSidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <span className="font-semibold text-foreground/80">Menu</span>
        <button onClick={onClose} className="text-foreground/40 hover:text-foreground/60">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {[
          { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/interview', icon: Bot, label: 'Interview' },
          { href: '/history', icon: History, label: 'History' },
          { href: '/feedback', icon: MessageSquare, label: 'Feedback' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/60 transition-all hover:bg-secondary"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/60 transition-all hover:bg-secondary"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </div>
  )
}

function DesktopSidebarContent({ collapsed }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn(
        'flex items-center border-b border-border p-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && <span className="font-semibold text-foreground/80">PrepGenius</span>}
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {[
          { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/interview', icon: Bot, label: 'Interview' },
          { href: '/history', icon: History, label: 'History' },
          { href: '/feedback', icon: MessageSquare, label: 'Feedback' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/60 transition-all hover:bg-secondary',
              collapsed && 'justify-center'
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/login"
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/60 transition-all hover:bg-secondary',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && 'Logout'}
        </Link>
      </div>
    </div>
  )
}
