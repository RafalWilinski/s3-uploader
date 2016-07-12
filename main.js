const menubar = require('menubar');
const fs = require('fs');
const { ipcMain, clipboard } = require('electron');
const configService = require('./ConfigurationService');
const S3Service = require('./S3Service');
const notifier = require('node-notifier');

const mb = menubar({
  width: 400,
  height: 200,
});

let s3 = null;

const handleUpload = (uploadEventEmitter) => {
  uploadEventEmitter.on('error', (error) => {
    notifier.notify({
      title: 'Upload Error!',
      message: 'Click icon to see more details...',
    });

    mb.window.webContents.send('UPLOAD_ERROR', {
      error,
    });
  });

  uploadEventEmitter.on('progress', (data) => {
    mb.window.webContents.send('UPLOAD_PROGRESS', {
      data,
    });
  });

  uploadEventEmitter.on('success', (data) => {
    clipboard.writeText(data.Location);

    notifier.notify({
      title: 'File uploaded!',
      message: 'Link has been saved to clipboard',
    });
  });
};

const handleFiles = (files) => {
  if (s3 !== null) {
    files.forEach((file) => {
      fs.readFile(file, (err, data) => {
        if (err) throw new Error(err);
        handleUpload(s3.uploadFile(file.split('/').pop(), data));
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

ipcMain.on('GET_BUCKETS', (event, arg) => {
  s3 = new S3Service(arg.accessKey, arg.secretKey);

  s3.getBuckets().then((data) => {
    event.sender.send('GET_BUCKETS_REPLY', {
      success: true,
      data,
    });

    configService.updateConfig(arg);
  }).catch((error) => {
    event.sender.send('GET_BUCKETS_REPLY', {
      success: false,
      error,
    });
  });
});

ipcMain.on('UPDATE_CONFIG', (event, arg) => {
  configService.updateConfig(arg);
});
