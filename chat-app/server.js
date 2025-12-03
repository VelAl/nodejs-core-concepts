const net = require('net');
const { ClientsBook } = require('./helpers');

const server = net.createServer();

const clients = [];
const clientsBook = new ClientsBook();

server.on('connection', (socket) => {
  clientsBook.addClient(socket);

  socket.on('data', (data) => {
    clientsBook.sendMessageToAllClients(data);
  });

  socket.on('close', () => {
    clientsBook.removeClient(socket);
  });
});

server.listen(3002, '127.0.0.1', () => {
  console.log('Server is running on', server.address());
});

server.on('close', () => {
  clients.splice(0, clients.length);
});
