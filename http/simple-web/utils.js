import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.join(import.meta.dirname, 'public');

export const sendFile = (response, status, { file, type }) => {
  const stream = fs.createReadStream(path.join(publicDir, file));

  stream.on('error', (error) => {
    if (!response.headersSent) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(`Internal Server Error: ${error.message}`);
      return;
    }

    response.destroy();
  });

  response.writeHead(status, { 'Content-Type': type });
  stream.pipe(response);
};
