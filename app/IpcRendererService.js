const { ipcRenderer } = require('electron');

const ASYNC_MESSAGE = 'asynchronous-message';
const ASYNC_REPLY = 'asynchronous-reply';

const ACTION_GET_BUCKETS = 'GET_BUCKETS';
const ACTION_UPDATE_CONFIG = 'UPDATE_CONFIG';

const requestBuckets = (accessKey, secretKey) => new Promise((resolve, reject) => {
  ipcRenderer.send(ASYNC_MESSAGE, {
    action: ACTION_GET_BUCKETS,
    accessKey,
    secretKey,
  });

  ipcRenderer.on(ASYNC_REPLY, (event, arg) => {
    if (arg.success) return resolve(arg.data);
    return reject(arg.error);
  });
});

const saveConfig = (config) => new Promise((resolve, reject) => {
  const data = Object.assign(config, {
    action: ACTION_UPDATE_CONFIG
  });

  ipcRenderer.send(ASYNC_MESSAGE, data);

  ipcRenderer.on(ASYNC_REPLY, (event, arg) => {
    if (arg.success) return resolve(arg);
    return reject(arg.error);
  });
});

module.exports = {
  requestBuckets,
  saveConfig,
};
