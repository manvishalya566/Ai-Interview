'use client'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { User, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default memo(function UserWebcam({
  videoRef,
  cameraOn,
  micOn,
  error,
  loading,
  interviewState,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'group relative overflow-hidden rounded-[16px]',
        'border border-white/10 bg-background/40',
        'backdrop-blur-xl shadow-2xl',
        className
      )}
    >
      <div className="aspect-[4/3] relative">
        {/* Video element — always rendered so videoRef is always populated */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
        />

        {/* Grid overlay for professional video feel */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Camera OFF overlay — covers the video element when inactive */}
        {!cameraOn && (
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.04] flex items-center justify-center z-10">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-foreground/20 border-t-foreground/60"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-foreground/40"
                >
                  Starting camera...
                </motion.span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 backdrop-blur-sm">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm ring-2 ring-white/10">
                  <User className="h-10 w-10 text-foreground/40" />
                </div>
                <span className="text-sm text-foreground/40 font-medium">Camera Off</span>
                <span className="text-xs text-foreground/30">Your video will appear here</span>
              </div>
            )}
          </div>
        )}

        {/* Camera ON overlays */}
        {cameraOn && (
          <>
            <div className="absolute left-3 top-3 z-10">
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <span className="text-xs font-medium text-white">YOU</span>
              </div>
            </div>

            {interviewState === 'active' && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-3 top-3 z-10 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black/40 shadow-lg shadow-red-500/20"
              />
            )}

            <div className="absolute bottom-3 right-3 z-10">
              <div className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md border border-white/10',
                micOn ? 'bg-black/40' : 'bg-red-500/50',
              )}>
                <motion.span
                  animate={micOn ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    micOn ? 'bg-semantic-success' : 'bg-white',
                  )}
                />
                <span className="text-xs font-medium text-white">
                  {micOn ? 'Mic On' : 'Mic Off'}
                </span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </>
        )}
      </div>
    </motion.div>
  )
})
