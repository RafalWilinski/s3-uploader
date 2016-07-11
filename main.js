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
  configService.loadConfig();
  
  mb.tray.on('drop-files', (event, files) => handleFiles(files));
});

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);
  switch (arg.action) {
    case 'GET_BUCKETS':
      s3 = new S3Service(arg.accessKey, arg.secretKey);

      s3.getBuckets().then((data) => {
        event.sender.send(asyncReply, {
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
