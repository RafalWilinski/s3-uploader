const { ipcRenderer } = require('electron');

const requestBuckets = (accessKey, secretKey) => new Promise((resolve, reject) => {
  ipcRenderer.send('asynchronous-message', {
    action: 'GET_BUCKETS',
    accessKey,
    secretKey
  });

  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    if (arg.success) return resolve(arg.data);
    else return reject(arg.error);
  });
});

module.exports = {
  requestBuckets
};
