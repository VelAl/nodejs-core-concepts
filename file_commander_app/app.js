const fs = require('fs/promises');

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

    const content = await commandHandlerFile.read(
      buff,
      offset,
      length,
      position
    );

    console.log('The file has been changed ===>', content.buffer.toString('utf-8'));
  });

  for await (const event of watcher) {
    // triggering events
    if (event.eventType === 'change') {
      commandHandlerFile.emit('change'); // emit a change event
    }
  }
})();
