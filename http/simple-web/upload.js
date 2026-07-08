import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const storeDir = path.join(import.meta.dirname, 'store');

const clearStore = () => {
  // Keep only one file: remove anything left from a previous upload.
  for (const entry of fs.readdirSync(storeDir)) {
    fs.rmSync(path.join(storeDir, entry), { force: true });
  }
};

export const handleUploadPatch = async (request, response) => {
  const contentType = request.headers['content-type'] || '';
  const extension = path.extname(request.headers['x-filename'] || '');

  if (!contentType.startsWith('image/')) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Only images and GIFs are allowed.');
    return;
  }

  if (!extension) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('File extension is missing.');
    return;
  }

  try {
    clearStore();

    const savedPath = path.join(storeDir, `image${extension}`);

    await pipeline(request, fs.createWriteStream(savedPath));

    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('File uploaded successfully.');
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`Upload failed: ${error.message}`);
  }
};
