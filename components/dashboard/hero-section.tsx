'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Upload, Bot } from 'lucide-react'

function AICuteMascot() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative h-48 w-48 shrink-0"
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-xl">
        <defs>
          <linearGradient id="mascot-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF4D9D" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="mascot-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6BCB" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#C084FC" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Body glow */}
        <ellipse cx="100" cy="130" rx="55" ry="10" fill="#C084FC" opacity="0.15" />

        {/* Body */}
        <rect x="60" y="70" width="80" height="75" rx="30" fill="url(#mascot-body)" filter="url(#shadow)" />

        {/* Face */}
        <circle cx="82" cy="105" r="6" fill="white" opacity="0.9" />
        <circle cx="118" cy="105" r="6" fill="white" opacity="0.9" />
        <circle cx="82" cy="105" r="3" fill="#1a1a2e" />
        <circle cx="118" cy="105" r="3" fill="#1a1a2e" />

        {/* Smile */}
        <path d="M85 120 Q100 132 115 120" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Blush */}
        <ellipse cx="75" cy="115" rx="8" ry="4" fill="white" opacity="0.2" />
        <ellipse cx="125" cy="115" rx="8" ry="4" fill="white" opacity="0.2" />

        {/* Antenna */}
        <line x1="100" y1="70" x2="100" y2="42" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="38" r="8" fill="url(#mascot-glow)">
          <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="38" r="4" fill="white" opacity="0.6">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Ears */}
        <circle cx="60" cy="90" r="12" fill="#C084FC" opacity="0.4" />
        <circle cx="140" cy="90" r="12" fill="#C084FC" opacity="0.4" />

        {/* Laptop */}
        <rect x="55" y="138" width="20" height="4" rx="2" fill="#8B5CF6" />
        <rect x="125" y="138" width="20" height="4" rx="2" fill="#8B5CF6" />
        <rect x="65" y="140" width="70" height="5" rx="1" fill="#6d28d9" />
        <rect x="68" y="141" width="64" height="3" rx="0.5" fill="#8B5CF6" opacity="0.3" />

        {/* Arms */}
        <rect x="48" y="95" width="14" height="8" rx="4" fill="#C084FC" opacity="0.6" transform="rotate(-15, 55, 99)" />
        <rect x="138" y="95" width="14" height="8" rx="4" fill="#C084FC" opacity="0.6" transform="rotate(15, 145, 99)" />

        {/* Sparkles around */}
        <g>
          <motion.path
            d="M100 10 L102 16 L108 18 L102 20 L100 26 L98 20 L92 18 L98 16 Z"
            fill="#C084FC" opacity="0.6"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M170 120 L171.5 124 L176 125.5 L171.5 127 L170 131 L168.5 127 L164 125.5 L168.5 124 Z"
            fill="#FF6BCB" opacity="0.5"
            animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M20 130 L21.5 134 L26 135.5 L21.5 137 L20 141 L18.5 137 L14 135.5 L18.5 134 Z"
            fill="#FF4D9D" opacity="0.4"
            animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M150 20 L151 23 L154 24 L151 25 L150 28 L149 25 L146 24 L149 23 Z"
            fill="#8B5CF6" opacity="0.5"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </g>
      </svg>
    </motion.div>
  )
}

function FloatingParticle({ index }: { index: number }) {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const delay = Math.random() * 5
  const duration = Math.random() * 4 + 3

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: '-10px',
        background: index % 3 === 0 ? '#FF4D9D' : index % 3 === 1 ? '#C084FC' : '#8B5CF6',
      }}
      animate={{
        y: [-300, 0],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

function FloatingBlob({ index }: { index: number }) {
  const positions = [
    { top: '10%', left: '5%', size: 120, color: 'rgba(255, 77, 157, 0.08)' },
    { top: '60%', left: '85%', size: 100, color: 'rgba(196, 132, 252, 0.1)' },
    { top: '30%', left: '90%', size: 80, color: 'rgba(139, 92, 246, 0.08)' },
    { top: '70%', left: '10%', size: 90, color: 'rgba(255, 107, 203, 0.07)' },
  ]
  const pos = positions[index % positions.length]

  return (
    <motion.div
      className="absolute animate-blob"
      style={{
        width: pos.size,
        height: pos.size,
        top: pos.top,
        left: pos.left,
        background: pos.color,
        filter: 'blur(30px)',
      }}
      animate={{
        scale: [1, 1.15, 1],
        rotate: [0, 10, -5, 0],
      }}
      transition={{
        duration: 8 + index,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function SparkleStar({ index }: { index: number }) {
  const positions = [
    { top: '15%', left: '30%' },
    { top: '25%', left: '70%' },
    { top: '50%', left: '15%' },
    { top: '65%', left: '75%' },
    { top: '80%', left: '40%' },
  ]
  const pos = positions[index % positions.length]

  return (
    <motion.div
      className="absolute"
      style={{ top: pos.top, left: pos.left }}
      animate={{
        scale: [0, 1.2, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 3,
        ease: 'easeInOut',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" fill="white" opacity="0.9" />
      </svg>
    </motion.div>
  )
}

export function HeroSection({ userName }: { userName?: string }) {
  const particles = Array.from({ length: 8 }, (_, i) => i)
  const sparkles = Array.from({ length: 4 }, (_, i) => i)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl border border-[#e8e7f0] bg-gradient-to-br from-[#FF4D9D] via-[#C084FC] to-[#8B5CF6] py-8"
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Blobs */}
      <FloatingBlob index={0} />
      <FloatingBlob index={1} />
      <FloatingBlob index={2} />
      <FloatingBlob index={3} />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* Sparkles */}
      {sparkles.map((i) => (
        <SparkleStar key={i} index={i} />
      ))}

      {/* Content */}
      
       <div className="relative z-10 flex flex-col lg:flex-row h-full items-center justify-between gap-6 px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-0 lg:h-full">
        <div className="flex-1 w-full h-full space-y-4 lg:space-y-5">
          {/* Chip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/20 px-3.5 py-1.5 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-white drop-shadow-sm" />
            <span className="text-[11px] font-semibold tracking-wide text-white">
              AI Mock Interview Dashboard
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[36px] lg:leading-[1.15]"
          >
            Ready to Ace Your Next Interview, <span className="text-white/90">{userName || 'Gaurav'}</span>?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm sm:text-base text-white/75"
          >
            Practice daily, build confidence, and land your dream role.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-row items-center gap-3 pt-1"
          >
            <Link href="/interview">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(196, 132, 252, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#8B5CF6] shadow-lg shadow-[#C084FC]/25 transition-all duration-300"
              >
                <Bot className="h-4 w-4" />
                Start Interview
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </Link>

            <Link href="/resume-upload">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25"
              >
                <Upload className="h-4 w-4" />
                Upload Resume
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Mascot */}
        <div className="hidden lg:flex shrink-0 items-center justify-center">
          {/* <AICuteMascot /> */}
          <img src="/assets/bot.gif" alt="" className="w-[200px] h-[200px]" />
        </div>
      </div>
    </motion.div>
  )
}
