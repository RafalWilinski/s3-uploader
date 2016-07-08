const menubar = require('menubar');
const fs = require('fs');

const mb = menubar({
  width: 400,
  height: 200,
});

const handleFiles = (files) => {
  files.forEach((filePath) => {

  });
};

mb.on('ready', () => {
  mb.tray.on('drop-files', (files) => handleFiles(files));
});

