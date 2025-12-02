const net = require('net');
const crypto = require('crypto');
const { ID_PRFX } = require('./helpers');

const server = net.createServer();

const clients = [];

server.on('connection', (socket) => {
  const clientID = crypto.randomBytes(8).readBigUInt64BE().toString();
  socket.write(`${ID_PRFX}${clientID}`);

  console.log(`Client ID: ${clientID} connected to the server!`);

  socket.on('data', (data) => {
    console.log('Message received >>>', data.toString());

    clients.forEach((cl) => {
      cl.socket.write(data);
    });
  });

  socket.on('close', () => {
    const i = clients.findIndex((cl) => cl.socket === socket);
    if (i !== -1) {
      const closedClientID = clients[i].clientID;

      clients.splice(i, 1);

      clients.forEach((client) => {
        client.write(`Client ID${closedClientID} closed`);
      });
    }
  });

  clients.push({ id: clientID, socket });
});

server.listen(3002, '127.0.0.1', () => {
  console.log('Server is running on', server.address());
});

server.on('close', () => {
  clients.splice(0, clients.length);
});
