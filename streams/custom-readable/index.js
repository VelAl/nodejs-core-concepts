const fs = require('node:fs');
const { Readable } = require('node:stream');

class MyReadableStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null; // file descriptor
  }

  _construct(callback) {
    fs.open(this.fileName, 'r', (err, fd) => {
      if (err) return callback(err);

      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);

    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);

      // null signals the end of the stream
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (closeErr) => callback(err || closeErr));
    } else {
      callback(err);
    }
  }
}

const myReadableStream = new MyReadableStream({
  highWaterMark: 15,
  fileName: 'text.txt',
});

myReadableStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});

myReadableStream.on('end', () => {
  console.log('Stream is done reading.');
});
