const { Writable } = require('node:stream');
const fs = require('node:fs');

class MyWritableStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null; // file descriptor
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  // This will run after the constructor and will delay the execution of other methods
  // until the callback is called, ensuring the file is opened before proceeding.
  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        } else {
          this.chunks = [];
          this.chunksSize = 0;

          ++this.writesCount;

          callback();
        }
      });
    } else {
      // when we are done, we should call the callback
      callback();
    }
  }

  // run when stream.end() is called, when stream is done
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];

      callback();
    });
  }

  _destroy(error, callback) {
    console.log(`Number of writes: ${this.writesCount}`);

    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
      return;
    }

    callback(error);
  }
}

const stream = new MyWritableStream({
  highWaterMark: 1800,
  fileName: 'text.txt',
});

stream.write(Buffer.from('Hello, World! This is some string'));
stream.end(Buffer.from('\nHello, World! This is the end of the string'));
stream.on('finish', () => {
  console.log('Stream was finished');
});
