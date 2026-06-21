import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return Response.json(
        { success: false, error: "No text provided" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      {
        text: text.trim(),
        voiceId: "en-US-natalie",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.MURF_API_KEY,
        },
        timeout: 30000,
      }
    );

    const audioUrl = response.data?.audioFile;

    if (!audioUrl || typeof audioUrl !== "string") {
      return Response.json(
        { success: false, error: "Invalid response from Murf AI - no audio URL" },
        { status: 502 }
      );
    }

    try {
      new URL(audioUrl);
    } catch {
      return Response.json(
        { success: false, error: "Malformed audio URL from Murf AI" },
        { status: 502 }
      );
    }

    return Response.json({ success: true, audioUrl });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Text-to-speech request failed";

    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
