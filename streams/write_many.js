//______PROMISE_________________________________________________________
// const fs = require('fs/promises');

// Execution: ~9s
// CPU Usage: 100% (one core)
// Memory usage: 50MB
// (async () => {
//   console.time('write many');

//   const fileHandle = await fs.open('text.txt', 'w');

//   for (let i = 0; i < 1e6; i++) {
//     await fileHandle.write(i.toString() + ' '); // ~8.488s
//     // await fs.appendFile(filePath, i.toString()); // opens an closes the file each time // ~28.854s
//   }
//   await fileHandle.close();

//   console.timeEnd('write many');
// })();

//______CALLBACK________________________________________________________
// const fs = require('fs');

// Execution: ~0.25s
// CPU Usage: 100% (one core)
// Memory usage: 50MB
// (async () => {
//   console.time('write many');

//   fs.open('text.txt', 'w', (err, fd) => {
//     for (let i = 0; i < 1e6; i++) {
//       const buff = Buffer.from(`${i} `, 'utf-8');

//       fs.writeSync(fd, buff);
//     }
//   });

//   console.timeEnd('write many');
// })();

//______STREAMS_________________________________________________________
const fs = require('fs/promises');

// DON`T DO IT THIS WAY!!!!
// Execution: ~0.3s
// CPU Usage: 100% (one core)
// Memory usage: 200MB !!!!!!!!
// (async () => {
//   console.time('write many');

//   const fileHandle = await fs.open('text.txt', 'w');

//   const stream = fileHandle.createWriteStream();

//   for (let i = 0; i < 1e6; i++) {
//     const buff = Buffer.from(`${i} `, 'utf-8');

//     stream.write(buff);
//   }
//   await fileHandle.close();

//   console.timeEnd('write many');
// })();

// Execution: ~0.2s
// CPU Usage: 100% (one core)
// Memory usage: 50MB
(async () => {
  console.time('write many');

  const fileHandle = await fs.open('text.txt', 'w');

  const stream = fileHandle.createWriteStream();

  let index = 0;

  const writeMany = () => {
    while (index <= 1e6) {
      const buff = Buffer.from(`${index} `, 'utf-8');

      const isEmpty = stream.write(buff);

      // If the last write____________________________________
      if (index === 1e6) stream.end();

      index++;

      // Exit the loop if the stream internal buffer is full__
      if (!isEmpty) break;
    }
  };
  writeMany();

  stream.on('drain', writeMany);
  stream.on('finish', () => {
    fileHandle.close();
    console.timeEnd('write many');
  });
})();
