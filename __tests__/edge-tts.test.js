import { describe, it, expect, vi, beforeEach } from 'vitest'

let mockSetMetadata
let mockToStream

function makeAsyncIterator(generator) {
  const iterator = generator()
  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          const result = iterator.next()
          return Promise.resolve(
            result.done ? { done: true, value: undefined } : { done: false, value: result.value }
          )
        },
      }
    },
  }
}

vi.mock('msedge-tts', () => {
  mockSetMetadata = vi.fn().mockResolvedValue(undefined)
  mockToStream = vi.fn()
  return {
    MsEdgeTTS: class {
      constructor() {
        this.setMetadata = mockSetMetadata
        this.toStream = mockToStream
      }
    },
    OUTPUT_FORMAT: {
      WEBM_24KHZ_16BIT_MONO_OPUS: 'webm-24khz-16bit-mono-opus',
    },
  }
})

describe('Edge TTS API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when no text is provided', async () => {
    const { POST } = await import('../app/api/edge-tts/route')
    const req = new Request('http://localhost/api/edge-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    })
    const res = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('No text provided')
  })

  it('returns 400 when text is only whitespace', async () => {
    const { POST } = await import('../app/api/edge-tts/route')
    const req = new Request('http://localhost/api/edge-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '   ' }),
    })
    const res = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('returns audio when valid text is provided', async () => {
    const mockAudioData = Buffer.from('fake-webm-audio-data')

    mockToStream.mockReturnValue({
      audioStream: makeAsyncIterator(function* () {
        yield mockAudioData
      }),
      metadataStream: null,
    })

    const { POST } = await import('../app/api/edge-tts/route')
    const req = new Request('http://localhost/api/edge-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hello, this is a test question.' }),
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('audio/webm')
    expect(mockSetMetadata).toHaveBeenCalledWith(
      'en-US-AriaNeural',
      'webm-24khz-16bit-mono-opus',
      { wordBoundaryEnabled: true, sentenceBoundaryEnabled: true }
    )
  })

  it('uses custom voice when provided', async () => {
    mockToStream.mockReturnValue({
      audioStream: makeAsyncIterator(function* () {
        yield Buffer.from('fake-audio')
      }),
      metadataStream: null,
    })

    const { POST } = await import('../app/api/edge-tts/route')
    const req = new Request('http://localhost/api/edge-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test', voice: 'en-US-JennyNeural' }),
    })
    await POST(req)

    expect(mockSetMetadata).toHaveBeenCalledWith(
      'en-US-JennyNeural',
      expect.any(String),
      expect.any(Object)
    )
  })

  it('handles TTS errors gracefully', async () => {
    mockSetMetadata.mockRejectedValueOnce(new Error('Connection failed'))

    const { POST } = await import('../app/api/edge-tts/route')
    const req = new Request('http://localhost/api/edge-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test question' }),
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Connection failed')
  })
})
