'use client'
import { useEffect } from 'react'
import { useInterviewStore } from '@/stores/interview-store'

export function useTimerInterval() {
  const interviewState = useInterviewStore((s) => s.interviewState)

  useEffect(() => {
    if (interviewState === 'active') {
      const id = setInterval(() => {
        useInterviewStore.getState().incrementTimer()
      }, 1000)
      return () => clearInterval(id)
    }
  }, [interviewState])
}
