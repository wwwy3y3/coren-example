const path = require('path');
const getDB = require('./dummyApiDB');
const {
  CollectorManager,
  MultiRoutesRenderer,
  HeadCollector,
  RoutesCollector
} = require('@canner/render');
const ImmutableReduxCollector = require('./immutableReduxCollector');
const reducer = require('../lib/reducer');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const mkdirp = require('mkdirp');

getDB().then(db => {
  const collectorManager = new CollectorManager({
    appPath: path.resolve(__dirname, '../lib')
  });
  collectorManager.registerCollector("head", new HeadCollector());
  collectorManager.registerCollector("routes", new RoutesCollector({
    componentProps: {
      db
    }
  }));
  collectorManager.registerCollector("redux", new ImmutableReduxCollector({
    componentProps: {
      db
    },
    reducers: reducer
  }));
  const ssr = new MultiRoutesRenderer({
    collectorManager,
    js: ["/bundle.js"]
  });
  ssr.renderToString()
  .then(results => {
    return Promise.all(results.map(result => {
      const filepath = path.join(__dirname, '../public', getPath(result.route));
      mkdirp.sync(path.resolve(filepath, "../"));
      return fs.writeFileAsync(filepath, result.html);
    }));
  })
  .catch(err => console.log(err));
});

function getPath(route) {
  return `${route}/index.html`;
}
