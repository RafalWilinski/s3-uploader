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
      }, {
        test: /\.json$/,
        loader: 'json'
      },
    ],
    noParse: [
      /aws\-sdk/,
    ]
  },
  node: {
    fs: "empty"
  },
  watchOptions: {
    poll: 1000,
  },
};
