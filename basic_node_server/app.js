const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer();

server.on('request', (request, response) => {
  const res = fs.readFileSync('./text.txt');

  response.setHeader('Content-Type', 'text/plain');

  response.end(res);
});

server.listen(2405, '127.0.0.1', () => {
  console.log(' Server has started on: ', server.address());
});
