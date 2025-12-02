const net = require('net');
const readline = require('readline/promises');

const { ID_PRFX } = require('./helpers');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearTerminalLine = (dir) =>
  new Promise((res, rej) => {
    process.stdout.clearLine(dir, () => {
      res();
    });
  });

const moveTerminalCursor = (dx, dy) =>
  new Promise((res, rej) => {
    process.stdout.moveCursor(dx, dy, () => {
      res();
    });
  });

let clientID = null;
const catchIdAssignedByServer = (message) => {
  if (!clientID && message.toString('utf-8').startsWith(ID_PRFX)) {
    const [_, ID] = message.toString('utf-8').split(ID_PRFX);
    clientID = ID;

    console.log('ID assigned ===>', ID);

    return true;
  }
};

const clientSocket = net.createConnection(
  {
    host: 'localhost',
    port: 3002,
  },

  async () => {
    console.log('Connected to server');

    const askQuestionInTerminal = async () => {
      const message = await rl.question('Enter a message >  ');

      await moveTerminalCursor(0, -1);
      await clearTerminalLine(0);

      clientSocket.write(`Client: ${clientID}===> ${message}`);
    };

    askQuestionInTerminal();

    clientSocket.on('data', async (data) => {
      if (catchIdAssignedByServer(data)) return;

      console.log();

      await moveTerminalCursor(0, -1);
      await clearTerminalLine(0);

      console.log('data ===>', data.toString('utf-8'));

      askQuestionInTerminal();
    });
  }
);

clientSocket.on('close', () => {
  console.log('Connection closed');
});

clientSocket.on('end', () => {
  console.log('Connection ended');
});
