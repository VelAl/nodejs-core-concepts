const { Transform } = require('node:stream');
const fs = require('node:fs/promises');

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      chunk[i] = decryptBite(chunk[i]);
    }

    this.push(chunk);

    callback();
  }
}
(async () => {
  const readFile = await fs.open('encrypted.txt', 'r');
  const writeFile = await fs.open('decrypted.txt', 'w');

  const readStream = readFile.createReadStream({
    highWaterMark: 5,
  });
  const writeStream = writeFile.createWriteStream();

  const decrypt = new Decrypt();

  readStream.pipe(decrypt).pipe(writeStream);
})();

const maxByte = {
  '-1': 255,
};
function decryptBite(byte) {
  return maxByte[byte - 1] ?? byte - 1;
}
