const fs = require('node:fs');
const { Duplex } = require('node:stream');

class CustomDuplexStream extends Duplex {
  constructor({
    readableHighWaterMark,
    writableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readableHighWaterMark, writableHighWaterMark });

    this.readFileName = readFileName;
    this.writeFileName = writeFileName;

    this.readFd = null; // file descriptor for reading
    this.writeFd = null; // file descriptor for writing

    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, 'r', (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;

      fs.open(this.writeFileName, 'w', (err, writeFd) => {
        if (err) return callback(err);
        this.writeFd = writeFd;

        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        } else {
          this.chunks = [];
          this.chunksSize = 0;

          callback();
        }
      });
    } else {
      callback();
    }
  }

  _read(size) {
    const buffer = Buffer.alloc(size);

    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);

      // null signals the end of the stream
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];

      callback();
    });
  }

  _destroy(error, callback) {
    callback(error);
  }
}

const duplexStream = new CustomDuplexStream({
  readableHighWaterMark: 15,
  writableHighWaterMark: 15,
  readFileName: 'text.txt',
  writeFileName: 'output.txt',
});

duplexStream.write(Buffer.from('Hello, '));
duplexStream.write(Buffer.from('world!\n'));
duplexStream.write(Buffer.from('Some text data!\n'));

duplexStream.on('data', (chunk) => {
  console.log('Read chunk:', chunk.toString('utf-8'));
});

duplexStream.on('end', () => {
  console.log('No more data to read.');
});

duplexStream.end();
