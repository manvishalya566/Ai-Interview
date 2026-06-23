import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { createWorker } from "tesseract.js";
import { createCanvas } from "canvas";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

async function extractTextWithPdfjs(uint8array) {
  const loadingTask = pdfjs.getDocument({ data: uint8array });
  const doc = await loadingTask.promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    pages.push(text);
    page.cleanup();
  }

  await doc.destroy();
  return { text: pages.join("\n\n"), pages: pages, pageCount: doc.numPages };
}

async function renderPageToImage(uint8array, pageIndex) {
  const loadingTask = pdfjs.getDocument({ data: uint8array });
  const doc = await loadingTask.promise;
  const page = await doc.getPage(pageIndex);

  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext("2d");

  await page.render({ canvasContext: ctx, viewport }).promise;

  const imageBuffer = canvas.toBuffer("image/png");
  page.cleanup();
  await doc.destroy();

  return imageBuffer;
}

async function extractTextWithOcr(uint8array) {
  const loadingTask = pdfjs.getDocument({ data: uint8array });
  const doc = await loadingTask.promise;
  const totalPages = doc.numPages;
  await doc.destroy();

  const worker = await createWorker("eng", 1,
    { logger: () => {} }
  );

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    try {
      const imageBuffer = await renderPageToImage(buffer, i);
      const { data } = await worker.recognize(imageBuffer);
      pages.push(data.text || "");
    } catch (pageErr) {
      console.error(`[resume-upload] OCR page ${i} failed:`, pageErr.message);
      pages.push("");
    }
  }

  await worker.terminate();
  return { text: pages.join("\n\n"), pages, pageCount: totalPages };
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return Response.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { success: false, message: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { success: false, message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const uint8array = new Uint8Array(bytes);

    let result;
    let method = "text";

    try {
      result = await extractTextWithPdfjs(uint8array);
      if (!result.text || result.text.trim().length < 50) {
        console.log("[resume-upload] Text extraction returned too little text, falling back to OCR");
        method = "ocr";
        result = await extractTextWithOcr(uint8array);
      }
    } catch (textErr) {
      console.log("[resume-upload] Text extraction failed:", textErr.message, "- falling back to OCR");
      method = "ocr";
      try {
        result = await extractTextWithOcr(uint8array);
      } catch (ocrErr) {
        console.error("[resume-upload] OCR also failed:", ocrErr.message);
        return Response.json(
          { success: false, message: "Could not extract text from the PDF. Ensure the PDF contains readable text." },
          { status: 422 }
        );
      }
    }

    const extractedText = result.text.trim();
    if (!extractedText) {
      return Response.json(
        { success: false, message: "Could not extract any text from the PDF." },
        { status: 422 }
      );
    }

    return Response.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      extractedText,
      pageCount: result.pageCount,
      method,
    });
  } catch (error) {
    console.error("[resume-upload] Error:", error.message);
    return Response.json(
      { success: false, message: error.message || "Failed to process resume" },
      { status: 500 }
    );
  }
}
