import http from 'node:http';

import { notFound, routes } from './routes.js';
import { sendFile } from './utils.js';

const server = http.createServer();

server.on('request', (request, response) => {
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
