const menubar = require('menubar');
const fs = require('fs');
const configService = require('./ConfigurationService');
const { ipcMain } = require('electron');
const S3Service = require('./S3Service');

const mb = menubar({
  width: 400,
  height: 200,
});

let s3 = null;
const asyncReply = 'asynchronous-reply';

const handleFiles = (files) => {
  if (s3 !== null) {
    files.forEach((file) => {
      fs.readFile(file, (err, data) => {
        if (err) throw new Error(err);
        s3.uploadFile(file.split('/').pop(), data);
      });
    });
  }
};

mb.on('ready', () => {
  mb.tray.on('drop-files', (event, files) => handleFiles(files));
});

ipcMain.on('asynchronous-message', (event, arg) => {
  switch (arg.action) {
    case 'GET_BUCKETS':
      s3 = new S3Service(arg.accessKey, arg.secretKey);

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
      throw new Error('Unsupported IPC action');
  }
});
