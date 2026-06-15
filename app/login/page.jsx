'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, Mail, Lock, Loader,
  ArrowRight, Check, Star, Users, Sparkles,
  Brain, Zap, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TopNav } from '@/components/ui/top-nav'
import { FigmaButton } from '@/components/ui/figma-button'
import { Footer } from '@/components/ui/footer'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Smart question generation tailored to your role and experience level',
  },
  {
    icon: Zap,
    title: 'Real-time Feedback',
    desc: 'Instant insights on your responses with actionable improvement tips',
  },
  {
    icon: BarChart3,
    title: 'Smart Performance Scoring',
    desc: 'Multi-dimensional scoring across clarity, relevance, and depth',
  },
]

const companies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix']

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer @ Google',
    content: 'This AI mock interview platform helped me land my dream job. The real-time feedback was incredibly accurate.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager @ Meta',
    content: 'The role-specific questions were spot-on. I felt completely prepared after just two weeks of practice.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist @ Amazon',
    content: 'The analytics dashboard showed me exactly where I needed to improve. Highly recommended.',
    rating: 5,
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = "/dashboard"
      } else {
        alert(data.message || data.error || "Login failed")
      }
    } catch (err) {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-black">
      <TopNav />

      <main className="flex-1 flex">
        {/* ===== LEFT PANEL ===== */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-12 py-12 bg-white">
          <div className="relative z-10 max-w-xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-[480] text-black">MockAI</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-16"
            >
              <h1 className="text-4xl font-[340] leading-[1.10] tracking-[-0.96px] md:text-5xl text-black">
                Welcome Back
              </h1>
              <p className="mt-4 text-[18px] font-[320] leading-[1.45] text-black/60 max-w-md">
                Your AI interview coach is ready. Continue where you left off and keep building toward your dream role.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 rounded-[24px] bg-[#c5b0f4] p-8"
            >
              <h3 className="text-[18px] font-[400] font-mono uppercase tracking-[0.54px] text-black/50 mb-6">
                Why MockAI
              </h3>
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                      <feature.icon className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-[16px] font-[480] leading-[1.40] tracking-[-0.10px] text-black">{feature.title}</p>
                      <p className="text-[14px] font-[330] leading-[1.45] text-black/60 mt-0.5">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8"
            >
              <p className="text-[12px] font-[400] font-mono uppercase tracking-[0.60px] text-black/30 mb-3">
                Trusted by engineers from
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {companies.map((company) => (
                  <span
                    key={company}
                    className="text-sm font-semibold text-black/20"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-md"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[14px] font-[330] text-black/40 hover:text-black/60 transition-colors mb-8 group"
            >
              <ArrowRight className="h-3 w-3 rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to home
            </Link>

            <h1 className="text-[26px] font-[540] leading-[1.35] tracking-[-0.26px] text-black">
              Sign In
            </h1>
            <p className="mt-2 text-[16px] font-[330] leading-[1.45] text-black/60">
              Welcome back! Sign in to continue your interview practice.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-[14px] font-[330] text-black/60 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-white border border-[#e6e6e6] rounded-[8px] text-[16px] font-[330] text-black placeholder:text-black/30 transition-colors focus:border-black focus:outline-none focus:ring-0"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-[14px] font-[330] text-black/60 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-10 bg-white border border-[#e6e6e6] rounded-[8px] text-[16px] font-[330] text-black placeholder:text-black/30 transition-colors focus:border-black focus:outline-none focus:ring-0"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#e6e6e6] text-black focus:ring-black"
                  />
                  <span className="text-[14px] font-[330] text-black/50 group-hover:text-black/70 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-[14px] font-[330] text-black/50 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <FigmaButton
                variant="primary"
                type="submit"
                disabled={isLoading}
                className="w-full justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </FigmaButton>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e6e6e6]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-black/30">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-11 rounded-[50px] border border-[#e6e6e6] bg-white text-sm text-black/60 transition-all duration-200 hover:bg-[#f7f7f5] hover:text-black"
                >
                  <GoogleIcon />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-11 rounded-[50px] border border-[#e6e6e6] bg-white text-sm text-black/60 transition-all duration-200 hover:bg-[#f7f7f5] hover:text-black"
                >
                  <GithubIcon />
                  GitHub
                </button>
              </div>

              <p className="text-center text-[14px] font-[330] text-black/50">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-[480] text-black hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
