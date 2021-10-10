const sharp = require("sharp");
const { encode } = require("blurhash");
const request = require('request');

const encodeImageToBlurhash = url =>
  new Promise((resolve, reject) => {
    request({url, encoding: null}, function(error, response, body) {
      if(!error) {
        sharp(body)
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: "inside" })
        .toBuffer((err, buffer, info) => {
          if (err) return reject(err);
          resolve(encode(new Uint8ClampedArray(buffer), info.width, info.height, 4, 4));
        });
      }else{
        reject(error);
      }
    });
  });

module.exports = encodeImageToBlurhash;