const webpack = require('webpack');
const {HeadCollector, RoutesCollector} = require('coren');
const ImmutableReduxCollector = require('./server/immutableReduxCollector');
const getDB = require('./server/dummyApiDB');
const reducer = require('./lib/reducer');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});
module.exports = {
  entry: {
    index: './src/index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date()),
      extractCSS
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: extractCSS.extract(["css-loader?minimize"])
        }
      ]
    }
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/coren-build/assets`, absolutePath);
    switch (env) {
      case 'production':
        return 'https://s3-path/' + absolutePath;
      case 'development':
      case 'pre-production':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  },
  registerCollector: function(app, {context}) {
    app.registerCollector("head", new HeadCollector());
    app.registerCollector("routes", new RoutesCollector({
      componentProps: {db: context.db}
    }));
    app.registerCollector("redux", new ImmutableReduxCollector({
      componentProps: {db: context.db},
      reducers: reducer,
      configureStore: path.resolve(__dirname, './src/configureStore')
    }));
    return app;
  },
  prepareContext: function() {
    return getDB().then(db => ({db}));
  }
};
