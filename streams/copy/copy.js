const fs = require('node:fs/promises');

//_____OPEN==>READ==>WRITE_____________________________________________
// // Memory usage is huge for large files

// (async () => {
//   const destFile = await fs.open('text-copy.txt', 'w');

//   const result = await fs.readFile('text-gigantic.txt'); // returns all the content as a Buffer

//   await destFile.write(result);
// })();

//_____PRIMITIVE_CUSTOM_STREAM_IMPLEMENTATION__________________________
(async () => {
  console.time('copy');

  const srcFile = await fs.open('text-gigantic.txt', 'r');
  const destFile = await fs.open('text-copy.txt', 'w');

  let bytesRead = -1;

  while (bytesRead !== 0) {
    const chunk = await srcFile.read(); // returns an object with bytesRead and buffer of chunk data
    bytesRead = chunk.bytesRead;

    if (bytesRead !== 16384) {
      const firstEmptyElIdx = chunk.buffer.indexOf(0);

      const newBuffer = Buffer.alloc(firstEmptyElIdx);
      chunk.buffer.copy(newBuffer, 0, 0, firstEmptyElIdx);

      destFile.write(newBuffer);
    } else {
      destFile.write(chunk.buffer);
    }
  }

  console.timeEnd('copy');
})();
