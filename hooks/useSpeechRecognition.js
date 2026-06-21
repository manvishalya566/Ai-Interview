'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useInterviewStore } from '@/stores/interview-store'

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export function useSpeechRecognition() {
  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)
  const finalTranscriptRef = useRef('')

  const createRecognition = useCallback(() => {
    if (!SpeechRecognitionAPI) return null
    const recog = new SpeechRecognitionAPI()
    recog.continuous = true
    recog.interimResults = true
    recog.lang = 'en-US'
    return recog
  }, [])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.stop()
      } catch {}
      recognitionRef.current = null
    }
    isListeningRef.current = false
  }, [])

  const start = useCallback(() => {
    if (isListeningRef.current) return
    stop()

    const recog = createRecognition()
    if (!recog) return
    recognitionRef.current = recog

    const existing = useInterviewStore.getState().transcript
    finalTranscriptRef.current = existing ? existing + ' ' : ''

    recog.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      const displayText = (finalTranscriptRef.current + interim).trim()
      if (displayText) {
        useInterviewStore.getState().setTranscript(displayText)
      }
    }

    recog.onend = () => {
      isListeningRef.current = false
      const state = useInterviewStore.getState()
      if (state.interviewState === 'active' && !state.isSpeaking && !state.isGenerating) {
        start()
      }
    }

    recog.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      if (event.error === 'not-allowed') {
        useInterviewStore.getState().setErrorMessage('Microphone access denied')
        return
      }
      isListeningRef.current = false
    }

    try {
      recog.start()
      isListeningRef.current = true
    } catch (e) {
      isListeningRef.current = false
    }
  }, [createRecognition, stop])

  useEffect(() => {
    const unsub = useInterviewStore.subscribe((state) => {
      if (state.interviewState === 'active' && !state.isSpeaking && !state.isGenerating) {
        if (!isListeningRef.current) {
          start()
        }
      } else {
        if (isListeningRef.current) {
          stop()
          const finalText = useInterviewStore.getState().transcript
          if (finalText.trim()) {
            useInterviewStore.getState().addTranscriptEntry({
              role: 'user',
              text: finalText.trim(),
              timestamp: Date.now(),
            })
          }
        }
      }
    })

    return () => {
      unsub()
      stop()
    }
  }, [start, stop])

  return { isListening: () => isListeningRef.current }
}
