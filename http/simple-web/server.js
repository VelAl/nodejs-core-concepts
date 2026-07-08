import http from 'node:http';

import { notFound, routes } from './routes.js';
import { handleImageFileGet } from './image.js';
import { handleUploadPatch } from './upload.js';
import { sendFile } from './utils.js';

const server = http.createServer();

server.on('request', (request, response) => {
  if (request.url === '/upload' && request.method === 'PATCH') {
    handleUploadPatch(request, response);
    return;
  }

  if (request.url === '/image/file' && request.method === 'GET') {
    handleImageFileGet(request, response);
    return;
  }

  const route = routes[request.url];

  if (route && request.method === 'GET') {
    sendFile(response, 200, route);
  } else {
    sendFile(response, 404, notFound);
  }
});

server.listen(9000, () => {
  console.log('Server is running on http://localhost:9000');
});
