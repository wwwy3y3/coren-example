const path = require('path');
const getDB = require('./dummyApiDB');
const {
  App,
  MultiRoutesRenderer,
  HeadCollector,
  RoutesCollector
} = require('coren');
const ImmutableReduxCollector = require('./immutableReduxCollector');
const reducer = require('../lib/reducer');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const mkdirp = require('mkdirp');

getDB().then(db => {
  const app = new App({
    path: path.resolve(__dirname, '../lib')
  });
  // register collectors
  app.registerCollector("head", new HeadCollector());
  app.registerCollector("routes", new RoutesCollector({
    componentProps: {
      db
    }
  }));
  app.registerCollector("redux", new ImmutableReduxCollector({
    componentProps: {
      db
    },
    reducers: reducer
  }));

  // ssr
  const ssr = new MultiRoutesRenderer({
    app,
    js: ["/bundle.js"]
  });

  // get the array of html result
  ssr.renderToString()
  .then(results => {
    return Promise.all(results.map(result => {
      const filepath = path.join(__dirname, '../public', getPath(result.route));
      mkdirp.sync(path.resolve(filepath, "../"));

      // write to filesystem
      return fs.writeFileAsync(filepath, result.html);
    }));
  })
  .catch(err => console.log(err));
});

function getPath(route) {
  return `${route}/index.html`;
}
