const AWS = require('aws-sdk');

class S3Service {
  constructor(accessKey, secretKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;

    AWS.config.update({
      credentials: new AWS.Credentials({
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      })
    });

    this.s3 = new AWS.S3();
  };

  getBuckets () {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }
}

module.exports = S3Service;