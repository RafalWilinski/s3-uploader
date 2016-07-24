const fs = require('fs');
/**
 * Default file path where credentials will be stored.
 * @type {string}
 */
const configFilePath = './.awscredentials.json';

/**
 * Encoding used while reading persistent storage.
 * @type {string}
 */
const defaultEncoding = 'utf-8';

/**
 * Initial Configuration.
 * @type {{accessKey: string, secretKey: string, bucket: string, ACL: string, storageClass: string,
 * encryption: boolean}}
 */
const configuration = {
  accessKey: '',
  secretKey: '',
  bucket: '',
  ACL: '',
  storageClass: '',
  encryption: false,
};

/**
 * Merges old config with provided one. Saves changes to persistent storage.
 * @param newConfig
 */
const updateConfig = (newConfig) => {
  Object.assign(configuration, newConfig);

  fs.writeFile(configFilePath, JSON.stringify(configuration), {}, (err) => {
    if (err) throw new Error(err);
  });
};

/**
 * Loads configuration from persistent storage if it's possible.
 */
const loadConfig = () => new Promise((resolve, reject) => {
  fs.readFile(configFilePath, defaultEncoding, (err, data) => {
    if (err) {
      return reject(err);
    }

    Object.assign(configuration, JSON.parse(data));
    return resolve(configuration);
  });
});

/**
 * Returns value for given key from configuration directory. Fast, in-memory function (fs not used).
 * @param key
 */
const getItem = (key) => configuration[key];

module.exports = {
  getItem,
  updateConfig,
  loadConfig,
};
