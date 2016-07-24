const menubar = require('menubar');
const fs = require('fs');
const notifier = require('node-notifier');
const { ipcMain, clipboard } = require('electron');
const configService = require('./ConfigurationService');
const S3Service = require('./S3Service');

const mb = menubar({
  width: 400,
  height: 300,
});

let s3 = null;

const sendWebContentsMessage = (thread, data) => {
  if (mb.window !== undefined) {
    mb.window.webContents.send(thread, {
      data,
    });
  } else {
    console.warn('mb.window is not defined, sending message ignored...');
  }
};

const sendNotification = (title, message) => {
  notifier.notify({
    title,
    message,
  });
};

const handleUpload = (uploadEventEmitter, files) => {
  sendWebContentsMessage('UPLOAD_START', files);

  uploadEventEmitter.on('error', (error) => {
    sendNotification('Upload Error!', 'Click icon for more details...');
    sendWebContentsMessage('UPLOAD_ERROR', error);
  });

  uploadEventEmitter.on('progress', (data) => {
    sendWebContentsMessage('UPLOAD_PROGRESS', data);
  });

  uploadEventEmitter.on('success', (data) => {
    clipboard.writeText(data.Location);

    sendNotification('File Uploaded!', 'Link has been copied to clipboard');
    sendWebContentsMessage('UPLOAD_SUCCESS', data);
  });
};

const handleFiles = (files) => {
  if (s3 !== null) {
    files.forEach((file) => {
      fs.readFile(file, (err, data) => {
        if (err) throw new Error(err);
        handleUpload(s3.uploadFile(file.split('/').pop(), data), files);
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
