'use client'
import { useRef, useEffect, useCallback, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TalkingHeadAvatar } from '@/components/AiAvatar'
import { useInterviewStore } from '@/stores/interview-store'
import { useShallow } from 'zustand/react/shallow'
import { StatusBadge, SpeakingGlow, AudioBars, Label, GradientOverlay, computeAvatarStatus } from '@/components/interview/AvatarOverlays'

const REACTIONS = [
  { emoji: '\u{1F44D}', label: 'Like', mood: 'happy', gesture: 'thumbup' },
  { emoji: '\u{1F44E}', label: 'Dislike', mood: 'sad', gesture: 'thumbdown' },
  { emoji: '\u{1F620}', label: 'Angry', mood: 'angry', gesture: 'handup' },
  { emoji: '\u{1F64F}', label: 'Namaste', mood: 'neutral', gesture: 'namaste' },
  { emoji: '\u{1F197}', label: 'OK', mood: 'neutral', gesture: 'ok' },
  { emoji: '\u2764\uFE0F', label: 'Love', mood: 'love', gesture: undefined },
]

const MemoedAvatar = memo(function MemoedAvatar({
  avatarRef,
  voice,
  apiEndpoint,
  setAvatarLoading,
  setAvatarError,
}) {
  const handleSpeechEnd = useCallback(() => {
    useInterviewStore.getState().setIsSpeaking(false)
  }, [])

  return (
    <TalkingHeadAvatar
      ref={avatarRef}
      avatarUrl="https://met4citizen.github.io/TalkingHead/avatars/avaturn.glb"
      voice={voice}
      apiEndpoint={apiEndpoint}
      onSpeakStart={() => {
        setAvatarLoading(false)
        useInterviewStore.getState().setIsSpeaking(true)
      }}
      onSpeakEnd={handleSpeechEnd}
      onError={(err) => {
        setAvatarLoading(false)
        setAvatarError(err?.message || 'Failed to load avatar')
        useInterviewStore.getState().setIsSpeaking(false)
      }}
      className="w-full h-full"
    />
  )
})

export default memo(function Interviewer3D({
  voice = 'en-IN-NeerjaExpressiveNeural',
  apiEndpoint = '/api/synthesize',
  showEmojiReactions = false,
  className,
}) {
  const avatarRef = useRef(null)
  const [avatarLoading, setAvatarLoading] = useState(true)
  const [avatarError, setAvatarError] = useState(null)
  const lastSpokenRef = useRef('')
  const prevRepeatRef = useRef(0)

  const { isSpeaking, isGenerating, interviewState, questionPool, currentQIdx, repeatCount } = useInterviewStore(
    useShallow((s) => ({
      isSpeaking: s.isSpeaking,
      isGenerating: s.isGenerating,
      interviewState: s.interviewState,
      questionPool: s.questionPool,
      currentQIdx: s.currentQIdx,
      repeatCount: s.repeatCount,
    }))
  )

  const questionText = (questionPool[currentQIdx]?.question) || ''
  const isActive = interviewState === 'active'

  const speakQuestion = useCallback(async (text) => {
    if (!avatarRef.current || !text?.trim()) return
    try {
      await avatarRef.current.speak(text)
    } catch (err) {
      console.error('Failed to speak:', err)
    }
  }, [])

  useEffect(() => {
    if (!avatarRef.current || !questionText || !isActive) return
    if (lastSpokenRef.current === questionText && prevRepeatRef.current === repeatCount) return
    prevRepeatRef.current = repeatCount
    lastSpokenRef.current = questionText
    speakQuestion(questionText)
  }, [questionText, isActive, isSpeaking, speakQuestion, repeatCount])

  useEffect(() => {
    const timer = setTimeout(() => setAvatarLoading(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  const statusState = computeAvatarStatus(isSpeaking, isGenerating, interviewState, avatarLoading, !!avatarError)

  const handleReaction = (r) => {
    const th = avatarRef.current
    if (!th) return
    th.setMood(r.mood)
    if (r.gesture) th.playGesture(r.gesture)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'group relative overflow-hidden rounded-[16px]',
        'border border-white/10',
        'backdrop-blur-xl shadow-2xl',
        'bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.04]',
        className
      )}
    >
      <div className="aspect-[4/3] relative">
        <div className="absolute inset-0 z-10">
          <MemoedAvatar
            avatarRef={avatarRef}
            voice={voice}
            apiEndpoint={apiEndpoint}
            setAvatarLoading={setAvatarLoading}
            setAvatarError={setAvatarError}
          />
        </div>

        {avatarLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.06]">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-foreground/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground/30"
                />
              </div>
              <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs text-foreground/40 font-medium"
              >
                Loading 3D Avatar...
              </motion.p>
            </div>
          </div>
        )}

        {avatarError && !avatarLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.06]">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/[0.06]">
                <div className="h-7 w-7 text-foreground/40 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground/50">Avatar Unavailable</p>
                <p className="text-[10px] text-foreground/30 mt-0.5">Using voice only</p>
              </div>
            </div>
          </div>
        )}

        <SpeakingGlow />
        <GradientOverlay />
        <StatusBadge state={statusState} isRecording={interviewState === 'active' && !isSpeaking && !isGenerating} />
        <AudioBars />
        <Label />
      </div>

      {showEmojiReactions && (
        <div className="flex items-center justify-center gap-1.5 px-4 py-3 border-t border-white/5">
          {REACTIONS.map((r) => (
            <motion.button
              key={r.label}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleReaction(r)}
              disabled={isSpeaking}
              title={r.label}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-lg',
                'transition-all duration-150',
                'hover:bg-white/10 active:bg-white/15',
                'disabled:opacity-30 disabled:cursor-not-allowed',
              )}
            >
              {r.emoji}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
})
