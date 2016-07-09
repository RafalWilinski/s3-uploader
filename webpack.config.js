const webpack = require('webpack');

module.exports = {
  entry: [
    './app/index.jsx',
  ],
  output: {
    filename: 'public/bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      }, {
        test: /\.scss?$/,
        exclude: /(node_modules)/,
        loader: 'style!css!sass',
      }
    ],
    noParse: [
      /aws\-sdk/,
    ]
  },

  watchOptions: {
    poll: 1000,
  },
  plugins: [
    new webpack.ExternalsPlugin('commonjs', [
      'desktop-capturer',
      'electron-prebuilt',
      'electron',
      'ipc',
      'ipc-renderer',
      'native-image',
      'remote',
      'web-frame',
      'clipboard',
      'crash-reporter',
      'screen',
      'shell'
    ])
  ]
};
