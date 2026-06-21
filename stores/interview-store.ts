import { create } from 'zustand'

export interface Question {
  id: number
  question: string
  topic: string
  difficulty: string
  category: string
}

interface TranscriptEntry {
  role: 'user' | 'ai'
  text: string
  timestamp: number
}

interface InterviewStore {
  interviewState: 'idle' | 'active' | 'paused' | 'completed'
  isSpeaking: boolean
  isGenerating: boolean
  timerSeconds: number
  currentQuestion: Question | null
  questionPool: Question[]
  currentQIdx: number
  transcript: string
  fullTranscript: TranscriptEntry[]
  askedQuestions: string[]
  selectedCategory: string
  errorMessage: string | null
  repeatCount: number

  setInterviewState: (s: InterviewStore['interviewState']) => void
  setIsSpeaking: (v: boolean) => void
  setIsGenerating: (v: boolean) => void
  incrementTimer: () => void
  resetTimer: () => void
  setCurrentQuestion: (q: Question | null) => void
  setQuestionPool: (pool: Question[] | ((prev: Question[]) => Question[])) => void
  setCurrentQIdx: (idx: number | ((prev: number) => number)) => void
  setTranscript: (t: string) => void
  addTranscriptEntry: (entry: TranscriptEntry) => void
  clearTranscript: () => void
  setAskedQuestions: (q: string[]) => void
  setSelectedCategory: (c: string) => void
  setErrorMessage: (msg: string | null) => void
  incrementRepeatCount: () => void
  resetInterview: () => void
}

const initialState = {
  interviewState: 'idle' as const,
  isSpeaking: false,
  isGenerating: false,
  timerSeconds: 0,
  currentQuestion: null,
  questionPool: [] as Question[],
  currentQIdx: 0,
  transcript: '',
  fullTranscript: [] as TranscriptEntry[],
  askedQuestions: [] as string[],
  selectedCategory: 'react',
  errorMessage: null as string | null,
  repeatCount: 0,
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  ...initialState,

  setInterviewState: (interviewState) => set({ interviewState }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  incrementTimer: () => set((s) => ({ timerSeconds: s.timerSeconds + 1 })),
  resetTimer: () => set({ timerSeconds: 0 }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setQuestionPool: (questionPool) => set((s) => ({
    questionPool: typeof questionPool === 'function' ? questionPool(s.questionPool) : questionPool,
  })),
  setCurrentQIdx: (currentQIdx) => set((s) => ({
    currentQIdx: typeof currentQIdx === 'function' ? currentQIdx(s.currentQIdx) : currentQIdx,
  })),
  setTranscript: (transcript) => set({ transcript }),
  addTranscriptEntry: (entry) => set((s) => ({ fullTranscript: [...s.fullTranscript, entry] })),
  clearTranscript: () => set({ transcript: '', fullTranscript: [] }),
  setAskedQuestions: (askedQuestions) => set({ askedQuestions }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  incrementRepeatCount: () => set((s) => ({ repeatCount: s.repeatCount + 1 })),
  resetInterview: () => set({ ...initialState }),
}))
