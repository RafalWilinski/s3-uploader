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

const loadConfig = () => {
  fs.readFile(configFilePath, {}, (err, data) => {
    if (err) {
      throw new Error(err);
    } else {
      Object.assign(configuration, ...data);
    }
  });
};

const getItem = (key) => configuration[key];

module.exports = {
  getItem,
  updateConfig,
  loadConfig,
};
