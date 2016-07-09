const menubar = require('menubar');
const { ipcMain } = require('electron');
const S3Service = require('./S3Service');

const asyncReply = 'asynchronous-reply';

let s3 = null;
const mb = menubar({
  width: 400,
  height: 200,
});

ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg.action === 'GET_BUCKETS') {
    s3 = new S3Service(arg.accessKey, arg.secretKey);

    s3.getBuckets().then((data) => {
      event.sender.send(asyncReply, {
        success: true,
        data
      });
    }).catch((error) => {
      event.sender.send(asyncReply, {
        success: false,
        error
      });
    });
  }
});

const handleFiles = (files) => {

};

mb.on('ready', () => {
  mb.tray.on('drop-files', (files) => handleFiles(files));
});

