const http = require('node:http');

const agent = new http.Agent({
  keepAlive: true,
});

const request = http.request({
  agent,
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  path: '/create-post',
  headers: {
    'Content-Type': 'application/json',
    name: 'Client 1',
  },
});

request.on('response', (response) => {
  response.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
});

request.write(
  JSON.stringify({ title: 'Hello, world!', content: 'This is a test post' })
);

request.end();
