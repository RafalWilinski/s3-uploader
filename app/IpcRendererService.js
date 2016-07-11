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

module.exports = {
  requestBuckets,
  saveConfig,
};
