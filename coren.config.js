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
    index: './src/index.js',
    $vendor: ['react', 'react-dom', 'react-router']
  },
  webpack: {
    plugins: [
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
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `https://s3-ap-northeast-1.amazonaws.com/static.canner.io/coren-example/dist/${rel}`;
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
