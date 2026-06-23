import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'test-resume.pdf');
const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
const fileContent = fs.readFileSync(filePath);
const fileName = 'test-resume.pdf';

const header = `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n`;
const footer = `\r\n--${boundary}--\r\n`;

const bodyBuffer = Buffer.concat([
  Buffer.from(header, 'utf-8'),
  fileContent,
  Buffer.from(footer, 'utf-8')
]);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/resume-upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': bodyBuffer.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(bodyBuffer);
req.end();
