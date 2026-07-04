import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.join(import.meta.dirname, 'public');

const pageStream = (name) => fs.createReadStream(path.join(publicDir, name));

export const sendHtml = (response, status, page) => {
  const stream = pageStream(page);

  stream.on('error', () => {
    if (!response.headersSent) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(
        `Internal Server Error: ${error.message || 'Unknown error'}`
      );
      return;
    }

    response.destroy();
  });

  response.writeHead(status, { 'Content-Type': 'text/html' });
  stream.pipe(response);
};
