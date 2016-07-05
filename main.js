const menubar = require('menubar');
const mb = menubar({
  width: 400,
  height: 300
});

require('electron-debug')({showDevTools: true});

mb.on('ready', () => {

});


