'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function useAvatarGenerator() {
  const [avatarStatus, setAvatarStatus] = useState({})

  const queueRef = useRef([])
  const processingRef = useRef(false)
  const pollingRef = useRef({})
  const generationIdRef = useRef(0)

  const isStale = useCallback((genId) => {
    return genId !== generationIdRef.current
  }, [])

  const processNext = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) return

    processingRef.current = true
    const genId = generationIdRef.current
    const item = queueRef.current.shift()
    const { questionId, text } = item

    setAvatarStatus(prev => ({
      ...prev,
      [questionId]: { status: 'generating', videoUrl: null, error: null },
    }))

    try {
      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, questionId }),
      })

      if (isStale(genId)) {
        processingRef.current = false
        processNext()
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setAvatarStatus(prev => ({
          ...prev,
          [questionId]: { status: 'failed', videoUrl: null, error: data?.error || 'Generation request failed' },
        }))
        processingRef.current = false
        processNext()
        return
      }

      if (isStale(genId)) {
        processingRef.current = false
        processNext()
        return
      }

      if (!data.success || !data.talkId) {
        setAvatarStatus(prev => ({
          ...prev,
          [questionId]: { status: 'failed', videoUrl: null, error: data.error || 'No talk ID' },
        }))
        processingRef.current = false
        processNext()
        return
      }

      pollForCompletion(questionId, data.talkId, genId)
    } catch (err) {
      if (!isStale(genId)) {
        setAvatarStatus(prev => ({
          ...prev,
          [questionId]: { status: 'failed', videoUrl: null, error: err.message },
        }))
      }
    }

    processingRef.current = false
    processNext()
  }, [isStale])

  const pollForCompletion = (questionId, talkId, genId) => {
    if (isStale(genId)) return

    const poll = async () => {
      if (isStale(genId)) {
        clearInterval(pollingRef.current[questionId])
        delete pollingRef.current[questionId]
        return
      }

      try {
        const res = await fetch(`/api/avatar/status?talkId=${talkId}`)
        const data = await res.json()

        if (isStale(genId)) return

        if (!data.success) return

        if (data.status === 'completed' && data.videoUrl) {
          clearInterval(pollingRef.current[questionId])
          delete pollingRef.current[questionId]
          setAvatarStatus(prev => ({
            ...prev,
            [questionId]: { status: 'ready', videoUrl: data.videoUrl, error: null },
          }))
          return
        }

        if (data.status === 'failed') {
          clearInterval(pollingRef.current[questionId])
          delete pollingRef.current[questionId]
          setAvatarStatus(prev => ({
            ...prev,
            [questionId]: { status: 'failed', videoUrl: null, error: data.error },
          }))
        }
      } catch (err) {
        clearInterval(pollingRef.current[questionId])
        delete pollingRef.current[questionId]
        setAvatarStatus(prev => ({
          ...prev,
          [questionId]: { status: 'failed', videoUrl: null, error: err.message },
        }))
      }
    }

    poll()
    pollingRef.current[questionId] = setInterval(poll, 3000)
  }

  const enqueueQuestion = useCallback((questionId, text) => {
    if (!questionId || !text) return

    const existing = avatarStatus[questionId]
    if (existing?.status === 'ready' || existing?.status === 'generating') return

    const alreadyQueued = queueRef.current.some(item => item.questionId === questionId)
    if (alreadyQueued) return

    queueRef.current.push({
      questionId,
      text: text.replace(/^["'\s]+|["'\s]+$/g, '').trim(),
    })

    processNext()
  }, [avatarStatus, processNext])

  const enqueueQuestions = useCallback((questions) => {
    if (!questions?.length) return

    questions.forEach(q => {
      const existing = avatarStatus[q.id]
      if (existing?.status === 'ready' || existing?.status === 'generating') return

      const alreadyQueued = queueRef.current.some(item => item.questionId === q.id)
      if (alreadyQueued) return

      queueRef.current.push({
        questionId: q.id,
        text: (q.question || q.text || '').replace(/^["'\s]+|["'\s]+$/g, '').trim(),
      })
    })

    processNext()
  }, [avatarStatus, processNext])

  const getAvatarStatus = useCallback((questionId) => {
    return avatarStatus[questionId] || { status: 'pending', videoUrl: null, error: null }
  }, [avatarStatus])

  const clear = useCallback(() => {
    generationIdRef.current += 1
    Object.values(pollingRef.current).forEach(clearInterval)
    pollingRef.current = {}
    queueRef.current = []
    processingRef.current = false
    setAvatarStatus({})
  }, [])

  useEffect(() => {
    return () => {
      generationIdRef.current += 1
      Object.values(pollingRef.current).forEach(clearInterval)
    }
  }, [])

  return { avatarStatus, enqueueQuestion, enqueueQuestions, getAvatarStatus, clear }
}
