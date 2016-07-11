const AWS = require('aws-sdk');
const EventEmitter = require('events');
const configService = require('./ConfigurationService');

class S3Service {
  constructor(accessKey, secretKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;

    AWS.config.update({
      credentials: new AWS.Credentials({
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      }),
    });

    this.s3 = new AWS.S3();
  }

  getBuckets() {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }

  uploadFile(fileName, data) {
    const uploadEventEmitter = new EventEmitter();

    this.s3.upload({
      Body: data,
      ACL: configService.getItem('ACL'),
      Key: fileName,
      StorageClass: configService.getItem('storageClass'),
      Bucket: configService.getItem('bucket'),
    }, (err, payload) => {
      if (err) uploadEventEmitter.emit('error', err);
      uploadEventEmitter.emit('success', payload);
    }).on('httpUploadProgress', (progress) => {
      uploadEventEmitter.emit('progress', progress);
    });

    return uploadEventEmitter;
  }
}

module.exports = S3Service;
