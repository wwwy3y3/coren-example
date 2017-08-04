const webpack = require('webpack');
const {HeadCollector, RoutesCollector} = require('coren');
const ImmutableReduxCollector = require('./server/immutableReduxCollector');
const getDB = require('./server/dummyApiDB');
const reducer = require('./lib/reducer');
const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
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
