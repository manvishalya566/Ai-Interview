import { generateMurfAudio, createDIDTalk } from '@/lib/avatar'

export async function POST(req) {
  try {
    const { text, questionId } = await req.json()

    if (!text?.trim()) {
      return Response.json(
        { success: false, error: 'No text provided' },
        { status: 400 }
      )
    }

    const audioUrl = await generateMurfAudio(text)

    const talkId = await createDIDTalk(audioUrl)

    return Response.json({
      success: true,
      talkId,
      questionId,
    })
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Avatar generation failed'

    return Response.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
