'use client'
import { useRef, useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Loader2, VideoOff, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const FALLBACK_VIDEO = '/ai-interviewer.mp4'

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const BAR_COUNT = 9
const barSeeds = Array.from({ length: BAR_COUNT }, (_, i) => ({
  height: seededRandom(i * 13.37) * 20 + 8,
  duration: seededRandom(i * 7.31) * 0.4 + 0.4,
}))

const statusConfig = {
  idle: { label: 'Standing by', dot: 'bg-white/40', accent: false },
  speaking: { label: 'Speaking', dot: 'bg-accent', accent: true },
  thinking: { label: 'Thinking', dot: 'bg-yellow-400', accent: false },
  listening: { label: 'Listening', dot: 'bg-semantic-success', accent: false },
  generating: { label: 'Preparing Avatar', dot: 'bg-yellow-400', accent: false },
  failed: { label: 'Avatar Unavailable', dot: 'bg-red-400', accent: false },
}

const AiInterviewer = memo(function AiInterviewer({
  isSpeaking,
  isGenerating,
  interviewState,
  videoUrl,
  avatarVideoStatus,
  onVideoStart,
  onVideoEnd,
  className,
}) {
  const videoRef = useRef(null)
  const [playbackState, setPlaybackState] = useState('loading')
  const [hasAvatarSource, setHasAvatarSource] = useState(false)
  const prevVideoUrl = useRef(null)

  const isActive = interviewState === 'active'
  const isPaused = interviewState === 'paused'
  const showSpeaking = isActive && isSpeaking && !isPaused
  const showGenerating = isActive && isGenerating
  const showListening = isActive && !isSpeaking && !isGenerating && !isPaused
  const showIdle = interviewState === 'idle'

  const isAvatarReady = avatarVideoStatus === 'ready' && !!videoUrl
  const isAvatarGenerating = avatarVideoStatus === 'generating'
  const isAvatarFailed = avatarVideoStatus === 'failed'

  const statusKey = showSpeaking ? 'speaking'
    : showGenerating || isAvatarGenerating ? (isAvatarGenerating ? 'generating' : 'thinking')
    : showListening ? 'listening'
    : showIdle ? 'idle'
    : 'idle'

  const currentStatus = statusConfig[statusKey]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const targetSrc = isAvatarReady ? videoUrl : FALLBACK_VIDEO

    if (targetSrc && targetSrc !== prevVideoUrl.current) {
      prevVideoUrl.current = targetSrc
      setPlaybackState('loading')
      setHasAvatarSource(isAvatarReady)
      video.src = targetSrc
      video.load()
    }
  }, [isAvatarReady, videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isActive])

  const handleLoadedData = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const handleCanPlay = useCallback(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isActive])

  const handlePlay = useCallback(() => {
    setPlaybackState('playing')
    onVideoStart?.()
  }, [onVideoStart])

  const handleWaiting = useCallback(() => {
    setPlaybackState('buffering')
  }, [])

  const handlePlaying = useCallback(() => {
    setPlaybackState('playing')
  }, [])

  const handleEnded = useCallback(() => {
    onVideoEnd?.()
  }, [onVideoEnd])

  const handleError = useCallback(() => {
    setPlaybackState('error')
    const video = videoRef.current
    if (video && hasAvatarSource) {
      setHasAvatarSource(false)
      prevVideoUrl.current = FALLBACK_VIDEO
      video.src = FALLBACK_VIDEO
      video.load()
    }
  }, [hasAvatarSource])

  const showBuffering = playbackState === 'loading' || playbackState === 'buffering'

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
        <video
          ref={videoRef}
          src={FALLBACK_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onEnded={handleEnded}
          onError={handleError}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />

        <AnimatePresence>
          {(showBuffering || isAvatarGenerating) && (
            <motion.div
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.06]"
            >
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
                  {isAvatarGenerating ? 'Creating AI Avatar...' : playbackState === 'buffering' ? 'Buffering...' : 'Loading Video...'}
                </motion.p>
                {isAvatarGenerating && (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/30"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {playbackState === 'error' && isAvatarFailed && (
            <motion.div
              key="error-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.06]"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <VideoOff className="h-7 w-7 text-foreground/40" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground/50">Video Unavailable</p>
                  <p className="text-[10px] text-foreground/30 mt-0.5">Voice will continue</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showIdle && (
            <motion.div
              key="static-avatar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.06]"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 border border-white/10">
                    <User className="h-10 w-10 text-foreground/30" />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
                  <Brain className="h-3.5 w-3.5 text-white" />
                  <span className="text-xs font-medium text-white">AI Interviewer</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSpeaking && (
            <motion.div
              key="speaking-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-[16px] pointer-events-none z-30"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-[16px] ring-2 ring-accent/50 ring-offset-2 ring-offset-background/20"
              />
              <motion.div
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute inset-0 rounded-[16px] shadow-[0_0_60px_20px_rgba(255,61,139,0.15)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-30" />

        <div className="absolute left-3 top-3 z-40">
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
            <motion.span
              animate={currentStatus.accent ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
              className={cn('h-2 w-2 rounded-full', currentStatus.dot)}
            />
            <span className="text-xs font-medium text-white">{currentStatus.label}</span>
          </div>
        </div>

        {showListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-3 z-40"
          >
            <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-semantic-success"
              />
              <span className="text-xs font-medium text-white">REC</span>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {(showSpeaking || showGenerating || isAvatarGenerating) && (
            <motion.div
              key="speaking-bars"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 bottom-0 z-30"
            >
              <div className="bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-12 pb-4 px-4">
                <div className="flex items-center justify-center gap-1">
                  {showSpeaking && (
                    <>
                      {barSeeds.map((seed, i) => (
                        <motion.span
                          key={i}
                          animate={{
                            height: [4, seed.height, 4],
                          }}
                          transition={{
                            duration: seed.duration,
                            repeat: Infinity,
                            delay: i * 0.08,
                            ease: 'easeInOut',
                          }}
                          className={cn(
                            'w-[3px] rounded-full',
                            i % 3 === 1 ? 'bg-accent/90' : 'bg-white/90',
                          )}
                          style={{ height: 4 }}
                        />
                      ))}
                    </>
                  )}
                  {(showGenerating || isAvatarGenerating) && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-sm text-white/80"
                      >
                        {isAvatarGenerating ? 'Preparing avatar...' : 'AI is thinking...'}
                      </motion.span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isAvatarGenerating && !showGenerating && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md border border-white/10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <Loader2 className="h-3.5 w-3.5 text-white" />
              </motion.div>
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs font-medium text-white/90"
              >
                Generating avatar video...
              </motion.span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-30">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
            <Brain className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-medium text-white">AI Interviewer</span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-20" />
      </div>
    </motion.div>
  )
})

export default AiInterviewer
