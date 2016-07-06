const menubar = require('menubar');
const {app, Tray} = require('electron');
require('electron-debug')({showDevTools: true});

app.on('ready', () => {
  const tray = new Tray('./public/icon.png');
  const mb = menubar({
    width: 400,
    height: 300,
    tray
  });

  tray.on('drop-files', (event, files) => {
    console.log(event);
    console.log(files);
  });
});