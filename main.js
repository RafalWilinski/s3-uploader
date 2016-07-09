const menubar = require('menubar');

const mb = menubar({
  width: 400,
  height: 200,
});

const handleFiles = (files) => {

};

mb.on('ready', () => {
  mb.tray.on('drop-files', (files) => handleFiles(files));
});

