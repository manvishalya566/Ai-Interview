import "@/lib/pdf-polyfill";
import { PDFParse } from "pdf-parse";
import { createWorker } from "tesseract.js";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync, mkdtempSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

async function extractTextWithPdfjs(uint8array) {
  const parser = new PDFParse({ data: Buffer.from(uint8array) });
  const result = await parser.getText();
  await parser.destroy();
  return { text: result.text, pages: result.pages, pageCount: result.total };
}

async function renderPageToImage(uint8array, pageIndex) {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const { createCanvas } = await import("canvas");
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(uint8array) });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(pageIndex);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    const imageBuffer = canvas.toBuffer("image/png");
    page.cleanup();
    await doc.destroy();
    return new Uint8Array(imageBuffer.buffer, imageBuffer.byteOffset, imageBuffer.byteLength);
  } catch (renderErr) {
    console.log(`[resume-upload] pdfjs render failed for page ${pageIndex}:`, renderErr.message);
    const tmpDir = mkdtempSync(join(tmpdir(), "resume-ocr-"));
    const pdfPath = join(tmpDir, "input.pdf");
    const pngPath = join(tmpDir, `page-${pageIndex}.png`);
    try {
      writeFileSync(pdfPath, Buffer.from(uint8array));
      execSync(`sips -s format png "${pdfPath}" --out "${pngPath}"`, {
        timeout: 30000,
        stdio: "ignore",
      });
      const pngBuf = readFileSync(pngPath);
      return new Uint8Array(pngBuf.buffer, pngBuf.byteOffset, pngBuf.byteLength);
    } catch (sipsErr) {
      throw new Error(
        `PDF page rendering failed: ${renderErr.message}. ${sipsErr.message}`
      );
    } finally {
      try { unlinkSync(pdfPath); } catch {}
      try { unlinkSync(pngPath); } catch {}
      try { unlinkSync(tmpDir); } catch {}
    }
  }
}

async function extractTextWithOcr(uint8array) {
  const parser = new PDFParse({ data: Buffer.from(uint8array) });
  const info = await parser.getInfo();
  const totalPages = info.total;
  await parser.destroy();

  const worker = await createWorker("eng", 1, { logger: () => {} });

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    try {
      const imageBuffer = await renderPageToImage(uint8array, i);
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
