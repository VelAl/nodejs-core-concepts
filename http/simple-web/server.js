import http from 'node:http';

import { routes } from './routes.js';
import { sendHtml } from './utils.js';

const server = http.createServer();

server.on('request', (request, response) => {
  const page = routes[request.url];

  if (page && request.method === 'GET') {
    sendHtml(response, 200, page);
  } else {
    sendHtml(response, 404, '404.html');
  }
});

server.listen(9000, () => {
  console.log('Server is running on http://localhost:9000');
});
