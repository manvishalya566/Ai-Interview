import { PDFParse } from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("resume");

    if (!file) {
      return Response.json({
        success: false,
        message: "No file uploaded",
      });
    }    
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    return Response.json({
      success: true,
      extractedText: result.text,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}