const fs = require('node:fs/promises');

(async () => {
  const fileHandleRead = await fs.open('src_text.txt', 'r');
  const fileHandleWrite = await fs.open('dest_text.txt', 'w');

  const streamREAD = fileHandleRead.createReadStream();
  const streamWRITE = fileHandleWrite.createWriteStream();

  // stream.readableHighWaterMark === 65536

  streamREAD.on('data', (chunk) => {
    const isEmpty = streamWRITE.write(chunk);

    if (!isEmpty) {
      streamREAD.pause();
    }
  });

  streamWRITE.on('drain', () => {
    streamREAD.resume();
  });

  streamREAD.on('end', () => {
    streamWRITE.end();
    fileHandleRead.close();
    fileHandleWrite.close();
  });
})();
