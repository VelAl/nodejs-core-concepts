const fs = require('fs/promises');

const commands = {
  CREATE: 'create a file',
  DELETE: 'delete a file',
  RENAME: 'rename a file',
};

const createFile = async (path) => {
  // Check if the file already exists
  try {
    const isFileExists = await fs.open(path, 'r');

    if (isFileExists) {
      isFileExists.close();
      throw new Error(`File "${path}" already exists!`);
    }
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      const messg = err?.message || 'Error while checking file existence';
      console.error('Error: ' + messg);
      return;
    }
  }

  // Create the file
  try {
    const newFileHandler = await fs.open(path, 'w'); // "w" write mode, creates the file if it does not exist

    console.log(`Success: new file "${path}" created!`);

    await newFileHandler.close(); // close the file handler
  } catch (err) {
    console.error('Error: ' + err?.message || 'Error while creating file');
  }
};

(async () => {
  const watcher = fs.watch('./command.txt');

  // Open the file for reading
  const commandHandlerFile = await fs.open('./command.txt', 'r'); // "r" read mode

  // File is the event emitter
  commandHandlerFile.on('change', async () => {
    const { size } = await commandHandlerFile.stat(); // get the size in bytes of the file
    const buff = Buffer.alloc(size); // allocate a buffer of the size of the file

    const offset = 0; // where to start filling from
    const length = buff.length; // how many bites to read
    const position = 0; // where to start reading from

    await commandHandlerFile.read(buff, offset, length, position);

    const command = buff.toString().trim(); // toString() uses utf-8 encoding by default

    if (command.includes(commands.CREATE)) {
      const filePath = command.substring(commands.CREATE.length + 1).trim();

      createFile(filePath);
    }
  });

  for await (const event of watcher) {
    // triggering events
    if (event.eventType === 'change') {
      commandHandlerFile.emit('change'); // emit a change event
    }
  }
})();
