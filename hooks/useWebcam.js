'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

export function useWebcam() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [browserSupport, setBrowserSupport] = useState({ supported: true, message: '' })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!navigator.mediaDevices?.getUserMedia) {
      setBrowserSupport({
        supported: false,
        message: 'Your browser does not support camera/microphone access. Please use Chrome, Firefox, or Edge.',
      })
    }
  }, [])

  const startCamera = useCallback(async () => {
    if (typeof window === 'undefined') return

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('getUserMedia is not supported by this browser. Please use Chrome, Firefox, or Edge.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraOn(true)
      setMicOn(true)
    } catch (err) {
      let message = 'Failed to access camera or microphone.'
      switch (err.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          message = 'Camera and microphone access denied. Please allow permissions in your browser settings and try again.'
          break
        case 'NotFoundError':
          message = 'No camera or microphone found. Please connect a device and try again.'
          break
        case 'NotReadableError':
          message = 'Camera or microphone is already in use by another application.'
          break
        case 'OverconstrainedError':
          message = 'Camera does not meet requirements. Try a different device.'
          break
      }
      setError(message)
      setCameraOn(false)
      setMicOn(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraOn(false)
    setMicOn(false)
    setError(null)
    setLoading(false)
  }, [])

  const toggleCamera = useCallback(() => {
    if (!streamRef.current) {
      startCamera()
      return
    }
    const videoTrack = streamRef.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setCameraOn(videoTrack.enabled)
    }
  }, [startCamera])

  const toggleMic = useCallback(() => {
    if (!streamRef.current) return
    const audioTrack = streamRef.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setMicOn(audioTrack.enabled)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  return {
    videoRef,
    cameraOn,
    micOn,
    error,
    loading,
    browserSupport,
    startCamera,
    stopCamera,
    toggleCamera,
    toggleMic,
  }
}
