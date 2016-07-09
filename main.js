const menubar = require('menubar');
const fs = require('fs');
const S3Service = require('./S3Service');

const mb = menubar({
  width: 400,
  height: 200,
});

let s3 = null;

const handleFiles = (files) => {
  if (s3 !== null) {
    files.forEach((file) => {
      fs.readFile(file, (err, data) => {
        if (err) throw new Error(err);
        s3.uploadFile(file.split('/').pop(), data);
      });
    });
  }
};

const setS3Context = (s3) => {
  this.s3 = s3;
};

mb.on('ready', () => {
  mb.tray.on('drop-files', (event, files) => handleFiles(files));
});

module.exports = {
  setS3Context
};
