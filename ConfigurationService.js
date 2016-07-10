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

  fs.writeFile(configFilePath, JSON.stringify({
    accessKey,
    secretKey,
    bucket,
    ACL,
    storageClass,
    encryption,
  }), {}, (err) => {
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
  saveConfig,
  loadConfig,
};
