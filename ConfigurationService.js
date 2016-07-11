const fs = require('fs');
const configFilePath = './.awscredentials.json';

const configuration = {
  accessKey: '',
  secretKey: '',
  bucket: '',
  ACL: '',
  storageClass: '',
  encryption: false,
};

const updateConfig = (newConfig) => {
  Object.assign(configuration, newConfig);

  fs.writeFile(configFilePath, JSON.stringify(configuration), {}, (err) => {
    if (err) throw new Error(err);
  });
};

const loadConfig = () => new Promise((resolve, reject) => {
  fs.readFile(configFilePath, 'utf-8', (err, data) => {
    if (err) {
      return reject(err);
    }

    Object.assign(configuration, JSON.parse(data));
    return resolve(configuration);
  });
});

const getItem = (key) => configuration[key];

module.exports = {
  getItem,
  updateConfig,
  loadConfig,
};
