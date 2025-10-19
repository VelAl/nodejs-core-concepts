const { Transform } = require('node:stream');
const fs = require('node:fs/promises');

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      chunk[i] = encryptBite(chunk[i]);
    }

    this.push(chunk);

    callback();
  }
}
(async () => {
  const readFile = await fs.open('read.txt', 'r');
  const writeFile = await fs.open('encrypted.txt', 'w');

  const readStream = readFile.createReadStream({
    highWaterMark: 5,
  });
  const writeStream = writeFile.createWriteStream();

  const encrypt = new Encrypt();

  readStream.pipe(encrypt).pipe(writeStream);
})();

const maxByte = {
  266: 0,
};
function encryptBite(byte) {
  return maxByte[byte + 1] ?? byte + 1;
}
