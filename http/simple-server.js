const http = require('node:http');

const server = http.createServer();

server.on('request', (request, response) => {
  request.resume();

  request.on('end', () => {
    response.writeHead(201, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.js',
    });

    response.end(JSON.stringify({ message: 'Post created successfully' }));
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
