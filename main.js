const menubar = require('menubar');
const fs = require('fs');
const { ipcMain } = require('electron');
const configService = require('./ConfigurationService');
const S3Service = require('./S3Service');

const mb = menubar({
  width: 400,
  height: 200,
});

const ASYNC_REPLY = 'asynchronous-reply';
const ASYNC_MESSAGE = 'asynchronous-message';

let s3 = null;

const handleFiles = (files) => {
  if (s3 !== null) {
    files.forEach((file) => {
      fs.readFile(file, (err, data) => {
        if (err) throw new Error(err);
        s3.uploadFile(file.split('/').pop(), data);
      });
    });
  } else {
    throw new Error('Client has been not initialized yet!');
  }
};

mb.on('ready', () => {
  configService.loadConfig()
    .then((config) => {
      if (config.bucket !== null) {
        s3 = new S3Service(config.accessKey, config.secretKey);
      } else {
        throw new Error('Not ready for uploading, please configure tool first.');
      }
    })
    .catch(() => {
      throw new Error('Error while loading configuration');
    });
  mb.tray.on('drop-files', (event, files) => handleFiles(files));
});

ipcMain.on(ASYNC_MESSAGE, (event, arg) => {
  switch (arg.action) {
    case 'GET_BUCKETS':
      s3 = new S3Service(arg.accessKey, arg.secretKey);

      s3.getBuckets().then((data) => {
        event.sender.send(ASYNC_REPLY, {
          success: true,
          data,
        });

        arg.action = undefined;
        configService.updateConfig(arg);
      }).catch((error) => {
        event.sender.send(asyncReply, {
          success: false,
          error,
        });
      });
      break;
    case 'UPDATE_CONFIG':
      // Delete action property for serialization needs
      arg.action = undefined;

      configService.updateConfig(arg);
      break;
    default:
      throw new Error('Unsupported IPC action');
  }
});
