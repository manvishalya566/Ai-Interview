import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

export async function POST(req) {
  const tts = new MsEdgeTTS()
  try {
    const { text, voice } = await req.json()

    if (!text || !text.trim()) {
      return Response.json({ success: false, error: 'No text provided' }, { status: 400 })
    }

    await tts.setMetadata(
      voice || 'en-US-AriaNeural',
      OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
      { wordBoundaryEnabled: true }
    )

    const { audioStream, metadataStream } = tts.toStream(text.trim())

    const audioChunks = []
    const metadataChunks = []

    audioStream.on('data', (chunk) => audioChunks.push(chunk))
    if (metadataStream) {
      metadataStream.on('data', (chunk) => metadataChunks.push(chunk))
    }

    await new Promise((resolve) => {
      audioStream.on('end', resolve)
      audioStream.on('error', resolve)
    })

    if (metadataStream) {
      metadataStream.destroy()
    }

    const words = []
    const wtimes = []
    const wdurations = []

    for (const chunk of metadataChunks) {
      try {
        const json = JSON.parse(chunk.toString())
        if (json.Metadata) {
          for (const item of json.Metadata) {
            if (item.Type === 'WordBoundary' && item.Data) {
              const text = item.Data.text?.Text || item.Data.Text
              if (text) {
                words.push(text)
                wtimes.push(Math.round((item.Data.Offset || 0) / 10000))
                wdurations.push(Math.round((item.Data.Duration || 0) / 10000))
              }
            }
          }
        }
      } catch {
        // skip unparseable metadata chunks
      }
    }

    const audioBuffer = Buffer.concat(audioChunks)
    const audio = audioBuffer.toString('base64')

    return Response.json({
      audio,
      audioFormat: 'audio/mpeg',
      words,
      wtimes,
      wdurations,
    })
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || 'Edge TTS request failed' },
      { status: 500 }
    )
  } finally {
    tts.close()
  }
}
