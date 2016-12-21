const menubar = require('menubar');
const fs = require('fs');
const path = require('path');
const notifier = require('node-notifier');
const { ipcMain, clipboard, Menu } = require('electron');
const configService = require('./ConfigurationService');
const S3Service = require('./S3Service');

/**
 * Electron window high-level wrapped constructor.
 */
const mb = menubar({
  width: 400,
  height: 300,
});

let s3 = null;

/**
 * Sends data from main Electron process to renderer process.
 * Works only if window has been instantiated first.
 * @param thread
 * @param data
 */
const sendWebContentsMessage = (thread, data) => {
  if (mb.window !== undefined) {
    mb.window.webContents.send(thread, {
      data,
    });
  } else {
    console.warn('mb.window is not defined, sending message ignored...');
  }
};

/**
 * Sends OS-level native notification invoker
 * @param title
 * @param message
 */
const sendNotification = (title, message) => {
  notifier.notify({
    title,
    message,
  });
};

/**
 * S3.ManagedUpload high-level wrapper.
 *
 * Forwards EventEmitter events to IPC Bus to renderer process.
 * Sends notification if process fails or succeeds.
 * Automatically replaces clipboard contents with URL to file in AWS S3.
 *
 * @param uploadEventEmitter
 * @param file
 */
const handleUpload = (uploadEventEmitter, file) => {
  sendWebContentsMessage('UPLOAD_START', file);

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

/**
 * Function returns Promise resolved if supplied path is directory (contains files inside this
 * directory) or rejected if it's file.
 * @param file
 */
const checkForDirectory = (file) => new Promise((resolve, reject) => {
  fs.stat(file, (err, stats) => {
    if (err) {
      throw new Error(err);
    } else if (stats.isDirectory()) {
      fs.readdir(file, (error, files) => {
        if (err) {
          throw new Error(error);
        }
        return resolve(files.map((node) => path.join(file, node)));
      });
    } else {
      return reject();
    }
  });
});

/**
 * Reads file and passes it's binary data for upload.
 * @param file
 */
const readFileAndUpload = (file) => {
  fs.readFile(file, (err, data) => {
    if (err) throw new Error(err);
    handleUpload(s3.uploadFile(file.split('/').pop(), data), file);
  });
};

/**
 * Callback function for handling drop-files events.
 *
 * Takes array of files (directories) as argument and processes sequentially for upload.
 *
 * Fails if S3Service has been not initialized yet.
 * @param files
 */
const handleFiles = (files) => {
  if (s3 !== null) {
    files.forEach((file) => {
      checkForDirectory(file)
        .then((dirFiles) => handleFiles(dirFiles))
        .catch(() => readFileAndUpload(file));
    });
  } else {
    throw new Error('Client has been not initialized yet!');
  }
};

/**
 * MenuBar EventEmitter listener.
 *
 * Listens for window readiness and loads config from file.
 * If config is present, instantiates S3Service basing on that information.
 */
mb.on('ready', () => {
	const template = [{label: 'Edit', submenu: [{role: "paste"}]}];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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


/**
 * IPC EventEmitter listener.
 * Receiver of events from renderer process.
 */
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

ipcMain.on('DROP_FILES', (event, arg) => {
  handleFiles(arg.files);
});
