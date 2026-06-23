import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'test-resume.pdf');
const buffer = fs.readFileSync(filePath);

pdfjs.GlobalWorkerOptions.workerSrc = "";

console.log("Worker disabled:", pdfjs.GlobalWorkerOptions.workerSrc);

try {
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const doc = await loadingTask.promise;
  console.log("Document loaded, pages:", doc.numPages);

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    console.log(`Page ${i}: ${text.substring(0, 200)}`);
    page.cleanup();
  }

  await doc.destroy();
  console.log("SUCCESS: Text extracted");
} catch (err) {
  console.error("FAILED:", err.message);
  console.error("Stack:", err.stack?.substring(0, 500));
}
