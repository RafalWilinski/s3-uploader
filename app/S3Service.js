import 'aws-sdk/dist/aws-sdk';
import bunyan from 'bunyan';

const log = bunyan.createLogger({ name: 'S3Service' });

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
    console.log(accessKey);
    this.s3 = new AWS.S3();
  };

  getBuckets () {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if (err) {
          log.error('Failed to fetch S3 buckets', err);
          return reject(err);
        } else {
          log.info('Buckets data fetched', data);
          return resolve(data);
        }
      });
    });
  }
}

export default S3Service;