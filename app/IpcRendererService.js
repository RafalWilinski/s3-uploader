const { ipcRenderer } = require('electron');

/**
 * IPC Renderer Service
 *
 * Service for communicating renderer process with main Electron process.
 */

/**
 * Send action via IPC to request S3 Buckets from AWS using provided credentials.
 * @param accessKey
 * @param secretKey
 */
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


/**
 * Send action via IPC to save configuration.
 * @param config
 */
const saveConfig = (config) => {
  ipcRenderer.send('UPDATE_CONFIG', config);
};


/**
 * Procedure which forwards upload events from IPC bus to renderer process callbacks.
 * @param errorCallback
 * @param successCallback
 * @param progressCallback
 * @param startCallback
 */
const subscribeUploadEvents = (errorCallback, successCallback, progressCallback, startCallback) => {
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
  subscribeUploadEvents,
  requestBuckets,
  saveConfig,
};
