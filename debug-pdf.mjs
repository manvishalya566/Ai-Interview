import { PDFParse } from "pdf-parse";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'test-resume.pdf');
const buffer = fs.readFileSync(filePath);

try {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  console.log("Document loaded, pages:", result.total);
  console.log("Full text:");
  console.log(result.text);
  console.log("SUCCESS: Text extracted");
  await parser.destroy();
} catch (err) {
  console.error("FAILED:", err.message);
  console.error("Stack:", err.stack?.substring(0, 500));
}
