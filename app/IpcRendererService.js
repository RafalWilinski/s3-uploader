const { ipcRenderer } = require('electron');

const requestBuckets = (accessKey, secretKey) => new Promise((resolve, reject) => {
  ipcRenderer.send('GET_BUCKETS', {
    accessKey,
    secretKey,
  });

  ipcRenderer.on('GET_BUCKETS_REPLY', (event, arg) => {
    if (arg.success) return resolve(arg.data);
    return reject(arg.error);
  });
});

const saveConfig = (config) => {
  ipcRenderer.send('UPDATE_CONFIG', config);
};

const listenForUploadEvents = (errorCallback, successCallback, progressCallback, startCallback) => {
  ipcRenderer.on('UPLOAD_SUCCESS', (event, arg) => {
    successCallback(arg);
  });

  ipcRenderer.on('UPLOAD_ERROR', (event, arg) => {
    errorCallback(arg);
  });

  ipcRenderer.on('UPLOAD_PROGRESS', (event, arg) => {
    progressCallback(arg);
  });

  ipcRenderer.on('UPLOAD_START', (event, arg) => {
    startCallback(arg);
  });
};

module.exports = {
  listenForUploadEvents,
  requestBuckets,
  saveConfig,
};
