const { ipcMain } = require('electron');
const S3Service = require('./S3Service');
const configService = require('ConfigurationService');

const asyncReply = 'asynchronous-reply';

ipcMain.on('asynchronous-message', (event, arg) => {
  switch (arg.action) {
    case 'GET_BUCKETS':
      const s3 = new S3Service(arg.accessKey, arg.secretKey);

      s3.getBuckets().then((data) => {
        event.sender.send(asyncReply, {
          success: true,
          data,
        });
      }).catch((error) => {
        event.sender.send(asyncReply, {
          success: false,
          error,
        });
      });
      break;
    case 'SAVE_CONFIG':
      configService.saveConfig(
        arg.accessKey,
        arg.secretKey,
        arg.bucket,
        arg.ACL,
        arg.storageClass,
        arg.encryption);
      break;
    default:
      console.warn('Unsupported IPC action!');
  }
});
