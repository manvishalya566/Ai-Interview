'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import {
  Eye, EyeOff, Mail, Lock, Loader,
  ArrowRight, Brain, User, Check, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TopNav } from '@/components/ui/top-nav'
import { FigmaButton } from '@/components/ui/figma-button'
import { TextInput } from '@/components/ui/text-input'
import { Footer } from '@/components/ui/footer'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const score = password ? getStrength() : 0
  const maxScore = 6

  const getLabel = () => {
    if (!password) return ''
    if (score <= 1) return 'Weak'
    if (score <= 3) return 'Fair'
    if (score <= 4) return 'Good'
    if (score <= 5) return 'Strong'
    return 'Very Strong'
  }

  const getColor = () => {
    if (!password) return 'bg-border'
    if (score <= 1) return 'bg-block-pink'
    if (score <= 3) return 'bg-block-cream'
    if (score <= 4) return 'bg-block-lime'
    if (score <= 5) return 'bg-block-mint'
    return 'bg-block-mint'
  }

  const getTextColor = () => {
    if (!password) return 'text-foreground/30'
    if (score <= 1) return 'text-foreground/60'
    if (score <= 3) return 'text-foreground/60'
    if (score <= 4) return 'text-foreground'
    return 'text-foreground'
  }

  const segments = [
    { label: 'Weak', color: 'bg-block-pink' },
    { label: 'Fair', color: 'bg-block-cream' },
    { label: 'Good', color: 'bg-block-lime' },
    { label: 'Strong', color: 'bg-block-mint' },
    { label: 'Very Strong', color: 'bg-block-mint' },
  ]

  const activeIndex = Math.min(Math.floor(score / 1.2), 4)

  const requirements = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number or symbol', met: /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-1 h-1">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className={cn(
              'flex-1 rounded-full transition-all duration-500',
              password && i <= activeIndex ? seg.color : 'bg-border'
            )}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-2">
            <div
              className={cn(
                'h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-all duration-300',
                req.met
                  ? 'border-block-mint bg-block-mint'
                  : 'border-border'
              )}
            >
              {req.met && <Check className="h-2.5 w-2.5 text-foreground" />}
            </div>
            <span
              className={cn(
                'text-caption transition-colors duration-300',
                req.met ? 'text-foreground/60' : 'text-foreground/30'
              )}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
      {password && (
        <p className={cn('text-caption font-medium transition-colors duration-300', getTextColor())}>
          {getLabel()}
        </p>
      )}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!authLoading && authUser) {
      router.replace('/dashboard')
    }
  }, [authUser, authLoading, router])

  if (authLoading) return null
  if (authUser) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    if (password !== confirmPassword) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = "/dashboard"
      } else {
        setErrorMessage(data.message || data.error || "Signup failed")
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-canvas">
      <TopNav />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <div className="rounded-lg border border-hairline bg-background p-8 sm:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-foreground">MockAI</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-headline text-foreground">
                Create your account
              </h1>
              <p className="mt-2 text-body-sm text-foreground/50">
                Start practicing interviews with AI-powered feedback.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              {errorMessage && (
                <div className="rounded-md bg-block-pink px-4 py-3 text-sm text-foreground">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-caption text-foreground/40">
                  Full name
                </label>
                <TextInput
                  id="fullName"
                  type="text"
                  icon={User}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-caption text-foreground/40">
                  Email
                </label>
                <TextInput
                  id="email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-caption text-foreground/40">
                  Password
                </label>
                <div className="relative">
                  <TextInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-caption text-foreground/40">
                  Confirm password
                </label>
                <div className="relative">
                  <TextInput
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors p-0.5"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 mt-1.5">
                    {password === confirmPassword ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-foreground/60" />
                        <span className="text-caption text-foreground/60">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3.5 w-3.5 text-foreground/60" />
                        <span className="text-caption text-foreground/60">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer group pt-1">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-4 w-4 rounded border border-hairline bg-background peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                    {agreeTerms && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                </div>
                <span className="text-body-sm text-foreground/40 group-hover:text-foreground/60 transition-colors leading-relaxed select-none">
                  I agree to the{' '}
                  <Link href="#" className="font-semibold text-foreground/60 hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="font-semibold text-foreground/60 hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <FigmaButton
                variant="primary"
                type="submit"
                disabled={isLoading || !agreeTerms}
                className="w-full justify-center h-12 text-button"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </FigmaButton>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6"
            >
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-hairline" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-4 text-foreground/30">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-11 rounded-md border border-hairline bg-background text-sm font-medium text-foreground/50 transition-all duration-200 hover:bg-secondary hover:text-foreground hover:border-foreground/20 active:scale-[0.98]"
                >
                  <GoogleIcon />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 h-11 rounded-md border border-hairline bg-background text-sm font-medium text-foreground/50 transition-all duration-200 hover:bg-secondary hover:text-foreground hover:border-foreground/20 active:scale-[0.98]"
                >
                  <GithubIcon />
                  GitHub
                </button>
              </div> */}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 text-center text-body-sm text-foreground/40"
            >
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
