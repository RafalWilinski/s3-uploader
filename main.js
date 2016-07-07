const menubar = require('menubar');

const mb = menubar({
  width: 400,
  height: 300,
});

mb.on('ready', () => {
  console.log('MenuBar is ready.');
});

console.log(Object.keys(mb));
console.log(mb.getOption('tray'));
console.log(Object.keys(mb.app));


mb.on('drop-files', (files) => {
  console.log(files);
});
