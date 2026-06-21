'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, SkipBack, SkipForward, Square, Brain } from 'lucide-react'
import { TalkingHeadAvatar, TalkingHeadHandle } from '@/components/AiAvatar'
import { TopNav } from '@/components/ui/top-nav'
import { FigmaButton } from '@/components/ui/figma-button'
import { Footer } from '@/components/ui/footer'

interface InterviewQuestion {
  id: string
  text: string
  category: string
}

const interviewQuestions: InterviewQuestion[] = [
  {
    id: '1',
    text: 'Hello. I am your technical interviewer. Please introduce yourself and describe your engineering projects.',
    category: 'Introduction',
  },
  {
    id: '2',
    text: 'Can you explain the difference between SQL and NoSQL databases? When would you choose one over the other?',
    category: 'Databases',
  },
  {
    id: '3',
    text: 'Describe a challenging bug you encountered and how you debugged it.',
    category: 'Problem Solving',
  },
  {
    id: '4',
    text: 'How do you handle code reviews? What do you look for when reviewing pull requests?',
    category: 'Engineering Practices',
  },
  {
    id: '5',
    text: 'Explain the concept of event-driven architecture and its benefits.',
    category: 'Architecture',
  },
]

export const TalkingHeadInterviewDemo: React.FC = () => {
  const avatarRef = useRef<TalkingHeadHandle>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const currentQuestion = interviewQuestions[currentQuestionIndex]

  const handleAskQuestion = () => {
    if (currentQuestion && avatarRef.current) {
      avatarRef.current.setMood('neutral')
      avatarRef.current.lookAtCamera(500)
      avatarRef.current.speak(currentQuestion.text)
    }
  }

  const handleNextQuestion = () => {
    avatarRef.current?.stop()
    setCurrentQuestionIndex((prev) =>
      (prev + 1) % interviewQuestions.length
    )
  }

  const handlePrevQuestion = () => {
    avatarRef.current?.stop()
    setCurrentQuestionIndex((prev) =>
      (prev - 1 + interviewQuestions.length) % interviewQuestions.length
    )
  }

  const reactions = [
    { emoji: '\uD83D\uDC4D', label: 'Like', mood: 'happy', gesture: 'thumbup' as const },
    { emoji: '\uD83D\uDC4E', label: 'Dislike', mood: 'sad', gesture: 'thumbdown' as const },
    { emoji: '\uD83D\uDE20', label: 'Angry', mood: 'angry', gesture: 'handup' as const },
    { emoji: '\uD83D\uDE4F', label: 'Namaste', mood: 'neutral', gesture: 'namaste' as const },
    { emoji: '\uD83C\uDD97', label: 'OK', mood: 'neutral', gesture: 'ok' as const },
    { emoji: '\u2764\uFE0F', label: 'Love', mood: 'love', gesture: undefined },
  ]

  const handleReaction = (r: typeof reactions[number]) => {
    const ref = avatarRef.current
    if (!ref) return
    ref.setMood(r.mood)
    if (r.gesture) ref.playGesture(r.gesture)
  }

  const handleCustomText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get('text') as string
    if (text && avatarRef.current) {
      avatarRef.current.setMood('neutral')
      avatarRef.current.lookAtCamera(500)
      avatarRef.current.speak(text)
      e.currentTarget.reset()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopNav />
      <main className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 px-6 pt-6 pb-2"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-body-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 rounded-pill bg-secondary px-3 py-1">
            <Brain className="h-3.5 w-3.5 text-foreground" />
            <span className="text-eyebrow text-foreground">AI Interview Demo</span>
          </div>
        </motion.div>

        <div className="flex-1 relative min-h-[400px]">
          <TalkingHeadAvatar
            ref={avatarRef}
            voice="en-IN-NeerjaExpressiveNeural"
            initialText=""
            onSpeakStart={() => setIsSpeaking(true)}
            onSpeakEnd={() => setIsSpeaking(false)}
          />
        </div>

        <div className="border-t border-border bg-background px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <FigmaButton
                variant="primary"
                onClick={handleAskQuestion}
                disabled={isSpeaking}
              >
                {isSpeaking ? (
                  <><Square className="h-4 w-4" /> Speaking...</>
                ) : (
                  <><Play className="h-4 w-4" /> Ask Question</>
                )}
              </FigmaButton>
              <FigmaButton
                variant="secondary"
                onClick={handlePrevQuestion}
                disabled={isSpeaking}
              >
                <SkipBack className="h-4 w-4" />
                Previous
              </FigmaButton>
              <FigmaButton
                variant="secondary"
                onClick={handleNextQuestion}
                disabled={isSpeaking}
              >
                Next
                <SkipForward className="h-4 w-4" />
              </FigmaButton>
              <FigmaButton
                variant="magenta-promo"
                onClick={() => { avatarRef.current?.stop(); setIsSpeaking(false) }}
                disabled={!isSpeaking}
              >
                <Square className="h-4 w-4" />
                Stop
              </FigmaButton>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap border-t border-border pt-4">
              {reactions.map(r => (
                <button
                  key={r.label}
                  onClick={() => handleReaction(r)}
                  disabled={isSpeaking}
                  title={r.label}
                  className="flex items-center gap-1.5 rounded-pill border border-border bg-background px-3 py-1.5 text-body-sm text-foreground/60 transition-all hover:bg-secondary hover:text-foreground hover:border-foreground/20 disabled:opacity-40"
                >
                  <span className="text-lg leading-none">{r.emoji}</span>
                  <span className="hidden sm:inline">{r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomText} className="flex gap-3 flex-wrap">
              <input
                name="text"
                type="text"
                placeholder="Enter custom text for avatar to speak..."
                disabled={isSpeaking}
                className="flex-1 min-w-[200px] h-12 rounded-md border border-hairline bg-background px-4 text-body text-foreground placeholder:text-foreground/25 focus:border-foreground/30 focus:outline-none disabled:opacity-40"
              />
              <FigmaButton
                variant="primary"
                type="submit"
                disabled={isSpeaking}
              >
                Speak Custom Text
              </FigmaButton>
            </form>

            {currentQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-background p-5"
                style={{ borderLeft: '4px solid var(--color-block-lime)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-eyebrow text-foreground/40">{currentQuestion.category}</span>
                  <span className="text-eyebrow text-foreground/30">
                    Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                  </span>
                </div>
                <p className="text-body text-foreground leading-relaxed">
                  {currentQuestion.text}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TalkingHeadInterviewDemo
