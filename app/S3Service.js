import 'aws-sdk/dist/aws-sdk';

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

    // Remember credentials in persistent storage
    window.localStorage.setItem('accessKey', accessKey);
    window.localStorage.setItem('secretKey', secretKey);
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

export default S3Service;