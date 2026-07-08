import fs from 'node:fs';
import path from 'node:path';

const storeDir = path.join(import.meta.dirname, 'store');

const mimeTypes = {
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const getStoredImage = () => {
  if (!fs.existsSync(storeDir)) {
    return null;
  }

  const filename = fs
    .readdirSync(storeDir)
    .find((entry) => entry.startsWith('image.'));

  if (!filename) {
    return null;
  }

  const extension = path.extname(filename).toLowerCase();

  return {
    path: path.join(storeDir, filename),
    type: mimeTypes[extension] || 'application/octet-stream',
  };
};

export const handleImageFileGet = (request, response) => {
  const storedImage = getStoredImage();

  if (!storedImage) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('No file uploaded yet.');
    return;
  }

  const stream = fs.createReadStream(storedImage.path);

  stream.on('error', (error) => {
    if (!response.headersSent) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(`Failed to read image: ${error.message}`);
      return;
    }

    response.destroy();
  });

  response.writeHead(200, { 'Content-Type': storedImage.type });
  stream.pipe(response);
};
