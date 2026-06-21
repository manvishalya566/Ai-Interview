import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'

vi.mock('@sage-rsc/talking-head-react', () => ({
  TalkingHeadAvatar: React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      speakText: vi.fn(),
      stopSpeaking: vi.fn(),
      resumeAudioContext: vi.fn().mockResolvedValue(undefined),
      isReady: true,
    }))
    return <div data-testid="talking-head-avatar" />
  }),
  SimpleTalkingAvatar: React.forwardRef((props, ref) => {
    return <div data-testid="simple-talking-avatar" />
  }),
  TalkingHeadComponent: React.forwardRef((props, ref) => {
    return <div data-testid="talking-head-component" />
  }),
}))

vi.mock('next/dynamic', () => ({
  default: (importFn) => {
    const Component = React.forwardRef((props, ref) => {
      const [Loaded, setLoaded] = React.useState(null)
      React.useEffect(() => {
        importFn().then(mod => {
          setLoaded(() => mod.TalkingHeadAvatar)
        })
      }, [])
      if (!Loaded) return <div data-testid="dynamic-loading" />
      return <Loaded ref={ref} {...props} />
    })
    Component.displayName = 'DynamicComponent'
    return Component
  }
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
    span: React.forwardRef((props, ref) => <span ref={ref} {...props} />),
    p: React.forwardRef((props, ref) => <p ref={ref} {...props} />),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

describe('Interviewer3D', () => {
  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../components/Interviewer3D')
  })

  it('renders loading state initially', async () => {
    const Interviewer3D = (await import('../components/Interviewer3D')).default
    const { container } = render(
      <Interviewer3D
        isSpeaking={false}
        isGenerating={false}
        interviewState="idle"
      />
    )
    expect(container.querySelector('.aspect-\\[4\\/3\\]')).toBeInTheDocument()
  })

  it('renders idle state with correct status', async () => {
    const Interviewer3D = (await import('../components/Interviewer3D')).default
    render(
      <Interviewer3D
        isSpeaking={false}
        isGenerating={false}
        interviewState="idle"
      />
    )
    await waitFor(() => {
      const statusTexts = screen.getAllByText('AI Interviewer')
      expect(statusTexts.length).toBeGreaterThan(0)
    })
  })

  it('renders speaking glow when speaking', async () => {
    const Interviewer3D = (await import('../components/Interviewer3D')).default
    const { container } = render(
      <Interviewer3D
        isSpeaking={true}
        isGenerating={false}
        interviewState="active"
      />
    )
    const statusBadge = screen.getByText('Speaking')
    expect(statusBadge).toBeInTheDocument()
  })

  it('renders listening state when active and not speaking', async () => {
    const Interviewer3D = (await import('../components/Interviewer3D')).default
    render(
      <Interviewer3D
        isSpeaking={false}
        isGenerating={false}
        interviewState="active"
      />
    )
    const statusBadge = screen.getByText('Listening')
    expect(statusBadge).toBeInTheDocument()
  })
})
