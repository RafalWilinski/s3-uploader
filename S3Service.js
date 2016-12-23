const AWS = require('aws-sdk');
const EventEmitter = require('events');
const fileType = require('file-type');
const configService = require('./ConfigurationService');

/**
 * High-level wrapper for AWS.S3 API with Promises instead of callbacks.
 */
class S3Service {
  /**
   * Constructor, creates S3Service object with AWS.S3 property.
   *
   * Constructor does not validate credentials validity.
   * @param accessKey
   * @param secretKey
   */
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

  /**
   * AWS.S3.listBuckets wrapper.
   * @returns {Promise}
   */
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

  /**
   * AWS.S3.upload wrapper with some values preloaded from local configuration.
   * Returns EventEmitter emiting following events:
   * - error
   * - progress
   * - success
   * @returns {EventEmitter}
   */
  uploadFile(fileName, data) {
    const uploadEventEmitter = new EventEmitter();
    const mimeType  = fileType(data);

    this.s3.upload({
      Body: data,
      ContentType: (mimeType) ? mimeType.mime : 'application/octet-stream',
      ACL: configService.getItem('ACL'),
      Key: configService.getItem('folder') + '/' + fileName,
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
