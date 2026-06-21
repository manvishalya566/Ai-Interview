import { checkDIDTalkStatus } from '@/lib/avatar'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const talkId = searchParams.get('talkId')

    if (!talkId) {
      return Response.json(
        { success: false, error: 'No talkId provided' },
        { status: 400 }
      )
    }

    const result = await checkDIDTalkStatus(talkId)

    return Response.json({ success: true, ...result })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || 'Status check failed' },
      { status: 500 }
    )
  }
}
