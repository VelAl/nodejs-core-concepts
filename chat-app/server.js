const net = require('net');

const server = net.createServer();

const clients = [];

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    console.log('Message received >>>', data.toString());

    clients.forEach((client) => {
      client.write(data);
    });
  });

  socket.on('close', () => {
    const i = clients.findIndex((cl) => cl === socket);
    if (i !== -1) {
      clients.splice(i, 1);

      clients.forEach((client) => {
        client.write(`Client #${i + 1} closed`);
      });
    }
  });

  clients.push(socket);
});

server.listen(3002, '127.0.0.1', () => {
  console.log('Server is running on', server.address());
});

server.on('close', () => {
  clients.splice(0, clients.length);
});
