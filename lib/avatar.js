import axios from 'axios'

const DID_API_BASE = 'https://api.d-id.com'
const DID_TIMEOUT = 120000
const DID_POLL_INTERVAL = 2000

export async function generateMurfAudio(text) {
  const res = await axios.post(
    'https://api.murf.ai/v1/speech/generate',
    {
      text: text.trim(),
      voiceId: 'en-US-natalie',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.MURF_API_KEY,
      },
      timeout: 30000,
    }
  )

  const audioUrl = res.data?.audioFile

  if (!audioUrl || typeof audioUrl !== 'string') {
    throw new Error('Murf AI returned no audio URL')
  }

  return audioUrl
}

export async function createDIDTalk(audioUrl) {
  const avatarImage = process.env.AVATAR_IMAGE_URL || 'https://d-id-public-bucket.s3.us-west-2.amazonaws.com/ai-avatar-sample.jpg'

  const res = await axios.post(
    `${DID_API_BASE}/talks`,
    {
      source_url: avatarImage,
      script: {
        type: 'audio',
        audio_url: audioUrl,
        subtitles: 'false',
      },
      config: {
        result_format: 'mp4',
        fluent: 'false',
        pad_audio: '0.0',
      },
    },
    {
      headers: {
        Authorization: `Basic ${process.env.DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  if (!res.data?.id) {
    throw new Error('D-ID returned no talk ID')
  }

  return res.data.id
}

export async function checkDIDTalkStatus(talkId) {
  try {
    const res = await axios.get(`${DID_API_BASE}/talks/${talkId}`, {
      headers: {
        Authorization: `Basic ${process.env.DID_API_KEY}`,
      },
      timeout: 10000,
    })

    const data = res.data

    if (data.status === 'done' && data.result_url) {
      return { status: 'completed', videoUrl: data.result_url }
    }

    if (data.status === 'error') {
      return { status: 'failed', error: data.error || 'D-ID generation failed' }
    }

    return { status: 'processing' }
  } catch (err) {
    return { status: 'failed', error: err.response?.data?.message || err.message || 'Status check failed' }
  }
}

export async function pollDIDTalkStatus(talkId) {
  const startTime = Date.now()
  const timeout = DID_TIMEOUT

  while (Date.now() - startTime < timeout) {
    const result = await checkDIDTalkStatus(talkId)

    if (result.status === 'completed') {
      return { success: true, videoUrl: result.videoUrl }
    }

    if (result.status === 'failed') {
      return { success: false, error: result.error }
    }

    await new Promise((r) => setTimeout(r, DID_POLL_INTERVAL))
  }

  return { success: false, error: 'D-ID generation timed out' }
}
