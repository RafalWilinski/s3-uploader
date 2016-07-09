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

const saveConfig = (accessKey, secretKey, bucket, ACL, storageClass, encryption) => {
  configuration.accessKey = accessKey;
  configuration.secretKey = secretKey;
  configuration.bucket = bucket;
  configuration.ACL = ACL;
  configuration.storageClass = storageClass;
  configuration.encryption = encryption;

  fs.writeFile(configFilePath, {
    accessKey,
    secretKey,
    bucket,
    ACL,
    storageClass,
    encryption
  }, {}, (err) => {
    if (err) console.error('Failed to save configuration.');
    console.log('Configuration saved.');
  });
};

const loadConfig = () => {
  fs.readFile(configFilePath, {}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      Object.assign(configuration, ...data);
      console.log("New config: " + configuration);
    }
  });
};

const getItem = (key) => {
  return configuration[key];
};

module.exports = {
  getItem,
  saveConfig,
  loadConfig,
};
