import pdf from "pdf-parse";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'test-resume.pdf');
const buffer = fs.readFileSync(filePath);

try {
  const data = await pdf(buffer);
  console.log("Document loaded, pages:", data.numpages);
  console.log("Full text:");
  console.log(data.text);
  console.log("SUCCESS: Text extracted");
} catch (err) {
  console.error("FAILED:", err.message);
  console.error("Stack:", err.stack?.substring(0, 500));
}
